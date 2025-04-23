const RATE_LIMIT_WINDOW = 60 * 1000; // نافذة زمنية: 60 ثانية
const MAX_REQUESTS = 25;             // الحد الأقصى للطلبات لكل IP
const MAX_CACHE_SIZE = 300;          // الحد الأقصى لحجم الكاش

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

// استخدم Map بدل object
const rateLimitCache = new Map<string, RateLimitEntry>();

let cleanupInterval = RATE_LIMIT_WINDOW * 3;
let cleanupTimer: NodeJS.Timeout | null = null;

function adjustCleanupInterval() {
  const activeEntries = rateLimitCache.size;

  if (activeEntries > 50) {
    cleanupInterval = RATE_LIMIT_WINDOW;
  } else if (activeEntries > 10) {
    cleanupInterval = RATE_LIMIT_WINDOW * 2;
  } else {
    cleanupInterval = RATE_LIMIT_WINDOW * 5;
  }

  if (cleanupTimer) {
    clearInterval(cleanupTimer);
  }

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitCache) {
      if (entry.expiresAt <= now) {
        rateLimitCache.delete(ip);
      }
    }
  }, cleanupInterval);
}

export function rateLimiter(ip: string): { allowed: boolean; ttl: number } {
  const now = Date.now();
  const entry = rateLimitCache.get(ip);

  if (entry) {
    if (entry.expiresAt > now) {
      if (entry.count >= MAX_REQUESTS) {
        return { allowed: false, ttl: (entry.expiresAt - now) / 1000 };
      } else {
        entry.count += 1;
      }
    } else {
      entry.count = 1;
      entry.expiresAt = now + RATE_LIMIT_WINDOW;
    }
  } else {
    // تحقق من الحد الأقصى للحجم قبل الإضافة
    if (rateLimitCache.size >= MAX_CACHE_SIZE) {
      // حذف أقدم مدخل (أسهل طريقة: أول عنصر في Map)
      const oldestKey = rateLimitCache.keys().next().value;
      if (oldestKey !== undefined) {
        rateLimitCache.delete(oldestKey);
      }
    }
    rateLimitCache.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW });
  }

  adjustCleanupInterval();

  return { allowed: true, ttl: 0 };
}