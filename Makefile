image:
	docker build -t cboard/cboard .

run:
	docker run -p 8080:80 cboard/cboard:latest