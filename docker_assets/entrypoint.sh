#!/bin/sh
set -e

echo '🚀 Iniciando servidor em background...'
pnpm run start &

APP_PID=$!
SERVER_URL=${SERVER_URL:-http://localhost:5001}

# (Opcional) Aguarda o app abrir a porta. Use um loop para garantir que subiu:
for i in $(seq 1 10); do
  if nc -z localhost 5001; then
    echo "App respondeu na porta 5001 (tentativa $i)"
    break
  fi
  echo "Aguardando app subir... ($i/10)"
  sleep 2
done

echo '🔥 Executando warmup...'
sh ./docker_assets/warmup.sh

echo '✅ Pronto! Container rodando. (PID da app: '"$APP_PID"')'

# Mantém o container rodando enquanto a aplicação estiver viva
wait $APP_PID
