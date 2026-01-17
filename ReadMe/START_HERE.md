# 🚀 START HERE - Talk Legally Setup Guide

## ⚠️ Important: Port 5432 Already in Use

You have PostgreSQL running locally on port 5432. We have two options:

### Option 1: Use Your Local PostgreSQL (Recommended)
Skip Docker for PostgreSQL and use your existing installation.

### Option 2: Change Docker PostgreSQL Port
Modify `docker/docker-compose.yml` to use a different port (e.g., 5432).

---

## 📋 Complete Setup Steps

### Step 1: Check What's Running

```powershell
# Check if PostgreSQL is running locally
Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue

# Check what's using port 5432
netstat -ano | findstr :5432
```

### Step 2: Start Databases

**If using Docker (change port first):**

1. Edit `docker/docker-compose.yml` and change PostgreSQL port:
   ```yaml
   ports:
     - "5432:5432"  # Changed from 5432:5432
   ```

2. Update all `.env` files to use port 5432:
   ```
   DB_PORT=5432
   ```

3. Start databases:
   ```powershell
   cd docker
   docker-compose up -d
   ```

**OR use your local PostgreSQL:**

1. Create database manually:
   ```sql
   CREATE DATABASE talk_legally;
   ```

2. Run migrations:
   ```powershell
   psql -U postgres -d talk_legally -f database/migrations/001_initial_schema.sql
   psql -U postgres -d talk_legally -f database/seeds/001_platform_settings.sql
   ```

### Step 3: Install Dependencies

Run this PowerShell script (as Administrator):

```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run install script
.\scripts\install-all.ps1
```

Or install manually for each service (see QUICKSTART.md).

### Step 4: Create Environment Files

**Quick method - Copy these commands:**

```powershell
# Auth Service
Copy-Item backend/services/auth-service/.env.example backend/services/auth-service/.env -ErrorAction SilentlyContinue

# Update with your values - minimum required:
# JWT_SECRET=your-random-secret-key-here
# JWT_REFRESH_SECRET=your-random-refresh-secret-here
# DB_PASSWORD=your-postgres-password
```

**Create all .env files manually:**

1. Copy `.env.example` to `.env` in each service directory
2. Update these critical values:
   - `JWT_SECRET` - Generate random string (32+ characters)
   - `JWT_REFRESH_SECRET` - Generate random string (32+ characters)
   - `DB_PASSWORD` - Your PostgreSQL password
   - `AGORA_APP_ID` - Get from https://www.agora.io/ (free tier available)
   - `AGORA_APP_CERTIFICATE` - From Agora dashboard

### Step 5: Generate JWT Secrets

```powershell
# Generate random secrets (run in PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output and use as `JWT_SECRET` and `JWT_REFRESH_SECRET`.

### Step 6: Start Services

**Method 1: Manual (Recommended for first time)**

Open 10 separate terminal windows:

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
```

**Method 2: Using PM2 (Advanced)**

```powershell
npm install -g pm2
# Then use ecosystem.config.js (I'll create this)
```

### Step 7: Start Frontend

**Admin Panel:**
```powershell
cd admin-panel
npm run dev
```

**Mobile App:**
```powershell
cd mobile
npm start
```

### Step 8: Verify Everything Works

1. **Check API Gateway:** http://localhost:3000
   - Should return 404 or service response

2. **Test Auth Endpoint:**
   ```powershell
   curl http://localhost:3000/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@test.com","password":"test123"}'
   ```

3. **Check Admin Panel:** http://localhost:5173

## 🔧 Quick Fixes

### Port Already in Use

```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Connection Failed

1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Check port number matches
4. Test connection:
   ```powershell
   psql -U postgres -h localhost -p 5432
   ```

### Module Not Found

```powershell
# In the service directory
npm install
```

### TypeScript Errors

```powershell
# Check if tsconfig.json exists
# If missing, copy from another service
```

## 📝 Minimum Required Configuration

For basic testing, you only need:

1. **Database credentials** (PostgreSQL)
2. **JWT secrets** (generate random strings)
3. **Agora.io credentials** (free tier at https://www.agora.io/)

Payment gateways, email, and push notifications can be configured later.

## 🎯 Next Steps After Setup

1. ✅ Test user registration
2. ✅ Test lawyer registration  
3. ✅ Test wallet top-up (use test payment credentials)
4. ✅ Test chat functionality
5. ✅ Test video call (requires Agora.io setup)

## 📚 Documentation

- **Quick Start:** `QUICKSTART.md`
- **Full Setup:** `SETUP.md`
- **API Docs:** `docs/api-docs/README.md`
- **Architecture:** `docs/architecture.md`

## 🆘 Need Help?

Common issues and solutions are in `SETUP.md` under "Troubleshooting" section.
