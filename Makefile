image:
	docker build -t cboard/cboard .

run:
	docker run -p 5000:80 cboard/cboard:latest