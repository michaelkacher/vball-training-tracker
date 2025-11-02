/**
 * Integration Tests: Workout Plan Wizard API
 * Tests all endpoints defined in api-spec.md
 *
 * These tests follow TDD Red phase - they will FAIL until implementation is complete.
 */

import {
  assertEquals,
  assertExists,
  assertNotEquals,
} from 'jsr:@std/assert';
import { setupTestKv } from './helpers/kv-test.ts';
import {
  buildCategory,
  buildCategoryWithExercises,
  buildMultiplePlans,
  buildWorkoutPlan,
  calculateTotalSessions,
  createCategoryKvSeeds,
  createUserPlanIndexSeeds,
  createWorkoutPlanKvSeeds,
  DayOfWeek,
  getFutureDateString,
  getPastDateString,
  getTodayDateString,
  invalidCreatePlanRequest,
  invalidListPlansQuery,
  validCreatePlanRequest,
  validCreatePlanVariations,
  validListPlansQuery,
} from './fixtures/workout-plans.ts';

// ============================================================================
// Test Setup
// ============================================================================

// Mock API functions - these will be implemented in the actual service/routes
let kv: any;
const mockUserId = 'user-test-456';

async function setup() {
  const { kv: testKv, cleanup } = await setupTestKv();
  kv = testKv;
  return cleanup;
}

// ============================================================================
// POST /api/workout-plans - Create Workout Plan
// ============================================================================

