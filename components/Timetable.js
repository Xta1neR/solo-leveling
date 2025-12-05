// /mnt/data/components/Timetable.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Timetable component
 * Props:
 * - schedule: [{ start: "05:00", end: "07:00", label: "Workout" }, ...]
 * - onStartStudy: function to call when user taps "Start Study (Pomodoro)"
 */
export default function Timetable({ schedule = [], onStartStudy }) {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  // convert "HH:MM" -> minutes since midnight
  const toMinutes = (hhmm) => {
    const [hh, mm] = hhmm.split(':').map((s) => parseInt(s, 10));
    return hh * 60 + mm;
  };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Determine if current schedule contains 'Study' so we show the quick start button
  const inStudySlot = schedule.some((slot) => {
    const startMin = toMinutes(slot.start);
    const endMin = toMinutes(slot.end);
    return nowMinutes >= startMin && nowMinutes < endMin && /study/i.test(slot.label);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Timetable</Text>

      <View style={styles.list}>
        {schedule.map((slot, idx) => {
          const startMin = toMinutes(slot.start);
          const endMin = toMinutes(slot.end);
          const active = nowMinutes >= startMin && nowMinutes < endMin;

          return (
            <View
              key={idx}
              style={[
                styles.slot,
                active ? styles.slotActive : styles.slotIdle
              ]}
            >
              <View style={styles.left}>
                <Text style={[styles.time, active && styles.timeActive]}>
                  {slot.start} {slot.end ? `- ${slot.end}` : ''}
                </Text>
                <Text style={[styles.label, active && styles.labelActive]}>
                  {slot.label}
                </Text>
              </View>
              <View style={styles.right}>
                {active && <Text style={styles.now}>Now</Text>}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        {inStudySlot ? (
          <TouchableOpacity style={styles.startBtn} onPress={onStartStudy}>
            <Text style={styles.startBtnText}>Start Study (Pomodoro)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.infoBtn} disabled>
            <Text style={styles.infoBtnText}>Study Time: 08:00 - 19:00</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0b1220',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#142032',
    marginBottom: 12,
  },
  heading: {
    color: '#8bd0ff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  list: {
    gap: 8,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  slotActive: {
    backgroundColor: '#07263a',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  slotIdle: {
    backgroundColor: '#071322',
  },
  left: {
    flex: 1,
  },
  time: {
    color: '#94a3b8',
    fontSize: 12,
  },
  timeActive: {
    color: '#7dd3fc',
    fontWeight: '700',
  },
  label: {
    color: '#cbd5e1',
    fontSize: 15,
    marginTop: 2,
  },
  labelActive: {
    color: '#e6f9ff',
  },
  right: {
    width: 60,
    alignItems: 'flex-end',
  },
  now: {
    backgroundColor: '#06b6d4',
    color: '#001219',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: '700',
    fontSize: 12,
    overflow: 'hidden',
  },
  actions: {
    marginTop: 12,
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  startBtnText: {
    color: '#001219',
    fontWeight: '800',
    letterSpacing: 1,
  },
  infoBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  infoBtnText: {
    color: '#94a3b8',
  },
});
