# Production Deployment Guide

## 🎯 Deployment Strategy

### Development (Local Mac)
- **Database**: Docker Compose (PostgreSQL + Redis containers)
- **Application**: Runs locally on Mac
- **Purpose**: Development and testing

### Production (Server)
- **Database**: PostgreSQL and Redis installed directly on server (or separate database server)
- **Application**: Deployed on server
- **Purpose**: Production environment

---

## 📋 Production Server Setup

### Prerequisites
- Ubuntu/Debian server (20.04+ recommended)
- Root or sudo access
- Domain name configured (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

### Step 1: Install PostgreSQL on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE plasticworld_db;"
sudo -u postgres psql -c "CREATE USER plasticworld_user WITH ENCRYPTED PASSWORD 'your-secure-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE plasticworld_db TO plasticworld_user;"
sudo -u postgres psql -c "ALTER USER plasticworld_user CREATEDB;"

# Enable UUID extension
sudo -u postgres psql -d plasticworld_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
sudo -u postgres psql -d plasticworld_db -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";"

# Configure PostgreSQL for remote access (if needed)
# Edit /etc/postgresql/15/main/postgresql.conf
# Set: listen_addresses = 'localhost' (or '*' for remote access)
# Edit /etc/postgresql/15/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5
# Restart: sudo systemctl restart postgresql
```

### Step 2: Install Redis on Server

```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your-redis-password
# Set: bind 127.0.0.1 (or server IP for remote access)

# Start and enable Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

### Step 3: Install Node.js on Server

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version
```

### Step 4: Deploy Application

```bash
# Clone repository (or upload files)
git clone <your-repo-url> /opt/plasticworld
cd /opt/plasticworld

# Install dependencies
npm install --production

# Build the application
npm run build

# Create production .env file
nano .env
# Configure with production values:
# - DB_HOST=localhost (or database server IP)
# - DB_PASSWORD=your-secure-password
# - REDIS_PASSWORD=your-redis-password
# - JWT_SECRET=strong-production-secret
# - NODE_ENV=production
```

### Step 5: Setup Process Manager (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
cd /opt/plasticworld
pm2 start dist/server.js --name plasticworld-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown

# Monitor application
pm2 status
pm2 logs plasticworld-api
pm2 monit
```

### Step 6: Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/plasticworld

# Add configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # API endpoints
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/plasticworld /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### Step 8: Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🔧 Production Environment Variables

Create `.env` on server with these values:

```env
NODE_ENV=production
PORT=3000
API_VERSION=v1
BASE_URL=https://your-domain.com

# PostgreSQL (on server)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plasticworld_db
DB_USER=plasticworld_user
DB_PASSWORD=your-secure-password
DB_SSL=false
DB_POOL_MIN=5
DB_POOL_MAX=20

# Redis (on server)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# JWT (use strong secret)
JWT_SECRET=your-very-strong-secret-min-64-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_DIR=/var/log/plasticworld
```

---

## 📊 Monitoring & Maintenance

### Database Backup

```bash
# Create backup script
sudo nano /opt/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U plasticworld_user -d plasticworld_db > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /opt/backup-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /opt/backup-db.sh
```

### Application Updates

```bash
# Pull latest code
cd /opt/plasticworld
git pull origin main

# Install new dependencies
npm install --production

# Rebuild
npm run build

# Restart application
pm2 restart plasticworld-api

# Check logs
pm2 logs plasticworld-api
```

---

## 🔒 Security Checklist

- [ ] Strong database passwords
- [ ] Strong Redis password
- [ ] Strong JWT secret (64+ characters)
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] Regular security updates
- [ ] Database backups automated
- [ ] Log rotation configured
- [ ] Rate limiting enabled
- [ ] Environment variables secured (not in git)

---

## 📝 Notes

- **Database Location**: PostgreSQL and Redis run directly on the server (not in Docker)
- **Application**: Runs via PM2 process manager
- **Reverse Proxy**: Nginx handles routing and SSL
- **Monitoring**: Use PM2 monitoring and application logs
- **Backups**: Automated daily database backups

---

## 🚀 Quick Deployment Commands

```bash
# Deploy new version
cd /opt/plasticworld
git pull
npm install --production
npm run build
pm2 restart plasticworld-api

# Check status
pm2 status
pm2 logs plasticworld-api

# Database backup
pg_dump -U plasticworld_user plasticworld_db > backup.sql
```

---

**Remember**: This guide is for production deployment after testing phases are complete. For now, continue development locally on your Mac with Docker Compose.
