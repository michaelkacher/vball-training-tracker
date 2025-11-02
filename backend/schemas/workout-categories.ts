/**
 * Zod Validation Schemas: Workout Categories Admin
 * Request/response validation for workout categories API
 */

import { z } from 'zod';

// ============================================================================
// Domain Schemas
// ============================================================================

/**
 * Exercise validation schema
 */
export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  sets: z.number().int().min(1).max(10),
  repetitions: z.string().min(1).max(50),
  difficulty: z.enum(['easy', 'medium', 'challenging']),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0),
});

/**
 * Category validation schema
 */
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  focusArea: z.string().min(1).max(100),
  keyObjective: z.string().min(1).max(500),
  exercises: z.array(ExerciseSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================================
// Request Validation Schemas
// ============================================================================

/**
 * Create category request schema
 */
export const CreateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  focusArea: z.string().min(1).max(100).trim(),
  keyObjective: z.string().min(1).max(500).trim(),
});

/**
 * Update category request schema
 * At least one field must be provided
 */
export const UpdateCategoryRequestSchema = z
  .object({
    name: z.string().min(1).max(100).trim().optional(),
    focusArea: z.string().min(1).max(100).trim().optional(),
    keyObjective: z.string().min(1).max(500).trim().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

/**
 * Create exercise request schema
 */
export const CreateExerciseRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  sets: z.number().int().min(1).max(10),
  repetitions: z.string().min(1).max(50).trim(),
  difficulty: z.enum(['easy', 'medium', 'challenging']),
  description: z.string().max(500).trim().optional(),
});

/**
 * Update exercise request schema
 * At least one field must be provided
 */
export const UpdateExerciseRequestSchema = z
  .object({
    name: z.string().min(1).max(100).trim().optional(),
    sets: z.number().int().min(1).max(10).optional(),
    repetitions: z.string().min(1).max(50).trim().optional(),
    difficulty: z.enum(['easy', 'medium', 'challenging']).optional(),
    description: z.string().max(500).trim().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

/**
 * Duplicate exercise request schema
 */
export const DuplicateExerciseRequestSchema = z.object({
  targetCategoryId: z.string().min(1),
});

/**
 * Reorder exercises request schema
 */
export const ReorderExercisesRequestSchema = z.object({
  exerciseIds: z.array(z.string()).min(1),
});

/**
 * List categories query parameters schema
 */
export const ListCategoriesQuerySchema = z.object({
  query: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});
