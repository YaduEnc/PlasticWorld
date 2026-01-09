# PlasticWorld Backend - Complete Frontend Integration Guide

**Version:** 1.0.0  
**Production URL:** `https://plasticworld.yaduraj.me/api/v1`  
**WebSocket URL:** `wss://plasticworld.yaduraj.me` (via Cloudflare Tunnel)

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Complete Feature List](#complete-feature-list)
3. [Authentication System](#authentication-system)
4. [User Profile Management](#user-profile-management)
5. [Friendship Management](#friendship-management)
6. [Real-Time Messaging](#real-time-messaging)
7. [End-to-End Encryption](#end-to-end-encryption)
8. [WebSocket Events](#websocket-events)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Applications                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   iOS App    │  │  Android App │  │   Web App    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Cloudflare     │
                    │  Tunnel/CDN     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  REST API      │  │  WebSocket      │  │  Static Files  │
│  (Express.js)  │  │  (Socket.io)    │  │  (if needed)   │
└───────┬────────┘  └────────┬────────┘  └────────────────┘
        │                    │
        └────────┬────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐  ┌───▼────┐  ┌───▼────┐
│PostgreSQL│  │ Redis  │  │Firebase│
│ Database │  │ Cache  │  │  Auth  │
└─────────┘  └────────┘  └────────┘
```

### Technology Stack

**Backend:**
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 15 (Docker)
- **Cache/Session:** Redis 7 (Docker)
- **Real-time:** Socket.io (WebSocket)
- **Authentication:** Firebase Admin SDK + JWT
- **Encryption:** Signal Protocol (X3DH + Double Ratchet)
- **Process Manager:** PM2
- **Deployment:** Cloudflare Tunnel

**Frontend Integration:**
- **REST API:** HTTP/HTTPS requests
- **WebSocket:** Socket.io client library
- **Authentication:** Firebase Auth + JWT tokens
- **Encryption:** Client-side Signal Protocol implementation

---

## ✨ Complete Feature List

### Phase 1: Foundation ✅
- ✅ Express.js server setup
- ✅ PostgreSQL database with connection pooling
- ✅ Redis caching and session management
- ✅ Winston structured logging
- ✅ Error handling middleware
- ✅ Health check endpoints
- ✅ Docker Compose for local development
- ✅ TypeScript configuration
- ✅ Environment variable management

### Phase 2: Authentication ✅
- ✅ Firebase Authentication integration
- ✅ Google Sign-In support
- ✅ JWT access & refresh tokens
- ✅ Device management (multi-device support)
- ✅ Session management with Redis
- ✅ Token refresh mechanism
- ✅ Secure logout
- ✅ User reactivation (soft-delete recovery)

### Phase 3: User Profile Management ✅
- ✅ Get current user profile
- ✅ Update user profile (name, bio, profile picture, username, phone)
- ✅ Get public user profile
- ✅ Search users (by username, email, phone, or all)
- ✅ Update online status (online/away/offline)
- ✅ Soft delete account
- ✅ Username availability checking
- ✅ Phone number validation
- ✅ Profile completion tracking

### Phase 4: Friendship Management ✅
- ✅ Send friend requests
- ✅ Accept/deny friend requests
- ✅ List friends and friend requests
- ✅ Unfriend users
- ✅ Block/unblock users
- ✅ Get pending requests (sent/received)
- ✅ Friendship status tracking
- ✅ Blocked user filtering

### Phase 5: Real-Time Messaging ✅
- ✅ Send messages (text, image, video, audio, file, system)
- ✅ Get conversation history
- ✅ Get all conversations list
- ✅ Edit messages (within 15 minutes)
- ✅ Delete messages (soft delete)
- ✅ Mark messages as delivered
- ✅ Mark messages as read
- ✅ Bulk read receipts
- ✅ Unread message counts
- ✅ Message replies
- ✅ Real-time message delivery via WebSocket
- ✅ Typing indicators
- ✅ Online/offline status updates
- ✅ Read receipts via WebSocket
- ✅ Message status updates (sent/delivered/read)

### Phase 6: End-to-End Encryption ✅
- ✅ Signal Protocol implementation
- ✅ X3DH key exchange
- ✅ Double Ratchet algorithm
- ✅ Identity key generation (X25519)
- ✅ Signed prekeys
- ✅ One-time prekeys
- ✅ Key bundle management
- ✅ Session establishment
- ✅ Perfect forward secrecy
- ✅ Key rotation
- ✅ Multi-device key management

---

## 🔐 Authentication System

### How It Works

1. **User signs in with Firebase** (Google OAuth)
   - Frontend obtains Firebase ID token
   - Token contains user email, name, profile picture

2. **Backend validates Firebase token**
   - Verifies token with Firebase Admin SDK
   - Extracts user information

3. **Backend creates/updates user**
   - Checks if user exists (by Firebase UID or email)
   - Creates new user or reactivates existing user
   - Generates unique username if needed

4. **Backend generates JWT tokens**
   - **Access Token:** Short-lived (15 minutes), contains userId and deviceId
   - **Refresh Token:** Long-lived (7 days), stored in Redis session

5. **Frontend stores tokens securely**
   - Access token: In memory or secure storage
   - Refresh token: In Keychain (iOS) or SecureStorage (Android)

6. **Frontend uses access token for API calls**
   - Includes in `Authorization: Bearer <token>` header
   - Token expires after 15 minutes

7. **Token refresh flow**
   - When access token expires (401 error)
   - Frontend sends refresh token to `/auth/refresh`
   - Backend validates refresh token and session
   - Backend issues new access and refresh tokens

### Authentication Endpoints

#### POST `/api/v1/auth/google-signin`

**Purpose:** Sign in with Google OAuth via Firebase

**Request:**
```json
{
  "idToken": "firebase-id-token-from-firebase-auth",
  "deviceInfo": {
    "deviceName": "iPhone 15 Pro",
    "deviceType": "ios",
    "deviceToken": "apns-push-token-optional"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accessExpiresAt": "2026-01-09T12:15:00.000Z",
    "refreshExpiresAt": "2026-01-16T12:00:00.000Z",
    "user": {
      "id": "5d2665ca-f640-47a2-ac63-b3e5e60ff22b",
      "firebaseUid": "n74VA0VWveWwwgymg3fwkWvQERv2",
      "email": "user@example.com",
      "username": "user123",
      "name": "User Name",
      "profilePictureUrl": "https://lh3.googleusercontent.com/...",
      "bio": null,
      "status": "offline",
      "isProfileComplete": true
    },
    "device": {
      "id": "869afcd6-28c5-497f-b7ec-44ad90241af3",
      "deviceName": "iPhone 15 Pro",
      "deviceType": "ios"
    }
  }
}
```

**Features:**
- Automatically creates user if doesn't exist
- Reactivates soft-deleted users
- Generates unique username from email/name
- Creates device record for multi-device support
- Returns complete user profile

#### POST `/api/v1/auth/refresh`

**Purpose:** Refresh expired access token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token",
    "accessExpiresAt": "2026-01-09T12:30:00.000Z",
    "refreshExpiresAt": "2026-01-16T12:00:00.000Z"
  }
}
```

**Features:**
- Validates refresh token and session
- Issues new token pair
- Updates session expiry in Redis

#### POST `/api/v1/auth/logout`

**Purpose:** Logout current session

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Features:**
- Invalidates current session in Redis
- Removes device session
- User remains logged in on other devices

---

## 👤 User Profile Management

### How It Works

1. **Profile Storage**
   - User data stored in PostgreSQL `users` table
   - Includes: id, username, email, phone, name, age, bio, profile picture, status
   - Soft delete: `is_active` flag (doesn't delete from database)

2. **Profile Updates**
   - Username uniqueness checked before update
   - Phone number uniqueness checked before update
   - Profile picture URL stored (upload handled by frontend/CDN)

3. **Search Functionality**
   - Searches across username, email, phone number
   - Pagination support (limit/offset)
   - Filters by search type (username/email/phone/all)
   - Returns only active users

4. **Status Management**
   - Online status: `online`, `away`, `offline`
   - Updated via REST API or WebSocket
   - `last_seen` timestamp updated automatically

### User Endpoints

#### GET `/api/v1/users/me`

**Purpose:** Get current authenticated user's complete profile

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "firebaseUid": "firebase-uid",
      "username": "johndoe",
      "email": "user@example.com",
      "phoneNumber": "+1234567890",
      "name": "John Doe",
      "age": 25,
      "profilePictureUrl": "https://...",
      "bio": "Bio text here",
      "status": "online",
      "lastSeen": "2026-01-09T12:00:00.000Z",
      "isProfileComplete": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-09T12:00:00.000Z"
    }
  }
}
```

**Features:**
- Returns complete user data including sensitive fields
- Includes profile completion status
- Shows current online status

#### PUT `/api/v1/users/me`

**Purpose:** Update current user's profile

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio text",
  "profilePictureUrl": "https://cdn.example.com/profile.jpg",
  "username": "newusername",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "newusername",
      "name": "John Doe Updated",
      "bio": "Updated bio text",
      "profilePictureUrl": "https://cdn.example.com/profile.jpg",
      "phoneNumber": "+1234567890",
      "updatedAt": "2026-01-09T12:05:00.000Z"
    }
  }
}
```

**Features:**
- Validates username uniqueness
- Validates phone number uniqueness
- Updates `updated_at` timestamp
- Returns updated user object

#### GET `/api/v1/users/:userId`

**Purpose:** Get public profile of another user

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "name": "John Doe",
      "profilePictureUrl": "https://...",
      "bio": "Bio text",
      "status": "online",
      "lastSeen": "2026-01-09T12:00:00.000Z"
    }
  }
}
```

**Features:**
- Excludes sensitive data (email, phone, firebaseUid)
- Shows public profile only
- Includes online status

#### GET `/api/v1/users/search`

**Purpose:** Search users by username, email, or phone

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `q` (required): Search query string
- `type` (optional): `username` | `email` | `phone` | `all` (default: `all`)
- `limit` (optional): Results per page (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```
GET /api/v1/users/search?q=john&type=all&limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "username": "johndoe",
        "name": "John Doe",
        "profilePictureUrl": "https://...",
        "bio": "Bio text",
        "status": "online"
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

**Features:**
- Case-insensitive search
- Multiple search types
- Pagination support
- Returns only active users

#### PUT `/api/v1/users/me/status`

**Purpose:** Update user's online status

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "status": "online" | "away" | "offline"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "online",
    "lastSeen": "2026-01-09T12:00:00.000Z"
  }
}
```

**Features:**
- Updates status in database
- Updates `last_seen` timestamp
- Broadcasts status change via WebSocket

#### DELETE `/api/v1/users/me`

**Purpose:** Soft delete user account

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Features:**
- Sets `is_active` to `false`
- Deletes user from Firebase Auth
- User can reactivate by signing in again

---

## 👥 Friendship Management

### How It Works

1. **Friend Request Flow**
   - User A sends friend request to User B
   - Creates `friendships` record with status `pending`
   - User B receives notification (via WebSocket)
   - User B can accept or deny

2. **Friendship States**
   - `pending`: Request sent, awaiting response
   - `accepted`: Both users are friends
   - `denied`: Request was denied
   - `blocked`: One user blocked the other

3. **Blocking System**
   - Creates `blocks` record
   - Blocks all communication (messages, requests)
   - Can be unblocked later

### Friendship Endpoints

#### GET `/api/v1/friends`

**Purpose:** List all friendships (friends and requests)

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `status` (optional): `accepted` | `pending` | `denied` | `blocked`
- `limit` (optional): Results per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "friendships": [
      {
        "id": "friendship-uuid",
        "status": "accepted",
        "requestedAt": "2026-01-01T00:00:00.000Z",
        "respondedAt": "2026-01-01T00:05:00.000Z",
        "isRequester": true,
        "user": {
          "id": "uuid",
          "username": "johndoe",
          "name": "John Doe",
          "profilePictureUrl": "https://...",
          "bio": "Bio text",
          "status": "online"
        }
      }
    ],
    "pagination": {
      "total": 10,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

**Features:**
- Returns friendships with user details
- Shows if current user is requester
- Includes pagination

#### POST `/api/v1/friends/request`

**Purpose:** Send friend request

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "userId": "recipient-user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "friendship": {
      "id": "friendship-uuid",
      "status": "pending",
      "requestedAt": "2026-01-09T12:00:00.000Z"
    }
  }
}
```

