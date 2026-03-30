import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
}

interface RegisterData {
  email?: string;
  phone?: string;
  password?: string;
  name: string;
}

interface OtpVerifyData {
  email?: string;
  phone?: string;
  otp: string;
}

interface GoogleAuthData {
  idToken: string;
  email: string;
  name: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  profileImageUrl?: string;
}

interface SearchLawyersParams {
  specialization?: string;
  language?: string;
  minRating?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

interface VerifyPaymentData {
  gateway: string;
  paymentId: string;
  orderId: string;
  signature?: string;
}

export const authService = {
  login: (credentials: LoginCredentials) => apiClient.post('/auth/login', credentials),
  register: (userData: RegisterData) => apiClient.post('/auth/register/user', userData),
  googleAuth: (googleData: GoogleAuthData) => apiClient.post('/auth/google', googleData),
  sendOtp: (email?: string, phone?: string) => apiClient.post('/auth/otp/send', { email, phone }),
  verifyOtp: (data: OtpVerifyData) => apiClient.post('/auth/otp/verify', data),
  refreshToken: (refreshToken: string) => apiClient.post('/auth/refresh', { refreshToken }),
};

export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: UpdateProfileData) => apiClient.put('/users/profile', data),
  searchLawyers: (params: SearchLawyersParams) => apiClient.get('/users/lawyers/search', { params }),
  getLawyersMap: (lat: number, lng: number) => apiClient.get('/users/lawyers/map', { params: { lat, lng } }),
  addFavorite: (lawyerId: string) => apiClient.post(`/users/favorites/${lawyerId}`),
  removeFavorite: (lawyerId: string) => apiClient.delete(`/users/favorites/${lawyerId}`),
  getSessions: (limit: number = 20, offset: number = 0) => apiClient.get('/users/sessions', { params: { limit, offset } }),
};

export const walletService = {
  getBalance: () => apiClient.get('/wallet/balance'),
  getTransactions: () => apiClient.get('/wallet/transactions'),
  addBalance: (amount: number, referenceId?: string) => apiClient.post('/wallet/add', { amount, referenceId }),
};

export const paymentService = {
  createOrder: (amount: number, gateway: string) => apiClient.post('/payment/create-order', { amount, userId: '', gateway }),
  verifyPayment: (data: VerifyPaymentData) => apiClient.post('/payment/verify', data),
};

export const sessionService = {
  createSession: (lawyerId: string, sessionType: string) => apiClient.post('/sessions/create', { lawyerId, sessionType }),
  getSession: (sessionId: string) => apiClient.get(`/sessions/${sessionId}`),
  startSession: (sessionId: string) => apiClient.put(`/sessions/${sessionId}/start`),
  endSession: (sessionId: string) => apiClient.put(`/sessions/${sessionId}/end`),
  getAgoraToken: (sessionId: string) => apiClient.get(`/sessions/${sessionId}/agora-token`),
  heartbeat: (sessionId: string, durationSeconds: number) => apiClient.post(`/sessions/${sessionId}/heartbeat`, { durationSeconds }),
};

export default apiClient;
