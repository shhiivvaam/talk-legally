import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900 mb-2">PAGE NOT FOUND</Text>
                <Text className="text-gray-500 text-center mb-6">
                    The screen you are looking for doesn't exist or has been moved.
                </Text>

                <Link href="/" className="bg-primary-900 px-6 py-3 rounded-xl">
                    <Text className="text-white font-bold">Go to Home</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}
