# Deploying to a Hetzner VPS (no Vercel, no Supabase, no Docker)

This runs the whole site — Next.js + our **custom admin**, the **SQLite** database,
**local-disk** media, and online **booking/lead** capture — on **one** small Hetzner server.
Flat monthly cost, no per-project fees, no Docker, and you can host several sites on the box.

**How the client uses it:** they just open `https://yourdomain.com/admin` in any browser and
manage content, prices, hours, photos, reviews, and bookings — fully online, nothing installed
locally. The single cloud server below is the *only* system involved.

> Commands assume **Ubuntu 24.04 LTS**. Lines starting with `sudo` run on the server.

---

## 0. Before you start

You need:
- A **Hetzner Cloud** account — <https://console.hetzner.cloud>
- A **domain name** you can edit DNS for
- The site's **GitHub repo URL** (push this repo to GitHub first)
- An **SSH key** on your computer. If you don't have one:
  - **macOS / Linux:**
    ```bash
    ssh-keygen -t ed25519 -C "you@email.com"     # press Enter through the prompts
    cat ~/.ssh/id_ed25519.pub                     # copy this — you'll paste it into Hetzner
    ```
  - **Windows 10/11 (PowerShell — OpenSSH is built in):**
    ```powershell
    ssh-keygen -t ed25519 -C "you@email.com"       # press Enter through the prompts
    Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard   # now paste into Hetzner
    ```
    The **public** key (`.pub`) is what you paste into Hetzner; the private key (no extension)
    stays on your PC — never share it.

---

## 1. Create the server

