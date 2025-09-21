@echo off
title AgriQuest Vercel Preparation

echo 🌱 Preparing AgriQuest for Vercel deployment...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Please run this script from the project root directory.
  pause
  exit /b 1
)

echo ✅ Found project files

REM Backup important files
echo 🔧 Creating backups...
copy package.json package.json.backup
copy next.config.ts next.config.ts.backup
copy vercel.json vercel.json.backup

REM Update dependencies to resolve deprecation warnings
echo 🔄 Updating dependencies...
call npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run db:generate

REM Create a simple build test
echo 🔍 Testing build...
call npm run build

REM Check for TypeScript errors
echo 🔍 Checking for TypeScript errors...
call npx tsc --noEmit

REM Verify Git status
echo 🔍 Checking Git status...
call git status

echo ✅ Preparation complete!
echo.
echo Next steps:
echo 1. Set up a managed database (Supabase recommended)
echo 2. Configure environment variables in Vercel dashboard
echo 3. Push changes to GitHub
echo 4. Deploy to Vercel
echo.
echo For detailed instructions, see VERCEL_DEPLOY_SUCCESS.md
echo.
pause