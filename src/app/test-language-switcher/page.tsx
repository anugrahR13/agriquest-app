'use client';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function TestLanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="glass-card rounded-xl p-6 shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Language Switcher Test</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Current Language</h2>
          <p className="text-slate-600">Language Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{i18n.language}</span></p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Test Translations</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <p><span className="font-medium">App Name:</span> {t('app.name')}</p>
            <p><span className="font-medium">Welcome:</span> {t('common.welcome')}</p>
            <p><span className="font-medium">Login:</span> {t('common.login')}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Language Switcher</h2>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Verify that changing language updates the translations above</p>
        </div>
      </div>
    </div>
  );
}