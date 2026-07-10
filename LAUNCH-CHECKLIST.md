# Launch checklist — Shaggy Dog Spa

The site is built, hardened, and tested. These are the **owner/operator** steps to take
it from "demo content" to "live for the real business." Everything here is done in the
browser (`/admin`) or during deploy — no code changes needed.

## Content (in `/admin`) — replace the placeholders
- [ ] **Photos** — swap the paw-motif placeholders for real grooming photos.
      Admin → **Media** (and the image field on each Service / Gallery item / Home hero).
- [ ] **Prices** — set real prices on each **Service** and **Package** (currently `From $75`, etc.).
- [ ] **Reviews** — replace the representative reviews with the business's real ones
      (Admin → **Reviews**). Only the *count* (26) was verified; set the true **star rating**
      under Site Settings → Trust & Credentials.
- [ ] **Business details** — confirm phone, **email**, hours, and service-area towns
      (Admin → **Site Settings** / **About** copy). Email is a placeholder.
- [ ] **Trust badges** — confirm the "Insured" badge is accurate for the business.

## Security / accounts
- [ ] **Change the admin password** — the seeded `ShaggyDogSpa` / `Admin2026!` is public in the
      repo. Change it after first login at **Admin → Account** (rotates all sessions).
- [ ] Confirm **`.env`** has `DATABASE_URI=file:./shaggy.db` and the real `NEXT_PUBLIC_SITE_URL`.
      The custom backend needs **no** CMS/signing secret — sessions use random DB-stored tokens.

## Before go-live (maintenance)
- [x] **Critical advisory cleared** — the `vitest` critical was fixed by bumping to 4.1.x
      (int suite still 18/18). It was dev-only anyway (needs the Vitest UI server, never run in prod).
- [ ] **Remaining `npm audit`: 6 moderate, all dev/build-only** — `esbuild` (via `drizzle-kit`)
      and `postcss` (via `next`, build-time). None ship to visitors. Clearing them needs a
      `next` / `drizzle-kit` major bump that may be breaking, so do it in a maintenance window
      with a full `npm run build` + test pass. ⚠️ Do **not** run `npm audit fix --force` — it
      downgrades `next` to 9.x (breaking).

## Deploy (see `DEPLOY.md`)
- [ ] Get a **Hetzner Cloud CX33** (8 GB, ~€8.99/mo) — or CX23 (4 GB) with swap.
- [ ] Set **`NEXT_PUBLIC_SITE_URL`** to the real domain (fixes sitemap/robots/OG/canonical URLs).
- [ ] Point DNS at the server; Caddy issues HTTPS automatically.
- [ ] Set up the nightly **SQLite + media backup** (DEPLOY.md §10) and copy it off-server.

## Optional (decide later)
- [ ] **Email notifications** — currently lead/booking alerts print to the server log; every
      lead & booking is still saved in `/admin`. Add an SMTP/email adapter if you want alerts
      delivered to your inbox.
- [ ] **Booking availability** — hours are set to **Tue–Sat, 9am–6pm**. Confirm the
      **per-slot capacity** (Admin → Booking Availability): it's `2` (two concurrent
      appointments — the reviews mention two groomers). Set it to `1` if only one
      van/groomer runs at a time.

## Accessibility decision (your call)
- [ ] **Accent color contrast** — the amber accent (`#f2994a`) fails WCAG AA for white
      button text (2.23:1, needs 4.5:1). To comply, darken it to ~`#b45309` (5.02:1) in
      Admin → **Branding → Accent color** — one change re-themes the whole site. Or keep the
      current amber as a deliberate brand choice. (Everything else meets AA.)

## What's already done & verified
Grooming re-skin · **custom backend** (Drizzle + SQLite, cookie-session auth, config-driven
`/admin`) replacing the third-party CMS · self-hosted SQLite + local-disk media · security
(scrypt+session auth, `/admin` middleware guard, **self-service password change**, **failed-login
throttle**, upload format allowlist + 10 MB photo limit, form rate-limit, headers, honeypot,
richtext link sanitization) · **atomic booking capacity guard** (no double-booking under
concurrency) · accessibility labels · OG/social + local-SEO structured data · branded 404 +
favicon · tests (int 18, e2e 13) · `next build` green.
