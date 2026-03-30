import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import { Eye, EyeOff } from 'lucide-react-native';

import { Image } from 'expo-image';

export default function SignupScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const role = (params.role as string) || 'user';

    const login = useAuthStore((state) => state.login);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        if (!name.trim() || !email.trim() || !password || (role === 'lawyer' && !phone.trim())) {
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
            let data;
            if (role === 'lawyer') {
                data = await authApi.registerLawyer({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    password
                });

                Alert.alert(
                    'Registration Successful',
                    'Please verify your email/phone via OTP.',
                    [{
                        text: 'OK', onPress: () => router.push({
                            pathname: '/(auth)/verify-otp',
                            params: { email: email.trim(), phone: phone.trim(), isLawyer: 'true' }
                        })
                    }]
                );
            } else {
                // Register returns { user, accessToken, refreshToken }
                data = await authApi.register({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(), // Optional for users
                    password
                });

                if (data?.user && data?.accessToken) {
                    // Auto-login upon successful registration
                    await login(data.user, data.accessToken);
                    router.replace('/(tabs)');
                } else {
                    Alert.alert('Account Created', 'Please log in with your new account.');
                    router.replace('/(auth)/login');
                }
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
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 20 }}>
                    <View className="mb-6 items-center">
                        <Image
                            source={require('../../assets/images/icon.png')}
                            style={{ width: 80, height: 80, marginBottom: 12 }}
                            contentFit="contain"
                        />
                        <Text className="text-2xl font-bold text-primary-900">
                            {role === 'lawyer' ? 'Join as Lawyer' : 'Create Account'}
                        </Text>
                        <Text className="text-gray-500 mt-2">
                            {role === 'lawyer' ? 'Expand your legal practice' : 'Join Talk Legally today'}
                        </Text>
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
                            <Text className="text-sm font-medium text-gray-700 mb-1">Phone Number {role === 'lawyer' && '*'}</Text>
                            <TextInput
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                                placeholder="+91 9876543210"
                                placeholderTextColor="#9CA3AF"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
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

                    <Text className="text-center mt-6 mb-10 text-gray-500">
                        Already have an account?{' '}
                        <Text
                            className="text-primary-900 font-bold"
                            onPress={() => router.back()}
                        >
                            Login
                        </Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
