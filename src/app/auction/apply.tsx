'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import AuctionForm from '@/components/auction/AuctionForm';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface CropScore {
  id: number;
  farmId: string;
  score: number;
  reportUrl: string;
  createdAt: string;
}

export default function AuctionApplyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [cropScore, setCropScore] = useState<CropScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    // In a real implementation, we would get the farmId from the user context
    // For demo purposes, we'll use a mock farmId
    fetchCropScore();
  }, []);

  const fetchCropScore = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crop-score`);
      const data = await response.json();
      
      if (response.ok) {
        setCropScore(data.cropScore);
      } else {
        setError(data.error || 'Failed to fetch crop score');
      }
    } catch (err) {
      setError('Failed to fetch crop score');
      console.error('Error fetching crop score:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmitted = () => {
    setApplicationSubmitted(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <strong className="font-bold">{t('error')}:</strong>
          </div>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!cropScore) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <strong className="font-bold">{t('no_data')}:</strong>
          </div>
          <span className="block sm:inline"> {t('no_crop_score_found')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('apply_for_government_auction')}</h1>
      
      {applicationSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-green-800">{t('application_submitted')}</h2>
          </div>
          <p className="mt-2 text-green-700">
            {t('application_submitted_description')}
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/auction/status')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {t('view_application_status')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AuctionForm 
              farmId={cropScore.farmId} 
              cropScoreId={cropScore.id} 
              onApplicationSubmitted={handleApplicationSubmitted} 
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('crop_score_summary')}</h2>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {cropScore.score.toFixed(1)}
                  <span className="text-2xl text-gray-500">/10</span>
                </div>
                <p className="text-gray-600">{t('final_crop_health_score')}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">{t('generated_on')}</h3>
                <p className="text-gray-900">
                  {new Date(cropScore.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="mt-6">
                <a 
                  href={cropScore.reportUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  {t('download_full_report')}
                </a>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-800 mb-2">{t('eligibility_criteria')}</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>{t('eligibility_requirement1')}</li>
                <li>{t('eligibility_requirement2')}</li>
                <li>{t('eligibility_requirement3')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}