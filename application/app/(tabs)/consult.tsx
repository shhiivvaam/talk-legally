import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, SlidersHorizontal } from 'lucide-react-native';

export default function ConsultScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4">
                <Text className="text-2xl font-bold text-primary-900 mb-4">Find a Lawyer</Text>

                {/* Search Bar */}
                <View className="flex-row items-center gap-x-2">
                    <View className="flex-1 flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <Search size={20} color="#94A3B8" />
                        <TextInput
                            className="ml-2 flex-1 text-gray-800"
                            placeholder="Search by name, expertise..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>
                    <TouchableOpacity className="p-4 bg-primary-900 rounded-xl">
                        <SlidersHorizontal size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Filters */}
                <View className="flex-row mb-6 overflow-hidden">
                    {['All', 'Criminal', 'Family', 'Corporate', 'Civil'].map((tab, i) => (
                        <TouchableOpacity
                            key={i}
                            className={`mr-2 px-6 py-2 rounded-full border ${i === 0 ? 'bg-primary-900 border-primary-900' : 'bg-white border-gray-200'}`}
                        >
                            <Text className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-gray-500'}`}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Results Placeholder */}
                <View className="items-center py-20">
                    <Text className="text-gray-400 mb-2">Search to find verified lawyers</Text>
                    <Text className="text-gray-300 text-sm text-center px-10">Use the filter to narrow down by expertise, location or price.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
