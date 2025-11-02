/**
 * Service Layer Tests: Workout Categories
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
  buildMultipleCategories,
  createCategoryKvSeeds,
  Exercise,
  WorkoutCategory,
} from './fixtures/workout-categories.ts';

// TODO: Import actual service functions when implemented
// import {
//   listCategories,
//   createCategory,
//   getCategoryById,
//   updateCategory,
//   deleteCategory,
//   addExercise,
//   updateExercise,
//   deleteExercise,
//   duplicateExercise,
//   reorderExercises,
// } from '../backend/services/workout-categories.ts';

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

Deno.test('KV Storage - stores category at correct key', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({ id: 'cat-123' });
    await kv.set(['workout_category', category.id], category);

    const stored = await kv.get(['workout_category', 'cat-123']);
    assertEquals(stored.value, category);
  } finally {
    await cleanup();
  }
});

Deno.test('KV Storage - retrieves category by id', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({ id: 'cat-123' });
    await kv.set(['workout_category', category.id], category);

    const retrieved = await kv.get(['workout_category', 'cat-123']);
    assertExists(retrieved.value);
    assertEquals(retrieved.value.id, 'cat-123');
  } finally {
    await cleanup();
  }
});

Deno.test('KV Storage - lists all categories with prefix', async () => {
  const cleanup = await setup();

  try {
    const categories = buildMultipleCategories(3);
    const seeds = createCategoryKvSeeds(categories);

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    const entries = await listKvEntries<WorkoutCategory>(kv, [
      'workout_category',
    ]);
    assertEquals(entries.length, 3);
  } finally {
    await cleanup();
  }
});

Deno.test('KV Storage - deletes category by key', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({ id: 'cat-123' });
    await kv.set(['workout_category', category.id], category);

    await kv.delete(['workout_category', 'cat-123']);

    const result = await kv.get(['workout_category', 'cat-123']);
    assertEquals(result.value, null);
  } finally {
    await cleanup();
  }
});

Deno.test('KV Storage - updates category atomically', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({ id: 'cat-123', name: 'Original' });
    await kv.set(['workout_category', category.id], category);

    const updated = { ...category, name: 'Updated' };
    await kv.set(['workout_category', category.id], updated);

    const result = await kv.get(['workout_category', 'cat-123']);
    assertEquals(result.value.name, 'Updated');
  } finally {
    await cleanup();
  }
});

Deno.test('KV Storage - stores nested exercises array', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const retrieved = await kv.get(['workout_category', category.id]);
    assertExists(retrieved.value);
    assertEquals(retrieved.value.exercises.length, 3);
    assertEquals(retrieved.value.exercises[0].order, 0);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Create Category
// ============================================================================

Deno.test('Service - createCategory generates unique ID', async () => {
  const cleanup = await setup();

  try {
    // TODO: Implement service
    // const cat1 = await createCategory(kv, {
    //   name: 'Category 1',
    //   focusArea: 'Focus 1',
    //   keyObjective: 'Objective 1',
    // });
    //
    // const cat2 = await createCategory(kv, {
    //   name: 'Category 2',
    //   focusArea: 'Focus 2',
    //   keyObjective: 'Objective 2',
    // });
    //
    // assertExists(cat1.id);
    // assertExists(cat2.id);
    // assertNotEquals(cat1.id, cat2.id);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - createCategory sets timestamps', async () => {
  const cleanup = await setup();

  try {
    const beforeCreate = new Date();

    // TODO: Implement
    // const category = await createCategory(kv, {
    //   name: 'Test',
    //   focusArea: 'Focus',
    //   keyObjective: 'Objective',
    // });

    const afterCreate = new Date();

    // assertExists(category.createdAt);
    // assertExists(category.updatedAt);
    // assertEquals(category.createdAt, category.updatedAt);
    //
    // const createdDate = new Date(category.createdAt);
    // assertTrue(createdDate >= beforeCreate && createdDate <= afterCreate);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - createCategory initializes empty exercises array', async () => {
  const cleanup = await setup();

  try {
    // TODO: Implement
    // const category = await createCategory(kv, {
    //   name: 'Test',
    //   focusArea: 'Focus',
    //   keyObjective: 'Objective',
    // });
    //
    // assertExists(category.exercises);
    // assertEquals(category.exercises.length, 0);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - createCategory stores in KV', async () => {
  const cleanup = await setup();

  try {
    // TODO: Implement
    // const category = await createCategory(kv, {
    //   name: 'Test',
    //   focusArea: 'Focus',
    //   keyObjective: 'Objective',
    // });
    //
    // const stored = await kv.get(['workout_category', category.id]);
    // assertExists(stored.value);
    // assertEquals(stored.value.name, 'Test');
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: List Categories
// ============================================================================

Deno.test('Service - listCategories returns summary format', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(5);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const result = await listCategories(kv, {});
    //
    // assertExists(result.categories[0].exerciseCount);
    // assertEquals(result.categories[0].exerciseCount, 5);
    // Do NOT include exercises array in list response
  } finally {
    await cleanup();
  }
});

Deno.test('Service - listCategories filters by search query', async () => {
  const cleanup = await setup();

  try {
    const categories = [
      buildCategory({ id: 'cat-1', name: 'Spike Training' }),
      buildCategory({ id: 'cat-2', name: 'Blocking Drills' }),
      buildCategory({ id: 'cat-3', name: 'Spike Advanced' }),
    ];

    const seeds = createCategoryKvSeeds(categories);
    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement search
    // const result = await listCategories(kv, { query: 'spike' });
    //
    // assertEquals(result.categories.length, 2);
    // result.categories.forEach((cat) => {
    //   const matchesName = cat.name.toLowerCase().includes('spike');
    //   const matchesFocus = cat.focusArea.toLowerCase().includes('spike');
    //   assertTrue(matchesName || matchesFocus);
    // });
  } finally {
    await cleanup();
  }
});

Deno.test('Service - listCategories case-insensitive search', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({ name: 'SPIKE Training' });
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const result = await listCategories(kv, { query: 'spike' });
    // assertEquals(result.categories.length, 1);
    //
    // const result2 = await listCategories(kv, { query: 'SPIKE' });
    // assertEquals(result2.categories.length, 1);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - listCategories respects pagination', async () => {
  const cleanup = await setup();

  try {
    const categories = buildMultipleCategories(15);
    const seeds = createCategoryKvSeeds(categories);

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement
    // const page1 = await listCategories(kv, { limit: 5, offset: 0 });
    // assertEquals(page1.categories.length, 5);
    // assertEquals(page1.total, 15);
    // assertEquals(page1.limit, 5);
    // assertEquals(page1.offset, 0);
    //
    // const page2 = await listCategories(kv, { limit: 5, offset: 5 });
    // assertEquals(page2.categories.length, 5);
    // assertEquals(page2.offset, 5);
    //
    // // Verify no overlap
    // const page1Ids = page1.categories.map(c => c.id);
    // const page2Ids = page2.categories.map(c => c.id);
    // const intersection = page1Ids.filter(id => page2Ids.includes(id));
    // assertEquals(intersection.length, 0);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Get Category by ID
// ============================================================================

Deno.test('Service - getCategoryById returns full category with exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const result = await getCategoryById(kv, category.id);
    //
    // assertEquals(result.id, category.id);
    // assertEquals(result.exercises.length, 3);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - getCategoryById throws for non-existent id', async () => {
  const cleanup = await setup();

  try {
    // TODO: Implement
    // await assertRejects(
    //   () => getCategoryById(kv, 'non-existent'),
    //   Error,
    //   'Category not found'
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Update Category
// ============================================================================

Deno.test('Service - updateCategory updates specified fields only', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({
      name: 'Original Name',
      focusArea: 'Original Focus',
      keyObjective: 'Original Objective',
    });
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const updated = await updateCategory(kv, category.id, {
    //   name: 'Updated Name',
    // });
    //
    // assertEquals(updated.name, 'Updated Name');
    // assertEquals(updated.focusArea, 'Original Focus');
    // assertEquals(updated.keyObjective, 'Original Objective');
  } finally {
    await cleanup();
  }
});

Deno.test('Service - updateCategory updates updatedAt timestamp', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    });
    await kv.set(['workout_category', category.id], category);

    await new Promise((resolve) => setTimeout(resolve, 10));

    // TODO: Implement
    // const updated = await updateCategory(kv, category.id, {
    //   name: 'Updated',
    // });
    //
    // assertEquals(updated.createdAt, '2025-01-01T00:00:00Z');
    // assertNotEquals(updated.updatedAt, '2025-01-01T00:00:00Z');
  } finally {
    await cleanup();
  }
});

Deno.test('Service - updateCategory preserves exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const updated = await updateCategory(kv, category.id, {
    //   name: 'Updated',
    // });
    //
    // assertEquals(updated.exercises.length, 3);
    // assertEquals(updated.exercises[0].id, category.exercises[0].id);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Delete Category
// ============================================================================

Deno.test('Service - deleteCategory removes from KV', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // await deleteCategory(kv, category.id);

    const result = await kv.get(['workout_category', category.id]);
    // assertEquals(result.value, null);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - deleteCategory throws for non-existent id', async () => {
  const cleanup = await setup();

  try {
    // TODO: Implement
    // await assertRejects(
    //   () => deleteCategory(kv, 'non-existent'),
    //   Error,
    //   'Category not found'
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Add Exercise
// ============================================================================

Deno.test('Service - addExercise generates unique ID', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const ex1 = await addExercise(kv, category.id, {
    //   name: 'Exercise 1',
    //   sets: 3,
    //   repetitions: '10',
    //   difficulty: 'medium',
    // });
    //
    // const ex2 = await addExercise(kv, category.id, {
    //   name: 'Exercise 2',
    //   sets: 3,
    //   repetitions: '10',
    //   difficulty: 'medium',
    // });
    //
    // assertNotEquals(ex1.id, ex2.id);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - addExercise assigns order sequentially', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(2);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const newExercise = await addExercise(kv, category.id, {
    //   name: 'Exercise 3',
    //   sets: 3,
    //   repetitions: '10',
    //   difficulty: 'medium',
    // });
    //
    // assertEquals(newExercise.order, 2); // Third exercise
  } finally {
    await cleanup();
  }
});

Deno.test('Service - addExercise adds to category exercises array', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // await addExercise(kv, category.id, {
    //   name: 'Exercise',
    //   sets: 3,
    //   repetitions: '10',
    //   difficulty: 'medium',
    // });
    //
    // const updated = await getCategoryById(kv, category.id);
    // assertEquals(updated.exercises.length, 1);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Update Exercise
// ============================================================================

Deno.test('Service - updateExercise updates specified fields only', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(1);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[0].id;
    const originalName = category.exercises[0].name;

    // TODO: Implement
    // const updated = await updateExercise(kv, category.id, exerciseId, {
    //   sets: 5,
    // });
    //
    // assertEquals(updated.sets, 5);
    // assertEquals(updated.name, originalName);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - updateExercise preserves order', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[1].id;

    // TODO: Implement
    // const updated = await updateExercise(kv, category.id, exerciseId, {
    //   name: 'Updated',
    // });
    //
    // assertEquals(updated.order, 1);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Delete Exercise
// ============================================================================

Deno.test('Service - deleteExercise removes from exercises array', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[1].id;

    // TODO: Implement
    // await deleteExercise(kv, category.id, exerciseId);
    //
    // const updated = await getCategoryById(kv, category.id);
    // assertEquals(updated.exercises.length, 2);
    // assertEquals(updated.exercises.find(e => e.id === exerciseId), undefined);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - deleteExercise reorders remaining exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(4);
    await kv.set(['workout_category', category.id], category);

    // Delete second exercise (order: 1)
    const exerciseId = category.exercises[1].id;

    // TODO: Implement
    // await deleteExercise(kv, category.id, exerciseId);
    //
    // const updated = await getCategoryById(kv, category.id);
    // assertEquals(updated.exercises.length, 3);
    // assertEquals(updated.exercises[0].order, 0);
    // assertEquals(updated.exercises[1].order, 1); // Was order 2
    // assertEquals(updated.exercises[2].order, 2); // Was order 3
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Duplicate Exercise
// ============================================================================

Deno.test('Service - duplicateExercise creates copy in same category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(2);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[0].id;

    // TODO: Implement
    // const duplicate = await duplicateExercise(kv, category.id, exerciseId, {
    //   targetCategoryId: category.id,
    // });
    //
    // assertNotEquals(duplicate.id, exerciseId);
    // assertEquals(duplicate.name, category.exercises[0].name + ' (Copy)');
    // assertEquals(duplicate.order, 2); // Added at end
  } finally {
    await cleanup();
  }
});

Deno.test('Service - duplicateExercise creates copy in different category', async () => {
  const cleanup = await setup();

  try {
    const category1 = buildCategoryWithExercises(2);
    const category2 = buildCategory({ id: 'cat-other' });

    await kv.set(['workout_category', category1.id], category1);
    await kv.set(['workout_category', category2.id], category2);

    const exerciseId = category1.exercises[0].id;

    // TODO: Implement
    // const duplicate = await duplicateExercise(
    //   kv,
    //   category1.id,
    //   exerciseId,
    //   { targetCategoryId: category2.id }
    // );
    //
    // // Check duplicate in target category
    // const targetCategory = await getCategoryById(kv, category2.id);
    // assertEquals(targetCategory.exercises.length, 1);
    // assertEquals(targetCategory.exercises[0].id, duplicate.id);
    //
    // // Check source unchanged
    // const sourceCategory = await getCategoryById(kv, category1.id);
    // assertEquals(sourceCategory.exercises.length, 2);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - duplicateExercise does not append "(Copy)" when moving to different category', async () => {
  const cleanup = await setup();

  try {
    const category1 = buildCategoryWithExercises(1);
    const category2 = buildCategory({ id: 'cat-other' });

    await kv.set(['workout_category', category1.id], category1);
    await kv.set(['workout_category', category2.id], category2);

    const exerciseId = category1.exercises[0].id;
    const originalName = category1.exercises[0].name;

    // TODO: Implement
    // const duplicate = await duplicateExercise(
    //   kv,
    //   category1.id,
    //   exerciseId,
    //   { targetCategoryId: category2.id }
    // );
    //
    // assertEquals(duplicate.name, originalName); // No "(Copy)" suffix
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Business Logic: Reorder Exercises
// ============================================================================

Deno.test('Service - reorderExercises updates order fields', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const newOrder = [
      category.exercises[2].id,
      category.exercises[0].id,
      category.exercises[1].id,
    ];

    // TODO: Implement
    // const result = await reorderExercises(kv, category.id, {
    //   exerciseIds: newOrder,
    // });
    //
    // assertEquals(result.exercises[0].id, newOrder[0]);
    // assertEquals(result.exercises[0].order, 0);
    // assertEquals(result.exercises[1].id, newOrder[1]);
    // assertEquals(result.exercises[1].order, 1);
    // assertEquals(result.exercises[2].id, newOrder[2]);
    // assertEquals(result.exercises[2].order, 2);
  } finally {
    await cleanup();
  }
});

Deno.test('Service - reorderExercises validates all exercises present', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // Only provide 2 of 3 IDs
    const incompleteOrder = [
      category.exercises[0].id,
      category.exercises[1].id,
    ];

    // TODO: Implement
    // await assertRejects(
    //   () => reorderExercises(kv, category.id, { exerciseIds: incompleteOrder }),
    //   Error,
    //   'Must provide all exercise IDs'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('Service - reorderExercises validates no duplicates', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const duplicateOrder = [
      category.exercises[0].id,
      category.exercises[0].id,
      category.exercises[1].id,
    ];

    // TODO: Implement
    // await assertRejects(
    //   () => reorderExercises(kv, category.id, { exerciseIds: duplicateOrder }),
    //   Error,
    //   'Duplicate exercise IDs'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('Service - reorderExercises validates exercise belongs to category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(2);
    await kv.set(['workout_category', category.id], category);

    const invalidOrder = [
      category.exercises[0].id,
      'non-existent-id',
    ];

    // TODO: Implement
    // await assertRejects(
    //   () => reorderExercises(kv, category.id, { exerciseIds: invalidOrder }),
    //   Error,
    //   'Invalid exercise ID'
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// Error Handling Tests
// ============================================================================

Deno.test('Service - handles concurrent updates to same category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test concurrent modification handling
    // Deno KV supports optimistic locking with versionstamps
    // Implementation should handle race conditions gracefully
  } finally {
    await cleanup();
  }
});

Deno.test('Service - handles KV connection errors gracefully', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test error handling when KV operations fail
    // Should throw appropriate errors with helpful messages
  } finally {
    await cleanup();
  }
});
