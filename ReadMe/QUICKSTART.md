# Quick Start Guide - Talk Legally Platform

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start Databases (2 minutes)

```powershell
# Navigate to docker directory
cd docker

# Start all databases
docker-compose up -d

# Verify they're running
docker ps
```

You should see 3 containers:
- `talk-legally-postgres` (PostgreSQL)
- `talk-legally-mongodb` (MongoDB)  
- `talk-legally-redis` (Redis)

### Step 2: Set Up Database Schema (1 minute)

```powershell
# Run from project root
docker exec -i talk-legally-postgres psql -U postgres -d talk_legally < database/migrations/001_initial_schema.sql

# Seed initial data
docker exec -i talk-legally-postgres psql -U postgres -d talk_legally < database/seeds/001_platform_settings.sql
```

### Step 3: Install Dependencies (2 minutes)

```powershell
# Run the install script
.\scripts\install-all.ps1
```

Or manually install each service:
```powershell
# Backend services
cd backend/api-gateway && npm install && cd ../..
cd backend/services/auth-service && npm install && cd ../../..
cd backend/services/user-service && npm install && cd ../../..
cd backend/services/lawyer-service && npm install && cd ../../..
cd backend/services/wallet-service && npm install && cd ../../..
cd backend/services/payment-service && npm install && cd ../../..
cd backend/services/session-service && npm install && cd ../../..
cd backend/services/chat-service && npm install && cd ../../..
cd backend/services/notification-service && npm install && cd ../../..
cd backend/services/admin-service && npm install && cd ../../..

# Frontend
cd mobile && npm install && cd ..
cd admin-panel && npm install && cd ..
```

### Step 4: Create Environment Files

Copy `.env.example` to `.env` in each service directory and update with your values:

**Critical files to create:**
1. `backend/api-gateway/.env`
2. `backend/services/auth-service/.env`
3. `backend/services/user-service/.env`
4. `backend/services/lawyer-service/.env`
5. `backend/services/wallet-service/.env`
6. `backend/services/payment-service/.env`
7. `backend/services/session-service/.env`
8. `backend/services/chat-service/.env`
9. `backend/services/notification-service/.env`
10. `backend/services/admin-service/.env`
11. `admin-panel/.env`
12. `mobile/.env`

**Minimum required for testing:**
- Database credentials (use defaults: postgres/postgres)
- JWT secrets (generate random strings)
- Agora.io credentials (get from https://www.agora.io/)
- Payment gateway credentials (use test mode)

### Step 5: Start Services

**Option A: Manual Start (Recommended for first time)**

Open 12 separate terminal windows and run:

```powershell
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

# Terminal 10 - API Gateway
cd backend/api-gateway
npm run start:dev

# Terminal 11 - Admin Panel
cd admin-panel
npm run dev

# Terminal 12 - Mobile App
cd mobile
npm start
```

**Option B: Using PM2 (Advanced)**

Install PM2 globally:
```powershell
npm install -g pm2
```

Create `ecosystem.config.js` in project root (I'll create this for you)

### Step 6: Verify Everything Works

1. **Check API Gateway:** http://localhost:3000
   - Should return 404 or API response

2. **Check Admin Panel:** http://localhost:5173 (or port shown in terminal)
   - Should show login page

3. **Test Auth Endpoint:**
   ```powershell
   curl http://localhost:3000/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123"}'
   ```

## 📝 Important Notes

### Ports Used:
- 3000: API Gateway
- 3001: Auth Service
- 3002: Wallet Service
- 3003: Payment Service
- 3004: Session Service
- 3005: Chat Service (WebSocket)
- 3006: User Service
- 3007: Lawyer Service
- 3008: Notification Service
- 3009: Admin Service
- 5173: Admin Panel (Vite)
- 19006: Expo Dev Server
- 5432: PostgreSQL
- 27017: MongoDB
- 6379: Redis

### Common Issues:

1. **"Port already in use"**
   - Find and kill the process using that port
   - Or change the port in `.env` file

2. **"Cannot connect to database"**
   - Ensure Docker containers are running: `docker ps`
   - Check database credentials in `.env`

3. **"Module not found"**
   - Run `npm install` in that service directory
   - Check `package.json` exists

4. **"TypeScript errors"**
   - Ensure `tsconfig.json` exists in service directory
   - Run `npm run build` to see detailed errors

## 🧪 Testing the Platform

### 1. Create a Test User

```powershell
curl -X POST http://localhost:3000/auth/register/user `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"user@test.com","password":"test123"}'
```

### 2. Login

```powershell
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"user@test.com","password":"test123"}'
```

Save the `accessToken` from response.

### 3. Get User Profile

```powershell
curl http://localhost:3000/users/profile `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🎯 Next Steps

1. Set up payment gateway test credentials
2. Configure Agora.io for video calls
3. Set up OneSignal for push notifications
4. Configure SendGrid for emails
5. Test the mobile app with Expo Go

## 📚 Documentation

- Full setup: See `SETUP.md`
- API docs: See `docs/api-docs/README.md`
- Architecture: See `docs/architecture.md`
- Deployment: See `docs/deployment.md`
