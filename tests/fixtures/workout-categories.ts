/**
 * Test Fixtures for Workout Categories Admin
 * Reusable test data builders and fixtures
 */

import { createBuilder } from '../helpers/test-data-patterns.ts';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Exercise extends Record<string, unknown> {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  description?: string;
  order: number;
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

export interface WorkoutCategorySummary extends Record<string, unknown> {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exerciseCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Exercise Builders
// ============================================================================

export const buildExercise = createBuilder<Exercise>({
  id: 'ex-test-123',
  name: 'Jump Spike',
  sets: 3,
  repetitions: '10',
  difficulty: 'challenging' as const,
  description: 'Power spike with full approach',
  order: 0,
});

export const validExerciseData = {
  name: 'Jump Spike',
  sets: 3,
  repetitions: '10',
  difficulty: 'challenging' as const,
  description: 'Power spike with full approach',
};

export const invalidExerciseData = {
  missingName: {
    sets: 3,
    repetitions: '10',
    difficulty: 'challenging',
  },
  missingSets: {
    name: 'Jump Spike',
    repetitions: '10',
    difficulty: 'challenging',
  },
  missingRepetitions: {
    name: 'Jump Spike',
    sets: 3,
    difficulty: 'challenging',
  },
  missingDifficulty: {
    name: 'Jump Spike',
    sets: 3,
    repetitions: '10',
  },
  nameTooLong: {
    name: 'x'.repeat(101),
    sets: 3,
    repetitions: '10',
    difficulty: 'challenging',
  },
  nameEmpty: {
    name: '',
    sets: 3,
    repetitions: '10',
    difficulty: 'challenging',
  },
  setsTooSmall: {
    name: 'Jump Spike',
    sets: 0,
    repetitions: '10',
    difficulty: 'challenging',
  },
  setsTooLarge: {
    name: 'Jump Spike',
    sets: 11,
    repetitions: '10',
    difficulty: 'challenging',
  },
  setsNotInteger: {
    name: 'Jump Spike',
    sets: 3.5,
    repetitions: '10',
    difficulty: 'challenging',
  },
  repetitionsEmpty: {
    name: 'Jump Spike',
    sets: 3,
    repetitions: '',
    difficulty: 'challenging',
  },
  repetitionsTooLong: {
    name: 'Jump Spike',
    sets: 3,
    repetitions: 'x'.repeat(51),
    difficulty: 'challenging',
  },
  invalidDifficulty: {
    name: 'Jump Spike',
    sets: 3,
    repetitions: '10',
    difficulty: 'super-hard',
  },
  descriptionTooLong: {
    name: 'Jump Spike',
    sets: 3,
    repetitions: '10',
    difficulty: 'challenging',
    description: 'x'.repeat(501),
  },
};

// ============================================================================
// Category Builders
// ============================================================================

export const buildCategory = createBuilder<WorkoutCategory>({
  id: 'cat-test-123',
  name: 'Spike Training',
  focusArea: 'Attacking',
  keyObjective: 'Develop attacking power and precision',
  exercises: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const buildCategorySummary = createBuilder<WorkoutCategorySummary>({
  id: 'cat-test-123',
  name: 'Spike Training',
  focusArea: 'Attacking',
  keyObjective: 'Develop attacking power and precision',
  exerciseCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const validCategoryData = {
  name: 'Spike Training',
  focusArea: 'Attacking',
  keyObjective: 'Develop attacking power and precision',
};

export const invalidCategoryData = {
  missingName: {
    focusArea: 'Attacking',
    keyObjective: 'Develop attacking power and precision',
  },
  missingFocusArea: {
    name: 'Spike Training',
    keyObjective: 'Develop attacking power and precision',
  },
  missingKeyObjective: {
    name: 'Spike Training',
    focusArea: 'Attacking',
  },
  nameTooLong: {
    name: 'x'.repeat(101),
    focusArea: 'Attacking',
    keyObjective: 'Develop attacking power and precision',
  },
  nameEmpty: {
    name: '',
    focusArea: 'Attacking',
    keyObjective: 'Develop attacking power and precision',
  },
  focusAreaTooLong: {
    name: 'Spike Training',
    focusArea: 'x'.repeat(101),
    keyObjective: 'Develop attacking power and precision',
  },
  focusAreaEmpty: {
    name: 'Spike Training',
    focusArea: '',
    keyObjective: 'Develop attacking power and precision',
  },
  keyObjectiveTooLong: {
    name: 'Spike Training',
    focusArea: 'Attacking',
    keyObjective: 'x'.repeat(501),
  },
  keyObjectiveEmpty: {
    name: 'Spike Training',
    focusArea: 'Attacking',
    keyObjective: '',
  },
};

// ============================================================================
// Complete Category Fixtures
// ============================================================================

/**
 * Category with multiple exercises for testing
 */
export function buildCategoryWithExercises(
  exerciseCount: number = 3,
): WorkoutCategory {
  const exercises = Array.from({ length: exerciseCount }, (_, i) =>
    buildExercise({
      id: `ex-${i + 1}`,
      name: `Exercise ${i + 1}`,
      order: i,
    })
  );

  return buildCategory({
    exercises,
  });
}

/**
 * Multiple categories for list testing
 */
export function buildMultipleCategories(count: number): WorkoutCategory[] {
  return Array.from({ length: count }, (_, i) =>
    buildCategory({
      id: `cat-${i + 1}`,
      name: `Category ${i + 1}`,
      focusArea: `Focus Area ${i + 1}`,
      keyObjective: `Objective ${i + 1}`,
      exercises: [],
      createdAt: new Date(Date.now() + i * 1000).toISOString(),
    })
  );
}

/**
 * KV seed data for categories
 */
export function createCategoryKvSeeds(
  categories: WorkoutCategory[],
): Array<{ key: unknown[]; value: unknown }> {
  return categories.map((cat) => ({
    key: ['workout_category', cat.id],
    value: cat,
  }));
}

// ============================================================================
// Update Request Data
// ============================================================================

export const validCategoryUpdateData = {
  full: {
    name: 'Advanced Spike Training',
    focusArea: 'Advanced Attacking',
    keyObjective: 'Master advanced attacking techniques',
  },
  partial: {
    name: 'Updated Spike Training',
  },
};

export const invalidCategoryUpdateData = {
  empty: {},
  nameTooLong: {
    name: 'x'.repeat(101),
  },
  nameEmpty: {
    name: '',
  },
  focusAreaTooLong: {
    focusArea: 'x'.repeat(101),
  },
  focusAreaEmpty: {
    focusArea: '',
  },
  keyObjectiveTooLong: {
    keyObjective: 'x'.repeat(501),
  },
  keyObjectiveEmpty: {
    keyObjective: '',
  },
};

export const validExerciseUpdateData = {
  full: {
    name: 'Advanced Jump Spike',
    sets: 4,
    repetitions: '12',
    difficulty: 'challenging' as const,
    description: 'Power spike with approach and follow-through',
  },
  partial: {
    sets: 4,
  },
};

export const invalidExerciseUpdateData = {
  empty: {},
  nameTooLong: {
    name: 'x'.repeat(101),
  },
  setsTooSmall: {
    sets: 0,
  },
  setsTooLarge: {
    sets: 11,
  },
  invalidDifficulty: {
    difficulty: 'super-hard',
  },
};

// ============================================================================
// Reorder Request Data
// ============================================================================

export function buildReorderRequest(exerciseIds: string[]) {
  return {
    exerciseIds,
  };
}

export const invalidReorderData = {
  empty: {
    exerciseIds: [],
  },
  notArray: {
    exerciseIds: 'not-an-array',
  },
  invalidIds: {
    exerciseIds: ['ex-1', 'ex-2', 'non-existent'],
  },
  duplicates: {
    exerciseIds: ['ex-1', 'ex-2', 'ex-1'],
  },
  missingExercises: {
    exerciseIds: ['ex-1'], // Missing ex-2 and ex-3
  },
};

// ============================================================================
// Duplicate Request Data
// ============================================================================

export const validDuplicateData = {
  sameCategory: {
    targetCategoryId: 'cat-test-123',
  },
  differentCategory: {
    targetCategoryId: 'cat-other-456',
  },
};

export const invalidDuplicateData = {
  missingTargetCategoryId: {},
  emptyTargetCategoryId: {
    targetCategoryId: '',
  },
  nonExistentCategory: {
    targetCategoryId: 'cat-non-existent',
  },
};

// ============================================================================
// Search/Filter Query Params
// ============================================================================

export const validQueryParams = {
  search: {
    query: 'spike',
    limit: 10,
    offset: 0,
  },
  pagination: {
    limit: 20,
    offset: 10,
  },
  defaults: {
    limit: 50,
    offset: 0,
  },
};

export const invalidQueryParams = {
  limitNegative: {
    limit: -1,
  },
  limitTooLarge: {
    limit: 1001,
  },
  offsetNegative: {
    offset: -1,
  },
  limitNotNumber: {
    limit: 'abc',
  },
  offsetNotNumber: {
    offset: 'xyz',
  },
};
