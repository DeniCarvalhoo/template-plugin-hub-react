# Base da imagem
FROM node:20-alpine AS production

# Instalar curl, netcat e pnpm globalmente
RUN apk add --no-cache curl netcat-openbsd && \
    npm install -g pnpm@10.4.0

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos essenciais para instalar dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências (incluindo devDependencies para o build)
RUN pnpm install --frozen-lockfile

# Copiar o restante do código da aplicação
COPY . .
# Gerar migrações do Drizzle e construir a aplicação
RUN pnpm build


# Tornar o entrypoint executável
RUN chmod +x ./docker_assets/entrypoint.sh

# Usar o entrypoint customizado
ENTRYPOINT ["sh", "./docker_assets/entrypoint.sh"]

EXPOSE 5001

CMD []