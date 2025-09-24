'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function TestCropPage() {
  const { t, i18n } = useTranslation();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const results = [];
    
    // Test basic translation
    try {
      const basicTest = t('cropTracking.title');
      results.push({ test: 'Basic translation', result: basicTest, status: 'success' });
    } catch (error: any) {
      results.push({ test: 'Basic translation', result: error?.message || 'Unknown error', status: 'error' });
    }
    
    // Test fallback translation
    try {
      const fallbackTest = t('dashboard.soilPH', 'Soil pH (Fallback)');
      results.push({ test: 'Fallback translation', result: fallbackTest, status: 'success' });
    } catch (error: any) {
      results.push({ test: 'Fallback translation', result: error?.message || 'Unknown error', status: 'error' });
    }
    
    // Test missing key
    try {
      const missingTest = t('nonexistent.key', 'Default Value');
      results.push({ test: 'Missing key with fallback', result: missingTest, status: 'success' });
    } catch (error: any) {
      results.push({ test: 'Missing key with fallback', result: error?.message || 'Unknown error', status: 'error' });
    }
    
    // Test i18n language
    try {
      const language = i18n.language;
      results.push({ test: 'Current language', result: language, status: 'success' });
      setCurrentLanguage(language);
    } catch (error: any) {
      results.push({ test: 'Current language', result: error?.message || 'Unknown error', status: 'error' });
    }
    
    setTestResults(results);
  }, [t, i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md mx-auto glass-card rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Translation Test</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Language Controls</h2>
          <div className="flex space-x-2">
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
          </div>
          <p className="mt-2 text-sm text-slate-600">Current language: {currentLanguage}</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Results</h2>
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                result.status === 'success' ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
              }`}
            >
              <p className="font-medium">{result.test}</p>
              <p className="text-sm mt-1">{result.result}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Direct Translation Tests</h2>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-slate-600">t('cropTracking.title'):</p>
              <p className="font-medium">{t('cropTracking.title')}</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-slate-600">t('dashboard.soilPH'):</p>
              <p className="font-medium">{t('dashboard.soilPH')}</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-slate-600">t('onboarding.farmLocation.location'):</p>
              <p className="font-medium">{t('onboarding.farmLocation.location')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}