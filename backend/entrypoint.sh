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

# run backend to initialize the database
python -m src.app.scripts.init_db

# run the load_problems script to populate problems table
echo "📦 Loading problems into the database..."
python -m src.app.scripts.load_problems

# start the fastapi server
echo "🚀 Starting FastAPI server..."
# For HTTP use:
# uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# For HTTPS use:
uvicorn app.main:app --ssl-keyfile=./certs/key.pem --ssl-certfile=./certs/cert.pem --host 0.0.0.0 --port 8000
