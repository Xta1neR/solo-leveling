import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { readData, updateDailyLog } from '../utils/storage';

export default function PomodoroScreen() {
  const [workMin, setWorkMin] = useState(20);
  const [breakMin, setBreakMin] = useState(10);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workMin * 60);
  const timer = useRef(null);
  const [cumulative, setCumulative] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(480);

  useEffect(() => {
    (async () => {
      const d = await readData();
      setWorkMin(d?.user?.pomodoro?.work_minutes || 20);
      setBreakMin(d?.user?.pomodoro?.break_minutes || 10);
      setDailyGoal(d?.user?.pomodoro?.daily_goal_minutes || 480);
    })();
  }, []);

  useEffect(() => {
    setTimeLeft((isWork ? workMin : breakMin) * 60);
  }, [isWork, workMin, breakMin]);

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  function start() {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer.current);
          if (isWork) {
            handleWorkComplete();
          }
          setIsWork(w => !w);
          return (isWork ? breakMin : workMin) * 60;
        }
        return t - 1;
      });
    }, 1000);
  }

  async function handleWorkComplete() {
    setCumulative(c => {
      const next = c + workMin;
      // Save to storage
      saveCumulative(next);
      return next;
    });
  }

  async function saveCumulative(mins) {
    const date = (new Date()).toISOString().slice(0,10);
    const data = await readData();
    const prev = data?.dailyLogs?.[date]?.focusMinutes || 0;
    await updateDailyLog(date, { focusMinutes: prev + mins });
  }

  function stop() {
    clearInterval(timer.current);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Pomodoro</Text>
      <Text>{isWork ? 'Work' : 'Break'}</Text>
      <Text style={{ fontSize:40 }}>{Math.floor(timeLeft/60).toString().padStart(2,'0')}:{(timeLeft%60).toString().padStart(2,'0')}</Text>
      <View style={{ height:12 }} />
      <Button title="Start" onPress={start} />
      <View style={{ height:8 }} />
      <Button title="Stop" onPress={stop} />
      <View style={{ height:16 }} />
      <Text>Cumulative focus minutes this session: {cumulative}</Text>
      <View style={{ height:8 }} />
      <Text>Daily goal: {dailyGoal} minutes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16 },
  h1:{ fontSize:22, fontWeight:'700' }
});