**Features:**
- Validates user exists and is active
- Checks if already friends or blocked
- Creates pending friendship

#### GET `/api/v1/friends/requests/pending`

**Purpose:** Get pending friend requests (sent and received)

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sent": [
      {
        "id": "friendship-uuid",
        "status": "pending",
        "requestedAt": "2026-01-09T12:00:00.000Z",
        "user": {
          "id": "uuid",
          "username": "johndoe",
          "name": "John Doe",
          "profilePictureUrl": "https://..."
        }
      }
    ],
    "received": [
      {
        "id": "friendship-uuid",
        "status": "pending",
        "requestedAt": "2026-01-09T11:00:00.000Z",
        "user": {
          "id": "uuid",
          "username": "janedoe",
          "name": "Jane Doe",
          "profilePictureUrl": "https://..."
        }
      }
    ]
  }
}
```

**Features:**
- Separates sent and received requests
- Includes user details for each request

#### POST `/api/v1/friends/:friendshipId/accept`

**Purpose:** Accept a friend request

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "friendship": {
      "id": "friendship-uuid",
      "status": "accepted",
      "respondedAt": "2026-01-09T12:05:00.000Z"
    }
  }
}
```

**Features:**
- Updates friendship status to `accepted`
- Sets `responded_at` timestamp
- Broadcasts acceptance via WebSocket

