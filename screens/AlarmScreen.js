import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlarmScreen() {
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckIn = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 7) {
      setCheckedIn(true);
      Alert.alert("System Message", "Early bird bonus acquired. Streak maintained.");
    } else {
      Alert.alert("System Message", "You are late, Hunter. Try again at 5 AM tomorrow.");
    }
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
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#3b82f6',
    width: '100%',
    padding: 20,
    borderRadius: 15,
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
  }
});