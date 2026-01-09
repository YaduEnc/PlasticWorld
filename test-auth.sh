#!/bin/bash

# Authentication API Testing Script
# This script helps test the authentication endpoints

BASE_URL="http://localhost:3000/api/v1"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "PlasticWorld Authentication API Testing"
echo "=========================================="
echo ""

# Check if server is running
echo "Checking if server is running..."
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo -e "${RED}❌ Server is not running. Please start it with: npm run dev${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "-------------------"
HEALTH=$(curl -s http://localhost:3000/health)
echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
echo ""

# Test 2: API Root
echo "Test 2: API Root Endpoint"
echo "-------------------------"
API_ROOT=$(curl -s http://localhost:3000/api/v1)
echo "$API_ROOT" | python3 -m json.tool 2>/dev/null || echo "$API_ROOT"
echo ""

# Test 3: Google Sign-In (without token - should fail)
echo "Test 3: Google Sign-In (Invalid Token)"
echo "--------------------------------------"
SIGNIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/google-signin" \
  -H "Content-Type: application/json" \
  -d '{"idToken":"invalid-token"}')
echo "$SIGNIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SIGNIN_RESPONSE"
echo ""

# Test 4: Complete Profile (without auth - should fail)
echo "Test 4: Complete Profile (No Auth)"
echo "-----------------------------------"
PROFILE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/complete-profile" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","age":25}')
echo "$PROFILE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROFILE_RESPONSE"
echo ""

# Test 5: Refresh Token (invalid token)
echo "Test 5: Refresh Token (Invalid Token)"
echo "--------------------------------------"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"invalid-refresh-token"}')
echo "$REFRESH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REFRESH_RESPONSE"
echo ""

# Test 6: Get Sessions (without auth - should fail)
echo "Test 6: Get Sessions (No Auth)"
echo "-------------------------------"
SESSIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/sessions")
echo "$SESSIONS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SESSIONS_RESPONSE"
echo ""

echo "=========================================="
echo "Basic Tests Complete"
echo "=========================================="
echo ""
echo -e "${YELLOW}To test with a REAL Firebase ID token:${NC}"
echo "1. Get a Firebase ID token from your frontend app"
echo "2. Run: export FIREBASE_ID_TOKEN='your-token-here'"
echo "3. Run: ./test-auth-real.sh"
echo ""
