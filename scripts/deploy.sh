#!/usr/bin/env bash
#
# One-command deploy: pull latest code, rebuild, run migrations, restart the site.
#
# Usage (run on the server, from inside the site folder):
#     ./scripts/deploy.sh
#
# Multi-site: set SERVICE to that site's systemd unit (defaults to "shaggy"):
#     SERVICE=clientb ./scripts/deploy.sh
#
# It's safe to re-run. It never re-seeds (that would erase real content).

set -euo pipefail

SERVICE="${SERVICE:-shaggy}"
cd "$(dirname "$0")/.." # repo root, wherever this script lives

echo "==> [1/5] Pulling latest code…"
git pull --ff-only

echo "==> [2/5] Installing dependencies (only if the lockfile changed)…"
if ! git diff --quiet HEAD@{1} HEAD -- package-lock.json 2>/dev/null; then
  npm ci
else
  echo "    package-lock.json unchanged — skipping install."
fi

echo "==> [3/5] Building…"
npm run build

echo "==> [4/5] Applying any new database migrations…"
npm run db:migrate

echo "==> [5/5] Restarting ${SERVICE}…"
sudo systemctl restart "${SERVICE}"

echo ""
echo "==> Done. Status:"
systemctl --no-pager --lines=0 status "${SERVICE}" | head -4
