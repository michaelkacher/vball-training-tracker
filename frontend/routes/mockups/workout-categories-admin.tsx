/**
 * MOCKUP: Workout Categories Admin Interface
 *
 * Purpose:
 * This is a visual mockup demonstrating an admin interface for managing workout categories
 * for volleyball training. It shows how administrators can create, edit, and organize
 * workout categories with associated exercises.
 *
 * Features Demonstrated:
 * - Master-detail layout with responsive sidebar navigation
 * - Category management (create, edit, delete)
 * - Exercise management within categories (add, edit, delete, reorder)
 * - Search/filter functionality for categories
 * - Inline editing capabilities
 * - Difficulty level indicators (easy/medium/challenging)
 * - Drag-and-drop visual indicators for exercise reordering
 * - Modal forms for adding new exercises
 * - Quick actions (duplicate, delete)
 * - Expandable exercise cards with full details
 *
 * Design Decisions:
 * - Used master-detail pattern for efficient category browsing
 * - Color-coded difficulty badges for quick visual recognition
 * - Inline editing to reduce context switching
 * - Card-based exercise layout for scanability
 * - Sticky sidebar for easy navigation
 * - Responsive design that collapses sidebar on mobile
 *
 * IMPORTANT: This is a NON-FUNCTIONAL mockup for visualization purposes only.
 * Buttons, forms, and interactive elements are styled but do not perform actual operations.
 * All data is mock data defined within this component.
 *
 * Route: /mockups/workout-categories-admin
 */

import { PageProps } from "$fresh/server.ts";
import { useState } from "preact/hooks";

// Mock Data Types
interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: "easy" | "medium" | "challenging";
  description: string;
}

interface WorkoutCategory {
  id: string;
  name: string;
  focusArea: string;
  keyObjective: string;
  exercises: Exercise[];
}

// Mock Data
const MOCK_CATEGORIES: WorkoutCategory[] = [
  {
    id: "1",
    name: "Vertical Jump",
    focusArea: "Lower Body Power",
    keyObjective: "Increase explosive jumping ability for blocking and attacking",
    exercises: [
      {
        id: "e1",
        name: "Box Jumps",
        sets: 4,
        repetitions: "8-10",
        difficulty: "medium",
        description: "Explosive jumps onto a stable platform. Focus on landing softly and maintaining proper form throughout."
      },
      {
        id: "e2",
        name: "Depth Jumps",
        sets: 3,
        repetitions: "6-8",
        difficulty: "challenging",
        description: "Step off a box and immediately jump as high as possible upon landing. Develops reactive strength and plyometric power."
      },
      {
        id: "e3",
        name: "Bulgarian Split Squats",
        sets: 3,
        repetitions: "10-12 per leg",
        difficulty: "medium",
        description: "Single-leg strength exercise targeting quads, glutes, and stabilizers. Elevate rear foot on bench."
      },
      {
        id: "e4",
        name: "Jump Rope Singles",
        sets: 3,
        repetitions: "60 seconds",
        difficulty: "easy",
        description: "Continuous single jumps focusing on ankle stiffness and quick ground contact time."
      }
    ]
  },
  {
    id: "2",
    name: "Serving Power",
    focusArea: "Upper Body & Core Strength",
    keyObjective: "Build shoulder stability and rotational power for powerful serves",
    exercises: [
      {
        id: "e5",
        name: "Medicine Ball Slams",
        sets: 4,
        repetitions: "12-15",
        difficulty: "medium",
        description: "Overhead medicine ball throws focusing on explosive core engagement and follow-through motion similar to serving."
      },
      {
        id: "e6",
        name: "Rotational Cable Chops",
        sets: 3,
        repetitions: "12 per side",
        difficulty: "medium",
        description: "Diagonal pulling motion that develops rotational core strength essential for serving power."
      },
      {
        id: "e7",
        name: "Overhead Dumbbell Press",
        sets: 4,
        repetitions: "8-10",
        difficulty: "challenging",
        description: "Seated or standing shoulder press building overhead strength and stability for serving motion."
      },
      {
        id: "e8",
        name: "Band Pull-Aparts",
        sets: 3,
        repetitions: "15-20",
        difficulty: "easy",
        description: "Shoulder health exercise targeting rear deltoids and upper back to prevent serving-related injuries."
      },
      {
        id: "e9",
        name: "Plank with Shoulder Taps",
        sets: 3,
        repetitions: "20 total taps",
        difficulty: "medium",
        description: "Core stability exercise with anti-rotation component. Maintain plank while alternating shoulder touches."
      }
    ]
  },
  {
    id: "3",
    name: "Core Strength",
    focusArea: "Core Stability & Power",
    keyObjective: "Develop core strength for better balance, rotation, and injury prevention",
    exercises: [
      {
        id: "e10",
        name: "Dead Bug",
        sets: 3,
        repetitions: "10 per side",
        difficulty: "easy",
        description: "Supine core exercise focusing on maintaining neutral spine while moving opposing limbs. Excellent for core control."
      },
      {
        id: "e11",
        name: "Pallof Press",
        sets: 3,
        repetitions: "12 per side",
        difficulty: "medium",
        description: "Anti-rotation exercise using cable or band. Press away from body while resisting rotational forces."
      },
      {
        id: "e12",
        name: "Russian Twists",
        sets: 3,
        repetitions: "20 total twists",
        difficulty: "medium",
        description: "Seated rotational exercise with medicine ball or weight. Builds rotational core strength for hitting and serving."
      },
      {
        id: "e13",
        name: "L-Sit Hold",
        sets: 3,
        repetitions: "20-30 seconds",
        difficulty: "challenging",
        description: "Advanced core exercise requiring full body tension. Hold seated position with legs elevated and extended."
      }
    ]
  },
  {
    id: "4",
    name: "Court Agility",
    focusArea: "Speed & Directional Changes",
    keyObjective: "Improve quick directional changes and court coverage speed",
    exercises: [
      {
        id: "e14",
        name: "Ladder Drills - Ickey Shuffle",
        sets: 4,
        repetitions: "3 lengths",
        difficulty: "medium",
        description: "Quick footwork pattern through agility ladder. In-out-out pattern developing lateral quickness."
      },
      {
        id: "e15",
        name: "Cone T-Drill",
        sets: 3,
        repetitions: "4 rounds",
        difficulty: "medium",
        description: "Sprint forward, shuffle left, shuffle right, backpedal. Simulates court movement patterns."
      },
      {
        id: "e16",
        name: "Reactive Ball Drops",
        sets: 3,
        repetitions: "10 catches",
        difficulty: "challenging",
        description: "Partner drops ball from height, react and catch before second bounce. Develops reaction time and acceleration."
      }
    ]
  }
];

