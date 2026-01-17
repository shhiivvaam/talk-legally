import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <Text className="text-xl font-bold mb-4">Profile</Text>
            <Text onPress={() => router.replace('/(auth)/login')} className="text-red-500 font-bold p-4">Logout (Dev)</Text>
        </SafeAreaView>
    );
}
