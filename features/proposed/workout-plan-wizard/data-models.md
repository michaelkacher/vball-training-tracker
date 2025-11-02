# Data Models: Workout Plan Wizard

## Deno KV Schema

### Workout Plans Collection
**Key Pattern:** `["workout_plan", planId]`

Stores complete workout plan documents with all wizard selections.

```
Key: ["workout_plan", "plan-abc123"]
Value: {
  id: string;
  userId: string;
  categoryId: string;
  startDate: string (ISO 8601 date, e.g., "2025-01-20");
  numberOfWeeks: number (1-12);
  selectedDays: number[] (array of 0-6, 0=Sunday, 6=Saturday);
  selectedExerciseIds: string[] (array of exercise IDs from the category);
  createdAt: string (ISO 8601 timestamp);
}
```

**Fields:**
- `id`: Unique identifier for the plan (generated as nanoid)
- `userId`: ID of the athlete who created the plan
- `categoryId`: Reference to the selected workout category
- `startDate`: Training start date in ISO 8601 format (YYYY-MM-DD)
- `numberOfWeeks`: Duration of the plan (1-12 weeks)
- `selectedDays`: Array of day indices (0-6) representing which days of the week to train
  - 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
  - Minimum 1 day required
  - Example: [1, 3, 5] = Monday, Wednesday, Friday
- `selectedExerciseIds`: Array of exercise IDs selected from the category
  - References exercise IDs from the category's exercises array
  - Minimum 1 exercise required
  - All must belong to the specified categoryId
- `createdAt`: ISO 8601 timestamp of when the plan was created

### User's Workout Plans Index
**Key Pattern:** `["user_workout_plans", userId, planId]`

Index for efficient querying of all plans belonging to a user.

```
Key: ["user_workout_plans", "user-456", "plan-abc123"]
Value: {
  id: string;
  categoryId: string;
  startDate: string;
  numberOfWeeks: number;
  createdAt: string;
}
```

**Purpose:**
- Enables efficient listing of all plans for a user
- Stores minimal data (summary) to keep index small
- Allows range queries: `kv.list({ prefix: ["user_workout_plans", userId] })`

---

## TypeScript Interfaces

### Domain Models

```typescript
// Days of week representation
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Complete workout plan entity
interface WorkoutPlan {
  id: string;
  userId: string;
  categoryId: string;
  startDate: string; // ISO 8601 date (YYYY-MM-DD)
  numberOfWeeks: number; // 1-12
  selectedDays: DayOfWeek[];
  selectedExerciseIds: string[];
  createdAt: string; // ISO 8601 timestamp
}

// Workout plan summary for list views
interface WorkoutPlanSummary {
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

// Workout plan with denormalized exercise details
interface WorkoutPlanDetail extends WorkoutPlan {
  categoryName: string;
  exercises: Exercise[]; // populated from the category
  totalSessions: number; // calculated
}

// Exercise details (from category, included in plan details)
interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: "easy" | "medium" | "challenging";
  description?: string;
}
```

### Request/Response DTOs

```typescript
// Create/submit workout plan request
interface CreateWorkoutPlanRequest {
  categoryId: string;
  startDate: string; // ISO 8601 date (YYYY-MM-DD)
  numberOfWeeks: number; // 1-12
  selectedDays: DayOfWeek[];
  selectedExerciseIds: string[];
}

// Create response (returned from POST endpoint)
interface CreateWorkoutPlanResponse {
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

// List workout plans response
interface ListWorkoutPlansResponse {
  plans: WorkoutPlanSummary[];
  total: number;
  offset: number;
  limit: number;
}

// Get workout plan detail response
interface GetWorkoutPlanResponse extends WorkoutPlanDetail {
  // Includes all WorkoutPlan fields plus:
  exercises: Exercise[];
  totalSessions: number;
}

// Standard error response
interface ErrorResponse {
  error: string; // Error code
  message: string;
  statusCode: number;
  timestamp: string;
}
```

### Wizard Step Models (Frontend State)

```typescript
// Wizard state for Step 1: Category Selection
interface WizardStep1State {
  selectedCategoryId: string | null;
}

// Wizard state for Step 2: Commitment Setup
interface WizardStep2State {
  startDate: string; // ISO 8601 date
  numberOfWeeks: number; // 1-12
  selectedDays: DayOfWeek[];
}

// Wizard state for Step 3: Exercise Selection
interface WizardStep3State {
  selectedExerciseIds: string[];
}

// Complete wizard form state
interface WorkoutPlanWizardForm {
  step1: WizardStep1State;
  step2: WizardStep2State;
  step3: WizardStep3State;
}
```

