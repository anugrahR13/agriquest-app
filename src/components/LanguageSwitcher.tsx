'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { languages } from '../i18n/config';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save the selected language to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  };

  // Render the same structure on both server and client, but only apply active styling after mounting
  return (
    <div className="flex items-center space-x-2">
      {Object.entries(languages).map(([code, lang]) => {
        // Only apply active styling after mounting to avoid hydration mismatch
        const isActive = mounted && i18n.language === code;
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium transition-colors";
        const activeClasses = isActive 
          ? 'bg-green-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
        
        return (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={`${baseClasses} ${activeClasses}`}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.nativeName}
          </button>
        );
      })}
    </div>
  );
}