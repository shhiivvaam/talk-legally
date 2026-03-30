import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { Image } from 'expo-image';
import { DollarSign, Clock, Users, Star, Bell } from 'lucide-react-native';

export default function LawyerDashboard() {
    const { user } = useAuthStore();
    const [isOnline, setIsOnline] = useState(false);

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                <View className="flex-row items-center">
                    <Image
                        source={require('../assets/images/lawyer-avatar.png')} // Fallback or user image
                        style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
                        contentFit="cover"
                    />
                    <View>
                        <Text className="text-gray-500 text-xs font-bold uppercase">Welcome Lawyer</Text>
                        <Text className="text-lg font-bold text-primary-900">{user?.name}</Text>
                    </View>
                </View>
                <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
                    <Bell size={24} stroke="#0F172A" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6">

                {/* Status Toggle */}
                <View className="flex-row items-center justify-between bg-primary-900 p-6 rounded-2xl shadow-lg shadow-primary-900/20 mb-8">
                    <View>
                        <Text className="text-white font-bold text-lg mb-1">
                            {isOnline ? 'You are Online' : 'You are Offline'}
                        </Text>
                        <Text className="text-primary-200 text-sm">
                            {isOnline ? 'Receiving consultation requests' : 'Go online to start earning'}
                        </Text>
                    </View>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: "#334155", true: "#22C55E" }}
                        thumbColor={"#FFFFFF"}
                    />
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
                    <StatCard
                        label="Total Earnings"
                        value="₹12,450"
                        icon={<DollarSign size={20} color="#0F172A" />}
                        bg="bg-green-50"
                        borderColor="border-green-100"
                    />
                    <StatCard
                        label="Consultations"
                        value="24"
                        icon={<Users size={20} color="#0F172A" />}
                        bg="bg-blue-50"
                        borderColor="border-blue-100"
                    />
                    <StatCard
                        label="Time Online"
                        value="5h 30m"
                        icon={<Clock size={20} color="#0F172A" />}
                        bg="bg-purple-50"
                        borderColor="border-purple-100"
                    />
                    <StatCard
                        label="Rating"
                        value="4.9"
                        icon={<Star size={20} color="#0F172A" />}
                        bg="bg-amber-50"
                        borderColor="border-amber-100"
                    />
                </View>

                {/* Recent Requests / Activity */}
                <View>
                    <Text className="text-lg font-bold text-primary-900 mb-4">Recent Activity</Text>

                    {/* Empty State */}
                    <View className="items-center justify-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Clock size={48} color="#94A3B8" />
                        <Text className="text-gray-400 mt-4 font-medium">No recent consultations</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

function StatCard({ label, value, icon, bg, borderColor }: any) {
    return (
        <View className={`w-[48%] p-4 rounded-xl border ${borderColor} ${bg}`}>
            <View className="flex-row items-center justify-between mb-2">
                <View className="p-2 bg-white rounded-lg shadow-sm">
                    {icon}
                </View>
            </View>
            <Text className="text-2xl font-bold text-primary-900 mb-1">{value}</Text>
            <Text className="text-gray-500 text-xs font-semibold uppercase">{label}</Text>
        </View>
    );
}
