/**
 * Admin Workout Categories Page
 * Manage default workout categories and exercises for volleyball training
 */

import { Handlers, PageProps } from '$fresh/server.ts';
import WorkoutCategoriesAdmin from '../../islands/admin/WorkoutCategoriesAdmin.tsx';

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
  exerciseCount?: number;
  exercises?: Exercise[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface WorkoutCategoriesData {
  categories: WorkoutCategory[];
  currentUser: User;
  error?: string;
}

export const handler: Handlers<WorkoutCategoriesData> = {
  async GET(req, ctx) {
    // Check if user is authenticated and is admin
    const token = req.headers.get('cookie')?.split('; ')
      .find((c) => c.startsWith('auth_token='))
      ?.split('=')[1];

    if (!token) {
      // Not logged in - redirect to login
      return new Response(null, {
        status: 302,
        headers: { location: '/login?redirect=/admin/workout-categories' },
      });
    }

    const apiUrl = Deno.env.get('API_URL') || 'http://localhost:8000/api';

    try {
      // Fetch current user to verify admin status
      const userResponse = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        // Invalid token - redirect to login
        return new Response(null, {
          status: 302,
          headers: { location: '/login?redirect=/admin/workout-categories' },
        });
      }

      const userData = await userResponse.json();
      const currentUser = userData.data.user;

      // Check if user is admin
      if (currentUser.role !== 'admin') {
        // Not an admin - redirect to home with error
        return new Response(null, {
          status: 302,
          headers: { location: '/?error=unauthorized' },
        });
      }

      // Fetch workout categories
      const categoriesResponse = await fetch(`${apiUrl}/admin/workout-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch workout categories');
      }

      const categoriesData = await categoriesResponse.json();

      return ctx.render({
        categories: categoriesData.categories || [],
        currentUser,
      });
    } catch (error) {
      console.error('Workout categories page error:', error);
      return ctx.render({
        categories: [],
        currentUser: {} as User,
        error: 'Failed to load workout categories',
      });
    }
  },
};

export default function WorkoutCategoriesPage({ data }: PageProps<WorkoutCategoriesData>) {
  if (data.error) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 class="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p class="text-gray-700 mb-6">{data.error}</p>
          <a
            href="/"
            class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const { categories, currentUser } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-white border-b border-gray-200">
        <div class="px-6 py-4">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Workout Categories Admin</h1>
              <p class="text-sm text-gray-600 mt-1">Manage default volleyball training workout categories</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-600">
                {currentUser.name}
              </span>
              <a
                href="/admin/users"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Users
              </a>
              <a
                href="/admin/data"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Data
              </a>
              <a
                href="/"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Island */}
      <WorkoutCategoriesAdmin
        initialCategories={categories}
      />
    </div>
  );
}
