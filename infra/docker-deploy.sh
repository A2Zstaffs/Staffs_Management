#!/bin/bash
# Deploy backend Docker container on EC2
# Usage: ./infra/docker-deploy.sh  (run from project root)
# Requires: backend/.env file to exist on the server

set -e

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

echo "==> Updating Nginx config..."
sudo cp ./infra/nginx/a2zstaffs.conf /etc/nginx/conf.d/a2zstaffs.conf
sudo nginx -t && sudo systemctl reload nginx

echo "==> Waiting for health check..."
sleep 5
docker ps | grep $CONTAINER_NAME

echo "==> Container logs (last 20 lines):"
docker logs --tail 20 $CONTAINER_NAME

echo ""
echo "Done. Test with: curl http://localhost:5001/api/health"
