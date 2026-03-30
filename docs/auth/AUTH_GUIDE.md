# Authentication System Documentation

## Overview

This document describes the updated authentication system for Talk Legally platform, supporting three user types: **Normal Users**, **Lawyers**, and **Admins**.

---

## User Types & Authentication Flows

### 1. Normal Users

#### Signup Process
- **Required Fields**: Name, **Either** Email OR Phone, Password
- **Optional**: Google Sign-In (bypasses password requirement)
- **Verification**: Single OTP sent to provided Email OR Phone
- **Database**: Stored in `users` table with `role = 'user'`

**API Endpoints:**
```
POST /auth/register/user
Body: { name, email?, phone?, password?, googleId? }

POST /auth/otp/send
Body: { email?, phone? }

POST /auth/otp/verify
Body: { email?, phone?, otp, role: 'user' }
```

#### Login Process
- **Credentials**: Email/Phone + Password
- **Admin Detection**: Automatically detected if `role = 'admin'` in database
- **Google Login**: Supported via `/auth/google` endpoint

**API Endpoints:**
```
POST /auth/login
Body: { email?, phone?, password, role?: 'user' }

POST /auth/google
Body: { googleId, email, name, profileImageUrl? }
```

---

### 2. Lawyers

#### Signup Process
- **Required Fields**: Name, **Both** Email AND Phone, Password
- **Verification**: **Dual OTP** - Both Email AND Phone must be verified
- **Database**: Stored in `lawyers` table
- **Verification Status**: Set to `PENDING` by default
- **Flags**: `isEmailVerified` and `isPhoneVerified` track individual verification status

**API Endpoints:**
```
POST /auth/register/lawyer
Body: { name, email, phone, password }
Response: Sends TWO separate OTPs (email + phone)

POST /auth/otp/send/email
Body: { email }

POST /auth/otp/send/phone
Body: { phone }

POST /auth/otp/verify
Body: { email?, phone?, otp, role: 'lawyer' }
Note: Call twice - once for email OTP, once for phone OTP
```

#### Login Process
- **Credentials**: Email/Phone + Password
- **Role**: Must specify `role: 'lawyer'`
- **Note**: Document verification happens **after** email/phone verification

**API Endpoints:**
```
POST /auth/login
Body: { email?, phone?, password, role: 'lawyer' }
```

---

### 3. Admins

#### Setup Process
- **Creation**: Manually set `role = 'admin'` in database for a user record
- **No Special Signup**: Uses normal user signup, then manually promoted

**SQL Example:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@talkllegally.com';
```

#### Login Process
- **Credentials**: Email + Password (like normal users)
- **Auto-Detection**: System automatically detects admin role and returns `role: 'admin'` in JWT

**API Endpoints:**
```
POST /auth/login
Body: { email, password }
Response: { user: { ..., role: 'admin' }, accessToken, refreshToken }
```

---

## Database Schema Changes

### Users Table
```typescript
{
  id: uuid,
  email: string (nullable, unique),  // ← NOW NULLABLE
  phone: string (nullable, unique),
  role: string (default: 'user'),    // ← NEW COLUMN
  passwordHash: string (nullable),
  googleId: string (nullable),
  name: string,
  isVerified: boolean,
  // ... other fields
}
```

### Lawyers Table
```typescript
{
  id: uuid,
  email: string (unique),
  phone: string (unique),
  isEmailVerified: boolean,          // ← NEW COLUMN
  isPhoneVerified: boolean,          // ← NEW COLUMN
  passwordHash: string,
  name: string,
  verificationStatus: VerificationStatus (PENDING/APPROVED/REJECTED),
  isActive: boolean,
  // ... other fields
}
```

---

## Migration

Run the following to apply database changes:

```bash
npm run migration:run
```

Migration file: `1737192978000-UpdateAuthEntities.ts`

---

## OTP Service

### Email/SMS Integration
Currently using **Redis** for OTP storage (10-minute expiry).

**Production Setup Required:**
- **Email**: Use SendGrid, Nodemailer, or AWS SES
- **SMS**: Use Twilio, AWS SNS, or similar

**Current Implementation:**
```typescript
// Development: OTP returned in response
// Production: OTP sent via email/SMS only
```

---

## Key Features

### ✅ Dual Verification for Lawyers
- Both email AND phone must be verified
- Separate OTP endpoints for granular control
- Tracks verification state independently

### ✅ Flexible User Signup
- Email OR Phone (not both required)
- Google Sign-In supported
- OTP verification for non-Google users

### ✅ Admin System
- No separate signup flow
- Role-based access via database flag
- Auto-detected during login

### ✅ Security
- BCrypt password hashing (12 rounds)
- Redis-backed refresh tokens
- OTP expiry (10 minutes)
- Role-based JWT payloads

---

## Authentication Response Format

### Successful Login/Signup
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "phone": "+1234567890",
    "name": "John Doe",
    "role": "user" | "lawyer" | "admin",
    // For lawyers only:
    "isEmailVerified": true,
    "isPhoneVerified": true
  },
  "accessToken": "jwt-token",
  "refreshToken": "jwt-refresh-token"
}
```

