/**
 * Zod Validation Schemas: Workout Plans
 * Request/response validation for workout plan wizard API
 */

import { z } from 'zod';

// ============================================================================
// Helper Schemas
// ============================================================================

/**
 * Day of week validation (0=Sunday, 6=Saturday)
 */
export const DayOfWeekSchema = z.number().int().min(0).max(6);

/**
 * ISO 8601 date format validator (YYYY-MM-DD)
 */
const ISO8601DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be ISO 8601 date (YYYY-MM-DD)');

/**
 * Date validator that ensures date is today or in the future
 */
const FutureDateSchema = ISO8601DateSchema.refine((dateStr) => {
  const inputDate = new Date(dateStr + 'T00:00:00'); // Parse as local date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  return inputDate >= today;
}, {
  message: 'Start date must be today or in the future',
});

// ============================================================================
// Domain Schemas
// ============================================================================

/**
 * Workout plan validation
 */
export const WorkoutPlanSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  categoryId: z.string().min(1),
  startDate: ISO8601DateSchema,
  numberOfWeeks: z.number().int().min(1).max(12),
  selectedDays: z.array(DayOfWeekSchema).min(1),
  selectedExerciseIds: z.array(z.string().min(1)).min(1),
  createdAt: z.string().datetime(),
});

// ============================================================================
// Request Validation Schemas
// ============================================================================

/**
 * Create workout plan request validation
 */
export const CreateWorkoutPlanRequestSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required').trim(),
  startDate: FutureDateSchema,
  numberOfWeeks: z.number().int().min(1, 'Must be at least 1 week').max(12, 'Cannot exceed 12 weeks'),
  selectedDays: z.array(DayOfWeekSchema).min(1, 'At least one training day required'),
  selectedExerciseIds: z.array(z.string().min(1)).min(1, 'At least one exercise required'),
});

/**
 * List workout plans query validation
 */
export const ListWorkoutPlansQuerySchema = z.object({
  categoryId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

// ============================================================================
// Wizard Step Validation Schemas
// ============================================================================

/**
 * Wizard step 1 validation (category selection)
 */
export const WizardStep1Schema = z.object({
  selectedCategoryId: z.string().min(1),
});

/**
 * Wizard step 2 validation (commitment setup)
 */
export const WizardStep2Schema = z.object({
  startDate: FutureDateSchema,
  numberOfWeeks: z.number().int().min(1).max(12),
  selectedDays: z.array(DayOfWeekSchema).min(1),
});

/**
 * Wizard step 3 validation (exercise selection)
 */
export const WizardStep3Schema = z.object({
  selectedExerciseIds: z.array(z.string().min(1)).min(1),
});
