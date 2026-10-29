import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient = null;
let isConnecting = false;
let redisDisabled = false;

// In-memory fallback store so controllers never crash when Redis is offline
const memoryStore = new Map();

const mockRedisClient = {
  isOpen: true,
  isReady: true,
  get: async (key) => memoryStore.get(key) || null,
  set: async (key, val) => {
    memoryStore.set(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
    return 'OK';
  },
  setEx: async (key, seconds, val) => {
    memoryStore.set(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
    return 'OK';
  },
  del: async (key) => {
    if (typeof key === 'string' && key.includes('*')) {
      const regex = new RegExp('^' + key.replace(/\*/g, '.*') + '$');
      for (const k of memoryStore.keys()) {
        if (regex.test(k)) memoryStore.delete(k);
      }
      return 1;
    }
    return memoryStore.delete(key) ? 1 : 0;
  },
  keys: async (pattern = '*') => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return Array.from(memoryStore.keys()).filter((k) => regex.test(k));
  },
  exists: async (key) => (memoryStore.has(key) ? 1 : 0),
  incr: async (key) => {
    const val = (Number(memoryStore.get(key)) || 0) + 1;
    memoryStore.set(key, String(val));
    return val;
  },
  expire: async () => 1,
  zAdd: async () => 1,
  zRangeByScore: async () => [],
  zRemRangeByScore: async () => 0,
  disconnect: async () => {},
  quit: async () => {},
};

// Safe proxy so ANY unexpected Redis command resolves gracefully without crashing
const safeRedisProxy = new Proxy(mockRedisClient, {
  get(target, prop) {
    // Never expose then/catch/finally — otherwise this proxy is treated as a
    // thenable and `await initRedis()` (async return) never completes.
    if (prop === "then" || prop === "catch" || prop === "finally") {
      return undefined;
    }
    if (prop in target) {
      return target[prop];
    }
    // Any other dynamic Redis command returns a no-op resolved promise
    return async (...args) => null;
  },
});

export const isRedisEnabled = () => {
  const envVal = String(process.env.REDIS_ENABLED || 'false').toLowerCase().trim();
  return envVal === 'true' || envVal === '1';
};

const initRedis = async () => {
  if (!isRedisEnabled()) {
    if (!redisDisabled) {
      console.log('⚡ [REDIS] Redis disabled by config (REDIS_ENABLED=false). Using in-memory fallback cache.');
      redisDisabled = true;
    }
    return safeRedisProxy;
  }

  if (redisDisabled) return safeRedisProxy;
  if (redisClient && redisClient.isOpen) return redisClient;
  if (isConnecting) return safeRedisProxy;

  try {
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
      console.warn('⚠️ [REDIS] REDIS_HOST or REDIS_PORT not set. Using in-memory fallback cache.');
      redisDisabled = true;
      return safeRedisProxy;
    }

    isConnecting = true;
    console.log(`🔌 [REDIS] Connecting to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}...`);
    const client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        connectTimeout: 2000,
        reconnectStrategy: (retries) => {
          if (retries > 2) {
            console.warn('⚠️ [REDIS] Host unreachable after 2 attempts. Using in-memory fallback cache.');
            redisDisabled = true;
            return false; // Stop reconnecting
          }
          return 1000;
        },
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    client.on('error', () => {
      // Avoid unhandled error events
    });

    await client.connect();
    redisClient = client;
    isConnecting = false;
    console.log('✅ [REDIS] Connected successfully to Redis server!');
    return redisClient;
  } catch (err) {
    isConnecting = false;
    redisDisabled = true;
    console.warn('⚠️ [REDIS] Connection failed. Using in-memory fallback cache:', err.message);
    return safeRedisProxy;
  }
};

export { initRedis, redisClient, safeRedisProxy };
