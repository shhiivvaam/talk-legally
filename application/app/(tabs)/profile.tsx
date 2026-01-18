import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { LogOut, User as UserIcon, Settings, ChevronRight, CreditCard, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header / User Info */}
                <View className="px-6 py-6 items-center border-b border-gray-100">
                    <View className="w-24 h-24 bg-primary-50 rounded-full items-center justify-center mb-4 overflow-hidden border-2 border-primary-100">
                        <Image
                            source={require('../../assets/images/icon.png')}
                            style={{ width: 80, height: 80 }}
                            contentFit="cover"
                        />
                    </View>
                    <Text className="text-xl font-bold text-primary-900">{user?.name || 'User'}</Text>
                    <Text className="text-gray-500">{user?.email || 'email@example.com'}</Text>
                </View>

                {/* Menu Items */}
                <View className="px-6 py-6 gap-y-2">
                    <Text className="text-sm font-bold text-gray-400 mb-2 uppercase">Account</Text>

                    <MenuButton icon={<UserIcon size={20} color="#475569" />} label="Personal Information" />
                    <MenuButton icon={<CreditCard size={20} color="#475569" />} label="Wallet & Payments" />
                    <MenuButton icon={<Shield size={20} color="#475569" />} label="Security & Privacy" />
                    <MenuButton icon={<Settings size={20} color="#475569" />} label="App Settings" />

                    <View className="h-px bg-gray-100 my-4" />

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center justify-between p-4 bg-red-50 rounded-xl"
                    >
                        <View className="flex-row items-center">
                            <LogOut size={20} color="#EF4444" />
                            <Text className="ml-3 text-red-500 font-medium">Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function MenuButton({ icon, label }: { icon: any, label: string }) {
    return (
        <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-2">
            <View className="flex-row items-center">
                {icon}
                <Text className="ml-3 text-gray-700 font-medium">{label}</Text>
            </View>
            <ChevronRight size={16} color="#CBD5E1" />
        </TouchableOpacity>
    );
}
