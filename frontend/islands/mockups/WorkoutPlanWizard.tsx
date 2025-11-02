/**
 * Workout Plan Wizard Island Component
 *
 * This is the interactive island component for the workout plan wizard mockup.
 * Contains all state management, hooks, and interactive UI logic.
 *
 * Island components in Fresh allow the use of client-side hooks like useState.
 */

import { useState } from "preact/hooks";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface WorkoutCategory {
  id: string;
  name: string;
  icon: string;
  focusArea: string;
  description: string;
}

interface Exercise {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "challenging";
  sets: number;
  repetitions: string;
}

interface WizardState {
  currentStep: 1 | 2 | 3;
  selectedCategoryId: string | null;
  startDate: string;
  numberOfWeeks: number;
  selectedDays: Set<number>; // 0 = Sunday, 1 = Monday, etc.
  selectedExerciseIds: Set<string>;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CATEGORIES: WorkoutCategory[] = [
  {
    id: "court-agility",
    name: "Court Agility",
    icon: "🏃",
    focusArea: "Speed & Directional Changes",
    description: "Improve quick directional changes and court coverage speed"
  },
  {
    id: "blocking",
    name: "Blocking",
    icon: "🛡️",
    focusArea: "Upper Body Strength & Timing",
    description: "Develop blocking technique, jump timing, and defensive positioning"
  },
  {
    id: "jumping",
    name: "Jumping",
    icon: "⬆️",
    focusArea: "Lower Body Power",
    description: "Increase explosive jumping ability for blocking and attacking"
  },
  {
    id: "serving",
    name: "Serving",
    icon: "🎯",
    focusArea: "Power & Accuracy",
    description: "Build shoulder stability and rotational power for powerful serves"
  },
  {
    id: "passing",
    name: "Passing",
    icon: "🤝",
    focusArea: "Ball Control & Positioning",
    description: "Master platform control, footwork, and defensive positioning"
  },
  {
    id: "setting",
    name: "Setting",
    icon: "👐",
    focusArea: "Precision & Hand Technique",
    description: "Develop hand-eye coordination and accurate ball placement"
  }
];

const MOCK_EXERCISES: Exercise[] = [
  // Court Agility
  {
    id: "ca-1",
    categoryId: "court-agility",
    name: "Ladder Drills - Ickey Shuffle",
    description: "Quick footwork pattern through agility ladder. In-out-out pattern developing lateral quickness.",
    difficulty: "medium",
    sets: 4,
    repetitions: "3 lengths"
  },
  {
    id: "ca-2",
    categoryId: "court-agility",
    name: "Cone T-Drill",
    description: "Sprint forward, shuffle left, shuffle right, backpedal. Simulates court movement patterns.",
    difficulty: "medium",
    sets: 3,
    repetitions: "4 rounds"
  },
  {
    id: "ca-3",
    categoryId: "court-agility",
    name: "Reactive Ball Drops",
    description: "Partner drops ball from height, react and catch before second bounce. Develops reaction time.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "10 catches"
  },
  {
    id: "ca-4",
    categoryId: "court-agility",
    name: "Suicide Sprints",
    description: "Progressive distance sprints touching court lines. Builds speed endurance and acceleration.",
    difficulty: "challenging",
    sets: 5,
    repetitions: "Full court"
  },
  {
    id: "ca-5",
    categoryId: "court-agility",
    name: "Lateral Shuffle Series",
    description: "Side-to-side shuffles maintaining defensive stance. Improves lateral speed and stability.",
    difficulty: "easy",
    sets: 4,
    repetitions: "30 seconds"
  },
  {
    id: "ca-6",
    categoryId: "court-agility",
    name: "Box Drill Transitions",
    description: "Four-corner movement pattern with varied footwork. Develops multi-directional agility.",
    difficulty: "medium",
    sets: 3,
    repetitions: "5 rounds"
  },
  {
    id: "ca-7",
    categoryId: "court-agility",
    name: "Defensive Dive Recovery",
    description: "Practice diving, rolling, and quick recovery to ready position. Game-realistic agility training.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "8 reps"
  },

  // Blocking
  {
    id: "bl-1",
    categoryId: "blocking",
    name: "Block Jump Repetitions",
    description: "Continuous blocking jumps at net with focus on arm positioning and timing.",
    difficulty: "medium",
    sets: 4,
    repetitions: "10 jumps"
  },
  {
    id: "bl-2",
    categoryId: "blocking",
    name: "Lateral Block Movements",
    description: "Side-step and jump block sequence covering multiple net positions.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "6 movements"
  },
  {
    id: "bl-3",
    categoryId: "blocking",
    name: "Medicine Ball Block Simulation",
    description: "Overhead medicine ball press mimicking blocking motion. Builds shoulder endurance.",
    difficulty: "medium",
    sets: 4,
    repetitions: "12 reps"
  },
  {
    id: "bl-4",
    categoryId: "blocking",
    name: "Wall Touch Blocks",
    description: "Jump and touch wall targets at maximum reach. Develops vertical jump for blocking.",
    difficulty: "easy",
    sets: 3,
    repetitions: "15 touches"
  },
  {
    id: "bl-5",
    categoryId: "blocking",
    name: "Resistance Band Block Press",
    description: "Standing block motion with resistance bands. Strengthens shoulders and arms.",
    difficulty: "easy",
    sets: 3,
    repetitions: "15-20 reps"
  },
  {
    id: "bl-6",
    categoryId: "blocking",
    name: "Read and React Blocking",
    description: "Partner tosses ball, read trajectory and execute block. Develops timing and decision-making.",
    difficulty: "challenging",
    sets: 4,
    repetitions: "10 blocks"
  },

  // Jumping
  {
    id: "jm-1",
    categoryId: "jumping",
    name: "Box Jumps",
    description: "Explosive jumps onto stable platform. Focus on landing softly and maintaining proper form.",
    difficulty: "medium",
    sets: 4,
    repetitions: "8-10 reps"
  },
  {
    id: "jm-2",
    categoryId: "jumping",
    name: "Depth Jumps",
    description: "Step off box and immediately jump as high as possible. Develops reactive strength.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "6-8 reps"
  },
  {
    id: "jm-3",
    categoryId: "jumping",
    name: "Bulgarian Split Squats",
    description: "Single-leg strength exercise targeting quads, glutes, and stabilizers.",
    difficulty: "medium",
    sets: 3,
    repetitions: "10-12 per leg"
  },
  {
    id: "jm-4",
    categoryId: "jumping",
    name: "Jump Rope Singles",
    description: "Continuous single jumps focusing on ankle stiffness and quick ground contact time.",
    difficulty: "easy",
    sets: 3,
    repetitions: "60 seconds"
  },
  {
    id: "jm-5",
    categoryId: "jumping",
    name: "Broad Jumps",
    description: "Horizontal explosive jumps for distance. Develops lower body power and coordination.",
    difficulty: "medium",
    sets: 4,
    repetitions: "8 jumps"
  },
  {
    id: "jm-6",
    categoryId: "jumping",
    name: "Vertical Jump Testing",
    description: "Maximum vertical jump attempts. Track progress and measure improvement.",
    difficulty: "easy",
    sets: 3,
    repetitions: "3 max jumps"
  },
  {
    id: "jm-7",
    categoryId: "jumping",
    name: "Single-Leg Hops",
    description: "Continuous single-leg hopping. Builds unilateral power and ankle stability.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "15 per leg"
  },
  {
    id: "jm-8",
    categoryId: "jumping",
    name: "Approach Jump Practice",
    description: "Full volleyball approach with maximum vertical jump. Sport-specific power development.",
    difficulty: "medium",
    sets: 4,
    repetitions: "8 approaches"
  },

  // Serving
  {
    id: "sv-1",
    categoryId: "serving",
    name: "Medicine Ball Slams",
    description: "Overhead medicine ball throws focusing on explosive core engagement and follow-through.",
    difficulty: "medium",
    sets: 4,
    repetitions: "12-15 reps"
  },
  {
    id: "sv-2",
    categoryId: "serving",
    name: "Rotational Cable Chops",
    description: "Diagonal pulling motion that develops rotational core strength essential for serving power.",
    difficulty: "medium",
    sets: 3,
    repetitions: "12 per side"
  },
  {
    id: "sv-3",
    categoryId: "serving",
    name: "Overhead Dumbbell Press",
    description: "Seated or standing shoulder press building overhead strength and stability for serving motion.",
    difficulty: "challenging",
    sets: 4,
    repetitions: "8-10 reps"
  },
  {
    id: "sv-4",
    categoryId: "serving",
    name: "Band Pull-Aparts",
    description: "Shoulder health exercise targeting rear deltoids and upper back to prevent serving injuries.",
    difficulty: "easy",
    sets: 3,
    repetitions: "15-20 reps"
  },
  {
    id: "sv-5",
    categoryId: "serving",
    name: "Plank with Shoulder Taps",
    description: "Core stability exercise with anti-rotation component. Maintain plank while alternating touches.",
    difficulty: "medium",
    sets: 3,
    repetitions: "20 total taps"
  },
  {
    id: "sv-6",
    categoryId: "serving",
    name: "Serving Arm Circles",
    description: "Controlled arm rotations with resistance band. Warms up shoulder and builds endurance.",
    difficulty: "easy",
    sets: 2,
    repetitions: "20 per direction"
  },

  // Passing
  {
    id: "ps-1",
    categoryId: "passing",
    name: "Wall Passing Repetitions",
    description: "Continuous passing against wall. Develops platform control and consistent contact.",
    difficulty: "easy",
    sets: 3,
    repetitions: "50 passes"
  },
  {
    id: "ps-2",
    categoryId: "passing",
    name: "Partner Pepper Drill",
    description: "Continuous pass-set-hit sequence with partner. Builds ball control and reaction time.",
    difficulty: "medium",
    sets: 4,
    repetitions: "3 minutes"
  },
  {
    id: "ps-3",
    categoryId: "passing",
    name: "Platform Positioning Practice",
    description: "Static platform formation with focus on arm angle and body position. Master fundamentals.",
    difficulty: "easy",
    sets: 3,
    repetitions: "20 reps"
  },
  {
    id: "ps-4",
    categoryId: "passing",
    name: "Serve Receive Footwork",
    description: "Movement patterns for serve receive positions. Develops proper defensive positioning.",
    difficulty: "medium",
    sets: 4,
    repetitions: "15 movements"
  },
  {
    id: "ps-5",
    categoryId: "passing",
    name: "Low Ball Dig Practice",
    description: "Partner hits balls low, practice digging technique and recovery. Game-realistic training.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "20 digs"
  },
  {
    id: "ps-6",
    categoryId: "passing",
    name: "Target Passing Accuracy",
    description: "Pass to specific target zones on court. Develops precision and consistency.",
    difficulty: "medium",
    sets: 4,
    repetitions: "15 targets"
  },

  // Setting
  {
    id: "st-1",
    categoryId: "setting",
    name: "Wall Setting Repetitions",
    description: "Continuous setting against wall. Develops hand technique and finger strength.",
    difficulty: "easy",
    sets: 3,
    repetitions: "50 sets"
  },
  {
    id: "st-2",
    categoryId: "setting",
    name: "Target Setting Drill",
    description: "Set to specific locations on court. Builds accuracy and ball placement control.",
    difficulty: "medium",
    sets: 4,
    repetitions: "20 sets per target"
  },
  {
    id: "st-3",
    categoryId: "setting",
    name: "Jump Setting Practice",
    description: "Setting motion while jumping. Develops timing and aerial ball control.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "15 jump sets"
  },
  {
    id: "st-4",
    categoryId: "setting",
    name: "Finger Strength Exercises",
    description: "Resistance band finger flexion and extension. Prevents injury and builds hand strength.",
    difficulty: "easy",
    sets: 3,
    repetitions: "20 reps"
  },
  {
    id: "st-5",
    categoryId: "setting",
    name: "Footwork to Setting Position",
    description: "Movement patterns to get into optimal setting position. Develops court awareness.",
    difficulty: "medium",
    sets: 4,
    repetitions: "15 movements"
  },
  {
    id: "st-6",
    categoryId: "setting",
    name: "Back Set Technique",
    description: "Practice backward setting motion. Expands setting options and court coverage.",
    difficulty: "challenging",
    sets: 3,
    repetitions: "20 back sets"
  },
  {
    id: "st-7",
    categoryId: "setting",
    name: "Quick Set Repetitions",
    description: "Fast-tempo setting practice. Develops quick release and decision-making speed.",
    difficulty: "medium",
    sets: 3,
    repetitions: "25 quick sets"
  }
];

// Day names for the week grid
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Progress indicator at top of wizard
function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Category" },
    { number: 2, label: "Commitment" },
    { number: 3, label: "Exercises" }
  ];

  return (
    <div class="mb-8">
      {/* Progress bar */}
      <div class="relative mb-6">
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div class="flex justify-between">
        {steps.map((step) => (
          <div key={step.number} class="flex flex-col items-center">
            <div
              class={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                currentStep >= step.number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number}
            </div>
            <span
              class={`text-sm font-medium ${
                currentStep >= step.number ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Category card for Step 1
function CategoryCard({
  category,
  isSelected,
  onClick
}: {
  category: WorkoutCategory;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      class={`p-6 rounded-xl border-2 transition-all text-left w-full ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div class="text-4xl mb-3">{category.icon}</div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
      <p class="text-sm text-gray-600 mb-2">{category.focusArea}</p>
      <p class="text-sm text-gray-500">{category.description}</p>
      {isSelected && (
        <div class="mt-4 flex items-center text-blue-600 font-medium">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          Selected
        </div>
      )}
    </button>
  );
}

// Day toggle button for Step 2
function DayButton({
  day,
  dayIndex,
  isSelected,
  onClick
}: {
  day: string;
  dayIndex: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      class={`px-4 py-3 rounded-lg font-medium transition-all ${
        isSelected
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {day}
    </button>
  );
}

// Exercise checkbox item for Step 3
function ExerciseItem({
  exercise,
  isSelected,
  onToggle
}: {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    challenging: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <label
      class={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
      />
      <div class="ml-4 flex-1">
        <div class="flex items-start justify-between gap-3 mb-2">
          <h4 class="font-semibold text-gray-900">{exercise.name}</h4>
          <span
            class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
              difficultyColors[exercise.difficulty]
            }`}
          >
            {exercise.difficulty}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-2">{exercise.description}</p>
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span>
            <strong>{exercise.sets}</strong> sets
          </span>
          <span class="text-gray-300">•</span>
          <span>
            <strong>{exercise.repetitions}</strong> reps
          </span>
        </div>
      </div>
    </label>
  );
}

// ============================================================================
// WIZARD STEP COMPONENTS
// ============================================================================

function Step1CategorySelection({
  categories,
  selectedCategoryId,
  onSelectCategory
}: {
  categories: WorkoutCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}) {
  return (
    <div>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Workout Focus
        </h2>
        <p class="text-gray-600">
          Select the volleyball skill you want to develop in this training plan
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategoryId === category.id}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Step2CommitmentSetup({
  startDate,
  numberOfWeeks,
  selectedDays,
  onStartDateChange,
  onWeeksChange,
  onDayToggle
}: {
  startDate: string;
  numberOfWeeks: number;
  selectedDays: Set<number>;
  onStartDateChange: (date: string) => void;
  onWeeksChange: (weeks: number) => void;
  onDayToggle: (dayIndex: number) => void;
}) {
  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Set Your Training Schedule
        </h2>
        <p class="text-gray-600">
          Choose when to start and how often you'll train each week
        </p>
      </div>

      <div class="space-y-8">
        {/* Start Date */}
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <label class="block mb-3">
            <span class="text-sm font-semibold text-gray-900 mb-2 block">
              Start Date
            </span>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) =>
                onStartDateChange((e.target as HTMLInputElement).value)
              }
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </label>
        </div>

        {/* Number of Weeks */}
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <label class="block mb-3">
            <span class="text-sm font-semibold text-gray-900 mb-2 block">
              Training Duration
            </span>
          </label>
          <div class="flex items-center gap-4">
            <button
              onClick={() => onWeeksChange(Math.max(1, numberOfWeeks - 1))}
              disabled={numberOfWeeks <= 1}
              class="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition-colors"
            >
              −
            </button>
            <div class="flex-1 text-center">
              <div class="text-4xl font-bold text-gray-900">
                {numberOfWeeks}
              </div>
              <div class="text-sm text-gray-600 mt-1">
                {numberOfWeeks === 1 ? "week" : "weeks"}
              </div>
            </div>
            <button
              onClick={() => onWeeksChange(Math.min(12, numberOfWeeks + 1))}
              disabled={numberOfWeeks >= 12}
              class="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition-colors"
            >
              +
            </button>
          </div>
          <div class="mt-3 text-center text-sm text-gray-500">
            Range: 1-12 weeks
          </div>
        </div>

        {/* Days of Week */}
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="mb-4">
            <span class="text-sm font-semibold text-gray-900 block mb-1">
              Training Days
            </span>
            <span class="text-sm text-gray-600">
              Select which days you'll train ({selectedDays.size}{" "}
              {selectedDays.size === 1 ? "day" : "days"} selected)
            </span>
          </div>
          <div class="grid grid-cols-7 gap-2">
            {DAYS.map((day, index) => (
              <DayButton
                key={index}
                day={day}
                dayIndex={index}
                isSelected={selectedDays.has(index)}
                onClick={() => onDayToggle(index)}
              />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start gap-3">
            <svg
              class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm text-blue-900">
              <div class="font-semibold mb-1">Training Commitment Summary</div>
              <p class="text-blue-800">
                You'll train <strong>{selectedDays.size}</strong> days per week
                for <strong>{numberOfWeeks}</strong>{" "}
                {numberOfWeeks === 1 ? "week" : "weeks"}, starting on{" "}
                <strong>
                  {startDate
                    ? new Date(startDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        }
                      )
                    : "your selected date"}
                </strong>
                . That's a total of{" "}
                <strong>{selectedDays.size * numberOfWeeks}</strong> training
                sessions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3ExerciseSelection({
  exercises,
  selectedExerciseIds,
  onToggleExercise,
  categoryName
}: {
  exercises: Exercise[];
  selectedExerciseIds: Set<string>;
  onToggleExercise: (exerciseId: string) => void;
  categoryName: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Select Your Exercises
        </h2>
        <p class="text-gray-600">
          Choose at least 3 {categoryName} exercises for your workout plan
        </p>
      </div>

      {/* Search and counter */}
      <div class="mb-6 flex items-center gap-4">
        <div class="flex-1 relative">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div class="px-5 py-3 bg-blue-100 text-blue-900 rounded-lg font-semibold whitespace-nowrap">
          {selectedExerciseIds.size}{" "}
          {selectedExerciseIds.size === 1 ? "exercise" : "exercises"} selected
        </div>
      </div>

      {/* Exercise list */}
      <div class="space-y-3">
        {filteredExercises.length === 0 ? (
          <div class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              class="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-gray-600">No exercises found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              isSelected={selectedExerciseIds.has(exercise.id)}
              onToggle={() => onToggleExercise(exercise.id)}
            />
          ))
        )}
      </div>

      {/* Selection requirement notice */}
      {selectedExerciseIds.size < 1 && (
        <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm text-yellow-800">
              <strong>Minimum requirement:</strong> Please select at least 1 exercise to
              continue.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN ISLAND COMPONENT
// ============================================================================

export default function WorkoutPlanWizard() {
  // Initialize wizard state with defaults
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    selectedCategoryId: null,
    startDate: "",
    numberOfWeeks: 4,
    selectedDays: new Set([1, 3, 5]), // Mon, Wed, Fri
    selectedExerciseIds: new Set()
  });

  // Validation checks for each step
  const isStep1Valid = wizardState.selectedCategoryId !== null;
  const isStep2Valid =
    wizardState.startDate !== "" &&
    wizardState.numberOfWeeks >= 1 &&
    wizardState.numberOfWeeks <= 12 &&
    wizardState.selectedDays.size > 0;
  const isStep3Valid = wizardState.selectedExerciseIds.size >= 1;

  const canProceed =
    (wizardState.currentStep === 1 && isStep1Valid) ||
    (wizardState.currentStep === 2 && isStep2Valid) ||
    (wizardState.currentStep === 3 && isStep3Valid);

  // Get exercises for selected category
  const categoryExercises = wizardState.selectedCategoryId
    ? MOCK_EXERCISES.filter(
        (ex) => ex.categoryId === wizardState.selectedCategoryId
      )
    : [];

  const selectedCategory = MOCK_CATEGORIES.find(
    (cat) => cat.id === wizardState.selectedCategoryId
  );

  // Event handlers
  const handleSelectCategory = (categoryId: string) => {
    setWizardState((prev) => ({
      ...prev,
      selectedCategoryId: categoryId,
      selectedExerciseIds: new Set() // Reset exercise selection when category changes
    }));
  };

  const handleStartDateChange = (date: string) => {
    setWizardState((prev) => ({ ...prev, startDate: date }));
  };

  const handleWeeksChange = (weeks: number) => {
    setWizardState((prev) => ({ ...prev, numberOfWeeks: weeks }));
  };

  const handleDayToggle = (dayIndex: number) => {
    setWizardState((prev) => {
      const newSelectedDays = new Set(prev.selectedDays);
      if (newSelectedDays.has(dayIndex)) {
        newSelectedDays.delete(dayIndex);
      } else {
        newSelectedDays.add(dayIndex);
      }
      return { ...prev, selectedDays: newSelectedDays };
    });
  };

  const handleToggleExercise = (exerciseId: string) => {
    setWizardState((prev) => {
      const newSelectedExercises = new Set(prev.selectedExerciseIds);
      if (newSelectedExercises.has(exerciseId)) {
        newSelectedExercises.delete(exerciseId);
      } else {
        newSelectedExercises.add(exerciseId);
      }
      return { ...prev, selectedExerciseIds: newSelectedExercises };
    });
  };

  const handleNext = () => {
    if (canProceed && wizardState.currentStep < 3) {
      setWizardState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep + 1) as 1 | 2 | 3
      }));
    }
  };

  const handleBack = () => {
    if (wizardState.currentStep > 1) {
      setWizardState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep - 1) as 1 | 2 | 3
      }));
    }
  };

  const handleCreatePlan = () => {
    // In real app, would submit to API
    alert(
      `Workout plan created!\n\nCategory: ${selectedCategory?.name}\nStart Date: ${wizardState.startDate}\nWeeks: ${wizardState.numberOfWeeks}\nTraining Days: ${wizardState.selectedDays.size}\nExercises: ${wizardState.selectedExerciseIds.size}\n\nThis is a mockup - no data was saved.`
    );
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Create Workout Plan
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              Build your personalized volleyball training program
            </p>
          </div>

          <span class="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
            MOCKUP MODE
          </span>
        </div>
      </nav>

      {/* Main content */}
      <div class="max-w-4xl mx-auto px-6 py-8">
        {/* Progress indicator */}
        <ProgressIndicator currentStep={wizardState.currentStep} />

        {/* Step content */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          {wizardState.currentStep === 1 && (
            <Step1CategorySelection
              categories={MOCK_CATEGORIES}
              selectedCategoryId={wizardState.selectedCategoryId}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {wizardState.currentStep === 2 && (
            <Step2CommitmentSetup
              startDate={wizardState.startDate}
              numberOfWeeks={wizardState.numberOfWeeks}
              selectedDays={wizardState.selectedDays}
              onStartDateChange={handleStartDateChange}
              onWeeksChange={handleWeeksChange}
              onDayToggle={handleDayToggle}
            />
          )}

          {wizardState.currentStep === 3 && (
            <Step3ExerciseSelection
              exercises={categoryExercises}
              selectedExerciseIds={wizardState.selectedExerciseIds}
              onToggleExercise={handleToggleExercise}
              categoryName={selectedCategory?.name || ""}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div class="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={wizardState.currentStep === 1}
            class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {wizardState.currentStep === 3 ? (
            <button
              onClick={handleCreatePlan}
              disabled={!canProceed}
              class="px-8 py-3 text-white bg-green-600 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Create Workout Plan
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              class="px-8 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Mockup watermark */}
      <div class="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg shadow-lg opacity-90">
        Visual Mockup - Non-functional UI
      </div>
    </div>
  );
}
