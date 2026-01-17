import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Config } from '../constants/Config';

export const api = axios.create({
    baseURL: Config.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error fetching token', error);
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Optional: Global error handling
        if (error.response?.status === 401) {
            // Clean up token if invalid
            await SecureStore.deleteItemAsync('accessToken');
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: async (data: any) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    register: async (data: any) => {
        const response = await api.post('/auth/register/user', data);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

export const userApi = {
    searchLawyers: async (params: any = {}) => {
        // Default to fetching all/some if no params
        const response = await api.get('/users/lawyers/search', { params });
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },
};

