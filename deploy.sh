#!/bin/bash

# PlasticWorld Production Deployment Script
# This script builds and deploys the application

set -e  # Exit on error

echo "🚀 Starting PlasticWorld Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found!${NC}"
    echo "Please copy env.production.example to .env.production and configure it."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building Docker images...${NC}"
# Export env vars for build (Docker Compose needs them during build)
export $(grep -v '^#' .env.production | xargs)
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down

echo -e "${YELLOW}🗄️  Starting database services...${NC}"
docker compose -f docker-compose.prod.yml up -d postgres redis

echo -e "${YELLOW}⏳ Waiting for databases to be ready...${NC}"
sleep 10

echo -e "${YELLOW}🔄 Running database migrations...${NC}"
docker compose -f docker-compose.prod.yml run --rm backend npm run db:migrate:prod

echo -e "${YELLOW}🚀 Starting all services...${NC}"
docker compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 15

echo -e "${YELLOW}🏥 Checking health...${NC}"
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${RED}❌ Health check failed!${NC}"
    echo "Check logs with: docker compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Services are running:"
echo "  - Backend API: http://localhost:3000"
echo "  - Health Check: http://localhost:3000/health"
echo ""
echo "Useful commands:"
echo "  - View logs: docker compose -f docker-compose.prod.yml logs -f"
echo "  - Stop services: docker compose -f docker-compose.prod.yml down"
echo "  - Restart: docker compose -f docker-compose.prod.yml restart"
