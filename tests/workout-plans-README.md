# Workout Plan Wizard Test Suite

Comprehensive test suite for the workout-plan-wizard feature following TDD principles (Red phase).

## Overview

This test suite provides complete coverage for the workout plan wizard feature, including:
- API endpoint integration tests
- Service layer business logic tests
- Zod schema validation tests
- Test fixtures and builders

## Test Files

### 1. `workout-plans-api.test.ts` (Integration Tests)
Tests all API endpoints defined in `features/proposed/workout-plan-wizard/api-spec.md`:

**POST /api/workout-plans** - Create Workout Plan
- ✅ Creates plan with valid data
- ✅ Generates unique plan IDs
- ✅ Calculates totalSessions correctly
- ✅ Validates all required fields
- ✅ Validates category exists
- ✅ Validates exercises belong to category
- ✅ Returns 400 for validation errors
- ✅ Returns 401 for unauthenticated users
- ✅ Returns 404 for non-existent category/exercises

**GET /api/workout-plans** - List Workout Plans
- ✅ Returns empty list when no plans exist
- ✅ Lists all plans for authenticated user
- ✅ Isolates plans by user
- ✅ Respects pagination (limit, offset)
- ✅ Filters by categoryId
- ✅ Returns summary format with computed fields (exerciseCount, totalSessions)
- ✅ Returns 401 for unauthenticated users
- ✅ Returns 400 for invalid query parameters

**GET /api/workout-plans/:id** - Get Workout Plan Detail
- ✅ Returns full plan with exercise details
- ✅ Denormalizes exercise details from category
- ✅ Includes totalSessions calculation
- ✅ Returns 404 for non-existent plan
- ✅ Returns 403 when user does not own plan
- ✅ Returns 401 for unauthenticated users

**DELETE /api/workout-plans/:id** - Delete Workout Plan
- ✅ Deletes plan successfully
- ✅ Removes from both KV collections (plan + index)
- ✅ Returns 404 for non-existent plan
- ✅ Returns 403 when user does not own plan
- ✅ Returns 401 for unauthenticated users

**Error Response Format**
- ✅ Standard error format for all error types
- ✅ Includes error code, message, statusCode, timestamp

**Integration with Workout Categories**
- ✅ Validates category exists before creating plan
- ✅ Validates exercises belong to selected category
- ✅ Handles deleted category gracefully

### 2. `workout-plans-service.test.ts` (Service Layer Tests)
Tests business logic and Deno KV operations:

**Deno KV Storage**
- ✅ Stores workout plan at correct key pattern: `["workout_plan", planId]`
- ✅ Stores user plan index at: `["user_workout_plans", userId, planId]`
- ✅ Retrieves plan by ID
- ✅ Lists all plans for a user with prefix
- ✅ Isolates plans between users
- ✅ Deletes plan and index atomically

**Create Workout Plan**
- ✅ Generates unique ID (nanoid)
- ✅ Sets createdAt timestamp
- ✅ Associates plan with userId
- ✅ Stores in both KV collections
- ✅ Calculates totalSessions correctly
- ✅ Validates category exists
- ✅ Validates all exercises belong to category
- ✅ Validates at least one exercise selected

**Get Workout Plan by ID**
- ✅ Returns full plan details
- ✅ Denormalizes exercise details from category
- ✅ Calculates totalSessions
- ✅ Throws for non-existent plan
- ✅ Enforces user ownership
- ✅ Handles deleted exercises gracefully

**List Workout Plans**
- ✅ Returns empty list when no plans
- ✅ Returns all plans for user
- ✅ Isolates plans by user
- ✅ Respects pagination
- ✅ Filters by categoryId
- ✅ Returns summary format with counts

**Delete Workout Plan**
- ✅ Removes from both collections
- ✅ Throws for non-existent plan
- ✅ Enforces user ownership

**Helper Functions**
- ✅ calculateTotalSessions computes correctly

**Error Handling**
- ✅ Handles concurrent updates gracefully
- ✅ Handles KV connection errors
- ✅ Handles deleted category gracefully

### 3. `workout-plans-validation.test.ts` (Zod Schema Tests)
Tests all validation rules from `features/proposed/workout-plan-wizard/data-models.md`:

**DayOfWeek Schema**
- ✅ Validates all valid day values (0-6)
- ✅ Rejects negative values
- ✅ Rejects values > 6
- ✅ Rejects non-integer values
- ✅ Rejects string values

