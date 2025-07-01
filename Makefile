SHELL:=/bin/bash
ARGS = $(filter-out $@,$(MAKECMDGOALS))
MAKEFLAGS += --silent
BASE_PATH=${PWD}
DOCKER_COMPOSE_FILE=$(shell echo -f docker-compose.yml -f docker-compose.override.yml)

include .env
export $(shell sed 's/=.*//' .env)

show_env:
	# Mostra qual arquivo de compose está sendo usado
	sh -c "if [ \"${ENV_PRINTED:-0}\" != \"1\" ]; \
	then \
		echo DOCKER_COMPOSE_FILE = \"${DOCKER_COMPOSE_FILE}\"; \
	fi; \
	ENV_PRINTED=1;"

_cp_env_file:
	cp -f ./.env.sample ./.env

# 🚀 Inicialização do projeto
init: _cp_env_file
	echo "Ambiente configurado com sucesso!"

# 🔄 Rebuild total dos containers
_rebuild: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} down
	docker-compose ${DOCKER_COMPOSE_FILE} build --no-cache --force-rm

# ▶️ Subir containers (com build)
up_clean: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} up --build

# ▶️ Subir containers (modo detached)
up: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} up -d --remove-orphans

# ▶️ Derrubar containers
down: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} down -v

# ▶️ Carregar sementes
seed: show_env
	docker exec -it kafka-dev sh /kafka-seed.sh

# 🚀 Executar build de produção localmente
prod_build:
	docker-compose -f docker-compose.yml up --build

# 🔄 Gerar esquema do banco de dados
database_generate: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} exec app pnpm run db:generate

# 🗄️ Executar migrações do banco de dados
migrate: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} exec app pnpm run db:migrate

# 📜 Logs do app
log: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} logs -f --tail 200 app

logs: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} logs -f --tail 200

# ⏹️ Parar containers
stop: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} stop

# 📌 Status dos containers
status: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} ps

# 🔄 Reiniciar containers
restart: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} restart

# 🛠️ Acessar shell do container
sh: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} exec ${ARGS} sh

# 🧹 Limpar permissões do projeto
chown_project:
	sudo chown -R "${USER}:${USER}" ./

# 📜 Logs de um serviço específico
logger: show_env
	docker-compose ${DOCKER_COMPOSE_FILE} logs -f --tail 200 ${ARGS}
