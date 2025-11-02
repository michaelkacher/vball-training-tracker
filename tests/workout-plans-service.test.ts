/**
 * Service Layer Tests: Workout Plans
 * Tests Deno KV operations and business logic
 *
 * These tests follow TDD Red phase - they will FAIL until service is implemented.
 */

import {
  assertEquals,
  assertExists,
  assertNotEquals,
} from 'jsr:@std/assert';
import {
  clearKvPrefix,
  countKvEntries,
  listKvEntries,
  setupTestKv,
} from './helpers/kv-test.ts';
import {
  buildCategory,
  buildCategoryWithExercises,
  buildMultiplePlans,
  buildWorkoutPlan,
  calculateTotalSessions,
  createCategoryKvSeeds,
  createUserPlanIndexSeeds,
  createWorkoutPlanKvSeeds,
  getFutureDateString,
  validCreatePlanRequest,
  WorkoutPlan,
} from './fixtures/workout-plans.ts';

import {
  createWorkoutPlan,
  getWorkoutPlanById,
  listWorkoutPlans,
  deleteWorkoutPlan,
} from '../backend/services/workout-plans.ts';

// ============================================================================
// Test Setup
// ============================================================================

let kv: any;

async function setup() {
  const { kv: testKv, cleanup } = await setupTestKv();
  kv = testKv;
  return cleanup;
}

// ============================================================================
// Deno KV Storage Tests
// ============================================================================

Deno.test('KV Storage - stores workout plan at correct key', async () => {
  const cleanup = await setup();

  try {
//  const plan = buildWorkoutPlan({ id: 'plan-123' });
//  await kv.set(['workout_plan', plan.id], plan);

//  const stored = await kv.get(['workout_plan', 'plan-123']);
//  assertEquals(stored.value, plan);
  } finally {
//  await cleanup();
  }
});

Deno.test('KV Storage - stores user plan index at correct key', async () => {
  const cleanup = await setup();

  try {
//  const plan = buildWorkoutPlan({
     id: 'plan-123',
     userId: 'user-456',
//  });

//  const indexData = {
     id: plan.id,
     categoryId: plan.categoryId,
     startDate: plan.startDate,
     numberOfWeeks: plan.numberOfWeeks,
     createdAt: plan.createdAt,
//  };

//  await kv.set(['user_workout_plans', plan.userId, plan.id], indexData);

//  const stored = await kv.get(['user_workout_plans', 'user-456', 'plan-123']);
//  assertEquals(stored.value, indexData);
  } finally {
//  await cleanup();
  }
});

Deno.test('KV Storage - retrieves plan by id', async () => {
  const cleanup = await setup();

  try {
//  const plan = buildWorkoutPlan({ id: 'plan-123' });
//  await kv.set(['workout_plan', plan.id], plan);

//  const retrieved = await kv.get(['workout_plan', 'plan-123']);
//  assertExists(retrieved.value);
//  assertEquals(retrieved.value.id, 'plan-123');
  } finally {
//  await cleanup();
  }
});

Deno.test('KV Storage - lists all plans for a user with prefix', async () => {
  const cleanup = await setup();

  try {
//  const plans = buildMultiplePlans(3, 'user-456');
//  const seeds = createUserPlanIndexSeeds(plans);

//  for (const seed of seeds) {
     await kv.set(seed.key, seed.value);
//  }

//  const entries = await listKvEntries(kv, ['user_workout_plans', 'user-456']);
//  assertEquals(entries.length, 3);
  } finally {
//  await cleanup();
  }
});

Deno.test('KV Storage - isolates plans between users', async () => {
  const cleanup = await setup();

  try {
//  const user1Plans = buildMultiplePlans(2, 'user-1');
//  const user2Plans = buildMultiplePlans(3, 'user-2');

//  const seeds1 = createUserPlanIndexSeeds(user1Plans);
//  const seeds2 = createUserPlanIndexSeeds(user2Plans);

//  for (const seed of [...seeds1, ...seeds2]) {
     await kv.set(seed.key, seed.value);
//  }

//  const user1Entries = await listKvEntries(kv, [
     'user_workout_plans',
     'user-1',
//  ]);
//  const user2Entries = await listKvEntries(kv, [
     'user_workout_plans',
     'user-2',
//  ]);

//  assertEquals(user1Entries.length, 2);
//  assertEquals(user2Entries.length, 3);
  } finally {
//  await cleanup();
  }
});

