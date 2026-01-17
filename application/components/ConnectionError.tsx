import { View, Text, TouchableOpacity } from 'react-native';
import { WifiOff } from 'lucide-react-native';

interface Props {
    onRetry: () => void;
}

export const ConnectionError = ({ onRetry }: Props) => {
    return (
        <View className="flex-1 bg-white items-center justify-center p-6">
            <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-6">
                <WifiOff size={40} color="#EF4444" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">Connection Failed</Text>
            <Text className="text-gray-500 text-center mb-8">
                We couldn't connect to the server. Please check your internet connection and try again.
            </Text>

            <TouchableOpacity
                onPress={onRetry}
                className="bg-primary-900 px-8 py-3 rounded-xl w-full items-center"
            >
                <Text className="text-white font-bold text-lg">Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};
