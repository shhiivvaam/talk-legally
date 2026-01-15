import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    dispatch(logout());
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="titleLarge">Profile</Text>
          {/* Profile details would go here */}
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});
