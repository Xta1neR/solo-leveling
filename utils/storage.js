import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for saving data
const KEYS = {
  XP: '@solo_leveling_xp',
  LEVEL: '@solo_leveling_level',
  STREAK: '@solo_leveling_streak',
  LAST_LOGIN: '@solo_leveling_last_login',
};

// Save player stats
export const saveStats = async (xp, level) => {
  try {
    await AsyncStorage.setItem(KEYS.XP, JSON.stringify(xp));
    await AsyncStorage.setItem(KEYS.LEVEL, JSON.stringify(level));
  } catch (e) {
    console.error("Error saving stats", e);
  }
};

// Load player stats (returns default if nothing saved)
export const loadStats = async () => {
  try {
    const xp = await AsyncStorage.getItem(KEYS.XP);
    const level = await AsyncStorage.getItem(KEYS.LEVEL);
    return {
      xp: xp ? JSON.parse(xp) : 0,
      level: level ? JSON.parse(level) : 1
    };
  } catch (e) {
    return { xp: 0, level: 1 };
  }
};