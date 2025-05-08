FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN pip install uv && uv pip install --system --no-cache-dir -r uv.lock

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY . .

RUN chmod +x ./entrypoint.sh
RUN chmod +x ./entrypoint-http.sh