### Query Models

```typescript
// Query parameters for listing workout plans
interface ListWorkoutPlansQuery {
  categoryId?: string; // Filter by category
  limit?: number; // Default: 50, max: 1000
  offset?: number; // Default: 0
}
```

---

## Validation Schemas (Zod)

```typescript
import { z } from "zod";

// Helper to validate days of week
const DayOfWeekSchema = z.number().int().min(0).max(6);

// Workout plan validation
export const WorkoutPlanSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  categoryId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  numberOfWeeks: z.number().int().min(1).max(12),
  selectedDays: z.array(DayOfWeekSchema).min(1),
  selectedExerciseIds: z.array(z.string().min(1)).min(1),
  createdAt: z.string().datetime(),
});

// Create workout plan request validation
export const CreateWorkoutPlanRequestSchema = z.object({
  categoryId: z.string().min(1).trim(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be ISO 8601 date (YYYY-MM-DD)"),
  numberOfWeeks: z.number().int().min(1).max(12),
  selectedDays: z.array(DayOfWeekSchema).min(1, "At least one training day required"),
  selectedExerciseIds: z.array(z.string().min(1)).min(1, "At least one exercise required"),
});

// List workout plans query validation
export const ListWorkoutPlansQuerySchema = z.object({
  categoryId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

// Wizard step 1 validation
export const WizardStep1Schema = z.object({
  selectedCategoryId: z.string().min(1),
});

// Wizard step 2 validation
export const WizardStep2Schema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  numberOfWeeks: z.number().int().min(1).max(12),
  selectedDays: z.array(DayOfWeekSchema).min(1),
});

// Wizard step 3 validation
export const WizardStep3Schema = z.object({
  selectedExerciseIds: z.array(z.string().min(1)).min(1),
});
```

---

## Storage Strategy

### Primary Lookup
- Get specific plan: `["workout_plan", planId]`
- List user's plans: Range query on `["user_workout_plans", userId, ...]`

### Why Two Collections?
1. **["workout_plan", planId]**: Complete plan document
   - Stores all plan details for full retrieval
   - Referenced when viewing a specific plan detail
   - Used when deleting a plan

2. **["user_workout_plans", userId, planId]**: User's plan index
   - Enables efficient querying of all plans for a user
   - Stores summary data to keep index small
   - Allows O(1) lookup of user's plans with range queries
   - Makes it easy to filter by userId

### Data Denormalization
- Plan stores `categoryId` and `selectedExerciseIds` as references only
- Exercises are fetched from the category at read-time
- This avoids data duplication and keeps plans lightweight
- If an exercise is deleted from a category, the plan reference becomes invalid (handled gracefully)

### User Authorization
- userId is stored in the plan document
- API validates that request user matches plan owner before allowing reads/deletes
- Index pattern makes it easy to list only authenticated user's plans

---

## ID Generation Strategy

Use **nanoid** for all plan IDs:
- URL-safe base62 encoding
- Smaller than UUIDs (21 chars vs 36 chars)
- Cryptographically random
- Suitable for URLs and database keys

```typescript
import { nanoid } from "nanoid";

const planId = nanoid(); // e.g., "V1StGXR_Z5j3eK4m2n0p1q2"
```

---

## Validation Rules

### Startup Date
- Must be ISO 8601 format (YYYY-MM-DD)
- Must be today's date or later
- Validates at request time

### Week Range
- Must be between 1 and 12 inclusive
- Used with selectedDays to calculate totalSessions

### Selected Days
- Array of integers 0-6 (0=Sunday through 6=Saturday)
- Must contain at least 1 day
- No duplicates allowed
- Monday/Wednesday/Friday recommended as defaults in UI (indices 1, 3, 5)

### Exercise IDs
- Must be minimum 1 exercise selected
- All must be valid IDs that exist in the selected category
- Validated at creation time against current category state

### Category ID
- Must reference an existing workout category
- Validated at creation time

---

## Calculated Fields

Some fields are calculated based on stored data:

```typescript
// Total training sessions
totalSessions = numberOfWeeks * selectedDays.length;

// Example: 8 weeks × 3 days per week = 24 total sessions
```

This is calculated in responses but not stored in the database to maintain data integrity.

---

## Future Considerations

### Workout Progress Tracking
- Could extend with `completedSessions` array to track which sessions were completed
- Could add notes/modifications per session

### Plan Templates
- Could create reusable plan templates based on popular configurations
- Could add "clone plan" feature to duplicate previous plans

### Analytics
- Could add aggregate index for analytics (e.g., most popular categories)
- Could track plan completion rate by category

