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

/**
 * Peek WITHOUT consuming a token: true if the key is already over its limit.
 * Lets a caller reject an over-limit request *before* doing expensive work
 * (e.g. scrypt on login) — pair with recordFail() to only count failures.
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const rec = hits.get(key)
  if (!rec || Date.now() > rec.resetAt) return false
  return rec.count >= limit
}

/** Record one failed attempt against a key (opens/extends the window). */
export function recordFail(key: string, windowMs: number): void {
  const now = Date.now()
  const rec = hits.get(key)
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  rec.count += 1
}

/**
 * Best-effort client IP for throttling. Behind our nginx, X-Real-IP is set to
 * the real client ($remote_addr) and cannot be spoofed by the client (nginx
 * overwrites it), so prefer it. Fall back to the LAST X-Forwarded-For hop (the
 * one nginx appended) — never the FIRST, which is client-controlled and was the
 * source of the pre-fix bypass. 'local' when neither header is present.
 */
export function clientIp(h: Headers): string {
  const real = h.get('x-real-ip')?.trim()
  if (real) return real
  const xff = h.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1]
  }
  return 'local'
}
