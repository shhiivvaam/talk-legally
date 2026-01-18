import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import { Eye, EyeOff } from 'lucide-react-native';

import { Image } from 'expo-image';

export default function LoginScreen() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        // Prevent crashes by validating input first
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter your email and password.');
            return;
        }

        // Basic format check to avoid backend parsing errors
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await authApi.login({ email, password });
            if (data?.user && data?.accessToken) {
                await login(data.user, data.accessToken);
                // Router replacement should happen after state update
                router.replace('/(tabs)');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.log('Login error:', error);
            const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
            Alert.alert('Login Failed', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-center px-6"
            >
                <View className="items-center mb-10">
                    <Image
                        source={require('../../assets/images/icon.png')}
                        style={{ width: 120, height: 120, marginBottom: 16 }}
                        contentFit="contain"
                    />
                    <Text className="text-3xl font-bold text-primary-900">Talk Legally</Text>
                    <Text className="text-gray-500 mt-2">Consult with top lawyers instantly</Text>
                </View>

                <View className="gap-y-4">
                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
                        <TextInput
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="Enter your email"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
                        <View className="w-full bg-gray-50 border border-gray-200 rounded-xl flex-row items-center px-4">
                            <TextInput
                                className="flex-1 py-4 text-gray-800"
                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-primary-900 py-4 rounded-xl items-center shadow-lg shadow-primary-900/20 active:opacity-90"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Login</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-6 p-4">
                    <Text className="text-gray-500">New to Talk Legally? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                        <Text className="text-primary-900 font-bold">Create Account</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
