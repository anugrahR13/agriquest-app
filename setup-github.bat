@echo off
echo 🌱 AgriQuest GitHub Setup Script
echo ================================

echo.
echo Step 1: Please create a new repository on GitHub:
echo 1. Go to https://github.com and log in
echo 2. Click the "+" icon and select "New repository"
echo 3. Name it "agriquest-app"
echo 4. Choose Public or Private
echo 5. Leave all checkboxes UNCHECKED
echo 6. Click "Create repository"
echo.

pause

echo.
echo Step 2: Enter your GitHub username:
set /p github_username="GitHub Username: "

echo.
echo Step 3: Adding remote repository...
cd /d "c:\Users\venum\agriquest app\agriquest-app"
git remote remove origin 2>nul
git remote add origin https://github.com/%github_username%/agriquest-app.git

echo.
echo Step 4: Pushing code to GitHub...
git add .
git commit -m "Initial commit: AgriQuest application"
git branch -M main
git push -u origin main

echo.
echo 🎉 Setup complete!
echo Your repository is now available at: https://github.com/%github_username%/agriquest-app
echo.
echo To deploy to Vercel:
echo 1. Go to https://vercel.com
echo 2. Sign up/log in
echo 3. Click "New Project"
echo 4. Import your GitHub repository
echo 5. Deploy!
echo.
pause