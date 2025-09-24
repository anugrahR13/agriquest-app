'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CropTrackingDebug() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      // Test if translation is working
      const testTranslation = t('cropTracking.title');
      console.log('Translation test:', testTranslation);
      
      // Test if fallback translation is working
      const fallbackTranslation = t('dashboard.soilPH', 'Soil pH (Fallback)');
      console.log('Fallback translation test:', fallbackTranslation);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in crop tracking debug:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }, [t]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading debug page...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline break-words">{errorMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md mx-auto glass-card rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Crop Tracking Debug</h1>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">t('cropTracking.title'):</p>
            <p className="font-medium">{t('cropTracking.title')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">t('dashboard.soilPH'):</p>
            <p className="font-medium">{t('dashboard.soilPH')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-slate-600">t('onboarding.farmLocation.location'):</p>
            <p className="font-medium">{t('onboarding.farmLocation.location')}</p>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Debug test completed successfully!</p>
            <p className="text-green-700 text-sm mt-2">If you can see this page, the translation system is working correctly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}