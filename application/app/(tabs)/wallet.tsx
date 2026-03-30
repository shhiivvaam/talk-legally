import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { Plus, ArrowDownLeft, ArrowUpRight, History, X, CreditCard, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

export default function WalletScreen() {
    const { user } = useAuthStore();
    const [isAddMoneyVisible, setIsAddMoneyVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    // Mock Transactions
    const transactions = [
        { id: 1, type: 'credit', title: 'Added to Wallet', date: 'Today, 10:30 AM', amount: '+ ₹500', status: 'Success' },
        { id: 2, type: 'debit', title: 'Consultation with Adv. Sharma', date: 'Yesterday, 04:15 PM', amount: '- ₹250', status: 'Success' },
        { id: 3, type: 'credit', title: 'Added to Wallet', date: '12 Jan, 09:00 AM', amount: '+ ₹1000', status: 'Success' },
    ];

    const handleAddMoney = () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) < 1) {
            Alert.alert("Invalid Amount", "Please enter a valid amount (Min ₹1)");
            return;
        }

        setProcessing(true);
        // Mock Payment Gateway Delay
        setTimeout(() => {
            setProcessing(false);
            setIsAddMoneyVisible(false);
            Alert.alert("Success", `₹${amount} added successfully! (Mock)`);
            setAmount('');
            // TODO: Update user balance in store
        }, 2000);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row justify-between items-center bg-white">
                <Text className="text-2xl font-bold text-primary-900">Wallet</Text>
                <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
                    <History size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Balance Card */}
                <View className="bg-primary-900 p-6 rounded-3xl shadow-xl shadow-primary-900/40 mb-8 mt-2 overflow-hidden relative">
                    {/* Decorative Circles */}
                    <View className="absolute top-[-20] right-[-20] w-32 h-32 bg-primary-800 rounded-full opacity-50" />
                    <View className="absolute bottom-[-10] left-[-10] w-20 h-20 bg-primary-800 rounded-full opacity-50" />

                    <Text className="text-primary-100 text-sm font-medium mb-1">Total Balance</Text>
                    <Text className="text-white text-4xl font-bold mb-6">₹ {(user as any)?.walletBalance || '1450.00'}</Text>

                    <View className="flex-row gap-x-4">
                        <TouchableOpacity
                            onPress={() => setIsAddMoneyVisible(true)}
                            className="flex-1 bg-white py-3 rounded-xl items-center flex-row justify-center shadow-lg"
                        >
                            <Plus size={20} color="#0F172A" />
                            <Text className="text-primary-900 font-bold ml-2">Add Money</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row justify-between mb-8">
                    <TouchableOpacity className="w-[48%] bg-green-50 p-4 rounded-2xl flex-row items-center border border-green-100 active:bg-green-100">
                        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                            <ArrowDownLeft size={20} color="#059669" />
                        </View>
                        <Text className="ml-3 font-bold text-green-700">Receive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[48%] bg-blue-50 p-4 rounded-2xl flex-row items-center border border-blue-100 active:bg-blue-100">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                            <ArrowUpRight size={20} color="#2563EB" />
                        </View>
                        <Text className="ml-3 font-bold text-blue-700">Withdraw</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Transactions */}
                <View className="mb-20">
                    <Text className="text-lg font-bold text-primary-900 mb-4">Recent Transactions</Text>

                    {transactions.map((tx) => (
                        <View key={tx.id} className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-3 border border-gray-100">
                            <View className="flex-row items-center">
                                <View className={`w-10 h-10 rounded-full items-center justify-center ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {tx.type === 'credit' ?
                                        <ArrowDownLeft size={20} color={tx.type === 'credit' ? "#059669" : "#EF4444"} /> :
                                        <ArrowUpRight size={20} color={tx.type === 'credit' ? "#059669" : "#EF4444"} />
                                    }
                                </View>
                                <View className="ml-3">
                                    <Text className="font-bold text-gray-800">{tx.title}</Text>
                                    <Text className="text-xs text-gray-500">{tx.date}</Text>
                                </View>
                            </View>
                            <Text className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>{tx.amount}</Text>
                        </View>
                    ))}

                    <TouchableOpacity className="items-center mt-2 py-2">
                        <Text className="text-primary-900 font-semibold text-sm">View All Transactions</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Add Money Modal */}
            <Modal
                transparent={true}
                visible={isAddMoneyVisible}
                animationType="slide"
                onRequestClose={() => setIsAddMoneyVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 min-h-[50%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-900">Add Money to Wallet</Text>
                            <TouchableOpacity onPress={() => setIsAddMoneyVisible(false)} className="p-2 bg-gray-100 rounded-full">
                                <X size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm font-medium text-gray-500 mb-2">Enter Amount</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 mb-6 focus:border-primary-900 bg-white">
                            <Text className="text-2xl font-bold text-gray-400 mr-2">₹</Text>
                            <TextInput
                                className="flex-1 text-3xl font-bold text-primary-900"
                                placeholder="0"
                                keyboardType="number-pad"
                                value={amount}
                                onChangeText={setAmount}
                                autoFocus
                            />
                        </View>

                        <Text className="text-sm font-medium text-gray-500 mb-3">Recommended</Text>
                        <View className="flex-row gap-2 mb-8">
                            {['100', '500', '1000'].map((amt) => (
                                <TouchableOpacity
                                    key={amt}
                                    onPress={() => setAmount(amt)}
                                    className="px-4 py-2 border border-gray-200 rounded-full bg-gray-50"
                                >
                                    <Text className="font-medium text-gray-700">₹{amt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={handleAddMoney}
                            disabled={processing}
                            className={`w-full py-4 rounded-xl items-center flex-row justify-center ${processing ? 'bg-primary-800' : 'bg-primary-900'}`}
                        >
                            {processing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text className="text-white font-bold text-lg mr-2">Proceed to Pay</Text>
                                    <ChevronRight size={20} color="white" />
                                </>
                            )}
                        </TouchableOpacity>

                        <View className="mt-6 flex-row justify-center items-center">
                            <CreditCard size={16} color="#94A3B8" />
                            <Text className="text-gray-400 text-xs ml-2">Secured by Razorpay (Mock)</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
