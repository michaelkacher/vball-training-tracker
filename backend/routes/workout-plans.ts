/**
 * API Routes: Workout Plans
 * Hono route handlers for workout plan wizard endpoints
 */

import { Context, Hono } from 'hono';
import { getKv } from '../lib/kv.ts';
import { authenticate } from '../middleware/auth.ts';
import {
  CreateWorkoutPlanRequestSchema,
  ListWorkoutPlansQuerySchema,
} from '../schemas/workout-plans.ts';
import {
  createWorkoutPlan,
  deleteWorkoutPlan,
  ForbiddenError,
  getWorkoutPlanById,
  listWorkoutPlans,
  NotFoundError,
  ValidationError,
} from '../services/workout-plans.ts';

const workoutPlans = new Hono();
const kv = await getKv();

// Apply authentication middleware to all routes
workoutPlans.use('*', authenticate);

// ============================================================================
// Workout Plan Routes
// ============================================================================

/**
 * POST /api/workout-plans
 * Create a new workout plan
 */
workoutPlans.post('/', async (c: Context) => {
  try {
    const user = c.get('user');
    const userId = user?.userId || user?.id;

    if (!userId) {
      return c.json(
        {
          error: 'UNAUTHORIZED',
          message: 'User not authenticated',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
        401,
      );
    }

    const body = await c.req.json();
    const validatedData = CreateWorkoutPlanRequestSchema.parse(body);

    const plan = await createWorkoutPlan(kv, userId, validatedData);

    return c.json(plan, 201);
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      return c.json(
        {
          error: 'VALIDATION_ERROR',
          message: (error as { errors?: Array<{ message?: string }> }).errors?.[0]?.message ||
            'Validation failed',
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

    console.error('Error creating workout plan:', error);
    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to create workout plan',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * GET /api/workout-plans
 * List all workout plans for authenticated user
 */
workoutPlans.get('/', async (c: Context) => {
  try {
    const user = c.get('user');
    const userId = user?.userId || user?.id;

    if (!userId) {
      return c.json(
        {
          error: 'UNAUTHORIZED',
          message: 'User not authenticated',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
        401,
      );
    }

    const query = c.req.query();
    const validatedQuery = ListWorkoutPlansQuerySchema.parse(query);

    const result = await listWorkoutPlans(kv, userId, validatedQuery);

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

    console.error('Error listing workout plans:', error);
    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to list workout plans',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * GET /api/workout-plans/:id
 * Get a specific workout plan with full details
 */
workoutPlans.get('/:id', async (c: Context) => {
  try {
    const user = c.get('user');
    const userId = user?.userId || user?.id;

    if (!userId) {
      return c.json(
        {
          error: 'UNAUTHORIZED',
          message: 'User not authenticated',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
        401,
      );
    }

    const planId = c.req.param('id');
    const plan = await getWorkoutPlanById(kv, userId, planId);

    return c.json(plan, 200);
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

    if (error instanceof ForbiddenError) {
      return c.json(
        {
          error: 'FORBIDDEN',
          message: error.message,
          statusCode: 403,
          timestamp: new Date().toISOString(),
        },
        403,
      );
    }

    console.error('Error getting workout plan:', error);
    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to get workout plan',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * DELETE /api/workout-plans/:id
 * Delete a workout plan
 */
workoutPlans.delete('/:id', async (c: Context) => {
  try {
    const user = c.get('user');
    const userId = user?.userId || user?.id;

    if (!userId) {
      return c.json(
        {
          error: 'UNAUTHORIZED',
          message: 'User not authenticated',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
        401,
      );
    }

    const planId = c.req.param('id');
    await deleteWorkoutPlan(kv, userId, planId);

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

    if (error instanceof ForbiddenError) {
      return c.json(
        {
          error: 'FORBIDDEN',
          message: error.message,
          statusCode: 403,
          timestamp: new Date().toISOString(),
        },
        403,
      );
    }

    console.error('Error deleting workout plan:', error);
    return c.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to delete workout plan',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

export default workoutPlans;