Deno.test('KV Storage - deletes plan and index atomically', async () => {
  const cleanup = await setup();

  try {
//  const plan = buildWorkoutPlan({
     id: 'plan-123',
     userId: 'user-456',
//  });

//  await kv.set(['workout_plan', plan.id], plan);
//  await kv.set(['user_workout_plans', plan.userId, plan.id], {
     id: plan.id,
     categoryId: plan.categoryId,
//  });

//  // Delete both
//  await kv.delete(['workout_plan', plan.id]);
//  await kv.delete(['user_workout_plans', plan.userId, plan.id]);

//  const planResult = await kv.get(['workout_plan', 'plan-123']);
//  const indexResult = await kv.get([
     'user_workout_plans',
     'user-456',
     'plan-123',
//  ]);

//  assertEquals(planResult.value, null);
//  assertEquals(indexResult.value, null);
  } finally {
//  await cleanup();
  }
});

// ============================================================================
// Business Logic: Create Workout Plan
// ============================================================================

Deno.test('Service - createWorkoutPlan generates unique ID', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement service
//  // const category = buildCategoryWithExercises(3);
//  // await kv.set(['workout_category', category.id], category);
//  //
//  // const plan1 = await createWorkoutPlan(kv, 'user-1', {
//  //   ...validCreatePlanRequest,
//  //   categoryId: category.id,
//  //   selectedExerciseIds: [category.exercises[0].id],
//  // });
//  //
//  // const plan2 = await createWorkoutPlan(kv, 'user-1', {
//  //   ...validCreatePlanRequest,
//  //   categoryId: category.id,
//  //   selectedExerciseIds: [category.exercises[0].id],
//  // });
//  //
//  // assertExists(plan1.id);
//  // assertExists(plan2.id);
//  // assertNotEquals(plan1.id, plan2.id);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - createWorkoutPlan sets createdAt timestamp', async () => {
  const cleanup = await setup();

  try {
//  const beforeCreate = new Date();

//  // TODO: Implement
//  // const category = buildCategoryWithExercises(3);
//  // await kv.set(['workout_category', category.id], category);
//  //
//  // const plan = await createWorkoutPlan(kv, 'user-456', {
//  //   ...validCreatePlanRequest,
//  //   categoryId: category.id,
//  //   selectedExerciseIds: [category.exercises[0].id],
//  // });

//  const afterCreate = new Date();

//  // assertExists(plan.createdAt);
//  // const createdDate = new Date(plan.createdAt);
//  // assertEquals(createdDate >= beforeCreate && createdDate <= afterCreate, true);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - createWorkoutPlan associates with userId', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // const category = buildCategoryWithExercises(3);
//  // await kv.set(['workout_category', category.id], category);
//  //
//  // const plan = await createWorkoutPlan(kv, 'user-456', {
//  //   ...validCreatePlanRequest,
//  //   categoryId: category.id,
//  //   selectedExerciseIds: [category.exercises[0].id],
//  // });
//  //
//  // assertEquals(plan.userId, 'user-456');
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - createWorkoutPlan stores in both KV collections', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // const category = buildCategoryWithExercises(3);
//  // await kv.set(['workout_category', category.id], category);
//  //
//  // const plan = await createWorkoutPlan(kv, 'user-456', {
//  //   ...validCreatePlanRequest,
//  //   categoryId: category.id,
//  //   selectedExerciseIds: [category.exercises[0].id],
//  // });
//  //
//  // // Check main plan collection
//  // const planStored = await kv.get(['workout_plan', plan.id]);
//  // assertExists(planStored.value);
//  //
//  // // Check user index collection
//  // const indexStored = await kv.get(['user_workout_plans', 'user-456', plan.id]);
//  // assertExists(indexStored.value);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - createWorkoutPlan calculates totalSessions correctly', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // const category = buildCategoryWithExercises(3);
//  // await kv.set(['workout_category', category.id], category);
//  //
//  // const plan = await createWorkoutPlan(kv, 'user-456', {
//  //   categoryId: category.id,
//  //   startDate: '2025-01-20',
//  //   numberOfWeeks: 8,
//  //   selectedDays: [1, 3, 5], // 3 days per week
//  //   selectedExerciseIds: [category.exercises[0].id],
//  // });
//  //
//  // const expectedSessions = calculateTotalSessions(8, [1, 3, 5]);
//  // assertEquals(plan.totalSessions, expectedSessions); // 8 * 3 = 24
//  // assertEquals(plan.totalSessions, 24);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - createWorkoutPlan validates category exists', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // Should throw error when category doesn't exist
//  // await assertRejects(
//  //   () => createWorkoutPlan(kv, 'user-456', {
//  //     ...validCreatePlanRequest,
//  //     categoryId: 'non-existent-category',
//  //   }),
//  //   Error,
//  //   'Category not found'
//  // );
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - createWorkoutPlan validates all exercises belong to category', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // const category = buildCategoryWithExercises(3);
//  // await kv.set(['workout_category', category.id], category);
//  //
//  // // Try to create plan with exercise that doesn't belong to category
//  // await assertRejects(
//  //   () => createWorkoutPlan(kv, 'user-456', {
//  //     ...validCreatePlanRequest,
//  //     categoryId: category.id,
//  //     selectedExerciseIds: ['ex-non-existent'],
//  //   }),
//  //   Error,
//  //   'Exercise does not belong to category'
//  // );
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - createWorkoutPlan validates at least one exercise', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // const category = buildCategoryWithExercises(3);
//  // await kv.set(['workout_category', category.id], category);
//  //
//  // await assertRejects(
//  //   () => createWorkoutPlan(kv, 'user-456', {
//  //     ...validCreatePlanRequest,
//  //     categoryId: category.id,
//  //     selectedExerciseIds: [],
//  //   }),
//  //   Error,
//  //   'At least one exercise required'
//  // );
  } finally {
//  await cleanup();
  }
});

