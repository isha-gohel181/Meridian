/** In-process TTL cache (replaces Redis for entity read-through caching). */

const memoryStore = new Map();

const isExpired = (entry) => entry && entry.expiresAt != null && entry.expiresAt <= Date.now();

const getEntryValue = (key) => {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (isExpired(entry)) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
};

const setEntry = (key, val, ttlSeconds) => {
  const value = typeof val === "object" ? JSON.stringify(val) : String(val);
  const expiresAt =
    ttlSeconds != null && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
  memoryStore.set(key, { value, expiresAt });
  return "OK";
};

const matchKeys = (pattern = "*") => {
  const regex = new RegExp("^" + String(pattern).replace(/\*/g, ".*") + "$");
  const keys = [];
  for (const k of memoryStore.keys()) {
    if (regex.test(k) && getEntryValue(k) !== null) keys.push(k);
  }
  return keys;
};

const memoryCacheClient = {
  isOpen: true,
  isReady: true,
  get: async (key) => getEntryValue(key),
  set: async (key, val, options) => {
    const ttl = options?.EX ?? options?.ex;
    return setEntry(key, val, ttl);
  },
  setEx: async (key, seconds, val) => setEntry(key, val, seconds),
  del: async (key) => {
    if (typeof key === "string" && key.includes("*")) {
      const regex = new RegExp("^" + key.replace(/\*/g, ".*") + "$");
      let count = 0;
      for (const k of [...memoryStore.keys()]) {
        if (regex.test(k)) {
          memoryStore.delete(k);
          count++;
        }
      }
      return count;
    }
    return memoryStore.delete(key) ? 1 : 0;
  },
  keys: async (pattern = "*") => matchKeys(pattern),
  exists: async (key) => (getEntryValue(key) != null ? 1 : 0),
  incr: async (key) => {
    const current = Number(getEntryValue(key)) || 0;
    const next = current + 1;
    const entry = memoryStore.get(key);
    const expiresAt = entry?.expiresAt ?? null;
    memoryStore.set(key, { value: String(next), expiresAt });
    return next;
  },
  expire: async (key, seconds) => {
    const entry = memoryStore.get(key);
    if (!entry) return 0;
    entry.expiresAt = Date.now() + seconds * 1000;
    return 1;
  },
  zAdd: async () => 1,
  zRangeByScore: async () => [],
  zRemRangeByScore: async () => 0,
  disconnect: async () => {},
  quit: async () => {},
};

export const safeCacheProxy = new Proxy(memoryCacheClient, {
  get(target, prop) {
    if (prop === "then" || prop === "catch" || prop === "finally") {
      return undefined;
    }
    if (prop in target) {
      return target[prop];
    }
    return async () => null;
  },
});

let cacheReady = false;

export const getMemoryCache = async () => {
  if (!cacheReady) {
    console.log("⚡ [CACHE] Using in-memory cache for entity read-through caching.");
    cacheReady = true;
  }
  return safeCacheProxy;
};