### OTP Send Response
```json
{
  "message": "OTP sent successfully",
  "otp": "123456"  // Only in development
}
```

---

## Frontend Integration Guide

### User Signup Flow
1. Collect: Name, Email OR Phone, Password
2. Call `POST /auth/register/user`
3. Show OTP input screen
4. Verify with `POST /auth/otp/verify` (include email/phone used)
5. Redirect to home

### Lawyer Signup Flow
1. Collect: Name, Email, Phone, Password
2. Call `POST /auth/register/lawyer`
3. Show **dual OTP input** screen (email + phone)
4. Verify email OTP: `POST /auth/otp/verify` with `{ email, otp, role: 'lawyer' }`
5. Verify phone OTP: `POST /auth/otp/verify` with `{ phone, otp, role: 'lawyer' }`
6. Check response: both `isEmailVerified` and `isPhoneVerified` should be `true`
7. Redirect to document upload screen

### Admin Login
1. Normal login screen
2. Call `POST /auth/login` with credentials
3. Check response `role` field
4. Redirect to admin dashboard if `role === 'admin'`

---

## Environment Variables

```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# For production OTP
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

---

## Next Steps

1. ✅ Database migration applied
2. ✅ Backend endpoints updated
3. ⏳ **Integrate SendGrid/Twilio for OTP delivery**
4. ⏳ **Update frontend signup screens**
5. ⏳ **Create admin manual to set admin users**
6. ⏳ **Document upload flow for lawyers**
7. ⏳ **Admin approval workflow for lawyer verification**

---

## API Reference Summary

| Endpoint | Method | Purpose | Body |
|----------|--------|---------|------|
| `/auth/register/user` | POST | User signup | `{ name, email?, phone?, password? }` |
| `/auth/register/lawyer` | POST | Lawyer signup | `{ name, email, phone, password }` |
| `/auth/login` | POST | Login all types | `{ email?, phone?, password, role? }` |
| `/auth/google` | POST | Google OAuth | `{ googleId, email, name }` |
| `/auth/otp/send` | POST | Send OTP (either) | `{ email?, phone? }` |
| `/auth/otp/send/email` | POST | Send Email OTP | `{ email }` |
| `/auth/otp/send/phone` | POST | Send Phone OTP | `{ phone }` |
| `/auth/otp/verify` | POST | Verify OTP | `{ email?, phone?, otp, role? }` |
| `/auth/refresh` | POST | Refresh tokens | `{ refreshToken }` |
| `/auth/logout` | POST | Logout | Requires JWT |
| `/auth/me` | GET | Get profile | Requires JWT |

---

**Last Updated**: 2026-01-18  
**Version**: 2.0  
**Author**: Talk Legally Development Team