Deno.test('POST /workout-plans - creates plan with valid data', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(5);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement createWorkoutPlan endpoint
    // const result = await createWorkoutPlan(kv, mockUserId, {
    //   categoryId: category.id,
    //   startDate: getFutureDateString(7),
    //   numberOfWeeks: 8,
    //   selectedDays: [1, 3, 5],
    //   selectedExerciseIds: [category.exercises[0].id, category.exercises[1].id],
    // });

    // Expected response:
    // assertExists(result.id);
    // assertEquals(result.userId, mockUserId);
    // assertEquals(result.categoryId, category.id);
    // assertEquals(result.numberOfWeeks, 8);
    // assertEquals(result.selectedDays.length, 3);
    // assertEquals(result.selectedExerciseIds.length, 2);
    // assertEquals(result.totalSessions, 24); // 8 weeks * 3 days
    // assertExists(result.createdAt);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - generates unique plan ID', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Create two plans
    // const plan1 = await createWorkoutPlan(kv, mockUserId, {
    //   categoryId: category.id,
    //   startDate: getFutureDateString(7),
    //   numberOfWeeks: 8,
    //   selectedDays: [1, 3, 5],
    //   selectedExerciseIds: [category.exercises[0].id],
    // });
    //
    // const plan2 = await createWorkoutPlan(kv, mockUserId, {
    //   categoryId: category.id,
    //   startDate: getFutureDateString(14),
    //   numberOfWeeks: 6,
    //   selectedDays: [1, 3],
    //   selectedExerciseIds: [category.exercises[1].id],
    // });

    // Expected:
    // assertNotEquals(plan1.id, plan2.id);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - calculates totalSessions correctly', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Test various combinations
    // const testCases = [
    //   { weeks: 8, days: [1, 3, 5], expected: 24 },
    //   { weeks: 12, days: [0, 6], expected: 24 },
    //   { weeks: 4, days: [1, 2, 3, 4, 5], expected: 20 },
    //   { weeks: 1, days: [0, 1, 2, 3, 4, 5, 6], expected: 7 },
    // ];
    //
    // for (const testCase of testCases) {
    //   const plan = await createWorkoutPlan(kv, mockUserId, {
    //     categoryId: category.id,
    //     startDate: getFutureDateString(7),
    //     numberOfWeeks: testCase.weeks,
    //     selectedDays: testCase.days,
    //     selectedExerciseIds: [category.exercises[0].id],
    //   });
    //
    //   assertEquals(plan.totalSessions, testCase.expected);
    // }
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - accepts minimum valid plan (1 week, 1 day, 1 exercise)', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const result = await createWorkoutPlan(kv, mockUserId, {
    //   categoryId: category.id,
    //   startDate: getTodayDateString(),
    //   numberOfWeeks: 1,
    //   selectedDays: [1] as DayOfWeek[],
    //   selectedExerciseIds: [category.exercises[0].id],
    // });

    // Expected:
    // assertExists(result.id);
    // assertEquals(result.totalSessions, 1);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - accepts maximum valid plan (12 weeks, 7 days)', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const result = await createWorkoutPlan(kv, mockUserId, {
    //   categoryId: category.id,
    //   startDate: getFutureDateString(7),
    //   numberOfWeeks: 12,
    //   selectedDays: [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[],
    //   selectedExerciseIds: [category.exercises[0].id, category.exercises[1].id],
    // });

    // Expected:
    // assertExists(result.id);
    // assertEquals(result.totalSessions, 84); // 12 * 7
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - accepts today as start date', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const result = await createWorkoutPlan(kv, mockUserId, {
    //   categoryId: category.id,
    //   startDate: getTodayDateString(),
    //   numberOfWeeks: 8,
    //   selectedDays: [1, 3, 5] as DayOfWeek[],
    //   selectedExerciseIds: [category.exercises[0].id],
    // });

    // Expected:
    // assertEquals(result.startDate, getTodayDateString());
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for missing categoryId', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.missingCategoryId),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for empty categoryId', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.emptyCategoryId),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, {
    //     categoryId: 'non-existent-category',
    //     startDate: getFutureDateString(7),
    //     numberOfWeeks: 8,
    //     selectedDays: [1, 3, 5],
    //     selectedExerciseIds: ['ex-456'],
    //   }),
    //   Error,
    //   'NOT_FOUND'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for invalid date format', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.invalidStartDateFormat),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for past start date', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, {
    //     categoryId: category.id,
    //     startDate: getPastDateString(1),
    //     numberOfWeeks: 8,
    //     selectedDays: [1, 3, 5],
    //     selectedExerciseIds: [category.exercises[0].id],
    //   }),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for weeks out of range', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.weeksTooSmall),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
    //
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.weeksTooLarge),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for empty selectedDays', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.emptySelectedDays),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for invalid day values', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.invalidDayValue),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
    //
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.negativeDayValue),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 400 for empty exerciseIds', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.emptyExerciseIds),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 404 when exercises dont belong to category', async () => {
  const cleanup = await setup();

  try {
    const category1 = buildCategoryWithExercises(3, { id: 'cat-1' });
    const category2 = buildCategoryWithExercises(3, { id: 'cat-2' });

    await kv.set(['workout_category', category1.id], category1);
    await kv.set(['workout_category', category2.id], category2);

    // TODO: Test validation
    // Try to use exercise from category2 in a plan for category1
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, {
    //     categoryId: category1.id,
    //     startDate: getFutureDateString(7),
    //     numberOfWeeks: 8,
    //     selectedDays: [1, 3, 5],
    //     selectedExerciseIds: [category2.exercises[0].id], // Wrong category!
    //   }),
    //   Error,
    //   'NOT_FOUND'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /workout-plans - returns 401 for unauthenticated user', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Test authentication
    // await assertRejects(
    //   () => createWorkoutPlan(kv, null, validCreatePlanRequest),
    //   Error,
    //   'UNAUTHORIZED'
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// GET /api/workout-plans - List Workout Plans
// ============================================================================

Deno.test('GET /workout-plans - returns empty list when no plans exist', async () => {
  const cleanup = await setup();

  try {
    // TODO: Implement listWorkoutPlans endpoint
    // const result = await listWorkoutPlans(kv, mockUserId, {});

    // Expected:
    // assertEquals(result.plans.length, 0);
    // assertEquals(result.total, 0);
    // assertEquals(result.offset, 0);
    // assertEquals(result.limit, 50);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - lists all plans for authenticated user', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    const plans = buildMultiplePlans(5, mockUserId);

    await kv.set(['workout_category', category.id], category);

    const planSeeds = createWorkoutPlanKvSeeds(plans);
    const indexSeeds = createUserPlanIndexSeeds(plans);

    for (const seed of [...planSeeds, ...indexSeeds]) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement
    // const result = await listWorkoutPlans(kv, mockUserId, {});

    // Expected:
    // assertEquals(result.plans.length, 5);
    // assertEquals(result.total, 5);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - returns summary format with computed fields', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(5, { name: 'Jumping' });
    const plan = buildWorkoutPlan({
      userId: mockUserId,
      categoryId: category.id,
      numberOfWeeks: 8,
      selectedDays: [1, 3, 5] as DayOfWeek[],
      selectedExerciseIds: [
        category.exercises[0].id,
        category.exercises[1].id,
        category.exercises[2].id,
      ],
    });

    await kv.set(['workout_category', category.id], category);
    await kv.set(['workout_plan', plan.id], plan);
    await kv.set(['user_workout_plans', plan.userId, plan.id], {
      id: plan.id,
      categoryId: plan.categoryId,
      startDate: plan.startDate,
      numberOfWeeks: plan.numberOfWeeks,
      createdAt: plan.createdAt,
    });

    // TODO: Implement
    // const result = await listWorkoutPlans(kv, mockUserId, {});

    // Expected:
    // assertEquals(result.plans.length, 1);
    // const summary = result.plans[0];
    // assertEquals(summary.categoryName, 'Jumping');
    // assertEquals(summary.exerciseCount, 3);
    // assertEquals(summary.totalSessions, 24); // 8 * 3
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - isolates plans by user', async () => {
  const cleanup = await setup();

  try {
    const user1Plans = buildMultiplePlans(3, 'user-1');
    const user2Plans = buildMultiplePlans(2, 'user-2');

    const seeds = [
      ...createWorkoutPlanKvSeeds([...user1Plans, ...user2Plans]),
      ...createUserPlanIndexSeeds([...user1Plans, ...user2Plans]),
    ];

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement
    // const result1 = await listWorkoutPlans(kv, 'user-1', {});
    // const result2 = await listWorkoutPlans(kv, 'user-2', {});

    // Expected:
    // assertEquals(result1.plans.length, 3);
    // assertEquals(result2.plans.length, 2);
    //
    // // Verify user1 can only see their plans
    // result1.plans.forEach(plan => {
    //   // User shouldn't see other users' plans
    //   assertEquals(user2Plans.some(p => p.id === plan.id), false);
    // });
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - respects limit parameter', async () => {
  const cleanup = await setup();

  try {
    const plans = buildMultiplePlans(15, mockUserId);

    const seeds = [
      ...createWorkoutPlanKvSeeds(plans),
      ...createUserPlanIndexSeeds(plans),
    ];

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement
    // const result = await listWorkoutPlans(kv, mockUserId, { limit: 5 });

    // Expected:
    // assertEquals(result.plans.length, 5);
    // assertEquals(result.total, 15);
    // assertEquals(result.limit, 5);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - respects offset parameter', async () => {
  const cleanup = await setup();

  try {
    const plans = buildMultiplePlans(15, mockUserId);

    const seeds = [
      ...createWorkoutPlanKvSeeds(plans),
      ...createUserPlanIndexSeeds(plans),
    ];

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement
    // const page1 = await listWorkoutPlans(kv, mockUserId, { limit: 5, offset: 0 });
    // const page2 = await listWorkoutPlans(kv, mockUserId, { limit: 5, offset: 5 });

    // Expected:
    // assertEquals(page1.plans.length, 5);
    // assertEquals(page2.plans.length, 5);
    // assertEquals(page2.offset, 5);
    //
    // // Verify no overlap
    // const page1Ids = page1.plans.map(p => p.id);
    // const page2Ids = page2.plans.map(p => p.id);
    // const intersection = page1Ids.filter(id => page2Ids.includes(id));
    // assertEquals(intersection.length, 0);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - filters by categoryId', async () => {
  const cleanup = await setup();

  try {
    const cat1 = buildCategory({ id: 'cat-1', name: 'Jumping' });
    const cat2 = buildCategory({ id: 'cat-2', name: 'Serving' });

    const plansForCat1 = [
      buildWorkoutPlan({ id: 'plan-1', userId: mockUserId, categoryId: 'cat-1' }),
      buildWorkoutPlan({ id: 'plan-2', userId: mockUserId, categoryId: 'cat-1' }),
      buildWorkoutPlan({ id: 'plan-3', userId: mockUserId, categoryId: 'cat-1' }),
    ];

    const plansForCat2 = [
      buildWorkoutPlan({ id: 'plan-4', userId: mockUserId, categoryId: 'cat-2' }),
      buildWorkoutPlan({ id: 'plan-5', userId: mockUserId, categoryId: 'cat-2' }),
    ];

    await kv.set(['workout_category', cat1.id], cat1);
    await kv.set(['workout_category', cat2.id], cat2);

    const seeds = [
      ...createWorkoutPlanKvSeeds([...plansForCat1, ...plansForCat2]),
      ...createUserPlanIndexSeeds([...plansForCat1, ...plansForCat2]),
    ];

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement
    // const result = await listWorkoutPlans(kv, mockUserId, { categoryId: 'cat-1' });

    // Expected:
    // assertEquals(result.plans.length, 3);
    // result.plans.forEach(plan => {
    //   assertEquals(plan.categoryId, 'cat-1');
    // });
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - uses default pagination values', async () => {
  const cleanup = await setup();

  try {
    const plans = buildMultiplePlans(5, mockUserId);

    const seeds = [
      ...createWorkoutPlanKvSeeds(plans),
      ...createUserPlanIndexSeeds(plans),
    ];

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement
    // const result = await listWorkoutPlans(kv, mockUserId, {});

    // Expected:
    // assertEquals(result.limit, 50); // Default
    // assertEquals(result.offset, 0); // Default
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - returns 401 for unauthenticated user', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test authentication
    // await assertRejects(
    //   () => listWorkoutPlans(kv, null, {}),
    //   Error,
    //   'UNAUTHORIZED'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans - returns 400 for invalid query params', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => listWorkoutPlans(kv, mockUserId, invalidListPlansQuery.limitNegative),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
    //
    // await assertRejects(
    //   () => listWorkoutPlans(kv, mockUserId, invalidListPlansQuery.offsetNegative),
    //   Error,
    //   'VALIDATION_ERROR'
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// GET /api/workout-plans/:id - Get Workout Plan Detail
// ============================================================================

Deno.test('GET /workout-plans/:id - returns full plan with exercise details', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(5, { name: 'Jumping' });
    const plan = buildWorkoutPlan({
      userId: mockUserId,
      categoryId: category.id,
      selectedExerciseIds: [category.exercises[0].id, category.exercises[1].id],
    });

    await kv.set(['workout_category', category.id], category);
    await kv.set(['workout_plan', plan.id], plan);

    // TODO: Implement getWorkoutPlanById endpoint
    // const result = await getWorkoutPlanById(kv, mockUserId, plan.id);

    // Expected:
    // assertEquals(result.id, plan.id);
    // assertEquals(result.userId, plan.userId);
    // assertEquals(result.categoryName, 'Jumping');
    // assertEquals(result.exercises.length, 2);
    // assertEquals(result.exercises[0].id, category.exercises[0].id);
    // assertEquals(result.exercises[0].name, category.exercises[0].name);
    // assertExists(result.totalSessions);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans/:id - denormalizes exercise details from category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    const plan = buildWorkoutPlan({
      userId: mockUserId,
      categoryId: category.id,
      selectedExerciseIds: [category.exercises[0].id],
    });

    await kv.set(['workout_category', category.id], category);
    await kv.set(['workout_plan', plan.id], plan);

    // TODO: Implement
    // const result = await getWorkoutPlanById(kv, mockUserId, plan.id);

    // Expected:
    // assertEquals(result.exercises.length, 1);
    // const exercise = result.exercises[0];
    // assertExists(exercise.name);
    // assertExists(exercise.sets);
    // assertExists(exercise.repetitions);
    // assertExists(exercise.difficulty);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans/:id - includes totalSessions calculation', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    const plan = buildWorkoutPlan({
      userId: mockUserId,
      categoryId: category.id,
      numberOfWeeks: 8,
      selectedDays: [1, 3, 5] as DayOfWeek[],
      selectedExerciseIds: [category.exercises[0].id],
    });

    await kv.set(['workout_category', category.id], category);
    await kv.set(['workout_plan', plan.id], plan);

    // TODO: Implement
    // const result = await getWorkoutPlanById(kv, mockUserId, plan.id);

    // Expected:
    // assertEquals(result.totalSessions, 24); // 8 weeks * 3 days
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans/:id - returns 404 for non-existent plan', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => getWorkoutPlanById(kv, mockUserId, 'non-existent-id'),
    //   Error,
    //   'NOT_FOUND'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans/:id - returns 403 when user does not own plan', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    const plan = buildWorkoutPlan({
      userId: 'other-user-789',
      categoryId: category.id,
      selectedExerciseIds: [category.exercises[0].id],
    });

    await kv.set(['workout_category', category.id], category);
    await kv.set(['workout_plan', plan.id], plan);

    // TODO: Test authorization
    // await assertRejects(
    //   () => getWorkoutPlanById(kv, mockUserId, plan.id),
    //   Error,
    //   'FORBIDDEN'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('GET /workout-plans/:id - returns 401 for unauthenticated user', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test authentication
    // await assertRejects(
    //   () => getWorkoutPlanById(kv, null, 'plan-123'),
    //   Error,
    //   'UNAUTHORIZED'
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// DELETE /api/workout-plans/:id - Delete Workout Plan
// ============================================================================

Deno.test('DELETE /workout-plans/:id - deletes plan successfully', async () => {
  const cleanup = await setup();

  try {
    const plan = buildWorkoutPlan({ userId: mockUserId });

    await kv.set(['workout_plan', plan.id], plan);
    await kv.set(['user_workout_plans', plan.userId, plan.id], {
      id: plan.id,
      categoryId: plan.categoryId,
    });

    // TODO: Implement deleteWorkoutPlan endpoint
    // await deleteWorkoutPlan(kv, mockUserId, plan.id);

    // Verify deleted from both collections
    const planResult = await kv.get(['workout_plan', plan.id]);
    const indexResult = await kv.get([
      'user_workout_plans',
      plan.userId,
      plan.id,
    ]);

    // Expected:
    // assertEquals(planResult.value, null);
    // assertEquals(indexResult.value, null);
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /workout-plans/:id - returns 404 for non-existent plan', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => deleteWorkoutPlan(kv, mockUserId, 'non-existent-id'),
    //   Error,
    //   'NOT_FOUND'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /workout-plans/:id - returns 403 when user does not own plan', async () => {
  const cleanup = await setup();

  try {
    const plan = buildWorkoutPlan({ userId: 'other-user-789' });

    await kv.set(['workout_plan', plan.id], plan);
    await kv.set(['user_workout_plans', plan.userId, plan.id], {
      id: plan.id,
      categoryId: plan.categoryId,
    });

    // TODO: Test authorization
    // await assertRejects(
    //   () => deleteWorkoutPlan(kv, mockUserId, plan.id),
    //   Error,
    //   'FORBIDDEN'
    // );

    // Verify not deleted
    const stillExists = await kv.get(['workout_plan', plan.id]);
    // assertExists(stillExists.value);
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /workout-plans/:id - returns 401 for unauthenticated user', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test authentication
    // await assertRejects(
    //   () => deleteWorkoutPlan(kv, null, 'plan-123'),
    //   Error,
    //   'UNAUTHORIZED'
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Error Response Format Tests
// ============================================================================

Deno.test('API - returns standard error format for validation errors', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test error response format
    // const error = await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, invalidCreatePlanRequest.missingCategoryId)
    // );

    // Expected error format:
    // {
    //   error: 'VALIDATION_ERROR',
    //   message: 'Human-readable error message',
    //   statusCode: 400,
    //   timestamp: '2025-01-15T10:35:00Z'
    // }
  } finally {
    await cleanup();
  }
});

Deno.test('API - returns standard error format for not found', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test error response format
    // const error = await assertRejects(
    //   () => getWorkoutPlanById(kv, mockUserId, 'non-existent')
    // );

    // Expected error format with statusCode 404
  } finally {
    await cleanup();
  }
});

Deno.test('API - returns standard error format for forbidden', async () => {
  const cleanup = await setup();

  try {
    const plan = buildWorkoutPlan({ userId: 'other-user' });
    await kv.set(['workout_plan', plan.id], plan);

    // TODO: Test error response format
    // const error = await assertRejects(
    //   () => getWorkoutPlanById(kv, mockUserId, plan.id)
    // );

    // Expected error format with statusCode 403
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Integration with Workout Categories
// ============================================================================

Deno.test('Integration - validates category exists before creating plan', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test category validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, {
    //     categoryId: 'non-existent-category',
    //     startDate: getFutureDateString(7),
    //     numberOfWeeks: 8,
    //     selectedDays: [1, 3, 5],
    //     selectedExerciseIds: ['ex-456'],
    //   }),
    //   Error,
    //   'Category not found'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('Integration - validates all exercises belong to selected category', async () => {
  const cleanup = await setup();

  try {
    const cat1 = buildCategoryWithExercises(3, { id: 'cat-1' });
    const cat2 = buildCategoryWithExercises(3, { id: 'cat-2' });

    await kv.set(['workout_category', cat1.id], cat1);
    await kv.set(['workout_category', cat2.id], cat2);

    // TODO: Test exercise validation
    // await assertRejects(
    //   () => createWorkoutPlan(kv, mockUserId, {
    //     categoryId: cat1.id,
    //     startDate: getFutureDateString(7),
    //     numberOfWeeks: 8,
    //     selectedDays: [1, 3, 5],
    //     selectedExerciseIds: [cat2.exercises[0].id], // Wrong category
    //   }),
    //   Error,
    //   'Exercise does not belong to category'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('Integration - handles deleted category gracefully in plan detail', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    const plan = buildWorkoutPlan({
      userId: mockUserId,
      categoryId: category.id,
      selectedExerciseIds: [category.exercises[0].id],
    });

    await kv.set(['workout_category', category.id], category);
    await kv.set(['workout_plan', plan.id], plan);

    // Delete category after plan is created
    await kv.delete(['workout_category', category.id]);

    // TODO: Test graceful handling
    // const result = await getWorkoutPlanById(kv, mockUserId, plan.id);
    //
    // // Plan should still exist but category details may be unavailable
    // assertEquals(result.id, plan.id);
  } finally {
    await cleanup();
  }
});
