import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import { useAuthStore, loadUserFromStorage } from '../stores/auth.store';
import { View, ActivityIndicator } from 'react-native';

const queryClient = new QueryClient();

import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  // 1. Hydrate the store and show splash for 2s
  useEffect(() => {
    const initAuth = async () => {
      try {
        await loadUserFromStorage();
        // Wait for 2 seconds as requested by the user
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    };
    initAuth();
  }, []);

  // 2. Protect routes
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = !!accessToken; // Simple check

    if (!isAuthenticated && !inAuthGroup) {
      // If not logged in and trying to access protected route (like tabs), redirect to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // If logged in and trying to access auth screens, redirect to home
      router.replace('/(tabs)');
    }
  }, [isReady, accessToken, segments]);

  // Show a loading screen while checking auth state
  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </QueryClientProvider>
  );
}
