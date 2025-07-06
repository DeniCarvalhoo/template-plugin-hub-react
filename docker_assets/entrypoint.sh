#!/bin/sh
set -e

echo '🚀 Iniciando servidor em background...'
pnpm run start &

APP_PID=$!
SERVER_URL=${SERVER_URL:-http://localhost:5001}

echo '🔥 Executando warmup...'
sh ./docker_assets/warmup.sh

echo '✅ Pronto! Container rodando. (PID da app: '"$APP_PID"')'

# Mantém o container rodando enquanto a aplicação estiver viva
wait $APP_PID
