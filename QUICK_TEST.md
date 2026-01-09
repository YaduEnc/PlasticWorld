# Quick Test Guide - Firebase ID Token

## The Problem
Firebase Authentication requires HTTP/HTTPS protocol. Opening the HTML file directly (`file://`) won't work.

## Solution: Use Local Server

### Option 1: Use the Built-in Server (Easiest)

```bash
# Start the token page server
npm run serve:token
```

Then open: **http://localhost:8080** in your browser

### Option 2: Use Python (if you have Python)

```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open: **http://localhost:8080/get-firebase-token.html**

### Option 3: Use Node.js http-server

```bash
# Install globally (one time)
npm install -g http-server

# Run
http-server -p 8080
```

Then open: **http://localhost:8080/get-firebase-token.html**

## Complete Testing Flow

### Terminal 1: Start Backend Server
```bash
npm run dev
```

### Terminal 2: Start Token Page Server
```bash
npm run serve:token
```

### Browser
1. Open: **http://localhost:8080**
2. Click "Sign In with Google"
3. Sign in with your Google account
4. Copy the ID Token
5. Click "Test API with this Token" to test directly

### Terminal 3: Test with cURL (Optional)
```bash
curl -X POST http://localhost:3000/api/v1/auth/google-signin \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_TOKEN_HERE",
    "deviceInfo": {
      "deviceName": "My MacBook",
      "deviceType": "web"
    }
  }' | python3 -m json.tool
```

## Troubleshooting

### "operation-not-supported-in-this-environment"
- ✅ Use `http://localhost:8080` (not `file://`)
- ✅ Make sure the server is running
- ✅ Check browser console for errors

### "Firebase: Error (auth/popup-closed-by-user)"
- User closed the popup - try again

### "Firebase: Error (auth/popup-blocked)"
- Allow popups in your browser
- Or use redirect sign-in instead

## Quick Commands

```bash
# Start both servers
npm run dev &          # Backend on port 3000
npm run serve:token &  # Token page on port 8080

# Test health
curl http://localhost:3000/health

# Open token page
open http://localhost:8080
```
