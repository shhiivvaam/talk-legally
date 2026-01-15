import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  getAnalytics: (period: string) => apiClient.get(`/admin/analytics?period=${period}`),
  getPendingVerifications: () => apiClient.get('/admin/verification/lawyers/pending'),
  verifyLawyer: (id: string, status: string) => apiClient.post(`/admin/verification/lawyers/${id}/verify`, { status }),
  getUsers: (limit: number, offset: number) => apiClient.get(`/admin/users?limit=${limit}&offset=${offset}`),
  getLawyers: (limit: number, offset: number) => apiClient.get(`/admin/lawyers?limit=${limit}&offset=${offset}`),
  getTransactions: (limit: number, offset: number) => apiClient.get(`/admin/transactions?limit=${limit}&offset=${offset}`),
};

export default apiClient;
