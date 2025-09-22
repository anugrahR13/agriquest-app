'use client';

import { useState } from 'react';
import { 
  Leaf, 
  Camera, 
  Upload, 
  AlertCircle,
  ArrowLeft,
  FileText,
  Zap,
  Eye,
  Heart,
  Activity,
  TrendingUp,
  Target,
  Sprout
} from 'lucide-react';
import Link from 'next/link';
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
  analysisDate: string;
}

export default function AIAnalysisPage() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AIAnalysisResult[]>([]);

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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result
      const result: AIAnalysisResult = {
        healthScore: Math.floor(Math.random() * 40) + 60, // 60-99
        leafColor: ['Healthy Green', 'Yellowing', 'Brown Spots'][Math.floor(Math.random() * 3)],
        density: Math.floor(Math.random() * 30) + 70, // 70-99
        diseaseDetected: Math.random() > 0.7,
        diseaseType: Math.random() > 0.7 ? ['Rust', 'Blight', 'Mosaic'][Math.floor(Math.random() * 3)] : undefined,
        growthPercent: Math.floor(Math.random() * 40) + 50, // 50-89
        canopyCover: Math.floor(Math.random() * 30) + 60, // 60-89
        recommendations: [
          'Continue with current watering schedule',
          'Apply nitrogen fertilizer in 10 days',
          'Monitor for pest activity',
          'Consider pruning lower leaves'
        ],
        analysisDate: new Date().toISOString()
      };
      
      setAnalysisResult(result);
      setHistory([result, ...history.slice(0, 4)]); // Keep last 5 analyses
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{t('aiAnalysis.title')}</h1>
              <p className="text-sm opacity-90">{t('aiAnalysis.subtitle')}</p>
            </div>
          </div>
          <Zap className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analysis Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6 shadow-sm">
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
                          className="max-h-64 mx-auto rounded-lg shadow-md"
                        />
                        <button
                          onClick={analyzeImage}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 touch-target pulse"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              {t('aiAnalysis.analyzing')}
                            </div>
                          ) : (
                            t('aiAnalysis.analyze')
                          )}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          {t('aiAnalysis.uploadToAnalyze')}
                        </p>
                        <label className="mt-4 inline-block bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer touch-target">
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
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <strong className="font-bold">{t('common.error')}: </strong>
                      </div>
                      <span className="block sm:inline"> {error}</span>
                    </div>
                  )}
                </div>
                
                {/* Analysis Results Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {analysisResult ? t('aiAnalysis.results') : t('aiAnalysis.howItWorks')}
                  </h3>
                  
                  {analysisResult ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">{t('aiAnalysis.healthScore')}</span>
                          <span className={`text-2xl font-bold ${getHealthColor(analysisResult.healthScore)}`}>
                            {analysisResult.healthScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-600 h-3 rounded-full" 
                            style={{ width: `${analysisResult.healthScore}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{getHealthLabel(analysisResult.healthScore)}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Leaf className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-sm text-gray-600">{t('aiAnalysis.leafColor')}</p>
                          </div>
                          <p className="font-bold text-green-700">{analysisResult.leafColor}</p>
                        </div>
                        <div className="glass-card p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Activity className="w-5 h-5 text-purple-600 mr-2" />
                            <p className="text-sm text-gray-600">{t('aiAnalysis.density')}</p>
                          </div>
                          <p className="font-bold text-purple-700">{analysisResult.density}%</p>
                        </div>
                        <div className="glass-card p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
                            <p className="text-sm text-gray-600">{t('aiAnalysis.growth')}</p>
                          </div>
                          <p className="font-bold text-yellow-700">{analysisResult.growthPercent}%</p>
                        </div>
                        <div className="glass-card p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Eye className="w-5 h-5 text-blue-600 mr-2" />
                            <p className="text-sm text-gray-600">{t('aiAnalysis.canopy')}</p>
                          </div>
                          <p className="font-bold text-blue-700">{analysisResult.canopyCover}%</p>
                        </div>
                      </div>
                      
                      {analysisResult.diseaseDetected && (
                        <div className="glass-card bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-red-800">{t('aiAnalysis.diseaseDetected')}</h3>
                              <div className="mt-1 text-sm text-red-700">
                                <p>{t('aiAnalysis.diseaseType')}: {analysisResult.diseaseType}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="glass-card p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <Zap className="w-4 h-4 text-amber-600 mr-2" />
                          {t('aiAnalysis.recommendations')}
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              </div>
                              <span className="text-gray-700 text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-gray-600">
                      <div className="flex items-start">
                        <Zap className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{t('aiAnalysis.uploadToAnalyze')}</p>
                      </div>
                      <div className="flex items-start">
                        <Eye className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{t('aiAnalysis.aiDescription')}</p>
                      </div>
                      <div className="flex items-start">
                        <Heart className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{t('aiAnalysis.actionableInsights')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* History Panel */}
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-green-600 mr-2" />
                {t('aiAnalysis.recentAnalyses')}
              </h3>
              
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((analysis, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-green-50 transition-colors"
                      onClick={() => setAnalysisResult(analysis)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-medium ${getHealthColor(analysis.healthScore)}`}>
                          {analysis.healthScore}/100
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(analysis.analysisDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {analysis.leafColor} • {analysis.growthPercent}% {t('aiAnalysis.growth')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t('aiAnalysis.noHistory')}</p>
                </div>
              )}
            </div>
            
            {/* Tips */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('aiAnalysis.bestPractices')}</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span>{t('aiAnalysis.tip1')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span>{t('aiAnalysis.tip2')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span>{t('aiAnalysis.tip3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">{t('navigation.home')}</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Target className="w-6 h-6" />
            <span className="text-xs">{t('navigation.missions')}</span>
          </Link>
          <Link href="/crop-tracking" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Sprout className="w-6 h-6" />
            <span className="text-xs">{t('navigation.crops')}</span>
          </Link>
          <Link href="/ai-analysis" className="flex flex-col items-center py-2 text-green-600 touch-target">
            <Zap className="w-6 h-6" />
            <span className="text-xs font-medium">{t('navigation.aiAnalysis')}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}