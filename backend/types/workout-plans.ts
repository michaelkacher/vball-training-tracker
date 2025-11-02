/**
 * Type Definitions: Workout Plans
 * TypeScript interfaces for workout plan wizard
 */

// ============================================================================
// Domain Types
// ============================================================================

/**
 * Day of week representation (0=Sunday, 6=Saturday)
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Exercise details (from category)
 */
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  description?: string;
}

/**
 * Complete workout plan entity
 */
export interface WorkoutPlan {
  id: string;
  userId: string;
  categoryId: string;
  startDate: string; // ISO 8601 date (YYYY-MM-DD)
  numberOfWeeks: number; // 1-12
  selectedDays: DayOfWeek[];
  selectedExerciseIds: string[];
  createdAt: string; // ISO 8601 timestamp
}

/**
 * Workout plan summary for list views
 */
export interface WorkoutPlanSummary {
  id: string;
  categoryId: string;
  categoryName: string;
  startDate: string;
  numberOfWeeks: number;
  selectedDays: DayOfWeek[];
  exerciseCount: number;
  totalSessions: number; // calculated: numberOfWeeks * selectedDays.length
  createdAt: string;
}

/**
 * Workout plan with denormalized exercise details
 */
export interface WorkoutPlanDetail extends WorkoutPlan {
  categoryName: string;
  exercises: Exercise[]; // populated from the category
  totalSessions: number; // calculated
}

// ============================================================================
// Request/Response DTOs
// ============================================================================

/**
 * Create/submit workout plan request
 */
export interface CreateWorkoutPlanRequest {
  categoryId: string;
  startDate: string; // ISO 8601 date (YYYY-MM-DD)
  numberOfWeeks: number; // 1-12
  selectedDays: DayOfWeek[];
  selectedExerciseIds: string[];
}

/**
 * Create response (returned from POST endpoint)
 */
export interface CreateWorkoutPlanResponse {
  id: string;
  userId: string;
  categoryId: string;
  startDate: string;
  numberOfWeeks: number;
  selectedDays: DayOfWeek[];
  selectedExerciseIds: string[];
  totalSessions: number; // calculated
  createdAt: string;
}

/**
 * List workout plans response
 */
export interface ListWorkoutPlansResponse {
  plans: WorkoutPlanSummary[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Query parameters for listing workout plans
 */
export interface ListWorkoutPlansQuery {
  categoryId?: string; // Filter by category
  limit?: number; // Default: 50, max: 1000
  offset?: number; // Default: 0
}

/**
 * Standard error response
 */
export interface ErrorResponse {
  error: string; // Error code
  message: string;
  statusCode: number;
  timestamp: string;
}
