COMPOSE := docker compose --env-file .env.local -f compose.yaml
EDGE := docker compose --env-file .env.local -f compose.edge.yaml
DEV := $(COMPOSE) --profile dev
PREVIEW := $(COMPOSE) --profile preview
STACK := $(COMPOSE) --profile dev --profile preview

.DEFAULT_GOAL := help

.PHONY: help up down preview shell remove

help:
	@printf 'Usage:\n  make <target>\n\n'
	@printf 'Targets:\n'
	@printf '  help         Show available commands\n'
	@printf '  up           Start edge + dev stack (foreground)\n'
	@printf '  down         Stop stack and remove volumes\n'
	@printf '  preview      Start edge + preview stack (foreground)\n'
	@printf '  shell        Open a shell in the turbo container\n'
	@printf '  remove       Tear down everything, images, and clean workspace\n'

up:
	$(EDGE) up -d
	$(DEV) up

down:
	$(EDGE) down --remove-orphans
	$(STACK) down --volumes --remove-orphans

preview:
	$(EDGE) up -d
	$(PREVIEW) up

shell:
	$(DEV) exec -it turbo sh

remove:
	$(STACK) down --rmi all --volumes --remove-orphans
	$(EDGE) down --remove-orphans
	pnpm run clean
