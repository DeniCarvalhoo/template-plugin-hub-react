# Base da imagem
FROM node:20-alpine AS production

# Instalar curl e pnpm globalmente
RUN npm install -g pnpm@10.4.0

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

EXPOSE 5001
CMD ["pnpm", "start"]
