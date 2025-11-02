/**
 * Validation Tests: Workout Plan Wizard Zod Schemas
 * Tests all validation rules from data-models.md
 *
 * These tests follow TDD Red phase - they will FAIL until schemas are implemented.
 */

import { assertEquals } from 'jsr:@std/assert';
import {
  getFutureDateString,
  getPastDateString,
  getTodayDateString,
  invalidCreatePlanRequest,
  invalidListPlansQuery,
  validCreatePlanRequest,
  validCreatePlanVariations,
  validListPlansQuery,
} from './fixtures/workout-plans.ts';

import {
  WorkoutPlanSchema,
  CreateWorkoutPlanRequestSchema,
  ListWorkoutPlansQuerySchema,
  DayOfWeekSchema,
} from '../backend/schemas/workout-plans.ts';

// ============================================================================
// DayOfWeek Schema Validation
// ============================================================================

Deno.test('DayOfWeekSchema - validates all valid day values', () => {
  const validDays = [0, 1, 2, 3, 4, 5, 6];
  //
  for (const day of validDays) {
    const result = DayOfWeekSchema.safeParse(day);
    assertEquals(result.success, true, `Day ${day} should be valid`);
  }
});

Deno.test('DayOfWeekSchema - rejects negative values', () => {
  const result = DayOfWeekSchema.safeParse(-1);
  assertEquals(result.success, false);
});

Deno.test('DayOfWeekSchema - rejects values greater than 6', () => {
  const result = DayOfWeekSchema.safeParse(7);
  assertEquals(result.success, false);
});

Deno.test('DayOfWeekSchema - rejects non-integer values', () => {
  const result = DayOfWeekSchema.safeParse(3.5);
  assertEquals(result.success, false);
});

Deno.test('DayOfWeekSchema - rejects string values', () => {
  const result = DayOfWeekSchema.safeParse('1');
  assertEquals(result.success, false);
});

// ============================================================================
// WorkoutPlan Schema Validation
// ============================================================================

Deno.test('WorkoutPlanSchema - validates complete workout plan', () => {
  const validPlan = {
    id: 'plan-abc123',
    userId: 'user-456',
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456', 'ex-789'],
    createdAt: new Date().toISOString(),
  };
  //
  const result = WorkoutPlanSchema.safeParse(validPlan);
  assertEquals(result.success, true);
});

Deno.test('WorkoutPlanSchema - validates startDate format', () => {
  const validDates = [getFutureDateString(7), '2025-12-31', '2025-06-15'];
  //
  for (const date of validDates) {
    const result = WorkoutPlanSchema.safeParse({
      id: 'plan-123',
      userId: 'user-456',
      categoryId: 'cat-123',
      startDate: date,
      numberOfWeeks: 8,
      selectedDays: [1, 3, 5],
      selectedExerciseIds: ['ex-456'],
      createdAt: new Date().toISOString(),
    });
    assertEquals(result.success, true);
  }
});

Deno.test('WorkoutPlanSchema - rejects invalid startDate formats', () => {
  const invalidDates = [
    '2025/01/20',
    '20-01-2025',
    '2025-1-20',
    'Jan 20, 2025',
    '2025-01-20T00:00:00Z',
  ];
  //
  for (const date of invalidDates) {
    const result = WorkoutPlanSchema.safeParse({
      id: 'plan-123',
      userId: 'user-456',
      categoryId: 'cat-123',
      startDate: date,
      numberOfWeeks: 8,
      selectedDays: [1, 3, 5],
      selectedExerciseIds: ['ex-456'],
      createdAt: new Date().toISOString(),
    });
    assertEquals(result.success, false, `Date ${date} should be invalid`);
  }
});

Deno.test('WorkoutPlanSchema - validates numberOfWeeks range', () => {
  const validWeeks = [1, 6, 12];
  //
  for (const weeks of validWeeks) {
    const result = WorkoutPlanSchema.safeParse({
      id: 'plan-123',
      userId: 'user-456',
      categoryId: 'cat-123',
      startDate: getFutureDateString(7),
      numberOfWeeks: weeks,
      selectedDays: [1, 3, 5],
      selectedExerciseIds: ['ex-456'],
      createdAt: new Date().toISOString(),
    });
    assertEquals(result.success, true);
  }
});

Deno.test('WorkoutPlanSchema - rejects numberOfWeeks out of range', () => {
  const invalidWeeks = [0, -1, 13, 100];
  //
  for (const weeks of invalidWeeks) {
    const result = WorkoutPlanSchema.safeParse({
      id: 'plan-123',
      userId: 'user-456',
      categoryId: 'cat-123',
      startDate: getFutureDateString(7),
      numberOfWeeks: weeks,
      selectedDays: [1, 3, 5],
      selectedExerciseIds: ['ex-456'],
      createdAt: new Date().toISOString(),
    });
    assertEquals(result.success, false, `Weeks ${weeks} should be invalid`);
  }
});

