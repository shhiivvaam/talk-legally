import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyOtpScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState('');

    const handleVerify = () => {
        // Verify OTP logic
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-center px-6">
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-primary-900">Verify OTP</Text>
                    <Text className="text-gray-500 mt-2">Enter the code sent to your email</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <TextInput
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-center text-2xl tracking-widest"
                            placeholder="0000"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={4}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleVerify}
                        className="w-full bg-primary-900 py-4 rounded-xl items-center shadow-lg shadow-primary-900/20 mt-4"
                    >
                        <Text className="text-white font-bold text-lg">Verify & Proceed</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
