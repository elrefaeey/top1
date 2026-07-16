type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  backend: "memory" | "upstash";
};

function memoryCheck(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: max - 1, resetAt, backend: "memory" };
  }

  if (bucket.count >= max) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt, backend: "memory" };
  }

  bucket.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
    backend: "memory",
  };
}

function upstashEnv(): { url: string; token: string } | null {
  const url = (process.env.UPSTASH_REDIS_REST_URL ?? "").trim().replace(/\/$/, "");
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN ?? "").trim();
  if (!url || !token) return null;
  return { url, token };
}

async function upstashCheck(
  key: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult | null> {
  const env = upstashEnv();
  if (!env) return null;

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const redisKey = `rl:${key}`;

  try {
    const res = await fetch(`${env.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, windowSec, "NX"],
        ["PTTL", redisKey],
      ]),
    });

    if (!res.ok) {
      console.error("[rate-limit] upstash HTTP", res.status);
      return null;
    }

    const payload = (await res.json()) as Array<{ result?: number | string | null }>;
    const count = Number(payload[0]?.result ?? 0);
    const pttlRaw = Number(payload[2]?.result ?? windowMs);
    const pttl = pttlRaw > 0 ? pttlRaw : windowMs;
    const resetAt = Date.now() + pttl;

    if (!Number.isFinite(count) || count <= 0) return null;

    if (count > max) {
      return { ok: false, remaining: 0, resetAt, backend: "upstash" };
    }

    return {
      ok: true,
      remaining: Math.max(0, max - count),
      resetAt,
      backend: "upstash",
    };
  } catch (err) {
    console.error("[rate-limit] upstash error", err);
    return null;
  }
}

/** Sync memory limiter — prefer `checkRateLimitAsync` on APIs. */
export function checkRateLimit(key: string, max = MAX_REQUESTS, windowMs = WINDOW_MS): boolean {
  return memoryCheck(key, max, windowMs).ok;
}

/**
 * Distributed when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set;
 * otherwise falls back to per-isolate memory (same as before).
 */
export async function checkRateLimitAsync(
  key: string,
  max = MAX_REQUESTS,
  windowMs = WINDOW_MS,
): Promise<RateLimitResult> {
  const distributed = await upstashCheck(key, max, windowMs);
  if (distributed) return distributed;
  return memoryCheck(key, max, windowMs);
}

export function rateLimitKey(request: Request, suffix: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `${suffix}:${ip}`;
}

export function rateLimitHeaders(result: RateLimitResult, max: number): Record<string, string> {
  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  return {
    "x-ratelimit-limit": String(max),
    "x-ratelimit-remaining": String(result.remaining),
    "retry-after": String(retryAfter),
  };
}
