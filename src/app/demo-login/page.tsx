"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Create a comprehensive demo user profile with proper token format
    // Using the same format as the auth-mock system: mock_jwt_user_TIMESTAMP
    const timestamp = Date.now();
    const demoToken = `mock_jwt_user_${timestamp}_${timestamp}`;
    
    const demoUser = {
      id: "user_demo_12345",
      firstName: "Rajesh",
      lastName: "Kumar",
      phone: "9876543210",
      role: "FARMER",
      profileImage: null,
      preferredLanguage: "en",
      isProfileComplete: true,
      farmer: {
        id: "farmer_demo_12345",
        farmerId: "AGR0001",
        farmName: "Green Valley Organic Farm",
        region: "Punjab",
        village: "Kotla Nihal Singh",
        panchayat: "Kotla Nihal Singh",
        farmSize: 12.5,
        primaryCrops: ["CEREALS", "VEGETABLES"],
        secondaryCrops: ["FRUITS"],
        farmingExperience: 15,
        educationLevel: "Graduate",
        totalPoints: 1500,
        level: 3,
        currentStreak: 7,
        sustainabilityScore: 85,
        // Additional fields for a complete demo
        goals: ["Increase yield by 20%", "Reduce water usage", "Improve soil health"],
        bio: "Passionate organic farmer with 15 years of experience in sustainable agriculture.",
        achievements: [
          { id: "badge_1", name: "Sustainability Champion", earnedAt: "2025-01-15" },
          { id: "badge_2", name: "Mission Master", earnedAt: "2025-02-20" },
          { id: "badge_3", name: "Community Leader", earnedAt: "2025-03-10" }
        ],
        preferences: {
          notificationEnabled: true,
          language: "en",
          preferredCrops: ["WHEAT", "RICE", "TOMATOES"]
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in localStorage
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-sm text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Setting up demo profile...</h2>
        <p className="text-slate-600">You will be redirected to the dashboard shortly.</p>
      </div>
    </div>
  );
}