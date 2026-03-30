import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import { Eye, EyeOff, Scale, User } from 'lucide-react-native';

import { Image } from 'expo-image';
import clsx from 'clsx';

export default function LoginScreen() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<'user' | 'lawyer'>('user');

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
            const data = await authApi.login({ email, password, role });
            if (data?.user && data?.accessToken) {
                // Check verification status for lawyers
                if (role === 'lawyer' && data.user.verificationStatus === 'pending') {
                    Alert.alert(
                        'Verification Pending',
                        'Your account is currently under review by our admin team. You will be notified once verified.'
                    );
                    return;
                }

                if (role === 'lawyer' && data.user.verificationStatus === 'rejected') {
                    Alert.alert(
                        'Application Rejected',
                        'Your application has been rejected. Please contact support for more details.'
                    );
                    return;
                }

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
                <View className="items-center mb-8">
                    <Image
                        source={require('../../assets/images/icon.png')}
                        style={{ width: 100, height: 100, marginBottom: 12 }}
                        contentFit="contain"
                    />
                    <Text className="text-3xl font-bold text-primary-900">Talk Legally</Text>
                    <Text className="text-gray-500 mt-2">Consult with top lawyers instantly</Text>
                </View>

                {/* Role Switcher */}
                <View className="flex-row bg-gray-100 p-1 rounded-xl mb-8">
                    <TouchableOpacity
                        onPress={() => setRole('user')}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 12,
                            borderRadius: 8,
                            backgroundColor: role === 'user' ? 'white' : 'transparent',
                            gap: 8,
                            shadowOpacity: role === 'user' ? 0.1 : 0,
                            shadowRadius: 2,
                            elevation: role === 'user' ? 2 : 0,
                        }}
                    >
                        <User size={18} color={role === 'user' ? "#0F172A" : "#6B7280"} />
                        <Text style={{ fontWeight: '600', color: role === 'user' ? "#0F172A" : "#6B7280" }}>
                            Client
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setRole('lawyer')}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 12,
                            borderRadius: 8,
                            backgroundColor: role === 'lawyer' ? 'white' : 'transparent',
                            gap: 8,
                            shadowOpacity: role === 'lawyer' ? 0.1 : 0,
                            shadowRadius: 2,
                            elevation: role === 'lawyer' ? 2 : 0,
                        }}
                    >
                        <Scale size={18} color={role === 'lawyer' ? "#0F172A" : "#6B7280"} />
                        <Text style={{ fontWeight: '600', color: role === 'lawyer' ? "#0F172A" : "#6B7280" }}>
                            Lawyer
                        </Text>
                    </TouchableOpacity>
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

                <Text className="text-center mt-6 p-4 text-gray-500">
                    New to Talk Legally?{' '}
                    <Text
                        className="text-primary-900 font-bold"
                        onPress={() => router.push({ pathname: '/(auth)/signup', params: { role } })}
                    >
                        Create Account
                    </Text>
                </Text>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
