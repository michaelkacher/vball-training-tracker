/**
 * Workout Categories Admin Island
 * Interactive component for managing workout categories and exercises
 */

import { useState, useEffect } from 'preact/hooks';

// Types
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

interface Props {
  initialCategories: WorkoutCategory[];
}

// Validation schemas (simple validation without Zod dependency)
const validateCategory = (name: string, focusArea: string, keyObjective: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Category name is required';
  }
  if (name.length > 100) {
    return 'Category name must be 100 characters or less';
  }
  if (!focusArea || focusArea.trim().length === 0) {
    return 'Focus area is required';
  }
  if (focusArea.length > 100) {
    return 'Focus area must be 100 characters or less';
  }
  if (!keyObjective || keyObjective.trim().length === 0) {
    return 'Key objective is required';
  }
  if (keyObjective.length > 500) {
    return 'Key objective must be 500 characters or less';
  }
  return null;
};

const validateExercise = (
  name: string,
  sets: number,
  repetitions: string,
  difficulty: string,
  description: string
): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Exercise name is required';
  }
  if (name.length > 100) {
    return 'Exercise name must be 100 characters or less';
  }
  if (!sets || sets < 1 || sets > 10) {
    return 'Sets must be between 1 and 10';
  }
  if (!repetitions || repetitions.trim().length === 0) {
    return 'Repetitions is required';
  }
  if (repetitions.length > 50) {
    return 'Repetitions must be 50 characters or less';
  }
  if (!['easy', 'medium', 'challenging'].includes(difficulty)) {
    return 'Invalid difficulty level';
  }
  if (description && description.length > 500) {
    return 'Description must be 500 characters or less';
  }
  return null;
};

// Helper to get API URL
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(':3000', ':8000') + '/api';
  }
  return 'http://localhost:8000/api';
};

// Helper to get auth token
const getToken = () => {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ')
    .find((c) => c.startsWith('auth_token='))
    ?.split('=')[1] || '';
};

