/**
 * MOCKUP: Workout Plan Wizard
 *
 * PURPOSE:
 * This is a visual mockup demonstrating a 3-step wizard interface for athletes to create
 * customized workout plans. The wizard guides users through category selection, commitment
 * setup, and exercise selection to build a personalized training program.
 *
 * WIZARD STEPS:
 *
 * Step 1 - Workout Category Selection:
 * - Large clickable cards displaying 6 volleyball-specific workout categories
 * - Each card shows category name, icon/emoji, and brief description
 * - Single selection (radio-style) with visual feedback
 * - Selected card has highlighted border and background color
 * - Categories: Court Agility, Blocking, Jumping, Serving, Passing, Setting
 *
 * Step 2 - Commitment Setup:
 * - Start date selection using HTML5 date picker (could be enhanced with calendar widget)
 * - Number of weeks selection with increment/decrement buttons (range: 1-12 weeks)
 * - Visual week grid for selecting training days
 * - Days pre-selected: Monday, Wednesday, Friday (typical training schedule)
 * - Toggle buttons for each day with active/inactive states
 * - Visual summary of selected commitment
 *
 * Step 3 - Exercise Selection:
 * - Multi-select checkbox list of exercises filtered by selected category
 * - Each exercise shows name and brief description
 * - Search/filter input to quickly find specific exercises
 * - Selected exercise counter at top (e.g., "5 exercises selected")
 * - Minimum selection requirement: at least 3 exercises
 *
 * DESIGN FEATURES:
 * - Progress indicator at top showing current step (Step 1/3, 2/3, 3/3)
 * - Visual progress bar for completion percentage
 * - Card-based layout with clean spacing and hierarchy
 * - Bottom navigation: "Back" and "Next" buttons
 * - Final step shows "Create Workout Plan" instead of "Next"
 * - Validation: "Next" button disabled until step requirements met
 * - Responsive design that works on mobile and desktop
 * - Smooth transitions between steps
 * - Clear visual feedback for all interactive elements
 *
 * MOCK DATA STRUCTURE:
 * - WorkoutCategory: id, name, icon, focusArea, description
 * - Exercise: id, categoryId, name, description, difficulty, sets, repetitions
 * - WizardState: currentStep, selectedCategory, startDate, weeks, selectedDays, selectedExercises
 *
 * VALIDATION RULES:
 * - Step 1: Must select exactly one category
 * - Step 2: Must select start date, weeks (1-12), and at least one day
 * - Step 3: Must select at least 3 exercises
 * - Cannot proceed to next step without meeting validation requirements
 *
 * DESIGN DECISIONS:
 * - Used wizard pattern to reduce cognitive load and guide users through complex process
 * - Large clickable cards in Step 1 for easy category recognition
 * - Visual week grid makes day selection intuitive and familiar
 * - Exercise search allows users to quickly find specific movements
 * - Progress indicator provides context and reduces user anxiety
 * - Default selections (Mon/Wed/Fri) based on common training patterns
 * - Disabled state for navigation buttons prevents invalid actions
 *
 * CONVERTING TO FULL FEATURE:
 * 1. Replace useState with proper state management (Context API or signals)
 * 2. Add API integration to fetch categories and exercises from backend
 * 3. Implement actual calendar widget for date selection (e.g., date-fns)
 * 4. Add form validation library (e.g., Zod) for robust validation
 * 5. Create POST endpoint to save workout plan to database
 * 6. Add loading states and error handling
 * 7. Implement confirmation page after creation
 * 8. Add ability to save draft and return later
 * 9. Add analytics tracking for step completion rates
 * 10. Enhance accessibility with ARIA labels and keyboard navigation
 *
 * IMPORTANT: This is a NON-FUNCTIONAL mockup for visualization purposes only.
 * All interactions are simulated with client-side state. No data is persisted.
 *
 * Route: /mockups/workout-plan-wizard
 */

import { PageProps } from "$fresh/server.ts";
import WorkoutPlanWizardIsland from "../../islands/mockups/WorkoutPlanWizard.tsx";

export default function WorkoutPlanWizard(props: PageProps) {
  return <WorkoutPlanWizardIsland />;
}
