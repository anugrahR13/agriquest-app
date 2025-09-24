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
  Users,
  Plus,
  CheckCircle,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Award
} from 'lucide-react';

interface AuctionListing {
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
}

export default function AuctionListingsPage() {
  const { t } = useTranslation();
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('endDate');

  useEffect(() => {
    fetchAuctionListings();
  }, []);

  const fetchAuctionListings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auction/listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch auction listings');
      }
      
      const data = await response.json();
      setAuctions(data.auctions);
    } catch (err) {
      setError('Failed to fetch auction listings: ' + (err as Error).message);
      console.error('Error fetching auction listings:', err);
    } finally {
      setLoading(false);
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

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h`;
    }
  };

  // Filter and sort auctions
  const filteredAndSortedAuctions = auctions
    .filter(auction => {
      const matchesSearch = auction.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auction.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auction.variety.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || auction.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'endDate') {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      } else if (sortBy === 'currentBid') {
        return b.currentBid - a.currentBid;
      } else if (sortBy === 'cropScore') {
        return b.cropScore - a.cropScore;
      }
      return 0;
    });

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
              <h1 className="text-xl font-bold truncate">{t('government_auction_portal')}</h1>
              <p className="text-sm opacity-90 truncate">{t('browse_active_auctions')}</p>
            </div>
          </div>
          <Gavel className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Card */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-800 truncate">{t('active_auctions')}</h2>
                <p className="text-slate-600 break-words">
                  {t('browse_government_auctions')}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link 
                  href="/auction/apply"
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                >
                  <Plus className="w-6 h-6" />
                </Link>
                <Link 
                  href="/auction/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <BarChart3 className="w-5 h-5 mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">Dashboard</span>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600 truncate">{auctions.length}</p>
                <p className="text-xs text-slate-600 truncate">{t('total')}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600 truncate">
                  {auctions.filter(a => new Date(a.endDate) > new Date()).length}
                </p>
                <p className="text-xs text-slate-600 truncate">{t('active')}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600 truncate">
                  {auctions.filter(a => a.currentBid > a.startingPrice).length}
                </p>
                <p className="text-xs text-slate-600 truncate">{t('bids')}</p>
              </div>
            </div>
            
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full md:w-64"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="text-slate-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="ENDED">Ended</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                >
                  <option value="endDate">Ending Soon</option>
                  <option value="currentBid">Highest Bid</option>
                  <option value="cropScore">Crop Score</option>
                </select>
              </div>
            </div>
            
            {filteredAndSortedAuctions.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedAuctions.map((auction) => (
                  <div 
                    key={auction.id}
                    className="glass-card p-4 rounded-lg hover:shadow-md transition-all border border-slate-200"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-slate-800 truncate">
                              {auction.cropType} ({auction.variety})
                            </h3>
                            <p className="text-sm text-slate-600 break-words">{auction.farmerName}</p>
                          </div>
                          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                              {auction.status}
                            </span>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              Score: {auction.cropScore}/10
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <div className="flex items-center space-x-2">
                            <Scale className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">
                              <span className="font-medium">{auction.quantity}</span> acres
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">
                              <span className="font-medium">₹{auction.currentBid.toLocaleString()}</span> bid
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm">
                              {getTimeRemaining(auction.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate break-words">{auction.farmLocation}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <Link 
                          href={`/auction/details/${auction.id}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                        >
                          {t('view_details')}
                        </Link>
                        <div className="text-xs text-slate-500 mt-2 break-words">
                          Ends: {formatDate(auction.endDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4 break-words">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No auctions match your search criteria' 
                    : t('no_active_auctions')}
                </p>
                <Link 
                  href="/auction/apply"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg touch-target"
                >
                  {t('apply_for_auction')}
                </Link>
              </div>
            )}
          </div>
          
          {/* Info Section */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">How Government Auctions Work</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Benefits for Farmers</h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="text-sm text-slate-600 break-words">
                    Government auctions provide farmers with a transparent platform to sell their crops at fair market prices. 
                    Our system ensures that both farmers and buyers get the best value through competitive bidding.
                  </p>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <ul className="list-disc list-inside space-y-1">
                      <li className="break-words">Guaranteed fair market price for your crops</li>
                      <li className="break-words">Transparent bidding process</li>
                      <li className="break-words">Government-backed transactions</li>
                      <li className="break-words">AI-powered crop quality assessment</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Benefits for Buyers</h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="text-sm text-slate-600 break-words">
                    Buyers can access high-quality crops at competitive prices through our transparent auction system.
                    All crops come with verified quality reports and government backing.
                  </p>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <ul className="list-disc list-inside space-y-1">
                      <li className="break-words">Access to high-quality crops</li>
                      <li className="break-words">Competitive pricing</li>
                      <li className="break-words">Verified farmer credentials</li>
                      <li className="break-words">Detailed crop reports and analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
              Auction Insights
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <h4 className="font-medium text-slate-800 truncate">Top Crops</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="break-words">• Wheat - 24 auctions</li>
                  <li className="break-words">• Rice - 18 auctions</li>
                  <li className="break-words">• Corn - 15 auctions</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <IndianRupee className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h4 className="font-medium text-slate-800 truncate">Avg. Prices</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="break-words">• Wheat: ₹2,450/acre</li>
                  <li className="break-words">• Rice: ₹3,120/acre</li>
                  <li className="break-words">• Corn: ₹1,890/acre</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <h4 className="font-medium text-slate-800 truncate">Market Trends</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="break-words">• +12% vs last month</li>
                  <li className="break-words">• 85% success rate</li>
                  <li className="break-words">• 420 total auctions</li>
                </ul>
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