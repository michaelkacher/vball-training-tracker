# Feature: Workout Plan Wizard

## Overview
A 3-step interactive wizard that guides athletes through creating personalized workout plans by selecting a training category, setting up training commitment (start date, duration, training days), and choosing exercises. The wizard reduces cognitive load through progressive disclosure and validates input at each step before allowing progression.

## User Stories

- **As an athlete**, I want to create a new workout plan by following a guided step-by-step wizard so that I can organize my training effectively without feeling overwhelmed by too many choices at once.

- **As an athlete**, I want to select from specific volleyball training categories (Court Agility, Blocking, Jumping, Serving, Passing, Setting) so that my plan aligns with my current fitness goals.

- **As an athlete**, I want to set a start date and duration (1-12 weeks) for my workout plan so that I can plan my training within a realistic timeframe.

- **As an athlete**, I want to select which days of the week I'll train so that I can build a schedule that fits my availability (with Monday/Wednesday/Friday pre-selected as defaults).

- **As an athlete**, I want to choose multiple exercises from a searchable list filtered by my selected category so that I can customize my plan with exercises that match my training focus.

## Functional Requirements

- **Step 1 - Category Selection:**
  - Display 6 workout categories as large clickable cards with icon, name, focus area, and description
  - Enforce single selection (radio-style behavior)
  - Provide visual feedback for selected category (highlighted border, background color, checkmark)
  - Require category selection before proceeding to Step 2

- **Step 2 - Commitment Setup:**
  - Date picker input for selecting start date (minimum: today's date)
  - Number of weeks selector with increment/decrement buttons (range: 1-12 weeks)
  - Visual week grid with 7 day toggles (Sun-Sat)
  - Pre-select Monday, Wednesday, Friday by default
  - Display summary showing total training sessions (days × weeks)
  - Require start date, weeks, and at least one training day selected

- **Step 3 - Exercise Selection:**
  - Display exercises filtered by selected category
  - Show exercise name, description, difficulty badge, sets, and repetitions
  - Search/filter input to find exercises by name or description
  - Multi-select checkboxes for exercises
  - Display counter showing number of selected exercises
  - Require minimum 1 exercise selected (display warning if not met)

- **Progress Indicator:**
  - Show visual progress bar at top of wizard
  - Display step numbers (1/3, 2/3, 3/3) with labels
  - Highlight current and completed steps

- **Navigation:**
  - "Back" button (disabled on Step 1)
  - "Next" button on Steps 1-2 (disabled until validation requirements met)
  - "Create Workout Plan" button on Step 3 (disabled until validation requirements met)

- **Validation & Behavior:**
  - Disable "Next"/"Create" buttons when step requirements not met
  - Show validation error messages when user attempts to proceed without meeting requirements
  - Smooth transitions between steps
  - Reset exercise selection when changing categories

## Data Model Requirements

**WorkoutCategory Entity:**
- id (string): Unique identifier
- name (string): Category name
- icon (string): Emoji or icon representation
- focusArea (string): Brief focus description
- description (string): Detailed description

**Exercise Entity:**
- id (string): Unique identifier
- categoryId (string): Foreign key to category
- name (string): Exercise name
- description (string): Exercise details
- difficulty (enum: "easy" | "medium" | "challenging")
- sets (number): Number of sets
- repetitions (string): Reps/duration per set

**WorkoutPlan (output after wizard completion):**
- id (string): Plan identifier
- userId (string): Athlete who created plan
- categoryId (string): Selected category
- startDate (date): Training start date
- numberOfWeeks (number): Duration
- selectedDays (array): Day indices (0-6) for training
- selectedExerciseIds (array): IDs of chosen exercises
- createdAt (timestamp): When plan was created

## UI/UX Requirements

- **Layout:** Centered, max-width container with clean spacing
- **Cards:** Large clickable category cards (grid: 1 col mobile, 2 col tablet, 3 col desktop)
- **Colors:** Blue for selected/active states, gray for disabled, green for final action
- **Transitions:** Smooth step transitions and interactive feedback
- **Accessibility:** ARIA labels, keyboard navigation, proper form semantics
- **Responsive:** Mobile-first design working on all screen sizes
- **Feedback:** Visual indicators for validation, selection states, and step progress

## Success Criteria

- Athlete can successfully create a workout plan by completing all 3 wizard steps
- Step 1: Requires exactly one category selection; Next button disabled until met
- Step 2: Requires start date, weeks (1-12), and at least one training day; shows session summary
- Step 3: Requires at least 1 exercise; search filters exercises by name/description
- Validation prevents invalid progression and shows clear feedback
- Plan creation endpoint successfully persists wizard outputs to database
- UI handles all required fields and displays properly on mobile and desktop
- Back button allows users to return to previous steps
- Category change resets exercise selections to prevent mismatched data
