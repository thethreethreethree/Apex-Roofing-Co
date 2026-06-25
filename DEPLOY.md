# Deploying Apex Roofing Co to Vercel

The app is environment-driven: locally it runs on **SQLite + local file storage** with zero
setup; in production it automatically switches to **Postgres + Vercel Blob** when the right
environment variables are present. Nothing in the code changes between the two.

## What you create (accounts)

1. A **Vercel** account (free) — hosting + Postgres + Blob storage all in one dashboard.
2. The GitHub repo already exists: `github.com/thethreethreethree/Apex-Roofing-Co`.
3. *(Optional)* A **Resend** account for real transactional email.

---

## Step 1 — Push the code to GitHub

From the project folder:

```bash
git add -A
git commit -m "Apex Roofing Co website"
git push origin main
```

## Step 2 — Import the repo into Vercel

1. Vercel → **Add New → Project** → import `Apex-Roofing-Co`.
2. Framework preset: **Next.js** (auto-detected). Don't deploy yet — add storage + env first.

## Step 3 — Provision the database and image storage

In the Vercel project → **Storage** tab:

1. **Create Database → Postgres** (Neon). Vercel auto-adds `POSTGRES_URL` (and friends) to
   the project. *(Prefer Supabase? Create a Supabase project and use its connection string as
   `DATABASE_URI` instead — use the **session/direct** string, not the transaction pooler, so
   schema creation works.)*
2. **Create → Blob** store. Vercel auto-adds `BLOB_READ_WRITE_TOKEN`.

## Step 4 — Set the remaining environment variables

In Vercel → **Settings → Environment Variables**:

| Name | Value |
|---|---|
| `PAYLOAD_SECRET` | a long random string (e.g. `openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | your Vercel URL (e.g. `https://apex-roofing-co.vercel.app`) |
| `DATABASE_URI` | *(only if using Supabase)* your Postgres connection string |

`POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` were added automatically in Step 3.

## Step 5 — Seed the production data (once)

This creates the schema, the admin account, and all demo content + images in your live
Postgres + Blob. Run it locally with the production values:

```bash
# temporarily point local env at production, then:
DATABASE_URI="<your-postgres-url>" \
BLOB_READ_WRITE_TOKEN="<your-blob-token>" \
PAYLOAD_SECRET="<same-secret-as-vercel>" \
npx tsx src/seed.ts
```

(Admin login stays **ApexRoofing / Admin2026!** — change the password in `/admin` after first
login.)

## Step 6 — Deploy

Click **Deploy** in Vercel. When it finishes, visit your URL — the full site, the lead forms,
and the booking calendar are live. Manage everything at `https://your-url/admin`.

---

## Optional — real email (Resend)

Add to Vercel env: `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`,
`OWNER_NOTIFICATION_EMAIL`. With a verified sending domain, lead and booking emails are
delivered for real instead of logged to the server console.
