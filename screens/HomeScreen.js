import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  StatusBar,
  TextInput,
  Alert,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you use Expo, otherwise use a compatible icon lib
import Timetable from '../components/Timetable';
import { saveTasks, loadTasks, addXp, loadStats, loadStreak } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

// local avatar (the image you uploaded)
// Note: Ensure this path is correct in your project structure
const AVATAR = require('../data/picofme.png');

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// --- DateScroller Component ---
function DateScroller() {
  const today = new Date().getDay(); // 0..6
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    // shift to start of week (Sunday) + i
    const d = new Date(date.getTime());
    d.setDate(date.getDate() - date.getDay() + i);
    return { label: WEEK_DAYS[i], dayNum: d.getDate(), isToday: i === today, date: d };
  });

  return (
    <View style={styles.dateScroller}>
      <FlatList
        data={days}
        horizontal
        keyExtractor={(item) => item.date.toISOString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 6 }}
        renderItem={({ item }) => (
          <View style={[styles.dayCircleWrap, item.isToday && styles.dayCircleWrapActive]}>
            <Text style={[styles.dayLabel, item.isToday && styles.dayLabelActive]}>{item.label}</Text>
            <Text style={[styles.dayNum, item.isToday && styles.dayNumActive]}>{item.dayNum}</Text>
          </View>
        )}
      />
    </View>
  );
}

