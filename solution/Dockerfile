# Dockerfile

FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN groupadd -r celerygroup && useradd -r -g celerygroup celeryuser

RUN chown -R celeryuser:celerygroup /app

USER celeryuser

CMD ["celery", "-A", "tasks", "worker", "--beat", "--loglevel=info"]



