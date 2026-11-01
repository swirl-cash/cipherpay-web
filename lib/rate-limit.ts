/* Tiny in-memory sliding-window rate limiter for the genesis API.
   The site runs as a single standalone node process, so process memory is
   the right scope. Keyed per IP per bucket; failures closed = allow. */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

// periodic sweep so the map never grows unbounded
let lastSweep = Date.now();
function sweep(windowMs: number) {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) {
    b.hits = b.hits.filter((t) => now - t < windowMs);
    if (b.hits.length === 0) buckets.delete(k);
  }
}

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim().slice(0, 64);
  return req.headers.get('x-real-ip')?.slice(0, 64) || 'unknown';
}

/** true = allowed, false = over limit */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  sweep(windowMs);
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    b = { hits: [] };
    buckets.set(key, b);
  }
  b.hits = b.hits.filter((t) => now - t < windowMs);
  if (b.hits.length >= limit) return false;
  b.hits.push(now);
  return true;
}
