import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { sessionService } from '../services/api';

export default function LawyerDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { lawyer } = route.params as any;

  const handleStartSession = async (type: string) => {
    try {
      const response = await sessionService.createSession(lawyer.id, type);
      if (type === 'chat') {
        navigation.navigate('Chat', { sessionId: response.data.sessionId });
      } else {
        navigation.navigate('Call', { sessionId: response.data.sessionId, type });
      }
    } catch (error: any) {
      console.error('Failed to start session:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="headlineSmall">{lawyer.name}</Text>
          <Text variant="bodyMedium">{lawyer.bio}</Text>
          <View style={styles.chips}>
            {lawyer.specialization?.map((spec: string, index: number) => (
              <Chip key={index}>{spec}</Chip>
            ))}
          </View>
          <Text variant="bodySmall">Experience: {lawyer.experienceYears} years</Text>
          <Text variant="bodySmall">Rating: {lawyer.ratingAvg?.toFixed(1)} ⭐</Text>
        </Card.Content>
      </Card>

      <Card style={styles.pricingCard}>
        <Card.Content>
          <Text variant="titleMedium">Pricing</Text>
          <Text>Chat: ₹{lawyer.chatPricePerMin}/min</Text>
          <Text>Voice: ₹{lawyer.voicePricePerMin}/min</Text>
          <Text>Video: ₹{lawyer.videoPricePerMin}/min</Text>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={() => handleStartSession('chat')} style={styles.button}>
        Start Chat
      </Button>
      <Button mode="contained" onPress={() => handleStartSession('voice')} style={styles.button}>
        Voice Call
      </Button>
      <Button mode="contained" onPress={() => handleStartSession('video')} style={styles.button}>
        Video Call
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  pricingCard: {
    marginTop: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
