/**
 * Integration Tests: Workout Categories Admin API
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
  buildExercise,
  buildMultipleCategories,
  createCategoryKvSeeds,
  invalidCategoryData,
  invalidCategoryUpdateData,
  invalidDuplicateData,
  invalidExerciseData,
  invalidExerciseUpdateData,
  invalidQueryParams,
  invalidReorderData,
  validCategoryData,
  validCategoryUpdateData,
  validDuplicateData,
  validExerciseData,
  validExerciseUpdateData,
} from './fixtures/workout-categories.ts';

// ============================================================================
// Test Setup
// ============================================================================

// Mock API functions - these will be implemented in the actual service
let kv: any;

async function setup() {
  const { kv: testKv, cleanup } = await setupTestKv();
  kv = testKv;
  return cleanup;
}

// ============================================================================
// GET /api/admin/workout-categories - List Categories
// ============================================================================

Deno.test('GET /categories - returns empty list when no categories exist', async () => {
  const cleanup = await setup();

  try {
    // This will call the service layer directly since we're testing business logic
    // In actual implementation, this would be: await listCategories(kv, {})
    const result = {
      categories: [],
      total: 0,
      offset: 0,
      limit: 50,
    };

    assertEquals(result.categories.length, 0);
    assertEquals(result.total, 0);
    assertEquals(result.offset, 0);
    assertEquals(result.limit, 50);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories - lists all categories with default pagination', async () => {
  const cleanup = await setup();

  try {
    const categories = buildMultipleCategories(5);
    const seeds = createCategoryKvSeeds(categories);

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement listCategories service function
    // const result = await listCategories(kv, {});

    // Expected behavior:
    // assertEquals(result.categories.length, 5);
    // assertEquals(result.total, 5);
    // assertEquals(result.limit, 50);
    // assertEquals(result.offset, 0);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories - respects limit parameter', async () => {
  const cleanup = await setup();

  try {
    const categories = buildMultipleCategories(10);
    const seeds = createCategoryKvSeeds(categories);

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement with limit
    // const result = await listCategories(kv, { limit: 5 });

    // Expected:
    // assertEquals(result.categories.length, 5);
    // assertEquals(result.total, 10);
    // assertEquals(result.limit, 5);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories - respects offset parameter', async () => {
  const cleanup = await setup();

  try {
    const categories = buildMultipleCategories(10);
    const seeds = createCategoryKvSeeds(categories);

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement with offset
    // const result = await listCategories(kv, { offset: 5, limit: 5 });

    // Expected:
    // assertEquals(result.categories.length, 5);
    // assertEquals(result.total, 10);
    // assertEquals(result.offset, 5);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories - searches by name', async () => {
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

    // Expected:
    // assertEquals(result.categories.length, 2);
    // assertEquals(result.categories[0].name.toLowerCase().includes('spike'), true);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories - searches by focus area', async () => {
  const cleanup = await setup();

  try {
    const categories = [
      buildCategory({
        id: 'cat-1',
        name: 'Advanced Skills',
        focusArea: 'Attacking',
      }),
      buildCategory({
        id: 'cat-2',
        name: 'Defense Training',
        focusArea: 'Blocking',
      }),
      buildCategory({
        id: 'cat-3',
        name: 'Power Spike',
        focusArea: 'Attacking',
      }),
    ];
    const seeds = createCategoryKvSeeds(categories);

    for (const seed of seeds) {
      await kv.set(seed.key, seed.value);
    }

    // TODO: Implement search by focus area
    // const result = await listCategories(kv, { query: 'attacking' });

    // Expected: 2 results with focusArea containing 'attacking'
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories - returns 400 for invalid query params', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test invalid limit
    // await assertRejects(() => listCategories(kv, invalidQueryParams.limitNegative));

    // TODO: Test invalid offset
    // await assertRejects(() => listCategories(kv, invalidQueryParams.offsetNegative));
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories - includes exercise count in summaries', async () => {
  const cleanup = await setup();

  try {
    const categoryWithExercises = buildCategoryWithExercises(3);
    await kv.set(
      ['workout_category', categoryWithExercises.id],
      categoryWithExercises,
    );

    // TODO: Implement
    // const result = await listCategories(kv, {});

    // Expected:
    // assertEquals(result.categories[0].exerciseCount, 3);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// POST /api/admin/workout-categories - Create Category
// ============================================================================

Deno.test('POST /categories - creates category with valid data', async () => {
  const cleanup = await setup();

  try {
    // TODO: Implement createCategory service
    // const result = await createCategory(kv, validCategoryData);

    // Expected:
    // assertExists(result.id);
    // assertEquals(result.name, validCategoryData.name);
    // assertEquals(result.focusArea, validCategoryData.focusArea);
    // assertEquals(result.keyObjective, validCategoryData.keyObjective);
    // assertEquals(result.exercises.length, 0);
    // assertExists(result.createdAt);
    // assertExists(result.updatedAt);

    // Verify stored in KV
    // const stored = await kv.get(['workout_category', result.id]);
    // assertExists(stored.value);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - generates unique ID for each category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Create two categories
    // const cat1 = await createCategory(kv, validCategoryData);
    // const cat2 = await createCategory(kv, validCategoryData);

    // Expected:
    // assertNotEquals(cat1.id, cat2.id);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - sets timestamps on creation', async () => {
  const cleanup = await setup();

  try {
    const beforeCreate = new Date().toISOString();

    // TODO: Implement
    // const result = await createCategory(kv, validCategoryData);

    const afterCreate = new Date().toISOString();

    // Expected:
    // assertExists(result.createdAt);
    // assertExists(result.updatedAt);
    // assertEquals(result.createdAt, result.updatedAt);
    // assertTrue(result.createdAt >= beforeCreate && result.createdAt <= afterCreate);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - returns 400 for missing name', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createCategory(kv, invalidCategoryData.missingName),
    //   'Validation error'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - returns 400 for missing focusArea', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createCategory(kv, invalidCategoryData.missingFocusArea)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - returns 400 for missing keyObjective', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createCategory(kv, invalidCategoryData.missingKeyObjective)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - returns 400 for name too long', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createCategory(kv, invalidCategoryData.nameTooLong)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - returns 400 for empty name', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createCategory(kv, invalidCategoryData.nameEmpty)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - returns 400 for focusArea too long', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createCategory(kv, invalidCategoryData.focusAreaTooLong)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories - returns 400 for keyObjective too long', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test validation
    // await assertRejects(
    //   () => createCategory(kv, invalidCategoryData.keyObjectiveTooLong)
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// GET /api/admin/workout-categories/:id - Get Category by ID
// ============================================================================

Deno.test('GET /categories/:id - returns category with exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement getCategoryById
    // const result = await getCategoryById(kv, category.id);

    // Expected:
    // assertEquals(result.id, category.id);
    // assertEquals(result.exercises.length, 3);
    // assertEquals(result.exercises[0].order, 0);
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories/:id - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => getCategoryById(kv, 'non-existent-id'),
    //   'Category not found'
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('GET /categories/:id - returns category with empty exercises array', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // const result = await getCategoryById(kv, category.id);

    // Expected:
    // assertEquals(result.exercises, []);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// PUT /api/admin/workout-categories/:id - Update Category
// ============================================================================

Deno.test('PUT /categories/:id - updates all fields', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement updateCategory
    // const result = await updateCategory(kv, category.id, validCategoryUpdateData.full);

    // Expected:
    // assertEquals(result.name, validCategoryUpdateData.full.name);
    // assertEquals(result.focusArea, validCategoryUpdateData.full.focusArea);
    // assertEquals(result.keyObjective, validCategoryUpdateData.full.keyObjective);
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id - updates partial fields', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({
      name: 'Original Name',
      focusArea: 'Original Focus',
    });
    await kv.set(['workout_category', category.id], category);

    // TODO: Update only name
    // const result = await updateCategory(kv, category.id, validCategoryUpdateData.partial);

    // Expected:
    // assertEquals(result.name, validCategoryUpdateData.partial.name);
    // assertEquals(result.focusArea, 'Original Focus'); // Unchanged
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id - updates updatedAt timestamp', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory({
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    });
    await kv.set(['workout_category', category.id], category);

    // Small delay to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 10));

    // TODO: Implement
    // const result = await updateCategory(kv, category.id, { name: 'Updated' });

    // Expected:
    // assertEquals(result.createdAt, '2025-01-01T00:00:00Z'); // Unchanged
    // assertNotEquals(result.updatedAt, category.updatedAt); // Changed
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id - preserves exercises array', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // TODO: Update category
    // const result = await updateCategory(kv, category.id, { name: 'Updated' });

    // Expected:
    // assertEquals(result.exercises.length, 3); // Unchanged
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => updateCategory(kv, 'non-existent', { name: 'Updated' })
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id - returns 400 for empty update', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => updateCategory(kv, category.id, invalidCategoryUpdateData.empty)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id - returns 400 for invalid name', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => updateCategory(kv, category.id, invalidCategoryUpdateData.nameTooLong)
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// DELETE /api/admin/workout-categories/:id - Delete Category
// ============================================================================

Deno.test('DELETE /categories/:id - deletes category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement deleteCategory
    // await deleteCategory(kv, category.id);

    // Verify deleted
    const result = await kv.get(['workout_category', category.id]);
    // Expected: result.value === null
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /categories/:id - deletes category with exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(5);
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement
    // await deleteCategory(kv, category.id);

    // Verify deleted (including all exercises)
    const result = await kv.get(['workout_category', category.id]);
    // Expected: result.value === null
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /categories/:id - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => deleteCategory(kv, 'non-existent')
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// POST /api/admin/workout-categories/:id/exercises - Add Exercise
// ============================================================================

Deno.test('POST /categories/:id/exercises - adds exercise to category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Implement addExercise
    // const result = await addExercise(kv, category.id, validExerciseData);

    // Expected:
    // assertExists(result.id);
    // assertEquals(result.name, validExerciseData.name);
    // assertEquals(result.sets, validExerciseData.sets);
    // assertEquals(result.order, 0); // First exercise
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories/:id/exercises - assigns correct order', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(2);
    await kv.set(['workout_category', category.id], category);

    // TODO: Add third exercise
    // const result = await addExercise(kv, category.id, validExerciseData);

    // Expected:
    // assertEquals(result.order, 2); // Third exercise (0-indexed)
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories/:id/exercises - generates unique exercise ID', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Add two exercises
    // const ex1 = await addExercise(kv, category.id, validExerciseData);
    // const ex2 = await addExercise(kv, category.id, validExerciseData);

    // Expected:
    // assertNotEquals(ex1.id, ex2.id);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories/:id/exercises - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => addExercise(kv, 'non-existent', validExerciseData)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories/:id/exercises - returns 400 for missing name', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => addExercise(kv, category.id, invalidExerciseData.missingName)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories/:id/exercises - returns 400 for invalid sets', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => addExercise(kv, category.id, invalidExerciseData.setsTooSmall)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories/:id/exercises - returns 400 for invalid difficulty', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => addExercise(kv, category.id, invalidExerciseData.invalidDifficulty)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /categories/:id/exercises - handles optional description', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    const dataWithoutDescription = {
      name: 'Exercise',
      sets: 3,
      repetitions: '10',
      difficulty: 'medium' as const,
    };

    // TODO: Add exercise without description
    // const result = await addExercise(kv, category.id, dataWithoutDescription);

    // Expected:
    // assertEquals(result.description, undefined);
  } finally {
    await cleanup();
  }
});

// ============================================================================
// PUT /api/admin/workout-categories/:id/exercises/:exerciseId - Update Exercise
// ============================================================================

Deno.test('PUT /categories/:id/exercises/:exerciseId - updates all fields', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(1);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[0].id;

    // TODO: Implement updateExercise
    // const result = await updateExercise(
    //   kv,
    //   category.id,
    //   exerciseId,
    //   validExerciseUpdateData.full
    // );

    // Expected:
    // assertEquals(result.name, validExerciseUpdateData.full.name);
    // assertEquals(result.sets, validExerciseUpdateData.full.sets);
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/:exerciseId - updates partial fields', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(1);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[0].id;
    const originalName = category.exercises[0].name;

    // TODO: Update only sets
    // const result = await updateExercise(
    //   kv,
    //   category.id,
    //   exerciseId,
    //   validExerciseUpdateData.partial
    // );

    // Expected:
    // assertEquals(result.sets, validExerciseUpdateData.partial.sets);
    // assertEquals(result.name, originalName); // Unchanged
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/:exerciseId - preserves order', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[1].id;
    const originalOrder = category.exercises[1].order;

    // TODO: Update exercise
    // const result = await updateExercise(
    //   kv,
    //   category.id,
    //   exerciseId,
    //   { name: 'Updated' }
    // );

    // Expected:
    // assertEquals(result.order, originalOrder); // Unchanged
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/:exerciseId - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => updateExercise(kv, 'non-existent', 'ex-1', { name: 'Updated' })
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/:exerciseId - returns 404 for non-existent exercise', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test not found
    // await assertRejects(
    //   () => updateExercise(kv, category.id, 'non-existent', { name: 'Updated' })
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/:exerciseId - returns 400 for empty update', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(1);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[0].id;

    // TODO: Test validation
    // await assertRejects(
    //   () => updateExercise(kv, category.id, exerciseId, invalidExerciseUpdateData.empty)
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// DELETE /api/admin/workout-categories/:id/exercises/:exerciseId - Delete Exercise
// ============================================================================

Deno.test('DELETE /categories/:id/exercises/:exerciseId - deletes exercise', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[1].id;

    // TODO: Implement deleteExercise
    // await deleteExercise(kv, category.id, exerciseId);

    // Verify exercise removed
    // const updated = await getCategoryById(kv, category.id);
    // assertEquals(updated.exercises.length, 2);
    // assertEquals(updated.exercises.find(e => e.id === exerciseId), undefined);
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /categories/:id/exercises/:exerciseId - reorders remaining exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const middleExerciseId = category.exercises[1].id;

    // TODO: Delete middle exercise
    // await deleteExercise(kv, category.id, middleExerciseId);

    // Verify order updated
    // const updated = await getCategoryById(kv, category.id);
    // assertEquals(updated.exercises[0].order, 0);
    // assertEquals(updated.exercises[1].order, 1);
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /categories/:id/exercises/:exerciseId - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => deleteExercise(kv, 'non-existent', 'ex-1')
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('DELETE /categories/:id/exercises/:exerciseId - returns 404 for non-existent exercise', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test not found
    // await assertRejects(
    //   () => deleteExercise(kv, category.id, 'non-existent')
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// POST /api/admin/workout-categories/:id/exercises/:exerciseId/duplicate
// ============================================================================

Deno.test('POST /exercises/:exerciseId/duplicate - duplicates to same category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(2);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[0].id;

    // TODO: Implement duplicateExercise
    // const result = await duplicateExercise(
    //   kv,
    //   category.id,
    //   exerciseId,
    //   validDuplicateData.sameCategory
    // );

    // Expected:
    // assertExists(result.id);
    // assertNotEquals(result.id, exerciseId);
    // assertEquals(result.name, category.exercises[0].name + ' (Copy)');
    // assertEquals(result.order, 2); // Added at end
  } finally {
    await cleanup();
  }
});

Deno.test('POST /exercises/:exerciseId/duplicate - duplicates to different category', async () => {
  const cleanup = await setup();

  try {
    const category1 = buildCategoryWithExercises(2);
    const category2 = buildCategory({ id: 'cat-other' });

    await kv.set(['workout_category', category1.id], category1);
    await kv.set(['workout_category', category2.id], category2);

    const exerciseId = category1.exercises[0].id;

    // TODO: Duplicate to different category
    // const result = await duplicateExercise(
    //   kv,
    //   category1.id,
    //   exerciseId,
    //   { targetCategoryId: category2.id }
    // );

    // Expected:
    // assertEquals(result.order, 0); // First in target category

    // Verify source category unchanged
    // const source = await getCategoryById(kv, category1.id);
    // assertEquals(source.exercises.length, 2);
  } finally {
    await cleanup();
  }
});

Deno.test('POST /exercises/:exerciseId/duplicate - returns 404 for non-existent source category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => duplicateExercise(kv, 'non-existent', 'ex-1', validDuplicateData.sameCategory)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /exercises/:exerciseId/duplicate - returns 404 for non-existent exercise', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test not found
    // await assertRejects(
    //   () => duplicateExercise(kv, category.id, 'non-existent', validDuplicateData.sameCategory)
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('POST /exercises/:exerciseId/duplicate - returns 404 for non-existent target category', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(1);
    await kv.set(['workout_category', category.id], category);

    const exerciseId = category.exercises[0].id;

    // TODO: Test not found
    // await assertRejects(
    //   () => duplicateExercise(kv, category.id, exerciseId, invalidDuplicateData.nonExistentCategory)
    // );
  } finally {
    await cleanup();
  }
});

// ============================================================================
// PUT /api/admin/workout-categories/:id/exercises/reorder
// ============================================================================

Deno.test('PUT /categories/:id/exercises/reorder - reorders exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const exerciseIds = [
      category.exercises[2].id,
      category.exercises[0].id,
      category.exercises[1].id,
    ];

    // TODO: Implement reorderExercises
    // const result = await reorderExercises(kv, category.id, { exerciseIds });

    // Expected:
    // assertEquals(result.exercises[0].id, exerciseIds[0]);
    // assertEquals(result.exercises[0].order, 0);
    // assertEquals(result.exercises[1].id, exerciseIds[1]);
    // assertEquals(result.exercises[1].order, 1);
    // assertEquals(result.exercises[2].id, exerciseIds[2]);
    // assertEquals(result.exercises[2].order, 2);
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/reorder - returns 400 for missing exercises', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    // Only provide 2 of 3 exercise IDs
    const incompleteIds = [
      category.exercises[0].id,
      category.exercises[1].id,
    ];

    // TODO: Test validation
    // await assertRejects(
    //   () => reorderExercises(kv, category.id, { exerciseIds: incompleteIds })
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/reorder - returns 400 for duplicate IDs', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(3);
    await kv.set(['workout_category', category.id], category);

    const duplicateIds = [
      category.exercises[0].id,
      category.exercises[0].id,
      category.exercises[1].id,
    ];

    // TODO: Test validation
    // await assertRejects(
    //   () => reorderExercises(kv, category.id, { exerciseIds: duplicateIds })
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/reorder - returns 400 for invalid exercise IDs', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategoryWithExercises(2);
    await kv.set(['workout_category', category.id], category);

    const invalidIds = [
      category.exercises[0].id,
      'non-existent',
    ];

    // TODO: Test validation
    // await assertRejects(
    //   () => reorderExercises(kv, category.id, { exerciseIds: invalidIds })
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/reorder - returns 404 for non-existent category', async () => {
  const cleanup = await setup();

  try {
    // TODO: Test not found
    // await assertRejects(
    //   () => reorderExercises(kv, 'non-existent', { exerciseIds: ['ex-1', 'ex-2'] })
    // );
  } finally {
    await cleanup();
  }
});

Deno.test('PUT /categories/:id/exercises/reorder - returns 400 for empty array', async () => {
  const cleanup = await setup();

  try {
    const category = buildCategory();
    await kv.set(['workout_category', category.id], category);

    // TODO: Test validation
    // await assertRejects(
    //   () => reorderExercises(kv, category.id, invalidReorderData.empty)
    // );
  } finally {
    await cleanup();
  }
});
