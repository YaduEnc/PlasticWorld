#!/bin/bash

# Real Firebase ID Token Testing Script
# Usage: FIREBASE_ID_TOKEN="your-token" ./test-auth-real.sh

BASE_URL="http://localhost:3000/api/v1"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$FIREBASE_ID_TOKEN" ]; then
    echo -e "${RED}❌ Error: FIREBASE_ID_TOKEN environment variable is not set${NC}"
    echo ""
    echo "Usage:"
    echo "  export FIREBASE_ID_TOKEN='your-firebase-id-token'"
    echo "  ./test-auth-real.sh"
    echo ""
    exit 1
fi

echo "=========================================="
echo "Real Firebase ID Token Testing"
echo "=========================================="
echo ""

# Test 1: Google Sign-In with real token
echo "Test 1: Google Sign-In"
echo "---------------------"
SIGNIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/google-signin" \
  -H "Content-Type: application/json" \
  -d "{\"idToken\":\"$FIREBASE_ID_TOKEN\"}")

echo "$SIGNIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SIGNIN_RESPONSE"

# Extract tokens from response
ACCESS_TOKEN=$(echo "$SIGNIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('accessToken', ''))" 2>/dev/null)
REFRESH_TOKEN=$(echo "$SIGNIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('refreshToken', ''))" 2>/dev/null)
USER_ID=$(echo "$SIGNIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('user', {}).get('id', ''))" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Sign-in failed. Check the error above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Sign-in successful!${NC}"
echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo "User ID: $USER_ID"
echo ""

# Test 2: Complete Profile
echo "Test 2: Complete Profile"
echo "----------------------"
PROFILE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/complete-profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "age": 25,
    "phoneNumber": "+1234567890"
  }')

echo "$PROFILE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROFILE_RESPONSE"
echo ""

# Test 3: Get Sessions
echo "Test 3: Get All Sessions"
echo "----------------------"
SESSIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$SESSIONS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SESSIONS_RESPONSE"
echo ""

# Test 4: Refresh Token
echo "Test 4: Refresh Access Token"
echo "---------------------------"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REFRESH_RESPONSE"

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('accessToken', ''))" 2>/dev/null)

if [ ! -z "$NEW_ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✅ Token refreshed successfully!${NC}"
    ACCESS_TOKEN=$NEW_ACCESS_TOKEN
fi
echo ""

# Test 5: Logout
echo "Test 5: Logout"
echo "-------------"
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$LOGOUT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGOUT_RESPONSE"
echo ""

echo "=========================================="
echo -e "${GREEN}All Tests Complete!${NC}"
echo "=========================================="
