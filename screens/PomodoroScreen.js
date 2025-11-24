import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';

// Your custom 25-5-25-10 cycle
const CYCLE = [
  { name: "Study Session 1", minutes: 25, type: 'focus' },
  { name: "Short Rest", minutes: 5, type: 'break' },
  { name: "Study Session 2", minutes: 25, type: 'focus' },
  { name: "Long Rest", minutes: 10, type: 'break' },
];

export default function PomodoroScreen() {
  useKeepAwake(); // Keeps screen on during study
  
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(CYCLE[0].minutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(secondsLeft => secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      handleNextPhase();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const handleNextPhase = () => {
    const nextIndex = (phaseIndex + 1) % CYCLE.length;
    setPhaseIndex(nextIndex);
    setSecondsLeft(CYCLE[nextIndex].minutes * 60);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentPhase = CYCLE[phaseIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SYSTEM TIMER</Text>
      
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <Text style={[styles.phaseText, 
            currentPhase.type === 'focus' ? styles.blueText : styles.greenText
          ]}>
            {currentPhase.name}
          </Text>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Ionicons name={isActive ? "pause" : "play"} size={32} color="#FFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleNextPhase}>
           <Ionicons name="play-skip-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.queue}>
        {CYCLE.map((item, index) => (
          <View key={index} style={[
            styles.dot, 
            index === phaseIndex && styles.activeDot,
            item.type === 'break' && styles.breakDot
          ]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: '#475569',
    letterSpacing: 4,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  circleContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: '#1e293b50',
  },
  circle: {
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1,
  },
  blueText: { color: '#3b82f6' },
  greenText: { color: '#4ade80' },
  timerText: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3b82f6',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  skipButton: {
    backgroundColor: '#334155',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  queue: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#334155',
  },
  activeDot: {
    backgroundColor: '#3b82f6',
    transform: [{ scale: 1.2 }],
  },
  breakDot: {
    // optional styling for break dots
  }
});