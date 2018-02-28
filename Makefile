image:
	docker build -t cboard .

run:
	docker run -p 5000:5000 cboard:latest