# AgriQuest - Running the Application

This document provides instructions on how to run the AgriQuest application after the frontend and backend have been integrated into a single Next.js application.

## Prerequisites

Before running the application, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- PostgreSQL database (for production usage)

## Quick Start

### Option 1: Using the PowerShell Script (Windows only)
```powershell
# Navigate to the project directory
cd "c:\Users\venum\agriquest app\agriquest-app"

# Run the startup script
.\start-dev.ps1
```

### Option 2: Using npm commands
```bash
# Navigate to the project directory
cd "c:\Users\venum\agriquest app\agriquest-app"

# Run the development server
npm run dev
```

## What happens when you run the application?

1. The Next.js development server starts
2. Both frontend and backend functionality are served from the same port
3. API routes are accessible at `/api/*` endpoints
4. The application will be available at `http://localhost:3000` (or next available port if 3000 is in use)

## Available Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server (requires build first)
- `npm run lint` - Runs ESLint to check for code issues
- `npm run test` - Runs the test suite

## Database Commands

- `npm run db:migrate` - Runs database migrations
- `npm run db:generate` - Generates Prisma client
- `npm run db:seed` - Seeds the database with initial data
- `npm run db:studio` - Opens Prisma Studio for database browsing

## Demo and Setup Commands

- `npm run init-demo` - Initializes demo data
- `npm run initialize-crop-badges` - Sets up crop-related badges
- `npm run verify-setup` - Verifies the application setup

## Accessing the Application

After starting the development server:
1. Open your browser and navigate to `http://localhost:3000`
2. The application should load and display the login page
3. Use demo phone number `9876543210` with OTP `123456` to log in

## API Endpoints

The integrated API routes are available at:
- `/api/health` - Health check endpoint
- `/api/auth/*` - Authentication endpoints
- `/api/missions` - Missions data
- `/api/leaderboard` - Leaderboard data
- `/api/rewards` - Rewards system
- `/api/community` - Community features
- `/api/crop-tracking` - Crop tracking functionality
- `/api/help-desk` - Help desk features
- `/api/auction` - Auction system
- `/api/voice-chat` - Voice chat functionality

## Troubleshooting

If you encounter issues:
1. Ensure all dependencies are installed: `npm install`
2. Check that the PostgreSQL database is running (if using real database)
3. Verify environment variables in `.env.local` file
4. Check the terminal output for any error messages

## Development Notes

- The application uses Next.js App Router for both frontend pages and API routes
- All backend functionality has been moved to Next.js API routes under `/src/app/api/`
- Authentication uses a mock system for development, with JWT for production
- The frontend and backend share the same codebase and are deployed together