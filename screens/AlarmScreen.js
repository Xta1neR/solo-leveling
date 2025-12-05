// /screens/AlarmScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requestPermissionsAsync, ensureAndroidChannel, scheduleDailyAlarm, cancelAllScheduledNotifications } from '../utils/notifications';
import { recordCheckIn, loadStreak } from '../utils/storage';

export default function AlarmScreen() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [alarmScheduled, setAlarmScheduled] = useState(false);

  useEffect(() => {
    (async () => {
      await requestPermissionsAsync();
      await ensureAndroidChannel();
      const { streak: s } = await loadStreak();
      setStreak(s);
    })();
  }, []);

  const handleCheckIn = async () => {
    const now = new Date();
    const hour = now.getHours();

    // Accept check-ins between 05:00 and 07:00 local time
    if (hour >= 5 && hour < 7) {
      const res = await recordCheckIn();
      if (res.status === 'already') {
        Alert.alert('System Message', 'You already checked in today. Keep the streak going!');
        setCheckedIn(true);
        setStreak(res.streak);
      } else if (res.status === 'ok') {
        setCheckedIn(true);
        setStreak(res.streak);
        Alert.alert('System Message', `Early bird bonus acquired. Streak: ${res.streak} days.`);
      } else {
        Alert.alert('System Message', 'Something went wrong, try again later.');
      }
    } else {
      Alert.alert('System Message', "You are late, Hunter. Try again at 5 AM tomorrow.");
    }
  };

  const handleScheduleAlarm = async () => {
    try {
      await scheduleDailyAlarm(5, 0, "Time to wake — your 5 AM Club awaits!");
      setAlarmScheduled(true);
      Alert.alert('Alarm', 'Daily 5:00 AM alarm scheduled.');
    } catch (e) {
      console.error(e);
      Alert.alert('Alarm', 'Could not schedule alarm. Please check permissions.');
    }
  };

  const handleCancelAlarms = async () => {
    await cancelAllScheduledNotifications();
    setAlarmScheduled(false);
    Alert.alert('Alarm', 'All alarms canceled.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name="sunny" size={80} color={checkedIn ? "#fbbf24" : "#475569"} />
      </View>

      <Text style={styles.timeTarget}>05:00 AM</Text>
      <Text style={styles.desc}>Wake up early to level up.</Text>

      <TouchableOpacity
        style={[styles.button, checkedIn && styles.buttonDisabled]}
        onPress={handleCheckIn}
        disabled={checkedIn}
      >
        <Text style={styles.btnText}>
          {checkedIn ? "CHECKED IN" : "I'M AWAKE"}
        </Text>
      </TouchableOpacity>

      <View style={{height: 20}} />

      <TouchableOpacity
        style={[styles.smallButton]}
        onPress={handleScheduleAlarm}
      >
        <Text style={styles.smallBtnText}>{alarmScheduled ? "Alarm Scheduled" : "Schedule 5:00 AM Alarm"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.smallButton, { marginTop: 10, backgroundColor: '#334155' }]}
        onPress={handleCancelAlarms}
      >
        <Text style={styles.smallBtnText}>Cancel All Alarms</Text>
      </TouchableOpacity>

      <Text style={{color: '#94a3b8', marginTop: 20}}>Current streak: {streak} days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#334155',
  },
  timeTarget: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  desc: {
    color: '#94a3b8',
    marginTop: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    width: '80%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
  },
  smallButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  smallBtnText: {
    color: '#fff',
    fontWeight: '600',
  }
});
