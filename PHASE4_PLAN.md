# Phase 4: Friendship Management - Implementation Plan

## 📋 What I Need From You

**NOTHING!** All required infrastructure is already in place:
- ✅ Database tables (`friendships`, `blocks`) - Already created
- ✅ Database enums (`friendship_status`) - Already defined
- ✅ User service - Already exists
- ✅ Authentication middleware - Already working
- ✅ Validation utilities - Already set up

## 🎯 What I Will Build

Complete, production-ready **Friendship Management API** with 8 endpoints:

### 1. **GET /api/v1/friends**
   - List all friends/friend requests
   - Query params: `status` (accepted|pending|blocked), `limit`, `offset`
   - Returns: Array of friendships with user details, pagination info
   - Shows both sent and received friendships

### 2. **POST /api/v1/friends/request**
   - Send friend request to another user
   - Body: `{ userId }`
   - Validates: User exists, not self, not already friends, not blocked
   - Returns: Created friendship object
   - Status: 201 Created / 400 Bad Request / 404 Not Found

### 3. **POST /api/v1/friends/:friendshipId/accept**
   - Accept a pending friend request
   - Validates: Friendship exists, user is the addressee, status is pending
   - Updates status to 'accepted'
   - Returns: Updated friendship object
   - Status: 200 OK / 403 Forbidden / 404 Not Found

### 4. **POST /api/v1/friends/:friendshipId/deny**
   - Deny a pending friend request
   - Validates: Friendship exists, user is the addressee, status is pending
   - Updates status to 'denied'
   - Returns: Updated friendship object
   - Status: 200 OK / 403 Forbidden / 404 Not Found

### 5. **DELETE /api/v1/friends/:friendshipId**
   - Unfriend or cancel friend request
   - Validates: Friendship exists, user is requester or addressee
   - Deletes friendship record
   - Returns: Success message
   - Status: 200 OK / 403 Forbidden / 404 Not Found

### 6. **POST /api/v1/friends/:userId/block**
   - Block a user
   - Body: `{ reason? }` (optional)
   - Validates: User exists, not self, not already blocked
   - Creates block record and updates friendship status to 'blocked' if exists
   - Returns: Block object
   - Status: 201 Created / 400 Bad Request / 404 Not Found

### 7. **DELETE /api/v1/friends/:userId/unblock**
   - Unblock a user
   - Validates: Block exists, user is the blocker
   - Deletes block record
   - Returns: Success message
   - Status: 200 OK / 404 Not Found

### 8. **GET /api/v1/friends/requests/pending**
   - Get pending friend requests (sent and received)
   - Returns: `{ sent: [...], received: [...] }`
   - Shows user details for each request
   - Status: 200 OK

## 📁 Files I Will Create/Update

### New Files:
1. **`src/services/friendship.service.ts`** - Complete friendship business logic:
   - `sendFriendRequest()` - Create friend request
   - `getFriendships()` - List friendships with filtering
   - `getFriendshipById()` - Get single friendship
   - `acceptFriendRequest()` - Accept request
   - `denyFriendRequest()` - Deny request
   - `unfriend()` - Delete friendship
   - `getPendingRequests()` - Get sent/received pending requests
   - `blockUser()` - Block user (creates block + updates friendship)
   - `unblockUser()` - Remove block
   - `isBlocked()` - Check if user is blocked
   - `areFriends()` - Check if two users are friends

2. **`src/routes/friend.routes.ts`** - All 8 friendship endpoints

3. **`test-friends-api.html`** - Interactive test page for all endpoints

### Updated Files:
1. **`src/utils/validation.ts`** - Add validation schemas:
   - `sendFriendRequestSchema` - For POST /friends/request
   - `blockUserSchema` - For POST /friends/:userId/block
   - `friendshipQuerySchema` - For GET /friends query params

2. **`src/app.ts`** - Integrate friend routes

3. **`package.json`** - Add `serve:friends-page` script

## 🔒 Security & Business Logic

- ✅ Users can only see their own friendships
- ✅ Users can only accept/deny requests sent to them
- ✅ Users can only unfriend if they're part of the friendship
- ✅ Users can only block/unblock their own blocks
- ✅ Prevents self-friendship and self-block
- ✅ Prevents duplicate friend requests
- ✅ Prevents duplicate blocks
- ✅ Checks if users are blocked before allowing friend requests
- ✅ Automatically updates friendship status to 'blocked' when blocking
- ✅ Input validation with Zod
- ✅ SQL injection protection

## 📊 Database Relationships

### Friendships Table:
- `requester_id` → User who sent request
- `addressee_id` → User who received request
- `status` → pending | accepted | denied | blocked
- Unique constraint on (requester_id, addressee_id)

### Blocks Table:
- `blocker_id` → User who blocked
- `blocked_id` → User who was blocked
- `reason` → Optional reason
- Unique constraint on (blocker_id, blocked_id)

## 🎨 Response Format

All endpoints follow consistent response format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## 🧪 Testing

After implementation, I will provide:
- Complete HTML test page (`test-friends-api.html`)
- All endpoints testable from browser
- Clear error messages
- Real-time responses

## ✅ Deliverables

1. ✅ Complete `src/services/friendship.service.ts` with all methods
2. ✅ Complete `src/routes/friend.routes.ts` with all 8 endpoints
3. ✅ Updated `src/utils/validation.ts` with validation schemas
4. ✅ Updated `src/app.ts` with friend routes integration
5. ✅ Complete `test-friends-api.html` test page
6. ✅ All code production-ready with:
   - Error handling
   - Input validation
   - Security checks
   - Logging
   - TypeScript types
   - JSDoc comments
   - Business logic validation

## 🚀 Ready to Start?

Just say "proceed" and I'll implement everything!
