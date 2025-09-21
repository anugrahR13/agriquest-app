"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Users, Trophy, Target, Phone, ArrowRight, Sprout, Sun, Droplets } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleGetStarted = () => {
    if (phoneNumber) {
      // Navigate to login with phone number
      router.push(`/auth/login?phone=${phoneNumber}`);
    } else {
      // Navigate to login page
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 agri-bg">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 text-green-200">
        <Leaf className="w-8 h-8" />
      </div>
      <div className="absolute top-20 right-20 text-amber-200">
        <Sun className="w-6 h-6" />
      </div>
      <div className="absolute bottom-20 left-20 text-blue-200">
        <Droplets className="w-6 h-6" />
      </div>
      <div className="absolute bottom-10 right-10 text-green-300">
        <Sprout className="w-8 h-8" />
      </div>

      {/* Header */}
      <header className="px-4 py-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-green-800">AgriQuest</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/auth/login" className="text-green-600 font-medium touch-target">
              {t('common.login')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 pb-20">
        <div className="max-w-md mx-auto text-center fade-in">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {t('app.tagline')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('app.description')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4 rounded-xl shadow-sm">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">{t('navigation.missions')}</h3>
              <p className="text-xs text-slate-600">{t('missions.subtitle')}</p>
            </div>
            <div className="glass-card p-4 rounded-xl shadow-sm">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">{t('navigation.rewards')}</h3>
              <p className="text-xs text-slate-600">{t('rewards.subtitle')}</p>
            </div>
            <div className="glass-card p-4 rounded-xl shadow-sm">
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">{t('navigation.community')}</h3>
              <p className="text-xs text-slate-600">{t('community.subtitle')}</p>
            </div>
            <div className="glass-card p-4 rounded-xl shadow-sm">
              <Leaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">{t('common.sustainable')}</h3>
              <p className="text-xs text-slate-600">{t('app.description')}</p>
            </div>
          </div>

          {/* Phone Input */}
          <div className="mb-6">
            <div className="glass-card rounded-xl p-4 shadow-sm mb-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg p-3">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600 mr-2">+91</span>
                <input
                  type="tel"
                  placeholder={t('auth.enterMobile')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 outline-none text-lg font-medium touch-target"
                  maxLength={10}
                />
              </div>
            </div>
            
            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 touch-target"
            >
              <span>{t('common.getStarted')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Benefits */}
          <div className="text-left space-y-3 mb-8">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-1 rounded-full mt-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <p className="text-slate-700">{t('onboarding.additionalDetails.allSetDesc')}</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-1 rounded-full mt-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <p className="text-slate-700">{t('leaderboard.subtitle')}</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-1 rounded-full mt-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <p className="text-slate-700">{t('rewards.yourPoints', { points: '1000' })}</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-1 rounded-full mt-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <p className="text-slate-700">{t('community.sharePost')}</p>
            </div>
          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto text-center text-xs text-slate-500">
          {t('app.offlineSupport')}
        </div>
      </footer>
    </div>
  );
}