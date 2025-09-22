'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Gavel, 
  Clock, 
  MapPin, 
  Scale, 
  IndianRupee,
  Calendar,
  ArrowLeft,
  Leaf,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Target,
  Users,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AuctionDetail {
  id: number;
  cropType: string;
  variety: string;
  quantity: number;
  startingPrice: number;
  currentBid: number;
  startDate: string;
  endDate: string;
  farmerName: string;
  farmLocation: string;
  status: string;
  cropScore: number;
  reportUrl: string;
  governmentNotes: string | null;
  bids: Bid[];
}

interface Bid {
  id: number;
  bidderName: string;
  amount: number;
  timestamp: string;
  isWinner: boolean;
}

export default function AuctionBiddingPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  useEffect(() => {
    fetchAuctionDetails();
  }, [params.id]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockData: AuctionDetail = {
        id: parseInt(params.id),
        cropType: 'WHEAT',
        variety: 'HD 2967',
        quantity: 5.5,
        startingPrice: 2000,
        currentBid: 2200,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        farmerName: 'Ramesh Kumar',
        farmLocation: 'Ghazipur, Uttar Pradesh',
        status: 'ACTIVE',
        cropScore: 8.5,
        reportUrl: '/sample-report.pdf',
        governmentNotes: 'High quality produce with excellent health score. Recommended for premium markets.',
        bids: [
          { id: 1, bidderName: 'Trader A', amount: 2200, timestamp: new Date().toISOString(), isWinner: true },
          { id: 2, bidderName: 'Trader B', amount: 2150, timestamp: new Date(Date.now() - 10000).toISOString(), isWinner: false },
          { id: 3, bidderName: 'Trader C', amount: 2100, timestamp: new Date(Date.now() - 20000).toISOString(), isWinner: false },
          { id: 4, bidderName: 'Trader D', amount: 2050, timestamp: new Date(Date.now() - 30000).toISOString(), isWinner: false }
        ]
      };
      
      setAuction(mockData);
    } catch (err) {
      setError('Failed to fetch auction details');
      console.error('Error fetching auction details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= (auction?.currentBid || 0)) {
      alert(t('bid_must_be_higher_than_current'));
      return;
    }
    
    setIsPlacingBid(true);
    try {
      // In a real implementation, this would submit the bid to the server
      const newBid: Bid = {
        id: auction!.bids.length + 1,
        bidderName: 'You',
        amount: parseFloat(bidAmount),
        timestamp: new Date().toISOString(),
        isWinner: false
      };
      
      setAuction(prev => ({
        ...prev!,
        currentBid: parseFloat(bidAmount),
        bids: [newBid, ...prev!.bids.map(bid => ({ ...bid, isWinner: false }))]
      }));
      
      setBidAmount('');
      alert(t('bid_placed_successfully'));
    } catch (error) {
      console.error('Error placing bid:', error);
      alert(t('failed_to_place_bid'));
    } finally {
      setIsPlacingBid(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'ENDED':
        return 'bg-red-100 text-red-800';
      case 'UPCOMING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return t('auction_ended');
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Prepare data for the bidding chart
  const biddingHistory = auction?.bids
    .slice()
    .reverse()
    .map((bid, index) => ({
      name: `Bid ${index + 1}`,
      price: bid.amount,
      time: new Date(bid.timestamp).toLocaleTimeString()
    })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md mx-auto bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('no_data')}: </strong>
          <span className="block sm:inline">{t('auction_not_found')}</span>
        </div>
      </div>
    );
  }

  const isAuctionActive = new Date(auction.endDate) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/auction/listings" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{t('auction_bidding')}</h1>
              <p className="text-sm opacity-90">{auction.cropType} - {auction.variety}</p>
            </div>
          </div>
          <Gavel className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Auction Details Card */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {auction.cropType} ({auction.variety})
                </h2>
                <p className="text-slate-600">{auction.farmerName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
                {auction.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">{t('quantity')}</p>
                <p className="font-medium">{auction.quantity} acres</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">{t('current_bid')}</p>
                <p className="font-medium">₹{auction.currentBid.toLocaleString()}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">{t('starting_price')}</p>
                <p className="font-medium">₹{auction.startingPrice.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">{t('time_remaining')}</p>
                <p className="font-medium">{getTimeRemaining(auction.endDate)}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>{auction.farmLocation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{t('ends_on')} {formatDate(auction.endDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span>{t('crop_health_score')}: {auction.cropScore}/10</span>
              </div>
            </div>
            
            {auction.governmentNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('government_notes')}
                </h3>
                <p className="text-blue-700">{auction.governmentNotes}</p>
              </div>
            )}
          </div>
          
          {/* Bidding Chart */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
              {t('bidding_history')}
            </h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={biddingHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#059669' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Place Bid Section */}
          {isAuctionActive && (
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('place_bid')}</h3>
              
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-slate-700 mb-1">
                    {t('bid_amount')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      id="bidAmount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder={t('enter_bid_amount')}
                      min={auction.currentBid + 1}
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {t('minimum_bid')}: ₹{(auction.currentBid + 1).toLocaleString()}
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isPlacingBid}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
                >
                  {isPlacingBid ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('placing_bid')}
                    </div>
                  ) : (
                    t('submit_bid')
                  )}
                </button>
              </form>
            </div>
          )}
          
          {/* Bids List */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('bids')}</h3>
            
            <div className="space-y-3">
              {auction.bids.length > 0 ? (
                auction.bids.map((bid) => (
                  <div 
                    key={bid.id} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      bid.isWinner 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                        : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        bid.isWinner ? 'bg-green-500' : 'bg-slate-400'
                      }`}>
                        {bid.isWinner ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{bid.bidderName}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(bid.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">₹{bid.amount.toLocaleString()}</p>
                      {bid.isWinner && (
                        <span className="text-xs text-green-600 font-medium">{t('winning_bid')}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">{t('no_bids_yet')}</p>
              )}
            </div>
          </div>
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
            <Target className="w-6 h-6" />
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