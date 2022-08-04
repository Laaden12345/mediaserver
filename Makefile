up:
	docker compose up --build -d

up-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build

down: 
	docker compose down