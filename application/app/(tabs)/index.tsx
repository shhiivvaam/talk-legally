import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <View>
          <Text className="text-gray-500 font-medium">Welcome back,</Text>
          <Text className="text-xl font-bold text-primary-900">User</Text>
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
          <Text className="text-lg font-bold text-primary-900 mb-4">Categories</Text>
          <View className="flex-row flex-wrap justify-between">
            {['Criminal', 'Family', 'Property', 'Corporate', 'Civil', 'More'].map((cat, index) => (
              <TouchableOpacity key={index} className="w-[30%] items-center mb-4">
                <View className="w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center mb-2">
                  {/* Placeholder for Icon */}
                  <Text className="text-xl">⚖️</Text>
                </View>
                <Text className="text-xs font-medium text-gray-700">{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Lawyers */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-primary-900">Top Rated Lawyers</Text>
            <Text className="text-primary-900 text-sm font-bold">See All</Text>
          </View>

          {/* List Item */}
          {[1, 2, 3].map((_, i) => (
            <View key={i} className="flex-row bg-white border border-gray-100 p-4 rounded-xl mb-4 shadow-sm">
              <Image
                source="https://i.pravatar.cc/150?img=12" // Placeholder Image
                style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
                contentFit="cover"
                transition={1000}
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-primary-900">Adv. Sharma</Text>
                <Text className="text-gray-500 text-sm">Family Law • 10 Yrs Exp</Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-secondary text-xs font-bold">★ 4.9</Text>
                  <Text className="text-gray-400 text-xs ml-2">(120 Reviews)</Text>
                </View>
              </View>
              <View className="justify-center">
                <TouchableOpacity className="bg-primary-900 px-4 py-2 rounded-lg">
                  <Text className="text-white font-bold text-xs">Consult</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
