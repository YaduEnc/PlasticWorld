# PlasticWorld Backend API

Production-grade messaging platform backend with end-to-end encryption, built with Node.js, TypeScript, Express, PostgreSQL, Redis, and Socket.io.

## 🚀 Features

- **Real-time Messaging**: WebSocket support with Socket.io
- **End-to-End Encryption**: Signal Protocol implementation
- **Scalable Architecture**: Microservices-ready design
- **High Performance**: Optimized for <100ms latency
- **Security First**: JWT authentication, rate limiting, input validation
- **Production Ready**: Comprehensive logging, error handling, health checks

## 📋 Prerequisites

**For Local Development (Mac):**
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for local databases)
- PostgreSQL 15+ (via Docker)
- Redis 7+ (via Docker)

**For Production Deployment:**
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for server setup instructions
- PostgreSQL and Redis installed directly on server (not Docker)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd PlasticWorld
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plasticworld_db
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
```

### 4. Start Databases with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

### 5. Verify Database Connections

Check if databases are running:

```bash
# Check PostgreSQL
docker-compose exec postgres psql -U postgres -d plasticworld_db -c "SELECT version();"

# Check Redis
docker-compose exec redis redis-cli ping
```

### 6. Build the Project

```bash
npm run build
```

### 7. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
PlasticWorld/
├── src/
│   ├── config/          # Configuration files (database, redis)
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes (to be added)
│   ├── services/        # Business logic services (to be added)
│   ├── models/          # Database models (to be added)
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions (to be added)
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── SystemDesign/        # Architecture diagrams
├── docker-compose.yml   # Docker services configuration
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run typecheck` - Type check without building

## 🔍 Health Check

Check if the server is running:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "services": {
    "database": {
      "status": "connected",
      "latency": 5
    },
    "redis": {
      "status": "connected",
      "latency": 2
    }
  }
}
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Remove volumes (⚠️ deletes data)
docker-compose down -v
```

## 🔐 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT authentication (to be implemented)
- Input validation (to be implemented)
- SQL injection prevention (parameterized queries)
- XSS protection

## 📊 Monitoring

- Winston logger with daily rotation
- Structured JSON logging
- Health check endpoints
- Error tracking (Sentry integration in future phases)

## 🚀 Deployment

**For Production Deployment**, see the comprehensive guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Key Points:**
- **Development**: Use Docker Compose on Mac for local databases
- **Production**: PostgreSQL and Redis installed directly on server
- Deployment guide includes: server setup, PM2, Nginx, SSL, backups

## 🚧 Development Phases

### ✅ Phase 1: Foundation (Current)
- Project setup with TypeScript
- Express app configuration
- PostgreSQL and Redis connections
- Logging and error handling
- Health check endpoint
- Docker Compose setup

### 🔜 Phase 2: Authentication Service
- Firebase Admin SDK integration
- JWT token generation and validation
- User registration and login
- Session management
- Password hashing

### 🔜 Phase 3: User Service
- User profile CRUD operations
- User search functionality
- Profile picture upload
- User status management

### 🔜 Phase 4: Friendship Service
- Friend request management
- State machine for friendship status
- Block/unblock functionality

### 🔜 Phase 5: Messaging Service
- REST API for messages
- WebSocket server setup
- Message queue for offline users
- Read receipts and delivery status

### 🔜 Phase 6: Encryption Service
- Key exchange (X3DH protocol)
- Double Ratchet implementation
- Key storage and rotation

### 🔜 Phase 7-10: Advanced Features
- Media handling
- Typing indicators
- Online status
- Notifications
- Performance optimization

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection manually
docker-compose exec postgres psql -U postgres -d plasticworld_db
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker-compose ps

# Check Redis logs
docker-compose logs redis

# Test connection manually
docker-compose exec redis redis-cli ping
```

### Port Already in Use

If port 3000 is already in use, change it in `.env`:

```env
PORT=3001
```

## 📚 API Documentation

API documentation will be available at `/api/v1/docs` (to be implemented in future phases).

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT

## 👥 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This is Phase 1 of the implementation. Additional features will be added in subsequent phases.
