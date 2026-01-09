# Docker Production Deployment Plan

## 🎯 Deployment Architecture

### Overview
- **Domain**: `api.yaduraj.me` (subdomain)
- **Infrastructure**: Fully Dockerized on Linux server
- **Tunnel**: Cloudflare Tunnel (cloudflared)
- **Services**: Backend API + PostgreSQL + Redis (all in Docker)

### Architecture Diagram
```
Internet
   ↓
Cloudflare (api.yaduraj.me)
   ↓
Cloudflare Tunnel (cloudflared)
   ↓
Linux Server (Docker Network)
   ├── Backend API Container (Node.js)
   ├── PostgreSQL Container
   └── Redis Container
```

## 📋 What We Need to Create

### 1. **Dockerfile** (for Backend API)
- Multi-stage build for production
- Node.js 18+ base image
- Optimized for production
- Health checks

### 2. **docker-compose.prod.yml** (Production Docker Compose)
- Backend API service
- PostgreSQL service (production config)
- Redis service (production config)
- Network configuration
- Volume management
- Health checks
- Restart policies

### 3. **Production Environment File** (.env.production)
- Production database credentials
- Production Redis credentials
- JWT secrets
- Firebase credentials
- CORS origins (your frontend domains)
- API base URL

### 4. **Cloudflare Tunnel Configuration**
- cloudflared config file
- Route api.yaduraj.me → localhost:3000
- SSL/TLS handled by Cloudflare

### 5. **Deployment Scripts**
- `deploy.sh` - Deployment automation
- `start.sh` - Start all services
- `stop.sh` - Stop all services
- `logs.sh` - View logs

### 6. **Production README**
- Step-by-step deployment guide
- Cloudflare Tunnel setup
- Domain configuration
- Troubleshooting

## 🔧 Deployment Steps Overview

### Step 1: Prepare Server
- Install Docker & Docker Compose
- Install Cloudflare Tunnel (cloudflared)
- Create deployment directory
- Set up firewall rules

### Step 2: Configure Cloudflare
- Add `api.yaduraj.me` subdomain in Cloudflare DNS
- Set up Cloudflare Tunnel
- Configure tunnel to route to localhost:3000

### Step 3: Deploy Application
- Clone repository on server
- Create production .env file
- Build Docker images
- Run database migrations
- Start all services

### Step 4: Verify Deployment
- Check health endpoint
- Test API endpoints
- Verify WebSocket connection
- Check logs

## 🐳 Docker Services

### Backend API Container
- **Image**: Custom built from Dockerfile
- **Port**: 3000 (internal, not exposed to host)
- **Depends on**: PostgreSQL, Redis
- **Volumes**: Logs, environment file
- **Health Check**: `/health` endpoint

### PostgreSQL Container
- **Image**: postgres:15-alpine
- **Port**: 5432 (internal only)
- **Volumes**: Database data persistence
- **Health Check**: pg_isready

### Redis Container
- **Image**: redis:7-alpine
- **Port**: 6379 (internal only)
- **Volumes**: Redis data persistence
- **Health Check**: redis-cli ping

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit .env files
   - Use strong passwords
   - Rotate secrets regularly

2. **Network Security**
   - All containers on private network
   - Only Cloudflare Tunnel exposes to internet
   - No direct port exposure

3. **Database Security**
   - Strong passwords
   - Connection limits
   - SSL connections (if needed)

4. **Redis Security**
   - Password protection
   - Bind to localhost only

5. **Cloudflare Security**
   - DDoS protection
   - WAF rules
   - Rate limiting
   - SSL/TLS encryption

## 📊 Production Configuration

### Environment Variables Needed
```env
NODE_ENV=production
PORT=3000
API_VERSION=v1
BASE_URL=https://api.yaduraj.me

# Database (Docker service names)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=plasticworld_db
DB_USER=plasticworld_user
DB_PASSWORD=<strong-password>
DB_SSL=false

# Redis (Docker service name)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<strong-password>

# JWT
JWT_SECRET=<64-char-random-string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Firebase
FIREBASE_PROJECT_ID=<your-project-id>
FIREBASE_PRIVATE_KEY="<your-private-key>"
FIREBASE_CLIENT_EMAIL=<your-client-email>

# CORS (your frontend domains)
CORS_ORIGIN=https://yaduraj.me,https://www.yaduraj.me,https://app.yaduraj.me

# Cloudflare Tunnel
CLOUDFLARE_TUNNEL_URL=https://api.yaduraj.me
```

## 🚀 Deployment Flow

1. **Server Setup** (One-time)
   ```bash
   # Install Docker
   # Install Docker Compose
   # Install Cloudflare Tunnel
   # Create directories
   ```

2. **Cloudflare Setup** (One-time)
   ```bash
   # Install cloudflared
   # Authenticate with Cloudflare
   # Create tunnel
   # Configure DNS
   ```

3. **Application Deployment** (Every update)
   ```bash
   # Pull latest code
   # Update .env if needed
   # Build Docker images
   # Run migrations
   # Restart services
   ```

## 📝 Files to Create

1. `Dockerfile` - Backend container definition
2. `docker-compose.prod.yml` - Production compose file
3. `.dockerignore` - Exclude files from Docker build
4. `cloudflared-config.yml` - Cloudflare Tunnel config
5. `deploy.sh` - Deployment script
6. `start.sh` - Start services script
7. `stop.sh` - Stop services script
8. `logs.sh` - View logs script
9. `PRODUCTION_DEPLOYMENT.md` - Complete deployment guide

## ✅ Pre-Deployment Checklist

- [ ] Server has Docker & Docker Compose installed
- [ ] Cloudflare Tunnel (cloudflared) installed
- [ ] Domain `api.yaduraj.me` added to Cloudflare
- [ ] Firebase credentials ready
- [ ] Strong passwords generated
- [ ] JWT secret generated (64+ characters)
- [ ] Database backup strategy planned
- [ ] Monitoring setup (optional)
- [ ] SSL certificate (handled by Cloudflare)

## 🔄 Update Process

When updating the application:
1. Pull latest code: `git pull`
2. Rebuild images: `docker-compose -f docker-compose.prod.yml build`
3. Run migrations: `docker-compose -f docker-compose.prod.yml run backend npm run db:migrate:prod`
4. Restart services: `docker-compose -f docker-compose.prod.yml up -d`
5. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`

## 📈 Monitoring & Maintenance

- **Logs**: Docker logs + Winston file logs
- **Health Checks**: `/health` endpoint
- **Database Backups**: Daily automated backups
- **Updates**: Regular security updates
- **Monitoring**: Cloudflare Analytics + Server monitoring

---

## 🎯 Next Steps

1. **Review this plan** - Confirm architecture
2. **Create Dockerfile** - Backend container
3. **Create docker-compose.prod.yml** - Production services
4. **Create deployment scripts** - Automation
5. **Create Cloudflare config** - Tunnel setup
6. **Create deployment guide** - Step-by-step instructions

**Ready to proceed?** Let me know if this architecture looks good, and I'll start creating all the necessary files!
