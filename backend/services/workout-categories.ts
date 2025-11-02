/**
 * Service Layer: Workout Categories Admin
 * Business logic and Deno KV operations for workout categories
 */

import { nanoid } from 'https://deno.land/x/nanoid@v3.0.0/mod.ts';
import type {
  CategoryListQuery,
  CreateCategoryRequest,
  CreateExerciseRequest,
  DuplicateExerciseRequest,
  Exercise,
  ListCategoriesResponse,
  ReorderExercisesRequest,
  ReorderExercisesResponse,
  UpdateCategoryRequest,
  UpdateExerciseRequest,
  WorkoutCategory,
  WorkoutCategorySummary,
} from '../types/workout-categories.ts';

// ============================================================================
// Error Classes
// ============================================================================

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// Category CRUD Operations
// ============================================================================

/**
 * List all categories with optional search and pagination
 */
export async function listCategories(
  kv: Deno.Kv,
  query: CategoryListQuery,
): Promise<ListCategoriesResponse> {
  const { query: searchQuery, limit = 50, offset = 0 } = query;

  const categories: WorkoutCategorySummary[] = [];
  const entries = kv.list<WorkoutCategory>({ prefix: ['workout_category'] });

  for await (const entry of entries) {
    const category = entry.value;

    // Apply search filter (case-insensitive)
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      const matchesName = category.name.toLowerCase().includes(queryLower);
      const matchesFocus = category.focusArea.toLowerCase().includes(queryLower);

      if (!matchesName && !matchesFocus) {
        continue;
      }
    }

    // Create summary (exclude exercises array)
    const summary: WorkoutCategorySummary = {
      id: category.id,
      name: category.name,
      focusArea: category.focusArea,
      keyObjective: category.keyObjective,
      exerciseCount: category.exercises.length,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    categories.push(summary);
  }

  // Sort by creation date (newest first)
  categories.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const total = categories.length;
  const paginatedCategories = categories.slice(offset, offset + limit);

  return {
    categories: paginatedCategories,
    total,
    offset,
    limit,
  };
}

/**
 * Create a new workout category
 */
export async function createCategory(
  kv: Deno.Kv,
  data: CreateCategoryRequest,
): Promise<WorkoutCategory> {
  const id = nanoid();
  const now = new Date().toISOString();

  const category: WorkoutCategory = {
    id,
    name: data.name,
    focusArea: data.focusArea,
    keyObjective: data.keyObjective,
    exercises: [],
    createdAt: now,
    updatedAt: now,
  };

  await kv.set(['workout_category', id], category);

  return category;
}

/**
 * Get a category by ID with all exercises
 */
export async function getCategoryById(
  kv: Deno.Kv,
  categoryId: string,
): Promise<WorkoutCategory> {
  const entry = await kv.get<WorkoutCategory>(['workout_category', categoryId]);

  if (!entry.value) {
    throw new NotFoundError('Category not found');
  }

  return entry.value;
}

/**
 * Update a category's properties
 */
export async function updateCategory(
  kv: Deno.Kv,
  categoryId: string,
  data: UpdateCategoryRequest,
): Promise<WorkoutCategory> {
  const category = await getCategoryById(kv, categoryId);

  const updatedCategory: WorkoutCategory = {
    ...category,
    ...(data.name !== undefined && { name: data.name }),
    ...(data.focusArea !== undefined && { focusArea: data.focusArea }),
    ...(data.keyObjective !== undefined && { keyObjective: data.keyObjective }),
    updatedAt: new Date().toISOString(),
  };

  await kv.set(['workout_category', categoryId], updatedCategory);

  return updatedCategory;
}

/**
 * Delete a category and all associated exercises
 */
export async function deleteCategory(
  kv: Deno.Kv,
  categoryId: string,
): Promise<void> {
  // Verify category exists
  await getCategoryById(kv, categoryId);

  await kv.delete(['workout_category', categoryId]);
}

// ============================================================================
// Exercise CRUD Operations
// ============================================================================

/**
 * Add a new exercise to a category
 */
export async function addExercise(
  kv: Deno.Kv,
  categoryId: string,
  data: CreateExerciseRequest,
): Promise<Exercise> {
  const category = await getCategoryById(kv, categoryId);

  const exerciseId = nanoid();
  const order = category.exercises.length;

  const exercise: Exercise = {
    id: exerciseId,
    name: data.name,
    sets: data.sets,
    repetitions: data.repetitions,
    difficulty: data.difficulty,
    ...(data.description !== undefined && { description: data.description }),
    order,
  };

  const updatedCategory: WorkoutCategory = {
    ...category,
    exercises: [...category.exercises, exercise],
    updatedAt: new Date().toISOString(),
  };

  await kv.set(['workout_category', categoryId], updatedCategory);

  return exercise;
}

/**
 * Update an exercise in a category
 */
