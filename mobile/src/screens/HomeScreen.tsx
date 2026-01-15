import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { walletService } from '../services/api';

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const balance = useSelector((state: any) => state.wallet.balance);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await walletService.getBalance();
      dispatch({ type: 'wallet/setBalance', payload: response.data.balance });
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="titleLarge">Wallet Balance</Text>
          <Text variant="headlineMedium">₹{balance.toFixed(2)}</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Wallet')} style={styles.button}>
            Add Money
          </Button>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('LawyerList')}
        style={styles.button}
      >
        Find Lawyers
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Profile')}
        style={styles.button}
      >
        Profile
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  balanceCard: {
    marginBottom: 20,
    padding: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
