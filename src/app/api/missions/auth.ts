import { NextRequest, NextFetchEvent } from 'next/server';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request type to include user
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
}

// User type definition
export type User = {
  id: string;
  phone: string;
  role: string;
  farmerId?: string;
};

// Extend Request type to include user
export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

// JWT Authentication Middleware
export async function authenticateToken(request: NextRequest) {
  console.log('Auth middleware called');
  const authHeader = request.headers.get('authorization');
  console.log('Auth header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  console.log('Token:', token);

  if (!token) {
    return { error: { status: 401, message: 'Access token required' } };
  }

  // For demo purposes, we'll check if it's a mock token
  if (token.startsWith('mock_jwt_')) {
    console.log('Mock token detected');
    // Parse mock token to extract user ID
    const tokenParts = token.split('_');
    console.log('Token parts:', tokenParts);
    
    if (tokenParts.length < 4) {
      console.log('Token parts less than 4');
      return { error: { status: 403, message: 'Invalid or expired token' } };
    }

    // Token format: mock_jwt_user_demo_12345_TIMESTAMP
    // Extract the user ID part (user_demo_12345)
    const userId = `${tokenParts[2]}_${tokenParts[3]}`;
    console.log('Extracted userId:', userId);

    // For demo, we'll return a mock user
    const mockUser: User = {
      id: userId,
      phone: '9876543210',
      role: 'FARMER',
      farmerId: 'farmer_demo_12345'
    };

    return { user: mockUser };
  }

  // For real JWT tokens, check JWT_SECRET
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return { error: { status: 500, message: 'Server configuration error' } };
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        farmer: true,
        adminProfile: true
      }
    });

    if (!user || !user.isActive) {
      return { error: { status: 401, message: 'Invalid or inactive user' } };
    }

    // Create user object
    const authenticatedUser: User = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      farmerId: user.farmer?.id
    };

    return { user: authenticatedUser };
  } catch (error) {
    console.error('Token verification error:', error);
    return { error: { status: 403, message: 'Invalid or expired token' } };
  }
}

// Role-based authorization middleware
export function requireRole(roles: string[]) {
  return async function(request: NextRequest) {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return authResult;
    }

    const user = authResult.user;
    if (!user) {
      return { error: { status: 401, message: 'Authentication required' } };
    }

    if (!roles.includes(user.role)) {
      return { error: { status: 403, message: 'Insufficient permissions' } };
    }

    return { user };
  };
}

// Admin only middleware
export const requireAdmin = requireRole(['ADMIN']);

// Farmer or Admin middleware
export const requireFarmerOrAdmin = requireRole(['FARMER', 'ADMIN']);