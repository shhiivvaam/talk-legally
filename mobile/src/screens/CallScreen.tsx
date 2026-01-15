import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import RtcEngine, { RtcLocalView, RtcRemoteView } from 'react-native-agora';
import { sessionService } from '../services/api';

export default function CallScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, type } = route.params as any;
  const [agoraToken, setAgoraToken] = useState('');
  const [channelName, setChannelName] = useState('');
  const [duration, setDuration] = useState(0);
  const engineRef = useRef<any>(null);

  useEffect(() => {
    initializeCall();
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
      sessionService.heartbeat(sessionId, duration + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      endCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      const response = await sessionService.getAgoraToken(sessionId);
      setAgoraToken(response.data.token);
      setChannelName(response.data.channelName);

      const engine = await RtcEngine.create(process.env.EXPO_PUBLIC_AGORA_APP_ID || '');
      await engine.enableVideo();
      await engine.joinChannel(agoraToken, channelName, null, 0);
      engineRef.current = engine;
    } catch (error) {
      console.error('Failed to initialize call:', error);
    }
  };

  const endCall = async () => {
    try {
      await sessionService.endSession(sessionId);
      if (engineRef.current) {
        await engineRef.current.leaveChannel();
        await RtcEngine.destroy();
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <RtcLocalView.SurfaceView style={styles.localVideo} />
        <RtcRemoteView.SurfaceView style={styles.remoteVideo} />
      </View>
      <View style={styles.controls}>
        <Text>Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</Text>
        <Button mode="contained" onPress={endCall} style={styles.endButton}>
          End Call
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
  },
  localVideo: {
    width: 100,
    height: 150,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  remoteVideo: {
    flex: 1,
  },
  controls: {
    padding: 20,
    backgroundColor: 'white',
  },
  endButton: {
    marginTop: 10,
  },
});
