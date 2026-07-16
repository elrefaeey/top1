type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

const store = new Map<string, CacheEntry>();

const DEFAULT_TTL_MS = 60_000;
const MAX_ENTRIES = 200;

function pruneExpired(now: number) {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}

function evictOldest() {
  if (store.size < MAX_ENTRIES) return;
  const first = store.keys().next().value;
  if (first !== undefined) store.delete(first);
}

/** In-process CMS response cache — reduces Firestore hits per serverless isolate. */
export function getCachedCmsValue(key: string): unknown | undefined {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= now) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCachedCmsValue(key: string, value: unknown, ttlMs = DEFAULT_TTL_MS): void {
  const now = Date.now();
  if (store.size > MAX_ENTRIES) pruneExpired(now);
  evictOldest();
  store.set(key, { value, expiresAt: now + ttlMs });
}

export function cmsCacheKey(resource: string, searchParams: URLSearchParams): string {
  const qs = searchParams.toString();
  return qs ? `${resource}?${qs}` : resource;
}

/** CDN + browser cache headers for public CMS GET responses. */
export function cmsCacheControlHeaders(): Record<string, string> {
  return {
    "cache-control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    "cdn-cache-control": "public, s-maxage=60, stale-while-revalidate=300",
    "vercel-cdn-cache-control": "public, s-maxage=60, stale-while-revalidate=300",
  };
}
