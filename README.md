# Todo Now App

A modern, feature-rich todo application built with React Native (Expo) and Convex backend. This app helps you manage your tasks efficiently with priority settings, due dates, and task status tracking.

## Features

- **User Authentication**: Secure login and registration using Clerk
- **Task Management**:
  - Create, edit, and delete tasks
  - Mark tasks as completed/in-progress
  - Set priority flags for important tasks
  - Set due dates with date and time picker
- **Task Organization**:
  - Search functionality to find specific tasks
  - Filter tasks by status (completed/in-progress)
  - Sort tasks by priority and due date
- **User Profile**: View and manage your profile information
- **Responsive UI**: Beautiful and intuitive interface with animations
- **Real-time Updates**: Changes sync instantly across devices

## Screenshots

<!-- Add your screenshots here from assets/screenshots directory -->

| Home Screen                            | Add Task Screen                                | Task Details                                           |
| -------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| ![Home](./assets/screenshots/home.png) | ![Add Task](./assets/screenshots/add_task.png) | ![Task Details](./assets/screenshots/task_details.png) |

## Tech Stack

### Frontend

- **React Native** with **Expo** - Mobile app framework
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation system
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation
- **React Native Reanimated** - Animations
- **React Native Unistyles** - Styling system
- **date-fns** - Date utility library

### Backend

- **Convex** - Backend-as-a-service for real-time data
- **Clerk** - Authentication and user management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or Bun package manager
- Expo CLI

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd todo_now_app
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

## Available Scripts

- `npm run android` or `bun run android` - Run the app on an Android device/emulator
- `npm run ios` or `bun run ios` - Run the app on an iOS simulator
- `npm run update:app` - Update the app with EAS Update
- `npm run publish:android` - Build Android app for preview
- `npm run lint` - Lint the code
- `npm run format` - Format the code with ESLint and Prettier

## Development

The project follows a structured architecture:

- `src/app` - Main application routes
- `src/components` - Reusable UI components
- `src/styles` - Styling configuration
- `src/types` - TypeScript type definitions
- `src/validations` - Form validation schemas
- `convex` - Backend API and schema definitions

## Lessons Learned

- Building a real-time application with Convex backend
- Implementing robust forms with validation using React Hook Form and Yup
- Creating a performant mobile app with React Native and Expo
- Using file-based routing for navigation with Expo Router
- Managing state efficiently across the application
- Implementing authentication with Clerk
- Creating smooth animations with React Native Reanimated

## License

[MIT License](LICENSE)
