# Phase 2: Authentication Service - Preparation Guide

## 📋 What You Need Before Starting

### 1. Firebase Project Setup (Required)

You need a Firebase project for Google Sign-In authentication.

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select existing project
3. Follow the setup wizard
4. **Note your Project ID** (e.g., `my-project-12345`)

#### Step 2: Enable Google Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Add your OAuth consent screen details if prompted
4. Save the configuration

#### Step 3: Create Service Account (For Backend)
1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file (this contains your private key)
4. **IMPORTANT**: Keep this file secure! Never commit it to git.

#### Step 4: Extract Required Information
From the downloaded JSON file, you'll need:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY` (the entire key including `-----BEGIN PRIVATE KEY-----`)
- `client_email` → `FIREBASE_CLIENT_EMAIL`

**Example JSON structure:**
```json
{
  "type": "service_account",
  "project_id": "my-project-12345",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@my-project-12345.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

### 2. Environment Variables Setup

Update your `.env` file with Firebase credentials:

```env
# Firebase Admin SDK (from Step 3 above)
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# JWT Configuration (generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=plasticworld-api

# Bcrypt (for password hashing if needed)
BCRYPT_ROUNDS=12
```

#### Generate Strong JWT Secret
```bash
# Option 1: Using OpenSSL
openssl rand -base64 64

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

### 3. Database Tables (We'll Create These)

We'll create these tables in Phase 2:
- `users` - User profiles
- `sessions` - Active user sessions
- `devices` - User devices (for multi-device support)

**You don't need to create them manually** - we'll provide migration scripts.

---

### 4. What We'll Build in Phase 2

✅ **Authentication Routes:**
- `POST /api/v1/auth/google-signin` - Google OAuth sign-in
- `POST /api/v1/auth/complete-profile` - Complete user profile after first login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/sessions` - Get all active sessions
- `DELETE /api/v1/auth/sessions/:deviceId` - Revoke specific session

✅ **Services:**
- Firebase Admin SDK integration
- JWT token generation and validation
- Session management (Redis)
- User profile creation

✅ **Middleware:**
- JWT authentication middleware
- Token validation
- User context injection

✅ **Database:**
- Users table migration
- Sessions table migration
- Devices table migration

---

## 🚀 Quick Setup Checklist

Before we start coding, make sure you have:

- [ ] Firebase project created
- [ ] Google authentication enabled in Firebase
- [ ] Service account JSON downloaded
- [ ] Firebase credentials extracted (project_id, private_key, client_email)
- [ ] JWT_SECRET generated (64+ characters)
- [ ] `.env` file updated with all credentials
- [ ] Docker containers running (PostgreSQL & Redis)

---

## 📝 Firebase Private Key Format

**Important**: The private key in `.env` must be formatted correctly:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Note**: 
- Keep the quotes around the entire key
- Keep the `\n` characters (they represent newlines)
- The key should be on a single line in the .env file

---

## 🔒 Security Notes

1. **Never commit** `.env` file to git (already in .gitignore)
2. **Never commit** Firebase service account JSON to git
3. **Use strong JWT secrets** (64+ characters)
4. **Rotate secrets** in production regularly
5. **Keep Firebase credentials secure** - they have admin access

---

## ❓ Common Questions

**Q: Do I need a paid Firebase plan?**
A: No, the free Spark plan is sufficient for development and testing.

**Q: Can I test without Firebase?**
A: For Phase 2, Firebase is required. We'll implement Google Sign-In which requires Firebase.

**Q: What if I don't have a Firebase project yet?**
A: Create one at https://console.firebase.google.com/ - it takes 5 minutes.

**Q: Can I use a different OAuth provider?**
A: Phase 2 focuses on Google Sign-In via Firebase. Other providers can be added later.

---

## 🎯 Next Steps

Once you have:
1. ✅ Firebase project set up
2. ✅ Service account JSON downloaded
3. ✅ Credentials added to `.env`
4. ✅ JWT_SECRET generated

**Let me know and we'll start building Phase 2!**

I'll create:
- Database migrations
- Authentication routes
- JWT service
- Firebase integration
- Session management
- Complete authentication flow

---

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [JWT.io](https://jwt.io/) - For testing JWT tokens
