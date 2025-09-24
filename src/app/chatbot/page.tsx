'use client';

import { useTranslation } from 'react-i18next';
import { HelpCircle, CloudRain, Sprout, Bug, Calendar, Leaf, Droplets, BarChart3 } from 'lucide-react';
import VoiceBot from '@/components/chatbot/VoiceBot';

export default function ChatbotPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('voiceAssistant.voice_assistant')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VoiceBot />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('voiceAssistant.how_to_use')}</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <span className="text-gray-700">{t('voiceAssistant.voice_instruction_1')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <span className="text-gray-700">{t('voiceAssistant.voice_instruction_2')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <span className="text-gray-700">{t('voiceAssistant.voice_instruction_3')}</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">4</span>
                </div>
                <span className="text-gray-700">{t('voiceAssistant.voice_instruction_4')}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-3">{t('voiceAssistant.supported_features')}</h3>
            <ul className="space-y-3 text-blue-700">
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <HelpCircle className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.general')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_general_desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <CloudRain className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.weather')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_weather_desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Sprout className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.crop')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_crop_desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Bug className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.pest')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_pest_desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Calendar className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.schedule')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_schedule_desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Leaf className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.soil')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_soil_desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Droplets className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.irrigation')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_irrigation_desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <BarChart3 className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{t('voiceAssistant.market')}:</span>
                  <span className="ml-1">{t('voiceAssistant.feature_market_desc')}</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-3">{t('voiceAssistant.supported_languages')}</h3>
            <ul className="grid grid-cols-2 gap-2 text-blue-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {t('voiceAssistant.language_english')}
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {t('voiceAssistant.language_hindi')}
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {t('voiceAssistant.language_marathi')}
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {t('voiceAssistant.language_tamil')}
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {t('voiceAssistant.language_kannada')}
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {t('voiceAssistant.language_gujarati')}
              </li>
            </ul>
            <p className="mt-4 text-sm text-blue-600">{t('voiceAssistant.more_languages_coming_soon')}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-medium text-yellow-800 mb-3">{t('voiceAssistant.privacy_notice')}</h3>
            <p className="text-yellow-700 text-sm">
              {t('voiceAssistant.voice_data_privacy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}