#### POST `/api/v1/friends/:friendshipId/deny`

**Purpose:** Deny a friend request

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "friendship": {
      "id": "friendship-uuid",
      "status": "denied",
      "respondedAt": "2026-01-09T12:05:00.000Z"
    }
  }
}
```

#### DELETE `/api/v1/friends/:friendshipId`

**Purpose:** Unfriend or cancel friend request

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Friendship deleted successfully"
}
```

**Features:**
- Deletes friendship record
- Works for pending and accepted friendships

#### POST `/api/v1/friends/:userId/block`

**Purpose:** Block a user

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "reason": "Optional reason for blocking"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "block": {
      "id": "block-uuid",
      "blockerId": "your-uuid",
      "blockedId": "blocked-user-uuid",
      "reason": "Optional reason",
      "createdAt": "2026-01-09T12:00:00.000Z"
    }
  }
}
```

**Features:**
- Creates block record
- Prevents all communication
- Blocks friend requests

#### DELETE `/api/v1/friends/:userId/unblock`

**Purpose:** Unblock a user

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User unblocked successfully"
}
```

---

## 💬 Real-Time Messaging

### How It Works

1. **Message Storage**
   - Messages stored in PostgreSQL `messages` table
   - Encrypted content stored as base64 strings
   - Media URLs stored separately
   - Soft delete: `deleted_at` timestamp

