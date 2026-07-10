#!/usr/bin/env bash
#
# Provision a NEW site on this box in ONE command: clone -> .env -> build ->
# seed -> systemd service -> Caddy domain + automatic HTTPS. Then just point DNS.
#
# Usage:
#   ./scripts/add-site.sh <name> <repo-url> <port> <domain>
# Example:
#   ./scripts/add-site.sh clientb https://github.com/you/clientb.git 3001 clientb.com
#
# Each site is fully isolated: its own folder (~/sites/<name>), port, systemd
# service, database, and media. Build ONE site at a time (the build is memory-heavy).

set -euo pipefail

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <name> <repo-url> <port> <domain>" >&2
  echo "Example: $0 clientb https://github.com/you/clientb.git 3001 clientb.com" >&2
  exit 1
fi

NAME="$1"; REPO="$2"; PORT="$3"; DOMAIN="$4"
DIR="$HOME/sites/$NAME"

# --- Safety checks (fail fast, never clobber an existing site) ---------------
[ -e "$DIR" ] && { echo "ERROR: $DIR already exists — pick another name." >&2; exit 1; }
[ -e "/etc/systemd/system/$NAME.service" ] && { echo "ERROR: service '$NAME' already exists." >&2; exit 1; }
if ss -ltn 2>/dev/null | grep -q ":$PORT "; then echo "ERROR: port $PORT is already in use — pick another." >&2; exit 1; fi

echo "==> Provisioning '$NAME' from $REPO  (port $PORT, domain $DOMAIN)"

# --- 1. Clone ----------------------------------------------------------------
mkdir -p "$HOME/sites"
git clone "$REPO" "$DIR"
cd "$DIR"

# --- 2. .env (own DB + media, unique port) -----------------------------------
cat > .env <<ENV
DATABASE_URI=file:./shaggy.db
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
PORT=$PORT
ENV

# --- 3. Install, build, migrate, seed (first time only) ----------------------
npm ci
npm run build
npm run db:migrate
npm run db:seed

# --- 4. systemd service (auto-start / auto-restart) --------------------------
sudo tee "/etc/systemd/system/$NAME.service" >/dev/null <<SVC
[Unit]
Description=$NAME website
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$DIR
Environment=NODE_ENV=production
Environment=PORT=$PORT
ExecStart=/usr/bin/env npm run start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
SVC
sudo systemctl daemon-reload
sudo systemctl enable --now "$NAME"

# --- 5. Caddy domain block + HTTPS (validate before reload) ------------------
printf '\n%s, www.%s {\n    reverse_proxy 127.0.0.1:%s\n}\n' "$DOMAIN" "$DOMAIN" "$PORT" | sudo tee -a /etc/caddy/Caddyfile >/dev/null
if sudo caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1; then
  sudo systemctl reload caddy
else
  echo "WARNING: Caddyfile failed validation — review /etc/caddy/Caddyfile before reloading." >&2
fi

echo ""
echo "==> '$NAME' is live on port $PORT."
echo "    LAST STEP: point $DOMAIN DNS (A records for @ and www) at this server's IP."
echo "    Caddy will then issue HTTPS automatically. Update it later with:"
echo "        SERVICE=$NAME ~/sites/$NAME/scripts/deploy.sh"
