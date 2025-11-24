import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadStats } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({ xp: 0, level: 1 });

  // Load stats whenever screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStats().then(data => setStats(data));
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Status Window */}
      <View style={styles.statusBox}>
        <View style={styles.avatarContainer}>
           <Ionicons name="person" size={40} color="#3b82f6" />
        </View>
        <View>
          <Text style={styles.playerName}>Hunter</Text>
          <Text style={styles.levelText}>Level {stats.level}</Text>
          <Text style={styles.xpText}>{stats.xp} / 1000 XP</Text>
        </View>
      </View>

      {/* Menu Grid */}
      <View style={styles.grid}>
        <TouchableOpacity 
          style={[styles.card, styles.cardBlue]} 
          onPress={() => navigation.navigate('Workout')}
        >
          <Ionicons name="barbell" size={32} color="#FFF" />
          <Text style={styles.cardTitle}>Daily Quest</Text>
          <Text style={styles.cardSub}>Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardDark]} 
          onPress={() => navigation.navigate('Pomodoro')}
        >
          <Ionicons name="hourglass" size={32} color="#60a5fa" />
          <Text style={styles.cardTitle}>Focus Mode</Text>
          <Text style={styles.cardSub}>Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardDark]} 
          onPress={() => navigation.navigate('Alarm')}
        >
          <Ionicons name="alarm" size={32} color="#60a5fa" />
          <Text style={styles.cardTitle}>5 AM Club</Text>
          <Text style={styles.cardSub}>Wake Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 60,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginBottom: 40,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  playerName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    marginTop: 2,
  },
  xpText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardBlue: {
    backgroundColor: '#2563eb',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  cardSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  }
});