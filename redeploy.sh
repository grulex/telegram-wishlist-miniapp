git pull && \
docker build -t telegram-wishlist-frontend . && \
docker rm -f telegram-wishlist-frontend && \
docker run -d --name=telegram-wishlist-frontend --init --restart=always -p 3001:3000 \
-e BACKEND_HOST="${BACKEND_HOST}" \
-e TG_MINIAPP_URL="${TG_MINIAPP_URL}" \
telegram-wishlist-frontend:latest
