import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AIAnalysisResult {
  healthScore: number;
  leafColor: string;
  density: number;
  diseaseDetected: boolean;
  diseaseType?: string;
  growthPercent: number;
  canopyCover: number;
  recommendations: string[];
}

const AIAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call to our backend
      // const formData = new FormData();
      // formData.append('image', selectedImage);
      // const response = await fetch('/api/crop-tracking/ai-analysis', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      
      // Mock implementation with simulated delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      setAnalysisResult({
        healthScore: 85,
        leafColor: 'GREEN',
        density: 78,
        diseaseDetected: false,
        growthPercent: 65,
        canopyCover: 82,
        recommendations: [
          'Continue with current watering schedule',
          'Apply nitrogen fertilizer in 10 days',
          'Monitor for pest activity'
        ]
      });
    } catch (err) {
      setError(t('aiAnalysis.analysisError'));
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return t('aiAnalysis.healthy');
    if (score >= 60) return t('aiAnalysis.moderate');
    return t('aiAnalysis.poor');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('aiAnalysis.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('aiAnalysis.uploadImage')}</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {loading ? t('aiAnalysis.analyzing') : t('aiAnalysis.analyze')}
                </button>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  {t('aiAnalysis.dragDrop')}
                </p>
                <label className="mt-4 inline-block bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  {t('aiAnalysis.selectFile')}
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{t('error')}:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        </div>
        
        {/* Analysis Results Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {analysisResult ? t('aiAnalysis.results') : t('aiAnalysis.resultsPlaceholder')}
          </h3>
          
          {analysisResult ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{t('aiAnalysis.healthScore')}</span>
                  <span className={`text-xl font-bold ${getHealthColor(analysisResult.healthScore)}`}>
                    {analysisResult.healthScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${analysisResult.healthScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{getHealthLabel(analysisResult.healthScore)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t('aiAnalysis.leafColor')}</p>
                  <p className="font-bold text-blue-700">{analysisResult.leafColor}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t('aiAnalysis.density')}</p>
                  <p className="font-bold text-purple-700">{analysisResult.density}%</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t('aiAnalysis.growth')}</p>
                  <p className="font-bold text-yellow-700">{analysisResult.growthPercent}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t('aiAnalysis.canopy')}</p>
                  <p className="font-bold text-green-700">{analysisResult.canopyCover}%</p>
                </div>
              </div>
              
              {analysisResult.diseaseDetected && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{t('aiAnalysis.diseaseDetected')}</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{t('aiAnalysis.diseaseType')}: {analysisResult.diseaseType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('aiAnalysis.recommendations')}</h4>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>{t('aiAnalysis.uploadToAnalyze')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;