/**
 * Athlete Dashboard Mockup - Route File
 *
 * Purpose: Provide athletes with a comprehensive overview of their scheduled workouts,
 * progress, and goals
 *
 * Features:
 * - Welcome hero section with current week progress and streak counter
 * - Weekly schedule with status indicators (completed, scheduled, missed, rest days)
 * - Progress statistics cards (overall progress, streaks, category breakdown, recent activity)
 * - Active workout plans with progress tracking
 * - Goals and achievements section
 * - Upcoming workouts timeline
 *
 * Architecture:
 * - This route file is a minimal wrapper that renders the island component
 * - All interactive logic, state, and UI are in the island component
 * - Follows Fresh's island architecture pattern for client-side interactivity
 *
 * Design:
 * - Responsive 3-column grid layout (stacks on mobile)
 * - Color-coded status indicators for quick visual feedback
 * - Card-based layout with Tailwind CSS
 * - Progress bars and visual data representations
 * - Motivational elements (streaks, achievements, badges)
 *
 * Mock Data Includes:
 * - Athlete profile (name, join date, total workouts)
 * - Current week schedule (7 days with workouts/rest days)
 * - 2-3 active workout plans with progress
 * - Workout history (recent completions)
 * - Streak tracking (current and longest)
 * - Category distribution statistics
 * - Achievement badges
 */

import AthleteDashboard from "../../islands/mockups/AthleteDashboard.tsx";

export default function AthleteDashboardMockup() {
  return (
    <div class="min-h-screen bg-gray-50">
      <AthleteDashboard />
    </div>
  );
}
