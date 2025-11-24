import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT = {
  user: { wake_time: '05:00', pomodoro: { work_minutes: 20, break_minutes: 10, daily_goal_minutes: 480 } },
  dailyLogs: {},
  streak: { currentStreak: 0, bestStreak: 0, lastSuccessDate: null }
};

export async function initStorage(){
  try{
    const existing = await AsyncStorage.getItem('@app_data');
    if(!existing){
      await AsyncStorage.setItem('@app_data', JSON.stringify(DEFAULT));
    }
  }catch(e){
    console.warn('initStorage error', e);
  }
}

export async function readData(){
  try {
    const raw = await AsyncStorage.getItem('@app_data');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('readData error', e);
    return null;
  }
}

export async function writeData(data){
  try {
    await AsyncStorage.setItem('@app_data', JSON.stringify(data));
  } catch (e) {
    console.warn('writeData error', e);
  }
}

export async function updateDailyLog(date, partial){
  const data = await readData();
  if(!data) return;
  data.dailyLogs = data.dailyLogs || {};
  data.dailyLogs[date] = { ...(data.dailyLogs[date] || {}), ...partial };
  await writeData(data);
}

export async function updateStreakIfNeeded(date){
  const data = await readData();
  if(!data) return null;
  const log = data.dailyLogs[date];
  if(!log || !log.wakeCompleted || !log.workout?.completed) return data.streak;
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate()-1);
  const yStr = yesterday.toISOString().slice(0,10);
  if(data.streak.lastSuccessDate === yStr){
    data.streak.currentStreak = (data.streak.currentStreak || 0) + 1;
  } else {
    data.streak.currentStreak = 1;
  }
  data.streak.bestStreak = Math.max(data.streak.bestStreak || 0, data.streak.currentStreak);
  data.streak.lastSuccessDate = date;
  await writeData(data);
  return data.streak;
}
