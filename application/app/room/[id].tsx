import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft, Phone, Video, Send, Paperclip, MoreVertical } from 'lucide-react-native';
import { useState, useRef } from 'react';

// Mock Messages
const INITIAL_MESSAGES = [
    { id: '1', text: 'Hello! How can I help you today?', sender: 'lawyer', time: '10:00 AM' },
    { id: '2', text: 'Hi, I have a question regarding a property dispute.', sender: 'user', time: '10:01 AM' },
    { id: '3', text: 'Sure, please share more details.', sender: 'lawyer', time: '10:02 AM' },
];

export default function ChatRoomScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');

        // Scroll to bottom
        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isUser = item.sender === 'user';
        return (
            <View className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                    <Image
                        source={require('../../assets/images/lawyer-avatar.png')}
                        style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8, marginTop: 4 }}
                    />
                )}
                <View
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${isUser
                            ? 'bg-primary-900 rounded-tr-none'
                            : 'bg-white border border-gray-200 rounded-tl-none'
                        }`}
                >
                    <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-800'}`}>
                        {item.text}
                    </Text>
                    <Text className={`text-[10px] mt-1 text-right ${isUser ? 'text-primary-200' : 'text-gray-400'}`}>
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <ArrowLeft size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <View className="relative">
                        <Image
                            source={require('../../assets/images/lawyer-avatar.png')}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                        <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </View>
                    <View className="ml-3">
                        <Text className="font-bold text-gray-900 text-base">{name || 'Adv. Unknown'}</Text>
                        <Text className="text-green-600 text-xs font-medium">Online • ₹50/min</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-x-4">
                    <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
                        <Phone size={20} color="#0F172A" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
                        <Video size={20} color="#0F172A" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                className="flex-1"
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                />

                {/* Input Area */}
                <View className="px-4 py-3 bg-white border-t border-gray-100 flex-row items-center">
                    <TouchableOpacity className="p-2 mr-2">
                        <Paperclip size={24} color="#94A3B8" />
                    </TouchableOpacity>
                    <View className="flex-1 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 flex-row items-center">
                        <TextInput
                            className="flex-1 text-gray-800 text-base max-h-24" // Added max-h for multiline support
                            placeholder="Type a message..."
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                    </View>
                    <TouchableOpacity
                        onPress={sendMessage}
                        className={`ml-3 p-3 rounded-full ${inputText.trim() ? 'bg-primary-900' : 'bg-gray-200'}`}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
