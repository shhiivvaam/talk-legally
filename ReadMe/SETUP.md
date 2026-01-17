# Talk Legally - Complete Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Docker Desktop** (for databases)
   - Download from: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`

3. **PostgreSQL** (optional, if not using Docker)
   - Download from: https://www.postgresql.org/download/

4. **MongoDB** (optional, if not using Docker)
   - Download from: https://www.mongodb.com/try/download/community

5. **Redis** (optional, if not using Docker)
   - Download from: https://redis.io/download

## Step-by-Step Setup

### Step 1: Start Databases with Docker

1. Open Docker Desktop and ensure it's running

2. Navigate to the docker directory:
   ```bash
   cd docker
   ```

3. Start all database services:
   ```bash
   docker-compose up -d
   ```

4. Verify services are running:
   ```bash
   docker ps
   ```
   You should see:
   - `talk-legally-postgres` (port 5432)
   - `talk-legally-mongodb` (port 27017)
   - `talk-legally-redis` (port 6379)

### Step 2: Set Up PostgreSQL Database

1. Connect to PostgreSQL:
   ```bash
   # Using Docker
   docker exec -it talk-legally-postgres psql -U postgres
   ```

2. Create the database (if not exists):
   ```sql
   CREATE DATABASE talk_legally;
   \c talk_legally
   ```

3. Run migrations:
   ```bash
   # From project root
   docker exec -i talk-legally-postgres psql -U postgres -d talk_legally < database/migrations/001_initial_schema.sql
   ```

4. Seed initial data:
   ```bash
   docker exec -i talk-legally-postgres psql -U postgres -d talk_legally < database/seeds/001_platform_settings.sql
   ```

### Step 3: Install Dependencies

Install dependencies for all services. Run these commands from the project root:

```bash
# API Gateway
cd backend/api-gateway
npm install
cd ../..

# Auth Service
cd backend/services/auth-service
npm install
cd ../../..

# User Service
cd backend/services/user-service
npm install
cd ../../..

# Lawyer Service
cd backend/services/lawyer-service
npm install
cd ../../..

# Wallet Service
cd backend/services/wallet-service
npm install
cd ../../..

# Payment Service
cd backend/services/payment-service
npm install
cd ../../..

# Session Service
cd backend/services/session-service
npm install
cd ../../..

# Chat Service
cd backend/services/chat-service
npm install
cd ../../..

# Notification Service
cd backend/services/notification-service
npm install
cd ../../..

# Admin Service
cd backend/services/admin-service
npm install
cd ../../..

# Mobile App
cd mobile
npm install
cd ..

# Admin Panel
cd admin-panel
npm install
cd ..
```

### Step 4: Configure Environment Variables

Create `.env` files for each service. I'll create example files for you.

**Important:** Replace placeholder values with your actual credentials.

### Step 5: Start Services

You need to start services in this order:

1. **Start all backend services** (in separate terminal windows):

   ```bash
   # Terminal 1 - Auth Service
   cd backend/services/auth-service
   npm run start:dev

   # Terminal 2 - User Service
   cd backend/services/user-service
   npm run start:dev

   # Terminal 3 - Lawyer Service
   cd backend/services/lawyer-service
   npm run start:dev

   # Terminal 4 - Wallet Service
   cd backend/services/wallet-service
   npm run start:dev

   # Terminal 5 - Payment Service
   cd backend/services/payment-service
   npm run start:dev

   # Terminal 6 - Session Service
   cd backend/services/session-service
   npm run start:dev

   # Terminal 7 - Chat Service
   cd backend/services/chat-service
   npm run start:dev

   # Terminal 8 - Notification Service
   cd backend/services/notification-service
   npm run start:dev

   # Terminal 9 - Admin Service
   cd backend/services/admin-service
   npm run start:dev
   ```

2. **Start API Gateway** (Terminal 10):
   ```bash
   cd backend/api-gateway
   npm run start:dev
   ```

3. **Start Admin Panel** (Terminal 11):
   ```bash
   cd admin-panel
   npm run dev
   ```

4. **Start Mobile App** (Terminal 12):
   ```bash
   cd mobile
   npm start
   ```

### Step 6: Verify Services

Check that all services are running:

- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Wallet Service: http://localhost:3002
- Payment Service: http://localhost:3003
- Session Service: http://localhost:3004
- Chat Service: http://localhost:3005
- User Service: http://localhost:3006
- Lawyer Service: http://localhost:3007
- Notification Service: http://localhost:3008
- Admin Service: http://localhost:3009
- Admin Panel: http://localhost:3001 (Vite default)

## Quick Start Script

I'll create a script to help you start everything easily.

## Troubleshooting

### Database Connection Issues

1. **PostgreSQL not connecting:**
   - Check Docker is running: `docker ps`
   - Verify port 5432 is not in use
   - Check credentials in `.env` files

2. **MongoDB not connecting:**
   - Check Docker container: `docker logs talk-legally-mongodb`
   - Verify port 27017 is available

3. **Redis not connecting:**
   - Check Docker container: `docker logs talk-legally-redis`
   - Verify port 6379 is available

### Service Startup Issues

1. **Port already in use:**
   - Find process: `netstat -ano | findstr :3000` (Windows)
   - Kill process or change port in `.env`

2. **Module not found:**
   - Run `npm install` in the service directory
   - Check `package.json` dependencies

3. **TypeScript errors:**
   - Run `npm run build` to check for compilation errors
   - Verify `tsconfig.json` exists

## Next Steps

1. Test API endpoints using Postman or curl
2. Access Admin Panel at http://localhost:3001
3. Test mobile app with Expo Go
4. Create test users and lawyers
5. Test payment integration (use test credentials)

## Production Deployment

For production deployment, see `docs/deployment.md`
