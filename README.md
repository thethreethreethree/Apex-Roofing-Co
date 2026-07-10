# Shaggy Dog Spa — Mobile Grooming Website

Marketing site + booking/lead system for **Shaggy Dog Spa Mobile Grooming** (Phelan, CA).
Built on Next.js + a **custom self-hosted backend** (Drizzle + SQLite) — local-disk media,
no Vercel / Supabase / Docker / third-party CMS. The owner manages all content, photos,
prices, hours, reviews, and sees leads/bookings in the browser at `/admin`.

## Stack
- **Next.js 16** (App Router) — public site + server actions for lead/booking capture.
- **Custom backend** — Drizzle ORM on **SQLite/libsql** (`DATABASE_URI=file:./shaggy.db`),
  cookie-session auth, and a config-driven admin at **`/admin`** (no third-party CMS).
- **Local-disk media** — uploads in `./media`, served at `/media-file/*` (no object storage).
- **Console email** by default — leads/bookings are always saved and visible in `/admin`.

## Local development
```bash
npm ci
npm run db:migrate     # create the SQLite schema (first time)
npm run db:seed        # create admin + demo content (WIPES + recreates content + media dir)
npm run dev            # http://localhost:3000
```
Admin: `/admin` — seeded login `ShaggyDogSpa` / `Admin2026!`. To change it, edit the
password in `src/server/db/seed.ts` and re-seed **before** loading real content.

## Tests
```bash
npm run test:int                                       # vitest logic + renderer tests
E2E_BASE_URL=http://localhost:3000 npm run test:e2e    # Playwright (needs a running server)
```

## Architecture
The custom backend lives under `src/server/`:
- `db/` — Drizzle `schema.ts`, `migrate.ts`, `seed.ts`, generated `migrations/`.
- `auth/` — scrypt passwords + cookie sessions; `middleware.ts` guards `/admin/*`.
- `admin/` — config-driven CRUD (`config.ts`, `globals.ts`, `data.ts`, `actions.ts`, `media.ts`).
- `queries.ts` — typed reads the public site consumes (`src/lib/payload.ts` is a thin
  compat re-export of these, kept only so existing frontend imports don't churn — no CMS).

## Deploy
See **[DEPLOY.md](DEPLOY.md)** — one Hetzner VPS (Node + systemd + Caddy HTTPS + swap +
SQLite backup). Flat monthly cost, no per-project fees.

## Audits
Ground-up audit records live at the repo root, e.g. **[AUDIT-2026-07-09.md](AUDIT-2026-07-09.md)**.
