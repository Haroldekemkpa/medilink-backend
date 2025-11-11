import { createClient } from "redis";

let client;

try {
  client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });
  await client.connect();
  console.log("✅ Redis connected");
} catch (error) {
  console.error("⚠️ Redis not connected, fallback to memory cache");
  client = null;
}

const memoryCache = new Map();

export async function cacheSet(key, value, ttl = 3600) {
  if (client) {
    await client.setEx(key, ttl, value);
  } else {
    memoryCache.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
  }
}

export async function cacheGet(key) {
  if (client) {
    return await client.get(key);
  } else {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value;
  }
}
