import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AlarmScreen from './screens/AlarmScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import { initStorage } from './utils/storage';
import { registerForPushNotificationsAsync, scheduleDailyAlarm } from './utils/notifications';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    (async () => {
      await initStorage();
      await registerForPushNotificationsAsync();
      // schedule default daily alarm (reads user wake time inside HomeScreen too)
      // Keep a sensible default here; HomeScreen will re-schedule based on stored wake_time.
      await scheduleDailyAlarm(5, 0);
    })();

    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      // When user taps the notification, open Alarm screen
      try {
        navigationRef.current?.navigate('Alarm');
      } catch (e) {
        console.warn('navigate on notification response failed', e);
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '5AM Challenge' }} />
        <Stack.Screen name="Alarm" component={AlarmScreen} options={{ title: 'Wake Alarm' }} />
        <Stack.Screen name="Workout" component={WorkoutScreen} options={{ title: 'Workout' }} />
        <Stack.Screen name="Pomodoro" component={PomodoroScreen} options={{ title: 'Pomodoro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