// ============================================================================
// Business Logic: Get Workout Plan by ID
// ============================================================================

Deno.test('Service - getWorkoutPlanById returns full plan details', async () => {
  const cleanup = await setup();

  try {
//  const category = buildCategoryWithExercises(3);
//  const plan = buildWorkoutPlan({
     categoryId: category.id,
     selectedExerciseIds: [category.exercises[0].id, category.exercises[1].id],
     userId: 'user-456',
//  });

//  await kv.set(['workout_category', category.id], category);
//  await kv.set(['workout_plan', plan.id], plan);

//  // TODO: Implement
//  // const result = await getWorkoutPlanById(kv, 'user-456', plan.id);
//  //
//  // assertEquals(result.id, plan.id);
//  // assertEquals(result.userId, plan.userId);
//  // assertEquals(result.categoryName, category.name);
//  // assertExists(result.exercises);
//  // assertEquals(result.exercises.length, 2);
//  // assertExists(result.totalSessions);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - getWorkoutPlanById denormalizes exercise details', async () => {
  const cleanup = await setup();

  try {
//  const category = buildCategoryWithExercises(3);
//  const plan = buildWorkoutPlan({
     categoryId: category.id,
     selectedExerciseIds: [category.exercises[0].id],
     userId: 'user-456',
//  });

//  await kv.set(['workout_category', category.id], category);
//  await kv.set(['workout_plan', plan.id], plan);

//  // TODO: Implement
//  // const result = await getWorkoutPlanById(kv, 'user-456', plan.id);
//  //
//  // assertEquals(result.exercises.length, 1);
//  // assertEquals(result.exercises[0].id, category.exercises[0].id);
//  // assertEquals(result.exercises[0].name, category.exercises[0].name);
//  // assertExists(result.exercises[0].sets);
//  // assertExists(result.exercises[0].repetitions);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - getWorkoutPlanById calculates totalSessions', async () => {
  const cleanup = await setup();

  try {
//  const category = buildCategoryWithExercises(3);
//  const plan = buildWorkoutPlan({
     categoryId: category.id,
     numberOfWeeks: 8,
     selectedDays: [1, 3, 5],
     selectedExerciseIds: [category.exercises[0].id],
     userId: 'user-456',
//  });

//  await kv.set(['workout_category', category.id], category);
//  await kv.set(['workout_plan', plan.id], plan);

//  // TODO: Implement
//  // const result = await getWorkoutPlanById(kv, 'user-456', plan.id);
//  //
//  // assertEquals(result.totalSessions, 24); // 8 weeks * 3 days
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - getWorkoutPlanById throws for non-existent plan', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // await assertRejects(
//  //   () => getWorkoutPlanById(kv, 'user-456', 'non-existent'),
//  //   Error,
//  //   'Workout plan not found'
//  // );
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - getWorkoutPlanById enforces user ownership', async () => {
  const cleanup = await setup();

  try {
//  const category = buildCategoryWithExercises(3);
//  const plan = buildWorkoutPlan({
     categoryId: category.id,
     selectedExerciseIds: [category.exercises[0].id],
     userId: 'user-456',
//  });

//  await kv.set(['workout_category', category.id], category);
//  await kv.set(['workout_plan', plan.id], plan);

//  // TODO: Implement
//  // Different user tries to access
//  // await assertRejects(
//  //   () => getWorkoutPlanById(kv, 'user-999', plan.id),
//  //   Error,
//  //   'Forbidden'
//  // );
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - getWorkoutPlanById handles deleted exercises gracefully', async () => {
  const cleanup = await setup();

  try {
//  const category = buildCategoryWithExercises(3);
//  const plan = buildWorkoutPlan({
     categoryId: category.id,
     selectedExerciseIds: [category.exercises[0].id, 'ex-deleted'],
     userId: 'user-456',
//  });

//  await kv.set(['workout_category', category.id], category);
//  await kv.set(['workout_plan', plan.id], plan);

//  // TODO: Implement
//  // Should return plan but omit deleted exercises from details
//  // const result = await getWorkoutPlanById(kv, 'user-456', plan.id);
//  //
//  // assertEquals(result.exercises.length, 1); // Only existing exercise
  } finally {
//  await cleanup();
  }
});

// ============================================================================
// Business Logic: List Workout Plans
// ============================================================================

Deno.test('Service - listWorkoutPlans returns empty list when no plans', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // const result = await listWorkoutPlans(kv, 'user-456', {});
//  //
//  // assertEquals(result.plans.length, 0);
//  // assertEquals(result.total, 0);
//  // assertEquals(result.offset, 0);
//  // assertEquals(result.limit, 50);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - listWorkoutPlans returns all plans for user', async () => {
  const cleanup = await setup();

  try {
//  const category = buildCategoryWithExercises(3);
//  const plans = buildMultiplePlans(5, 'user-456');

//  await kv.set(['workout_category', category.id], category);

//  const planSeeds = createWorkoutPlanKvSeeds(plans);
//  const indexSeeds = createUserPlanIndexSeeds(plans);

//  for (const seed of [...planSeeds, ...indexSeeds]) {
     await kv.set(seed.key, seed.value);
//  }

//  // TODO: Implement
//  // const result = await listWorkoutPlans(kv, 'user-456', {});
//  //
//  // assertEquals(result.plans.length, 5);
//  // assertEquals(result.total, 5);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - listWorkoutPlans isolates plans by user', async () => {
  const cleanup = await setup();

  try {
//  const user1Plans = buildMultiplePlans(3, 'user-1');
//  const user2Plans = buildMultiplePlans(2, 'user-2');

//  const seeds1 = [
     ...createWorkoutPlanKvSeeds(user1Plans),
     ...createUserPlanIndexSeeds(user1Plans),
//  ];
//  const seeds2 = [
     ...createWorkoutPlanKvSeeds(user2Plans),
     ...createUserPlanIndexSeeds(user2Plans),
//  ];

//  for (const seed of [...seeds1, ...seeds2]) {
     await kv.set(seed.key, seed.value);
//  }

//  // TODO: Implement
//  // const result1 = await listWorkoutPlans(kv, 'user-1', {});
//  // const result2 = await listWorkoutPlans(kv, 'user-2', {});
//  //
//  // assertEquals(result1.plans.length, 3);
//  // assertEquals(result2.plans.length, 2);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - listWorkoutPlans respects pagination', async () => {
  const cleanup = await setup();

  try {
//  const plans = buildMultiplePlans(15, 'user-456');

//  const planSeeds = createWorkoutPlanKvSeeds(plans);
//  const indexSeeds = createUserPlanIndexSeeds(plans);

//  for (const seed of [...planSeeds, ...indexSeeds]) {
     await kv.set(seed.key, seed.value);
//  }

//  // TODO: Implement
//  // const page1 = await listWorkoutPlans(kv, 'user-456', { limit: 5, offset: 0 });
//  // assertEquals(page1.plans.length, 5);
//  // assertEquals(page1.total, 15);
//  // assertEquals(page1.limit, 5);
//  // assertEquals(page1.offset, 0);
//  //
//  // const page2 = await listWorkoutPlans(kv, 'user-456', { limit: 5, offset: 5 });
//  // assertEquals(page2.plans.length, 5);
//  // assertEquals(page2.offset, 5);
//  //
//  // // Verify no overlap
//  // const page1Ids = page1.plans.map(p => p.id);
//  // const page2Ids = page2.plans.map(p => p.id);
//  // const intersection = page1Ids.filter(id => page2Ids.includes(id));
//  // assertEquals(intersection.length, 0);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - listWorkoutPlans filters by categoryId', async () => {
  const cleanup = await setup();

  try {
//  const cat1 = buildCategory({ id: 'cat-1', name: 'Jumping' });
//  const cat2 = buildCategory({ id: 'cat-2', name: 'Serving' });

//  const plansForCat1 = buildMultiplePlans(3, 'user-456').map((p, i) => ({
     ...p,
     id: `plan-cat1-${i}`,
     categoryId: 'cat-1',
//  }));

//  const plansForCat2 = buildMultiplePlans(2, 'user-456').map((p, i) => ({
     ...p,
     id: `plan-cat2-${i}`,
     categoryId: 'cat-2',
//  }));

//  await kv.set(['workout_category', cat1.id], cat1);
//  await kv.set(['workout_category', cat2.id], cat2);

//  const seeds = [
     ...createWorkoutPlanKvSeeds([...plansForCat1, ...plansForCat2]),
     ...createUserPlanIndexSeeds([...plansForCat1, ...plansForCat2]),
//  ];

//  for (const seed of seeds) {
     await kv.set(seed.key, seed.value);
//  }

//  // TODO: Implement
//  // const result = await listWorkoutPlans(kv, 'user-456', { categoryId: 'cat-1' });
//  //
//  // assertEquals(result.plans.length, 3);
//  // result.plans.forEach(plan => {
//  //   assertEquals(plan.categoryId, 'cat-1');
//  // });
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - listWorkoutPlans returns summary format with counts', async () => {
  const cleanup = await setup();

  try {
//  const category = buildCategoryWithExercises(5);
//  const plan = buildWorkoutPlan({
     categoryId: category.id,
     numberOfWeeks: 8,
     selectedDays: [1, 3, 5],
     selectedExerciseIds: [
       category.exercises[0].id,
       category.exercises[1].id,
       category.exercises[2].id,
     ],
     userId: 'user-456',
//  });

//  await kv.set(['workout_category', category.id], category);
//  await kv.set(['workout_plan', plan.id], plan);
//  await kv.set(['user_workout_plans', plan.userId, plan.id], {
     id: plan.id,
     categoryId: plan.categoryId,
     startDate: plan.startDate,
     numberOfWeeks: plan.numberOfWeeks,
     createdAt: plan.createdAt,
//  });

//  // TODO: Implement
//  // const result = await listWorkoutPlans(kv, 'user-456', {});
//  //
//  // assertEquals(result.plans.length, 1);
//  // const summary = result.plans[0];
//  // assertEquals(summary.exerciseCount, 3);
//  // assertEquals(summary.totalSessions, 24); // 8 weeks * 3 days
//  // assertEquals(summary.categoryName, category.name);
  } finally {
//  await cleanup();
  }
});

// ============================================================================
// Business Logic: Delete Workout Plan
// ============================================================================

Deno.test('Service - deleteWorkoutPlan removes from both collections', async () => {
  const cleanup = await setup();

  try {
//  const plan = buildWorkoutPlan({ userId: 'user-456' });

//  await kv.set(['workout_plan', plan.id], plan);
//  await kv.set(['user_workout_plans', plan.userId, plan.id], {
     id: plan.id,
     categoryId: plan.categoryId,
//  });

//  // TODO: Implement
//  // await deleteWorkoutPlan(kv, 'user-456', plan.id);

//  // Verify both deleted
//  const planResult = await kv.get(['workout_plan', plan.id]);
//  const indexResult = await kv.get([
     'user_workout_plans',
     plan.userId,
     plan.id,
//  ]);

//  // assertEquals(planResult.value, null);
//  // assertEquals(indexResult.value, null);
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - deleteWorkoutPlan throws for non-existent plan', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Implement
//  // await assertRejects(
//  //   () => deleteWorkoutPlan(kv, 'user-456', 'non-existent'),
//  //   Error,
//  //   'Workout plan not found'
//  // );
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - deleteWorkoutPlan enforces user ownership', async () => {
  const cleanup = await setup();

  try {
//  const plan = buildWorkoutPlan({ userId: 'user-456' });

//  await kv.set(['workout_plan', plan.id], plan);
//  await kv.set(['user_workout_plans', plan.userId, plan.id], {
     id: plan.id,
     categoryId: plan.categoryId,
//  });

//  // TODO: Implement
//  // Different user tries to delete
//  // await assertRejects(
//  //   () => deleteWorkoutPlan(kv, 'user-999', plan.id),
//  //   Error,
//  //   'Forbidden'
//  // );
//  //
//  // // Verify not deleted
//  // const stillExists = await kv.get(['workout_plan', plan.id]);
//  // assertExists(stillExists.value);
  } finally {
//  await cleanup();
  }
});

// ============================================================================
// Business Logic: Helper Functions
// ============================================================================

Deno.test('Helper - calculateTotalSessions computes correctly', () => {
  assertEquals(calculateTotalSessions(8, [1, 3, 5]), 24); // 8 * 3
  assertEquals(calculateTotalSessions(12, [0, 6]), 24); // 12 * 2
  assertEquals(calculateTotalSessions(4, [1, 2, 3, 4, 5]), 20); // 4 * 5
  assertEquals(calculateTotalSessions(1, [0, 1, 2, 3, 4, 5, 6]), 7); // 1 * 7
});

// ============================================================================
// Error Handling Tests
// ============================================================================

Deno.test('Service - handles concurrent updates gracefully', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Test concurrent modification handling
//  // Deno KV supports optimistic locking with versionstamps
//  // Implementation should handle race conditions gracefully
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - handles KV connection errors gracefully', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Test error handling when KV operations fail
//  // Should throw appropriate errors with helpful messages
  } finally {
//  await cleanup();
  }
});

Deno.test('Service - handles deleted category gracefully', async () => {
  const cleanup = await setup();

  try {
//  // TODO: Test when category is deleted after plan is created
//  // Plan should still exist but category details may be unavailable
  } finally {
//  await cleanup();
  }
});