export async function updateExercise(
  kv: Deno.Kv,
  categoryId: string,
  exerciseId: string,
  data: UpdateExerciseRequest,
): Promise<Exercise> {
  const category = await getCategoryById(kv, categoryId);

  const exerciseIndex = category.exercises.findIndex((e) => e.id === exerciseId);
  if (exerciseIndex === -1) {
    throw new NotFoundError('Exercise not found');
  }

  const existingExercise = category.exercises[exerciseIndex];

  const updatedExercise: Exercise = {
    ...existingExercise,
    ...(data.name !== undefined && { name: data.name }),
    ...(data.sets !== undefined && { sets: data.sets }),
    ...(data.repetitions !== undefined && { repetitions: data.repetitions }),
    ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
    ...(data.description !== undefined && { description: data.description }),
  };

  const updatedExercises = [...category.exercises];
  updatedExercises[exerciseIndex] = updatedExercise;

  const updatedCategory: WorkoutCategory = {
    ...category,
    exercises: updatedExercises,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(['workout_category', categoryId], updatedCategory);

  return updatedExercise;
}

/**
 * Delete an exercise from a category and reorder remaining exercises
 */
export async function deleteExercise(
  kv: Deno.Kv,
  categoryId: string,
  exerciseId: string,
): Promise<void> {
  const category = await getCategoryById(kv, categoryId);

  const exerciseIndex = category.exercises.findIndex((e) => e.id === exerciseId);
  if (exerciseIndex === -1) {
    throw new NotFoundError('Exercise not found');
  }

  // Remove the exercise
  const updatedExercises = category.exercises.filter((e) => e.id !== exerciseId);

  // Reorder remaining exercises
  const reorderedExercises = updatedExercises.map((exercise, index) => ({
    ...exercise,
    order: index,
  }));

  const updatedCategory: WorkoutCategory = {
    ...category,
    exercises: reorderedExercises,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(['workout_category', categoryId], updatedCategory);
}

/**
 * Duplicate an exercise to the same or different category
 */
export async function duplicateExercise(
  kv: Deno.Kv,
  sourceCategoryId: string,
  exerciseId: string,
  data: DuplicateExerciseRequest,
): Promise<Exercise> {
  const sourceCategory = await getCategoryById(kv, sourceCategoryId);
  const targetCategory = await getCategoryById(kv, data.targetCategoryId);

  const sourceExercise = sourceCategory.exercises.find((e) => e.id === exerciseId);
  if (!sourceExercise) {
    throw new NotFoundError('Exercise not found');
  }

  const newExerciseId = nanoid();
  const order = targetCategory.exercises.length;

  // If duplicating to same category, append " (Copy)" to name
  const isSameCategory = sourceCategoryId === data.targetCategoryId;
  const newName = isSameCategory ? `${sourceExercise.name} (Copy)` : sourceExercise.name;

  const duplicatedExercise: Exercise = {
    ...sourceExercise,
    id: newExerciseId,
    name: newName,
    order,
  };

  const updatedTargetCategory: WorkoutCategory = {
    ...targetCategory,
    exercises: [...targetCategory.exercises, duplicatedExercise],
    updatedAt: new Date().toISOString(),
  };

  await kv.set(['workout_category', data.targetCategoryId], updatedTargetCategory);

  return duplicatedExercise;
}

/**
 * Reorder exercises within a category
 */
export async function reorderExercises(
  kv: Deno.Kv,
  categoryId: string,
  data: ReorderExercisesRequest,
): Promise<ReorderExercisesResponse> {
  const category = await getCategoryById(kv, categoryId);

  // Validate: All exercise IDs must be provided
  if (data.exerciseIds.length !== category.exercises.length) {
    throw new ValidationError('Must provide all exercise IDs');
  }

  // Validate: No duplicates
  const uniqueIds = new Set(data.exerciseIds);
  if (uniqueIds.size !== data.exerciseIds.length) {
    throw new ValidationError('Duplicate exercise IDs');
  }

  // Validate: All IDs must exist in the category
  const categoryExerciseIds = new Set(category.exercises.map((e) => e.id));
  for (const id of data.exerciseIds) {
    if (!categoryExerciseIds.has(id)) {
      throw new ValidationError('Invalid exercise ID');
    }
  }

  // Create a map for quick lookup
  const exerciseMap = new Map(category.exercises.map((e) => [e.id, e]));

  // Reorder exercises based on the provided order
  const reorderedExercises = data.exerciseIds.map((id, index) => {
    const exercise = exerciseMap.get(id)!;
    return {
      ...exercise,
      order: index,
    };
  });

  const updatedCategory: WorkoutCategory = {
    ...category,
    exercises: reorderedExercises,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(['workout_category', categoryId], updatedCategory);

  return {
    exercises: reorderedExercises,
  };
}
