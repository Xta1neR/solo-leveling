import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Request permissions for notifications.
 */
export async function registerForPushNotificationsAsync(){
  try{
    const settings = await Notifications.getPermissionsAsync();
    if(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return settings;
    }
    const status = await Notifications.requestPermissionsAsync();
    return status;
  }catch(e){
    console.warn('notif permission error', e);
  }
}

/**
 * Schedule a daily alarm at a specific hour/minute.
 * Uses a repeating trigger (works on managed workflow for many Expo versions).
 */
export async function scheduleDailyAlarm(hour=5, minute=0){
  try {
    // Cancel all prev scheduled notifications for simplicity
    await Notifications.cancelAllScheduledNotificationsAsync();

    // If SDK supports trigger object with {hour, minute, repeats:true}, use that:
    const trigger = { hour, minute, repeats: true };

    await Notifications.scheduleNotificationAsync({
      content: { title: 'Wake up — 5AM Challenge', body: 'Complete the wake task to stop the alarm' },
      trigger
    });
  } catch (e) {
    console.warn('scheduleDailyAlarm error', e);
  }
}

/**
 * Send immediate local notification
 */
export async function sendImmediate(title, body){
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null
    });
  } catch (e) {
    console.warn('sendImmediate error', e);
  }
}
