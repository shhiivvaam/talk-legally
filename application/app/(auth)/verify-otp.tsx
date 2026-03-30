import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';

export default function VerifyOtpScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { email, phone, isLawyer } = params;

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp || otp.length < 4) {
            Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
            return;
        }

        setIsLoading(true);
        try {
            // Verify OTP
            const data = await authApi.verifyOtp({
                email,
                phone,
                otp,
                role: isLawyer === 'true' ? 'lawyer' : 'user'
            });

            // Auto login logic
            const login = useAuthStore.getState().login;
            if (data?.user && data?.accessToken) {
                await login(data.user, data.accessToken);
            }

            if (isLawyer === 'true') {
                Alert.alert('Verified', 'OTP Verified. Please upload your documents.');
                router.replace({ pathname: '/(auth)/upload-documents', params: { email, phone } });
            } else {
                Alert.alert('Verified', 'Account verified successfully.');
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            console.log('OTP Verification Error', error);
            Alert.alert('Verification Failed', 'Invalid OTP or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-center px-6">
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-primary-900">Verify OTP</Text>
                    <Text className="text-gray-500 mt-2">Enter the 4-digit code sent to {email || phone}</Text>
                </View>

                <View className="gap-y-4">
                    <View>
                        <TextInput
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-center text-3xl tracking-[10px] font-bold"
                            placeholder="0000"
                            placeholderTextColor="#CBD5E1"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={4}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleVerify}
                        disabled={isLoading}
                        className="w-full bg-primary-900 py-4 rounded-xl items-center shadow-lg shadow-primary-900/20 mt-4 active:opacity-90"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Verify & Proceed</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()} className="items-center mt-4">
                        <Text className="text-gray-500">Wrong number/email? <Text className="text-primary-900 font-bold">Go Back</Text></Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
