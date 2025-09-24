'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TranslationDebugPage() {
  const { t, i18n } = useTranslation();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Test various translation keys
    const testTranslations: Record<string, string> = {
      'cropTracking.title': t('cropTracking.title', 'Crop Tracking (Fallback)'),
      'dashboard.soilPH': t('dashboard.soilPH', 'Soil pH (Fallback)'),
      'onboarding.farmLocation.location': t('onboarding.farmLocation.location', 'Location (Fallback)'),
      'navigation.crops': t('navigation.crops', 'Crop Tracking (Fallback)'),
      'common.acres': t('common.acres', 'acres (Fallback)'),
      'cropTracking.growthStages': t('cropTracking.growthStages', 'Growth Stages (Fallback)'),
      'common.of': t('common.of', 'of (Fallback)'),
      'common.completed': t('common.completed', 'completed (Fallback)'),
      'cropTracking.viewDetails': t('cropTracking.viewDetails', 'View Details (Fallback)'),
      'cropTracking.sowingDate': t('cropTracking.sowingDate', 'Sowing Date (Fallback)'),
      'cropTracking.farmSize': t('cropTracking.farmSize', 'Farm Size (Fallback)'),
      'cropTracking.photos': t('cropTracking.photos', 'Photos (Fallback)'),
      'common.complete': t('common.complete', 'Complete (Fallback)'),
      'aiAnalysis.title': t('aiAnalysis.title', 'AI Crop Analysis (Fallback)'),
      'aiAnalysis.healthScore': t('aiAnalysis.healthScore', 'Health Score (Fallback)'),
      'aiAnalysis.leafColor': t('aiAnalysis.leafColor', 'Leaf Color (Fallback)'),
      'aiAnalysis.growth': t('aiAnalysis.growth', 'Growth (Fallback)'),
      'aiAnalysis.healthy': t('aiAnalysis.healthy', 'Healthy (Fallback)'),
      'cropReports.generateReport': t('cropReports.generateReport', 'Generate Report (Fallback)'),
    };
    
    setTranslations(testTranslations);
    setCurrentLanguage(i18n.language);
  }, [t, i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto glass-card rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Link href="/dashboard" className="touch-target">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Translation Debug</h1>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Language Controls</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 rounded-lg ${currentLanguage === 'en' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
            <button 
              onClick={() => changeLanguage('hi')}
              className={`px-4 py-2 rounded-lg ${currentLanguage === 'hi' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Hindi
            </button>
            <button 
              onClick={() => changeLanguage('gu')}
              className={`px-4 py-2 rounded-lg ${currentLanguage === 'gu' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Gujarati
            </button>
            <button 
              onClick={() => changeLanguage('kn')}
              className={`px-4 py-2 rounded-lg ${currentLanguage === 'kn' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Kannada
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">Current language: {currentLanguage}</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Translation Tests</h2>
          {Object.entries(translations).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-slate-600 font-mono">{key}:</p>
              <p className="font-medium break-words">{value}</p>
              <div className="mt-2 text-xs">
                <span className={`px-2 py-1 rounded ${value.includes('(Fallback)') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {value.includes('(Fallback)') ? 'Using Fallback' : 'Translated'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Information</h3>
          <p className="text-sm text-blue-700">
            This page helps identify translation issues. If any translations show "(Fallback)", 
            it means the key is missing from the translation files.
          </p>
        </div>
      </div>
    </div>
  );
}