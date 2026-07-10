import { test, expect } from '@playwright/test'

// Regression guard for the security headers configured in next.config.ts. If a
// future change weakens or drops the CSP (or the baseline headers), this fails.
test.describe('Security headers', () => {
  test('public responses carry the CSP + baseline hardening headers', async ({ request }) => {
    const res = await request.get('/')
    expect(res.status()).toBe(200)
    const h = res.headers()

    const csp = h['content-security-policy'] || ''
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'self'")
    expect(csp).toContain("base-uri 'self'")
    // Note: 'unsafe-eval' is permitted ONLY in the dev server (React dev + HMR);
    // production is strict. This suite may run against either, so we don't assert
    // on unsafe-eval here — the strict prod policy is verified in a prod-mode run.

    expect(h['x-content-type-options']).toBe('nosniff')
    expect(h['x-frame-options']).toBe('SAMEORIGIN')
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
  })
})