2. **Message Types**
   - `text`: Plain text messages
   - `image`: Image files
   - `video`: Video files
   - `audio`: Audio files
   - `file`: Other files
   - `system`: System messages

3. **Message Status**
   - `sent`: Message sent to server
   - `delivered`: Message delivered to recipient device
   - `read`: Message read by recipient

4. **Real-Time Delivery**
   - WebSocket connection for instant delivery
   - Fallback to polling if WebSocket unavailable
   - Typing indicators via WebSocket
   - Read receipts via WebSocket

5. **Conversation Management**
   - Each conversation is between two users
   - Unread counts tracked per conversation
   - Last message shown in conversation list

### Messaging Endpoints

#### POST `/api/v1/messages`

**Purpose:** Send a message

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "recipientId": "recipient-uuid",
  "encryptedContent": "base64-encoded-encrypted-content",
  "encryptedKey": "base64-encoded-encryption-key",
  "messageType": "text",
  "mediaUrl": "https://cdn.example.com/image.jpg",
  "mediaSizeBytes": 1024000,
  "replyToMessageId": "message-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "message-uuid",
      "senderId": "your-uuid",
      "recipientId": "recipient-uuid",
      "messageType": "text",
      "status": "sent",
      "sentAt": "2026-01-09T12:00:00.000Z",
      "replyToMessageId": null
    }
  }
}
```

**Features:**
- Validates friendship exists
- Checks if user is blocked
- Stores encrypted message
- Broadcasts via WebSocket to recipient
- Returns message with status `sent`

#### GET `/api/v1/messages/conversations`

**Purpose:** Get all conversations for current user

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "userId": "other-user-uuid",
        "username": "johndoe",
        "name": "John Doe",
        "profilePictureUrl": "https://...",
        "status": "online",
        "lastMessage": {
          "id": "message-uuid",
          "messageType": "text",
          "sentAt": "2026-01-09T12:00:00.000Z",
          "status": "read"
        },
        "unreadCount": 5
      }
    ]
  }
}
```

