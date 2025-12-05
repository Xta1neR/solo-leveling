// /screens/WorkoutScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import ExerciseCard from '../components/ExerciseCard';
import {
  loadCompletedExercises,
  saveCompletedExercises,
  loadStats,
  saveStats,
} from '../utils/storage';

/**
 * Fully self-contained WorkoutScreen with hard-coded WORKOUT_DATA.
 * - No external /data/workout.js required.
 * - Uses local fallback image you uploaded: /mnt/data/b986fc03-daf2-4c8e-8978-0391d4e846d3.png
 *
 * If you want to remove the old file, delete: /data/workout.js
 */

// local fallback image (use exactly the uploaded path)
const FALLBACK_IMAGE_URI = '../data/b986fc03-daf2-4c8e-8978-0391d4e846d3.png';

// === HARDCODED WORKOUT DATA ===
const WORKOUT_DATA = [
  {
    id: 1,
    name: 'Hindu Pushups',
    sets: 3,
    reps: '20 reps',
    image: FALLBACK_IMAGE_URI,
    description:
      'Dynamic pushups build explosive chest, shoulder, and tricep strength. They activate fast-twitch muscle fibers.',
    steps: [
      'Start in a standard pushup position with hands slightly wider than shoulder-width.',
      'Lower your chest toward the floor in a controlled motion.',
      'Explode upward with controlled speed (a small hop or push).',
      'Return to starting position and repeat for reps.',
    ],
    tips: 'Keep your core tight and elbows slightly tucked. Focus on explosive control; do not flare elbows.',
  },
  {
    id: 2,
    name: 'In & Out Pushups',
    sets: 3,
    reps: '10 reps',
    image: FALLBACK_IMAGE_URI,
    description:
      'Alternating hand positions to target inner and outer chest areas while increasing shoulder stability.',
    steps: [
      'Start in a narrow pushup (hands close together).',
      'Perform one controlled pushup.',
      'Step or slide your hands outward into a wide pushup position.',
      'Perform one controlled pushup and repeat in/out sequence.',
    ],
    tips: 'Move hands smoothly. If wrists hurt, perform on knees until strength improves.',
  },
  {
    id: 3,
    name: 'Jumping Jacks',
    sets: 3,
    reps: '1 minute',
    image: FALLBACK_IMAGE_URI,
    description: 'Full-body cardio movement to raise heart rate and warm up the body.',
    steps: [
      'Stand tall with arms at sides.',
      'Jump with feet wide and hands overhead.',
      'Jump back to starting position and repeat.',
    ],
    tips: 'Land softly on the balls of the feet. Keep a rhythmic breathing pattern.',
  },
  {
    id: 4,
    name: 'Mountain Climbers',
    sets: 3,
    reps: '1 minute',
    image: FALLBACK_IMAGE_URI,
    description: 'A core and cardio movement that improves agility and endurance.',
    steps: [
      'Begin in a high plank (hands under shoulders).',
      'Drive the right knee toward the chest, then return.',
      'Alternate legs rapidly while maintaining plank form.',
    ],
    tips: 'Keep hips steady and core tight. Avoid letting hips sag or pike.',
  },
  {
    id: 5,
    name: 'Diamond Pushups',
    sets: 3,
    reps: '10 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Focuses on triceps and inner chest by narrowing hand placement.',
    steps: [
      'Form a diamond shape with thumbs and index fingers under chest.',
      'Lower body while keeping elbows close to sides.',
      'Push up by contracting triceps.',
    ],
    tips: 'If too difficult, perform on knees and gradually progress to full form.',
  },
  {
    id: 6,
    name: 'Lunges',
    sets: 3,
    reps: '1 minute',
    image: FALLBACK_IMAGE_URI,
    description: 'Strengthens quads and glutes; improves balance and single-leg stability.',
    steps: [
      'Step forward with right leg and lower until knees are ~90°.',
      'Push through front heel to return to standing.',
      'Alternate legs for the duration.',
    ],
    tips: 'Keep front knee aligned over toes and torso upright.',
  },
  {
    id: 7,
    name: 'Plank',
    sets: 3,
    reps: '1 minute',
    image: FALLBACK_IMAGE_URI,
    description: 'Static core hold that builds endurance in abs, obliques, and lower back.',
    steps: [
      'Position forearms on the ground, elbows under shoulders.',
      'Keep body in a straight line from head to heels.',
      'Hold while maintaining steady breathing.',
    ],
    tips: 'Avoid sagging hips; if necessary reduce hold time and build up gradually.',
  },
  {
    id: 8,
    name: 'Burpees',
    sets: 3,
    reps: '1 minute',
    image: FALLBACK_IMAGE_URI,
    description: 'Explosive full-body move for conditioning and power.',
    steps: [
      'From standing, drop into a squat and place hands on the floor.',
      'Kick feet back to plank, perform optional pushup.',
      'Jump feet back to squat and explode upward into a jump.',
    ],
    tips: 'Maintain control; land softly and reset between reps if form breaks down.',
  },
  {
    id: 9,
    name: 'Crunches',
    sets: 1,
    reps: '20 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Targets upper abdominal muscles.',
    steps: [
      'Lie on your back with knees bent and feet flat.',
      'Place hands lightly behind the head or across chest.',
      'Lift shoulders off the floor, squeeze abs, and lower down slowly.',
    ],
    tips: 'Avoid pulling on neck; lift with the core.',
  },
  {
    id: 10,
    name: 'Heel Touch',
    sets: 1,
    reps: '20 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Oblique-targeting movement for waist definition.',
    steps: [
      'Lie on back with knees bent and feet flat.',
      'Crunch slightly and reach right hand to right heel, then left hand to left heel.',
      'Alternate sides in a controlled manner.',
    ],
    tips: 'Small controlled movements are more effective than large twists.',
  },
  {
    id: 11,
    name: 'Bicycle Crunches',
    sets: 1,
    reps: '20 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Dynamic abs exercise engaging upper and lower abs plus obliques.',
    steps: [
      'Lie on back and elevate legs to tabletop.',
      'Bring opposite elbow to opposite knee while extending the other leg.',
      'Alternate sides in a smooth cycling motion.',
    ],
    tips: 'Keep controlled tempo; avoid jerking the neck.',
  },
  {
    id: 12,
    name: 'Leg Raises',
    sets: 1,
    reps: '20 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Strengthens lower abs and hip flexors.',
    steps: [
      'Lie flat with legs extended.',
      'Lift legs up to 90° slowly without arching the lower back.',
      'Lower legs with control.',
    ],
    tips: 'Place hands under glutes for lower back support if needed.',
  },
  {
    id: 13,
    name: 'V-Ups',
    sets: 1,
    reps: '20 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Full-body core move that combines a crunch with a leg raise.',
    steps: [
      'Lie flat with arms overhead and legs extended.',
      'Simultaneously lift legs and torso, reaching hands to toes.',
      'Lower with control and repeat.',
    ],
    tips: 'Exhale as you lift; keep movement smooth.',
  },
  {
    id: 14,
    name: 'Squats',
    sets: 1,
    reps: '30 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Foundational lower-body exercise targeting quads, glutes, and hamstrings.',
    steps: [
      'Stand with feet shoulder-width apart.',
      'Hinge at hips and bend knees to lower into squat.',
      'Push through heels to return to standing.',
    ],
    tips: 'Keep chest up and knees tracking over toes.',
  },
  {
    id: 15,
    name: 'Frog Jumps',
    sets: 1,
    reps: '20 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Explosive plyometric movement for leg power.',
    steps: [
      'Start in deep squat with hands touching the floor.',
      'Explode up into a jump reaching arms overhead.',
      'Land softly and sink back to squat.',
    ],
    tips: 'Focus on soft landings and full range of motion.',
  },
  {
    id: 16,
    name: 'Calf Raises',
    sets: 1,
    reps: '50 reps',
    image: FALLBACK_IMAGE_URI,
    description: 'Low-impact isolation exercise for calf strength and endurance.',
    steps: [
      'Stand tall with feet hip-width apart.',
      'Raise heels as high as possible, squeeze calves, and lower slowly.',
      'Repeat for reps.',
    ],
    tips: 'Pause briefly at the top for maximum contraction.',
  },
];

