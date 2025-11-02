/**
 * Workout Plan Wizard Island Component
 * Production-ready 3-step wizard for creating personalized volleyball training plans
 *
 * Step 1: Select workout category
 * Step 2: Set training commitment (start date, duration, days)
 * Step 3: Choose exercises
 */

import { useState } from "preact/hooks";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: "easy" | "medium" | "challenging";
  description: string;
  order: number;
}

interface WorkoutCategory {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface WizardState {
  currentStep: 1 | 2 | 3;
  selectedCategoryId: string | null;
  startDate: string;
  numberOfWeeks: number;
  selectedDays: Set<number>; // 0 = Sunday, 1 = Monday, etc.
  selectedExerciseIds: Set<string>;
}

interface Props {
  initialCategories: WorkoutCategory[];
  currentUser: User;
}

// Day names for the week grid
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get API URL
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(':3000', ':8000') + '/api';
  }
  return 'http://localhost:8000/api';
};

// Get auth token from cookies
const getToken = () => {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ')
    .find((c) => c.startsWith('auth_token='))
    ?.split('=')[1] || '';
};

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
      <h3 class="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
      <p class="text-sm text-gray-600 mb-2 font-medium">{category.focusArea}</p>
      <p class="text-sm text-gray-500">{category.keyObjective}</p>
      <p class="text-xs text-gray-400 mt-3">
        {category.exercises?.length || 0} exercises available
      </p>
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

// Toast notification component
function Toast({
  message,
  type,
  onClose
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const icons = {
    success: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    ),
    error: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    ),
    info: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    )
  };

  return (
    <div class={`fixed top-4 right-4 max-w-md rounded-lg border-2 shadow-lg p-4 ${colors[type]} animate-slide-in z-50`}>
      <div class="flex items-start gap-3">
        {icons[type]}
        <p class="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          class="flex-shrink-0 hover:opacity-70"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Loading overlay
function LoadingOverlay({ message }: { message: string }) {
  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-700 font-medium text-center">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Success modal
function SuccessModal({
  onViewPlans,
  onCreateAnother
}: {
  onViewPlans: () => void;
  onCreateAnother: () => void;
}) {
  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Workout Plan Created!</h2>
          <p class="text-gray-600 mb-6">
            Your personalized training plan has been successfully created. You can now start tracking your progress!
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onViewPlans}
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View My Plans
            </button>
            <button
              onClick={onCreateAnother}
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    </div>
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

      {categories.length === 0 ? (
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
          <p class="text-gray-600">No workout categories available</p>
          <p class="text-sm text-gray-500 mt-2">Please contact your administrator</p>
        </div>
      ) : (
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
      )}
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

  const filteredExercises = (exercises || []).filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Select Your Exercises
        </h2>
        <p class="text-gray-600">
          Choose at least 1 {categoryName} exercise for your workout plan
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

export default function WorkoutPlanWizard({
  initialCategories,
  currentUser
}: Props) {
  // Ensure categories is always an array and filter out null/undefined
  const categories = (initialCategories || []).filter((cat) => cat != null);

  // Initialize wizard state with defaults
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    selectedCategoryId: null,
    startDate: "",
    numberOfWeeks: 4,
    selectedDays: new Set([1, 3, 5]), // Mon, Wed, Fri
    selectedExerciseIds: new Set()
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  const selectedCategory = categories.find(
    (cat) => cat && cat.id === wizardState.selectedCategoryId
  );
  const categoryExercises = selectedCategory?.exercises || [];

  // Show toast notification
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto-hide after 5 seconds
  };

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
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (wizardState.currentStep > 1) {
      setWizardState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep - 1) as 1 | 2 | 3
      }));
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreatePlan = async () => {
    if (!isStep3Valid) {
      showToast("Please select at least 1 exercise", "error");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Creating your workout plan...");

    try {
      const token = getToken();
      const apiUrl = getApiUrl();

      const requestBody = {
        categoryId: wizardState.selectedCategoryId,
        startDate: wizardState.startDate,
        numberOfWeeks: wizardState.numberOfWeeks,
        selectedDays: Array.from(wizardState.selectedDays),
        selectedExerciseIds: Array.from(wizardState.selectedExerciseIds)
      };

      const response = await fetch(`${apiUrl}/workout-plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create workout plan');
      }

      // Success!
      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating workout plan:', error);
      setIsLoading(false);
      showToast(
        error instanceof Error ? error.message : 'Failed to create workout plan. Please try again.',
        'error'
      );
    }
  };

  const handleViewPlans = () => {
    // Navigate to workout plans list (to be implemented)
    window.location.href = '/workout-plans';
  };

  const handleCreateAnother = () => {
    // Reset wizard state
    setWizardState({
      currentStep: 1,
      selectedCategoryId: null,
      startDate: "",
      numberOfWeeks: 4,
      selectedDays: new Set([1, 3, 5]),
      selectedExerciseIds: new Set()
    });
    setShowSuccessModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600">
              {currentUser.name}
            </span>
            <a
              href="/"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </a>
          </div>
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
              categories={categories}
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

      {/* Loading overlay */}
      {isLoading && <LoadingOverlay message={loadingMessage} />}

      {/* Success modal */}
      {showSuccessModal && (
        <SuccessModal
          onViewPlans={handleViewPlans}
          onCreateAnother={handleCreateAnother}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
