/**
 * Create New Workout Plan Route
 * 3-step wizard for athletes to create personalized volleyball training plans
 */

import { Handlers, PageProps } from '$fresh/server.ts';
import WorkoutPlanWizard from '../../islands/WorkoutPlanWizard.tsx';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: string;
  difficulty: 'easy' | 'medium' | 'challenging';
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

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface WorkoutPlanWizardData {
  categories: WorkoutCategory[];
  currentUser: User;
  error?: string;
}

export const handler: Handlers<WorkoutPlanWizardData> = {
  async GET(req, ctx) {
    // Check if user is authenticated
    const token = req.headers.get('cookie')?.split('; ')
      .find((c) => c.startsWith('auth_token='))
      ?.split('=')[1];

    if (!token) {
      // Not logged in - redirect to login
      return new Response(null, {
        status: 302,
        headers: { location: '/login?redirect=/workout-plans/new' },
      });
    }

    const apiUrl = Deno.env.get('API_URL') || 'http://localhost:8000/api';

    try {
      // Fetch current user to verify authentication
      const userResponse = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        // Invalid token - redirect to login
        return new Response(null, {
          status: 302,
          headers: { location: '/login?redirect=/workout-plans/new' },
        });
      }

      const userData = await userResponse.json();
      const currentUser = userData.data.user;

      // Fetch workout categories (list - without exercises)
      const categoriesListResponse = await fetch(`${apiUrl}/admin/workout-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!categoriesListResponse.ok) {
        throw new Error('Failed to fetch workout categories');
      }

      const categoriesListData = await categoriesListResponse.json();

      // Handle both response formats: { categories: [...] } or { data: { categories: [...] } }
      const categorySummaries = categoriesListData.categories || categoriesListData.data?.categories || [];

      console.log('Categories list response:', categoriesListData);
      console.log('Category summaries:', categorySummaries);

      // If no categories, return empty array
      if (!Array.isArray(categorySummaries) || categorySummaries.length === 0) {
        return ctx.render({
          categories: [],
          currentUser,
        });
      }

      // Fetch each category with exercises
      const categoryPromises = categorySummaries.map(async (summary: { id: string }) => {
        if (!summary || !summary.id) {
          console.error('Invalid category summary:', summary);
          return null;
        }

        const categoryResponse = await fetch(`${apiUrl}/admin/workout-categories/${summary.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!categoryResponse.ok) {
          console.error(`Failed to fetch category ${summary.id}`);
          return null;
        }

        const categoryData = await categoryResponse.json();
        return categoryData.category;
      });

      const categoriesWithExercises = await Promise.all(categoryPromises);
      const categories = categoriesWithExercises.filter((cat) => cat !== null);

      return ctx.render({
        categories,
        currentUser,
      });
    } catch (error) {
      console.error('Workout plan wizard error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workout categories. Please try again.';
      return ctx.render({
        categories: [],
        currentUser: {} as User,
        error: errorMessage,
      });
    }
  },
};

export default function NewWorkoutPlanPage({ data }: PageProps<WorkoutPlanWizardData>) {
  if (data.error) {
    return (
      <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 class="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p class="text-gray-700 mb-6">{data.error}</p>
          <a
            href="/"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const { categories, currentUser } = data;

  return (
    <WorkoutPlanWizard
      initialCategories={categories}
      currentUser={currentUser}
    />
  );
}
