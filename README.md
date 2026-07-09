# Shaggy Dog Spa — Mobile Grooming Website

Marketing site + booking/lead system for **Shaggy Dog Spa Mobile Grooming** (Phelan, CA).
Built on Next.js + Payload CMS, fully **self-hosted** — SQLite database, local-disk media,
no Vercel / Supabase / Docker. The owner manages all content, photos, prices, hours,
reviews, and sees leads/bookings in the browser at `/admin`.

## Stack
- **Next.js 16** (App Router) — public site + server actions for lead/booking capture.
- **Payload CMS 3** — admin UI + content model, on **SQLite** (`DATABASE_URI=file:./shaggy.db`).
- **Local-disk media** — uploads in `./media`, served at `/api/media/file/*` (no object storage).
- **Console email** by default — leads/bookings are always saved and visible in `/admin`.

## Local development
```bash
npm ci
npm run dev            # http://localhost:3000
npx tsx src/seed.ts    # first run: create admin + demo content (WIPES + recreates content)
```
Admin: `/admin` — seeded login `ShaggyDogSpa` / `Admin2026!` (change it after first login).

## Tests
```bash
npm run test:int                               # vitest integration + logic tests
E2E_BASE_URL=http://localhost:3000 npm run test:e2e   # Playwright (needs a running server)
```

## Deploy
See **[DEPLOY.md](DEPLOY.md)** — a step-by-step guide to hosting on a single Hetzner VPS
(Node + systemd + Caddy HTTPS + swap + SQLite backup). One flat monthly cost, no per-project fees.

## Audits
Ground-up audit records live at the repo root, e.g. **[AUDIT-2026-07-09.md](AUDIT-2026-07-09.md)**.
