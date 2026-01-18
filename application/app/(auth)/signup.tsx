import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import { Eye, EyeOff } from 'lucide-react-native';

import { Image } from 'expo-image';

export default function SignupScreen() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        if (!name.trim() || !email.trim() || !password) {
            Alert.alert('Missing Fields', 'Please fill in all details.');
            return;
        }

        // Validate formats locally to prevent crashes
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            // Register returns { user, accessToken, refreshToken }
            const data = await authApi.register({ name: name.trim(), email: email.trim(), password });

            if (data?.user && data?.accessToken) {
                // Auto-login upon successful registration
                await login(data.user, data.accessToken);
                router.replace('/(tabs)');
            } else {
                // Fallback: Redirect to login if auto-login fails for some reason
                Alert.alert('Account Created', 'Please log in with your new account.');
                router.replace('/(auth)/login');
            }
        } catch (error: any) {
            console.log('Signup error:', error);
            const message = error.response?.data?.message || 'Could not create account. Please try again.';
            Alert.alert('Signup Failed', message);
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
                <View className="mb-8 items-center">
                    <Image
                        source={require('../../assets/images/icon.png')}
                        style={{ width: 100, height: 100, marginBottom: 12 }}
                        contentFit="contain"
                    />
                    <Text className="text-2xl font-bold text-primary-900">Create Account</Text>
                    <Text className="text-gray-500 mt-2">Join Talk Legally today</Text>
                </View>

                <View className="gap-y-4">
                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">Full Name</Text>
                        <TextInput
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="John Doe"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
                        <TextInput
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="john@example.com"
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
                                placeholder="Create a password"
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
                        className="w-full bg-primary-900 py-4 rounded-xl items-center shadow-lg shadow-primary-900/20 mt-2 active:opacity-90"
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-500">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-primary-900 font-bold">Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