Deno.test('WorkoutPlanSchema - validates selectedDays array', () => {
  const validDayArrays = [
    [1],
    [0, 6],
    [1, 3, 5],
    [0, 1, 2, 3, 4, 5, 6],
  ];
  //
  for (const days of validDayArrays) {
    const result = WorkoutPlanSchema.safeParse({
      id: 'plan-123',
      userId: 'user-456',
      categoryId: 'cat-123',
      startDate: getFutureDateString(7),
      numberOfWeeks: 8,
      selectedDays: days,
      selectedExerciseIds: ['ex-456'],
      createdAt: new Date().toISOString(),
    });
    assertEquals(result.success, true);
  }
});

Deno.test('WorkoutPlanSchema - rejects empty selectedDays array', () => {
  const result = WorkoutPlanSchema.safeParse({
    id: 'plan-123',
    userId: 'user-456',
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [],
    selectedExerciseIds: ['ex-456'],
    createdAt: new Date().toISOString(),
  });
  assertEquals(result.success, false);
});

Deno.test('WorkoutPlanSchema - validates selectedExerciseIds array', () => {
  const validExerciseArrays = [
    ['ex-1'],
    ['ex-1', 'ex-2'],
    ['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5'],
  ];
  //
  for (const exercises of validExerciseArrays) {
    const result = WorkoutPlanSchema.safeParse({
      id: 'plan-123',
      userId: 'user-456',
      categoryId: 'cat-123',
      startDate: getFutureDateString(7),
      numberOfWeeks: 8,
      selectedDays: [1, 3, 5],
      selectedExerciseIds: exercises,
      createdAt: new Date().toISOString(),
    });
    assertEquals(result.success, true);
  }
});

Deno.test('WorkoutPlanSchema - rejects empty selectedExerciseIds array', () => {
  const result = WorkoutPlanSchema.safeParse({
    id: 'plan-123',
    userId: 'user-456',
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: [],
    createdAt: new Date().toISOString(),
  });
  assertEquals(result.success, false);
});

Deno.test('WorkoutPlanSchema - rejects empty exercise ID strings', () => {
  const result = WorkoutPlanSchema.safeParse({
    id: 'plan-123',
    userId: 'user-456',
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456', ''],
    createdAt: new Date().toISOString(),
  });
  assertEquals(result.success, false);
});

Deno.test('WorkoutPlanSchema - validates createdAt as ISO timestamp', () => {
  const validTimestamps = [
    new Date().toISOString(),
    '2025-01-15T10:35:00Z',
    '2025-01-15T10:35:00.123Z',
  ];
  //
  for (const timestamp of validTimestamps) {
    const result = WorkoutPlanSchema.safeParse({
      id: 'plan-123',
      userId: 'user-456',
      categoryId: 'cat-123',
      startDate: getFutureDateString(7),
      numberOfWeeks: 8,
      selectedDays: [1, 3, 5],
      selectedExerciseIds: ['ex-456'],
      createdAt: timestamp,
    });
    assertEquals(result.success, true);
  }
});

// ============================================================================
// CreateWorkoutPlanRequest Schema Validation
// ============================================================================

Deno.test('CreateWorkoutPlanRequestSchema - validates valid request', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    validCreatePlanRequest,
  );
  assertEquals(result.success, true);
});

Deno.test('CreateWorkoutPlanRequestSchema - validates minimum weeks plan', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    validCreatePlanVariations.minWeeks,
  );
  assertEquals(result.success, true);
});

Deno.test('CreateWorkoutPlanRequestSchema - validates maximum weeks plan', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    validCreatePlanVariations.maxWeeks,
  );
  assertEquals(result.success, true);
});

Deno.test('CreateWorkoutPlanRequestSchema - validates weekend only plan', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    validCreatePlanVariations.weekendOnly,
  );
  assertEquals(result.success, true);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects missing categoryId', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.missingCategoryId,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects empty categoryId', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.emptyCategoryId,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - trims categoryId', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse({
    categoryId: '  cat-123  ',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  });
  //
  if (result.success) {
    assertEquals(result.data.categoryId, 'cat-123');
  }
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects missing startDate', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.missingStartDate,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects invalid date format', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.invalidStartDateFormat,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - accepts today as start date', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse({
    categoryId: 'cat-123',
    startDate: getTodayDateString(),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  });
  assertEquals(result.success, true);
});

Deno.test('CreateWorkoutPlanRequestSchema - accepts future start date', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse({
    categoryId: 'cat-123',
    startDate: getFutureDateString(30),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  });
  assertEquals(result.success, true);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects past start date', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse({
    categoryId: 'cat-123',
    startDate: getPastDateString(1),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  });
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects missing numberOfWeeks', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.missingNumberOfWeeks,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects weeks too small', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.weeksTooSmall,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects weeks too large', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.weeksTooLarge,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects non-integer weeks', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.weeksNotInteger,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects missing selectedDays', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.missingSelectedDays,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects empty selectedDays', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.emptySelectedDays,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects invalid day values', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.invalidDayValue,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects negative day values', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.negativeDayValue,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects missing exerciseIds', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.missingExerciseIds,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects empty exerciseIds', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.emptyExerciseIds,
  );
  assertEquals(result.success, false);
});

