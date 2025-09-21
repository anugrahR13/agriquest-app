"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { 
  Phone as FaPhone, 
  Lock as FaLock, 
  ArrowRight as FaArrowRight, 
  Tractor as FaTractor
} from 'lucide-react';
import { Phone, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import '../../../../styles/login-photo-background.css';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animationLoaded, setAnimationLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setAnimationLoaded(true);
  }, []);

  const requestOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError(t('auth.invalidPhone'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006'}/api/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
      } else {
        setError(data.error || t('auth.otpFailed'));
      }
    } catch (err) {
      setError(t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError(t('auth.invalidOtp'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006'}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on profile completion
        if (data.user.isProfileComplete) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        setError(data.error || t('auth.verifyFailed'));
      }
    } catch (err) {
      setError(t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Authentic Photo Background */}
      <div className="photo-background"></div>
      
      {/* Photo Attribution */}
      <div className="photo-attribution">
        Photo by <a href="https://unsplash.com/@francescocantinellifoto" target="_blank" rel="noopener noreferrer">Francesco Cantinelli</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>
      </div>

      {/* Header */}
      <header className="w-full flex justify-between items-center p-4 z-10">
        <div className="flex items-center bg-white bg-opacity-80 px-3 py-1 rounded-lg">
          <FaTractor className="text-green-600 mr-2 text-2xl" />
          <h1 className="text-xl font-bold text-green-800">AgriQuest</h1>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 z-10">
        <div className="glass-card">
          <div className="login-header">
            <h1>{t('auth.title') || 'Welcome to AgriQuest'}</h1>
            <p>{t('auth.subtitle') || 'Your agricultural companion'}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!otpSent ? (
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  className="input-field pl-10"
                  placeholder={t('auth.enterMobile') || "Enter your phone number"}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <button 
                className="submit-button mt-4"
                onClick={requestOtp}
                disabled={loading || phoneNumber.length !== 10}
              >
                {loading ? t('auth.sending') || 'Sending...' : t('auth.sendOtp') || 'Get OTP'} <FaArrowRight className="inline ml-2" />
              </button>
            </div>
          ) : (
            <div className="input-group">
              <label htmlFor="otp">{t('auth.enterOtp') || "Enter OTP"}</label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  className="input-field pl-10"
                  placeholder={t('auth.otpPlaceholder') || "Enter OTP sent to your phone"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <button 
                className="submit-button mt-4"
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? t('auth.verifying') || 'Verifying...' : t('auth.verifyAndContinue') || 'Verify OTP'} <FaArrowRight className="inline ml-2" />
              </button>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setOtpSent(false)}
                  className="text-green-600 hover:underline"
                >
                  {t('auth.changePhone') || "Change Phone Number"}
                </button>
              </div>
              
              <div className="mt-2 text-center">
                <button
                  onClick={requestOtp}
                  className="text-gray-600 hover:underline"
                >
                  {t('auth.resendOtp') || "Resend OTP"}
                </button>
              </div>
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="login-footer">
            {t('auth.terms') || "By logging in, you agree to our Terms of Service and Privacy Policy"}
          </div>
        </div>
      </main>

      <footer className="px-4 py-6 relative z-10">
        <div className="max-w-md mx-auto text-center text-sm bg-white/30 py-3 px-4 rounded-full backdrop-blur-sm">
          {t('auth.secureLogin') || "Secure login with OTP verification"}
        </div>
      </footer>
    </div>
  );
}