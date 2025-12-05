// /components/ExerciseCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

/**
 * Props:
 * - exercise: { id, name, sets, reps, image, description }
 * - isCompleted: boolean
 * - onToggle: () => void
 * - onOpenDetails: () => void
 */
export default function ExerciseCard({ exercise, isCompleted, onToggle, onOpenDetails }) {
  const FALLBACK = 'file:///mnt/data/b986fc03-daf2-4c8e-8978-0391d4e846d3.png';

  return (
    <View style={[styles.card, isCompleted && styles.cardDone]}>
      <View style={styles.left}>
        <View style={styles.meta}>
          <Text style={[styles.name, isCompleted && styles.nameDone]} numberOfLines={1}>
            {exercise?.name}
          </Text>
          <Text style={styles.sub}>{exercise?.sets} sets × {exercise?.reps}</Text>

          {exercise?.description ? (
            <Text style={styles.preview} numberOfLines={2}>
              {exercise.description}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.check, isCompleted ? styles.checkDone : styles.checkIdle]}
          onPress={onToggle}
        >
          <Text style={isCompleted ? styles.checkTxtDone : styles.checkTxt}>✓</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.detailsBtn} onPress={onOpenDetails}>
          <Text style={styles.detailsTxt}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#071426',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#082737',
  },
  cardDone: {
    borderColor: '#0ea5e9',
    backgroundColor: '#061a24',
    opacity: 0.95,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#06121a',
  },
  meta: {
    flex: 1,
  },
  name: {
    color: '#e6fbff',
    fontWeight: '800',
    fontSize: 15,
  },
  nameDone: {
    color: '#7dd3fc',
    textDecorationLine: 'line-through',
    opacity: 0.95,
  },
  sub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  preview: {
    color: '#9fb7c6',
    fontSize: 12,
    marginTop: 6,
  },
  actions: {
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  check: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIdle: {
    borderWidth: 1,
    borderColor: '#0b2633',
    backgroundColor: '#071422',
  },
  checkDone: {
    backgroundColor: '#0ea5e9',
  },
  checkTxt: {
    color: '#94a3b8',
    fontWeight: '900',
  },
  checkTxtDone: {
    color: '#001219',
    fontWeight: '900',
  },
  detailsBtn: {
    marginTop: 8,
    backgroundColor: '#071826',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0b2633',
  },
  detailsTxt: {
    color: '#7dd3fc',
    fontWeight: '800',
  },
});
