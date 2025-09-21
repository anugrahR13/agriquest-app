# AgriQuest Development Setup

## Prerequisites
- Node.js (version 18 or higher)
- PostgreSQL database (optional for full functionality)

## Running the Application

### Method 1: Using the Development Script (Recommended)
```powershell
# Run the development script
.\start-full-app.ps1
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3006/api

### Method 2: Manual Start

1. Start the backend server:
```powershell
npm run server
```

2. In a separate terminal, start the frontend:
```powershell
npm run dev
```

## Accessing the Application

Once both servers are running:
- Open your browser and navigate to http://localhost:3000
- The API endpoints are available at http://localhost:3006/api

## Login Process

To log in to the application:
1. Go to http://localhost:3000
2. Click on the "Login" link
3. Enter one of the demo phone numbers:
   - Admin Phone: 9999999999
   - Demo Farmer Phone: 9876543210
4. Use OTP: 123456 for both accounts
5. After successful login, you'll be redirected to the dashboard

## Available API Endpoints

- Health Check: GET http://localhost:3006/api/health
- Request OTP: POST http://localhost:3006/api/auth/request-otp
- Verify OTP: POST http://localhost:3006/api/auth/verify-otp
- Missions: GET http://localhost:3006/api/missions
- Leaderboard: GET http://localhost:3006/api/leaderboard

## Troubleshooting

### Port Conflicts
If you see a message about ports being in use, the application will automatically use the next available port.

### Database Issues
The application uses mock authentication by default, so a database is not required for basic functionality.

### Dependency Issues
If you encounter dependency conflicts, try:
```powershell
npm install --legacy-peer-deps
```

### Blank Page Issues
If you see a blank page:
1. Make sure both frontend and backend servers are running
2. Check that the frontend is running on port 3000
3. Check that the backend is running on port 3006
4. Verify API connectivity by accessing http://localhost:3006/api/health

### Common Fixes
1. Clear Node.js modules and reinstall:
   ```powershell
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

2. If you see TypeScript errors, install required dependencies:
   ```powershell
   npm install --save-dev typescript @types/react @types/node
   ```

## Application Structure

The application has the following key pages:
- Home: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Dashboard: http://localhost:3000/dashboard
- Missions: http://localhost:3000/missions
- Leaderboard: http://localhost:3000/leaderboard
- Community: http://localhost:3000/community
- Rewards: http://localhost:3000/rewards

## Demo Credentials

For testing the application, you can use these demo credentials:
- Phone Numbers: 9999999999 (Admin) or 9876543210 (Farmer)
- OTP for both: 123456

## Features

The AgriQuest application includes:
- User authentication with OTP
- Dashboard with user statistics
- Missions system for sustainable farming practices
- Leaderboard for competition among farmers
- Community section for sharing experiences
- Rewards system for completing missions
- Multi-language support (English, Hindi, Gujarati, Kannada)