# Backend options — decision record

The site currently runs **Next.js + Payload CMS** on **SQLite + local-disk media**,
self-hosted (no Vercel/Supabase/Docker). This records the alternatives considered so the
choice can be revisited deliberately rather than from memory.

## What the backend has to do here
A non-technical owner must **self-manage content online** (services, prices, hours, photos,
reviews) and **see leads/bookings**. That requires: an **admin UI**, **auth**, a **data
layer**, **media handling**, and the public **API/actions** (leads + booking). The public
logic is already our own code (server actions, rate-limit, honeypot); Payload mainly earns
its keep for the **admin + data + auth** layer.

## Options

### 1. Keep Payload (current) — recommended default
- **+** Built, branded, tested (int 8 / e2e 6), self-hosted on SQLite. Does the "owner
  self-manages online" job today. Admin UI, auth, relations, media, rich text all included.
- **−** Heavier dependency footprint; you track Payload version upgrades.

### 2. PocketBase (single-binary self-hosted) — best "lighter" answer
- **+** One executable: SQLite + admin UI + auth + file storage. Very light, cheap, simple to
  host. Closest thing to "your own backend" without building/maintaining it.
- **−** Not Payload — switching means rebuilding the content model + wiring the frontend to
  its API (days, not weeks). Admin is functional but less rich than Payload's.

### 3. Fully custom backend (hand-rolled)
- **+** Total control, smallest footprint, no framework lock-in, deep understanding.
- **−** You rebuild the **admin CMS UI** (weeks), own **auth security**, and own all
  maintenance/bugs forever. Most work for, likely, a *less* capable result than #1. Discards
  working verified code.

### 4. Static site (no backend/CMS)
- **+** Cheapest, simplest, near-zero maintenance. Good **if content rarely changes**.
- **−** Owner can't self-edit (content lives in code); booking would move to a scheduling
  service. Loses the self-managed CMS entirely.

## Recommendation
**Keep Payload unless there's a concrete driver.** If the driver is "too heavy/complex,"
**PocketBase** beats hand-rolling. If it's "content barely changes," go **static**. A fully
custom backend is the most effort for the least certain payoff here.

## Decision drivers to name before switching
- Dependency weight / hosting simplicity → PocketBase.
- Content-change frequency (low) → static.
- A specific capability Payload can't express → custom (rare for a brochure+booking site).
- Cost → all four are cheap self-hosted; this is not the deciding factor.

*Status: open — no change made. Current stack (Payload + SQLite) remains in place.*
