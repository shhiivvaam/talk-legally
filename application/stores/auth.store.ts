import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    accessToken: string | null;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isLoading: false,
    login: async (user, token) => {
        await SecureStore.setItemAsync('accessToken', token);
        await SecureStore.setItemAsync('user', JSON.stringify(user));
        set({ user, accessToken: token });
    },
    logout: async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('user');
        set({ user: null, accessToken: null });
        router.replace('/(auth)/login');
    },
}));

// Initialize store from storage
export const loadUserFromStorage = async () => {
    const token = await SecureStore.getItemAsync('accessToken');
    const userStr = await SecureStore.getItemAsync('user');

    if (token && userStr) {
        useAuthStore.setState({ accessToken: token, user: JSON.parse(userStr) });
    }
};
