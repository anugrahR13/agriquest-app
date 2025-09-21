"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Leaf, Phone, ArrowRight, AlertCircle, Sprout, Sun } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError(t('auth.invalidPhone'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('otp');
      } else {
        setError(data.error || t('auth.otpFailed'));
      }
    } catch (err) {
      setError(t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError(t('auth.invalidOtp'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/verify-otp`, {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col agri-bg">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 text-green-200">
        <Leaf className="w-8 h-8" />
      </div>
      <div className="absolute top-20 right-20 text-amber-200">
        <Sun className="w-6 h-6" />
      </div>
      <div className="absolute bottom-20 left-20 text-green-300">
        <Sprout className="w-8 h-8" />
      </div>

      {/* Header */}
      <header className="px-4 py-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-green-800">एग्रीक्वेस्ट</h1>
          </Link>
          {/* Language Switcher */}
          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 flex items-center justify-center">
        <div className="w-full max-w-md fade-in">
          {step === 'phone' ? (
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('auth.title')}</h2>
                <p className="text-slate-600">{t('auth.subtitle')}</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('auth.mobileNumber')}
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 focus-within:border-green-500">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600 mr-2">+91</span>
                  <input
                    type="tel"
                    placeholder={t('auth.enterMobile')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 outline-none text-lg font-medium touch-target"
                    autoFocus
                  />
                </div>
              </div>

              <button
                onClick={handleRequestOTP}
                disabled={loading || phoneNumber.length !== 10}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('auth.sending')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('auth.sendOtp')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                {t('auth.terms')}
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('auth.verifyOtp')}</h2>
                <p className="text-slate-600">
                  {t('auth.otpSent', { phone: phoneNumber })}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('auth.enterOtp')}
                </label>
                <input
                  type="text"
                  placeholder={t('auth.otpPlaceholder')}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg font-medium text-center outline-none focus:border-green-500 touch-target"
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('auth.verifying')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('auth.verifyAndContinue')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => setStep('phone')}
                  className="text-green-600 font-medium text-sm hover:underline touch-target"
                >
                  {t('auth.changePhone')}
                </button>
              </div>

              <div className="text-center mt-2">
                <button
                  onClick={handleRequestOTP}
                  className="text-slate-500 text-sm hover:text-slate-700 touch-target"
                >
                  {t('auth.resendOtp')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-4">
        <div className="max-w-md mx-auto text-center text-xs text-slate-500">
          {t('auth.secureLogin')}
        </div>
      </footer>
    </div>
  );
}