// --- Main HomeScreen Component ---
export default function HomeScreen({ setScreen }) {
  const navigation = useNavigation();
  const [stats, setStats] = useState({ xp: 0, level: 1 });
  const [streak, setStreak] = useState(0);
  
  // Todo List State
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Read Hooked 10 pages', goal: 'Goal: Product Designer', completed: true },
    { id: '2', title: 'Watch Figma latest video', goal: 'Goal: Product Designer', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await loadStats();
        setStats(s || { xp: 0, level: 1 });
        const st = await loadStreak();
        setStreak((st && st.streak) || 0);
        const persisted = await loadTasks();
        if (persisted && Array.isArray(persisted)) {
          setTasks(persisted);
        }
      } catch (e) {
        console.warn('Failed to load stats', e);
      }
    })();
  }, []);

  // --- Todo Logic ---
  useEffect(() => {
    (async () => {
      try {
        await saveTasks(tasks);
      } catch (e) {
        console.warn('Failed to save tasks', e);
      }
    })();
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskText.trim().length === 0) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskText,
      goal: 'Daily Quest', // Default category
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskText('');
    setIsAdding(false);
    Keyboard.dismiss();
  };

  const toggleTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nowCompleted = !t.completed;
        // If we transitioned to completed, award XP (50 xp here)
        if (nowCompleted) {
          // award XP asynchronously (do not block UI)
          (async () => {
            try {
              const res = await addXp(50); // change number as you like
              if (res) setStats({ xp: res.xp, level: res.level });
            } catch (e) {
              console.warn('failed to award xp for todo', e);
            }
          })();
        }
        return { ...t, completed: nowCompleted };
      })
    );
  };

  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks((prev) => prev.filter((t) => t.id !== id));
        },
      },
    ]);
  };

  // Timetable Data
  const DAILY_TIMETABLE = [
    { start: '05:00', end: '07:00', label: 'Workout' },
    { start: '07:00', end: '08:00', label: 'Breakfast & Shower' },
    { start: '08:00', end: '20:00', label: 'Study - Pomodoro' },
    { start: '20:00', end: '22:00', label: 'Dinner & Family' },
    { start: '22:00', end: '23:00', label: 'Plan & Read' },
    { start: '23:00', end: '23:59', label: 'Sleep' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#05060a" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallLabel}>Today</Text>
            <Text style={styles.bigTitle}>{new Date().toDateString()}</Text>
          </View>
          <View style={styles.headerRight}>
            {/* Using a fallback if AVATAR fails, though require() usually works */}
            <Image source={AVATAR} style={styles.avatar} resizeMode="cover" />
          </View>
        </View>

        {/* Week Scroller */}
        <DateScroller />

        {/* Hero Card */}
        <View style={styles.heroRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardTitle}>Add your goals</Text>
            <Text style={styles.smallCardSub}>Get personalized reminders and health alerts.</Text>
          </View>
        </View>

      

        {/* --- DYNAMIC TASK LIST --- */}
        <View style={styles.taskListHeader}>
          <Text style={styles.sectionTitle}>Priority Tasks</Text>
          <TouchableOpacity onPress={() => setIsAdding(!isAdding)}>
            <Text style={styles.addBtnText}>{isAdding ? "Cancel" : "+ Add New"}</Text>
          </TouchableOpacity>
        </View>

        {isAdding && (
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              placeholder="What needs to be done?"
              placeholderTextColor="#64748b"
              value={newTaskText}
              onChangeText={setNewTaskText}
              onSubmitEditing={handleAddTask}
              autoFocus
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.confirmAddBtn} onPress={handleAddTask}>
              <Ionicons name="arrow-up" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.taskList}>
          {tasks.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.taskCard, item.completed && { opacity: 0.6 }]}
              onPress={() => toggleTask(item.id)}
              onLongPress={() => deleteTask(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.taskLeft}>
                <View style={item.completed ? styles.checkboxDone : styles.checkboxEmpty}>
                  {item.completed && <Ionicons name="checkmark" size={18} color="#001219" />}
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.taskTitle, item.completed && { textDecorationLine: 'line-through', color: '#64748b' }]}>
                    {item.title}
                  </Text>
                  <Text style={styles.taskGoal}>{item.goal}</Text>
                </View>
              </View>
              <View style={styles.taskRight}>
                <View style={[styles.dot, item.completed && { backgroundColor: '#334155' }]} />
              </View>
            </TouchableOpacity>
          ))}
          {tasks.length === 0 && (
            <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 10, fontStyle: 'italic' }}>
              No tasks for today. Time to relax?
            </Text>
          )}
        </View>

        {/* Timetable */}
        <View style={{ marginTop: 16 }}>
          <Timetable schedule={DAILY_TIMETABLE} onStartStudy={() => setScreen('pomodoro')} />
        </View>

        {/* Quick Actions (Linked to other files) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Workout')}>
            <Ionicons name="barbell" size={24} color="#3b82f6" style={{ marginBottom: 8 }} />
            <Text style={styles.actionTitle}>Start Workout</Text>
            <Text style={styles.actionSub}>5:00 - 7:00</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, styles.actionCardAlt]} onPress={() => navigation.navigate('Pomodoro')}>
            <Ionicons name="timer" size={24} color="#00e5ff" style={{ marginBottom: 8 }} />
            <Text style={[styles.actionTitle, { color: '#00e5ff' }]}>Focus Mode</Text>
            <Text style={[styles.actionSub, { color: '#8be9ff' }]}>Start Pomodoro</Text>
          </TouchableOpacity>
        </View>

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>LVL {stats.level}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>{stats.xp}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{streak}d</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#05060a',
  },
  container: {
    padding: 16,
    backgroundColor: '#05060a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallLabel: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 2,
  },
  bigTitle: {
    color: '#e6f9ff',
    fontSize: 20,
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  dateScroller: {
    marginTop: 8,
    marginBottom: 10,
  },
  dayCircleWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#071a28',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  dayCircleWrapActive: {
    backgroundColor: '#072b3b',
    borderWidth: 1,
    borderColor: '#0ea5e9',
    elevation: 6,
  },
  dayLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  dayLabelActive: {
    color: '#e6fbff',
    fontWeight: '800',
  },
  dayNum: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  dayNumActive: {
    color: '#7dd3fc',
    fontSize: 14,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#071323',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#07202a',
    justifyContent: 'center',
  },
  smallCardTitle: {
    color: '#e6f9ff',
    fontWeight: '800',
    marginBottom: 6,
  },
  smallCardSub: {
    color: '#94a3b8',
    fontSize: 12,
  },
  segmentRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  segmentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#061223',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#0b2633',
  },
  segmentBtnActive: {
    backgroundColor: '#072b3b',
    borderColor: '#0ea5e9',
  },
  segmentText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#e6fbff',
  },
  // Todo List Styles
  taskList: {
    marginTop: 14,
  },
  taskListHeader: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'end',
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addBtnText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
  },
  confirmAddBtn: {
    backgroundColor: '#3b82f6',
    width: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCard: {
    backgroundColor: '#071426',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#082737',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxDone: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#071422',
    borderWidth: 1,
    borderColor: '#0b2633',
  },
  taskTitle: {
    color: '#e6fbff',
    fontWeight: '800',
    fontSize: 15,
  },
  taskGoal: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  taskRight: {
    alignItems: 'center',
    marginLeft: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#06b6d4',
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#072033',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#073a45',
    alignItems: 'flex-start',
  },
  actionCardAlt: {
    backgroundColor: '#08101a',
    borderColor: '#0b2633',
  },
  actionTitle: {
    color: '#e6fbff',
    fontWeight: '900',
    marginBottom: 4,
  },
  actionSub: {
    color: '#94a3b8',
    fontSize: 12,
  },
  infoFooter: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#07202a',
    backgroundColor: '#071223',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  statValue: {
    color: '#e6fbff',
    fontWeight: '900',
    marginTop: 6,
  },
});