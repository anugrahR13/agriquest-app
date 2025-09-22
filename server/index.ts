import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Prisma
const prisma = new PrismaClient();

// Create Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3006;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join leaderboard room
  socket.on('join-leaderboard', (data) => {
    const { region, panchayat } = data;
    const room = `leaderboard-${region}-${panchayat}`;
    socket.join(room);
    console.log(`User ${socket.id} joined ${room}`);
  });
  
  // Leave leaderboard room
  socket.on('leave-leaderboard', (data) => {
    const { region, panchayat } = data;
    const room = `leaderboard-${region}-${panchayat}`;
    socket.leave(room);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AgriQuest API is running' });
});

// Log all API requests
app.use('/api', (req, res, next) => {
  console.log(`📨 API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Import route modules
import authRoutes from './routes/auth-mock'; // Using mock version for demo
import userRoutes from './routes/users-mock'; // Using mock version for demo
import missionRoutes from './routes/missions';
import rewardRoutes from './routes/rewards';
import leaderboardRoutes from './routes/leaderboard';
import communityRoutes from './routes/community';
import adminRoutes from './routes/admin';
import cropTrackingRoutes from './routes/crop-tracking';
import growthStagesRoutes from './routes/crop-tracking/growth-stages';
import photosRoutes from './routes/crop-tracking/photos';
import aiAnalysisRoutes from './routes/crop-tracking/ai-analysis';
import helpDeskRoutes from './routes/help-desk';
import missionsNewRoutes from './routes/missions-new'; // New missions route
import finalScoreRoutes from './routes/final-score'; // Final crop score route
import auctionRoutes from './routes/auction'; // Auction routes
import voiceChatRoutes from './routes/voice-chat'; // Voice chat routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/crop-tracking', cropTrackingRoutes);
app.use('/api/crop-tracking', growthStagesRoutes);
app.use('/api/crop-tracking', photosRoutes);
app.use('/api/crop-tracking', aiAnalysisRoutes);
app.use('/api/help-desk', helpDeskRoutes);
app.use('/api/missions-new', missionsNewRoutes); // Register new missions route
app.use('/api', finalScoreRoutes); // Register final score route
app.use('/api', auctionRoutes); // Register auction routes
app.use('/api', voiceChatRoutes); // Register voice chat routes

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler for API routes
app.use('/api', (req, res, next) => {
  // If we get here, no API route matched
  console.log(`❌ 404 - API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'API route not found', path: req.originalUrl });
});

// 404 handler for all other routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 AgriQuest server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Export for use in other modules
export { io, prisma, app };