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
  Users,
  Trophy,
  History,
  Plus,
  TrendingUp
} from 'lucide-react';

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
}

interface Bid {
  id: number;
  bidderName: string;
  amount: number;
  timestamp: string;
  isWinner: boolean;
}

export default function AuctionDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    
    fetchAuctionDetails();
  }, [params.id]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auction/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch auction details');
      }
      
      const data = await response.json();
      setAuction(data.auction);
      setBids(data.auction.bids || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch auction details: ' + (err as Error).message);
      console.error('Error fetching auction details:', err);
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auction/${params.id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(bidAmount) }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Bid of ₹${bidAmount} placed successfully!`);
        setBidAmount('');
        // Refresh auction details to show updated bid
        fetchAuctionDetails();
      } else {
        alert(`Error: ${data.error || 'Failed to place bid'}`);
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Auction Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

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
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline break-words">{error}</span>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md mx-auto bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No Data: </strong>
          <span className="block sm:inline">Auction not found</span>
        </div>
      </div>
    );
  }

  const isAuctionActive = auction.status === 'ACTIVE' && new Date(auction.endDate) > new Date();
  const winningBid = bids.find(bid => bid.isWinner) || (bids.length > 0 ? bids[0] : null);
  const isGovernmentUser = user?.role === 'GOVERNMENT';
  const isFarmerUser = user?.role === 'FARMER';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/auction/dashboard" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{t('auction_details')}</h1>
              <p className="text-sm opacity-90 break-words truncate">{auction?.cropType} - {auction?.variety}</p>
            </div>
          </div>
          <Gavel className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Auction Details Card */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-800 truncate">
                  {auction.cropType} ({auction.variety})
                </h2>
                <p className="text-slate-600 break-words">{auction.farmerName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
                {auction.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600 truncate">{t('quantity')}</p>
                <p className="font-medium truncate">{auction.quantity} acres</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600 truncate">{t('current_bid')}</p>
                <p className="font-medium truncate">₹{auction.currentBid.toLocaleString()}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600 truncate">{t('starting_price')}</p>
                <p className="font-medium truncate">₹{auction.startingPrice.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600 truncate">{t('time_remaining')}</p>
                <p className="font-medium truncate">{getTimeRemaining(auction.endDate)}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="break-words">{auction.farmLocation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="break-words">{t('ends_on')} {formatDate(auction.endDate)} at {formatTime(auction.endDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">Crop Health Score: {auction.cropScore}/10</span>
              </div>
            </div>
            
            {auction.governmentNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {t('government_notes')}
                </h3>
                <p className="text-blue-700 break-words">{auction.governmentNotes}</p>
              </div>
            )}
            
            {/* Winner Announcement */}
            {winningBid && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 flex-shrink-0" />
                  {winningBid.isWinner ? 'Winning Bid' : 'Leading Bid'}
                </h3>
                <p className="text-yellow-700 break-words">
                  <span className="font-bold">₹{winningBid.amount.toLocaleString()}</span> by {winningBid.bidderName}
                </p>
              </div>
            )}
          </div>
          
          {/* Place Bid Section */}
          {isAuctionActive && !isGovernmentUser && (
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
                  <p className="mt-1 text-sm text-slate-500 break-words">
                    {t('minimum_bid')}: ₹{auction.currentBid + 1}
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
                >
                  {t('submit_bid')}
                </button>
              </form>
            </div>
          )}
          
          {/* Bidding History */}
          {bids.length > 0 && (
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 flex-shrink-0" />
                {t('bidding_history')}
              </h3>
              
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div 
                    key={bid.id} 
                    className={`p-3 rounded-lg border ${
                      bid.isWinner 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 break-words">{bid.bidderName}</p>
                        <p className="text-sm text-slate-600 break-words">
                          {formatDate(bid.timestamp)} at {formatTime(bid.timestamp)}
                        </p>
                      </div>
                      <div className="text-right min-w-0">
                        <p className="font-bold text-slate-800 truncate">₹{bid.amount.toLocaleString()}</p>
                        {bid.isWinner && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Winner
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Documents Section */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('documents')}</h3>
            
            <div className="space-y-3">
              <a 
                href={auction.reportUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium break-words truncate">{t('crop_analysis_report')}</span>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">{t('pdf')}</span>
              </a>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center space-x-3 min-w-0">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="font-medium break-words truncate">{t('farm_certificate')}</span>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">{t('pdf')}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center space-x-3 min-w-0">
                  <FileText className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="font-medium break-words truncate">{t('quality_certificate')}</span>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">{t('pdf')}</span>
              </div>
            </div>
          </div>
          
          {/* Auction Insights */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
              Auction Insights
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600 truncate">Total Bids</p>
                <p className="text-xl font-bold text-slate-800 truncate">{bids.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600 truncate">Bid Spread</p>
                <p className="text-xl font-bold text-slate-800 break-words">
                  ₹{auction.startingPrice.toLocaleString()} - ₹{Math.max(auction.currentBid, auction.startingPrice).toLocaleString()}
                </p>
              </div>
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