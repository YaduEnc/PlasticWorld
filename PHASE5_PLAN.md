# Phase 5: Messaging Service - Implementation Plan

## 📋 Overview

Complete, production-ready **Real-time Messaging System** with:
- ✅ REST API for message management
- ✅ WebSocket (Socket.io) for real-time delivery
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Read receipts and delivery status
- ✅ Message editing and deletion
- ✅ Conversation management

## 🎯 What Was Built

### 1. **Message Service** (`src/services/message.service.ts`)

Complete message management service with:
- `sendMessage()` - Send encrypted messages
- `getMessageById()` - Retrieve single message
- `getConversation()` - Get conversation history with pagination
- `editMessage()` - Edit messages (15-minute window)
- `deleteMessage()` - Soft delete messages
- `markAsDelivered()` - Mark message as delivered
- `markAsRead()` - Mark message as read
- `markMultipleAsRead()` - Bulk read receipts
- `getUnreadCount()` - Get total unread count
- `getUnreadCountPerConversation()` - Get unread per conversation
- `getConversations()` - List all conversations

**Features:**
- ✅ Friend validation (only friends can message)
- ✅ Block validation (blocked users can't message)
- ✅ Reply-to message validation
- ✅ Media validation
- ✅ Soft delete support
- ✅ Automatic receipt creation

### 2. **Socket.io Server** (`src/config/socket.ts`)

Real-time WebSocket server with:
- ✅ JWT authentication middleware
- ✅ User online/offline tracking
- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Status updates
- ✅ Automatic delivery marking

**Socket Events:**
- `message:send` - Send message via WebSocket
- `message:sent` - Confirmation to sender
- `message:received` - New message to recipient
- `message:delivered` - Delivery confirmation
- `message:read` - Read receipt
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `status:update` - Update user status
- `user:online` - User came online
- `user:offline` - User went offline
- `user:status` - User status changed

### 3. **Message Routes** (`src/routes/message.routes.ts`)

REST API endpoints:

#### **POST /api/v1/messages**
Send a message via REST API
- Body: `{ recipientId, encryptedContent (base64), encryptedKey (base64), messageType, mediaUrl?, mediaSizeBytes?, replyToMessageId? }`
- Returns: Created message object
- Status: 201 Created

#### **GET /api/v1/messages/conversations**
Get all conversations for current user
- Returns: List of conversations with last message and unread count
- Status: 200 OK

#### **GET /api/v1/messages/:userId**
Get conversation between two users
- Query params: `limit` (default: 50), `offset` (default: 0), `beforeMessageId?`
- Returns: Messages array with pagination
- Status: 200 OK

#### **PUT /api/v1/messages/:messageId**
Edit a message
- Body: `{ encryptedContent?, encryptedKey? }`
- Validates: User is sender, message < 15 minutes old
- Returns: Updated message
- Status: 200 OK

#### **DELETE /api/v1/messages/:messageId**
Delete a message (soft delete)
- Validates: User is sender or recipient
- Returns: Success message
- Status: 200 OK

#### **POST /api/v1/messages/:messageId/delivered**
Mark message as delivered
- Validates: User is recipient
- Returns: Success message
- Status: 200 OK

#### **POST /api/v1/messages/:messageId/read**
Mark message as read
- Validates: User is recipient
- Returns: Success message
- Status: 200 OK

#### **POST /api/v1/messages/read**
Mark multiple messages as read
- Body: `{ messageIds: string[], senderId: string }`
- Returns: Success message
- Status: 200 OK

#### **GET /api/v1/messages/unread/count**
Get unread message count
- Returns: `{ total: number, perConversation: { [userId]: count } }`
- Status: 200 OK

### 4. **Validation Schemas** (`src/utils/validation.ts`)

Added message validation:
- `sendMessageSchema` - Send message validation
- `editMessageSchema` - Edit message validation
- `conversationQuerySchema` - Conversation query validation

### 5. **Testing Website** (`test-messaging-api.html`)

Complete real-time chat interface with:
- ✅ Socket.io connection management
- ✅ Conversation list sidebar
- ✅ Real-time message display
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Message sending
- ✅ Read receipts
- ✅ Status updates
- ✅ Unread count display

**Features:**
- Modern, responsive UI
- Real-time updates via WebSocket
- REST API integration
- Message history loading
- Conversation switching

## 🔧 Integration

### Updated Files:
1. **`src/app.ts`**
   - Added message routes
   - Updated CORS to include port 8083
   - Updated API root endpoint

2. **`src/server.ts`**
   - Integrated Socket.io server initialization
   - Passes HTTP server to Socket.io

3. **`package.json`**
   - Added `serve:messaging-page` script

## 📊 Database Schema

Uses existing tables:
- `messages` - Message storage with encryption
- `message_receipts` - Delivery and read receipts
- `message_media` - Media attachments (for future use)

## 🚀 How to Test

### 1. Start the Server
```bash
npm run dev
```

### 2. Start the Test Page
```bash
npm run serve:messaging-page
```

### 3. Open Browser
Navigate to `http://localhost:8083`

### 4. Get Access Token
1. Open `http://localhost:8080` (Firebase token page)
2. Sign in with Google
3. Copy the access token from the response

### 5. Test Real-time Messaging
1. Paste access token in the test page
2. Click "Connect Socket"
3. Enter recipient user ID (must be a friend)
4. Load conversation
5. Send messages and see real-time updates

## 🔐 Security Features

- ✅ JWT authentication for WebSocket
- ✅ Friend validation (only friends can message)
- ✅ Block validation (blocked users can't message)
- ✅ Message ownership validation
- ✅ Edit time window (15 minutes)
- ✅ Soft delete (preserves data)
- ✅ Encrypted content storage

## 📈 Performance Features

- ✅ Pagination for conversations
- ✅ Efficient message queries
- ✅ Indexed database queries
- ✅ WebSocket connection pooling
- ✅ Typing indicator debouncing
- ✅ Automatic delivery marking

## 🎨 Modern Features

- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Read receipts
- ✅ Message editing
- ✅ Message deletion
- ✅ Conversation list
- ✅ Unread count
- ✅ Reply-to messages
- ✅ Media support (structure ready)

## 🔮 Future Enhancements (Phase 6+)

- End-to-end encryption (Signal Protocol)
- Media upload and storage
- Voice/video messages
- Message reactions
- Message forwarding
- Group messaging
- Message search
- Message pinning

## ✅ Testing Checklist

- [x] Send message via REST API
- [x] Send message via WebSocket
- [x] Receive message in real-time
- [x] Load conversation history
- [x] Edit message
- [x] Delete message
- [x] Mark as delivered
- [x] Mark as read
- [x] Typing indicators
- [x] Online/offline status
- [x] Conversation list
- [x] Unread count
- [x] Friend validation
- [x] Block validation

## 📝 Notes

- Messages are stored with encrypted content (base64 for testing)
- In production, implement proper E2E encryption (Phase 6)
- Media URLs should point to CDN/storage service
- WebSocket automatically marks messages as delivered when recipient is online
- Message editing is limited to 15 minutes after sending
- Soft delete preserves message data for audit purposes

---

**Phase 5 Complete!** ✅

All messaging features are production-ready and fully functional.
