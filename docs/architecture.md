# Architecture Documentation

## System Architecture

The Talk Legally platform follows a microservices architecture with the following components:

### Backend Services

1. **API Gateway** (Port 3000)
   - Entry point for all client requests
   - Authentication & authorization
   - Rate limiting
   - Request routing to microservices

2. **Auth Service** (Port 3001)
   - User & lawyer authentication
   - JWT token management
   - OTP generation & verification
   - Google OAuth integration

3. **Wallet Service** (Port 3002)
   - Wallet balance management
   - Transaction history
   - Balance validation

4. **Payment Service** (Port 3003)
   - Razorpay integration
   - Paytm integration
   - Payment webhook handling

5. **Session Service** (Port 3004)
   - Consultation session management
   - Per-minute billing
   - Agora.io token generation
   - Auto-termination on low balance

6. **Chat Service** (Port 3005)
   - Real-time messaging via WebSocket
   - Message encryption
   - Message persistence

7. **User Service** (Port 3006)
   - User profile management
   - Lawyer discovery
   - Favorites management

8. **Lawyer Service** (Port 3007)
   - Lawyer profile management
   - Verification workflow
   - Earnings & analytics

9. **Notification Service** (Port 3008)
   - Push notifications (OneSignal)
   - Email notifications (SendGrid)

10. **Admin Service** (Port 3009)
    - Lawyer verification
    - Platform analytics
    - User/lawyer management

### Databases

- **PostgreSQL**: Primary database for users, lawyers, sessions, transactions
- **MongoDB**: Chat messages, audit logs, analytics
- **Redis**: Session management, caching, rate limiting

### Frontend Applications

- **Mobile App**: React Native (Expo)
- **Admin Panel**: React + TypeScript
- **Lawyer Dashboard**: React + TypeScript
- **User Dashboard**: React + TypeScript

## Communication Flow

```
Client → API Gateway → Microservice → Database
                ↓
         Auth Verification
                ↓
         Rate Limiting
                ↓
         Request Routing
```

## Security

- JWT-based authentication
- End-to-end encryption for chat
- Rate limiting on all endpoints
- Input validation
- SQL injection prevention
- XSS protection

## Deployment

- Docker containers for all services
- Docker Compose for local development
- Kubernetes for production (optional)
- Auto-scaling based on load
