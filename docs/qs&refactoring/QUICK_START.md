# Quick Start: Updated Authentication System

## ✅ Changes Applied

### 1. Database Entities Updated
- **User**: Email now nullable, added role column
- **Lawyer**: Added isEmailVerified & isPhoneVerified fields

### 2. Auth Service Updated
- User signup: Email OR Phone
- Lawyer signup: Email AND Phone (dual OTP)
- Admin detection: Auto from database role

### 3. New API Endpoints
- `POST /auth/otp/send/email` - Email OTP only
- `POST /auth/otp/send/phone` - Phone OTP only

---

## 🚀 Next Steps (REQUIRED)

### Step 1: Run Database Migration

The database needs to be updated with the new schema:

```bash
# Navigate to project root
cd c:\Users\lifes\Documents\Projects\talk-legally

# If you have TypeORM CLI configured:
npm run typeorm migration:run

# OR manually run the migration via pgAdmin:
```

**Manual SQL (if needed):**
```sql
-- Add role column to users
ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user';

-- Make email nullable in users
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Add verification flags to lawyers
ALTER TABLE lawyers ADD COLUMN is_email_verified BOOLEAN DEFAULT false;
ALTER TABLE lawyers ADD COLUMN is_phone_verified BOOLEAN DEFAULT false;
```

### Step 2: Create Your First Admin

```sql
-- Create a regular user first, then promote to admin:
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

### Step 3: Test the Flows

#### Test User Signup
```bash
curl -X POST http://localhost:3000/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Test Lawyer Signup
```bash
curl -X POST http://localhost:3000/auth/register/lawyer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lawyer",
    "email": "lawyer@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

### Step 4: Configure OTP Service (Production)

Update `backend/services/auth-service/src/otp.service.ts`:

```typescript
// Replace the sendOtp method with actual email/SMS sending

// For Email (using SendGrid):
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@talklawyer.com',
  subject: 'Your OTP Code',
  text: `Your OTP is: ${otp}`,
});

// For SMS (using Twilio):
import twilio from 'twilio';
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

await client.messages.create({
  body: `Your OTP is: ${otp}`,
  from: process.env.TWILIO_PHONE,
  to: phone,
});
```

---

## 📱 Frontend Integration Examples

### User Signup Screen

```typescript
// User can choose Email OR Phone

const handleSignup = async () => {
  const data = {
    name: userName,
    email: signupMethod === 'email' ? emailValue : undefined,
    phone: signupMethod === 'phone' ? phoneValue : undefined,
    password: password
  };
  
  const response = await fetch('/auth/register/user', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  // Show OTP screen
  navigate('/verify-otp', { 
    state: { 
      email: data.email, 
      phone: data.phone 
    } 
  });
};
```

### Lawyer Signup Screen

```typescript
// Lawyer MUST provide BOTH email and phone

const handleLawyerSignup = async () => {
  const data = {
    name: lawyerName,
    email: emailValue,  // REQUIRED
    phone: phoneValue,  // REQUIRED
    password: password
  };
  
  const response = await fetch('/auth/register/lawyer', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  // Show DUAL OTP screen
  navigate('/verify-dual-otp', { 
    state: { 
      email: data.email, 
      phone: data.phone,
      role: 'lawyer'
    } 
  });
};

// On OTP screen - verify BOTH separately:
const verifyEmailOtp = async () => {
  await fetch('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      otp: emailOtpCode,
      role: 'lawyer'
    })
  });
};

const verifyPhoneOtp = async () => {
  await fetch('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({
      phone: phone,
      otp: phoneOtpCode,
      role: 'lawyer'
    })
  });
};
```

### Login Screen (All Users)

```typescript
const handleLogin = async () => {
  const data = {
    email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
    phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
    password: password,
    role: userType // 'user' or 'lawyer'
  };
  
  const response = await fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  const { user, accessToken } = await response.json();
  
  // Auto-detect admin
  if (user.role === 'admin') {
    navigate('/admin-dashboard');
  } else if (user.role === 'lawyer') {
    navigate('/lawyer-dashboard');
  } else {
    navigate('/user-dashboard');
  }
};
```

---

## 🔍 Testing Checklist

- [ ] Database migration applied successfully
- [ ] User can signup with email only
- [ ] User can signup with phone only  
- [ ] User receives OTP after signup
- [ ] User can verify OTP and login
- [ ] Lawyer must provide both email and phone
- [ ] Lawyer receives TWO separate OTPs
- [ ] Lawyer can verify email OTP
- [ ] Lawyer can verify phone OTP
- [ ] Both isEmailVerified and isPhoneVerified are true after dual verification
- [ ] Admin user created in database
- [ ] Admin can login with normal credentials
- [ ] JWT contains correct role (user/lawyer/admin)
- [ ] Protected routes work with JWT

---

## 📚 Documentation Files

1. **AUTH_GUIDE.md** - Complete API reference and flows
2. **REFACTORING_SUMMARY.md** - What changed and why
3. **QUICK_START.md** - This file

---

## ⚠️ Important Notes

- **Backend is ready** - No compilation errors
- **Database migration required** - Run manually or via TypeORM
- **OTP service** - Currently development mode (returns OTP in response)
- **Frontend updates needed** - Update signup/login screens
- **Production OTP** - Integrate SendGrid/Twilio before going live

---

## 🆘 Troubleshooting

**Migration fails?**
- Check PostgreSQL is running
- Verify connection in `backend/shared/database/postgres.config.ts`

**OTPs not sending?**
- Expected in development (check console logs)
- Configure SendGrid/Twilio for production

**Admin login not working?**
- Verify `role = 'admin'` in database
- Check JWT payload includes correct role

**Lawyer verification fails?**
- Must verify BOTH email and phone
- Check `isEmailVerified` and `isPhoneVerified` flags

---

**Status**: ✅ Backend Complete | ⏳ Migration Pending | ⏳ Frontend Updates Needed