**Features:**
- Returns all conversations
- Includes last message preview
- Shows unread count per conversation
- Includes user profile info

#### GET `/api/v1/messages/:userId`

**Purpose:** Get conversation history with a specific user

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `limit` (optional): Messages per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `beforeMessageId` (optional): Get messages before this message ID

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "message-uuid",
        "senderId": "sender-uuid",
        "recipientId": "recipient-uuid",
        "messageType": "text",
        "mediaUrl": null,
        "mediaSizeBytes": null,
        "status": "read",
        "sentAt": "2026-01-09T12:00:00.000Z",
        "deliveredAt": "2026-01-09T12:00:01.000Z",
        "readAt": "2026-01-09T12:00:05.000Z",
        "replyToMessageId": null,
        "isEdited": false,
        "editedAt": null,
        "sender": {
          "id": "sender-uuid",
          "username": "johndoe",
          "name": "John Doe",
          "profilePictureUrl": "https://..."
        }
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

**Features:**
- Returns messages in reverse chronological order (newest first)
- Includes sender/recipient details
- Shows message status (sent/delivered/read)
- Supports pagination

#### PUT `/api/v1/messages/:messageId`

**Purpose:** Edit a message (within 15 minutes)

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "encryptedContent": "base64-encoded-new-encrypted-content",
  "encryptedKey": "base64-encoded-new-encryption-key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "message-uuid",
      "isEdited": true,
      "editedAt": "2026-01-09T12:10:00.000Z",
      "encryptedContent": "new-encrypted-content",
      "encryptedKey": "new-encryption-key"
    }
  }
}
```

**Features:**
- Only allows editing within 15 minutes
- Updates `is_edited` flag
- Sets `edited_at` timestamp
- Broadcasts edit via WebSocket

#### DELETE `/api/v1/messages/:messageId`

**Purpose:** Delete a message (soft delete)

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Features:**
- Sets `deleted_at` timestamp
- Message hidden from conversation
- Broadcasts deletion via WebSocket

#### POST `/api/v1/messages/:messageId/delivered`

**Purpose:** Mark message as delivered

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Message marked as delivered"
}
```

**Features:**
- Updates `delivered_at` timestamp
- Updates message status to `delivered`
- Broadcasts delivery receipt via WebSocket

#### POST `/api/v1/messages/:messageId/read`

**Purpose:** Mark message as read

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

**Features:**
- Updates `read_at` timestamp
- Updates message status to `read`
- Updates unread count
- Broadcasts read receipt via WebSocket

#### POST `/api/v1/messages/read`

**Purpose:** Mark multiple messages as read

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "messageIds": ["message-uuid-1", "message-uuid-2"],
  "senderId": "sender-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

**Features:**
- Bulk read receipt
- Updates all specified messages
- Updates unread count for conversation

#### GET `/api/v1/messages/unread/count`

