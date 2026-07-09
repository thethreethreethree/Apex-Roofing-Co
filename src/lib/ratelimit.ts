/**
 * Tiny in-memory fixed-window rate limiter. Sufficient for a single self-hosted
 * server (state lives in-process and resets on restart, which is fine for
 * throttling public form spam). For a multi-instance deploy, swap the Map for a
 * shared store (e.g. SQLite table or Redis).
 *
 * Returns true if the call is allowed, false if the key is over its limit.
 */
const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const rec = hits.get(key)
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (rec.count >= limit) return false
  rec.count += 1
  return true
}
