# Hardening & audit record — 2026-07-10

Follows the Payload removal (system now runs fully on the custom Drizzle + SQLite
backend). This records the security review of that backend and the changes made,
each built and tested before the next. Companion to `AUDIT-2026-07-09.md` (which
audited the earlier Payload-era build).

## Scope reviewed
Every server write and read path of the custom backend:

| Area | File(s) | Verdict |
|---|---|---|
| Auth — passwords | `src/server/auth/password.ts` | scrypt + `timingSafeEqual`; sound |
| Auth — sessions | `src/server/auth/session.ts` | random tokens, httpOnly/secure/sameSite cookie, expiry cleanup; sound |
| Admin route guard | `src/middleware.ts` | guards `/admin/*` except `/admin/login`; sound |
| Admin writes | `src/server/admin/actions.ts` | all `requireUser()`-guarded, parameterized, field-validated |
| Admin reads | `src/server/admin/data.ts` | all `requireUser()`-guarded, parameterized |
| Media upload | `src/server/admin/media.ts` | content-based format allowlist (rejects SVG/non-images), filename sanitize |
| Media serve | `src/app/media-file/[filename]/route.ts` | path-traversal safe |
| Public actions | `src/app/actions/{leads,booking}.ts` | honeypot + rate-limit |

## Findings fixed this session

1. **Public seed credentials could only be rotated by editing the seed + wiping
   content** → added a self-service password change at **Admin → Account**
   (`changePassword`: verifies current password, 10-char min + confirm + must-differ,
   rotates all sessions). `07d9293`
2. **Admin login had no brute-force throttle** → per-IP cap of 8 *failed* attempts
   per 5 min (failures-only, so the owner is never locked out; identical message for
   bad-username vs bad-password → no user enumeration). `d86cb7c`
3. **Media uploads capped at 1 MB** (default Server Action body limit) — smaller than
   a typical phone photo, so the owner's core task would fail → raised to 10 MB.
   Also stopped the serve route from ever rendering a stray `.svg` inline. `90afd63`
4. **Double-booking race (TOCTOU)** — `createBooking` counted then inserted as two
   statements → replaced with an atomic `INSERT...SELECT...WHERE count < capacity`
   (one SQLite write lock). Int test proves exactly `capacity` land under concurrency. `2bc4a02`
5. **Malformed admin edit id** (`/admin/x/abc`) hit the DB with `NaN` → guard with
   `Number.isInteger` → clean 404. `0e6f1ee`
6. **No CSP** (previously blocked by Payload's inline scripts) → added a self-only
   Content-Security-Policy now that the app is fully self-contained. `c585a96`
7. **Critical `npm audit` advisory** (dev-only `vitest` UI) → bumped to 4.1.x. `6d1f3fa`

Also: docs de-Payloaded (`f56fde6`, `3d8340b`, `f581457`), and `lib/payload.ts`
renamed to `lib/content.ts` to remove the last structural trace of the CMS (`8e7d3b7`).

## Verification
- `tsc --noEmit`: clean · `next build`: exit 0
- Integration (vitest): **18/18** (incl. concurrent booking-capacity test)
- E2E (Playwright): **14/14** — incl. a CSP/headers regression guard; verified both
  against the dev server and a production `next start` (CSP forbids the eval/websockets
  dev mode relies on, so the prod run is the authoritative CSP check)
- Clean-room pipeline: migrate → seed → build → `next start` → full e2e green
- Seed is re-runnable (A12): two consecutive runs, both exit 0

## Residual items (need owner/maintainer judgment — not changed autonomously)
- **Rotate `Admin2026!`** on deploy (now possible in the UI at Admin → Account).
- **6 remaining `npm audit` moderates** — all dev/build-only (`esbuild` via
  `drizzle-kit`, `postcss` via `next`); clearing them needs a *breaking* major bump,
  best done in a maintenance window. Do **not** `npm audit fix --force` (downgrades Next).
- **Multi-user admin** — the custom admin manages one owner account (create/change own
  password). If separate staff logins are wanted, a Users collection would need to be
  added. Flagged as a product decision.
- **Accent-color WCAG contrast** — a branding call (see `LAUNCH-CHECKLIST.md`).