**Purpose:** Get unread message count

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "perConversation": {
      "user-uuid-1": 5,
      "user-uuid-2": 10
    }
  }
}
```

**Features:**
- Returns total unread count
- Returns per-conversation breakdown
- Useful for badge counts

---

## 🔐 End-to-End Encryption

### How It Works

1. **Signal Protocol Overview**
   - **X3DH Key Exchange:** Initial key agreement
   - **Double Ratchet:** Ongoing message encryption
   - **Perfect Forward Secrecy:** Each message has unique key
   - **X25519:** Elliptic curve for key generation
   - **XSalsa20-Poly1305:** Encryption algorithm

2. **Key Types**
   - **Identity Key:** Long-term key pair (never changes)
   - **Signed Prekey:** Medium-term key (rotated periodically)
   - **One-Time Prekeys:** Short-term keys (consumed after use)

3. **Session Establishment**
   - User A requests User B's prekey bundle
   - User A performs X3DH key exchange
   - Creates shared secret (root key)
   - Establishes Double Ratchet session
   - Session stored in Redis

4. **Message Encryption**
   - Client encrypts message using session key
   - Sends encrypted content + encryption key
   - Server stores encrypted data (never sees plaintext)
   - Recipient decrypts using session key

5. **Key Rotation**
   - Signed prekeys rotated periodically
   - One-time prekeys replenished when low
   - Old sessions remain valid
   - New sessions use new keys

### Encryption Endpoints

#### POST `/api/v1/encryption/keys/initialize`

**Purpose:** Initialize encryption keys for current device

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keys": {
      "identityKeyPublic": "base64-encoded-public-key",
      "signedPreKeyPublic": "base64-encoded-public-key",
      "signedPreKeySignature": "base64-encoded-signature",
      "prekeyCount": 100
    }
  }
}
```

**Features:**
- Generates identity key pair (X25519)
- Generates signed prekey pair
- Generates 100 one-time prekeys
- Signs prekey with identity key
- Stores keys in database

#### GET `/api/v1/encryption/keys/prekey-bundle/:userId/:deviceId`

**Purpose:** Get prekey bundle for X3DH key exchange

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bundle": {
      "identityKey": "base64-encoded-public-key",
      "signedPreKey": {
        "keyId": 1234567890,
        "publicKey": "base64-encoded-public-key",
        "signature": "base64-encoded-signature"
      },
      "oneTimePreKey": {
        "keyId": 1234567891,
        "publicKey": "base64-encoded-public-key"
      }
    }
  }
}
```

**Features:**
- Returns identity key (public)
- Returns signed prekey with signature
- Returns one one-time prekey (consumed after use)
- Used for X3DH key exchange

#### POST `/api/v1/encryption/session/establish`

**Purpose:** Establish encryption session with another user

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "recipientUserId": "recipient-uuid",
  "recipientDeviceId": "recipient-device-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "sessionId": "session-id",
      "rootKey": "base64-encoded-key",
      "sendingChainKey": "base64-encoded-key",
      "receivingChainKey": "base64-encoded-key"
    }
  }
}
```

**Features:**
- Performs X3DH key exchange
- Creates Double Ratchet session
- Stores session in Redis
- Returns session keys (client stores locally)

#### POST `/api/v1/encryption/keys/rotate`

**Purpose:** Rotate encryption keys for current device

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keys": {
      "identityKeyPublic": "base64-encoded-key",
      "signedPreKeyPublic": "base64-encoded-key",
      "signedPreKeySignature": "base64-encoded-signature",
      "prekeyCount": 100
    }
  }
}
```

**Features:**
- Rotates signed prekey
- Replenishes one-time prekeys
- Old keys remain valid for existing sessions

#### GET `/api/v1/encryption/keys`

**Purpose:** Get all encryption keys for current user

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "id": "key-uuid",
        "deviceId": "device-uuid",
        "prekeyCount": 100,
        "keyCreatedAt": "2026-01-09T12:00:00.000Z",
        "keyExpiresAt": null,
        "isActive": true
      }
    ]
  }
}
```

