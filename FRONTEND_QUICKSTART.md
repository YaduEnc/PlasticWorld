# Frontend Developer Quick Start Guide

Welcome to the PlasticWorld Backend API! This guide will help you get started quickly.

## 🚀 Quick Setup

### 1. Base URL

**Development:**
```
http://localhost:3000/api/v1
```

**Production:**
```
https://api.plasticworld.com/api/v1
```

### 2. Authentication Flow

```swift
// 1. Sign in with Firebase
let idToken = // Get from Firebase Auth

// 2. Call Google Sign-In endpoint
POST /auth/google-signin
Body: {
  "idToken": idToken,
  "deviceInfo": {
    "deviceName": UIDevice.current.name,
    "deviceType": "ios",
    "deviceToken": apnsToken
  }
}

// 3. Store tokens securely
let accessToken = response.data.accessToken
let refreshToken = response.data.refreshToken

// 4. Use access token for all API calls
Headers: {
  "Authorization": "Bearer \(accessToken)"
}
```

### 3. Token Refresh

```swift
// When access token expires (401 error)
POST /auth/refresh
Body: {
  "refreshToken": storedRefreshToken
}

// Update stored tokens
accessToken = response.data.accessToken
refreshToken = response.data.refreshToken
```

## 📱 Essential Endpoints

### User Profile
```swift
// Get current user
GET /users/me

// Update profile
PUT /users/me
Body: {
  "name": "New Name",
  "bio": "Bio text"
}

// Search users
GET /users/search?q=john&type=all
```

### Friends
```swift
// Get friends list
GET /friends?status=accepted

// Send friend request
POST /friends/request
Body: { "userId": "user-uuid" }

// Accept request
POST /friends/:friendshipId/accept

// Get pending requests
GET /friends/requests/pending
```

### Messaging
```swift
// Get conversations
GET /messages/conversations

// Get conversation with user
GET /messages/:userId?limit=50

// Send message
POST /messages
Body: {
  "recipientId": "user-uuid",
  "encryptedContent": "base64-encrypted",
  "encryptedKey": "base64-key",
  "messageType": "text"
}

// Mark as read
POST /messages/:messageId/read
```

## 🔌 WebSocket Setup

```swift
// Connect to WebSocket
let socket = SocketIOClient(
  socketURL: URL(string: "http://localhost:3000")!,
  config: [
    .auth(["token": accessToken]),
    .connectParams(["token": accessToken])
  ]
)

// Listen for messages
socket.on("message:received") { data, ack in
  // Handle new message
}

// Send message
socket.emit("message:send", [
  "recipientId": recipientId,
  "encryptedContent": encryptedContent,
  "encryptedKey": encryptedKey,
  "messageType": "text"
])

// Typing indicator
socket.emit("typing:start", ["recipientId": recipientId])
socket.emit("typing:stop", ["recipientId": recipientId])
```

## 🔐 Encryption Setup

```swift
// 1. Initialize keys (first time)
POST /encryption/keys/initialize

// 2. Get recipient's prekey bundle
GET /encryption/keys/prekey-bundle/:userId/:deviceId

// 3. Establish session
POST /encryption/session/establish
Body: {
  "recipientUserId": "user-uuid",
  "recipientDeviceId": "device-uuid"
}

// 4. Encrypt message (client-side)
let encrypted = encryptMessage(plaintext, sessionKey)

// 5. Send encrypted message
POST /messages
Body: {
  "encryptedContent": encrypted.ciphertext,
  "encryptedKey": encrypted.nonce
}
```

## 📦 Response Format

All responses follow this structure:

```swift
struct APIResponse<T: Codable>: Codable {
  let success: Bool
  let data: T?
  let error: APIError?
  let timestamp: String?
}

struct APIError: Codable {
  let message: String
  let code: String
  let details: [ValidationError]?
}
```

## ⚠️ Error Handling

```swift
// Handle errors
if !response.success {
  switch response.error?.code {
  case "AUTH_REQUIRED", "TOKEN_EXPIRED":
    // Refresh token and retry
    refreshTokenAndRetry()
  case "VALIDATION_ERROR":
    // Show validation errors
    showValidationErrors(response.error?.details)
  default:
    // Show error message
    showError(response.error?.message)
  }
}
```

## 🔄 Common Patterns

### Pagination
```swift
struct PaginatedResponse<T: Codable>: Codable {
  let items: [T]
  let pagination: Pagination
}

struct Pagination: Codable {
  let total: Int
  let limit: Int
  let offset: Int
  let hasMore: Bool
}

// Load more
if pagination.hasMore {
  loadMore(offset: pagination.offset + pagination.limit)
}
```

### Real-time Updates
```swift
// Use WebSocket for real-time features
socket.on("message:received") { data, ack in
  // Update UI immediately
  updateConversationUI()
}

// Fallback to polling if WebSocket fails
Timer.scheduledTimer(withTimeInterval: 5.0) { _ in
  fetchNewMessages()
}
```

## 📚 Full Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🆘 Support

- Check error codes in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Review phase documentation:
  - [PHASE3_PLAN.md](./PHASE3_PLAN.md) - User Management
  - [PHASE4_PLAN.md](./PHASE4_PLAN.md) - Friendship Management
  - [PHASE5_PLAN.md](./PHASE5_PLAN.md) - Messaging
  - [PHASE6_PLAN.md](./PHASE6_PLAN.md) - Encryption

---

**Happy Coding!** 🚀
