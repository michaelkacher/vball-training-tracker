/**
 * API Routes: Workout Categories Admin
 * Hono route handlers for workout categories endpoints
 */

import { Context, Hono } from 'hono';
import { getKv } from '../../lib/kv.ts';
import {
  CreateCategoryRequestSchema,
  CreateExerciseRequestSchema,
  DuplicateExerciseRequestSchema,
  ListCategoriesQuerySchema,
  ReorderExercisesRequestSchema,
  UpdateCategoryRequestSchema,
  UpdateExerciseRequestSchema,
} from '../../schemas/workout-categories.ts';
import {
  addExercise,
  createCategory,
  deleteCategory,
  deleteExercise,
  duplicateExercise,
  getCategoryById,
  listCategories,
  NotFoundError,
  reorderExercises,
  updateCategory,
  updateExercise,
  ValidationError,
} from '../../services/workout-categories.ts';

const workoutCategories = new Hono();
const kv = await getKv();

// ============================================================================
// Category Routes
// ============================================================================

/**
 * GET /api/admin/workout-categories
 * List all workout categories with optional search/filter
 */
workoutCategories.get('/', async (c: Context) => {
  try {
    const query = c.req.query();
    const validatedQuery = ListCategoriesQuerySchema.parse(query);

    const result = await listCategories(kv, validatedQuery);

    return c.json(result, 200);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to list categories',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * POST /api/admin/workout-categories
 * Create a new workout category
 */
workoutCategories.post('/', async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = CreateCategoryRequestSchema.parse(body);

    const category = await createCategory(kv, validatedData);

    return c.json(category, 201);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message || 'Validation failed',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to create category',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * GET /api/admin/workout-categories/:id
 * Get a specific category with all exercises
 */
workoutCategories.get('/:id', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    const category = await getCategoryById(kv, categoryId);

    return c.json(category, 200);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to get category',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * PUT /api/admin/workout-categories/:id
 * Update category properties
 */
workoutCategories.put('/:id', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = UpdateCategoryRequestSchema.parse(body);

    const category = await updateCategory(kv, categoryId, validatedData);

    return c.json(category, 200);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message || 'Validation failed',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to update category',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * DELETE /api/admin/workout-categories/:id
 * Delete a workout category
 */
workoutCategories.delete('/:id', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    await deleteCategory(kv, categoryId);

    return c.body(null, 204);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to delete category',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

// ============================================================================
// Exercise Routes
// ============================================================================

/**
 * POST /api/admin/workout-categories/:id/exercises
 * Add a new exercise to a category
 */
workoutCategories.post('/:id/exercises', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = CreateExerciseRequestSchema.parse(body);

    const exercise = await addExercise(kv, categoryId, validatedData);

    return c.json(exercise, 201);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message || 'Validation failed',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to add exercise',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * PUT /api/admin/workout-categories/:id/exercises/:exerciseId
 * Update an exercise in a category
 */
workoutCategories.put('/:id/exercises/:exerciseId', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    const exerciseId = c.req.param('exerciseId');
    const body = await c.req.json();
    const validatedData = UpdateExerciseRequestSchema.parse(body);

    const exercise = await updateExercise(kv, categoryId, exerciseId, validatedData);

    return c.json(exercise, 200);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message || 'Validation failed',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to update exercise',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * DELETE /api/admin/workout-categories/:id/exercises/:exerciseId
 * Delete an exercise from a category
 */
workoutCategories.delete('/:id/exercises/:exerciseId', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    const exerciseId = c.req.param('exerciseId');

    await deleteExercise(kv, categoryId, exerciseId);

    return c.body(null, 204);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to delete exercise',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * POST /api/admin/workout-categories/:id/exercises/:exerciseId/duplicate
 * Duplicate an exercise within the same category or to a different category
 */
workoutCategories.post('/:id/exercises/:exerciseId/duplicate', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    const exerciseId = c.req.param('exerciseId');
    const body = await c.req.json();
    const validatedData = DuplicateExerciseRequestSchema.parse(body);

    const exercise = await duplicateExercise(kv, categoryId, exerciseId, validatedData);

    return c.json(exercise, 201);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message || 'Validation failed',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to duplicate exercise',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * PUT /api/admin/workout-categories/:id/exercises/reorder
 * Reorder exercises within a category
 */
workoutCategories.put('/:id/exercises/reorder', async (c: Context) => {
  try {
    const categoryId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = ReorderExercisesRequestSchema.parse(body);

    const result = await reorderExercises(kv, categoryId, validatedData);

    return c.json(result, 200);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message || 'Validation failed',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    if (error instanceof ValidationError) {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: error.message,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        400,
      );
    }

    if (error instanceof NotFoundError) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        },
        404,
      );
    }

    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to reorder exercises',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

export default workoutCategories;
