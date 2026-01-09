# .env.production Setup Guide

## ✅ What You Can Copy from Your Local .env

You can copy most values from your local `.env` file, but **MUST CHANGE** these for production:

## 🔴 MUST CHANGE These Values:

### 1. Server Configuration
```env
NODE_ENV=production                    # ← Change from "development"
BASE_URL=https://plasticworld.yaduraj.me        # ← Change from "http://localhost:3000"
```

### 2. Database Configuration
```env
DB_HOST=postgres                       # ← Change from "localhost" (Docker service name)
DB_USER=plasticworld_user              # ← Can keep or change
DB_PASSWORD=YOUR_STRONG_PASSWORD       # ← Generate new strong password!
```

**Generate database password:**
```bash
openssl rand -base64 32
```

### 3. Redis Configuration
```env
REDIS_HOST=redis                       # ← Change from "localhost" (Docker service name)
REDIS_PASSWORD=YOUR_STRONG_PASSWORD    # ← Generate new strong password!
```

**Generate Redis password:**
```bash
openssl rand -base64 32
```

### 4. JWT Secret
```env
JWT_SECRET=YOUR_64_CHAR_SECRET          # ← Generate new 64+ character secret!
```

**Generate JWT secret:**
```bash
openssl rand -base64 64
```

### 5. CORS Origins
```env
CORS_ORIGIN=https://yaduraj.me,https://www.yaduraj.me,https://app.yaduraj.me
WS_CORS_ORIGIN=https://yaduraj.me,https://www.yaduraj.me,https://app.yaduraj.me
```
**Change to your production frontend domains!**

### 6. Firebase (Copy from your local .env)
```env
FIREBASE_PROJECT_ID=platicworld-f671a              # ← Copy from your .env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"  # ← Copy from your .env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...        # ← Copy from your .env
```

## ✅ What You Can Keep the Same:

- `PORT=3000`
- `API_VERSION=v1`
- `DB_PORT=5432`
- `DB_NAME=plasticworld_db`
- `REDIS_PORT=6379`
- `REDIS_DB=0`
- `JWT_ACCESS_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=7d`
- `JWT_ISSUER=plasticworld-api`
- All other settings

## 📝 Quick Setup Steps:

1. **Copy your local `.env` to `env.production`**
2. **Change the values marked above**
3. **Generate new passwords for DB and Redis**
4. **Generate new JWT secret**
5. **Update CORS origins to your production domains**

## 🔐 Security Reminder:

- **Never commit `.env.production` to git!**
- Use strong, unique passwords
- Keep secrets secure
- The file should have permissions: `chmod 600 .env.production`
