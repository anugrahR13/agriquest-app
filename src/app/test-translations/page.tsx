'use client';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useState } from 'react';

export default function TestTranslationsPage() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
  };

  // Test all major translation sections
  const translationSections = [
    {
      title: "Common",
      keys: [
        'common.welcome',
        'common.login',
        'common.submit',
        'common.cancel',
        'common.continue'
      ]
    },
    {
      title: "App",
      keys: [
        'app.name',
        'app.tagline',
        'app.description'
      ]
    },
    {
      title: "Navigation",
      keys: [
        'navigation.home',
        'navigation.dashboard',
        'navigation.missions',
        'navigation.leaderboard',
        'navigation.rewards'
      ]
    },
    {
      title: "Authentication",
      keys: [
        'auth.title',
        'auth.subtitle',
        'auth.mobileNumber',
        'auth.sendOtp',
        'auth.verifyOtp'
      ]
    },
    {
      title: "Crop Tracking",
      keys: [
        'cropTracking.title',
        'cropTracking.subtitle',
        'cropTracking.addCrop',
        'cropTracking.noCrops',
        'cropTracking.sowingDate'
      ]
    },
    {
      title: "AI Analysis",
      keys: [
        'aiAnalysis.title',
        'aiAnalysis.uploadImage',
        'aiAnalysis.analyze',
        'aiAnalysis.healthScore',
        'aiAnalysis.diseaseDetected'
      ]
    },
    {
      title: "Help Desk",
      keys: [
        'helpDesk.title',
        'helpDesk.newTicket',
        'helpDesk.ticketTitle',
        'helpDesk.submitTicket',
        'helpDesk.myTickets'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Translation Test Page</h1>
              <p className="text-slate-600">Testing all translations for all languages</p>
            </div>
            <div className="mt-4 md:mt-0">
              <LanguageSwitcher />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="font-semibold text-slate-700 mb-2">Current Language</h2>
            <p>Current language code: <strong>{i18n.language}</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {translationSections.map((section, index) => (
            <div key={index} className="glass-card rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">{section.title} Translations</h2>
              <div className="space-y-3">
                {section.keys.map((key, keyIndex) => (
                  <div key={keyIndex} className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">{key}</p>
                    <p className="text-slate-700">{t(key)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}