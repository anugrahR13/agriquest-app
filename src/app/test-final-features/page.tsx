'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceBot from '@/components/chatbot/VoiceBot';

export default function TestFinalFeaturesPage() {
  const { t } = useTranslation();
  const [testResults, setTestResults] = useState<any[]>([]);

  const runCropScoreTest = async () => {
    try {
      // This would normally use a real mission plan ID
      const mockMissionPlanId = 'mission_plan_123';
      
      // In a real implementation, this would trigger the final score calculation
      const response = await fetch(`/api/missions/${mockMissionPlanId}/final-score`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      setTestResults(prev => [...prev, {
        feature: 'Final Crop Score',
        status: response.ok ? 'SUCCESS' : 'FAILED',
        message: response.ok ? 'Crop score calculated successfully' : data.error,
        data: data
      }]);
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        feature: 'Final Crop Score',
        status: 'ERROR',
        message: 'Failed to calculate crop score',
        error: error.message
      }]);
    }
  };

  const runAuctionTest = async () => {
    try {
      // This would normally use real farm and crop score IDs
      const mockFarmId = 'farm_123';
      const mockCropScoreId = 1;
      
      const response = await fetch('/api/auction/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmId: mockFarmId,
          cropScoreId: mockCropScoreId
        }),
      });
      
      const data = await response.json();
      
      setTestResults(prev => [...prev, {
        feature: 'Government Auction',
        status: response.ok ? 'SUCCESS' : 'FAILED',
        message: response.ok ? 'Auction request submitted successfully' : data.error,
        data: data
      }]);
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        feature: 'Government Auction',
        status: 'ERROR',
        message: 'Failed to submit auction request',
        error: error.message
      }]);
    }
  };

  const runVoiceChatTest = async () => {
    try {
      // Test voice chat with sample text
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'What crops grow best in this region?',
          language: 'en'
        }),
      });
      
      const data = await response.json();
      
      setTestResults(prev => [...prev, {
        feature: 'Voice/Chat Bot',
        status: response.ok ? 'SUCCESS' : 'FAILED',
        message: response.ok ? 'Voice chat processed successfully' : data.error,
        data: data
      }]);
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        feature: 'Voice/Chat Bot',
        status: 'ERROR',
        message: 'Failed to process voice chat',
        error: error.message
      }]);
    }
  };

  const runAllTests = () => {
    setTestResults([]);
    runCropScoreTest();
    runAuctionTest();
    runVoiceChatTest();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('final_features_test')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('test_overview')}</h2>
        <p className="text-gray-700 mb-6">
          {t('test_overview_description')}
        </p>
        
        <button
          onClick={runAllTests}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          {t('run_all_tests')}
        </button>
        
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">{t('test_results')}</h3>
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  result.status === 'SUCCESS' 
                    ? 'bg-green-50 border-green-200' 
                    : result.status === 'FAILED' 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">{result.feature}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'SUCCESS' 
                      ? 'bg-green-100 text-green-800' 
                      : result.status === 'FAILED' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{result.message}</p>
                {result.error && (
                  <p className="mt-1 text-sm text-red-700">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('manual_voice_chat_test')}</h2>
          <p className="text-gray-700 mb-4">
            {t('manual_voice_chat_test_description')}
          </p>
          <VoiceBot />
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-2">{t('implemented_features')}</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>{t('feature_final_crop_score')}</li>
              <li>{t('feature_ai_suggestions')}</li>
              <li>{t('feature_government_auction')}</li>
              <li>{t('feature_voice_chat')}</li>
              <li>{t('feature_gamification')}</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-medium text-green-800 mb-2">{t('next_steps')}</h3>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              <li>{t('next_step_connect_real_ai')}</li>
              <li>{t('next_step_government_integration')}</li>
              <li>{t('next_step_voice_services')}</li>
              <li>{t('next_step_scaling')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}