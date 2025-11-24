import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { readData, updateDailyLog } from '../utils/storage';
import { scheduleDailyAlarm } from '../utils/notifications';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const d = await readData();
      setData(d);
      // ensure alarm scheduled to stored wake_time
      const [hhStr, mmStr] = (d?.user?.wake_time || '05:00').split(':');
      await scheduleDailyAlarm(Number(hhStr), Number(mmStr));
    })();
  }, []);

  const todayStr = (new Date()).toISOString().slice(0,10);

  async function quickMarkWake(){
    await updateDailyLog(todayStr, { wakeCompleted: true, wakeCompletedAt: new Date().toISOString() });
    const d = await readData();
    setData(d);
    Alert.alert('Wake marked', 'Marked wake as done for today (debug)');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>5AM Challenge</Text>
      <Text>Wake time: {data?.user?.wake_time || '05:00'}</Text>
      <Text>Streak: {data?.streak?.currentStreak || 0} (best {data?.streak?.bestStreak || 0})</Text>

      <View style={{ height: 12 }} />
      <Button title="Go to Alarm" onPress={() => navigation.navigate('Alarm')} />
      <View style={{ height: 8 }} />
      <Button title="Start Workout" onPress={() => navigation.navigate('Workout')} />
      <View style={{ height: 8 }} />
      <Button title="Pomodoro" onPress={() => navigation.navigate('Pomodoro')} />
      <View style={{ height: 8 }} />
      <Button title="Quick mark wake (debug)" onPress={quickMarkWake} />
      <View style={{ height: 12 }} />
      <Text style={{ color: '#666' }}>Tip: Tap notification when alarm rings to open this Alarm screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  h1: { fontSize:26, fontWeight:'700', marginBottom:8 }
});
