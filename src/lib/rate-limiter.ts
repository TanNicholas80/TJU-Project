import { cache } from "@/lib/cache";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
}

interface RateLimitRecord {
  count: number;
  expiresAt: number;
}

/**
 * IP and Identifier based rate limiter utilizing multi-tier cache.
 * Default: 5 requests per 10 minutes (600s) as specified in PRD Section 8.2.
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 600
): Promise<RateLimitResult> {
  const sanitizedId = identifier.trim() || "127.0.0.1";
  const key = `ratelimit:contact:${sanitizedId}`;

  // In local development or test environment, allow higher headroom for localhost so E2E test runs don't lock out
  const isLocalhost =
    sanitizedId === "127.0.0.1" ||
    sanitizedId === "::1" ||
    sanitizedId === "localhost";
  const effectiveLimit =
    process.env.NODE_ENV !== "production" && isLocalhost && limit === 5
      ? 100
      : limit;

  try {
    const existing = await cache.get<RateLimitRecord>(key);
    const now = Date.now();

    if (existing && existing.expiresAt > now) {
      if (existing.count >= effectiveLimit) {
        return {
          success: false,
          remaining: 0,
          resetInSeconds: Math.max(1, Math.ceil((existing.expiresAt - now) / 1000)),
        };
      }

      const updatedCount = existing.count + 1;
      const remainingSeconds = Math.max(1, Math.ceil((existing.expiresAt - now) / 1000));
      await cache.set(
        key,
        { count: updatedCount, expiresAt: existing.expiresAt },
        remainingSeconds
      );

      return {
        success: true,
        remaining: Math.max(0, effectiveLimit - updatedCount),
        resetInSeconds: remainingSeconds,
      };
    }

    const expiresAt = now + windowSeconds * 1000;
    await cache.set(key, { count: 1, expiresAt }, windowSeconds);

    return {
      success: true,
      remaining: Math.max(0, effectiveLimit - 1),
      resetInSeconds: windowSeconds,
    };
  } catch (error) {
    console.warn(`[RateLimiter] Error evaluating rate limit for ${identifier}:`, error);
    // In case cache fails, allow request to proceed gracefully
    return {
      success: true,
      remaining: 1,
      resetInSeconds: windowSeconds,
    };
  }
}

/**
 * Resets the rate limit counter for a specific identifier. Useful for testing and manual resets.
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = `ratelimit:contact:${identifier.trim()}`;
  await cache.del(key);
}

/**
 * Extracts the real client IP address from request headers.
 */
export function getClientIp(
  headersSource?: Headers | Record<string, string | string[] | undefined> | null
): string {
  if (!headersSource) return "127.0.0.1";

  let forwardedFor: string | undefined;
  let realIp: string | undefined;
  let cfIp: string | undefined;

  if (typeof (headersSource as Headers).get === "function") {
    const h = headersSource as Headers;
    forwardedFor = h.get("x-forwarded-for") || undefined;
    realIp = h.get("x-real-ip") || undefined;
    cfIp = h.get("cf-connecting-ip") || undefined;
  } else {
    const h = headersSource as Record<string, string | string[] | undefined>;
    const getVal = (val: string | string[] | undefined) =>
      Array.isArray(val) ? val[0] : val;
    forwardedFor = getVal(h["x-forwarded-for"]);
    realIp = getVal(h["x-real-ip"]);
    cfIp = getVal(h["cf-connecting-ip"]);
  }

  if (cfIp) return cfIp.trim();
  if (forwardedFor) {
    const parts = forwardedFor.split(",");
    if (parts[0] && parts[0].trim()) {
      return parts[0].trim();
    }
  }
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
