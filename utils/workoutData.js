const FALLBACK_IMG = "file:///mnt/data/b986fc03-daf2-4c8e-8978-0391d4e846d3.png";

export const WORKOUT_DATA = [
  {
    id: 1,
    name: "Dynamic Pushups",
    sets: 3,
    reps: "20 reps",
    image: FALLBACK_IMG,
    description:
      "Dynamic pushups build explosive chest, shoulder, and tricep strength. They activate your fast-twitch muscle fibers.",
    steps: [
      "Start in a standard pushup position.",
      "Lower your body until your chest nearly touches the floor.",
      "Explode upward with controlled speed.",
      "Return to the starting position and repeat.",
    ],
    tips: "Keep your core tight and elbows slightly tucked. Do not flare your elbows too wide.",
    // videoUrl: "https://youtube.com/..."
  },

  {
    id: 2,
    name: "In & Out Pushups",
    sets: 3,
    reps: "10 reps",
    image: FALLBACK_IMG,
    description:
      "Targets the inner and outer chest muscles by altering hand placement.",
    steps: [
      "Start in a narrow pushup stance.",
      "Lower and push back up.",
      "Immediately step your hands outward into a wide stance.",
      "Perform another pushup.",
    ],
    tips: "Move hands smoothly. Do not overextend wrists.",
  },

  {
    id: 3,
    name: "Jumping Jacks",
    sets: 3,
    reps: "1 minute",
    image: FALLBACK_IMG,
    description:
      "A full-body cardio movement that improves endurance and warms up every major muscle group.",
    steps: [
      "Stand straight with arms at your sides.",
      "Jump while spreading your legs and raising your arms.",
      "Jump back to the starting position.",
    ],
    tips: "Land softly on the balls of your feet.",
  },

  {
    id: 4,
    name: "Mountain Climbers",
    sets: 3,
    reps: "1 minute",
    image: FALLBACK_IMG,
    description:
      "A core-intensive exercise that burns calories fast and improves agility.",
    steps: [
      "Begin in a high plank.",
      "Drive your right knee toward your chest.",
      "Switch legs at a fast but controlled pace.",
    ],
    tips: "Keep your back flat. Do not bounce your hips.",
  },

  {
    id: 5,
    name: "Diamond Pushups",
    sets: 3,
    reps: "10 reps",
    image: FALLBACK_IMG,
    description:
      "Isolates the triceps and targets the inner chest effectively.",
    steps: [
      "Form a diamond shape with your hands under your chest.",
      "Lower your body while keeping elbows close.",
      "Push back up while squeezing your triceps.",
    ],
    tips: "If it's too hard, do them on your knees and progress later.",
  },

  {
    id: 6,
    name: "Lunges",
    sets: 3,
    reps: "1 minute",
    image: FALLBACK_IMG,
    description:
      "Strengthens quadriceps, glutes, and improves balance and coordination.",
    steps: [
      "Step forward with your right leg.",
      "Lower until both knees form 90° angles.",
      "Push back up & switch legs.",
    ],
    tips: "Do not let your front knee pass your toes.",
  },

  {
    id: 7,
    name: "Plank",
    sets: 3,
    reps: "1 minute",
    image: FALLBACK_IMG,
    description:
      "A static core exercise that strengthens your abs, obliques, and lower back.",
    steps: [
      "Get into a forearm plank position.",
      "Keep your body in a straight line.",
      "Hold the position while breathing steadily.",
    ],
    tips: "Do not drop your hips or lift your butt too high.",
  },

  {
    id: 8,
    name: "Burpees",
    sets: 3,
    reps: "1 minute",
    image: FALLBACK_IMG,
    description:
      "A full-body explosive move that builds extreme stamina and strength.",
    steps: [
      "Squat down and place your hands on the floor.",
      "Kick your feet back into a plank.",
      "Perform a pushup.",
      "Jump back into a squat position and explode upwards.",
    ],
    tips: "Land softly and maintain form over speed.",
  },

  {
    id: 9,
    name: "Crunches",
    sets: 1,
    reps: "20 reps",
    image: FALLBACK_IMG,
    description: "Targets the upper abdominal muscles.",
    steps: [
      "Lie on your back with knees bent.",
      "Lift your shoulders off the ground.",
      "Squeeze the core at the top.",
      "Lower slowly.",
    ],
    tips: "Do not pull your neck with your hands.",
  },

  {
    id: 10,
    name: "Heel Touch",
    sets: 1,
    reps: "20 reps",
    image: FALLBACK_IMG,
    description: "Works the oblique muscles and improves core definition.",
    steps: [
      "Lie on your back, knees bent.",
      "Crunch sideways to touch right heel.",
      "Crunch to touch left heel.",
    ],
    tips: "Keep the movement small and controlled.",
  },

  {
    id: 11,
    name: "Bicycle Crunches",
    sets: 1,
    reps: "20 reps",
    image: FALLBACK_IMG,
    description: "Great for activating full abdominal muscles.",
    steps: [
      "Lie down and lift legs to 90°.",
      "Bring opposite elbow to opposite knee.",
      "Alternate in a pedaling motion.",
    ],
    tips: "Slow and controlled is better than fast and sloppy.",
  },

  {
    id: 12,
    name: "Leg Raises",
    sets: 1,
    reps: "20 reps",
    image: FALLBACK_IMG,
    description: "Strengthens lower abs and hip flexors.",
    steps: [
      "Lie flat, legs straight.",
      "Lift legs to 90° without bending knees.",
      "Lower slowly without touching the floor.",
    ],
    tips: "Keep your lower back pressed into the floor.",
  },

  {
    id: 13,
    name: "V-Ups",
    sets: 1,
    reps: "20 reps",
    image: FALLBACK_IMG,
    description: "Full core exercise engaging upper + lower abs.",
    steps: [
      "Lie flat with arms extended overhead.",
      "Lift legs & upper body simultaneously.",
      "Touch hands to feet at top position.",
    ],
    tips: "Exhale as you lift, inhale as you lower.",
  },

  {
    id: 14,
    name: "Squats",
    sets: 1,
    reps: "30 reps",
    image: FALLBACK_IMG,
    description: "Targets quads, hamstrings, and glutes.",
    steps: [
      "Stand with feet shoulder-width apart.",
      "Sit back as if sitting in a chair.",
      "Keep chest up and knees out.",
    ],
    tips: "Keep weight on your heels, not your toes.",
  },

  {
    id: 15,
    name: "Frog Jumps",
    sets: 1,
    reps: "20 reps",
    image: FALLBACK_IMG,
    description:
      "An explosive leg exercise that improves power and speed.",
    steps: [
      "Squat deep with hands touching the floor.",
      "Explode upward into a jump.",
      "Land softly and repeat.",
    ],
    tips: "Stay controlled and maintain deep squats.",
  },

  {
    id: 16,
    name: "Calf Raises",
    sets: 1,
    reps: "50 reps",
    image: FALLBACK_IMG,
    description:
      "Strengthens calf muscles and improves ankle stability.",
    steps: [
      "Stand straight with feet hip-width apart.",
      "Lift your heels and squeeze calves.",
      "Lower slowly.",
    ],
    tips: "Pause at the top for maximum contraction.",
  },
];
