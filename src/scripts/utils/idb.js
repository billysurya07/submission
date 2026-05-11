// Lightweight IndexedDB helper (no external deps)

const DB_NAME = "storyapp-db";
const DB_VERSION = 1;

const STORES = {
  STORIES: "stories",
  QUEUE: "sync-queue",
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORES.STORIES)) {
        const store = db.createObjectStore(STORES.STORIES, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("lat", "lat", { unique: false });
        store.createIndex("lon", "lon", { unique: false });
        store.createIndex("name", "name", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.QUEUE)) {
        // Queue items have autoIncrement so we can keep insertion order
        db.createObjectStore(STORES.QUEUE, {
          keyPath: "queueId",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(db, storeName, mode) {
  return db.transaction(storeName, mode).objectStore(storeName);
}

function promisifyRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function toSearchableString(story) {
  return `${story.name || ""} ${story.description || ""}`.toLowerCase();
}

export async function idbPutStory(story) {
  const db = await openDB();
  const store = tx(db, STORES.STORIES, "readwrite");
  await promisifyRequest(store.put(story));
  db.close();
  return story;
}

export async function idbGetAllStories() {
  const db = await openDB();
  const store = tx(db, STORES.STORIES, "readonly");
  const request = store.getAll();
  const result = await promisifyRequest(request);
  db.close();
  return result || [];
}

export async function idbDeleteStory(id) {
  const db = await openDB();
  const store = tx(db, STORES.STORIES, "readwrite");
  await promisifyRequest(store.delete(id));
  db.close();
}

export async function idbClearAllStories() {
  const db = await openDB();
  const store = tx(db, STORES.STORIES, "readwrite");
  await promisifyRequest(store.clear());
  db.close();
}

export async function idbQueueEnqueue(item) {
  const db = await openDB();
  const store = tx(db, STORES.QUEUE, "readwrite");
  const queued = await promisifyRequest(store.add(item));
  db.close();
  return queued;
}

export async function idbQueueGetAll() {
  const db = await openDB();
  const store = tx(db, STORES.QUEUE, "readonly");
  const result = await promisifyRequest(store.getAll());
  db.close();
  return result || [];
}

export async function idbQueueDelete(queueId) {
  const db = await openDB();
  const store = tx(db, STORES.QUEUE, "readwrite");
  await promisifyRequest(store.delete(queueId));
  db.close();
}

export function filterStories(
  stories,
  { query = "", location = null, sort = "latest" } = {},
) {
  const q = (query || "").trim().toLowerCase();

  let filtered = stories;

  if (location) {
    filtered = filtered.filter(
      (s) => s.lat === location.lat && s.lon === location.lon,
    );
  }

  if (q) {
    filtered = filtered.filter((s) => toSearchableString(s).includes(q));
  }

  if (sort === "name") {
    filtered = [...filtered].sort((a, b) =>
      (a.name || "").localeCompare(b.name || ""),
    );
  } else if (sort === "oldest") {
    filtered = [...filtered].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    );
  } else {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  }

  return filtered;
}
