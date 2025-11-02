/**
 * Test Fixtures for Workout Plan Wizard
 * Reusable test data builders and fixtures for workout plans
 */

import { createBuilder } from '../helpers/test-data-patterns.ts';

// ============================================================================
// Type Definitions
// ============================================================================

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Exercise extends Record<string, unknown> {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  description?: string;
}

export interface WorkoutPlan extends Record<string, unknown> {
  id: string;
  userId: string;
  categoryId: string;
  startDate: string; // ISO 8601 date (YYYY-MM-DD)
  numberOfWeeks: number;
  selectedDays: DayOfWeek[];
  selectedExerciseIds: string[];
  createdAt: string; // ISO 8601 timestamp
}

export interface WorkoutPlanSummary extends Record<string, unknown> {
  id: string;
  categoryId: string;
  categoryName: string;
  startDate: string;
  numberOfWeeks: number;
  selectedDays: DayOfWeek[];
  exerciseCount: number;
  totalSessions: number;
  createdAt: string;
}

export interface WorkoutPlanDetail extends WorkoutPlan {
  categoryName: string;
  exercises: Exercise[];
  totalSessions: number;
}

export interface WorkoutCategory extends Record<string, unknown> {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Exercise Builders
// ============================================================================

export const buildExercise = createBuilder<Exercise>({
  id: 'ex-test-123',
  name: 'Box Jump',
  sets: 4,
  repetitions: '6-8',
  difficulty: 'challenging' as const,
  description: 'Explosive box jump for power development',
});

export function buildExercises(count: number): Exercise[] {
  const exercises: Exercise[] = [];
  for (let i = 0; i < count; i++) {
    exercises.push(
      buildExercise({
        id: `ex-${i + 1}`,
        name: `Exercise ${i + 1}`,
        sets: 3 + (i % 3),
        repetitions: `${8 + i * 2}`,
        difficulty: (['easy', 'medium', 'challenging'] as const)[i % 3],
      }),
    );
  }
  return exercises;
}

// ============================================================================
// Category Builders
// ============================================================================

export const buildCategory = createBuilder<WorkoutCategory>({
  id: 'cat-test-123',
  name: 'Jumping',
  focusArea: 'Vertical Power',
  keyObjective: 'Develop explosive vertical jump',
  exercises: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function buildCategoryWithExercises(
  exerciseCount: number,
  overrides?: Partial<WorkoutCategory>,
): WorkoutCategory {
  const exercises = buildExercises(exerciseCount);
  return buildCategory({
    exercises,
    ...overrides,
  });
}

// ============================================================================
// Workout Plan Builders
// ============================================================================

export const buildWorkoutPlan = createBuilder<WorkoutPlan>({
  id: 'plan-test-123',
  userId: 'user-test-456',
  categoryId: 'cat-test-123',
  startDate: '2025-01-20',
  numberOfWeeks: 8,
  selectedDays: [1, 3, 5] as DayOfWeek[], // Monday, Wednesday, Friday
  selectedExerciseIds: ['ex-1', 'ex-2', 'ex-3'],
  createdAt: new Date().toISOString(),
});

export const buildWorkoutPlanSummary = createBuilder<WorkoutPlanSummary>({
  id: 'plan-test-123',
  categoryId: 'cat-test-123',
  categoryName: 'Jumping',
  startDate: '2025-01-20',
  numberOfWeeks: 8,
  selectedDays: [1, 3, 5] as DayOfWeek[],
  exerciseCount: 3,
  totalSessions: 24, // 8 weeks * 3 days
  createdAt: new Date().toISOString(),
});

export function buildMultiplePlans(
  count: number,
  userId?: string,
): WorkoutPlan[] {
  const plans: WorkoutPlan[] = [];
  const baseDate = new Date('2025-01-20');

  for (let i = 0; i < count; i++) {
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() + i * 7); // Weekly increments

    plans.push(
      buildWorkoutPlan({
        id: `plan-${i + 1}`,
        userId: userId || `user-${i + 1}`,
        categoryId: `cat-${(i % 3) + 1}`, // Rotate through 3 categories
        startDate: startDate.toISOString().split('T')[0],
        numberOfWeeks: 4 + (i % 8), // 4-12 weeks
        selectedDays: [
          [1, 3, 5], // Mon, Wed, Fri
          [0, 2, 4, 6], // Sun, Tue, Thu, Sat
          [1, 4], // Mon, Thu
        ][i % 3] as DayOfWeek[],
        selectedExerciseIds: [`ex-${i * 3 + 1}`, `ex-${i * 3 + 2}`, `ex-${
          i * 3 + 3
        }`],
      }),
    );
  }
  return plans;
}

// ============================================================================
// KV Seed Helpers
// ============================================================================

export function createWorkoutPlanKvSeeds(
  plans: WorkoutPlan[],
): Array<{ key: unknown[]; value: WorkoutPlan }> {
  return plans.map((plan) => ({
    key: ['workout_plan', plan.id],
    value: plan,
  }));
}

export function createUserPlanIndexSeeds(
  plans: WorkoutPlan[],
): Array<{ key: unknown[]; value: unknown }> {
  return plans.map((plan) => ({
    key: ['user_workout_plans', plan.userId, plan.id],
    value: {
      id: plan.id,
      categoryId: plan.categoryId,
      startDate: plan.startDate,
      numberOfWeeks: plan.numberOfWeeks,
      createdAt: plan.createdAt,
    },
  }));
}

export function createCategoryKvSeeds(
  categories: WorkoutCategory[],
): Array<{ key: unknown[]; value: WorkoutCategory }> {
  return categories.map((category) => ({
    key: ['workout_category', category.id],
    value: category,
  }));
}

// ============================================================================
// Valid Request Data
// ============================================================================

export const validCreatePlanRequest = {
  categoryId: 'cat-123',
  startDate: getFutureDateString(7), // 7 days from now
  numberOfWeeks: 8,
  selectedDays: [1, 3, 5] as DayOfWeek[],
  selectedExerciseIds: ['ex-456', 'ex-789', 'ex-101'],
};

export const validCreatePlanVariations = {
  minWeeks: {
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 1,
    selectedDays: [1] as DayOfWeek[],
    selectedExerciseIds: ['ex-456'],
  },
  maxWeeks: {
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 12,
    selectedDays: [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[],
    selectedExerciseIds: ['ex-456', 'ex-789'],
  },
  weekendOnly: {
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 6,
    selectedDays: [0, 6] as DayOfWeek[], // Sunday, Saturday
    selectedExerciseIds: ['ex-456', 'ex-789'],
  },
};

export const validListPlansQuery = {
  default: {},
  withPagination: {
    limit: 10,
    offset: 0,
  },
  withCategoryFilter: {
    categoryId: 'cat-123',
  },
  fullQuery: {
    categoryId: 'cat-123',
    limit: 5,
    offset: 10,
  },
};

// ============================================================================
// Invalid Request Data
// ============================================================================

export const invalidCreatePlanRequest = {
  missingCategoryId: {
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  emptyCategoryId: {
    categoryId: '',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  missingStartDate: {
    categoryId: 'cat-123',
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  invalidStartDateFormat: {
    categoryId: 'cat-123',
    startDate: '2025/01/20', // Wrong format
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  startDateInPast: {
    categoryId: 'cat-123',
    startDate: '2020-01-01', // Past date
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  missingNumberOfWeeks: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  weeksTooSmall: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 0,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  weeksTooLarge: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 13,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  weeksNotInteger: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8.5,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  missingSelectedDays: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedExerciseIds: ['ex-456'],
  },
  emptySelectedDays: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [],
    selectedExerciseIds: ['ex-456'],
  },
  invalidDayValue: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, 3, 7], // 7 is invalid (0-6 only)
    selectedExerciseIds: ['ex-456'],
  },
  negativeDayValue: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, -1, 5],
    selectedExerciseIds: ['ex-456'],
  },
  duplicateDays: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, 1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  },
  missingExerciseIds: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
  },
  emptyExerciseIds: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: [],
  },
  emptyExerciseId: {
    categoryId: 'cat-123',
    startDate: '2025-01-20',
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456', ''],
  },
};

export const invalidListPlansQuery = {
  limitNegative: {
    limit: -5,
  },
  limitTooLarge: {
    limit: 1001,
  },
  offsetNegative: {
    offset: -10,
  },
  limitNotInteger: {
    limit: 10.5,
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate total sessions for a workout plan
 */
export function calculateTotalSessions(
  numberOfWeeks: number,
  selectedDays: DayOfWeek[],
): number {
  return numberOfWeeks * selectedDays.length;
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get future date in ISO format (YYYY-MM-DD)
 */
export function getFutureDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Get past date in ISO format (YYYY-MM-DD)
 */
export function getPastDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}
