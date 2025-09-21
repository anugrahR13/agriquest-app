"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Setting up demo account...');

  useEffect(() => {
    const setupDemoAccount = async () => {
      try {
        setStatus('Requesting OTP...');
        
        // Request OTP
        const otpResponse = await fetch('/api/auth/request-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: '9876543210' }),
        });

        if (!otpResponse.ok) {
          throw new Error('Failed to request OTP');
        }

        const otpData = await otpResponse.json();
        const otp = otpData.mockOTP || '123456';
        setStatus('Verifying OTP...');

        // Verify OTP
        const verifyResponse = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: '9876543210', otp }),
        });

        if (!verifyResponse.ok) {
          throw new Error('Failed to verify OTP');
        }

        const verifyData = await verifyResponse.json();
        setStatus('Setting up profile...');

        // Store token and user data
        localStorage.setItem('token', verifyData.token);
        localStorage.setItem('user', JSON.stringify(verifyData.user));

        // If profile is not complete, complete it
        if (!verifyData.user.isProfileComplete) {
          setStatus('Completing profile...');
          
          const profileResponse = await fetch('/api/auth/complete-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${verifyData.token}`,
            },
            body: JSON.stringify({
              firstName: 'Demo',
              lastName: 'Farmer',
              farmName: 'Demo Farm',
              region: 'Punjab',
              village: 'Demo Village',
              panchayat: 'Demo Panchayat',
              farmSize: '10',
              primaryCrops: ['CEREALS', 'VEGETABLES'],
              secondaryCrops: ['FRUITS'],
              farmingExperience: '15',
              educationLevel: 'Graduate',
              preferredLanguage: 'en',
            }),
          });

          if (!profileResponse.ok) {
            throw new Error('Failed to complete profile');
          }

          const profileData = await profileResponse.json();
          
          // Update user data in localStorage
          localStorage.setItem('user', JSON.stringify(profileData.user));
        }

        setStatus('Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (error) {
        console.error('Setup error:', error);
        setStatus(`Error: ${(error as Error).message}`);
        setLoading(false);
      }
    };

    setupDemoAccount();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-sm text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{status}</h2>
        <p className="text-slate-600">Using demo credentials: 9876543210 / 123456</p>
      </div>
    </div>
  );
}