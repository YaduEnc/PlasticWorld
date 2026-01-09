# Phase 3: User Profile Management - Implementation Plan

## 📋 What I Need From You

**NOTHING!** All required infrastructure is already in place:
- ✅ Database tables (users table with all fields)
- ✅ UserService with basic CRUD operations
- ✅ Authentication middleware
- ✅ Validation utilities
- ✅ Error handling

## 🎯 What I Will Build

Complete, production-ready **User Profile Management API** with 6 endpoints:

### 1. **GET /api/v1/users/me**
   - Get current authenticated user's full profile
   - Returns: id, username, email, phone, name, age, profile_picture, bio, status, last_seen, created_at

### 2. **PUT /api/v1/users/me**
   - Update current user's profile
   - Allowed fields: name, bio, profile_picture_url
   - Validates: name (1-100 chars), bio (max 500 chars), profile_picture_url (valid URL)
   - Returns: Updated user object

### 3. **GET /api/v1/users/:userId**
   - Get public profile of any user by ID
   - Returns limited fields: id, username, name, profile_picture, bio, status (no email, phone, age)
   - Returns 404 if user not found or inactive

### 4. **GET /api/v1/users/search**
   - Search users by username, email, or phone number
   - Query params: `q` (search term), `type` (optional: username|email|phone), `limit` (default 20), `offset` (default 0)
   - Returns: Array of users (public profiles), total count, pagination info
   - Excludes current user from results

### 5. **PUT /api/v1/users/me/status**
   - Update user's online status
   - Body: `{ status: 'online' | 'away' | 'offline' }`
   - Updates `last_seen` timestamp when status changes
   - Returns: Updated status

### 6. **DELETE /api/v1/users/me**
   - Soft delete user account
   - Sets `is_active = false` in database
   - Revokes all active sessions
   - Returns: Success message

## 📁 Files I Will Create/Update

### New Files:
1. **`src/routes/user.routes.ts`** - All user profile endpoints
2. **`src/utils/validation.ts`** - Add user validation schemas (update existing)

### Updated Files:
1. **`src/services/user.service.ts`** - Add methods:
   - `searchUsers()` - Search by username/email/phone
   - `getPublicUserProfile()` - Get limited public profile
   - `deleteUser()` - Soft delete user account
   - `updateStatus()` - Update user status

2. **`src/app.ts`** - Integrate user routes

3. **`src/utils/validation.ts`** - Add schemas:
   - `updateProfileSchema` - For PUT /users/me
   - `updateStatusSchema` - For PUT /users/me/status
   - `searchUsersSchema` - For GET /users/search query params

## 🔒 Security Features

- ✅ All endpoints require authentication (except public profile)
- ✅ Users can only update their own profile
- ✅ Public profiles exclude sensitive data (email, phone, age)
- ✅ Search excludes inactive users
- ✅ Soft delete preserves data for audit trail
- ✅ Input validation with Zod schemas
- ✅ SQL injection protection (parameterized queries)

## 📊 Response Format

All endpoints follow consistent response format:

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

Error responses:
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
- cURL commands for testing each endpoint
- Expected responses
- Error scenarios

## ✅ Deliverables

1. ✅ Complete `src/routes/user.routes.ts` with all 6 endpoints
2. ✅ Updated `src/services/user.service.ts` with new methods
3. ✅ Updated `src/utils/validation.ts` with validation schemas
4. ✅ Updated `src/app.ts` with user routes integration
5. ✅ All code production-ready with:
   - Error handling
   - Input validation
   - Security checks
   - Logging
   - TypeScript types
   - JSDoc comments

## 🚀 Ready to Start?

Just say "proceed" and I'll implement everything!
