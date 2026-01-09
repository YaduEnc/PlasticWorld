# Production Deployment Guide

Complete step-by-step guide to deploy PlasticWorld backend to production using Docker and Cloudflare Tunnel.

## 📋 Prerequisites

✅ **Already Installed:**
- Ubuntu 24.04.3 LTS
- Docker 29.1.3
- Docker Compose v5.0.1
- Cloudflare Tunnel (cloudflared) 2025.11.1

## 🚀 Deployment Steps

### Step 1: Prepare Deployment Directory

```bash
# Create deployment directory
sudo mkdir -p /opt/plasticworld
sudo chown $USER:$USER /opt/plasticworld
cd /opt/plasticworld

# Clone repository (or upload files)
git clone https://github.com/YaduEnc/PlasticWorld.git .
# OR if you need to upload files manually, use scp from your Mac
```

### Step 2: Generate Strong Passwords

```bash
# Generate database password
openssl rand -base64 32

# Generate Redis password
openssl rand -base64 32

# Generate JWT secret (64 characters)
openssl rand -base64 64
```

**Save these passwords securely!** You'll need them for the .env.production file.

### Step 3: Create Production Environment File

```bash
# Copy example file
cp env.production.example .env.production

# Edit the file
nano .env.production
```

**Fill in these required values:**
- `DB_PASSWORD` - Use the generated database password
- `REDIS_PASSWORD` - Use the generated Redis password
- `JWT_SECRET` - Use the generated JWT secret (64 chars)
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Your Firebase private key (keep the \n characters)
- `FIREBASE_CLIENT_EMAIL` - Your Firebase client email
- `CORS_ORIGIN` - Your frontend domains (comma-separated)

### Step 4: Set Up Cloudflare Tunnel

```bash
# Login to Cloudflare (if not already logged in)
cloudflared tunnel login

# Create a new tunnel (if you don't have one)
cloudflared tunnel create plasticworld-api

# This will output a tunnel ID - save it!
# Example: abc123def456...

# List your tunnels to get the ID
cloudflared tunnel list
```

**Note the Tunnel ID** - you'll need it for the config file.

### Step 5: Configure Cloudflare Tunnel

```bash
# Edit the cloudflared config
nano cloudflared-config.yml
```

**Update these values:**
- `tunnel: YOUR_TUNNEL_ID` - Replace with your actual tunnel ID
- `credentials-file: /home/yadurajdoc/.cloudflared/YOUR_TUNNEL_ID.json` - Update path and ID

**Example:**
```yaml
tunnel: abc123def456
credentials-file: /home/yadurajdoc/.cloudflared/abc123def456.json

ingress:
  - hostname: api.yaduraj.me
    service: http://localhost:3000
  - service: http_status:404
```

### Step 6: Configure Cloudflare DNS

1. Go to Cloudflare Dashboard → DNS
2. Add a new record:
   - **Type**: CNAME
   - **Name**: api
   - **Target**: Your tunnel ID (e.g., `abc123def456.cfargotunnel.com`)
   - **Proxy**: ✅ Proxied (orange cloud)
   - **TTL**: Auto

### Step 7: Deploy Application

```bash
# Make scripts executable (if not already)
chmod +x deploy.sh start.sh stop.sh logs.sh

# Run deployment
./deploy.sh
```

This will:
1. Build Docker images
2. Start PostgreSQL and Redis
3. Run database migrations
4. Start the backend API
5. Check health

### Step 8: Start Cloudflare Tunnel

```bash
# Test tunnel configuration
cloudflared tunnel --config cloudflared-config.yml ingress validate

# Run tunnel in background
nohup cloudflared tunnel --config cloudflared-config.yml run > /dev/null 2>&1 &

# Or run as systemd service (recommended)
sudo nano /etc/systemd/system/cloudflared.service
```

**Create systemd service:**
```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=yadurajdoc
ExecStart=/usr/local/bin/cloudflared tunnel --config /opt/plasticworld/cloudflared-config.yml run
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

### Step 9: Verify Deployment

```bash
# Check local health
curl http://localhost:3000/health

# Check via Cloudflare (should work after DNS propagates)
curl https://api.yaduraj.me/health

# Check Docker containers
docker ps

# Check logs
./logs.sh
```

### Step 10: Test API Endpoints

```bash
# Test API root
curl https://api.yaduraj.me/api/v1

# Test health
curl https://api.yaduraj.me/health
```

## 🔧 Useful Commands

### View Logs
```bash
# All services
./logs.sh

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f postgres
docker compose -f docker-compose.prod.yml logs -f redis
```

### Restart Services
```bash
# Restart all
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart backend
```

### Stop Services
```bash
./stop.sh
```

### Start Services
```bash
./start.sh
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and redeploy
./deploy.sh
```

### Database Backup
```bash
# Backup database
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U plasticworld_user plasticworld_db > backup_$(date +%Y%m%d).sql

# Restore database
docker compose -f docker-compose.prod.yml exec -T postgres psql -U plasticworld_user plasticworld_db < backup_20260109.sql
```

## 🔍 Troubleshooting

### Health Check Fails
```bash
# Check backend logs
docker compose -f docker-compose.prod.yml logs backend

# Check if backend is running
docker ps | grep backend

# Restart backend
docker compose -f docker-compose.prod.yml restart backend
```

### Database Connection Issues
```bash
# Check postgres logs
docker compose -f docker-compose.prod.yml logs postgres

# Test database connection
docker compose -f docker-compose.prod.yml exec postgres psql -U plasticworld_user -d plasticworld_db -c "SELECT version();"
```

### Redis Connection Issues
```bash
# Check redis logs
docker compose -f docker-compose.prod.yml logs redis

# Test redis connection
docker compose -f docker-compose.prod.yml exec redis redis-cli ping
```

### Cloudflare Tunnel Not Working
```bash
# Check tunnel status
sudo systemctl status cloudflared

# Check tunnel logs
sudo journalctl -u cloudflared -f

# Validate config
cloudflared tunnel --config cloudflared-config.yml ingress validate
```

### Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

## 🔐 Security Checklist

- [ ] Strong database password set
- [ ] Strong Redis password set
- [ ] Strong JWT secret (64+ characters)
- [ ] .env.production file has correct permissions (600)
- [ ] Cloudflare Tunnel configured correctly
- [ ] DNS record points to tunnel
- [ ] SSL/TLS enabled in Cloudflare
- [ ] Firewall rules configured (if needed)
- [ ] Regular backups scheduled

## 📊 Monitoring

### Check Service Status
```bash
# Docker containers
docker ps

# System resources
docker stats

# Disk usage
df -h
docker system df
```

### Health Monitoring
- Health endpoint: `https://api.yaduraj.me/health`
- Cloudflare Analytics: Check in Cloudflare Dashboard
- Server monitoring: Use your preferred monitoring tool

## 🔄 Update Process

When you need to update the application:

```bash
cd /opt/plasticworld

# Pull latest code
git pull

# Rebuild and redeploy
./deploy.sh

# Verify health
curl https://api.yaduraj.me/health
```

## 📝 Notes

- All services run in Docker containers
- Data persists in Docker volumes
- Logs are stored in `./logs` directory
- Cloudflare Tunnel handles SSL/TLS
- No need to expose ports to internet
- All communication goes through Cloudflare

---

**Deployment Complete!** 🎉

Your API should be accessible at: `https://api.yaduraj.me`
