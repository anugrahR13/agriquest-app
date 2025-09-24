'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Gavel, 
  ArrowLeft,
  Leaf,
  CheckCircle,
  Users,
  FileText,
  Calendar,
  MapPin,
  Scale,
  AlertCircle,
  User,
  Info,
  ChevronRight,
  BarChart3,
  Award,
  Clock,
  IndianRupee
} from 'lucide-react';

interface Farm {
  id: string;
  cropType: string;
  seedVariety: string;
  sowingDate: string;
  size: number;
  location: string;
  cropScores: CropScore[];
}

interface CropScore {
  id: number;
  score: number;
  reportUrl: string;
  createdAt: string;
}

export default function AuctionApplyPage() {
  const { t } = useTranslation();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [selectedCropScore, setSelectedCropScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showFarmDetails, setShowFarmDetails] = useState(true);
  const [showCropScores, setShowCropScores] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch farms');
      }
      
      const data = await response.json();
      setFarms(data.farms);
      if (data.farms.length > 0) {
        setSelectedFarm(data.farms[0].id);
      }
    } catch (err) {
      setError('Failed to fetch farms: ' + (err as Error).message);
      console.error('Error fetching farms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFarm || selectedCropScore === null) {
      setError('Please select a farm and crop score');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      // In a real implementation, this would be an API call to /api/auction
      const response = await fetch('/api/auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          farmId: selectedFarm,
          cropScoreId: selectedCropScore
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Auction application submitted successfully! Your application is now under review by government officials. You will be notified once it is approved and listed for auction.');
        // Reset form
        setSelectedCropScore(null);
      } else {
        setError(data.error || 'Failed to submit auction application');
      }
    } catch (err) {
      setError('Failed to submit auction application: ' + (err as Error).message);
      console.error('Error submitting auction application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedFarmData = farms.find(farm => farm.id === selectedFarm);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{t('apply_for_auction')}</h1>
              <p className="text-sm opacity-90 truncate">{t('submit_your_crop_for_government_auction')}</p>
            </div>
          </div>
          <Gavel className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-md mx-auto space-y-6">
          {success ? (
            <div className="glass-card rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{t('application_submitted')}</h2>
              <p className="text-slate-600 mb-6 break-words">{success}</p>
              <Link 
                href="/auction/dashboard"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                {t('view_auction_dashboard')}
              </Link>
            </div>
          ) : (
            <>
              {/* Application Form */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span className="truncate">{t('auction_application')}</span>
                  <button 
                    onClick={() => setShowFarmDetails(!showFarmDetails)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    {showFarmDetails ? '-' : '+'}
                  </button>
                </h2>
                
                {showFarmDetails && (
                  <p className="text-slate-600 mb-6 break-words">
                    {t('select_farm_and_crop_score_for_auction')}
                  </p>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 break-words">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Farm Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                      <span className="truncate">{t('select_farm')}</span>
                      <button 
                        onClick={() => setShowFarmDetails(!showFarmDetails)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        {showFarmDetails ? '-' : '+'}
                      </button>
                    </label>
                    
                    {showFarmDetails && (
                      <select
                        value={selectedFarm}
                        onChange={(e) => setSelectedFarm(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      >
                        {farms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.cropType} - {farm.seedVariety} ({farm.size} acres)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {/* Crop Scores */}
                  {selectedFarmData && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                        <span className="truncate">{t('select_crop_score')}</span>
                        <button 
                          onClick={() => setShowCropScores(!showCropScores)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {showCropScores ? '-' : '+'}
                        </button>
                      </label>
                      
                      {showCropScores && (
                        <div className="space-y-3">
                          {selectedFarmData.cropScores.map((score) => (
                            <div 
                              key={score.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedCropScore === score.id 
                                  ? 'border-green-500 bg-green-50' 
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => setSelectedCropScore(score.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Scale className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span className="font-medium text-slate-800 truncate">
                                      {t('crop_health_score')}: {score.score}/10
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    {t('generated_on')} {new Date(score.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                {selectedCropScore === score.id && (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Farm Details */}
                  {selectedFarmData && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700 truncate">
                          {t('farm_details')}
                        </label>
                        <button 
                          onClick={() => setShowFarmDetails(!showFarmDetails)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {showFarmDetails ? '-' : '+'}
                        </button>
                      </div>
                      
                      {showFarmDetails && (
                        <div className="glass-card p-4 rounded-lg">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 truncate">Crop Type</span>
                              <span className="font-medium break-words text-right">{selectedFarmData.cropType}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 truncate">Variety</span>
                              <span className="font-medium break-words text-right">{selectedFarmData.seedVariety}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 truncate">Size</span>
                              <span className="font-medium">{selectedFarmData.size} acres</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="break-words">{selectedFarmData.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span className="break-words">
                                {t('sown_on')} {new Date(selectedFarmData.sowingDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Info Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700 truncate">
                        How It Works
                      </label>
                      <button 
                        onClick={() => setShowInfo(!showInfo)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        {showInfo ? '-' : '+'}
                      </button>
                    </div>
                    
                    {showInfo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <h3 className="font-medium text-blue-800 mb-1">How It Works</h3>
                            <p className="text-sm text-blue-700 break-words">
                              Once you submit your application, government officials will review your crop report and determine a fair starting price based on crop quality, market conditions, and regional factors. You'll be notified when your auction goes live.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || !selectedFarm || selectedCropScore === null}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('submitting')}
                      </>
                    ) : (
                      <>
                        {t('submit_application')}
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              {/* Auction Process Info */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                  Auction Process Overview
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">1</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-800">Application Submission</h4>
                      <p className="text-sm text-slate-600 break-words">
                        Submit your farm details and crop health scores for government review.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-800">Government Review</h4>
                      <p className="text-sm text-slate-600 break-words">
                        Officials evaluate your crop quality and set a fair starting price.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 font-bold text-sm">3</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-800">Auction Listing</h4>
                      <p className="text-sm text-slate-600 break-words">
                        Your crop is listed for public bidding with transparent pricing.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-600 font-bold text-sm">4</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-800">Bidding & Sale</h4>
                      <p className="text-sm text-slate-600 break-words">
                        Buyers bid on your crops with the highest bidder winning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Benefits Section */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-amber-600 flex-shrink-0" />
                  Benefits for Farmers
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <IndianRupee className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <h4 className="font-medium text-slate-800 truncate">Fair Pricing</h4>
                    </div>
                    <p className="text-sm text-slate-600 break-words">
                      Government-backed auctions ensure you get fair market value for your crops.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <h4 className="font-medium text-slate-800 truncate">Transparency</h4>
                    </div>
                    <p className="text-sm text-slate-600 break-words">
                      Real-time bidding process with complete visibility of all transactions.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <h4 className="font-medium text-slate-800 truncate">Security</h4>
                    </div>
                    <p className="text-sm text-slate-600 break-words">
                      Government-backed transactions ensure secure and reliable sales.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <h4 className="font-medium text-slate-800 truncate">Market Insights</h4>
                    </div>
                    <p className="text-sm text-slate-600 break-words">
                      Access to real-time market data and pricing trends.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <CheckCircle className="w-6 h-6" />
            <span className="text-xs">Missions</span>
          </Link>
          <Link href="/auction/dashboard" className="flex flex-col items-center py-2 text-green-600 touch-target">
            <Gavel className="w-6 h-6" />
            <span className="text-xs font-medium">Auctions</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Users className="w-6 h-6" />
            <span className="text-xs">Community</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}