1. Hetzner Cloud Console → **New Project** → open it → **Add Server**.
2. **Location + Type together** — these two are linked, so pick them as a pair:
   - **Best for a US (California) audience:** **Location = Hillsboro, OR (us-west)** and
     **Type = a CPX plan** (`CPX21` ≈ 3 vCPU / 4 GB, or `CPX31` ≈ 4 vCPU / 8 GB for headroom).
     The cheaper **CX line is EU-only** — if you pick a CX type, the only locations offered are
     Nuremberg / Falkenstein / Helsinki (Germany/Finland), which adds ~150 ms of latency for
     California visitors. It still *works*, just loads a touch slower.
   - **Cheapest, latency OK:** **Type = CX23** (2 vCPU / 4 GB) or **CX33** (4 vCPU / 8 GB) with
     **Location = Nuremberg**. Fine for a low-traffic booking site; nothing breaks. Local SEO is
     unaffected either way (it keys off your Google Business Profile, not the server's country).
3. **Image:** Ubuntu 24.04 (or the latest LTS offered).
4. **SSH key:** paste your `id_ed25519.pub`.
5. Create it, then note the server's **public IPv4 address**.

Log in:
```bash
ssh root@YOUR_SERVER_IP
```

---

## 2. Create a non-root user

```bash
adduser deploy                      # set a password when prompted
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy   # copy your SSH key over
```
Reconnect as that user (keep the root session open until this works):
```bash
ssh deploy@YOUR_SERVER_IP
```

---

## 3. Firewall + swap

```bash
sudo apt update
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

Swap keeps the memory-hungry build from failing on a 4 GB box:
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h        # confirm swap shows 4Gi
```

---

## 4. Install Node.js 22 + tools

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git sqlite3
node -v        # should print v22.x
```

---

## 5. Get the code + create the .env

```bash
cd ~
git clone YOUR_GITHUB_REPO_URL shaggy-dog-spa
cd shaggy-dog-spa
```
> Private repo? Use an SSH deploy key or a GitHub Personal Access Token in the clone URL.

Create `.env` — this is what keeps it on **SQLite + local disk + no external services**
(note there is **no** Blob/Postgres/Resend line, and no CMS secret — the backend is our own):
```bash
echo "DATABASE_URI=file:./shaggy.db"                 >  .env
echo "NEXT_PUBLIC_SITE_URL=https://yourdomain.com"   >> .env
cat .env        # replace yourdomain.com with your real domain
```

---

## 6. Install, build, and seed (first time only)

```bash
npm ci                 # do NOT set NODE_ENV=production here — the build needs dev deps
npm run build          # the memory-hungry step; swap (step 3) covers it
npm run db:migrate     # create the SQLite schema (idempotent — safe to re-run)
npm run db:seed        # admin user + all demo content. RUN ONCE.
```
> ⚠️ `npm run db:seed` **wipes and recreates** content and the media folder each run. Run it
> once on first deploy. After that the owner edits content in `/admin` — never re-seed, or
> you'll erase their changes. (`db:migrate` is safe to re-run any time; it only applies schema.)

Optional quick test:
```bash
npm run start &
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/   # expect 200
kill %1
```

---

## 7. Run it as a service (auto-start, auto-restart)

```bash
sudo tee /etc/systemd/system/shaggy.service >/dev/null <<'EOF'
[Unit]
Description=Shaggy Dog Spa website
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/shaggy-dog-spa
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/env npm run start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now shaggy
sudo systemctl status shaggy        # should say "active (running)"
```
Live logs any time: `journalctl -u shaggy -f`

---

## 8. Point your domain + automatic HTTPS (Caddy)

**DNS** — at your registrar, point the domain at the server's IPv4:
- `A` record, host `@`   → `YOUR_SERVER_IP`
- `A` record, host `www` → `YOUR_SERVER_IP`

**Install Caddy:**
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

**Configure it** (proxy the domain to the app on port 3000):
```bash
sudo tee /etc/caddy/Caddyfile >/dev/null <<'EOF'
yourdomain.com, www.yourdomain.com {
    reverse_proxy 127.0.0.1:3000
}
EOF
sudo systemctl reload caddy
```
Once DNS propagates, visit **https://yourdomain.com** — Caddy issues a free HTTPS certificate
automatically.

---

## 9. Log in and change the admin password

1. Go to **https://yourdomain.com/admin**
2. Log in: **username** `ShaggyDogSpa` · **password** `Admin2026!`
3. **Change the password immediately** (the seed credentials are public in the repo) at
   **Admin → Account**. Changing it rotates every session, so any other logged-in device is
   signed out.

From here the client manages everything in the browser — no local software, no Docker.

---

## 10. Backups (SQLite + media)

Everything that matters is **one database file + the media folder**:
```bash
mkdir -p ~/backups
crontab -e
```
Add (nightly dated snapshot at 3am):
```
0 3 * * * cd /home/deploy/shaggy-dog-spa && sqlite3 shaggy.db ".backup '/home/deploy/backups/shaggy-$(date +\%F).db'" && tar czf /home/deploy/backups/media-$(date +\%F).tgz media
```
> Also copy `~/backups` **off the server** (rsync/scp to your computer or a Hetzner Storage
> Box). A same-machine backup protects against mistakes, not against losing the machine.

---

## 11. Updating later (new code — done by you, not the client)

```bash
cd ~/shaggy-dog-spa
git pull
npm ci
npm run build
sudo systemctl restart shaggy
```
Run `npm run db:migrate` after `git pull` only if the update adds schema (it's safe to run
every time). Do **not** re-run `npm run db:seed` on updates — it would erase the owner's real content.

---

## 12. Hosting more sites on the same box

Repeat steps 5–9 per site, changing three things so they don't collide:
- a **different folder** (`~/second-site`)
- a **different port** (`PORT=3001`, `3002`, …) in that site's systemd service
- a **new domain block** in `/etc/caddy/Caddyfile` → that port, then `sudo systemctl reload caddy`

Each site keeps its own SQLite file and media folder. One flat server bill, many sites.

---

## 13. Troubleshooting

| Symptom | Check |
|---|---|
| Site won't load | `sudo systemctl status shaggy`, `journalctl -u shaggy -f` |
| HTTPS not working | `journalctl -u caddy -f`; confirm DNS `A` records point to the server |
| Build "out of memory" | Confirm swap is on (`free -h`); build one site at a time |
| Images missing | They live on disk under `./media`; re-seed once if the DB is empty |
| Port already in use | Change `PORT` in the systemd file |

---

## What this setup does and does not need

- ✅ **One Hetzner server** (runs 24/7 in the cloud) — the entire system.
- ✅ **Client manages fully online** at `/admin` — content, prices, hours, photos, reviews,
  bookings. Nothing installed on the client's computer.
- ❌ **No Docker.** ❌ No Supabase. ❌ No Vercel. ❌ No external database or file storage.
- ℹ️ Lead/booking **email** notifications print to the server log; every lead and booking is
  still saved and visible in `/admin`. Add SMTP later if you want emailed alerts.
- ℹ️ No third-party CMS and no cloud adapters — the entire backend (data, auth, admin, media)
  is our own code under `src/server/`, running on the one SQLite file and the `./media` folder.
