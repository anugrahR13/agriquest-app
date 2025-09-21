@echo off
title AgriQuest Local Development Server

echo ================================
echo 🌱 AgriQuest Local Development
echo ================================

echo.
echo Starting AgriQuest application...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting development server...
echo.
echo Access the application at: http://localhost:3000
echo.
echo Demo account:
echo Phone: 9876543210
echo OTP: 123456
echo.

npm run dev

pause