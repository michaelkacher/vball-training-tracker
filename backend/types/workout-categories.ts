/**
 * Type Definitions: Workout Categories Admin
 * TypeScript interfaces for workout categories and exercises
 */

// ============================================================================
// Domain Models
// ============================================================================

/**
 * Exercise in a workout category
 */
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  description?: string;
  order: number;
}

/**
 * Workout category with exercises
 */
export interface WorkoutCategory {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Summary of category for list views
 */
export interface WorkoutCategorySummary {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exerciseCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Request/Response DTOs
// ============================================================================

/**
 * Create category request
 */
export interface CreateCategoryRequest {
  name: string;
  focusArea: string;
  keyObjective: string;
}

/**
 * Update category request
 */
export interface UpdateCategoryRequest {
  name?: string;
  focusArea?: string;
  keyObjective?: string;
}

/**
 * Create exercise request
 */
export interface CreateExerciseRequest {
  name: string;
  sets: number;
  repetitions: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  description?: string;
}

/**
 * Update exercise request
 */
export interface UpdateExerciseRequest {
  name?: string;
  sets?: number;
  repetitions?: string;
  difficulty?: 'easy' | 'medium' | 'challenging';
  description?: string;
}

/**
 * Duplicate exercise request
 */
export interface DuplicateExerciseRequest {
  targetCategoryId: string;
}

/**
 * Reorder exercises request
 */
export interface ReorderExercisesRequest {
  exerciseIds: string[];
}

/**
 * List categories response
 */
export interface ListCategoriesResponse {
  categories: WorkoutCategorySummary[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Reorder exercises response
 */
export interface ReorderExercisesResponse {
  exercises: Exercise[];
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * Query parameters for listing categories
 */
export interface CategoryListQuery {
  query?: string;
  limit?: number;
  offset?: number;
}