#### DELETE `/api/v1/encryption/keys/:deviceId`

**Purpose:** Deactivate encryption keys for a device

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Encryption keys deactivated successfully"
}
```

---

## 🔌 WebSocket Events

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('https://plasticworld.yaduraj.me', {
  auth: {
    token: 'your-access-token'
  },
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Handle authentication error
  if (error.message === 'Authentication failed') {
    // Refresh token and reconnect
  }
});
```

### Events Emitted by Client

#### `message:send`

Send a message via WebSocket (alternative to REST API).

```javascript
socket.emit('message:send', {
  recipientId: 'recipient-uuid',
  encryptedContent: 'base64-encoded-content',
  encryptedKey: 'base64-encoded-key',
  messageType: 'text',
  mediaUrl: 'https://...',
  mediaSizeBytes: 1024000,
  replyToMessageId: 'message-uuid'
});
```

#### `typing:start`

Indicate user started typing.

```javascript
socket.emit('typing:start', {
  recipientId: 'recipient-uuid'
});
```

#### `typing:stop`

Indicate user stopped typing.

```javascript
socket.emit('typing:stop', {
  recipientId: 'recipient-uuid'
});
```

#### `message:read`

Mark message as read.

```javascript
socket.emit('message:read', {
  messageId: 'message-uuid'
});
```

#### `messages:read`

Mark multiple messages as read.

```javascript
socket.emit('messages:read', {
  messageIds: ['message-uuid-1', 'message-uuid-2'],
  senderId: 'sender-uuid'
});
```

#### `status:update`

Update user status.

```javascript
socket.emit('status:update', {
  status: 'online' | 'away' | 'offline'
});
```

### Events Received from Server

#### `message:sent`

Confirmation that message was sent.

```javascript
socket.on('message:sent', (data) => {
  console.log('Message sent:', data.message);
  // Update UI with sent message
});
```

#### `message:received`

New message received.

```javascript
socket.on('message:received', (data) => {
  console.log('New message:', data.message);
  // Show notification
  // Update conversation UI
  // Play sound
});
```

#### `message:delivered`

Message was delivered to recipient.

```javascript
socket.on('message:delivered', (data) => {
  console.log('Message delivered:', data.messageId);
  // Update message status to "delivered"
});
```

#### `message:read`

Message was read by recipient.

```javascript
socket.on('message:read', (data) => {
  console.log('Message read:', data.messageId);
  // Update message status to "read"
});
```

#### `message:error`

Error sending message.

```javascript
socket.on('message:error', (data) => {
  console.error('Message error:', data.error);
  // Show error to user
  // Retry sending
});
```

#### `typing:start`

User started typing.

```javascript
socket.on('typing:start', (data) => {
  console.log(`${data.name} is typing...`);
  // Show typing indicator
});
```

#### `typing:stop`

User stopped typing.

```javascript
socket.on('typing:stop', (data) => {
  console.log(`${data.userId} stopped typing`);
  // Hide typing indicator
});
```

#### `user:online`

User came online.

```javascript
socket.on('user:online', (data) => {
  console.log(`${data.name} is now online`);
  // Update user status in UI
});
```

#### `user:offline`

User went offline.

```javascript
socket.on('user:offline', (data) => {
  console.log(`${data.name} is now offline`);
  // Update user status in UI
});
```

#### `user:status`

User status changed.

```javascript
socket.on('user:status', (data) => {
  console.log(`User ${data.userId} status: ${data.status}`);
  // Update status badge
});
```

---

## ❌ Error Handling

### Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": [
      {
        "field": "username",
        "message": "Username is required"
      }
    ]
  },
  "timestamp": "2026-01-09T12:00:00.000Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description | Action |
