import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import {WORKOUT_DATA} from '../utils/workoutData';
import { loadStats, saveStats, loadCompletedExercises, saveCompletedExercises } from '../utils/storage';
import { addXp } from '../utils/storage';


/**
 * RunnerScreen props:
 * - onExit: function (e.g., setScreen('home') or setScreen('workout'))
 * - onSessionComplete: optional callback when session completed
 *
 * This screen guides through each exercise and its sets.
 * Behavior:
 *  - For timed exercises (durationSec > 0) it runs the countdown for the set.
 *  - For rep-based exercises (durationSec === 0) it uses a rest timer between sets and expects user to press "Done set".
 *  - Auto-advance between sets/exercises; shows Start/Pause/Next controls.
 */

const DEFAULT_REST_SEC = 30; // rest between sets (you can make this configurable later)

export default function RunnerScreen({ setScreen }) {
  const [index, setIndex] = useState(0); // index into WORKOUT_DATA
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('work'); // 'work' | 'rest' | 'done'
  const [timeLeft, setTimeLeft] = useState(0); // seconds for timer
  const timerRef = useRef(null);

  // summary
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // initialize first exercise timer or 0 for reps-based
    const ex = WORKOUT_DATA[index];
    if (!ex) return;
    if (ex.durationSec && ex.durationSec > 0) {
      setTimeLeft(ex.durationSec);
      setPhase('work');
    } else {
      setTimeLeft(0);
      setPhase('work'); // for reps, we wait for user to tap "Complete set"
    }
    setCurrentSet(1);
    setIsRunning(false);
  }, [index]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    // tick down every second if timeLeft > 0
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => Math.max(0, t - 1));
      }, 1000);
    } else {
      // If no timeLeft and it's a timed set, handle end-of-phase
      if (phase === 'work' && isRunning && WORKOUT_DATA[index] && WORKOUT_DATA[index].durationSec > 0) {
        // this branch unlikely because we set isRunning only when timeLeft > 0; keep guard
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, timeLeft, phase, index]);

  useEffect(() => {
    // When a timer reaches 0 while running — advance logic
    if (isRunning && timeLeft === 0) {
      if (phase === 'work') {
        handleSetComplete();
      } else if (phase === 'rest') {
        // start next set or next exercise
        startWorkForCurrent();
      }
    }
  }, [timeLeft, isRunning, phase]);

  const startWorkForCurrent = () => {
    const ex = WORKOUT_DATA[index];
    if (!ex) return;
    if (ex.durationSec && ex.durationSec > 0) {
      setPhase('work');
      setTimeLeft(ex.durationSec);
      setIsRunning(true);
    } else {
      // reps-based: we pause and wait for user to confirm completion
      setPhase('work');
      setIsRunning(false);
      setTimeLeft(0);
    }
  };

  const startRest = (sec = DEFAULT_REST_SEC) => {
    setPhase('rest');
    setTimeLeft(sec);
    setIsRunning(true);
  };

  const handleSetComplete = async () => {
    // mark current set done
    const ex = WORKOUT_DATA[index];
    const setsTotal = ex.sets || 1;

    // increment completed count
    setCompletedCount((s) => s + 1);

    if (currentSet < setsTotal) {
      // start rest then next set
      setCurrentSet((p) => p + 1);
      startRest(DEFAULT_REST_SEC);
    } else {
      // completed all sets for this exercise -> move to next exercise
      if (index < WORKOUT_DATA.length - 1) {
        // small rest between exercises
        startRest(DEFAULT_REST_SEC + 10); // larger rest between exercises
        // when rest finishes, advance index in the useEffect that handles timeLeft==0/phase transitions
        // we'll set index after rest completes (handled below by detecting rest finish)
        // to make it deterministic, we'll schedule index increment when rest hits zero:
        const onRestFinish = () => {
          setIndex((i) => i + 1);
          setCurrentSet(1);
          setPhase('work');
          setIsRunning(false);
        };
        // Instead of trying to hook into the rest completion here, we will detect rest==0 in effect and advance.
        // So just set phase/rest and handler will advance when rest ends.
      } else {
        // workout completed
        setPhase('done');
        setIsRunning(false);
        await finalizeSession();
      }
    }
  };

  // Detect rest finishing to advance to next exercise when appropriate
  useEffect(() => {
    if (!isRunning && phase === 'rest' && timeLeft === 0) {
      // if rest ended but we still have current exercise with remaining sets -> start work
      const ex = WORKOUT_DATA[index];
      if (!ex) return;
      // if rest was between sets and we haven't exhausted sets, start work for currentSet (we already incremented currentSet earlier)
      // but if currentSet === ex.sets + 1 it means we should advance to next exercise
      // Simpler approach: if ex.sets >= currentSet then start work, else go to next exercise
      if (currentSet <= ex.sets) {
        // start next set for the same exercise
        if (ex.durationSec && ex.durationSec > 0) {
          setPhase('work');
          setTimeLeft(ex.durationSec);
          setIsRunning(true);
        } else {
          // reps-based: leave isRunning false and wait for user to press "Complete set"
          setPhase('work');
          setIsRunning(false);
          setTimeLeft(0);
        }
      } else {
        // move to next exercise
        if (index < WORKOUT_DATA.length - 1) {
          setIndex((i) => i + 1);
          setCurrentSet(1);
        } else {
          // session finished
          (async () => {
            setPhase('done');
            setIsRunning(false);
            await finalizeSession();
          })();
        }
      }
    }
  }, [isRunning, phase, timeLeft, index, currentSet]);

  const finalizeSession = async () => {
    // Update persisted completed exercises / xp if you want.
    try {
      // Here we simply award XP proportional to completedCount, save xp
      const stats = await loadStats();
      const baseXp = stats?.xp ?? 0;
      const baseLvl = stats?.level ?? 1;
      const gained = completedCount * 10;
      let newXp = baseXp + gained;
      let newLvl = baseLvl;
      while (newXp >= 1000) {
        newXp -= 1000;
        newLvl += 1;
      }
      await saveStats(newXp, newLvl);

      // Optionally persist completed exercises list: add all completed IDs
      const priorCompleted = (await loadCompletedExercises()) || [];
      const completedIds = WORKOUT_DATA.map((w) => w.id);
      const dedup = Array.from(new Set([...priorCompleted, ...completedIds]));
      await saveCompletedExercises(dedup);

      Alert.alert('Workout Complete', `You earned ${gained} XP!`);
    } catch (e) {
      console.warn('Failed to finalize session', e);
    }
  };

  // when user presses "Complete set" for reps-based exercises
  const handleManualSetComplete = async () => {
    // behave same as automatic set complete
    await handleSetComplete();
  };

  const onStartPause = () => {
    // For reps-based work phase, starting means user is signaling ready for a reps set => we treat as running a "manual" set.
    const ex = WORKOUT_DATA[index];
    if (!ex) return;
    if (phase === 'work' && ex.durationSec === 0) {
      // For reps: treat the button as "Complete set" — we cannot auto-time reps
      // But to keep UI consistent, interpret Start as Toggle "ready" (or just do nothing)
      // We'll implement as a 'Complete Set' action when user taps it
      handleManualSetComplete();
      return;
    }

    // For timed workouts:
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const onSkip = () => {
    // skip current set/exercise
    const ex = WORKOUT_DATA[index];
    if (!ex) return;
    // If more sets remain, move to next set (without awarding completedCount)
    if (currentSet < ex.sets) {
      setCurrentSet((p) => p + 1);
      // give a small rest and then start
      startRest(8);
    } else {
      // advance to next exercise
      if (index < WORKOUT_DATA.length - 1) {
        setIndex((i) => i + 1);
        setCurrentSet(1);
        setPhase('work');
        setIsRunning(false);
      } else {
        setPhase('done');
        setIsRunning(false);
      }
    }
  };

  const onExit = async () => {
    // prompt save
    if (phase !== 'done') {
      Alert.alert('Exit workout', 'Are you sure you want to exit the workout? Progress in this session will be saved partially.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => setScreen('workout') },
      ]);
    } else {
      setScreen('workout');
    }
  };

  const ex = WORKOUT_DATA[index];
  const setsTotal = ex ? ex.sets || 1 : 1;
  const displayTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Runner</Text>
        <TouchableOpacity onPress={onExit} style={styles.exitBtn}><Text style={styles.exitTxt}>Exit</Text></TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{ex?.name}</Text>
        <Text style={styles.cardSub}>{ex?.reps} • Set {currentSet} / {setsTotal}</Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerBig}>{timeLeft > 0 ? displayTime(timeLeft) : (ex?.durationSec > 0 ? displayTime(ex.durationSec) : '--:--')}</Text>
          <Text style={styles.phaseText}>{phase === 'work' ? (ex?.durationSec > 0 ? 'Work' : 'Reps (manual)') : (phase === 'rest' ? 'Rest' : 'Done')}</Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={onStartPause} style={[styles.controlBtn, isRunning ? styles.pauseBtn : styles.startBtn]}>
            <Text style={styles.controlBtnText}>{ex?.durationSec > 0 ? (isRunning ? 'Pause' : 'Start') : 'Complete Set'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsRunning(false); startRest(DEFAULT_REST_SEC); }} style={[styles.controlBtn, styles.restBtn]}>
            <Text style={styles.controlBtnText}>Quick Rest</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip} style={[styles.controlBtn, styles.skipBtn]}>
            <Text style={styles.controlBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>Exercise {index + 1} of {WORKOUT_DATA.length}</Text>
        <Text style={styles.progressText}>Sets done: {completedCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#05060a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#e6fbff', fontWeight: '900', fontSize: 18 },
  exitBtn: { padding: 6, backgroundColor: '#071426', borderRadius: 8 },
  exitTxt: { color: '#9be9ff', fontWeight: '700' },

  card: { marginTop: 18, backgroundColor: '#071226', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#092536' },
  cardTitle: { color: '#e6fbff', fontWeight: '900', fontSize: 20 },
  cardSub: { color: '#94a3b8', marginTop: 6 },

  timerBox: { alignItems: 'center', marginVertical: 18 },
  timerBig: { color: '#0ef', fontSize: 46, fontWeight: '900' },
  phaseText: { color: '#94a3b8', marginTop: 6 },

  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  controlBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  startBtn: { backgroundColor: '#0ea5e9' },
  pauseBtn: { backgroundColor: '#f97316' },
  restBtn: { backgroundColor: '#334155' },
  skipBtn: { backgroundColor: '#0b2633' },
  controlBtnText: { color: '#001219', fontWeight: '900' },

  progressRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { color: '#94a3b8' },
});
