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
- [ ] **Change the admin password** — the seeded `ShaggyDogSpa` / `Admin2026!` is public in the repo.
- [ ] Set a strong **`PAYLOAD_SECRET`** in `.env` (`openssl rand -hex 32`). The app refuses to
      start in production without it.

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

## What's already done & verified
Grooming re-skin · self-hosted SQLite + local media · security (secret guard, rate-limit,
headers, honeypot) · accessibility labels · OG/social + local-SEO structured data · branded
404 + favicon · tests (int 8, e2e 6) · `next build` green.
