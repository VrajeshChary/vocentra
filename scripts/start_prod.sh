#!/bin/bash
# Vocentra Production Startup Script
echo "Starting Vocentra AI Engine..."

# 1. Setup logs
mkdir -p logs

# 2. Run Gunicorn with Uvicorn workers
# Timeout is high (10 mins) for long video processing
gunicorn backend.main:app \
    --workers 1 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 600 \
    --access-logfile logs/access.log \
    --error-logfile logs/error.log \
    --log-level info
