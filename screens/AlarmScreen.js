import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, BackHandler } from 'react-native';
import * as Notifications from 'expo-notifications';
import { updateDailyLog } from '../utils/storage';
import { Accelerometer } from 'expo-sensors';

export default function AlarmScreen({ navigation }) {
  // 4-digit code dismissal
  const [code, setCode] = useState('');
  const [challengeCode, setChallengeCode] = useState(generateCode());
  const [shakeActive, setShakeActive] = useState(true);
  const accelSub = useRef(null);

  useEffect(() => {
    // Register listener to stop hardware back button to make dismissal required
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // prevent going back from alarm screen using back button (force user to dismiss)
      return true;
    });

    // start accelerometer listener for shake
    Accelerometer.setUpdateInterval(300);
    accelSub.current = Accelerometer.addListener(data => {
      const total = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
      // threshold tuned for phone shake; adjust if needed
      if (total > 2.8 && shakeActive) {
        onShakeDismiss();
      }
    });

    return () => {
      backHandler.remove();
      try { accelSub.current && accelSub.current.remove(); } catch (e) {}
    };
  }, [shakeActive]);

  async function onShakeDismiss(){
    // mark wake completed
    const date = (new Date()).toISOString().slice(0,10);
    await updateDailyLog(date, { wakeCompleted: true, wakeCompletedAt: new Date().toISOString(), dismissedBy: 'shake' });
    Alert.alert('Nice!', 'Wake task completed (shake)'); // quick feedback
    navigation.navigate('Home');
  }

  async function verifyAndDismiss() {
    if (code.trim() === challengeCode) {
      const date = (new Date()).toISOString().slice(0,10);
      await updateDailyLog(date, { wakeCompleted: true, wakeCompletedAt: new Date().toISOString(), dismissedBy: 'code' });
      Alert.alert('Nice!', 'Wake task completed');
      navigation.navigate('Home');
    } else {
      Alert.alert('Not correct', 'Type the code shown to dismiss alarm');
    }
  }

  function regenerate(){
    const c = generateCode();
    setChallengeCode(c);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Wake Task</Text>
      <Text style={{ marginTop: 8 }}>Type the 4-digit code to dismiss the alarm</Text>
      <View style={{ height: 20 }} />
      <Text style={styles.code}>{challengeCode}</Text>
      <TextInput value={code} onChangeText={setCode} keyboardType="numeric" style={styles.input} placeholder="Enter code" />
      <View style={{ height: 12 }} />
      <Button title="Submit" onPress={verifyAndDismiss} />
      <View style={{ height: 8 }} />
      <Button title="Regenerate code" onPress={regenerate} />
      <View style={{ height: 16 }} />
      <Text style={{ color:'#444' }}>You can also physically shake your phone to dismiss the alarm.</Text>
      <View style={{ height: 8 }} />
      <Button title={shakeActive ? "Disable shake dismiss" : "Enable shake dismiss"} onPress={() => setShakeActive(s => !s)} />
    </View>
  );
}

function generateCode(){
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, alignItems:'center' },
  h1: { fontSize:22, fontWeight:'700' },
  code: { fontSize:36, margin:12, letterSpacing:8 },
  input: { borderWidth:1, width:140, textAlign:'center', padding:8, fontSize:18 }
});
