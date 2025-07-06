#!/bin/sh
set -e

echo '📡 Iniciando warmup - enviando manifest para API...'

# Aguarda o manifest.json estar disponível
MANIFEST_PATH="/app/dist/manifest.json"
TIMEOUT=30
COUNTER=0

while [ ! -f "$MANIFEST_PATH" ] && [ $COUNTER -lt $TIMEOUT ]; do
    echo "Aguardando manifest.json... ($COUNTER/$TIMEOUT)"
    sleep 1
    COUNTER=$((COUNTER + 1))
done

if [ ! -f "$MANIFEST_PATH" ]; then
    echo "❌ Erro: manifest.json não encontrado após $TIMEOUT segundos"
    exit 1
fi

echo "✅ Manifest encontrado, executando script de envio..."

# Executa o script Node.js para enviar o manifest
node ./docker_assets/warmup.js

echo "🏁 Warmup concluído."
