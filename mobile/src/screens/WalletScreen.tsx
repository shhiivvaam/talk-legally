import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { walletService, paymentService } from '../services/api';

export default function WalletScreen() {
  const dispatch = useDispatch();
  const balance = useSelector((state: any) => state.wallet.balance);
  const transactions = useSelector((state: any) => state.wallet.transactions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(),
      ]);
      dispatch({ type: 'wallet/setBalance', payload: balanceRes.data.balance });
      dispatch({ type: 'wallet/setTransactions', payload: transactionsRes.data.transactions });
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  const handleAddMoney = async (amount: number) => {
    setLoading(true);
    try {
      const order = await paymentService.createOrder(amount, 'razorpay');
      // In production, open payment gateway
      console.log('Payment order:', order);
    } catch (error) {
      console.error('Failed to create payment order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="titleLarge">Current Balance</Text>
          <Text variant="headlineMedium">₹{balance.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <View style={styles.quickAdd}>
        <Button onPress={() => handleAddMoney(100)}>₹100</Button>
        <Button onPress={() => handleAddMoney(500)}>₹500</Button>
        <Button onPress={() => handleAddMoney(1000)}>₹1000</Button>
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <Card style={styles.transactionCard}>
            <Card.Content>
              <Text>{item.description}</Text>
              <Text style={item.type === 'credit' ? styles.credit : styles.debit}>
                {item.type === 'credit' ? '+' : '-'}₹{item.amount}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  balanceCard: {
    marginBottom: 20,
  },
  quickAdd: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  transactionCard: {
    marginBottom: 10,
  },
  credit: {
    color: 'green',
  },
  debit: {
    color: 'red',
  },
});
