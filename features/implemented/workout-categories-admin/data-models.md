# Data Models: Workout Categories Admin

## Deno KV Schema

### Categories Collection
**Key Pattern:** `["workout_category", categoryId]`

Stores complete category documents with exercises as nested array.

```
Key: ["workout_category", "cat-123"]
Value: {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exercises: Exercise[];
  createdAt: string (ISO 8601);
  updatedAt: string (ISO 8601);
}
```

**Fields:**
- `id`: Unique identifier (generated as UUID v4 or nanoid)
- `name`: Category name (1-100 chars)
- `focusArea`: Training focus area (1-100 chars)
- `keyObjective`: Primary training objective (1-500 chars)
- `exercises`: Array of Exercise objects, ordered by `order` field
- `createdAt`: ISO timestamp when created
- `updatedAt`: ISO timestamp of last modification

### Exercises (Nested in Category)
Exercises are stored as a nested array within each category document. Each exercise has:

```
{
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: "easy" | "medium" | "challenging";
  description: string;
  order: number;
}
```

**Fields:**
- `id`: Unique identifier (generated per exercise)
- `name`: Exercise name (1-100 chars)
- `sets`: Number of sets (1-10)
- `repetitions`: Rep range as string, e.g., "10", "8-12", "As many as possible" (1-50 chars)
- `difficulty`: One of "easy", "medium", "challenging"
- `description`: Optional details (0-500 chars)
- `order`: Position in exercise list (0-based index, updated on reorder)

### Categories List Index (Optional, for optimization)
**Key Pattern:** `["workout_categories_list"]`

Optional index to speed up listing categories. Stores array of category summaries.

```
Key: ["workout_categories_list"]
Value: {
  categories: Array<{
    id: string;
    name: string;
    focusArea: string;
    exerciseCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  lastUpdated: string (ISO 8601);
}
```

This index is updated whenever a category is created, updated, or deleted.

---

## TypeScript Interfaces

### Domain Models

```typescript
// Exercise in a workout category
interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: "easy" | "medium" | "challenging";
  description: string;
  order: number;
}

// Workout category with exercises
interface WorkoutCategory {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

// Summary of category for list views
interface WorkoutCategorySummary {
  id: string;
  name: string;
  focusArea: string;
  exerciseCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Request/Response DTOs

```typescript
// Create category request
interface CreateCategoryRequest {
  name: string;
  focusArea: string;
  keyObjective: string;
}

// Update category request
interface UpdateCategoryRequest {
  name?: string;
  focusArea?: string;
  keyObjective?: string;
}

// Create exercise request
interface CreateExerciseRequest {
  name: string;
  sets: number;
  repetitions: string;
  difficulty: "easy" | "medium" | "challenging";
  description?: string;
}

// Update exercise request
interface UpdateExerciseRequest {
  name?: string;
  sets?: number;
  repetitions?: string;
  difficulty?: "easy" | "medium" | "challenging";
  description?: string;
}

// Duplicate exercise request
interface DuplicateExerciseRequest {
  targetCategoryId: string;
}

// Reorder exercises request
interface ReorderExercisesRequest {
  exerciseIds: string[];
}

// List categories response
interface ListCategoriesResponse {
  categories: WorkoutCategorySummary[];
  total: number;
  offset: number;
  limit: number;
}

// Standard error response
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
```

### Search/Filter Models

```typescript
// Query parameters for listing categories
interface CategoryListQuery {
  query?: string;
  limit?: number;
  offset?: number;
}

// Filter options (for future enhancement)
interface CategorySearchFilters {
  query?: string;
  difficulty?: "easy" | "medium" | "challenging";
}
```

---

## Validation Schemas (Zod)

```typescript
import { z } from "zod";

// Category validation
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  focusArea: z.string().min(1).max(100),
  keyObjective: z.string().min(1).max(500),
  exercises: z.array(ExerciseSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Exercise validation
export const ExerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  sets: z.number().int().min(1).max(10),
  repetitions: z.string().min(1).max(50),
  difficulty: z.enum(["easy", "medium", "challenging"]),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0),
});

// Request validation
export const CreateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(100),
  focusArea: z.string().min(1).max(100),
  keyObjective: z.string().min(1).max(500),
});

export const UpdateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  focusArea: z.string().min(1).max(100).optional(),
  keyObjective: z.string().min(1).max(500).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export const CreateExerciseRequestSchema = z.object({
  name: z.string().min(1).max(100),
  sets: z.number().int().min(1).max(10),
  repetitions: z.string().min(1).max(50),
  difficulty: z.enum(["easy", "medium", "challenging"]),
  description: z.string().max(500).optional(),
});

export const UpdateExerciseRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  sets: z.number().int().min(1).max(10).optional(),
  repetitions: z.string().min(1).max(50).optional(),
  difficulty: z.enum(["easy", "medium", "challenging"]).optional(),
  description: z.string().max(500).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export const DuplicateExerciseRequestSchema = z.object({
  targetCategoryId: z.string().uuid(),
});

export const ReorderExercisesRequestSchema = z.object({
  exerciseIds: z.array(z.string().uuid()).min(1),
});
```

---

## Storage Strategy

### Why Nested Exercises?
Exercises are stored as a nested array within categories because:
1. **Strong ownership relationship**: Exercises only exist within a category context
2. **Atomic operations**: Category updates and exercise updates are transactional together
3. **Simpler queries**: No need to join multiple collections
4. **Small data size**: Most categories won't have excessive exercises (typically 5-20)

### Alternative Considered
Separate `["exercise", exerciseId]` collection was considered but rejected because:
- Categories would need to maintain exercise ID references
- Deleting a category would require cascading deletes
- Exercise updates would be split from category context
- No performance benefit for this use case

### Indexing Strategy
- **Primary lookup**: Get category by ID → `["workout_category", id]`
- **List all categories**: Use optional index at `["workout_categories_list"]` for fast retrieval
- **Search categories**: Iterate through index or all categories (small dataset expected)
- **Exercise queries**: All within category, no separate indexing needed

### Caching Considerations
For frontend optimization:
- Cache full categories list after first fetch
- Cache individual categories after viewing
- Invalidate cache on create/update/delete operations
- Consider SWR (stale-while-revalidate) pattern for categories list

---

## ID Generation Strategy

Use **nanoid** for all IDs (both categories and exercises) for:
- URL-safe base62 encoding
- Smaller than UUIDs (21 chars vs 36 chars)
- Cryptographically random
- Easy to use in URLs and database keys

```typescript
import { nanoid } from "nanoid";

const categoryId = nanoid(); // e.g., "V1StGXR_Z5j3eK4m2n0p1q2"
const exerciseId = nanoid();
```
