# Workout Categories Admin - Test Suite

Comprehensive test suite for the Workout Categories Admin feature following TDD principles (Red phase).

## Overview

This test suite provides **155+ test cases** covering all aspects of the workout categories admin feature, including:
- API endpoints
- Validation rules
- Business logic
- Deno KV storage operations
- Error handling

## Test Files

### 1. `workout-categories-admin.test.ts` (70+ tests)
**Integration tests** for all API endpoints defined in `api-spec.md`

#### Endpoints Covered:
- `GET /api/admin/workout-categories` - List categories with search/pagination
- `POST /api/admin/workout-categories` - Create new category
- `GET /api/admin/workout-categories/:id` - Get category by ID
- `PUT /api/admin/workout-categories/:id` - Update category
- `DELETE /api/admin/workout-categories/:id` - Delete category
- `POST /api/admin/workout-categories/:id/exercises` - Add exercise
- `PUT /api/admin/workout-categories/:id/exercises/:exerciseId` - Update exercise
- `DELETE /api/admin/workout-categories/:id/exercises/:exerciseId` - Delete exercise
- `POST /api/admin/workout-categories/:id/exercises/:exerciseId/duplicate` - Duplicate exercise
- `PUT /api/admin/workout-categories/:id/exercises/reorder` - Reorder exercises

#### Test Categories:
- **Success cases**: Valid requests return expected responses
- **Validation errors**: Invalid data returns 400 errors
- **Not found errors**: Non-existent resources return 404 errors
- **Edge cases**: Boundary conditions, empty arrays, special characters

### 2. `workout-categories-validation.test.ts` (60+ tests)
**Validation tests** for Zod schemas from `data-models.md`

#### Schemas Tested:
- `ExerciseSchema` - Full exercise validation
- `CategorySchema` - Full category validation
- `CreateCategoryRequestSchema` - Category creation validation
- `UpdateCategoryRequestSchema` - Category update validation (partial)
- `CreateExerciseRequestSchema` - Exercise creation validation
- `UpdateExerciseRequestSchema` - Exercise update validation (partial)
- `DuplicateExerciseRequestSchema` - Duplicate request validation
- `ReorderExercisesRequestSchema` - Reorder request validation

#### Validation Rules Tested:
- **Required fields**: All required fields must be present
- **String lengths**: Min/max character limits (1-100 for names, 1-500 for objectives)
- **Numeric ranges**: Sets must be 1-10, order must be >= 0
- **Enums**: Difficulty must be "easy", "medium", or "challenging"
- **UUIDs**: ID fields must be valid UUIDs
- **Timestamps**: Must be valid ISO 8601 datetime strings
- **Partial updates**: "At least one field" constraint for update schemas
- **Edge cases**: Unicode, whitespace, boundary values

### 3. `workout-categories-service.test.ts` (25+ tests)
**Service layer tests** for Deno KV operations and business logic

#### Areas Covered:
- **KV Storage Operations**
  - Store/retrieve categories
  - List with prefix
  - Atomic updates
  - Nested exercises storage

- **Business Logic**
  - ID generation (unique, using nanoid)
  - Timestamp management (createdAt, updatedAt)
  - Exercise ordering
  - Duplicate with "(Copy)" suffix logic
  - Reorder validation (all IDs, no duplicates)
  - Search functionality (case-insensitive)
  - Pagination logic

- **Error Handling**
  - Not found errors
  - Validation errors
  - Concurrent update handling

### 4. `fixtures/workout-categories.ts`
**Test data builders and fixtures**

#### Exports:
- **Type Definitions**: `Exercise`, `WorkoutCategory`, `WorkoutCategorySummary`
- **Builders**: `buildExercise()`, `buildCategory()`, `buildCategorySummary()`
- **Valid Data**: `validCategoryData`, `validExerciseData`, etc.
- **Invalid Data**: Comprehensive invalid data for each field
- **Utilities**: `buildCategoryWithExercises()`, `buildMultipleCategories()`, `createCategoryKvSeeds()`

#### Benefits:
- **Reusable**: Import fixtures across all test files
- **Type-safe**: Full TypeScript support
- **Comprehensive**: Covers all validation edge cases
- **Maintainable**: Change once, update everywhere

## Running Tests

### Run all workout categories tests:
```bash
deno test --allow-read --allow-env --allow-net --allow-write --unstable-kv tests/workout-categories*.test.ts
```

### Run specific test file:
```bash
# Integration tests
deno test --allow-read --allow-env --allow-net --allow-write --unstable-kv tests/workout-categories-admin.test.ts

# Validation tests
deno test --allow-read --allow-env --allow-net --allow-write --unstable-kv tests/workout-categories-validation.test.ts

# Service tests
deno test --allow-read --allow-env --allow-net --allow-write --unstable-kv tests/workout-categories-service.test.ts
```

### Run with watch mode:
```bash
deno test --watch --allow-read --allow-env --allow-net --allow-write --unstable-kv tests/workout-categories*.test.ts
```

