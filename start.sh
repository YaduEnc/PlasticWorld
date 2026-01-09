#!/bin/bash

# Start all services

set -e

echo "🚀 Starting PlasticWorld services..."

docker compose -f docker-compose.prod.yml up -d

echo "✅ Services started!"
echo ""
echo "View logs: docker compose -f docker-compose.prod.yml logs -f"
