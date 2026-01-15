import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client';

export default function ChatScreen() {
  const route = useRoute();
  const { sessionId } = route.params as any;
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3005/chat');
    
    socketRef.current.emit('join_session', { sessionId, userId: '' });
    
    socketRef.current.on('receive_message', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [sessionId]);

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current?.emit('send_message', {
        sessionId,
        senderId: '',
        senderType: 'user',
        message: message.trim(),
        messageType: 'text',
      });
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.senderType === 'user' ? styles.userMessage : styles.lawyerMessage]}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
          mode="outlined"
        />
        <Button onPress={sendMessage}>Send</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  lawyerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
});
