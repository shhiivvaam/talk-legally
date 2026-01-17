# 🎯 How to Run the Talk Legally Project

## ✅ Good News: Your Databases Are Already Running!

I can see your Docker containers are up:
- ✅ PostgreSQL (talk_lawyer_postgres) on port 5432
- ✅ MongoDB (talk_lawyer_mongo) on port 27017  
- ✅ Redis (talk_lawyer_redis) on port 6379

## 🚀 Quick Start (5 Steps)

### Step 1: Set Up Database Schema

```powershell
# Run migrations
docker exec -i talk_lawyer_postgres psql -U postgres -d talk_legally < database/migrations/001_initial_schema.sql

# Seed initial data
docker exec -i talk_lawyer_postgres psql -U postgres -d talk_legally < database/seeds/001_platform_settings.sql
```

### Step 2: Install Dependencies

```powershell
# Install all dependencies (run from project root)
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
cd admin-panel && npm install && cd ..
cd mobile && npm install && cd ..
```

### Step 3: Create Environment Files

**Critical: Create `.env` files with these minimum values:**

**For `backend/services/auth-service/.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=talk_legally
JWT_SECRET=your-random-32-character-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-random-32-character-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
PORT=3001
```

**Generate JWT secrets:**
```powershell
# Run in PowerShell to generate random secrets
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Copy this pattern for all services** - see `.env.example` files in each service directory.

### Step 4: Start Backend Services

Open **10 separate terminal windows** and run:

**Terminal 1 - Auth Service:**
```powershell
cd backend/services/auth-service
npm run start:dev
```

**Terminal 2 - User Service:**
```powershell
cd backend/services/user-service
npm run start:dev
```

**Terminal 3 - Lawyer Service:**
```powershell
cd backend/services/lawyer-service
npm run start:dev
```

**Terminal 4 - Wallet Service:**
```powershell
cd backend/services/wallet-service
npm run start:dev
```

**Terminal 5 - Payment Service:**
```powershell
cd backend/services/payment-service
npm run start:dev
```

**Terminal 6 - Session Service:**
```powershell
cd backend/services/session-service
npm run start:dev
```

**Terminal 7 - Chat Service:**
```powershell
cd backend/services/chat-service
npm run start:dev
```

**Terminal 8 - Notification Service:**
```powershell
cd backend/services/notification-service
npm run start:dev
```

**Terminal 9 - Admin Service:**
```powershell
cd backend/services/admin-service
npm run start:dev
```

**Terminal 10 - API Gateway:**
```powershell
cd backend/api-gateway
npm run start:dev
```

### Step 5: Start Frontend

**Terminal 11 - Admin Panel:**
```powershell
cd admin-panel
npm run dev
```

**Terminal 12 - Mobile App:**
```powershell
cd mobile
npm start
```

## ✅ Verify Everything Works

1. **Check API Gateway:** http://localhost:3000
   - Should respond (even if 404)

2. **Test Registration:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3000/auth/register/user" `
     -Method POST `
     -Headers @{"Content-Type"="application/json"} `
     -Body '{"name":"Test User","email":"test@test.com","password":"test123"}'
   ```

3. **Check Admin Panel:** http://localhost:5173

## 🔧 Troubleshooting

### "Cannot find module"
- Run `npm install` in that service directory

### "Port already in use"
- Find and kill the process: `netstat -ano | findstr :3000`
- Or change port in `.env` file

### "Database connection failed"
- Verify Docker containers are running: `docker ps`
- Check credentials in `.env` match Docker setup
- Test connection: `docker exec -it talk_lawyer_postgres psql -U postgres`

### "TypeScript errors"
- Ensure `tsconfig.json` exists in service directory
- Check for missing dependencies

## 📝 Service Ports Reference

- 3000: API Gateway
- 3001: Auth Service
- 3002: Wallet Service
- 3003: Payment Service
- 3004: Session Service
- 3005: Chat Service
- 3006: User Service
- 3007: Lawyer Service
- 3008: Notification Service
- 3009: Admin Service
- 5173: Admin Panel (Vite)
- 19006: Expo Dev Server

## 🎯 What to Do Next

1. ✅ All services running? Test user registration
2. ✅ Create a test lawyer account
3. ✅ Test wallet top-up (use test payment credentials)
4. ✅ Test chat functionality
5. ✅ Set up Agora.io for video calls

## 📚 More Help

- **Quick Start:** See `QUICKSTART.md`
- **Full Setup:** See `SETUP.md`
- **API Documentation:** See `docs/api-docs/README.md`
