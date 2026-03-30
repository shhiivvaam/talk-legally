import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native'; // Added Switch
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { LogOut, User as UserIcon, Settings, ChevronRight, CreditCard, Shield, Briefcase, FileText, HelpCircle } from 'lucide-react-native'; // Added icons

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const isLawyer = user?.role === 'lawyer';

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
                <View className="px-6 py-8 items-center border-b border-gray-100 bg-white">
                    <View className="relative mb-4">
                        <View className="w-28 h-28 bg-primary-50 rounded-full items-center justify-center overflow-hidden border-4 border-white shadow-lg shadow-gray-200">
                            <Image
                                source={require('../../assets/images/lawyer-avatar.png')} // Consistent placeholder
                                style={{ width: 112, height: 112 }}
                                contentFit="cover"
                            />
                        </View>
                        {isLawyer && (
                            <View className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                                <Shield size={16} color="white" fill="white" />
                            </View>
                        )}
                    </View>

                    <Text className="text-2xl font-bold text-primary-900">{user?.name || 'User Name'}</Text>
                    <Text className="text-gray-500 font-medium mb-1">{user?.email || 'email@example.com'}</Text>

                    {isLawyer ? (
                        <View className="bg-blue-100 px-3 py-1 rounded-full mt-2">
                            <Text className="text-blue-700 text-xs font-bold uppercase tracking-wide">Verified Lawyer</Text>
                        </View>
                    ) : (
                        <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
                            <Text className="text-green-700 text-xs font-bold uppercase tracking-wide">Premium Client</Text>
                        </View>
                    )}
                </View>

                {/* Menu Items */}
                <View className="px-6 py-6 gap-y-2">
                    {/* Role Specific Group */}
                    <Text className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{isLawyer ? 'Practice One' : 'My Account'}</Text>

                    {isLawyer ? (
                        <>
                            <MenuButton icon={<Briefcase size={20} color="#475569" />} label="Practice Details" />
                            <MenuButton icon={<FileText size={20} color="#475569" />} label="Manage Documents" />
                            <MenuButton icon={<CreditCard size={20} color="#475569" />} label="Earnings & Payouts" />
                        </>
                    ) : (
                        <>
                            <MenuButton icon={<UserIcon size={20} color="#475569" />} label="Personal Information" />
                            <MenuButton icon={<FileText size={20} color="#475569" />} label="My Cases" />
                            <MenuButton icon={<CreditCard size={20} color="#475569" />} label="Wallet & Payments" />
                        </>
                    )}

                    {/* General Group */}
                    <Text className="text-sm font-bold text-gray-400 mb-2 mt-4 uppercase tracking-wider">Preferences</Text>
                    <MenuButton icon={<Settings size={20} color="#475569" />} label="App Settings" />
                    <MenuButton icon={<HelpCircle size={20} color="#475569" />} label="Help & Support" />

                    <View className="h-px bg-gray-100 my-4" />

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center justify-between p-4 bg-red-50/50 rounded-2xl active:bg-red-100"
                    >
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                                <LogOut size={18} color="#EF4444" />
                            </View>
                            <Text className="ml-3 text-red-600 font-bold text-base">Logout</Text>
                        </View>
                    </TouchableOpacity>

                    <Text className="text-center text-gray-300 text-xs mt-6">Version 1.0.0 (Build 240)</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function MenuButton({ icon, label }: { icon: any, label: string }) {
    return (
        <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl mb-2 shadow-sm shadow-gray-100 active:bg-gray-50">
            <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
                    {icon}
                </View>
                <Text className="ml-3 text-gray-700 font-semibold text-base">{label}</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity>
    );
}
