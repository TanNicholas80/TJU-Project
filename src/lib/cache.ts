import { Redis } from "@upstash/redis";

// In-memory fallback cache
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

let redisClient: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else if (process.env.REDIS_URL && process.env.REDIS_URL.startsWith("http")) {
    redisClient = Redis.fromEnv();
  }
} catch (error) {
  console.warn("Upstash Redis initialization skipped or failed, falling back to memory cache:", error);
  redisClient = null;
}

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || "300", 10);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (redisClient) {
      try {
        const data = await redisClient.get<T>(key);
        if (data !== null && data !== undefined) {
          return data;
        }
      } catch (err) {
        console.warn(`[Cache] Redis GET failed for key "${key}", falling back to memory:`, err);
      }
    }

    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return item.value as T;
  },

  async set<T>(key: string, value: T, ttlSeconds: number = DEFAULT_TTL): Promise<void> {
    if (redisClient) {
      try {
        await redisClient.set(key, value, { ex: ttlSeconds });
      } catch (err) {
        console.warn(`[Cache] Redis SET failed for key "${key}", falling back to memory:`, err);
      }
    }

    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  async del(key: string): Promise<void> {
    if (redisClient) {
      try {
        await redisClient.del(key);
      } catch (err) {
        console.warn(`[Cache] Redis DEL failed for key "${key}":`, err);
      }
    }
    memoryCache.delete(key);
  },

  async delByPrefix(prefix: string): Promise<void> {
    if (redisClient) {
      try {
        const keys = await redisClient.keys(`${prefix}*`);
        if (keys && keys.length > 0) {
          await redisClient.del(...keys);
        }
      } catch (err) {
        console.warn(`[Cache] Redis keys prefix DEL failed for "${prefix}":`, err);
      }
    }

    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  },

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = DEFAULT_TTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    const fresh = await fetchFn();
    await this.set<T>(key, fresh, ttlSeconds);
    return fresh;
  },
};
