import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell } from 'lucide-react-native';
import { useAuthStore } from '../../stores/auth.store';

export default function HomeScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <View>
          <Text className="text-gray-500 font-medium">Welcome back,</Text>
          <Text className="text-xl font-bold text-primary-900">{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
          <Bell size={24} stroke="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <Search size={20} stroke="#94A3B8" />
          <Text className="ml-2 text-gray-400">Find a lawyer by name or category...</Text>
        </View>

        {/* Categories / Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-primary-900 mb-4">Practice Areas</Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              { name: 'Criminal', icon: '⚖️' },
              { name: 'Family', icon: '🏠' },
              { name: 'Property', icon: '🏢' },
              { name: 'Corporate', icon: '💼' },
              { name: 'Civil', icon: '📜' },
              { name: 'More', icon: '➕' }
            ].map((cat, index) => (
              <TouchableOpacity key={index} className="w-[30%] items-center mb-4">
                <View className="w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center mb-2 border border-gray-100 shadow-sm">
                  <Text className="text-2xl">{cat.icon}</Text>
                </View>
                <Text className="text-xs font-semibold text-gray-700">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Lawyers */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-primary-900">Featured Lawyers</Text>
            <TouchableOpacity>
              <Text className="text-primary-900 text-sm font-bold">See All</Text>
            </TouchableOpacity>
          </View>

          {/* List Item */}
          {[
            { name: 'Adv. Anjali Sharma', area: 'Family Law', exp: '12 Yrs Exp', rating: '4.9' },
            { name: 'Adv. Rohan Mehra', area: 'Criminal Law', exp: '15 Yrs Exp', rating: '4.8' },
            { name: 'Adv. Priya Gupta', area: 'Corporate Law', exp: '8 Yrs Exp', rating: '5.0' }
          ].map((lawyer, i) => (
            <TouchableOpacity key={i} className="flex-row bg-white border border-gray-100 p-4 rounded-xl mb-4 shadow-sm active:bg-gray-50">
              <Image
                source={require('../../assets/images/lawyer-avatar.png')}
                style={{ width: 64, height: 64, borderRadius: 16, marginRight: 16 }}
                contentFit="cover"
                transition={500}
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-primary-900">{lawyer.name}</Text>
                <Text className="text-gray-500 text-sm">{lawyer.area} • {lawyer.exp}</Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-amber-500 text-xs font-bold">★ {lawyer.rating}</Text>
                  <Text className="text-gray-400 text-xs ml-2">(120+ consultation)</Text>
                </View>
              </View>
              <View className="justify-center">
                <View className="bg-primary-900 px-4 py-2 rounded-lg">
                  <Text className="text-white font-bold text-xs">Consult</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
