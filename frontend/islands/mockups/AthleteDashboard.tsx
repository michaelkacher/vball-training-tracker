/**
 * Athlete Dashboard Island Component
 *
 * This component contains all the interactive logic and UI for the athlete dashboard.
 * Includes mock data for demonstration purposes.
 */

import { useState } from "preact/hooks";

// Mock data types
interface Workout {
  id: string;
  name: string;
  category: string;
  date: string;
  duration: number;
  status: "completed" | "scheduled" | "upcoming" | "missed" | "rest";
}

interface WorkoutPlan {
  id: string;
  name: string;
  category: string;
  totalSessions: number;
  completedSessions: number;
  startDate: string;
  daysRemaining: number;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

interface DaySchedule {
  day: string;
  date: string;
  workoutName: string;
  status: "completed" | "scheduled" | "upcoming" | "missed" | "rest";
  isToday: boolean;
}

export default function AthleteDashboard() {
  // Mock athlete data
  const athleteName = "Sarah";
  const joinDate = "2025-09-15";
  const totalWorkoutsCompleted = 47;
  const currentStreak = 5;
  const longestStreak = 12;
  const weekCompletedCount = 3;
  const weekTotalCount = 4;

  // Mock current week schedule
  const [weekSchedule] = useState<DaySchedule[]>([
    {
      day: "Monday",
      date: "Oct 27",
      workoutName: "Morning Agility Drills",
      status: "completed",
      isToday: false,
    },
    {
      day: "Tuesday",
      date: "Oct 28",
      workoutName: "Blocking Fundamentals",
      status: "completed",
      isToday: false,
    },
    {
      day: "Wednesday",
      date: "Oct 29",
      workoutName: "Rest Day",
      status: "rest",
      isToday: false,
    },
    {
      day: "Thursday",
      date: "Oct 30",
      workoutName: "Vertical Jump Training",
      status: "completed",
      isToday: false,
    },
    {
      day: "Friday",
      date: "Oct 31",
      workoutName: "Serving Power & Accuracy",
      status: "missed",
      isToday: false,
    },
    {
      day: "Saturday",
      date: "Nov 1",
      workoutName: "Court Movement & Footwork",
      status: "scheduled",
      isToday: false,
    },
    {
      day: "Sunday",
      date: "Nov 2",
      workoutName: "Full Skills Session",
      status: "scheduled",
      isToday: true,
    },
  ]);

  // Mock active workout plans
  const [workoutPlans] = useState<WorkoutPlan[]>([
    {
      id: "1",
      name: "Vertical Jump 4-Week Program",
      category: "Jumping",
      totalSessions: 12,
      completedSessions: 8,
      startDate: "Oct 5, 2025",
      daysRemaining: 14,
    },
    {
      id: "2",
      name: "Serving Mastery",
      category: "Serving",
      totalSessions: 10,
      completedSessions: 6,
      startDate: "Oct 15, 2025",
      daysRemaining: 20,
    },
    {
      id: "3",
      name: "Court Agility Basics",
      category: "Court Agility",
      totalSessions: 8,
      completedSessions: 3,
      startDate: "Oct 20, 2025",
      daysRemaining: 25,
    },
  ]);

  // Mock recent activity
  const [recentWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Vertical Jump Training",
      category: "Jumping",
      date: "Oct 30, 2025",
      duration: 45,
      status: "completed",
    },
    {
      id: "2",
      name: "Blocking Fundamentals",
      category: "Blocking",
      date: "Oct 28, 2025",
      duration: 50,
      status: "completed",
    },
    {
      id: "3",
      name: "Morning Agility Drills",
      category: "Court Agility",
      date: "Oct 27, 2025",
      duration: 40,
      status: "completed",
    },
    {
      id: "4",
      name: "Serving Power & Accuracy",
      category: "Serving",
      date: "Oct 25, 2025",
      duration: 35,
      status: "completed",
    },
    {
      id: "5",
      name: "Setting Precision Practice",
      category: "Setting",
      date: "Oct 23, 2025",
      duration: 40,
      status: "completed",
    },
  ]);

  // Mock category breakdown
  const categoryData = [
    { category: "Court Agility", sessions: 12, color: "bg-blue-500" },
    { category: "Blocking", sessions: 8, color: "bg-purple-500" },
    { category: "Jumping", sessions: 10, color: "bg-green-500" },
    { category: "Serving", sessions: 9, color: "bg-orange-500" },
    { category: "Passing", sessions: 5, color: "bg-pink-500" },
    { category: "Setting", sessions: 3, color: "bg-yellow-500" },
  ];

  const maxSessions = Math.max(...categoryData.map((c) => c.sessions));

  // Mock achievements
  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      name: "First Week Complete",
      icon: "🎯",
      description: "Completed your first week of training",
      unlocked: true,
    },
    {
      id: "2",
      name: "10 Workouts Done",
      icon: "💪",
      description: "Reached 10 completed workouts",
      unlocked: true,
    },
    {
      id: "3",
      name: "5 Day Streak",
      icon: "🔥",
      description: "Maintained a 5-day workout streak",
      unlocked: true,
    },
    {
      id: "4",
      name: "30 Day Streak",
      icon: "⭐",
      description: "Maintain a 30-day workout streak",
      unlocked: false,
    },
    {
      id: "5",
      name: "50 Workouts Milestone",
      icon: "🏆",
      description: "Complete 50 total workouts",
      unlocked: false,
    },
  ]);

  // Mock streak calendar (last 14 days)
  const streakDays = [true, true, false, true, true, true, true, true, false, true, true, true, true, true];

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "scheduled":
        return "🔵";
      case "upcoming":
        return "📅";
      case "missed":
        return "❌";
      case "rest":
        return "😴";
      default:
        return "📅";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-800";
      case "scheduled":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "upcoming":
        return "bg-gray-50 border-gray-200 text-gray-600";
      case "missed":
        return "bg-red-50 border-red-200 text-red-800";
      case "rest":
        return "bg-purple-50 border-purple-200 text-purple-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Court Agility": "⚡",
      "Blocking": "🛡️",
      "Jumping": "🦘",
      "Serving": "🎾",
      "Passing": "🤝",
      "Setting": "✋",
    };
    return icons[category] || "🏐";
  };

  const totalProgressPercentage = Math.round(
    (workoutPlans.reduce((sum, plan) => sum + plan.completedSessions, 0) /
      workoutPlans.reduce((sum, plan) => sum + plan.totalSessions, 0)) *
      100
  );

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Hero Section */}
      <div class="max-w-7xl mx-auto mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {athleteName}!
              </h1>
              <p class="text-blue-100 text-lg mb-4">
                {weekCompletedCount} of {weekTotalCount} workouts completed this week
              </p>
              <div class="flex items-center gap-2 text-xl">
                <span class="font-semibold">{currentStreak} day streak!</span>
                <span class="text-2xl">🔥</span>
              </div>
            </div>
            <button class="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
              Start Today's Workout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Grid */}
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - This Week's Schedule */}
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">This Week's Schedule</h2>
              <div class="space-y-3">
                {weekSchedule.map((day) => (
                  <div
                    key={day.day}
                    class={`border-2 rounded-lg p-4 transition-all ${
                      day.isToday
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : getStatusColor(day.status)
                    }`}
                  >
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-gray-800">{day.day}</span>
                          {day.isToday && (
                            <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              TODAY
                            </span>
                          )}
                        </div>
                        <span class="text-sm text-gray-600">{day.date}</span>
                      </div>
                      <span class="text-2xl">{getStatusIcon(day.status)}</span>
                    </div>
                    <p class="font-medium text-gray-800 mb-2">{day.workoutName}</p>
                    {day.status !== "rest" && (
                      <button class="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                        View Details →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Progress Stats */}
          <div class="lg:col-span-1 space-y-6">
            {/* Overall Progress Card */}
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold mb-4 text-gray-800">Overall Progress</h3>
              <div class="flex items-center justify-center mb-4">
                <div class="relative w-40 h-40">
                  <svg class="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      stroke-width="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#3b82f6"
                      stroke-width="12"
                      fill="none"
                      stroke-dasharray={`${2 * Math.PI * 70}`}
                      stroke-dashoffset={`${2 * Math.PI * 70 * (1 - totalProgressPercentage / 100)}`}
                      class="transition-all duration-1000"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-3xl font-bold text-gray-800">{totalProgressPercentage}%</span>
                  </div>
                </div>
              </div>
              <p class="text-center text-gray-600">
                {workoutPlans.reduce((sum, plan) => sum + plan.completedSessions, 0)} of{" "}
                {workoutPlans.reduce((sum, plan) => sum + plan.totalSessions, 0)} total workouts
                completed
              </p>
            </div>

            {/* Workout Streak Card */}
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold mb-4 text-gray-800">Workout Streak</h3>
              <div class="text-center mb-4">
                <div class="text-5xl mb-2">🔥</div>
                <div class="text-3xl font-bold text-orange-600 mb-1">
                  {currentStreak} Days
                </div>
                <p class="text-sm text-gray-600">Longest: {longestStreak} days</p>
              </div>
              <div class="flex justify-center gap-1 flex-wrap">
                {streakDays.map((completed, idx) => (
                  <div
                    key={idx}
                    class={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {completed ? "✓" : "·"}
                  </div>
                ))}
              </div>
              <p class="text-center text-xs text-gray-500 mt-2">Last 14 days</p>
            </div>

            {/* Category Breakdown Card */}
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold mb-4 text-gray-800">Category Breakdown</h3>
              <div class="space-y-3">
                {categoryData.map((cat) => (
                  <div key={cat.category}>
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <span>{getCategoryIcon(cat.category)}</span>
                        {cat.category}
                      </span>
                      <span class="text-sm font-bold text-gray-800">{cat.sessions}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        class={`${cat.color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${(cat.sessions / maxSessions) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Card */}
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-bold mb-4 text-gray-800">Recent Activity</h3>
              <div class="space-y-3">
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="text-2xl">✅</div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-gray-800 truncate">{workout.name}</p>
                      <p class="text-sm text-gray-600">
                        {getCategoryIcon(workout.category)} {workout.category}
                      </p>
                      <p class="text-xs text-gray-500">
                        {workout.date} · {workout.duration} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Active Workout Plans */}
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">Active Workout Plans</h2>
              <div class="space-y-4">
                {workoutPlans.map((plan) => {
                  const progress = (plan.completedSessions / plan.totalSessions) * 100;
                  return (
                    <div
                      key={plan.id}
                      class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                          <h4 class="font-bold text-gray-800 mb-1">{plan.name}</h4>
                          <div class="flex items-center gap-1 text-sm text-gray-600">
                            <span>{getCategoryIcon(plan.category)}</span>
                            <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              {plan.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="mb-3">
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-600">Progress</span>
                          <span class="font-bold text-gray-800">
                            {plan.completedSessions} / {plan.totalSessions}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3">
                          <div
                            class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div class="flex justify-between text-sm text-gray-600 mb-3">
                        <span>Started: {plan.startDate}</span>
                        <span class="font-medium">{plan.daysRemaining} days left</span>
                      </div>

                      <div class="flex gap-2">
                        <button class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                        <button class="px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div class="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
                <p class="text-sm text-blue-800 mb-2">Ready for more?</p>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Create New Workout Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Goals & Achievements */}
        <div class="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Goals & Achievements</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                class={`p-4 rounded-lg text-center transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 shadow-md"
                    : "bg-gray-100 border-2 border-gray-300 opacity-60"
                }`}
              >
                <div class="text-4xl mb-2">{achievement.icon}</div>
                <h4 class="font-bold text-sm text-gray-800 mb-1">{achievement.name}</h4>
                <p class="text-xs text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div class="mt-2 text-xs font-semibold text-yellow-700">UNLOCKED!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Workouts Preview */}
        <div class="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">Next 7 Days</h2>
          <div class="flex overflow-x-auto gap-4 pb-2">
            {weekSchedule.map((day, idx) => (
              <div
                key={idx}
                class={`flex-shrink-0 w-32 p-3 rounded-lg border-2 text-center ${
                  day.isToday
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div class="font-bold text-sm text-gray-800">{day.day}</div>
                <div class="text-xs text-gray-600 mb-2">{day.date}</div>
                <div class="text-2xl mb-1">{getStatusIcon(day.status)}</div>
                <div class="text-xs text-gray-700 font-medium leading-tight">
                  {day.workoutName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
