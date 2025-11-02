/**
 * Service Layer: Workout Plans
 * Business logic and Deno KV operations for workout plan wizard
 */

import { nanoid } from 'https://deno.land/x/nanoid@v3.0.0/mod.ts';
import type {
  CreateWorkoutPlanRequest,
  CreateWorkoutPlanResponse,
  DayOfWeek,
  Exercise,
  ListWorkoutPlansQuery,
  ListWorkoutPlansResponse,
  WorkoutPlan,
  WorkoutPlanDetail,
  WorkoutPlanSummary,
} from '../types/workout-plans.ts';
import type { WorkoutCategory } from '../types/workout-categories.ts';

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

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate total training sessions
 */
function calculateTotalSessions(numberOfWeeks: number, selectedDays: DayOfWeek[]): number {
  return numberOfWeeks * selectedDays.length;
}

// ============================================================================
// Create Workout Plan
// ============================================================================

/**
 * Create a new workout plan
 */
export async function createWorkoutPlan(
  kv: Deno.Kv,
  userId: string,
  data: CreateWorkoutPlanRequest,
): Promise<CreateWorkoutPlanResponse> {
  // Validate category exists
  const categoryEntry = await kv.get<WorkoutCategory>(['workout_category', data.categoryId]);

  if (!categoryEntry.value) {
    throw new NotFoundError('Category not found');
  }

  const category = categoryEntry.value;

  // Validate all exercises belong to the category
  const categoryExerciseIds = new Set(category.exercises.map((e) => e.id));

  for (const exerciseId of data.selectedExerciseIds) {
    if (!categoryExerciseIds.has(exerciseId)) {
      throw new NotFoundError(`Exercise ${exerciseId} does not belong to category`);
    }
  }

  // Generate unique plan ID
  const planId = nanoid();
  const now = new Date().toISOString();

  // Create workout plan
  const plan: WorkoutPlan = {
    id: planId,
    userId,
    categoryId: data.categoryId,
    startDate: data.startDate,
    numberOfWeeks: data.numberOfWeeks,
    selectedDays: data.selectedDays,
    selectedExerciseIds: data.selectedExerciseIds,
    createdAt: now,
  };

  // Store in both collections (plan and user index)
  const indexData = {
    id: plan.id,
    categoryId: plan.categoryId,
    startDate: plan.startDate,
    numberOfWeeks: plan.numberOfWeeks,
    createdAt: plan.createdAt,
  };

  await kv.set(['workout_plan', planId], plan);
  await kv.set(['user_workout_plans', userId, planId], indexData);

  // Return response with calculated fields
  return {
    id: plan.id,
    userId: plan.userId,
    categoryId: plan.categoryId,
    startDate: plan.startDate,
    numberOfWeeks: plan.numberOfWeeks,
    selectedDays: plan.selectedDays,
    selectedExerciseIds: plan.selectedExerciseIds,
    totalSessions: calculateTotalSessions(plan.numberOfWeeks, plan.selectedDays),
    createdAt: plan.createdAt,
  };
}

// ============================================================================
// Get Workout Plan by ID
// ============================================================================

/**
 * Get a specific workout plan with full details
 */
export async function getWorkoutPlanById(
  kv: Deno.Kv,
  userId: string,
  planId: string,
): Promise<WorkoutPlanDetail> {
  // Fetch the plan
  const planEntry = await kv.get<WorkoutPlan>(['workout_plan', planId]);

  if (!planEntry.value) {
    throw new NotFoundError('Workout plan not found');
  }

  const plan = planEntry.value;

  // Check user ownership
  if (plan.userId !== userId) {
    throw new ForbiddenError('You do not have permission to access this workout plan');
  }

  // Fetch the category to get exercise details
  const categoryEntry = await kv.get<WorkoutCategory>(['workout_category', plan.categoryId]);

  // Handle deleted category gracefully
  let categoryName = 'Unknown Category';
  let exercises: Exercise[] = [];

  if (categoryEntry.value) {
    const category = categoryEntry.value;
    categoryName = category.name;

    // Get exercise details for selected exercises
    const categoryExercisesMap = new Map(
      category.exercises.map((e) => [e.id, e])
    );

    // Filter out deleted exercises
    exercises = plan.selectedExerciseIds
      .map((id) => categoryExercisesMap.get(id))
      .filter((e): e is Exercise => e !== undefined)
      .map(({ id, name, sets, repetitions, difficulty, description }) => ({
        id,
        name,
        sets,
        repetitions,
        difficulty,
        ...(description && { description }),
      }));
  }

  // Return plan with denormalized data
  return {
    ...plan,
    categoryName,
    exercises,
    totalSessions: calculateTotalSessions(plan.numberOfWeeks, plan.selectedDays),
  };
}

// ============================================================================
// List Workout Plans
// ============================================================================

/**
 * List all workout plans for a user with optional filtering and pagination
 */
export async function listWorkoutPlans(
  kv: Deno.Kv,
  userId: string,
  query: ListWorkoutPlansQuery,
): Promise<ListWorkoutPlansResponse> {
  const { categoryId, limit = 50, offset = 0 } = query;

  const plans: WorkoutPlanSummary[] = [];

  // Query user's plan index
  const entries = kv.list<WorkoutPlan>({ prefix: ['user_workout_plans', userId] });

  for await (const entry of entries) {
    const indexData = entry.value;

    // Fetch full plan data
    const planEntry = await kv.get<WorkoutPlan>(['workout_plan', indexData.id]);

    if (!planEntry.value) {
      continue; // Skip if plan was deleted
    }

    const plan = planEntry.value;

    // Apply category filter
    if (categoryId && plan.categoryId !== categoryId) {
      continue;
    }

    // Fetch category name
    const categoryEntry = await kv.get<WorkoutCategory>(['workout_category', plan.categoryId]);
    const categoryName = categoryEntry.value?.name || 'Unknown Category';

    // Create summary
    const summary: WorkoutPlanSummary = {
      id: plan.id,
      categoryId: plan.categoryId,
      categoryName,
      startDate: plan.startDate,
      numberOfWeeks: plan.numberOfWeeks,
      selectedDays: plan.selectedDays,
      exerciseCount: plan.selectedExerciseIds.length,
      totalSessions: calculateTotalSessions(plan.numberOfWeeks, plan.selectedDays),
      createdAt: plan.createdAt,
    };

    plans.push(summary);
  }

  // Sort by creation date (newest first)
  plans.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = plans.length;
  const paginatedPlans = plans.slice(offset, offset + limit);

  return {
    plans: paginatedPlans,
    total,
    offset,
    limit,
  };
}

// ============================================================================
// Delete Workout Plan
// ============================================================================

/**
 * Delete a workout plan (user must own the plan)
 */
export async function deleteWorkoutPlan(
  kv: Deno.Kv,
  userId: string,
  planId: string,
): Promise<void> {
  // Fetch the plan
  const planEntry = await kv.get<WorkoutPlan>(['workout_plan', planId]);

  if (!planEntry.value) {
    throw new NotFoundError('Workout plan not found');
  }

  const plan = planEntry.value;

  // Check user ownership
  if (plan.userId !== userId) {
    throw new ForbiddenError('You do not have permission to delete this workout plan');
  }

  // Delete from both collections
  await kv.delete(['workout_plan', planId]);
  await kv.delete(['user_workout_plans', userId, planId]);
}
