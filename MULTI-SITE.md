# Hosting multiple websites on one Hetzner server

This picks up **after** your first site is live via [DEPLOY.md](DEPLOY.md). It shows how to add
more websites to the **same** server. Each site is fully isolated — its own folder, port,
service, database, and media — so they never interfere. One flat server bill, many sites.

## The mental model

```
                    ┌──────────────── your Hetzner server ────────────────┐
   the internet     │                                                     │
  ───────────────►  │   Caddy (port 80/443)  ──► 127.0.0.1:3000  site A   │
   shaggydogspa.com │   (HTTPS + routing)    ──► 127.0.0.1:3001  site B   │
   clientb.com      │                        ──► 127.0.0.1:3002  site C   │
                    │                                                     │
                    └─────────────────────────────────────────────────────┘
```

- **Caddy** is the single front door. It listens on 443, terminates HTTPS (free auto certs per
  domain), and reverse-proxies each domain to a **different local port**.
- **Each website** is a Node process (`npm run start`) bound to its own port, kept alive by its
  own **systemd service**.
- Nothing is shared between sites except the box itself (CPU/RAM/Caddy).

## What each site needs that must be UNIQUE

| Thing | Site A | Site B | Site C |
|---|---|---|---|
| Folder | `~/sites/shaggy` | `~/sites/clientb` | `~/sites/clientc` |
| `PORT` (in its `.env`) | `3000` | `3001` | `3002` |
| systemd service | `shaggy.service` | `clientb.service` | `clientc.service` |
| Caddy domain block | shaggydogspa.com | clientb.com | clientc.com |
| Database + media | its own `./shaggy.db` + `./media` | (its own) | (its own) |

The database file and `./media` folder are **automatic** — they're created relative to each
site's folder, so you never have to think about keeping them separate.

---

## Add a new site (repeat per site)

Assume the server, firewall, swap, Node, and Caddy are already set up from DEPLOY.md.

### 1. Clone into its own folder + set a unique port
```bash
mkdir -p ~/sites && cd ~/sites
git clone YOUR_SECOND_REPO_URL clientb
cd clientb

# .env — note the UNIQUE PORT and this site's real domain
echo "DATABASE_URI=file:./shaggy.db"                >  .env
echo "NEXT_PUBLIC_SITE_URL=https://clientb.com"     >> .env
echo "PORT=3001"                                    >> .env
```
> Every site can keep the filename `shaggy.db` — it lives inside that site's own folder, so
> `~/sites/shaggy/shaggy.db` and `~/sites/clientb/shaggy.db` are different files.

### 2. Install, build, seed (build ONE site at a time — see Memory below)
```bash
npm ci
npm run build
npm run db:migrate
npm run db:seed          # once, on first deploy only
```

### 3. Its own systemd service (unique name + folder + port)
```bash
sudo tee /etc/systemd/system/clientb.service >/dev/null <<'EOF'
[Unit]
Description=Client B website
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/sites/clientb
Environment=NODE_ENV=production
Environment=PORT=3001
ExecStart=/usr/bin/env npm run start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now clientb
sudo systemctl status clientb        # "active (running)"
```

### 4. Add a domain block to Caddy → this site's port
Edit `/etc/caddy/Caddyfile` and append a block (leave the other sites' blocks intact):
```
clientb.com, www.clientb.com {
    reverse_proxy 127.0.0.1:3001
}
```
A full Caddyfile for three sites looks like:
```
shaggydogspa.com, www.shaggydogspa.com {
    reverse_proxy 127.0.0.1:3000
}
clientb.com, www.clientb.com {
    reverse_proxy 127.0.0.1:3001
}
clientc.com, www.clientc.com {
    reverse_proxy 127.0.0.1:3002
}
```
Then reload (zero downtime for the other sites):
```bash
sudo systemctl reload caddy
```

### 5. Point the new domain's DNS at the server
At the new domain's registrar: `A` record `@` → `YOUR_SERVER_IP`, and `A` record `www` →
`YOUR_SERVER_IP`. Once DNS propagates, Caddy issues the HTTPS cert automatically and
`https://clientb.com` is live.

---

## Memory — the one real shared-box limit

- **Running** sites are light: ~150–250 MB RAM each. An **8 GB** box (CX33 / CPX31) comfortably
  runs *several* low-traffic sites at once.
- The **build** is the heavy moment: `npm run build` may use up to an 8 GB heap
  (`--max-old-space-size=8000` in `package.json`). So **build/deploy one site at a time —
  never run two `npm run build`s simultaneously** — and keep the **4 GB swap** from DEPLOY §3 on.
  Steady-state traffic is not the constraint here; concurrent builds are.
- Rough capacity on 8 GB + 4 GB swap: comfortably 3–6 low-traffic brochure/booking sites. If you
  push past that, move up a server size (more RAM) rather than fighting for memory.

## Day-to-day operations (per site)

```bash
# logs for one site
journalctl -u clientb -f

# restart / stop / start one site (others unaffected)
sudo systemctl restart clientb

# deploy an update to one site
cd ~/sites/clientb && git pull && npm ci && npm run build && sudo systemctl restart clientb
```

## Backups (all sites)

Extend the DEPLOY §10 cron to loop over every site folder — each has its own `shaggy.db` +
`media`:
```
0 3 * * * for d in /home/deploy/sites/*/; do n=$(basename "$d"); sqlite3 "$d/shaggy.db" ".backup '/home/deploy/backups/$n-$(date +\%F).db'"; tar czf "/home/deploy/backups/$n-media-$(date +\%F).tgz" -C "$d" media; done
```
Copy `~/backups` **off** the server (scp/rsync/Storage Box) — a same-machine backup protects
against mistakes, not against losing the machine.

## Troubleshooting

| Symptom | Check |
|---|---|
| One site down, others fine | `systemctl status <name>`, `journalctl -u <name> -f` |
| New domain has no HTTPS | `journalctl -u caddy -f`; confirm its DNS `A` records point here |
| Port already in use | Two sites share a `PORT` — give each a unique one and restart |
| Build killed / OOM | You built two at once, or swap is off. Build one at a time; `free -h` to confirm swap |
| Caddy won't reload | `caddy validate --config /etc/caddy/Caddyfile` to find the syntax error |
