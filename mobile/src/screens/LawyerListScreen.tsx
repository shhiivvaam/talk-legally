import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { userService } from '../services/api';

export default function LawyerListScreen() {
  const navigation = useNavigation();
  const [lawyers, setLawyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    setLoading(true);
    try {
      const response = await userService.searchLawyers({});
      setLawyers(response.data.lawyers);
    } catch (error) {
      console.error('Failed to load lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLawyer = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('LawyerDetail', { lawyer: item })}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{item.name}</Text>
          <Text variant="bodyMedium">{item.bio}</Text>
          <View style={styles.chips}>
            {item.specialization?.map((spec: string, index: number) => (
              <Chip key={index} style={styles.chip}>{spec}</Chip>
            ))}
          </View>
          <Text variant="bodySmall">Rating: {item.ratingAvg?.toFixed(1)} ⭐</Text>
          <Text variant="bodySmall">Chat: ₹{item.chatPricePerMin}/min</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search lawyers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={lawyers}
        renderItem={renderLawyer}
        keyExtractor={(item: any) => item.id}
        refreshing={loading}
        onRefresh={loadLawyers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchbar: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
});
