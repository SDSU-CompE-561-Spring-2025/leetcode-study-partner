#!/bin/bash

set -e

# wait for the database to be ready

echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h db -p 5432 -U $POSTGRES_USER; do
  sleep 1
done

echo "✅ PostgreSQL is ready!"

# Set Python path so 'app' can be found
export PYTHONPATH=/app/src

# start the fastapi server
echo "🚀 Starting FastAPI server (HTTP)..."
uvicorn app.main:app --host 0.0.0.0 --port 8000