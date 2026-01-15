import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email && !phone) {
      Alert.alert('Error', 'Please enter email or phone');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(login({ email: email || undefined, phone: phone || undefined, password }) as any);
      if (result.payload) {
        await AsyncStorage.setItem('token', result.payload.accessToken);
        await AsyncStorage.setItem('refreshToken', result.payload.refreshToken);
        navigation.replace('Home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Talk Legally</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <Text style={styles.orText}>OR</Text>
      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
        Login
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('GoogleSignIn')}>
        Sign in with Google
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
