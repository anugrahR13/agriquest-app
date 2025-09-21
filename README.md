# AgriQuest - Gamified Sustainable Farming Platform

AgriQuest is a comprehensive platform that empowers farmers with sustainable farming practices through gamification, AI-powered crop analysis, and community engagement.

## Features

- **Gamified Farming**: Earn points, badges, and rewards for completing sustainable farming missions
- **AI Crop Analysis**: Upload photos of your crops for health analysis and recommendations
- **Government Auction Integration**: Apply for government auctions with verified crop reports
- **Multilingual Voice/Chat Bot**: Get farming advice in your local language
- **Community Platform**: Share experiences and learn from other farmers
- **Leaderboards**: Compete with other farmers in sustainability challenges
- **Offline Support**: Works even without internet connection

## Tech Stack

- **Frontend**: Next.js 15 with App Router, Tailwind CSS, TypeScript
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: TensorFlow.js for crop analysis
- **Authentication**: Phone-based OTP system
- **Deployment**: Docker containers

## Prerequisites

- Node.js (v18 or higher)
- Docker (for database - optional for demo)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agriquest-app
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

To run the application in development mode with both frontend and backend:

```bash
npm run dev:full
```

This will start:
- Frontend server on http://localhost:3002
- Backend API server on http://localhost:3006

### Individual Services

To run only the backend server:
```bash
npm run server
```

To run only the frontend:
```bash
npm run dev
```

## Demo Access

For hackathon presentations and quick testing, you can access the demo account:

1. Visit http://localhost:3002/demo-login for instant access
2. Or use the phone number `9876543210` with OTP `123456` on the regular login page

The demo account includes:
- Pre-filled farmer profile with realistic data
- 1500 points and level 3 status
- 7-day streak and 85 sustainability score
- Completed missions and achievements

## Feature Walkthrough

### Authentication & Onboarding
- Phone-based OTP authentication
- Comprehensive farmer profile setup
- Farm details, crop information, and experience tracking

### Dashboard
- Overview of points, streaks, and sustainability score
- Quick access to all major features
- Recent activity feed

### Missions System
- Step-by-step farming missions
- Photo documentation for verification
- Points and rewards for completion

### AI Crop Analysis
- Upload crop photos for health analysis
- Receive detailed reports on health score, leaf color, density, etc.
- Actionable recommendations for improvement

### Crop Reports
- Generate comprehensive crop credit reports
- Visualize growth timelines and sustainability metrics
- Share reports with government agencies for auctions

### Government Auction Flow
- Apply for government auctions with verified reports
- Track application status
- Receive notifications about auction results

### Multilingual Voice/Chat Bot
- Voice input in multiple Indian languages
- Text-to-speech responses in the same language
- Farming advice and support

### Leaderboard & Community
- Regional and global leaderboards
- Community posts and discussions
- Knowledge sharing platform

### Rewards System
- Redeem points for seeds, tools, training, and cash rewards
- Track reward status and delivery

## API Endpoints

- **Health Check**: `GET /api/health`
- **Authentication**: `/api/auth/*`
- **User Management**: `/api/users/*`
- **Missions**: `/api/missions/*`
- **Rewards**: `/api/rewards/*`
- **Leaderboard**: `/api/leaderboard/*`
- **Community**: `/api/community/*`
- **Crop Tracking**: `/api/crop-tracking/*`
- **AI Analysis**: `/api/crop-tracking/ai-analysis/*`

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database (optional for demo)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Server Configuration
PORT=3006

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3002

# AI Configuration
NEXT_PUBLIC_TFJS_MODEL_URL=/models/model.json
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_VISION_ENABLED=false
AI_IMPLEMENTATION=tfjs
```

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

### Docker Deployment (Optional)

1. Start the database:
```bash
docker-compose up -d
```

2. Run database migrations:
```bash
npm run db:migrate
```

3. Generate Prisma client:
```bash
npm run db:generate
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If ports 3002 or 3006 are in use, the application will automatically use different ports. Check the terminal output for the actual URLs.

2. **Database Connection**: For demo purposes, the application uses a mock authentication system that doesn't require a database. If you want to use the full database features, ensure Docker is running and the database is properly configured.

3. **TypeScript Errors**: If you encounter TypeScript errors, try:
```bash
npm run build
```

### Demo Mode

The application is fully functional in demo mode without a database connection. All features are accessible through the demo account.

## Development

### Project Structure

```
agriquest-app/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── i18n/            # Internationalization files
│   └── styles/           # Global styles
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── utils/           # Utility functions
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── scripts/             # Utility scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- TensorFlow.js for AI crop analysis
- Prisma for database ORM
- Next.js for frontend framework
- Express.js for backend framework