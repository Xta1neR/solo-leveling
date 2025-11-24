import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Built-in icons

const ExerciseCard = ({ exercise, isCompleted, onToggle }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isCompleted && styles.cardCompleted]} 
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.info}>
        <Text style={[styles.name, isCompleted && styles.textCompleted]}>
          {exercise.name}
        </Text>
        <Text style={styles.target}>{exercise.target}</Text>
      </View>
      
      {/* Checkbox Circle */}
      <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
        {isCompleted && <Ionicons name="checkmark" size={16} color="#FFF" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b', // Slate 800
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardCompleted: {
    backgroundColor: '#172554', // Dark Blue
    borderColor: '#3b82f6', // Bright Blue
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#f1f5f9', // Whiteish
    fontSize: 16,
    fontWeight: 'bold',
  },
  textCompleted: {
    color: '#60a5fa', // Blue text
  },
  target: {
    color: '#94a3b8', // Grey
    fontSize: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
});

export default ExerciseCard;