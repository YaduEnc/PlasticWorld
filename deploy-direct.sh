#!/bin/bash

# Direct Node.js Deployment Script (without Docker for backend)
# This runs the backend directly on the server while using Docker for PostgreSQL/Redis

set -e

echo "🚀 Starting Direct Node.js Deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found!${NC}"
    exit 1
fi

# Note: Environment variables will be loaded by PM2 from .env.production
# We'll set DB_HOST and REDIS_HOST explicitly for direct connection

# Update DB_HOST and REDIS_HOST to use Docker container IPs or localhost
# Since we're running outside Docker, we need to connect to localhost:5432 and localhost:6379
# But first, let's expose the ports from Docker containers

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

echo -e "${YELLOW}🔨 Building TypeScript...${NC}"
npm run build

echo -e "${YELLOW}🗄️  Ensuring PostgreSQL and Redis are running...${NC}"
docker compose -f docker-compose.prod.yml --env-file .env.production up -d postgres redis

echo -e "${YELLOW}⏳ Waiting for databases to be ready...${NC}"
sleep 5

echo -e "${YELLOW}🔄 Running database migrations...${NC}"
# Update DB_HOST to localhost for migration
DB_HOST=localhost npm run db:migrate:prod

echo -e "${YELLOW}🚀 Starting backend with PM2...${NC}"
# Stop existing PM2 process if running
pm2 delete plasticworld-backend 2>/dev/null || true

# Start with PM2
# Update environment variables for direct connection
DB_HOST=localhost REDIS_HOST=localhost pm2 start dist/server.js \
    --name plasticworld-backend \
    --env production \
    --update-env

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Backend is running with PM2"
echo "  - View logs: pm2 logs plasticworld-backend"
echo "  - Status: pm2 status"
echo "  - Stop: pm2 stop plasticworld-backend"
echo "  - Restart: pm2 restart plasticworld-backend"
echo ""
echo "Testing health endpoint..."
sleep 3
curl -f http://localhost:3000/health && echo -e "\n${GREEN}✅ Health check passed!${NC}" || echo -e "\n${RED}❌ Health check failed${NC}"
