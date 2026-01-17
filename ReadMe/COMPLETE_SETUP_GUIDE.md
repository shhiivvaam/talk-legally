# 📖 Complete Setup Guide - Talk Legally Platform

## 🎯 Overview

This is a comprehensive guide to get your Talk Legally platform running. Follow these steps in order.

## ✅ Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 📦 Step 1: Database Setup

### Option A: Use Existing Docker Containers

Your containers are already running! Check with:
```powershell
docker ps
```

You should see:
- `talk_lawyer_postgres` (PostgreSQL)
- `talk_lawyer_mongo` (MongoDB)
- `talk_lawyer_redis` (Redis)

**Note:** Your PostgreSQL container might have different credentials. Check with:
```powershell
docker inspect talk_lawyer_postgres | findstr POSTGRES
```

### Option B: Use Local PostgreSQL

If you prefer using your local PostgreSQL:

1. Create database:
   ```sql
   CREATE DATABASE talk_legally;
   ```

2. Run migrations:
   ```powershell
   psql -U your_username -d talk_legally -f database/migrations/001_initial_schema.sql
   psql -U your_username -d talk_legally -f database/seeds/001_platform_settings.sql
   ```

3. Update all `.env` files with your local PostgreSQL credentials.

## 📥 Step 2: Install Dependencies

Run this command from project root:

```powershell
# Install all backend services
$services = @(
    "backend/api-gateway",
    "backend/services/auth-service",
    "backend/services/user-service",
    "backend/services/lawyer-service",
    "backend/services/wallet-service",
    "backend/services/payment-service",
    "backend/services/session-service",
    "backend/services/chat-service",
    "backend/services/notification-service",
    "backend/services/admin-service"
)

foreach ($service in $services) {
    Write-Host "Installing $service..." -ForegroundColor Yellow
    Set-Location $service
    npm install
    Set-Location ..\..\..
}

# Install frontend
Set-Location admin-panel
npm install
Set-Location ..
Set-Location mobile
npm install
Set-Location ..
```

## 🔐 Step 3: Configure Environment Variables

### Generate JWT Secrets

```powershell
# Generate random 32-character secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Run this twice to get two different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

### Create .env Files

For each service, create a `.env` file. Here are the critical ones:

**`backend/services/auth-service/.env`:**
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=talk_legally
JWT_SECRET=YOUR_GENERATED_SECRET_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=YOUR_GENERATED_REFRESH_SECRET_HERE
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:5173
```

**`backend/api-gateway/.env`:**
```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3006
LAWYER_SERVICE_URL=http://localhost:3007
WALLET_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3003
SESSION_SERVICE_URL=http://localhost:3004
CHAT_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3008
ADMIN_SERVICE_URL=http://localhost:3009
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:5173
```

**Copy `.env.example` to `.env` for other services** and update with your values.

## 🚀 Step 4: Start Services

### Start Backend Services (10 terminals)

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

### Start Frontend (2 terminals)

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

## ✅ Step 5: Verify Setup

### Test API Gateway
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
```

### Test User Registration
```powershell
$body = @{
    name = "Test User"
    email = "test@test.com"
    password = "test123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/auth/register/user" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

### Check Admin Panel
Open browser: http://localhost:5173

## 🔧 Common Issues & Solutions

### Issue: "Port already in use"
**Solution:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue: "Cannot connect to database"
**Solution:**
1. Check Docker: `docker ps`
2. Verify credentials in `.env`
3. Test connection:
   ```powershell
   docker exec -it talk_lawyer_postgres psql -U postgres
   ```

### Issue: "Module not found"
**Solution:**
```powershell
cd <service-directory>
npm install
```

### Issue: "TypeScript compilation errors"
**Solution:**
1. Check `tsconfig.json` exists
2. Run `npm run build` to see detailed errors
3. Install missing dependencies

## 📋 Service Checklist

Before starting, ensure:
- [ ] All `.env` files created
- [ ] JWT secrets generated and set
- [ ] Database credentials correct
- [ ] All dependencies installed
- [ ] Docker containers running

## 🎯 Testing Checklist

After everything is running:
- [ ] API Gateway responds (http://localhost:3000)
- [ ] User registration works
- [ ] User login works
- [ ] Admin panel loads (http://localhost:5173)
- [ ] Mobile app starts (Expo)

## 📚 Additional Resources

- **Quick Start:** `QUICKSTART.md`
- **Detailed Setup:** `SETUP.md`
- **Running Guide:** `RUN_PROJECT.md`
- **API Docs:** `docs/api-docs/README.md`

## 🆘 Still Having Issues?

1. Check all services are running (12 terminals)
2. Verify all `.env` files exist and have correct values
3. Check Docker containers: `docker ps`
4. Review service logs for errors
5. Ensure ports are not blocked by firewall

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ All 12 services show "running" or "listening"
- ✅ API Gateway responds at http://localhost:3000
- ✅ Admin panel loads at http://localhost:5173
- ✅ You can register a new user via API
- ✅ No errors in any terminal

Good luck! 🚀