### Skip type checking (faster):
```bash
deno test --no-check --allow-read --allow-env --allow-net --allow-write --unstable-kv tests/workout-categories*.test.ts
```

## Test Status: RED PHASE ✅

These tests are intentionally in the **RED phase** of TDD:
- ✅ Tests are written and type-check correctly
- ❌ Tests will FAIL because implementation doesn't exist yet
- 🎯 Next step: Implement the feature to make tests pass (GREEN phase)

## Implementation Checklist

To complete the feature, implement the following:

### 1. Zod Schemas (`backend/schemas/workout-categories.ts`)
- [ ] `ExerciseSchema`
- [ ] `CategorySchema`
- [ ] `CreateCategoryRequestSchema`
- [ ] `UpdateCategoryRequestSchema`
- [ ] `CreateExerciseRequestSchema`
- [ ] `UpdateExerciseRequestSchema`
- [ ] `DuplicateExerciseRequestSchema`
- [ ] `ReorderExercisesRequestSchema`

### 2. Service Layer (`backend/services/workout-categories.ts`)
- [ ] `listCategories(kv, options)` - List with search/pagination
- [ ] `createCategory(kv, data)` - Create new category
- [ ] `getCategoryById(kv, id)` - Get by ID
- [ ] `updateCategory(kv, id, data)` - Update category
- [ ] `deleteCategory(kv, id)` - Delete category
- [ ] `addExercise(kv, categoryId, data)` - Add exercise
- [ ] `updateExercise(kv, categoryId, exerciseId, data)` - Update exercise
- [ ] `deleteExercise(kv, categoryId, exerciseId)` - Delete exercise
- [ ] `duplicateExercise(kv, categoryId, exerciseId, target)` - Duplicate
- [ ] `reorderExercises(kv, categoryId, exerciseIds)` - Reorder

### 3. API Routes (`backend/routes/admin/workout-categories.ts`)
- [ ] GET `/api/admin/workout-categories`
- [ ] POST `/api/admin/workout-categories`
- [ ] GET `/api/admin/workout-categories/:id`
- [ ] PUT `/api/admin/workout-categories/:id`
- [ ] DELETE `/api/admin/workout-categories/:id`
- [ ] POST `/api/admin/workout-categories/:id/exercises`
- [ ] PUT `/api/admin/workout-categories/:id/exercises/:exerciseId`
- [ ] DELETE `/api/admin/workout-categories/:id/exercises/:exerciseId`
- [ ] POST `/api/admin/workout-categories/:id/exercises/:exerciseId/duplicate`
- [ ] PUT `/api/admin/workout-categories/:id/exercises/reorder`

### 4. Type Definitions (`backend/types/workout-categories.ts`)
- [ ] Export all interfaces from data-models.md

## Key Testing Patterns

### 1. Test Structure
```typescript
Deno.test('Feature - specific behavior', async () => {
  const cleanup = await setup();

  try {
    // Arrange - Set up test data
    // Act - Call the function
    // Assert - Verify results
  } finally {
    await cleanup();
  }
});
```

### 2. Using Fixtures
```typescript
import { buildCategory, validCategoryData } from './fixtures/workout-categories.ts';

// Use builder for custom data
const category = buildCategory({ name: 'Custom Name' });

// Use valid data for standard tests
const result = await createCategory(kv, validCategoryData);
```

### 3. Testing KV Operations
```typescript
import { setupTestKv, listKvEntries } from './helpers/kv-test.ts';

const { kv, cleanup } = await setupTestKv();
await kv.set(['workout_category', 'cat-1'], category);
const entries = await listKvEntries(kv, ['workout_category']);
```

## Test Coverage Goals

- ✅ **100% endpoint coverage** - All API endpoints tested
- ✅ **100% validation coverage** - All Zod schemas tested
- ✅ **Success + error paths** - Both happy and sad paths
- ✅ **Edge cases** - Boundary conditions, special characters
- ✅ **Business logic** - Ordering, duplication, search
- ✅ **Integration** - Tests use actual Deno KV (in-memory)

## Benefits of This Approach

1. **Clear Contract**: Tests define exactly what the feature should do
2. **Regression Safety**: Future changes won't break existing behavior
3. **Documentation**: Tests serve as executable specifications
4. **Confidence**: Know when implementation is complete (all tests green)
5. **Maintainability**: Well-organized, reusable test utilities

## Next Steps

1. **Run tests** to verify they fail (RED phase)
2. **Implement schemas** in `backend/schemas/workout-categories.ts`
3. **Implement service layer** in `backend/services/workout-categories.ts`
4. **Implement API routes** in `backend/routes/admin/workout-categories.ts`
5. **Run tests** again - they should pass (GREEN phase)
6. **Refactor** if needed while keeping tests green

## References

- API Spec: `features/proposed/workout-categories-admin/api-spec.md`
- Data Models: `features/proposed/workout-categories-admin/data-models.md`
- Test Helpers: `tests/helpers/kv-test.ts`
- Test Patterns: `tests/helpers/test-data-patterns.ts`
