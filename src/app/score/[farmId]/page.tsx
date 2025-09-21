'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ScoreCard from '@/components/ai/ScoreCard';
import Suggestions from '@/components/ai/Suggestions';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';

interface CropScore {
  id: number;
  farmId: string;
  score: number;
  reportUrl: string;
  createdAt: string;
}

interface ReportData {
  farmerName: string;
  farmLocation: string;
  cropType: string;
  sowingDate: string;
  healthScore: number;
  recommendations: string[];
  // ... other fields
}

export default function ScorePage({ params }: { params: { farmId: string } }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [cropScore, setCropScore] = useState<CropScore | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCropScore();
  }, [params.farmId]);

  const fetchCropScore = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crop-score/${params.farmId}`);
      const data = await response.json();
      
      if (response.ok) {
        setCropScore(data.cropScore);
        // In a real implementation, we would fetch the full report data
        // For now, we'll create mock data
        setReportData({
          farmerName: 'Ramesh Kumar',
          farmLocation: 'Ghazipur, Uttar Pradesh',
          cropType: 'Wheat',
          sowingDate: '2025-09-01',
          healthScore: data.cropScore.score * 10, // Convert back to 0-100 scale
          recommendations: generateMockRecommendations(data.cropScore.score)
        });
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

  const generateMockRecommendations = (score: number): string[] => {
    if (score < 3) {
      return [
        'Severe crop health issues detected. Immediate intervention required.',
        'Consider replanting or switching to a more resilient crop variety.',
        'Consult with local agricultural experts for emergency assistance.'
      ];
    } else if (score < 5) {
      return [
        'Poor crop health detected. Significant improvements needed.',
        'Implement better irrigation practices.',
        'Apply organic fertilizers to improve soil nutrition.'
      ];
    } else if (score < 7) {
      return [
        'Below average crop health. Several improvements recommended.',
        'Optimize watering schedule based on soil moisture.',
        'Add compost or organic matter to soil.'
      ];
    } else if (score < 9) {
      return [
        'Good crop health with room for improvement.',
        'Maintain current practices and monitor growth.',
        'Consider crop rotation for next season.'
      ];
    } else {
      return [
        'Excellent crop health! Continue current practices.',
        'Consider sharing your success with other farmers.',
        'Eligible for premium market prices.'
      ];
    }
  };

  const handleDownloadReport = () => {
    if (cropScore?.reportUrl) {
      // In a real implementation, this would download the actual PDF
      window.open(cropScore.reportUrl, '_blank');
    }
  };

  const handleApplyForAuction = () => {
    // Redirect to auction application page
    router.push('/auction/apply');
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
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('final_crop_score')}</h1>
        <button 
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          <Download className="h-4 w-4" />
          {t('download_report')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScoreCard 
          score={cropScore.score} 
          healthScore={reportData?.healthScore || 0}
          farmerName={reportData?.farmerName || ''}
          farmLocation={reportData?.farmLocation || ''}
          cropType={reportData?.cropType || ''}
        />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">{t('crop_details')}</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('sowing_date')}</p>
                <p className="font-medium">{reportData?.sowingDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('generated_on')}</p>
                <p className="font-medium">{new Date(cropScore.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reportData && (
        <Suggestions recommendations={reportData.recommendations} />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('apply_for_government_auction')}</h2>
        <p className="mb-4 text-gray-700">{t('auction_description')}</p>
        <button 
          onClick={handleApplyForAuction}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {t('apply_for_auction')}
        </button>
      </div>
    </div>
  );
}