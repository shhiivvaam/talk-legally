# Talk Legally - Lawyer Consultation Platform

A comprehensive, scalable lawyer consultation platform with real-time chat, voice, and video consultations, wallet-based billing, and strict lawyer verification.

## Architecture

- **Backend**: Microservices architecture using NestJS
- **Mobile App**: React Native (Expo)
- **Web Dashboards**: React + TypeScript
- **Databases**: PostgreSQL (primary), MongoDB (chat/logs), Redis (caching/sessions)

## Project Structure

```
talk-legally/
├── mobile/              # React Native mobile app
├── admin-panel/         # Admin dashboard
├── lawyer-dashboard/    # Lawyer dashboard
├── user-dashboard/      # User web dashboard
├── backend/             # Backend microservices
├── database/            # Database migrations and seeds
├── docker/              # Docker configurations
└── docs/                # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- Redis 7+
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository
2. Install dependencies for each service
3. Set up environment variables
4. Run database migrations
5. Start services

See individual service README files for detailed setup instructions.

## Services

- **API Gateway**: Main entry point, authentication, rate limiting
- **Auth Service**: Authentication & authorization
- **User Service**: User management & lawyer discovery
- **Lawyer Service**: Lawyer management & verification
- **Wallet Service**: Wallet & transaction management
- **Payment Service**: Payment gateway integration (Razorpay, Paytm)
- **Session Service**: Consultation session management
- **Chat Service**: Real-time messaging
- **Notification Service**: Push & email notifications
- **Admin Service**: Admin operations & analytics

## License

Proprietary