|------|-------------|-------------|--------|
| `AUTH_REQUIRED` | 401 | Authentication token required | Add Authorization header |
| `AUTH_FAILED` | 401 | Authentication failed | Refresh token or re-login |
| `TOKEN_EXPIRED` | 401 | Access token expired | Call `/auth/refresh` |
| `SESSION_INVALID` | 401 | Session not found or inactive | Re-login |
| `USER_INVALID` | 401 | User not found or inactive | Re-login |
| `VALIDATION_ERROR` | 400 | Request validation failed | Check `details` array |
| `USER_NOT_FOUND` | 404 | User not found | Check user ID |
| `MESSAGE_NOT_FOUND` | 404 | Message not found | Check message ID |
| `FRIENDSHIP_NOT_FOUND` | 404 | Friendship not found | Check friendship ID |
| `USERNAME_TAKEN` | 409 | Username already taken | Choose different username |
| `PHONE_TAKEN` | 409 | Phone number already registered | Use different phone |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait and retry |
| `INTERNAL_ERROR` | 500 | Internal server error | Report to support |

### Error Handling Best Practices

```javascript
async function apiCall(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!data.success) {
      // Handle specific error codes
      switch (data.error.code) {
        case 'TOKEN_EXPIRED':
        case 'AUTH_FAILED':
          // Refresh token and retry
          await refreshToken();
          return apiCall(url, options); // Retry
          
        case 'VALIDATION_ERROR':
          // Show validation errors
          showValidationErrors(data.error.details);
          break;
          
        case 'RATE_LIMIT_EXCEEDED':
          // Show rate limit message
          showError('Too many requests. Please wait.');
          break;
          
        default:
          // Show generic error
          showError(data.error.message);
      }
      throw new Error(data.error.message);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

---

## 📝 Best Practices

### 1. Token Management

- **Store tokens securely:** Use Keychain (iOS) or SecureStorage (Android)
- **Refresh proactively:** Refresh token 1 minute before expiry
- **Handle expiry:** Automatically refresh on 401 errors
- **Clear on logout:** Remove tokens when user logs out

### 2. WebSocket Connection

- **Reconnect automatically:** Handle disconnections gracefully
- **Authenticate on connect:** Always send access token
- **Handle errors:** Listen for `connect_error` events
- **Fallback to polling:** Use REST API if WebSocket unavailable

### 3. Message Handling

- **Encrypt client-side:** Never send plaintext messages
- **Store encrypted:** Store encrypted messages locally
- **Decrypt on display:** Decrypt only when displaying
- **Handle offline:** Queue messages when offline, send when online

### 4. Real-Time Updates

- **Use WebSocket for real-time:** Typing indicators, status updates
- **Poll for missed updates:** Check for updates on app resume
- **Batch updates:** Group multiple updates together
- **Debounce typing:** Don't send typing events too frequently

### 5. Performance

- **Pagination:** Always use pagination for lists
- **Lazy loading:** Load messages/conversations on demand
- **Cache responses:** Cache user profiles and conversations
- **Optimize images:** Compress images before upload

### 6. Security

- **Never log tokens:** Don't log access tokens or private keys
- **Validate input:** Validate all user input client-side
- **HTTPS only:** Always use HTTPS in production
- **Secure storage:** Use platform secure storage APIs

---

## 🚀 Quick Start Example

### Complete Authentication Flow

```javascript
// 1. Sign in with Firebase
const firebaseUser = await signInWithGoogle();
const idToken = await firebaseUser.getIdToken();

// 2. Sign in to backend
const response = await fetch('https://plasticworld.yaduraj.me/api/v1/auth/google-signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idToken: idToken,
    deviceInfo: {
      deviceName: 'iPhone 15 Pro',
      deviceType: 'ios',
      deviceToken: apnsToken
    }
  })
});

const { data } = await response.json();

// 3. Store tokens securely
await SecureStorage.set('accessToken', data.accessToken);
await SecureStorage.set('refreshToken', data.refreshToken);

// 4. Connect WebSocket
const socket = io('https://plasticworld.yaduraj.me', {
  auth: { token: data.accessToken }
});

// 5. Use API
const profileResponse = await fetch('https://plasticworld.yaduraj.me/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${data.accessToken}`
  }
});
```

---

**Last Updated:** January 9, 2026  
**API Version:** v1  
**Production URL:** `https://plasticworld.yaduraj.me/api/v1`