// Difficulty Badge Component
function DifficultyBadge({ level }: { level: 'easy' | 'medium' | 'challenging' }) {
  const colors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    challenging: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

// Exercise Card Component
function ExerciseCard({
  exercise,
  index,
  categoryId,
  onEdit,
  onDuplicate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop
}: {
  exercise: Exercise;
  index: number;
  categoryId: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
}) {
  return (
    <div
      class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-exercise-id={exercise.id}
    >
      <div class="flex items-start gap-3">
        {/* Drag handle */}
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
                onClick={onEdit}
                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit exercise"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onDuplicate}
                class="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                title="Duplicate exercise"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
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

// Category Item Component
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
          ? 'bg-blue-100 border-blue-300 shadow-sm'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      } border`}
    >
      <div class="font-semibold text-gray-900 mb-1">{category.name}</div>
      <div class="text-xs text-gray-600">{category.focusArea}</div>
      <div class="text-xs text-gray-500 mt-1">
        {category.exerciseCount || category.exercises?.length || 0} exercises
      </div>
    </button>
  );
}

// Modal Component (Generic)
function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: any;
}) {
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast Notification Component
function Toast({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const colors = type === 'success'
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-red-50 border-red-200 text-red-800';

  return (
    <div class={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg ${colors} flex items-center gap-3 max-w-md`}>
      <div class="flex-1">
        <p class="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        class="text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Main Component
export default function WorkoutCategoriesAdmin({ initialCategories }: Props) {
  // State
  const [categories, setCategories] = useState<WorkoutCategory[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategories.length > 0 ? initialCategories[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Modal states
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<WorkoutCategory | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Drag and drop state
  const [draggedExerciseId, setDraggedExerciseId] = useState<string | null>(null);

  // Computed values
  const filteredCategories = searchQuery
    ? categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.focusArea.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;

  // Show toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Fetch category details with exercises
  const fetchCategoryDetails = async (categoryId: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch category details');
      }

      const data = await response.json();

      // Update the category in the list with full details
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === categoryId ? data : cat
        )
      );
    } catch (error) {
      showToast('Failed to load category details', 'error');
      console.error(error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      showToast('Failed to load categories', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const createCategory = async (name: string, focusArea: string, keyObjective: string) => {
    const validationError = validateCategory(name, focusArea, keyObjective);
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, focusArea, keyObjective }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setSelectedCategoryId(newCategory.id);
      setShowCreateCategoryModal(false);
      showToast('Category created successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to create category', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = async (categoryId: string, name: string, focusArea: string, keyObjective: string) => {
    const validationError = validateCategory(name, focusArea, keyObjective);
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, focusArea, keyObjective }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }

      const updatedCategory = await response.json();
      setCategories(categories.map(cat =>
        cat.id === categoryId ? updatedCategory : cat
      ));
      setShowEditCategoryModal(false);
      setEditingCategory(null);
      showToast('Category updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update category', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? All exercises will be deleted.')) {
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      const remainingCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(remainingCategories);
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(remainingCategories.length > 0 ? remainingCategories[0].id : null);
      }
      showToast('Category deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete category', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add exercise
  const addExercise = async (
    categoryId: string,
    name: string,
    sets: number,
    repetitions: string,
    difficulty: string,
    description: string
  ) => {
    const validationError = validateExercise(name, sets, repetitions, difficulty, description);
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}/exercises`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, sets, repetitions, difficulty, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add exercise');
      }

      await fetchCategoryDetails(categoryId);
      setShowAddExerciseModal(false);
      showToast('Exercise added successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to add exercise', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update exercise
  const updateExercise = async (
    categoryId: string,
    exerciseId: string,
    name: string,
    sets: number,
    repetitions: string,
    difficulty: string,
    description: string
  ) => {
    const validationError = validateExercise(name, sets, repetitions, difficulty, description);
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}/exercises/${exerciseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, sets, repetitions, difficulty, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update exercise');
      }

      await fetchCategoryDetails(categoryId);
      setShowEditExerciseModal(false);
      setEditingExercise(null);
      showToast('Exercise updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update exercise', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete exercise
  const deleteExercise = async (categoryId: string, exerciseId: string) => {
    if (!confirm('Are you sure you want to delete this exercise?')) {
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}/exercises/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }

      await fetchCategoryDetails(categoryId);
      showToast('Exercise deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete exercise', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Duplicate exercise
  const duplicateExercise = async (categoryId: string, exerciseId: string) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}/exercises/${exerciseId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetCategoryId: categoryId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to duplicate exercise');
      }

      await fetchCategoryDetails(categoryId);
      showToast('Exercise duplicated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to duplicate exercise', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reorder exercises
  const reorderExercises = async (categoryId: string, exerciseIds: string[]) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${getApiUrl()}/admin/workout-categories/${categoryId}/exercises/reorder`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reorder exercises');
      }

      await fetchCategoryDetails(categoryId);
      showToast('Exercises reordered successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to reorder exercises', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (exerciseId: string) => (e: DragEvent) => {
    setDraggedExerciseId(exerciseId);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (targetExerciseId: string) => async (e: DragEvent) => {
    e.preventDefault();

    const draggedId = draggedExerciseId;
    if (!draggedId || draggedId === targetExerciseId || !selectedCategory?.exercises) {
      return;
    }

    const exercises = selectedCategory.exercises;
    const draggedIndex = exercises.findIndex(ex => ex.id === draggedId);
    const targetIndex = exercises.findIndex(ex => ex.id === targetExerciseId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder locally for immediate feedback
    const newExercises = [...exercises];
    const [draggedExercise] = newExercises.splice(draggedIndex, 1);
    newExercises.splice(targetIndex, 0, draggedExercise);

    // Update local state
    setCategories(categories.map(cat =>
      cat.id === selectedCategory?.id
        ? { ...cat, exercises: newExercises }
        : cat
    ));

    // Send to backend
    await reorderExercises(
      selectedCategory.id,
      newExercises.map(ex => ex.id)
    );

    setDraggedExerciseId(null);
  };

  // Load category details when selected
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(c => c.id === selectedCategoryId);
      if (category && !category.exercises) {
        fetchCategoryDetails(selectedCategoryId);
      }
    }
  }, [selectedCategoryId]);

  return (
    <div class="flex h-[calc(100vh-89px)]">
      {/* Sidebar */}
      <aside class="w-80 bg-gray-100 border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div class="p-4">
          {/* New Category Button */}
          <button
            onClick={() => setShowCreateCategoryModal(true)}
            class="w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
          >
            + New Category
          </button>

          {/* Search bar */}
          <div class="mb-4">
            <div class="relative">
              <input
                type="text"
                placeholder="Search categories..."
                class="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories list */}
          <div class="space-y-2">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
              Categories ({filteredCategories.length})
            </div>
            {filteredCategories.map(category => (
              <CategoryItem
                key={category.id}
                category={category}
                isSelected={category.id === selectedCategoryId}
                onClick={() => setSelectedCategoryId(category.id)}
              />
            ))}
          </div>

          {/* Info box */}
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
        {selectedCategory ? (
          <div class="h-full overflow-y-auto">
            {/* Category header */}
            <div class="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
              <div class="flex items-start justify-between gap-4 mb-4">
                <div class="flex-1">
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">{selectedCategory.name}</h2>
                  <div class="space-y-1">
                    <div class="text-sm">
                      <span class="font-medium text-gray-700">Focus Area:</span>{' '}
                      <span class="text-gray-600">{selectedCategory.focusArea}</span>
                    </div>
                    <div class="text-sm">
                      <span class="font-medium text-gray-700">Key Objective:</span>{' '}
                      <span class="text-gray-600">{selectedCategory.keyObjective}</span>
                    </div>
                  </div>
                </div>

                {/* Category actions */}
                <div class="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(selectedCategory);
                      setShowEditCategoryModal(true);
                    }}
                    class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                  >
                    Edit Category
                  </button>
                  <button
                    onClick={() => deleteCategory(selectedCategory.id)}
                    class="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                  >
                    Delete Category
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-600">
                  <strong>{selectedCategory.exercises?.length || 0}</strong> exercises in this category
                </div>
                <button
                  onClick={() => setShowAddExerciseModal(true)}
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  + Add Exercise
                </button>
              </div>
            </div>

            {/* Exercises list */}
            <div class="p-6 space-y-4">
              {selectedCategory.exercises?.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  categoryId={selectedCategory.id}
                  onEdit={() => {
                    setEditingExercise(exercise);
                    setShowEditExerciseModal(true);
                  }}
                  onDuplicate={() => duplicateExercise(selectedCategory.id, exercise.id)}
                  onDelete={() => deleteExercise(selectedCategory.id, exercise.id)}
                  onDragStart={handleDragStart(exercise.id)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop(exercise.id)}
                />
              ))}

              {/* Add exercise placeholder */}
              <button
                onClick={() => setShowAddExerciseModal(true)}
                class="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p class="text-sm font-medium">Add New Exercise</p>
              </button>
            </div>
          </div>
        ) : (
          <div class="flex items-center justify-center h-full text-gray-400">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-lg">Select a category to view details</p>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CategoryFormModal
        isOpen={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onSubmit={createCategory}
        title="Create New Category"
      />

      <CategoryFormModal
        isOpen={showEditCategoryModal}
        onClose={() => {
          setShowEditCategoryModal(false);
          setEditingCategory(null);
        }}
        onSubmit={(name, focusArea, keyObjective) =>
          updateCategory(editingCategory!.id, name, focusArea, keyObjective)
        }
        title="Edit Category"
        initialData={editingCategory}
      />

      <ExerciseFormModal
        isOpen={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        onSubmit={(name, sets, repetitions, difficulty, description) =>
          addExercise(selectedCategoryId!, name, sets, repetitions, difficulty, description)
        }
        title="Add New Exercise"
      />

      <ExerciseFormModal
        isOpen={showEditExerciseModal}
        onClose={() => {
          setShowEditExerciseModal(false);
          setEditingExercise(null);
        }}
        onSubmit={(name, sets, repetitions, difficulty, description) =>
          updateExercise(
            selectedCategoryId!,
            editingExercise!.id,
            name,
            sets,
            repetitions,
            difficulty,
            description
          )
        }
        title="Edit Exercise"
        initialData={editingExercise}
      />

      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 shadow-xl">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Category Form Modal
function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, focusArea: string, keyObjective: string) => void;
  title: string;
  initialData?: WorkoutCategory | null;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [focusArea, setFocusArea] = useState(initialData?.focusArea || '');
  const [keyObjective, setKeyObjective] = useState(initialData?.keyObjective || '');

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setFocusArea(initialData.focusArea);
      setKeyObjective(initialData.keyObjective);
    } else if (!isOpen) {
      setName('');
      setFocusArea('');
      setKeyObjective('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(name, focusArea, keyObjective);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              maxLength={100}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              placeholder="e.g., Vertical Jump"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Focus Area
            </label>
            <input
              type="text"
              required
              maxLength={100}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={focusArea}
              onInput={(e) => setFocusArea((e.target as HTMLInputElement).value)}
              placeholder="e.g., Lower Body Power"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Key Objective
            </label>
            <textarea
              required
              maxLength={500}
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={keyObjective}
              onInput={(e) => setKeyObjective((e.target as HTMLTextAreaElement).value)}
              placeholder="e.g., Increase explosive jumping ability for blocking and attacking"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Exercise Form Modal
function ExerciseFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, sets: number, repetitions: string, difficulty: string, description: string) => void;
  title: string;
  initialData?: Exercise | null;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [sets, setSets] = useState(initialData?.sets.toString() || '3');
  const [repetitions, setRepetitions] = useState(initialData?.repetitions || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'challenging'>(initialData?.difficulty || 'medium');
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setSets(initialData.sets.toString());
      setRepetitions(initialData.repetitions);
      setDifficulty(initialData.difficulty);
      setDescription(initialData.description);
    } else if (!isOpen) {
      setName('');
      setSets('3');
      setRepetitions('');
      setDifficulty('medium');
      setDescription('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(
      name,
      parseInt(sets),
      repetitions,
      difficulty,
      description
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Exercise Name
            </label>
            <input
              type="text"
              required
              maxLength={100}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              placeholder="e.g., Box Jumps"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Sets
              </label>
              <input
                type="number"
                required
                min={1}
                max={10}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sets}
                onInput={(e) => setSets((e.target as HTMLInputElement).value)}
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Repetitions
              </label>
              <input
                type="text"
                required
                maxLength={50}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={repetitions}
                onInput={(e) => setRepetitions((e.target as HTMLInputElement).value)}
                placeholder="e.g., 8-10"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={difficulty}
              onChange={(e) => setDifficulty((e.target as HTMLSelectElement).value as 'easy' | 'medium' | 'challenging')}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              maxLength={500}
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={description}
              onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
              placeholder="Describe the exercise technique and focus points..."
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {initialData ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
