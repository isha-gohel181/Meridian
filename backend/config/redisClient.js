import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient = null;
let isConnecting = false;
let redisDisabled = false;

const initRedis = async () => {
  if (redisDisabled) return null;
  if (redisClient && redisClient.isOpen) return redisClient;
  if (isConnecting) return null;

  try {
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
      redisDisabled = true;
      return null;
    }

    isConnecting = true;
    const client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        connectTimeout: 1000,
        reconnectStrategy: (retries) => {
          if (retries > 2) {
            console.warn('⚠️ [REDIS] Host unreachable after 2 attempts. Continuing with in-memory fallback.');
            redisDisabled = true;
            return false; // Stop reconnecting
          }
          return 1000;
        }
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    client.on('error', (err) => {
      // Avoid spamming unhandled error events
    });

    await client.connect();
    redisClient = client;
    isConnecting = false;
    return redisClient;
  } catch (err) {
    isConnecting = false;
    console.warn('⚠️ [REDIS] Connection failed, continuing without Redis cache:', err.message);
    return null;
  }
};

export { initRedis, redisClient };
