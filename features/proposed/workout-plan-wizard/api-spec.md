# API Specification: Workout Plan Wizard

## Base Path
`/api/workout-plans`

## Endpoints

### GET /api/workout-categories
**Description:** Retrieve all available workout categories with exercises (EXISTING - from workout-categories-admin)

Used by Step 1 of the wizard to display category selection cards and by Step 3 to fetch exercises for the selected category.

**Query Parameters:**
- None required

**Response:** 200 OK
```json
{
  "categories": [
    {
      "id": "cat-123",
      "name": "Jumping",
      "focusArea": "Vertical Power",
      "keyObjective": "Develop explosive vertical jump",
      "exercises": [
        {
          "id": "ex-456",
          "name": "Box Jump",
          "sets": 4,
          "repetitions": "6-8",
          "difficulty": "challenging",
          "description": "Explosive box jump for power development",
          "order": 1
        }
      ],
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 6,
  "offset": 0,
  "limit": 50
}
```

**Errors:**
- 500 Internal Server Error: Database failure

---

### POST /api/workout-plans
**Description:** Create a new workout plan after completing the 3-step wizard

Persists the complete workout plan including selected category, commitment details (start date, duration, training days), and selected exercises.

**Request Body:**
```json
{
  "categoryId": "cat-123",
  "startDate": "2025-01-20",
  "numberOfWeeks": 8,
  "selectedDays": [1, 3, 5],
  "selectedExerciseIds": ["ex-456", "ex-789", "ex-101"]
}
```

**Validation:**
- `categoryId`: Required, string, must reference existing category
- `startDate`: Required, ISO 8601 date string, minimum today's date
- `numberOfWeeks`: Required, integer, range 1-12
- `selectedDays`: Required, array of integers 0-6 (0=Sunday, 6=Saturday), minimum 1 day
- `selectedExerciseIds`: Required, array of strings, minimum 1 exercise, all must belong to selected category

**Response:** 201 Created
```json
{
  "id": "plan-abc123",
  "userId": "user-456",
  "categoryId": "cat-123",
  "startDate": "2025-01-20",
  "numberOfWeeks": 8,
  "selectedDays": [1, 3, 5],
  "selectedExerciseIds": ["ex-456", "ex-789", "ex-101"],
  "totalSessions": 24,
  "createdAt": "2025-01-15T10:35:00Z"
}
```

**Errors:**
- 400 Bad Request: Validation failed (missing fields, invalid dates, exercises don't belong to category, etc.)
- 401 Unauthorized: User not authenticated
- 404 Not Found: Category or one or more exercises do not exist
- 500 Internal Server Error: Database failure

---

### GET /api/workout-plans
**Description:** List all workout plans for the authenticated user

Enables users to view their previously created workout plans.

**Query Parameters:**
- `categoryId` (string, optional): Filter plans by category
- `limit` (number, optional, default: 50): Max results to return
- `offset` (number, optional, default: 0): Pagination offset

**Response:** 200 OK
```json
{
  "plans": [
    {
      "id": "plan-abc123",
      "categoryId": "cat-123",
      "categoryName": "Jumping",
      "startDate": "2025-01-20",
      "numberOfWeeks": 8,
      "selectedDays": [1, 3, 5],
      "exerciseCount": 3,
      "totalSessions": 24,
      "createdAt": "2025-01-15T10:35:00Z"
    }
  ],
  "total": 5,
  "offset": 0,
  "limit": 50
}
```

**Errors:**
- 401 Unauthorized: User not authenticated
- 500 Internal Server Error: Database failure

---

### GET /api/workout-plans/:id
**Description:** Get a specific workout plan with full details

Retrieves the complete workout plan including category info, exercises details, and commitment schedule.

**Response:** 200 OK
```json
{
  "id": "plan-abc123",
  "userId": "user-456",
  "categoryId": "cat-123",
  "categoryName": "Jumping",
  "startDate": "2025-01-20",
  "numberOfWeeks": 8,
  "selectedDays": [1, 3, 5],
  "totalSessions": 24,
  "exercises": [
    {
      "id": "ex-456",
      "name": "Box Jump",
      "sets": 4,
      "repetitions": "6-8",
      "difficulty": "challenging",
      "description": "Explosive box jump for power development"
    },
    {
      "id": "ex-789",
      "name": "Vertical Reach",
      "sets": 3,
      "repetitions": "10",
      "difficulty": "easy",
      "description": "Measure vertical reach progression"
    }
  ],
  "createdAt": "2025-01-15T10:35:00Z"
}
```

**Errors:**
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User does not own this workout plan
- 404 Not Found: Workout plan does not exist
- 500 Internal Server Error: Database failure

---

### DELETE /api/workout-plans/:id
**Description:** Delete a workout plan

Allows users to remove workout plans they no longer need.

**Response:** 204 No Content

**Errors:**
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User does not own this workout plan
- 404 Not Found: Workout plan does not exist
- 500 Internal Server Error: Database failure

---

## Authentication
All endpoints require authentication (user must be logged in). The API validates that:
- User is authenticated (has valid session/token)
- For GET, DELETE operations on specific plans: User owns the plan (userId matches)
- Plan creation/updates are attributed to the authenticated user

---

## Error Response Format
All error responses follow this standard format:

```json
{
  "error": "Error code (e.g., VALIDATION_ERROR, NOT_FOUND, UNAUTHORIZED)",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2025-01-15T10:35:00Z"
}
```

Common status codes:
- `400 Bad Request`: Validation errors, malformed requests
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: User lacks permission (not plan owner)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server errors

---

## Integration Notes

### With Workout Categories Admin
- Reuses the existing `GET /api/workout-categories` endpoint
- Validates that referenced `categoryId` and `selectedExerciseIds` exist
- Does NOT modify categories or exercises
- Stores only the IDs of selected exercises (not full copies)

### Data Consistency
- When retrieving a plan, exercises are fetched from the category at read-time
- If an exercise is deleted from the category, it remains in the plan but may not be accessible for viewing
- Plan creation validates all exercises belong to the selected category

### User Authorization
- Plans are associated with userId from authenticated session
- Users can only view/delete their own plans
- API prevents cross-user plan access
