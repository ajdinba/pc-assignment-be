# Check if config.env exists - if so, include it
ifneq (,$(wildcard config.env))
	include config.env
	export
endif

# https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html
.PHONY: run-db
run-db:
	docker compose -f docker-compose-db.yaml up

.PHONY: run-be
run-be:
	cd backend && \
	npm i && \
	PORT=$(BACKEND_PORT) DB_PORT=$(DB_PORT) npm run dev

.PHONY: run-fe
run-fe:
	cd BankApp-Test && \
	npm i && \
	npm run dev

# This target generates the database models using `kysely-codegen`
# https://github.com/RobinBlomberg/kysely-codegen
.PHONY: gen-models
gen-models:
	# CLI arguments explained:
	# https://github.com/RobinBlomberg/kysely-codegen?tab=readme-ov-file#cli-arguments
	cd backend && \
	npm exec kysely-codegen -- \
	--url mysql://root:$(DB_PASSWORD)@localhost:$(DB_PORT)/$(DB_NAME) \
	--out-file models.d.ts \
	--singularize \
	--camel-case