// Difficulty badge component
function DifficultyBadge({ level }: { level: "easy" | "medium" | "challenging" }) {
  const colors = {
    easy: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    challenging: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

// Exercise card component
function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Drag handle indicator */}
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 pt-1 cursor-move opacity-40 hover:opacity-100 transition-opacity" title="Drag to reorder">
          <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </div>

        <div class="flex-1">
          {/* Exercise header */}
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold text-gray-500">#{index + 1}</span>
                <h4 class="text-lg font-semibold text-gray-900">{exercise.name}</h4>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <span><strong>{exercise.sets}</strong> sets</span>
                <span class="text-gray-300">•</span>
                <span><strong>{exercise.repetitions}</strong> reps</span>
                <span class="text-gray-300">•</span>
                <DifficultyBadge level={exercise.difficulty} />
              </div>
            </div>

            {/* Quick actions */}
            <div class="flex gap-1">
              <button
                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit exercise"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                title="Duplicate exercise"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete exercise"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Exercise description */}
          <p class="text-sm text-gray-600 leading-relaxed">
            {exercise.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Category detail view
function CategoryDetail({ category }: { category: WorkoutCategory | null }) {
  if (!category) {
    return (
      <div class="flex items-center justify-center h-full text-gray-400">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-lg">Select a category to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div class="h-full overflow-y-auto">
      {/* Category header */}
      <div class="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
            <div class="space-y-1">
              <div class="text-sm">
                <span class="font-medium text-gray-700">Focus Area:</span>{" "}
                <span class="text-gray-600">{category.focusArea}</span>
              </div>
              <div class="text-sm">
                <span class="font-medium text-gray-700">Key Objective:</span>{" "}
                <span class="text-gray-600">{category.keyObjective}</span>
              </div>
            </div>
          </div>

          {/* Category actions */}
          <div class="flex gap-2">
            <button class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
              Edit Category
            </button>
            <button class="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
              Delete Category
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            <strong>{category.exercises.length}</strong> exercises in this category
          </div>
          <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
            + Add Exercise
          </button>
        </div>
      </div>

      {/* Exercises list */}
      <div class="p-6 space-y-4">
        {category.exercises.map((exercise, index) => (
          <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
        ))}

        {/* Add exercise placeholder */}
        <button class="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
          <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p class="text-sm font-medium">Add New Exercise</p>
        </button>
      </div>
    </div>
  );
}

// Sidebar category item
function CategoryItem({
  category,
  isSelected,
  onClick
}: {
  category: WorkoutCategory;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      class={`w-full text-left px-4 py-3 rounded-lg transition-all ${
        isSelected
          ? "bg-blue-100 border-blue-300 shadow-sm"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      } border`}
    >
      <div class="font-semibold text-gray-900 mb-1">{category.name}</div>
      <div class="text-xs text-gray-600">{category.focusArea}</div>
      <div class="text-xs text-gray-500 mt-1">
        {category.exercises.length} exercises
      </div>
    </button>
  );
}

// Main component
export default function WorkoutCategoriesAdmin(props: PageProps) {
  // In a real app, this would be state management. For mockup, we'll simulate it.
  const selectedCategoryId = "1"; // Simulating selected state
  const selectedCategory = MOCK_CATEGORIES.find(c => c.id === selectedCategoryId) || null;
  const searchQuery = ""; // Simulating search

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Workout Categories Admin</h1>
            <p class="text-sm text-gray-600 mt-1">Manage default volleyball training workout categories</p>
          </div>

          <div class="flex items-center gap-3">
            <span class="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
              MOCKUP MODE
            </span>
            <button class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">
              + New Category
            </button>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div class="flex h-[calc(100vh-89px)]">
        {/* Sidebar */}
        <aside class="w-80 bg-gray-100 border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div class="p-4">
            {/* Search bar */}
            <div class="mb-4">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  class="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Categories list */}
            <div class="space-y-2">
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                Categories ({MOCK_CATEGORIES.length})
              </div>
              {MOCK_CATEGORIES.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isSelected={category.id === selectedCategoryId}
                  onClick={() => {/* In real app, would update selected category */}}
                />
              ))}
            </div>

            {/* Default categories info */}
            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div class="text-xs text-blue-800">
                  <div class="font-semibold mb-1">Default Categories</div>
                  <p class="text-blue-700 leading-relaxed">
                    These categories are available to all users as starting templates for their training programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main class="flex-1 overflow-hidden bg-gray-50">
          <CategoryDetail category={selectedCategory} />
        </main>
      </div>

      {/* Mockup watermark */}
      <div class="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg shadow-lg opacity-90">
        Visual Mockup - Non-functional UI
      </div>
    </div>
  );
}
