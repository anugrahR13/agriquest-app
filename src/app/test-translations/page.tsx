'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TestTranslationsPage() {
  const { t, i18n } = useTranslation();
  
  // Test if translations are working
  const testTranslations = () => {
    console.log('Current language:', i18n.language);
    console.log('Dashboard soilPH:', t('dashboard.soilPH'));
    console.log('Farm location:', t('onboarding.farmLocation.location'));
    console.log('Crop tracking title:', t('cropTracking.title'));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md mx-auto glass-card rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Link href="/dashboard" className="touch-target">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Translation Test</h1>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={testTranslations}
            className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Test Translations (Check Console)
          </button>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">dashboard.soilPH:</p>
            <p className="font-medium">{t('dashboard.soilPH')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">onboarding.farmLocation.location:</p>
            <p className="font-medium">{t('onboarding.farmLocation.location')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">cropTracking.title:</p>
            <p className="font-medium">{t('cropTracking.title')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">cropTracking.sowingDate:</p>
            <p className="font-medium">{t('cropTracking.sowingDate')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">cropTracking.farmSize:</p>
            <p className="font-medium">{t('cropTracking.farmSize')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}