import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Timer from './Timer';

export default function ExerciseCard({ exercise, onSetComplete }) {
  const [currentSet, setCurrentSet] = useState(1);
  const isTimed = exercise.type === 'timed';

  function handleComplete(repsOrSeconds) {
    onSetComplete({ id: exercise.id, set: currentSet, value: repsOrSeconds });
    if (currentSet < exercise.sets) {
      setCurrentSet(currentSet + 1);
    } else {
      // finished this exercise — parent should move to next when needed
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Text>Set {currentSet} / {exercise.sets}</Text>

      {isTimed ? (
        <Timer
          seconds={exercise.secondsPerSet}
          onFinish={() => handleComplete(exercise.secondsPerSet)}
        />
      ) : (
        <View style={{ marginTop: 10 }}>
          <Text>Target: {exercise.repsPerSet ? exercise.repsPerSet[currentSet - 1] : '-'}</Text>
          <View style={{ height: 8 }} />
          <Button title="I did this set" onPress={() => handleComplete(exercise.repsPerSet ? exercise.repsPerSet[currentSet - 1] : 0)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1, borderRadius: 8, margin: 8 },
  title: { fontWeight: '700', fontSize: 18 }
});
