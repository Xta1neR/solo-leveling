// /utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for saving data
const KEYS = {
  XP: '@solo_leveling_xp',
  LEVEL: '@solo_leveling_level',
  STREAK: '@solo_leveling_streak',
  LAST_LOGIN: '@solo_leveling_last_login',
  COMPLETED: '@solo_leveling_completed_exercises',
  TASKS: '@solo_leveling_tasks',
};

export const saveStats = async (xp, level) => {
  try {
    await AsyncStorage.setItem(KEYS.XP, JSON.stringify(xp));
    await AsyncStorage.setItem(KEYS.LEVEL, JSON.stringify(level));
  } catch (e) {
    console.error("Error saving stats", e);
  }
};

export const loadStats = async () => {
  try {
    const xpRaw = await AsyncStorage.getItem(KEYS.XP);
    const levelRaw = await AsyncStorage.getItem(KEYS.LEVEL);
    return {
      xp: xpRaw ? JSON.parse(xpRaw) : 0,
      level: levelRaw ? JSON.parse(levelRaw) : 1,
    };
  } catch (e) {
    console.error("Error loading stats", e);
    return { xp: 0, level: 1 };
  }
};

// Streak related functions
export const loadStreak = async () => {
  try {
    const streakRaw = await AsyncStorage.getItem(KEYS.STREAK);
    const lastLoginRaw = await AsyncStorage.getItem(KEYS.LAST_LOGIN);
    return {
      streak: streakRaw ? JSON.parse(streakRaw) : 0,
      lastLogin: lastLoginRaw || null,
    };
  } catch (e) {
    console.error("Error loading streak", e);
    return { streak: 0, lastLogin: null };
  }
};

/**
 * recordCheckIn():
 * - If already checked-in today -> returns {status: 'already', streak}
 * - If last login was yesterday -> streak++
 * - Else -> streak reset to 1
 */
export const recordCheckIn = async () => {
  try {
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const { streak: prevStreak, lastLogin } = await loadStreak();

    if (lastLogin === todayKey) {
      return { status: 'already', streak: prevStreak };
    }

    const yesterdayKey = new Date(now.getTime() - 24 * 3600 * 1000).toISOString().split('T')[0];

    let newStreak = 1;
    if (lastLogin === yesterdayKey) {
      newStreak = (prevStreak || 0) + 1;
    }

    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(newStreak));
    await AsyncStorage.setItem(KEYS.LAST_LOGIN, todayKey);

    return { status: 'ok', streak: newStreak };
  } catch (e) {
    console.error("Error recording check-in", e);
    return { status: 'error', streak: 0 };
  }
};

export const saveCompletedExercises = async (arr = []) => {
  try {
    await AsyncStorage.setItem(KEYS.COMPLETED, JSON.stringify(arr));
  } catch (e) {
    console.error("Error saving completed exercises", e);
  }
};

export const loadCompletedExercises = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error loading completed exercises", e);
    return [];
  }
};

export const saveTasks = async (tasks = []) => {
  try {
    await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks', e);
  }
};

export const loadTasks = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TASKS);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error loading tasks', e);
    return null;
  }
};

export const addXp = async (delta = 0) => {
  try {
    const xpRaw = await AsyncStorage.getItem(KEYS.XP);
    const levelRaw = await AsyncStorage.getItem(KEYS.LEVEL);
    let xp = xpRaw ? JSON.parse(xpRaw) : 0;
    let level = levelRaw ? JSON.parse(levelRaw) : 1;

    xp += delta;
    while (xp >= 1000) {
      xp -= 1000;
      level += 1;
    }

    await AsyncStorage.setItem(KEYS.XP, JSON.stringify(xp));
    await AsyncStorage.setItem(KEYS.LEVEL, JSON.stringify(level));

    return { xp, level };
  } catch (e) {
    console.error('Error adding XP', e);
    return null;
  }
};