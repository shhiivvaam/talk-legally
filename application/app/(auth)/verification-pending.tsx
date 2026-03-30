import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock } from 'lucide-react-native';
import { useAuthStore } from '../../stores/auth.store';

export default function VerificationPendingScreen() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
            <View className="mb-8 items-center">
                <View className="h-24 w-24 bg-yellow-100 rounded-full items-center justify-center mb-6">
                    <Clock size={48} color="#CA8A04" />
                </View>
                <Text className="text-3xl font-bold text-primary-900 text-center mb-2">Under Review</Text>
                <Text className="text-gray-500 text-center text-lg leading-relaxed">
                    Your application has been submitted and is currently being reviewed by our team.
                </Text>
            </View>

            <View className="bg-gray-50 p-6 rounded-xl w-full mb-8 border border-gray-100">
                <Text className="text-gray-700 font-medium mb-2">What happens next?</Text>
                <Text className="text-gray-500 mb-2">• Our admin team checks your documents.</Text>
                <Text className="text-gray-500 mb-2">• Verification usually takes 24-48 hours.</Text>
                <Text className="text-gray-500">• You will be notified via email/SMS.</Text>
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                className="w-full bg-primary-900 py-4 rounded-xl items-center shadow-lg shadow-primary-900/20 active:opacity-90"
            >
                <Text className="text-white font-bold text-lg">Return to Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
