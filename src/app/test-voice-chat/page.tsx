'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceBot from '@/components/chatbot/VoiceBot';

export default function TestVoiceChatPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('voiceAssistant.voice_assistant')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <VoiceBot />
      </div>
      
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{t('voiceAssistant.how_to_use')}</h2>
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
      
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6 shadow-md">
        <h3 className="font-medium text-slate-800 mb-4">{t('voiceAssistant.supported_features')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.general')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_general_desc')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.weather')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_weather_desc')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.crop')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_crop_desc')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.pest')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_pest_desc')}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.schedule')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_schedule_desc')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.soil')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_soil_desc')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.irrigation')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_irrigation_desc')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium w-32">{t('voiceAssistant.market')}:</span>
              <span className="text-slate-600">{t('voiceAssistant.feature_market_desc')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}