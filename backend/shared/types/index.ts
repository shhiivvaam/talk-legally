// Shared TypeScript types across all services

export enum UserRole {
  USER = 'user',
  LAWYER = 'lawyer',
  ADMIN = 'admin',
}

export enum SessionType {
  CHAT = 'chat',
  VOICE = 'voice',
  VIDEO = 'video',
}

export enum SessionStatus {
  INITIATED = 'initiated',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  SESSION_PAYMENT = 'session_payment',
}

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  PAYTM = 'paytm',
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
