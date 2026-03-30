# Authentication System Refactoring - Summary

## 🎯 What Was Changed

We've completely overhauled the authentication system to support the requirements you specified:

### **1. Database Schema Updates**

#### Users Table
- ✅ Made `email` **nullable** (can use phone instead)
- ✅ Added `role` column (default: 'user', can be 'admin')
- ✅ Now supports Email **OR** Phone signup

#### Lawyers Table  
- ✅ Added `isEmailVerified` boolean field
- ✅ Added `isPhoneVerified` boolean field
- ✅ Requires **BOTH** email AND phone (both must be verified)

### **2. Backend Service Changes**

#### New/Updated Endpoints
```
POST /auth/register/user       - User signup (email OR phone)
POST /auth/register/lawyer     - Lawyer signup (BOTH email AND phone)
POST /auth/login               - Universal login (auto-detects admin)
POST /auth/otp/send            - Send OTP to email or phone
POST /auth/otp/send/email      - Send OTP to email only (NEW)
POST /auth/otp/send/phone      - Send OTP to phone only (NEW)
POST /auth/otp/verify          - Verify OTP (handles all user types)
```

#### Updated Business Logic
- **User Registration**: Now sends OTP after registration (unless Google auth)
- **Lawyer Registration**: Sends **TWO** separate OTPs (email + phone)
- **Login**: Auto-detects admin users based on database `role` field
- **OTP Verification**: Tracks separate email/phone verification for lawyers

### **3. Files Modified**

```
✅ backend/shared/database/entities/user.entity.ts
   - Made email nullable
   - Added role column

✅ backend/shared/database/entities/lawyer.entity.ts
   - Added isEmailVerified field
   - Added isPhoneVerified field

✅ backend/services/auth-service/src/auth.service.ts
   - Updated registerUser() - added OTP sending
   - Updated registerLawyer() - dual OTP sending
   - Updated login() - admin role detection
   - Updated verifyOtp() - separate email/phone verification

✅ backend/services/auth-service/src/auth.controller.ts
   - Added separate email/phone OTP endpoints

✅ backend/services/auth-service/src/dto/send-otp.dto.ts (NEW)
   - Created DTOs for OTP operations
```

### **4. Migration Script**

```
✅ backend/shared/database/migrations/1737192978000-UpdateAuthEntities.ts
   - Adds role column to users
   - Makes email nullable in users
   - Adds verification flags to lawyers
```

### **5. Documentation**

```
✅ backend/services/auth-service/AUTH_GUIDE.md
   - Comprehensive guide for all authentication flows
   - API reference
   - Frontend integration examples
```

---

## 🚀 How It Works Now

### **Normal Users**
1. Signup with **Email OR Phone** + Password
2. Receive OTP on provided contact
3. Verify OTP
4. ✅ Login

### **Lawyers**
1. Signup with **Email AND Phone** + Password
2. Receive **TWO OTPs** (one for email, one for phone)
3. Verify **BOTH OTPs** separately
4. ✅ Can login (verification status: PENDING)
5. Upload documents for admin approval

### **Admins**
1. Normal user created in database
2. **Manually** set `role = 'admin'` in database
3. Login with normal credentials
4. System auto-detects admin role
5. ✅ Access admin dashboard

---

## ⚠️ Important Notes

### **What Still Needs To Be Done**

1. **Database Migration**: Run the migration to apply schema changes
   ```bash
   npm run migration:run
   ```

2. **OTP Service Integration**: Currently using development mode
   - Integrate **SendGrid** or **Nodemailer** for Email OTP
   - Integrate **Twilio** or similar for SMS OTP
   - Update `otp.service.ts` with actual sending logic

3. **Frontend Updates**: Update signup screens
   - User signup: Email OR Phone selector
   - Lawyer signup: Dual OTP verification UI
   - Admin login: No changes needed (auto-detected)

4. **Environment Variables**: Add to `.env`
   ```
   SENDGRID_API_KEY=xxx
   TWILIO_ACCOUNT_SID=xxx
   TWILIO_AUTH_TOKEN=xxx
   ```

5. **Admin Creation Script**: Consider creating a CLI tool
   ```bash
   npm run create-admin --email=admin@example.com
   ```

---

## 🔐 Security Features

- ✅ BCrypt password hashing (12 rounds)
- ✅ Redis-backed refresh tokens
- ✅ OTP expiry (10 minutes)
- ✅ Role-based JWT tokens
- ✅ Separate verification for email/phone (lawyers)

---

## 📋 Next Steps Checklist

- [ ] Run database migration
- [ ] Test user signup flow
- [ ] Test lawyer signup flow (dual OTP)
- [ ] Test admin login
- [ ] Integrate SendGrid/Twilio for production OTPs
- [ ] Update frontend signup screens
- [ ] Create admin user in database
- [ ] Document upload flow for lawyers
- [ ] Admin panel for lawyer verification

---

## 🆘 Need Help?

Refer to `AUTH_GUIDE.md` for detailed API documentation and integration examples.

**Current Status**: ✅ Backend implementation complete, ready for migration and testing
