/* eslint-disable no-restricted-globals */

const CACHE_VERSION = "v1";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;

// Nama cache runtime untuk API stories
const STORIES_CACHE = `stories-${CACHE_VERSION}`;

const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/scripts/index.js",
  "/styles/styles.css",
  "/favicon.png",
  "/public/images/logo.png",
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

  const title = data.title || "Cerita Baru";
  const icon = data.icon || "/public/images/logo.png";
  const message = data.message || data.body || "Ada cerita baru untukmu.";
  const tag = data.tag || "storyapp";

  const payload = {
    // jangan simpan terlalu banyak, tapi cukup untuk navigasi
    ...(data.storyId ? { storyId: data.storyId } : {}),
    ...(data.id ? { storyId: data.id } : {}),
    ...(data.lat ? { lat: data.lat, lon: data.lon } : {}),
    ...(data.route ? { route: data.route } : {}),
  };

  const notificationOptions = {
    body: message,
    icon,
    tag,
    data: payload,
    // basic behavior; additional UX via notificationclick
  };

  event.waitUntil(
    self.registration.showNotification(title, notificationOptions),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  // Advanced: support route navigation
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

      // Prefer focusing existing tab
      if (client) {
        await client.focus();
        client.postMessage({ type: "NAVIGATE", url: targetUrl });
        return;
      }

      await self.clients.openWindow(targetUrl);
    })(),
  );
});

// Fetch strategy
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // GET stories: cache-first with network fallback to cache (simple & reliable)
  const url = new URL(req.url);
  const isGetStories =
    req.method === "GET" && url.pathname.includes("/stories");

  if (isGetStories) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STORIES_CACHE);

        try {
          const fresh = await fetch(req);
          cache.put(req, fresh.clone()).catch(() => {});
          return fresh;
        } catch {
          const cached = await cache.match(req);
          if (cached) return cached;
          // fallback minimal
          return new Response(JSON.stringify({ listStory: [] }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
        }
      })(),
    );
    return;
  }

  // App shell: stale-while-revalidate for same-origin HTML/JS/CSS
  if (
    req.method === "GET" &&
    (req.destination === "script" ||
      req.destination === "style" ||
      req.destination === "document" ||
      req.destination === "image")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(APP_SHELL_CACHE);
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            cache.put(req, res.clone()).catch(() => {});
            return res;
          })
          .catch(() => null);

        return (
          cached || (await fetchPromise) || new Response("", { status: 200 })
        );
      })(),
    );
  }
});
