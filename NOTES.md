# Admin Screen - Workout Category creator
I want to create a new admin screen where the admin can create and modify information about default workout categories.
* The workout category has a name name, focus area, key objective, and a list of exercises that can help the athlete grow in the area
* Exercises have a name, number of sets, number of repetitions per set, difficulty (easy, medium, challenging), and a description
* There are default work categories focused on skills valuable for volleyball players (ex. Vertical Jump, Serving Power, Court Agility, Core Strength, Reaction Time, Blocking, Setting, and Endurance)

Provide recommendations on a design to make this easy to use.

# Workout Wizard Screen
Create a wizard with the purpose of an athlete to build a new workout plan.
1. **Workout Category**: The user selects the workout category they want to focus on (example: Court Agility, Blocking, Jumping, etc.)
2.  **Commitment**: The user selects the start date, number of weeks, and days of the the week to commit to (The days of the week are displayed, by default Monday, Wednesday, and Friday are selected. The users can change the selections.)
3. **Exercise**: The user selects the exercises to add to their workout plan

Provide recommendations on a design to make this easy to use.

# User Dashboard screen
Create a user dashboard screen that provides a summary of all their scheduled workouts and status. Provide recommendations on a design to make this easy to use and provide the user a great experience at understanding how they are tracking toward their goals.



# Calendar screen
* This screen defaults to the current week
* The user can see the days of the week and scheduled workout types that are scheduled for the days
* A scheduled workout type can be dragged from one day to another
* Selecting a scheduled workout type shows the the list of exercise
* The user can mark the entire scheduled workout type as complete, partial, or skipped
* A user can add notes to the scheduled workout type
* The status is updated on the weekly view

Provide recommendations on a design to make this easy to use.





********************************************************************





A comprehensive web application for volleyball athletes to create personalized training plans, manage schedules via an interactive calendar, receive timely reminders, and track performance data.

## Features

### Plan Creation & Management
- Athlete profile with position and goals
- Custom workout builder with volleyball-specific types
- Training phase templates
- "Build My Plan" wizard

### Scheduling & Calendar
- Interactive calendar (Monthly/Weekly/Daily views)
- Drag-and-drop rescheduling
- Recurring workouts
- Notification system (in-app, email, SMS)
- Training load visualization

### Tracking & Review
- Mark workouts as complete
- Post-workout logging (duration, RPE, notes)
- Weekly compliance reports
- Progress graphs and trends


- Athlete profiles and goals
- Workout builder
- Calendar scheduling
- Notification system (already has mock mode working!)
- Progress tracking

**Features:**
- Create custom volleyball-specific workouts
- View all workouts in grid layout
- Delete workouts
- 7 workout types with emoji icons
- RPE slider (1-10 intensity scale)
- Form validation and error handling

**Workout Types:**
- Court Practice/Skills 🏐
- Plyometrics 💪
- Agility ⚡
- Strength 🏋️
- Conditioning 🏃
- Rest 😴
- Other 📋

### Added - Training Plan Templates

**New Features:**
- Training plan template library with 3 pre-configured programs
- Template browsing page with beautiful card layout
- Detailed template view modal with all exercises
- Navigation between templates and custom workouts
- Hero section with prominent call-to-action buttons

**Templates Included:**
- 4-Week Volleyball Performance Program (Intermediate)
- Beginner Volleyball Fundamentals (6 weeks)
- Setter Development Program (8 weeks)




# Custom Workout Builder - Feature Implementation

### 1. Database Schema

- **`workouts`** table - stores custom workout definitions
- **`training_plans`** table - organizes workouts into plans
- **`scheduled_workouts`** table - calendar scheduling (ready for future implementation)
- **`athletes`** table - user profiles
### 4. Workout Builder UI

**Features:**
- ✅ **View all workouts** - Grid layout with workout cards
- ✅ **Create workouts** - Inline form with all workout fields
- ✅ **Delete workouts** - One-click removal with confirmation
- ✅ **RPE slider** - Visual intensity selection (1-10 scale)
- ✅ **Workout type icons** - Visual categorization with emojis

**Form Fields:**
- Name (required)
- Type (required) - dropdown with all 7 types
- Duration (minutes)
- Sets & Reps
- Intensity (RPE 1-10)
- Description
