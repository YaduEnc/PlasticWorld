#!/bin/bash

# Stop all services

set -e

echo "🛑 Stopping PlasticWorld services..."

docker compose -f docker-compose.prod.yml down

echo "✅ Services stopped!"
