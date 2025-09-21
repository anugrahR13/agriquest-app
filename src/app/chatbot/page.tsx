'use client';

import { useTranslation } from 'react-i18next';
import VoiceBot from '@/components/chatbot/VoiceBot';

export default function ChatbotPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('voice_assistant')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VoiceBot />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('how_to_use')}</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">1</div>
                <span className="text-gray-700">{t('voice_instruction_1')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">2</div>
                <span className="text-gray-700">{t('voice_instruction_2')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">3</div>
                <span className="text-gray-700">{t('voice_instruction_3')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">4</div>
                <span className="text-gray-700">{t('voice_instruction_4')}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-2">{t('supported_languages')}</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>{t('language_english')}</li>
              <li>{t('language_hindi')}</li>
              <li>{t('language_marathi')}</li>
              <li>{t('language_tamil')}</li>
              <li>{t('language_kannada')}</li>
              <li>{t('language_gujarati')}</li>
            </ul>
            <p className="mt-3 text-sm text-blue-600">{t('more_languages_coming_soon')}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-medium text-yellow-800 mb-2">{t('privacy_notice')}</h3>
            <p className="text-yellow-700 text-sm">
              {t('voice_data_privacy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}