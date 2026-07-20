/**
 * Enterprise Cache Service
 * Supports Redis cache connection with automatic in-memory fallback.
 */

class InMemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiry });
  }

  del(key) {
    this.store.delete(key);
  }

  flush() {
    this.store.clear();
  }
}

class CacheService {
  constructor() {
    this.fallback = new InMemoryCache();
    this.redis = null;
    this.isRedisReady = false;
    this.initRedis();
  }

  async initRedis() {
    const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST;
    if (redisUrl) {
      try {
        const { default: Redis } = await import('ioredis');
        this.redis = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          connectTimeout: 2000,
        });

        this.redis.on('connect', () => {
          this.isRedisReady = true;
          console.log('[CacheService] Connected to Redis successfully');
        });

        this.redis.on('error', (err) => {
          this.isRedisReady = false;
          console.warn('[CacheService] Redis error, using in-memory cache fallback:', err.message);
        });

        await this.redis.connect().catch(() => {
          this.isRedisReady = false;
        });
      } catch (err) {
        console.warn('[CacheService] ioredis not available or failed to load. Operating in In-Memory Cache mode.');
      }
    } else {
      console.log('[CacheService] No REDIS_URL configured. Operating in In-Memory Cache mode.');
    }
  }

  async get(key) {
    if (this.isRedisReady && this.redis) {
      try {
        const raw = await this.redis.get(key);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        return this.fallback.get(key);
      }
    }
    return this.fallback.get(key);
  }

  async set(key, value, ttlSeconds = 300) {
    if (this.isRedisReady && this.redis) {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      } catch (err) {
        this.fallback.set(key, value, ttlSeconds);
      }
    } else {
      this.fallback.set(key, value, ttlSeconds);
    }
  }

  async del(key) {
    if (this.isRedisReady && this.redis) {
      try {
        await this.redis.del(key);
      } catch (err) {
        this.fallback.del(key);
      }
    }
    this.fallback.del(key);
  }

  async flush() {
    if (this.isRedisReady && this.redis) {
      try {
        await this.redis.flushdb();
      } catch (err) {
        this.fallback.flush();
      }
    }
    this.fallback.flush();
  }
}

export const cacheService = new CacheService();
export default cacheService;
