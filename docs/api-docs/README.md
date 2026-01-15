# API Documentation

## Base URL
`http://localhost:3000` (API Gateway)

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication
- `POST /auth/register/user` - Register user
- `POST /auth/register/lawyer` - Register lawyer
- `POST /auth/login` - Login
- `POST /auth/google` - Google OAuth
- `POST /auth/otp/send` - Send OTP
- `POST /auth/otp/verify` - Verify OTP
- `POST /auth/refresh` - Refresh token

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users/lawyers/search` - Search lawyers
- `GET /users/lawyers/map` - Get lawyers map
- `POST /users/favorites/:lawyerId` - Add favorite
- `GET /users/sessions` - Get session history

### Lawyers
- `GET /lawyers/profile` - Get lawyer profile
- `PUT /lawyers/profile` - Update profile
- `PUT /lawyers/pricing` - Update pricing
- `PUT /lawyers/availability` - Update availability
- `GET /lawyers/earnings` - Get earnings
- `GET /lawyers/analytics` - Get analytics

### Wallet
- `GET /wallet/balance` - Get balance
- `GET /wallet/transactions` - Get transactions
- `POST /wallet/add` - Add balance

### Payment
- `POST /payment/create-order` - Create payment order
- `POST /payment/verify` - Verify payment

### Sessions
- `POST /sessions/create` - Create session
- `GET /sessions/:id` - Get session
- `PUT /sessions/:id/start` - Start session
- `PUT /sessions/:id/end` - End session
- `GET /sessions/:id/agora-token` - Get Agora token

### Admin
- `GET /admin/verification/lawyers/pending` - Get pending verifications
- `POST /admin/verification/lawyers/:id/verify` - Verify lawyer
- `GET /admin/analytics` - Get platform analytics
