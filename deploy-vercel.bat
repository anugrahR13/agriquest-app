@echo off
title AgriQuest Vercel Deployment Helper

echo 🌱 AgriQuest Vercel Deployment Helper
echo.

REM Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Please run this script from the project root directory.
  pause
  exit /b 1
)

echo ✅ Found project files

REM Check if Git is initialized
if not exist ".git" (
  echo 🔧 Initializing Git repository...
  git init
  git add .
  git commit -m "Initial commit for Vercel deployment"
)

echo 📦 Installing dependencies...
call npm install

echo 🔍 Checking for TypeScript errors...
npx tsc --noEmit

echo 🧪 Running tests...
call npm test

echo 📋 Preparing for Vercel deployment:
echo.
echo 1. Make sure your code is pushed to GitHub
echo 2. Go to https://vercel.com/dashboard and create a new project
echo 3. Import your GitHub repository
echo 4. Configure the project with these settings:
echo    - Framework: Next.js
echo    - Build command: next build
echo    - Output directory: .next
echo.
echo 🔑 Environment Variables needed in Vercel:
echo    - DATABASE_URL (your production database connection string)
echo    - JWT_SECRET (a secure secret key)
echo    - NEXT_PUBLIC_APP_URL (https://your-app-name.vercel.app)
echo    - NEXT_PUBLIC_API_URL (https://your-app-name.vercel.app/api)
echo    - NODE_ENV (production)
echo.
echo 📝 After deployment:
echo 1. Check the build logs for any errors
echo 2. Verify environment variables are set correctly
echo 3. Test the application functionality
echo 4. Check database connections
echo.
echo 🚀 Ready for Vercel deployment!
echo Visit https://vercel.com/new to get started
echo.
pause