'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceBot from '@/components/chatbot/VoiceBot';

export default function TestVoiceChatPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('test_voice_chat')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <VoiceBot />
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">{t('voice_chat_test_instructions')}</h2>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>{t('voice_chat_test_instruction1')}</li>
          <li>{t('voice_chat_test_instruction2')}</li>
          <li>{t('voice_chat_test_instruction3')}</li>
          <li>{t('voice_chat_test_instruction4')}</li>
        </ul>
      </div>
    </div>
  );
}