/* eslint-disable no-restricted-globals */

const CACHE_VERSION = "v1";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const STORIES_CACHE = `stories-${CACHE_VERSION}`;

const APP_SHELL_URLS = [
  "./",
  "./index.html",
  "./scripts/index.js",
  "./styles/styles.css",
  "./favicon.png",
  "./manifest.webmanifest",
  "./images/logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL_CACHE);
      await cache.addAll(APP_SHELL_URLS);
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (![APP_SHELL_CACHE, STORIES_CACHE].includes(key))
            return caches.delete(key);
          return Promise.resolve();
        }),
      );
      self.clients.claim();
    })(),
  );
});

function safeJsonParse(input) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

self.addEventListener("push", (event) => {
  const raw = event.data ? event.data.text() : "";
  const data = safeJsonParse(raw) || {};

  // Konten notifikasi yang dapat dikustomisasi
  const title = data.title || "Cerita Baru";
  const icon = data.icon || "./images/logo.png";
  const badge = data.badge || "./images/logo.png";
  const message = data.message || data.body || "Ada cerita baru untukmu.";
  const tag = data.tag || "storyapp";
  const vibrate = data.vibrate || [100, 50, 100];
  const sound = data.sound || undefined;

  // Data payload untuk navigation saat user click
  const payload = {
    ...(data.storyId ? { storyId: data.storyId } : {}),
    ...(data.id ? { storyId: data.id } : {}),
    ...(data.lat ? { lat: data.lat, lon: data.lon } : {}),
    ...(data.route ? { route: data.route } : {}),
    timestamp: new Date().toISOString(),
  };

  const notificationOptions = {
    body: message,
    icon,
    badge,
    tag,
    vibrate,
    data: payload,
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      {
        action: "open",
        title: "Buka",
      },
      {
        action: "close",
        title: "Tutup",
      },
    ],
  };

  if (sound) {
    notificationOptions.sound = sound;
  }

  event.waitUntil(
    self.registration.showNotification(title, notificationOptions),
  );
});

self.addEventListener("notificationclick", (event) => {
  // Handle action button clicks
  if (event.action === "close") {
    event.notification.close();
    return;
  }

  event.notification.close();

  const data = event.notification.data || {};
  const targetUrl =
    data.route ||
    (data.storyId ? `/#/story/${encodeURIComponent(data.storyId)}` : `/#/`);

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const client = allClients[0];

      if (client) {
        await client.focus();
        client.postMessage({ type: "NAVIGATE", url: targetUrl });
        return;
      }

      await self.clients.openWindow(targetUrl);
    })(),
  );
});

self.addEventListener("notificationclose", (event) => {
  // Handle notification close/dismiss for analytics if needed
  console.log("Notifikasi ditutup:", event.notification.tag);
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const isGetStories =
    req.method === "GET" && url.pathname.includes("/stories");

  // Network First Strategy untuk API (khususnya stories)
  // Coba network dulu, jika gagal gunakan cache
  if (isGetStories) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STORIES_CACHE);

        try {
          const fresh = await fetch(req);
          // Jika berhasil, simpan ke cache dan return
          if (fresh.ok) {
            cache.put(req, fresh.clone()).catch(() => {});
            return fresh;
          }
          // Jika status tidak OK tapi ada response, cek cache
          const cached = await cache.match(req);
          return cached || fresh;
        } catch (error) {
          // Network gagal, gunakan cache
          const cached = await cache.match(req);
          if (cached) return cached;

          // Jika tidak ada cache, return empty stories response
          return new Response(JSON.stringify({ listStory: [] }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
        }
      })(),
    );
    return;
  }

  // Cache First Strategy untuk static assets (scripts, styles, images, etc)
  // Gunakan cache terlebih dahulu, jika tidak ada fetch dari network
  if (
    req.method === "GET" &&
    (req.destination === "script" ||
      req.destination === "style" ||
      req.destination === "document" ||
      req.destination === "image" ||
      req.destination === "manifest" ||
      req.destination === "font")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(APP_SHELL_CACHE);
        const cached = await cache.match(req);

        // Return cache jika ada
        if (cached) return cached;

        // Fetch dari network jika cache tidak ada
        try {
          const fresh = await fetch(req);
          if (fresh.ok) {
            // Simpan ke cache untuk digunakan kemudian
            cache.put(req, fresh.clone()).catch(() => {});
          }
          return fresh;
        } catch (error) {
          // Network gagal dan cache kosong, return fallback
          return new Response("", { status: 200 });
        }
      })(),
    );
    return;
  }

  // Pass-through untuk request lainnya
  event.respondWith(fetch(req));
});
