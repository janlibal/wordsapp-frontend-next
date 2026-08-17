.PHONY: dev-up dev-down dev-logs prod-up prod-down prod-logs

dev-up:
	docker compose -p frontend \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		up -d --build

dev-down:
	docker compose -p frontend \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		down

dev-logs:
	docker compose -p frontend \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		logs -f

prod-up:
	docker compose -p frontend \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		up -d --build

prod-down:
	docker compose -p frontend \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		down

prod-logs:
	docker compose -p frontend \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		logs -f