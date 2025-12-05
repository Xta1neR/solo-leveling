// /utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissionsAsync() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  }
  return true;
}

export async function ensureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-alarm', {
      name: 'Daily Alarm',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF0000',
    });
  }
}

/**
 * Schedules a daily repeating notification at hour:minute.
 * Returns the identifier returned by scheduleNotificationAsync.
 */
export async function scheduleDailyAlarm(hour = 5, minute = 0, body = "Wake up! It's time to level up.") {
  // On modern expo, you can use a trigger object with hour/minute repeat
  const trigger = {
    hour,
    minute,
    repeats: true,
  };
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '5 AM Club ⏰',
      body,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });
  return id;
}

export async function cancelScheduledNotification(id) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.warn('Failed to cancel notification', e);
  }
}

export async function cancelAllScheduledNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('Failed to cancel all notifications', e);
  }
}