Deno.test('CreateWorkoutPlanRequestSchema - rejects empty exercise ID string', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.emptyExerciseId,
  );
  assertEquals(result.success, false);
});

// ============================================================================
// ListWorkoutPlansQuery Schema Validation
// ============================================================================

Deno.test('ListWorkoutPlansQuerySchema - validates empty query', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    validListPlansQuery.default,
  );
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data.limit, 50); // Default
    assertEquals(result.data.offset, 0); // Default
  }
});

Deno.test('ListWorkoutPlansQuerySchema - validates with pagination', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    validListPlansQuery.withPagination,
  );
  assertEquals(result.success, true);
});

Deno.test('ListWorkoutPlansQuerySchema - validates with category filter', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    validListPlansQuery.withCategoryFilter,
  );
  assertEquals(result.success, true);
});

Deno.test('ListWorkoutPlansQuerySchema - validates full query', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    validListPlansQuery.fullQuery,
  );
  assertEquals(result.success, true);
});

Deno.test('ListWorkoutPlansQuerySchema - coerces string limit to number', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse({
    limit: '25',
  });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data.limit, 25);
  }
});

Deno.test('ListWorkoutPlansQuerySchema - coerces string offset to number', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse({
    offset: '10',
  });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data.offset, 10);
  }
});

Deno.test('ListWorkoutPlansQuerySchema - rejects negative limit', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    invalidListPlansQuery.limitNegative,
  );
  assertEquals(result.success, false);
});

Deno.test('ListWorkoutPlansQuerySchema - rejects limit too large', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    invalidListPlansQuery.limitTooLarge,
  );
  assertEquals(result.success, false);
});

Deno.test('ListWorkoutPlansQuerySchema - rejects negative offset', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    invalidListPlansQuery.offsetNegative,
  );
  assertEquals(result.success, false);
});

Deno.test('ListWorkoutPlansQuerySchema - rejects non-integer limit', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse(
    invalidListPlansQuery.limitNotInteger,
  );
  assertEquals(result.success, false);
});

Deno.test('ListWorkoutPlansQuerySchema - categoryId is optional', () => {
  const result = ListWorkoutPlansQuerySchema.safeParse({
    limit: 10,
    offset: 0,
  });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data.categoryId, undefined);
  }
});

// ============================================================================
// Edge Cases and Special Validation
// ============================================================================

Deno.test('Validation - handles leap year dates correctly', () => {
  const leapYearDate = {
    categoryId: 'cat-123',
    startDate: getFutureDateString(60), // Leap year
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  };
  const result = CreateWorkoutPlanRequestSchema.safeParse(leapYearDate);
  assertEquals(result.success, true);
});

Deno.test('Validation - rejects invalid leap year dates', () => {
  const invalidLeapDate = {
    categoryId: 'cat-123',
    startDate: '2025-02-29', // Not a leap year
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  };
  const result = CreateWorkoutPlanRequestSchema.safeParse(invalidLeapDate);
  assertEquals(result.success, false);
});

Deno.test('Validation - validates all days of week selection', () => {
  const allDays = {
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    selectedExerciseIds: ['ex-456'],
  };
  const result = CreateWorkoutPlanRequestSchema.safeParse(allDays);
  assertEquals(result.success, true);
});

Deno.test('Validation - validates single day selection', () => {
  const singleDay = {
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [3],
    selectedExerciseIds: ['ex-456'],
  };
  const result = CreateWorkoutPlanRequestSchema.safeParse(singleDay);
  assertEquals(result.success, true);
});

Deno.test('Validation - validates single exercise selection', () => {
  const singleExercise = {
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: ['ex-456'],
  };
  const result = CreateWorkoutPlanRequestSchema.safeParse(singleExercise);
  assertEquals(result.success, true);
});

Deno.test('Validation - validates many exercises selection', () => {
  const manyExercises = {
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 8,
    selectedDays: [1, 3, 5],
    selectedExerciseIds: Array.from({ length: 20 }, (_, i) => `ex-${i + 1}`),
  };
  const result = CreateWorkoutPlanRequestSchema.safeParse(manyExercises);
  assertEquals(result.success, true);
});

Deno.test('Validation - handles boundary values for weeks', () => {
  const minWeeks = CreateWorkoutPlanRequestSchema.safeParse({
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 1,
    selectedDays: [1],
    selectedExerciseIds: ['ex-456'],
  });
  assertEquals(minWeeks.success, true);
  //
  const maxWeeks = CreateWorkoutPlanRequestSchema.safeParse({
    categoryId: 'cat-123',
    startDate: getFutureDateString(7),
    numberOfWeeks: 12,
    selectedDays: [1],
    selectedExerciseIds: ['ex-456'],
  });
  assertEquals(maxWeeks.success, true);
});

Deno.test('Validation - provides helpful error messages', () => {
  const result = CreateWorkoutPlanRequestSchema.safeParse(
    invalidCreatePlanRequest.weeksTooLarge,
  );
  assertEquals(result.success, false);
  if (!result.success) {
    // Should have helpful error messages
    const errors = result.error.errors;
    assertEquals(errors.length > 0, true);
    assertEquals(typeof errors[0].message, 'string');
  }
});
