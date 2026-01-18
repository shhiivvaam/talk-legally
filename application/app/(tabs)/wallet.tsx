import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { Plus, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react-native';

export default function WalletScreen() {
    const { user } = useAuthStore();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-primary-900">Wallet</Text>
                <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
                    <History size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Balance Card */}
                <View className="bg-primary-900 p-6 rounded-3xl shadow-xl shadow-primary-900/40 mb-8 mt-2">
                    <Text className="text-primary-100 text-sm font-medium mb-1">Total Balance</Text>
                    <Text className="text-white text-4xl font-bold mb-6">₹ {(user as any)?.walletBalance || '0.00'}</Text>

                    <View className="flex-row gap-x-4">
                        <TouchableOpacity className="flex-1 bg-white/20 py-3 rounded-xl items-center flex-row justify-center">
                            <Plus size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Add Money</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row justify-between mb-8">
                    <TouchableOpacity className="w-[48%] bg-green-50 p-4 rounded-2xl flex-row items-center border border-green-100">
                        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                            <ArrowDownLeft size={20} color="#059669" />
                        </View>
                        <Text className="ml-3 font-bold text-green-700">Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[48%] bg-blue-50 p-4 rounded-2xl flex-row items-center border border-blue-100">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                            <ArrowUpRight size={20} color="#2563EB" />
                        </View>
                        <Text className="ml-3 font-bold text-blue-700">Pay</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Transactions */}
                <View>
                    <Text className="text-lg font-bold text-primary-900 mb-4">Recent Transactions</Text>
                    <View className="items-center py-10">
                        <Text className="text-gray-400">No transactions yet</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
