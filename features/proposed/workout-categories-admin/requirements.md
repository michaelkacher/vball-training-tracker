# Feature: Workout Categories Admin

## Summary
An admin interface for managing default volleyball training workout categories and their associated exercises. This feature provides administrators with a master-detail layout to create, edit, organize, and delete workout categories with full control over exercises including difficulty levels, sets, repetitions, and descriptions.

## User Stories
- As an admin, I want to create new workout categories with names, focus areas, and key objectives so that coaches have templates for training programs.
- As an admin, I want to manage exercises within each category so that I can build comprehensive workout templates.
- As an admin, I want to reorder exercises within a category so that the sequence matches training progression.
- As an admin, I want to filter and search categories so that I can quickly find specific categories to edit.
- As an admin, I want to duplicate exercises so that I can create similar variations without retyping.

## Core Functionality

### What It Does
- Browse and manage default workout categories in a master-detail layout
- Create new workout categories with name, focus area, and key objective
- Edit existing category properties (name, focus area, key objective)
- Delete workout categories with confirmation
- Add exercises to categories via modal form
- Edit exercise details (name, sets, reps, difficulty, description)
- Delete exercises from categories with confirmation
- Reorder exercises within a category via drag-and-drop
- Duplicate exercises within the same or different categories
- Search/filter categories by name or focus area
- View exercise count and details inline
- Color-code difficulty levels (easy=green, medium=yellow, challenging=red)
- Display sticky category header while scrolling exercise list

### What It Doesn't Do (Out of Scope)
- Role-based access control (admin assumes proper backend authorization)
- Bulk import/export of categories
- Category templates or presets beyond default categories
- Exercise video attachments or media
- Workout program creation (separate feature)
- User-specific category customization

## API Endpoints Needed
- `GET /api/admin/workout-categories` - List all categories with search/filter
- `POST /api/admin/workout-categories` - Create new category
- `GET /api/admin/workout-categories/:id` - Get category with all exercises
- `PUT /api/admin/workout-categories/:id` - Update category properties
- `DELETE /api/admin/workout-categories/:id` - Delete category
- `POST /api/admin/workout-categories/:id/exercises` - Add exercise to category
- `PUT /api/admin/workout-categories/:id/exercises/:exerciseId` - Update exercise
- `DELETE /api/admin/workout-categories/:id/exercises/:exerciseId` - Delete exercise
- `POST /api/admin/workout-categories/:id/exercises/:exerciseId/duplicate` - Duplicate exercise
- `PUT /api/admin/workout-categories/:id/exercises/reorder` - Reorder exercises

## Data Requirements

### New Models/Types
```typescript
interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: "easy" | "medium" | "challenging";
  description: string;
  order: number;
}

interface WorkoutCategory {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

interface CategorySearchFilters {
  query?: string;
  difficulty?: "easy" | "medium" | "challenging";
}
```

### Existing Models Modified
- None initially; categories are independent entities

## UI Components Needed
- **CategoryListSidebar** - Master list with search input, category items, and "New Category" button
- **CategoryDetailView** - Category header with actions, exercise list, add exercise button
- **ExerciseCard** - Individual exercise display with drag handle, actions (edit/duplicate/delete), and metadata
- **DifficultyBadge** - Color-coded badge for difficulty levels
- **CategoryItem** - Sidebar item showing category name, focus area, exercise count
- **ExerciseForm** - Modal form for creating/editing exercises
- **CategoryForm** - Modal form for creating/editing categories
- **ConfirmationDialog** - Reusable modal for delete confirmations
- **DragDropContext** - Wrapper component for drag-and-drop exercise reordering

## Layout & UI Patterns
- Responsive master-detail layout: sidebar collapses on mobile
- Sticky navigation header with title, mockup badge, "New Category" button
- Fixed sidebar (80 units wide) with search and category list
- Scrollable main content area with sticky category header
- Card-based exercise layout with shadow/hover effects
- Drag handle icons (six dots) for reordering exercises
- Quick action buttons (edit, duplicate, delete) on hover
- Inline difficulty badges with color coding
- Blue info box in sidebar explaining "Default Categories"
- Dashed border button for "Add New Exercise"

## Acceptance Criteria
- [ ] Admin can create a new workout category
- [ ] Admin can edit category name, focus area, and key objective
- [ ] Admin can delete a category with confirmation dialog
- [ ] Admin can add an exercise to a category
- [ ] Admin can edit any exercise property (all fields)
- [ ] Admin can delete an exercise with confirmation dialog
- [ ] Admin can reorder exercises via drag-and-drop
- [ ] Admin can duplicate an exercise
- [ ] Admin can search/filter categories by name
- [ ] Difficulty badges display correct colors (green/yellow/red)
- [ ] Exercise list shows sets, repetitions, and difficulty
- [ ] Category header displays exercise count
- [ ] Sidebar shows all categories with focus area and exercise count
- [ ] Layout is responsive and sidebar collapses on mobile viewports
- [ ] All form validations work (required fields, string length, number ranges)
- [ ] API errors are handled gracefully with user feedback
- [ ] Optimistic UI updates where appropriate
- [ ] Tests cover all CRUD operations
- [ ] Features documented in code comments

## Technical Notes
- Use Preact hooks for state management (useState, useEffect)
- Implement drag-and-drop library (e.g., dnd-kit or react-beautiful-dnd adapted for Preact)
- Form validation using Zod schemas for type safety
- API responses should include pagination for categories
- Consider caching categories list to avoid repeated API calls
- Empty state handling when no categories exist
- Loading states during API operations
- Error boundary for graceful error handling

## Related Features
- **Workout Programs** - Users will reference these default categories when creating training programs
- **Exercise Library** - Future enhancement to decouple exercises from categories
- **Training Analytics** - Will track which categories are most frequently used
