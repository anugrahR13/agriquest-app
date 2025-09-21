import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languages } from './config';

// Import translation files (only the 4 languages we want to keep)
import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';
import kn from './locales/kn.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
      kn: { translation: kn },
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;