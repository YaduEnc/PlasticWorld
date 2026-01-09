# Testing with Real Firebase ID Token

## Step-by-Step Guide

### Step 1: Get Your Firebase Web App Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **platicworld-f671a**
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** → **Web** (</> icon)
6. Copy the `firebaseConfig` object

### Step 2: Update the HTML File

1. Open `get-firebase-token.html` in your editor
2. Replace the `firebaseConfig` object with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",  // Your actual API key
    authDomain: "platicworld-f671a.firebaseapp.com",
    projectId: "platicworld-f671a",
    storageBucket: "platicworld-f671a.appspot.com",
    messagingSenderId: "123456789",  // Your actual sender ID
    appId: "1:123456789:web:abc123"  // Your actual app ID
};
```

### Step 3: Start Your Backend Server

```bash
npm run dev
```

You should see:
```
✅ Firebase initialized
✅ PostgreSQL connected
✅ Redis connected
✅ Server running on port 3000
```

### Step 4: Open the HTML File

1. Open `get-firebase-token.html` in your web browser
2. Click **"Sign In with Google"**
3. Sign in with your Google account
4. The ID Token will appear in the textarea

### Step 5: Test the API

#### Option A: Using the HTML Page (Easiest)
1. After signing in, click **"Test API with this Token"** button
2. Check the browser console for the full response
3. The response will show your access token and user info

#### Option B: Using cURL

1. Copy the ID Token from the HTML page
2. Run this command:

```bash
curl -X POST http://localhost:3000/api/v1/auth/google-signin \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_FIREBASE_ID_TOKEN_HERE",
    "deviceInfo": {
      "deviceName": "My MacBook",
      "deviceType": "web"
    }
  }' | python3 -m json.tool
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "accessExpiresAt": "2026-01-09T10:15:00.000Z",
    "refreshExpiresAt": "2026-01-16T10:00:00.000Z",
    "user": {
      "id": "uuid-here",
      "firebaseUid": "firebase-uid",
      "email": "your@email.com",
      "name": "Your Name",
      "isProfileComplete": false
    },
    "device": {
      "id": "device-uuid",
      "deviceName": "My MacBook",
      "deviceType": "web"
    }
  }
}
```

#### Option C: Using the Test Script

```bash
# Set your Firebase ID token
export FIREBASE_ID_TOKEN="your-token-here"

# Run the test script
./test-auth-real.sh
```

### Step 6: Complete User Profile

After signing in, complete your profile:

```bash
# Use the accessToken from the sign-in response
curl -X POST http://localhost:3000/api/v1/auth/complete-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "username": "johndoe",
    "age": 25,
    "phoneNumber": "+1234567890"
  }' | python3 -m json.tool
```

### Step 7: Test Other Endpoints

#### Get All Sessions
```bash
curl -X GET http://localhost:3000/api/v1/auth/sessions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" | python3 -m json.tool
```

#### Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }' | python3 -m json.tool
```

#### Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" | python3 -m json.tool
```

## Quick Test Checklist

- [ ] Firebase config added to HTML file
- [ ] Backend server running (`npm run dev`)
- [ ] Signed in with Google in HTML page
- [ ] Got Firebase ID token
- [ ] Tested `/auth/google-signin` endpoint
- [ ] Received access token and refresh token
- [ ] Tested `/auth/complete-profile` endpoint
- [ ] Tested `/auth/sessions` endpoint
- [ ] Tested `/auth/refresh` endpoint
- [ ] Tested `/auth/logout` endpoint

## Troubleshooting

### "Missing Firebase configuration" error
- Check that `.env` file has all Firebase credentials
- Verify `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` are set

### "Invalid ID token" error
- Make sure you're using a fresh token (they expire after 1 hour)
- Verify the token is from the correct Firebase project
- Check that Google Sign-In is enabled in Firebase Console

### "Authentication required" error
- Make sure you're including the `Authorization: Bearer TOKEN` header
- Verify the access token hasn't expired (15 minutes)
- Use the refresh token to get a new access token

### Token expires quickly
- Access tokens expire in 15 minutes (by design)
- Use refresh tokens (valid for 7 days) to get new access tokens
- The HTML page auto-refreshes tokens every 50 minutes

## Next Steps

Once authentication is working:
1. Save your access token for testing other endpoints
2. Test the complete authentication flow
3. Move to Phase 3: User Service
