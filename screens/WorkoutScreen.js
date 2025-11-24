import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import ExerciseCard from '../components/ExerciseCard';
import { WORKOUT } from '../data/workout';
import { updateDailyLog, updateStreakIfNeeded, readData } from '../utils/storage';

export default function WorkoutScreen() {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    // load draft if exists for today
    (async () => {
      const date = (new Date()).toISOString().slice(0,10);
      const d = await readData();
      const draftData = d?.dailyLogs?.[date]?.workoutDraft || null;
      if (draftData) {
        setIndex(draftData.index || 0);
        setCompleted(draftData.completed || []);
      }
    })();
  }, []);

  function onSetComplete({ id, set, value }) {
    setCompleted(prev => {
      const next = [...prev, { id, set, value }];
      // save draft to storage
      saveDraft(index, next);
      return next;
    });

    // move to next exercise when appropriate
    const ex = WORKOUT[index];
    const setsDoneForThis = (completed.filter(c => c.id === id).length) + 1; // include current
    if (setsDoneForThis >= ex.sets) {
      if (index < WORKOUT.length - 1) setIndex(index + 1);
      else onWorkoutComplete();
    } else {
      // stay on same exercise until sets done
    }
  }

  async function saveDraft(currentIndex, completedArr) {
    const date = (new Date()).toISOString().slice(0,10);
    await updateDailyLog(date, { workoutDraft: { index: currentIndex, completed: completedArr } });
  }

  async function onWorkoutComplete() {
    const date = (new Date()).toISOString().slice(0,10);
    // log final workout
    await updateDailyLog(date, { workout: { completed: true, exercises: completed }, workoutDraft: null });
    await updateStreakIfNeeded(date);
    Alert.alert('Well done', 'Workout logged. Start Pomodoro to track focus.');
  }

  return (
    <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Workout</Text>
      <Text style={{ marginBottom:8 }}>Current: {WORKOUT[index].name} ({index + 1}/{WORKOUT.length})</Text>
      <ExerciseCard exercise={WORKOUT[index]} onSetComplete={onSetComplete} />
      <View style={{ height: 8 }} />
      <Button title="Finish workout" onPress={onWorkoutComplete} />
      <View style={{ height: 12 }} />
      <Text>Completed sets: {completed.length}</Text>
    </ScrollView>
  );
}