**WorkoutPlan Schema**
- ✅ Validates complete workout plan
- ✅ Validates startDate format (YYYY-MM-DD)
- ✅ Rejects invalid date formats
- ✅ Validates numberOfWeeks range (1-12)
- ✅ Validates selectedDays array
- ✅ Validates selectedExerciseIds array
- ✅ Validates createdAt as ISO timestamp
- ✅ Rejects empty arrays for days/exercises

**CreateWorkoutPlanRequest Schema**
- ✅ Validates valid request
- ✅ Validates minimum weeks plan (1 week)
- ✅ Validates maximum weeks plan (12 weeks)
- ✅ Validates weekend only plan
- ✅ Trims whitespace from categoryId
- ✅ Accepts today as start date (minimum)
- ✅ Accepts future start date
- ✅ Rejects past start date
- ✅ Rejects all missing/invalid fields
- ✅ Comprehensive validation error testing

**ListWorkoutPlansQuery Schema**
- ✅ Validates empty query (uses defaults)
- ✅ Validates with pagination parameters
- ✅ Validates with category filter
- ✅ Coerces string values to numbers
- ✅ Rejects negative limit/offset
- ✅ Rejects limit > 1000
- ✅ categoryId is optional

**Edge Cases**
- ✅ Handles leap year dates correctly
- ✅ Validates all days of week selection (0-6)
- ✅ Validates single day/exercise selection
- ✅ Validates many exercises selection
- ✅ Provides helpful error messages

### 4. `fixtures/workout-plans.ts` (Test Fixtures)
Reusable test data builders and fixtures:

**Type Definitions**
- DayOfWeek type (0-6)
- Exercise interface
- WorkoutPlan interface
- WorkoutPlanSummary interface
- WorkoutPlanDetail interface
- WorkoutCategory interface

**Builders**
- `buildExercise()` - Create exercise with defaults
- `buildExercises(count)` - Create multiple exercises
- `buildCategory()` - Create category with defaults
- `buildCategoryWithExercises(count)` - Category with exercises
- `buildWorkoutPlan()` - Create workout plan with defaults
- `buildWorkoutPlanSummary()` - Create plan summary
- `buildMultiplePlans(count, userId)` - Create multiple plans

**KV Seed Helpers**
- `createWorkoutPlanKvSeeds(plans)` - Generate main collection seeds
- `createUserPlanIndexSeeds(plans)` - Generate index collection seeds
- `createCategoryKvSeeds(categories)` - Generate category seeds

**Valid Request Data**
- `validCreatePlanRequest` - Valid plan creation data
- `validCreatePlanVariations` - Edge case valid data (min/max weeks, etc.)
- `validListPlansQuery` - Valid query parameters

**Invalid Request Data**
- `invalidCreatePlanRequest` - Comprehensive invalid data cases
- `invalidListPlansQuery` - Invalid query parameters

**Helper Functions**
- `calculateTotalSessions(weeks, days)` - Compute total sessions
- `getTodayDateString()` - Get today's date in ISO format
- `getFutureDateString(daysFromNow)` - Get future date
- `getPastDateString(daysAgo)` - Get past date

## Running Tests

### Run all workout plan tests:
```bash
deno test tests/workout-plans-*.test.ts
```

### Run specific test file:
```bash
deno test tests/workout-plans-api.test.ts
deno test tests/workout-plans-service.test.ts
deno test tests/workout-plans-validation.test.ts
```

### Run with coverage:
```bash
deno test --coverage=coverage tests/workout-plans-*.test.ts
```

## Test Coverage

The test suite provides comprehensive coverage for:

### API Endpoints (4 endpoints, 50+ tests)
- POST /api/workout-plans (20+ tests)
- GET /api/workout-plans (15+ tests)
- GET /api/workout-plans/:id (7+ tests)
- DELETE /api/workout-plans/:id (5+ tests)
- Error response format (3+ tests)

### Validation Rules (80+ tests)
- DayOfWeek schema (5 tests)
- WorkoutPlan schema (10+ tests)
- CreateWorkoutPlanRequest schema (30+ tests)
- ListWorkoutPlansQuery schema (12+ tests)
- Edge cases and special validation (20+ tests)

### Business Logic (60+ tests)
- KV storage operations (6 tests)
- Create workout plan (8+ tests)
- Get workout plan (6+ tests)
- List workout plans (6+ tests)
- Delete workout plan (3+ tests)
- Helper functions (1+ tests)
- Error handling (3+ tests)

