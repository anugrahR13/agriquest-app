# AgriQuest Application Running

## Application Status
✅ The AgriQuest application is currently running and accessible at: http://localhost:3000

## Access Information
- **Local URL**: http://localhost:3000
- **Network URL**: http://10.114.9.147:3000 (accessible from other devices on the same network)
- **Demo Account**:
  - Phone: 9876543210
  - OTP: 123456

## How to Access
1. Open your web browser
2. Navigate to http://localhost:3000
3. Use the demo account credentials to log in

## Features Available
- Dashboard with all integrated features
- Missions and gamification system
- Leaderboard
- Community features
- Rewards system
- Chatbot
- Help Desk
- Crop Tracking
- AI Analysis
- Crop Reports
- Expression of Interest (EOI) system
- Auction system

## Stopping the Application
To stop the application, you can:
1. Go to the terminal where the application is running
2. Press `Ctrl + C` to stop the server

## Alternative Startup Methods
If you want to start the application again, you can use:
- `.\start-without-docker.ps1` (PowerShell script)
- `.\start-without-docker.bat` (Batch script)

## Docker Deployment (When Docker Desktop is Fixed)
If you resolve the Docker Desktop issues, you can deploy using Docker:
```
docker-compose -f docker-compose.prod.yml up -d
```

The application will be available at the same URLs when running with Docker.