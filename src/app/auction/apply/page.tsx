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
  Info
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

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/farms');
      
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
      // In a real implementation, this would be an API call to /api/auction
      const response = await fetch('/api/auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            <div>
              <h1 className="text-xl font-bold">{t('apply_for_auction')}</h1>
              <p className="text-sm opacity-90">{t('submit_your_crop_for_government_auction')}</p>
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
              <p className="text-slate-600 mb-6">{success}</p>
              <Link 
                href="/auction/status"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                {t('view_status')}
              </Link>
            </div>
          ) : (
            <>
              {/* Application Form */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-4">{t('auction_application')}</h2>
                <p className="text-slate-600 mb-6">
                  {t('select_farm_and_crop_score_for_auction')}
                </p>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Farm Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('select_farm')}
                    </label>
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
                  </div>
                  
                  {/* Crop Scores */}
                  {selectedFarmData && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('select_crop_score')}
                      </label>
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
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Scale className="w-5 h-5 text-green-600" />
                                  <span className="font-medium text-slate-800">
                                    {t('crop_health_score')}: {score.score}/10
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600">
                                  {t('generated_on')} {new Date(score.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {selectedCropScore === score.id && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Farm Details */}
                  {selectedFarmData && (
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium text-slate-800 mb-3">{t('farm_details')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <span>{selectedFarmData.cropType} ({selectedFarmData.seedVariety})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{selectedFarmData.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span>
                            {t('sown_on')} {new Date(selectedFarmData.sowingDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Scale className="w-4 h-4 text-purple-600" />
                          <span>{selectedFarmData.size} acres</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800 mb-1">How It Works</h3>
                        <p className="text-sm text-blue-700">
                          Once you submit your application, government officials will review your crop report and determine a fair starting price based on crop quality, market conditions, and regional factors. You'll be notified when your auction goes live.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || !selectedFarm || selectedCropScore === null}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('submitting')}
                      </div>
                    ) : (
                      t('submit_application')
                    )}
                  </button>
                </form>
              </div>
              
              {/* Info Section */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('how_it_works')}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{t('select_farm_and_score')}</h4>
                      <p className="text-sm text-slate-600">
                        {t('select_farm_and_score_desc')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{t('government_review')}</h4>
                      <p className="text-sm text-slate-600">
                        {t('government_review_desc')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{t('auction_listing')}</h4>
                      <p className="text-sm text-slate-600">
                        {t('auction_listing_desc')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{t('bidding_and_sale')}</h4>
                      <p className="text-sm text-slate-600">
                        {t('bidding_and_sale_desc')}
                      </p>
                    </div>
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
          <Link href="/auction/listings" className="flex flex-col items-center py-2 text-green-600 touch-target">
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