**Total: 190+ tests**

## TDD Red Phase

These tests are written following TDD principles and are currently in the **Red phase**:
- ❌ All tests will FAIL until implementation is complete
- ✅ Tests define the contract and expected behavior
- ✅ Tests guide implementation with clear requirements
- ✅ Tests include TODO comments for implementation points

## Next Steps (Green Phase)

To move to the Green phase:

1. **Implement Zod Schemas** (`backend/schemas/workout-plans.ts`)
   - WorkoutPlanSchema
   - CreateWorkoutPlanRequestSchema
   - ListWorkoutPlansQuerySchema
   - DayOfWeekSchema

2. **Implement Service Layer** (`backend/services/workout-plans.ts`)
   - createWorkoutPlan(kv, userId, data)
   - getWorkoutPlanById(kv, userId, planId)
   - listWorkoutPlans(kv, userId, query)
   - deleteWorkoutPlan(kv, userId, planId)

3. **Implement API Routes** (`backend/routes/workout-plans.ts`)
   - POST /api/workout-plans
   - GET /api/workout-plans
   - GET /api/workout-plans/:id
   - DELETE /api/workout-plans/:id

4. **Run tests and fix implementation until all tests pass**
   ```bash
   deno test tests/workout-plans-*.test.ts
   ```

## Implementation Checklist

### Zod Schemas
- [ ] DayOfWeekSchema (integer 0-6)
- [ ] WorkoutPlanSchema (full plan validation)
- [ ] CreateWorkoutPlanRequestSchema (with date validation)
- [ ] ListWorkoutPlansQuerySchema (with coercion)

### Service Layer
- [ ] createWorkoutPlan function
  - [ ] Generate unique ID with nanoid
  - [ ] Validate category exists
  - [ ] Validate exercises belong to category
  - [ ] Store in both KV collections
  - [ ] Calculate totalSessions
- [ ] getWorkoutPlanById function
  - [ ] Enforce user ownership
  - [ ] Denormalize exercise details
  - [ ] Calculate totalSessions
- [ ] listWorkoutPlans function
  - [ ] Isolate by user
  - [ ] Support pagination
  - [ ] Support category filter
  - [ ] Return summary format
- [ ] deleteWorkoutPlan function
  - [ ] Enforce user ownership
  - [ ] Delete from both collections

### API Routes
- [ ] POST /api/workout-plans
- [ ] GET /api/workout-plans
- [ ] GET /api/workout-plans/:id
- [ ] DELETE /api/workout-plans/:id
- [ ] Standard error response format
- [ ] Authentication middleware

## Test Data Patterns

The test suite uses consistent patterns:

### Builders
All fixtures use the `createBuilder` pattern for flexible test data creation:
```typescript
const plan = buildWorkoutPlan({
  userId: 'user-123',
  numberOfWeeks: 8,
  selectedDays: [1, 3, 5],
});
```

### KV Seeds
Seeds follow the documented key patterns:
```typescript
// Main collection
["workout_plan", planId]

// User index
["user_workout_plans", userId, planId]
```

### User Isolation
Tests consistently verify user isolation:
- Users can only see their own plans
- Users cannot access other users' plans
- Authorization is enforced at service layer

## Key Validation Rules

From `data-models.md`:

- **categoryId**: Required, string, must exist
- **startDate**: ISO 8601 date (YYYY-MM-DD), minimum today
- **numberOfWeeks**: Integer, range 1-12
- **selectedDays**: Array of integers 0-6, minimum 1 day
- **selectedExerciseIds**: Array of strings, minimum 1, all must belong to category
- **totalSessions**: Calculated field (numberOfWeeks * selectedDays.length)

## Error Codes

Standard error response format:
```typescript
{
  error: "ERROR_CODE",
  message: "Human-readable message",
  statusCode: 400,
  timestamp: "2025-01-15T10:35:00Z"
}
```

Error codes:
- `VALIDATION_ERROR` (400) - Invalid request data
- `UNAUTHORIZED` (401) - User not authenticated
- `FORBIDDEN` (403) - User lacks permission
- `NOT_FOUND` (404) - Resource not found
- `INTERNAL_SERVER_ERROR` (500) - Unexpected errors

## References

- API Spec: `features/proposed/workout-plan-wizard/api-spec.md`
- Data Models: `features/proposed/workout-plan-wizard/data-models.md`
- Similar tests: `tests/workout-categories-*.test.ts`
