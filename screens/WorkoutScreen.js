import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { WORKOUT_DATA } from '../data/workout';
import ExerciseCard from '../components/ExerciseCard';

export default function WorkoutScreen({ navigation }) {
  const [completed, setCompleted] = useState([]);

  const toggleExercise = (id) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter(item => item !== id));
      // In a real app, you would subtract XP here
    } else {
      setCompleted([...completed, id]);
      // We will handle XP globally in App.js later, 
      // but visually this shows completion
    }
  };

  const progress = completed.length / WORKOUT_DATA.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Quest</Text>
        <Text style={styles.subtitle}>Difficulty: E-Rank</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {completed.length} / {WORKOUT_DATA.length} Completed
      </Text>

      <ScrollView contentContainerStyle={styles.list}>
        {WORKOUT_DATA.map((item) => (
          <ExerciseCard 
            key={item.id} 
            exercise={item} 
            isCompleted={completed.includes(item.id)}
            onToggle={() => toggleExercise(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark background
    padding: 20,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    color: '#3b82f6', // Blue
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 40,
  },
});