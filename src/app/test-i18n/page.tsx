'use client';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function TestI18nPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md mx-auto glass-card rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">i18n Test Page</h1>
          <LanguageSwitcher />
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-slate-700 mb-2">Common Translations</h2>
            <p><strong>Welcome:</strong> {t('common.welcome')}</p>
            <p><strong>Login:</strong> {t('common.login')}</p>
            <p><strong>Submit:</strong> {t('common.submit')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-slate-700 mb-2">Crop Tracking</h2>
            <p><strong>Title:</strong> {t('cropTracking.title')}</p>
            <p><strong>Subtitle:</strong> {t('cropTracking.subtitle')}</p>
            <p><strong>Add Crop:</strong> {t('cropTracking.addCrop')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-slate-700 mb-2">AI Analysis</h2>
            <p><strong>Title:</strong> {t('aiAnalysis.title')}</p>
            <p><strong>Upload Image:</strong> {t('aiAnalysis.uploadImage')}</p>
            <p><strong>Analyze:</strong> {t('aiAnalysis.analyze')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-slate-700 mb-2">Help Desk</h2>
            <p><strong>Title:</strong> {t('helpDesk.title')}</p>
            <p><strong>New Ticket:</strong> {t('helpDesk.newTicket')}</p>
            <p><strong>Submit Ticket:</strong> {t('helpDesk.submitTicket')}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-slate-700 mb-2">Current Language</h2>
            <p>Current language code: <strong>{i18n.language}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}