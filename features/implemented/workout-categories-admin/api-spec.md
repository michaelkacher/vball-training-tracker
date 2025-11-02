# API Specification: Workout Categories Admin

## Base Path
`/api/admin/workout-categories`

## Endpoints

### GET /api/admin/workout-categories
**Description:** List all workout categories with optional search/filter

**Query Parameters:**
- `query` (string, optional): Search categories by name or focus area
- `limit` (number, optional, default: 50): Max results to return
- `offset` (number, optional, default: 0): Pagination offset

**Response:** 200 OK
```json
{
  "categories": [
    {
      "id": "cat-123",
      "name": "Spike Training",
      "focusArea": "Attacking",
      "keyObjective": "Develop attacking power and precision",
      "exerciseCount": 8,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 50
}
```

**Errors:**
- 400 Bad Request: Invalid query parameters
- 500 Internal Server Error: Database failure

---

### POST /api/admin/workout-categories
**Description:** Create a new workout category

**Request Body:**
```json
{
  "name": "Spike Training",
  "focusArea": "Attacking",
  "keyObjective": "Develop attacking power and precision"
}
```

**Validation:**
- `name`: Required, string, 1-100 characters
- `focusArea`: Required, string, 1-100 characters
- `keyObjective`: Required, string, 1-500 characters

**Response:** 201 Created
```json
{
  "id": "cat-123",
  "name": "Spike Training",
  "focusArea": "Attacking",
  "keyObjective": "Develop attacking power and precision",
  "exercises": [],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

**Errors:**
- 400 Bad Request: Validation failed
- 500 Internal Server Error: Database failure

---

### GET /api/admin/workout-categories/:id
**Description:** Get a specific category with all exercises

**Response:** 200 OK
```json
{
  "id": "cat-123",
  "name": "Spike Training",
  "focusArea": "Attacking",
  "keyObjective": "Develop attacking power and precision",
  "exercises": [
    {
      "id": "ex-456",
      "name": "Jump Spike",
      "sets": 3,
      "repetitions": "10",
      "difficulty": "challenging",
      "description": "Power spike with full approach",
      "order": 1
    }
  ],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

**Errors:**
- 404 Not Found: Category does not exist
- 500 Internal Server Error: Database failure

---

### PUT /api/admin/workout-categories/:id
**Description:** Update category properties (name, focus area, key objective)

**Request Body:**
```json
{
  "name": "Advanced Spike Training",
  "focusArea": "Attacking",
  "keyObjective": "Develop attacking power and precision"
}
```

**Validation:**
- All fields follow same rules as POST endpoint
- At least one field must be provided

**Response:** 200 OK
```json
{
  "id": "cat-123",
  "name": "Advanced Spike Training",
  "focusArea": "Attacking",
  "keyObjective": "Develop attacking power and precision",
  "exercises": [...],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

**Errors:**
- 400 Bad Request: Validation failed
- 404 Not Found: Category does not exist
- 500 Internal Server Error: Database failure

---

### DELETE /api/admin/workout-categories/:id
**Description:** Delete a workout category (and all associated exercises)

**Response:** 204 No Content

**Errors:**
- 404 Not Found: Category does not exist
- 500 Internal Server Error: Database failure

---

### POST /api/admin/workout-categories/:id/exercises
**Description:** Add a new exercise to a category

**Request Body:**
```json
{
  "name": "Jump Spike",
  "sets": 3,
  "repetitions": "10",
  "difficulty": "challenging",
  "description": "Power spike with full approach"
}
```

**Validation:**
- `name`: Required, string, 1-100 characters
- `sets`: Required, integer, 1-10
- `repetitions`: Required, string, 1-50 characters
- `difficulty`: Required, one of: "easy", "medium", "challenging"
- `description`: Optional, string, 0-500 characters

**Response:** 201 Created
```json
{
  "id": "ex-456",
  "name": "Jump Spike",
  "sets": 3,
  "repetitions": "10",
  "difficulty": "challenging",
  "description": "Power spike with full approach",
  "order": 1
}
```

**Errors:**
- 400 Bad Request: Validation failed
- 404 Not Found: Category does not exist
- 500 Internal Server Error: Database failure

---

### PUT /api/admin/workout-categories/:id/exercises/:exerciseId
**Description:** Update an exercise in a category

**Request Body:**
```json
{
  "name": "Advanced Jump Spike",
  "sets": 4,
  "repetitions": "12",
  "difficulty": "challenging",
  "description": "Power spike with approach and follow-through"
}
```

**Validation:**
- Same as POST /exercises endpoint
- At least one field should be provided

**Response:** 200 OK
```json
{
  "id": "ex-456",
  "name": "Advanced Jump Spike",
  "sets": 4,
  "repetitions": "12",
  "difficulty": "challenging",
  "description": "Power spike with approach and follow-through",
  "order": 1
}
```

**Errors:**
- 400 Bad Request: Validation failed
- 404 Not Found: Category or exercise does not exist
- 500 Internal Server Error: Database failure

---

### DELETE /api/admin/workout-categories/:id/exercises/:exerciseId
**Description:** Delete an exercise from a category

**Response:** 204 No Content

**Errors:**
- 404 Not Found: Category or exercise does not exist
- 500 Internal Server Error: Database failure

---

### POST /api/admin/workout-categories/:id/exercises/:exerciseId/duplicate
**Description:** Duplicate an exercise within the same category or to a different category

**Request Body:**
```json
{
  "targetCategoryId": "cat-123"
}
```

**Validation:**
- `targetCategoryId`: Required, string, must reference existing category

**Response:** 201 Created
```json
{
  "id": "ex-789",
  "name": "Jump Spike (Copy)",
  "sets": 3,
  "repetitions": "10",
  "difficulty": "challenging",
  "description": "Power spike with full approach",
  "order": 1
}
```

**Errors:**
- 400 Bad Request: Validation failed
- 404 Not Found: Category or exercise does not exist
- 500 Internal Server Error: Database failure

---

### PUT /api/admin/workout-categories/:id/exercises/reorder
**Description:** Reorder exercises within a category

**Request Body:**
```json
{
  "exerciseIds": ["ex-456", "ex-789", "ex-101"]
}
```

**Validation:**
- `exerciseIds`: Required, array of strings
- Array must contain all exercise IDs for the category
- No duplicates allowed

**Response:** 200 OK
```json
{
  "exercises": [
    {
      "id": "ex-456",
      "name": "Jump Spike",
      "sets": 3,
      "repetitions": "10",
      "difficulty": "challenging",
      "description": "Power spike with full approach",
      "order": 1
    },
    {
      "id": "ex-789",
      "name": "Arm Swing Drill",
      "sets": 2,
      "repetitions": "15",
      "difficulty": "easy",
      "description": "Basic arm swing technique",
      "order": 2
    }
  ]
}
```

**Errors:**
- 400 Bad Request: Invalid exercise IDs or missing exercises
- 404 Not Found: Category does not exist
- 500 Internal Server Error: Database failure

---

## Authentication
All endpoints require authentication (implementation details TBD). Assumed proper backend authorization validates admin role before processing requests.

## Error Response Format
All error responses follow this standard format:

```json
{
  "error": "Error code",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

Common status codes:
- `400 Bad Request`: Validation errors, malformed requests
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server errors
