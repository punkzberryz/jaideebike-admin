include .env

compose:
	docker-compose -f docker-compose.dev.yml up -d
compose-down:
	docker-compose -f docker-compose.dev.yml down
db-login:
	docker exec -it ${DB_DOCKER_CONTAINER} bash && psql && \connect ${DB_NAME}
	psql
	\connect ${DB_NAME}
createdb:
	docker exec -it ${DB_DOCKER_CONTAINER} createdb --username=${DB_USER} --owner=${DB_USER} ${DB_NAME}
dropdb:
	docker exec -it ${DB_DOCKER_CONTAINER} dropdb ${DB_NAME}

migrate:
	pnpm prisma generate
	pnpm prisma db push

prepare_prod:
	cp .env .env.bk
	cp .env.prod .env
prepare_dev:
	cp .env .env.bk
	cp .env.dev .env	