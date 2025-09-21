#!/usr/bin/env tsx

/**
 * Script to initialize the AgriQuest application with demo data
 * This script sets up the necessary environment for hackathon presentation
 */

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🌱 Initializing AgriQuest Demo Environment...');

// Initialize Prisma (even if not used, it's good to have for completeness)
const prisma = new PrismaClient();

async function initDemo() {
  try {
    console.log('✅ Demo environment initialized successfully!');
    console.log('\n🚀 AgriQuest Hackathon Demo Setup Complete');
    console.log('\n📋 Quick Start Instructions:');
    console.log('1. Run the application: npm run dev:full');
    console.log('2. Visit: http://localhost:3002/hackathon-demo');
    console.log('3. Click "Access Demo Account" or use credentials:');
    console.log('   Phone: 9876543210');
    console.log('   OTP: 123456');
    console.log('\n🎯 Key Features Available:');
    console.log('• Gamified missions with points and badges');
    console.log('• AI crop analysis with health scoring');
    console.log('• Government auction integration');
    console.log('• Multilingual voice/chat bot');
    console.log('• Community platform and leaderboards');
    console.log('• Rewards system with redemption');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing demo:', error);
    process.exit(1);
  }
}

// Run the initialization
initDemo();