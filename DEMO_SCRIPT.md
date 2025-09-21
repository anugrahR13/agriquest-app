# AgriQuest Demo Script for Hackathon Presentation

## Overview
This document provides a step-by-step guide to demonstrate all features of the AgriQuest platform during your hackathon presentation.

## Demo Account Credentials
- **Phone Number**: 9876543210
- **OTP**: 123456

## Feature Walkthrough

### 1. Authentication & Onboarding
1. Navigate to the login page
2. Enter phone number: `9876543210`
3. Click "Send OTP"
4. Enter OTP: `123456`
5. Complete onboarding with farmer profile:
   - First Name: Rajesh
   - Last Name: Kumar
   - Farm Name: Green Valley Organic Farm
   - Region: Punjab
   - Village: Kotla Nihal Singh
   - Farm Size: 12.5 acres
   - Primary Crops: Cereals, Vegetables
   - Secondary Crops: Fruits
   - Experience: 15 years
   - Education: Graduate

### 2. Dashboard Features
After login, you'll land on the dashboard showing:
- Farmer profile with avatar
- Total points: 1500
- Current streak: 7 days
- Sustainability score: 85/100
- Quick action buttons for missions, leaderboard, rewards, and community

### 3. Missions System
1. Click on "Missions" in the bottom navigation
2. Show the mission list with different stages:
   - Land Preparation (Completed)
   - Sowing (Completed)
   - First Irrigation (Available)
   - First Weeding (Available)
   - Fertilizer Application (Available)
3. Demonstrate mission completion flow:
   - Click on an available mission
   - Show photo upload functionality
   - Complete mission and show points earned

### 4. AI Crop Analysis
1. Navigate to "AI Analysis" from the dashboard
2. Upload a sample crop image (use any image for demo)
3. Show AI analysis results:
   - Health Score: 85/100
   - Leaf Color: Healthy Green
   - Density: 80%
   - Growth: 75%
   - Canopy Cover: 70%
   - Recommendations for improvement

### 5. Crop Reports
1. Go to "Crop Reports" section
2. Show generated crop credit report:
   - Health score visualization
   - Growth timeline chart
   - Sustainability breakdown
   - Predicted yield range
   - Actionable recommendations

### 6. Government Auction Flow
1. Navigate to "Auction" section
2. Show how farmers can apply for government auctions:
   - Select crop report
   - Submit application
   - Track application status
3. Demonstrate the approval process from government authority perspective

### 7. Multilingual Voice/Chat Bot
1. Go to "Chatbot" section
2. Demonstrate voice input in multiple languages:
   - English
   - Hindi
   - Marathi
   - Tamil
   - Kannada
   - Gujarati
3. Show text-to-speech response in the same language

### 8. Leaderboard & Community
1. Visit "Leaderboard" to show rankings
2. Navigate to "Community" to demonstrate:
   - Posting updates
   - Sharing experiences
   - Commenting on posts
   - Following other farmers

### 9. Rewards System
1. Go to "Rewards" section
2. Show available rewards:
   - Seeds & Saplings
   - Farming Tools
   - Training & Courses
   - Cash Rewards
3. Demonstrate reward redemption process

## Technical Features

### 1. Gamification Elements
- Points system for mission completion
- Badges for achievements
- Streak tracking
- Level progression
- Leaderboards

### 2. Sustainability Tracking
- Sustainability score calculation
- Environmental impact assessment
- Recommendations for improvement
- Progress visualization

### 3. Offline Support
- Works offline with data sync when online
- Secure data storage
- Progressive Web App capabilities

### 4. Multilingual Support
- Interface in 4 Indian languages
- Voice recognition in local languages
- Text-to-speech responses

## Key Benefits for Farmers
1. **Increased Income**: Access to government auctions and premium markets
2. **Knowledge Sharing**: Community platform for learning best practices
3. **Sustainability**: Tools to adopt eco-friendly farming methods
4. **Recognition**: Gamification to make farming more engaging
5. **Accessibility**: Works on basic smartphones with offline support

## Key Benefits for Government
1. **Data Collection**: Real-time insights into farming practices
2. **Quality Assurance**: AI-powered crop health verification
3. **Farmer Engagement**: Platform to communicate initiatives
4. **Transparency**: Automated auction process with verifiable reports

## Technology Stack
- **Frontend**: Next.js 15 with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **AI**: TensorFlow.js for crop analysis
- **Authentication**: Phone-based OTP system
- **Deployment**: Docker containers

## Quick Access URLs
- **Main Application**: http://localhost:3002
- **Demo Login**: http://localhost:3002/demo-login
- **API Server**: http://localhost:3006
- **API Documentation**: http://localhost:3006/api/health

## Demo Tips
1. Start with the demo login page for instant access: http://localhost:3002/demo-login
2. Show the dashboard with all key metrics
3. Navigate through each feature systematically
4. Highlight the gamification elements (points, badges, streaks)
5. Demonstrate the AI analysis with a sample image
6. Show the multilingual capabilities of the voice/chat bot
7. Explain how the government auction system works
8. End with the community features to show social engagement

## Troubleshooting
- If the application doesn't start, ensure Docker is running
- If there are port conflicts, check that ports 3002 and 3006 are free
- For database issues, use the mock authentication system
- For AI features, ensure TensorFlow.js models are loaded

## Future Enhancements
1. Integration with IoT sensors for real-time monitoring
2. Blockchain-based supply chain tracking
3. Advanced AI models for disease detection
4. Marketplace for farm equipment and services
5. Weather integration for precise farming recommendations