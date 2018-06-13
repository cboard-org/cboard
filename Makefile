image:
	docker build -t cboard/cboard .

run:
	docker run -p 5000:3000 cboard/cboard:latest