// === WORKOUT SCREEN COMPONENT ===
export default function WorkoutScreen({ navigation }) {
  const [completed, setCompleted] = useState([]);
  const [modalExercise, setModalExercise] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  // const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const saved = await loadCompletedExercises();
        setCompleted(Array.isArray(saved) ? saved : []);
      } catch (e) {
        console.warn('Failed to load completed exercises', e);
      }

      try {
        const stats = await loadStats();
        if (stats) {
          setXp(typeof stats.xp === 'number' ? stats.xp : 0);
          setLevel(typeof stats.level === 'number' ? stats.level : 1);
        }
      } catch (e) {
        console.warn('Failed to load stats', e);
      }
    })();
  }, []);

  const persistCompleted = async (next) => {
    setCompleted(next);
    try {
      await saveCompletedExercises(next);
    } catch (e) {
      console.warn('Failed to save completed exercises', e);
    }
  };

  const toggleExercise = async (id) => {
    let next = [];
    let xpDelta = 0;

    if (completed.includes(id)) {
      next = completed.filter((c) => c !== id);
      xpDelta = -10;
    } else {
      next = [...completed, id];
      xpDelta = 10;
    }

    await persistCompleted(next);

    let newXp = (typeof xp === 'number' ? xp : 0) + xpDelta;
    let newLevel = typeof level === 'number' ? level : 1;

    while (newXp >= 1000) {
      newXp -= 1000;
      newLevel += 1;
      Alert.alert('LEVEL UP 🎉', `You reached level ${newLevel}!`);
    }
    if (newXp < 0) newXp = 0;

    setXp(newXp);
    setLevel(newLevel);

    try {
      await saveStats(newXp, newLevel);
    } catch (e) {
      console.warn('Failed to save stats', e);
    }
  };

  const openExerciseDetails = (exercise) => {
    setModalExercise(exercise);
  };

  const closeModal = () => setModalExercise(null);

  const renderItem = ({ item }) => {
    const isDone = completed.includes(item.id);
    return (
      <View style={{ marginBottom: 12 }}>
        <ExerciseCard
          exercise={item}
          isCompleted={isDone}
          onToggle={() => toggleExercise(item.id)}
          onOpenDetails={() => openExerciseDetails(item)}
        />
      </View>
    );
  };

  const progressPercent =
    WORKOUT_DATA && WORKOUT_DATA.length > 0
      ? Math.round((completed.length / WORKOUT_DATA.length) * 100)
      : 0;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Workout</Text>
          <Text style={styles.subtitle}>Complete your quest — earn XP</Text>
        </View>

        <View style={styles.rightStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>LVL</Text>
            <Text style={styles.statValue}>{level}</Text>
          </View>
          <View style={[styles.statBox, { marginLeft: 8 }]}>
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>{xp}</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {completed.length} / {WORKOUT_DATA.length} exercises completed ({progressPercent}%)
      </Text>

      <TouchableOpacity
        style={{ backgroundColor: '#0ea5e9', padding: 12, borderRadius: 10, marginVertical: 12 }}
        onPress={() => navigation.navigate('Runner')}
      >
        <Text style={{ color: '#001219', fontWeight: '900', textAlign: 'center' }}>Start Full Workout</Text>
      </TouchableOpacity>

      <FlatList
        data={WORKOUT_DATA}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
      <Modal
        visible={!!modalExercise}
        animationType="slide"
        onRequestClose={closeModal}
        transparent={true}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{modalExercise?.name}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                  <Text style={styles.closeTxt}>Close</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.sectionText}>
                  {modalExercise?.description ||
                    `${modalExercise?.sets || ''} sets × ${modalExercise?.reps || ''}`}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Method / Steps</Text>
                {Array.isArray(modalExercise?.steps) && modalExercise.steps.length > 0 ? (
                  modalExercise.steps.map((s, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepIndex}>
                        <Text style={styles.stepIndexTxt}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{s}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.sectionText}>
                    Follow the sets & reps listed in the workout list.
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Posture & Tips</Text>
                <Text style={styles.sectionText}>
                  {modalExercise?.tips || 'Keep your core engaged. Move with control. Prioritize form over speed.'}
                </Text>
              </View>


            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05060a',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#e6fbff', fontSize: 20, fontWeight: '900' },
  subtitle: { color: '#94a3b8', fontSize: 12 },
  rightStats: { flexDirection: 'row', alignItems: 'center' },
  statBox: {
    backgroundColor: '#071828',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#073a45',
  },
  statLabel: { color: '#94a3b8', fontSize: 10 },
  statValue: { color: '#e6fbff', fontWeight: '900', marginTop: 4 },

  progressBarContainer: {
    height: 8,
    backgroundColor: '#071a28',
    borderRadius: 999,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
  },
  progressText: { color: '#94a3b8', textAlign: 'right', marginTop: 8, marginBottom: 8 },

  list: {
    paddingTop: 6,
    paddingBottom: 40,
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3,6,10,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    height: Platform.OS === 'ios' ? '78%' : '80%',
    backgroundColor: '#071226',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#092536',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { color: '#e6fbff', fontSize: 18, fontWeight: '900' },
  closeBtn: { padding: 8, backgroundColor: '#0b2633', borderRadius: 8 },
  closeTxt: { color: '#9be9ff', fontWeight: '800' },

  imageWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    backgroundColor: '#06121a',
    marginBottom: 12,
  },
  exerciseImage: { width: '100%', height: '100%' },

  section: { marginBottom: 12 },
  sectionTitle: { color: '#8bd0ff', fontWeight: '800', marginBottom: 6 },
  sectionText: { color: '#cbd5e1', fontSize: 13, lineHeight: 20 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  stepIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepIndexTxt: { color: '#001219', fontWeight: '900' },
  stepText: { color: '#cbd5e1', flex: 1 },

  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  actionStart: {
    flex: 1,
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  actionStartTxt: { color: '#001219', fontWeight: '900' },
  actionOutline: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  actionOutlineTxt: { color: '#9be9ff', fontWeight: '800' },
});
