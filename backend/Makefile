install:
	@curl -sSL https://install.python-poetry.org | python3 -
	@poetry install

run:
	@poetry run fastapi dev main.py

lint:
	@poetry run isort .
	@poetry run black .
	@poetry run flake8
