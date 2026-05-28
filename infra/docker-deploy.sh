#!/bin/bash
# Deploy backend Docker container on EC2
# Usage: ./infra/docker-deploy.sh  (works from any directory)
# Requires: backend/.env file to exist on the server

set -e

# Resolve project root from the script's own location so the script works
# regardless of which directory the user runs it from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

IMAGE_NAME="vms-backend"
CONTAINER_NAME="vms-backend"
ENV_FILE="./backend/.env"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Stopping old container (if running)..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "==> Building Docker image..."
docker build -t $IMAGE_NAME ./backend

echo "==> Starting container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart=always \
  --env-file $ENV_FILE \
  -p 127.0.0.1:5001:5001 \
  --memory="400m" \
  --memory-swap="600m" \
  $IMAGE_NAME

echo "==> Checking Nginx config..."
# Don't blindly overwrite the live nginx config — certbot appends its HTTPS server block
# into /etc/nginx/conf.d/a2zstaffs.conf when 'sudo certbot --nginx -d api.a2zstaffs.com' runs,
# and the in-repo template is HTTP-only. Copying every deploy would wipe certbot's edits
# and re-break TLS until someone re-runs certbot.
if sudo grep -q "ssl_certificate.*api\.a2zstaffs\.com" /etc/nginx/conf.d/a2zstaffs.conf 2>/dev/null; then
  echo "    Live nginx config already has certbot's SSL block — skipping cp (preserving HTTPS)."
else
  echo "    No SSL block detected — installing HTTP-only config from repo."
  sudo cp ./infra/nginx/a2zstaffs.conf /etc/nginx/conf.d/a2zstaffs.conf
  echo "    NEXT STEP: run 'sudo certbot --nginx -d api.a2zstaffs.com' to enable HTTPS."
fi
sudo nginx -t && sudo systemctl reload nginx

echo "==> Waiting for health check..."
sleep 5
docker ps | grep $CONTAINER_NAME

echo "==> Container logs (last 20 lines):"
docker logs --tail 20 $CONTAINER_NAME

echo ""
echo "Done. Test with: curl http://localhost:5001/api/health"
