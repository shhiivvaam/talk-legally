# Database Schema Documentation

## PostgreSQL Schema

### Core Tables

#### users
Stores user (client) information.

**Key Fields:**
- `id`: UUID primary key
- `email`: Unique email address
- `phone`: Optional phone number
- `password_hash`: Hashed password (nullable for Google OAuth users)
- `google_id`: Google OAuth ID (optional)
- `wallet_balance`: Current wallet balance
- `subscription_status`: Subscription status
- `location_latitude`, `location_longitude`: User location for lawyer discovery

#### lawyers
Stores lawyer information and verification details.

**Key Fields:**
- `id`: UUID primary key
- `verification_status`: pending/approved/rejected
- `chat_price_per_min`, `voice_price_per_min`, `video_price_per_min`: Per-minute pricing
- `availability_status`: online/offline/busy
- `specialization`: Array of specializations
- `languages`: Array of languages spoken
- `working_hours`: JSON object with working hours
- `rating_avg`: Average rating (0-5)
- `total_earnings`: Cumulative earnings

#### sessions
Tracks consultation sessions between users and lawyers.

**Key Fields:**
- `id`: UUID primary key
- `session_type`: chat/voice/video
- `status`: initiated/active/completed/cancelled
- `duration_seconds`: Session duration
- `total_cost`: Total cost to user
- `platform_commission`: Platform commission
- `lawyer_earnings`: Net earnings for lawyer
- `agora_channel_name`, `agora_token`: Agora.io call details

#### transactions
Records all financial transactions.

**Key Fields:**
- `transaction_type`: deposit/withdrawal/session_payment
- `amount`: Transaction amount
- `balance_before`, `balance_after`: Wallet balance before/after
- `payment_gateway`: razorpay/paytm
- `status`: pending/completed/failed/refunded

### Supporting Tables

- **wallet_transactions**: Detailed wallet credit/debit records
- **lawyer_earnings**: Lawyer earnings per session with payout status
- **reviews**: User reviews and ratings for lawyers
- **favorites**: User's favorite lawyers
- **subscriptions**: User subscription plans
- **user_documents**: Secure document storage
- **disputes**: Dispute resolution records
- **platform_settings**: Platform configuration

## MongoDB Collections

### chat_messages
Stores chat messages for sessions.

**Schema:**
```json
{
  "_id": "ObjectId",
  "session_id": "UUID",
  "sender_id": "UUID",
  "sender_type": "user" | "lawyer",
  "message": "string",
  "message_type": "text" | "file",
  "file_url": "string (optional)",
  "timestamp": "ISODate",
  "is_read": "boolean"
}
```

### audit_logs
Audit trail for security and compliance.

**Schema:**
```json
{
  "_id": "ObjectId",
  "user_id": "UUID",
  "action": "string",
  "resource_type": "string",
  "resource_id": "UUID",
  "ip_address": "string",
  "user_agent": "string",
  "timestamp": "ISODate",
  "metadata": "object"
}
```

### analytics
Platform and lawyer-specific analytics.

**Schema:**
```json
{
  "_id": "ObjectId",
  "date": "ISODate",
  "lawyer_id": "UUID (optional)",
  "metrics": {
    "sessions": "number",
    "revenue": "number",
    "active_users": "number",
    "active_lawyers": "number"
  }
}
```
