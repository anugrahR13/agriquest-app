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
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  Award,
  Sprout,
  Zap,
  Filter,
  Search,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import AuctionNavigation from '../components/AuctionNavigation';

interface Auction {
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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  farmer?: {
    farmName: string;
    region: string;
    village: string;
    totalPoints: number;
    level: number;
    currentStreak: number;
    sustainabilityScore: string;
  };
}

export default function AuctionDashboardPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/auth/login';
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      // For farmers, fetch their auctions
      // For government, fetch all auctions
      const endpoint = user?.role === 'GOVERNMENT' 
        ? '/api/auction/admin' 
        : '/api/auction/listings';
      
      const token = localStorage.getItem('token');
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch auctions');
      }
      
      const data = await response.json();
      setAuctions(data.auctions || data.auctionListings || []);
    } catch (err) {
      setError('Failed to fetch auctions');
      console.error('Error fetching auctions:', err);
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

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.variety.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || auction.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
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

  const isGovernmentUser = user?.role === 'GOVERNMENT';
  const userAuctions = isGovernmentUser ? auctions : auctions.filter(a => a.farmerName === `${user?.firstName} ${user?.lastName}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 min-w-0">
            <Link href="/dashboard" className="touch-target p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">Auction Dashboard</h1>
              <p className="text-sm opacity-90 truncate">
                {isGovernmentUser ? 'Government Portal' : 'Farmer Portal'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 cursor-pointer hover:bg-white/20 p-1 rounded-full transition-colors" />
            <div className="relative">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="touch-target p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-slate-800 hover:bg-green-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-slate-800 hover:bg-green-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-slate-800 hover:bg-green-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Navigation */}
          <AuctionNavigation userRole={user?.role || 'FARMER'} />
          
          {/* Welcome Section */}
          <div className="glass-card rounded-xl p-6 shadow-sm bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-800 truncate">
                  Welcome, {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-slate-600 break-words mt-1">
                  {isGovernmentUser 
                    ? 'Manage crop auctions and support farmers' 
                    : 'Manage your crop auctions and track bids'}
                </p>
              </div>
              <div className="shrink-0">
                {isGovernmentUser ? (
                  <Link 
                    href="/auction/admin" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Auction</span>
                  </Link>
                ) : (
                  <Link 
                    href="/auction/apply" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Apply for Auction</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Gavel className="w-6 h-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-slate-800 truncate">
                    {auctions.length}
                  </p>
                  <p className="text-sm text-slate-600 truncate">Total Auctions</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-slate-800 truncate">
                    {auctions.filter(a => a.status === 'ACTIVE').length}
                  </p>
                  <p className="text-sm text-slate-600 truncate">Active</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-slate-800 truncate">
                    ₹{auctions.reduce((sum, a) => sum + a.currentBid, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 truncate">Total Bids</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-slate-800 truncate">
                    {auctions.filter(a => a.status === 'ENDED').length}
                  </p>
                  <p className="text-sm text-slate-600 truncate">Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="glass-card rounded-xl p-4 shadow-sm bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full md:w-64 transition-colors"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="text-slate-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="ENDED">Ended</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'analytics' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Auctions List */}
          <div className="glass-card rounded-xl p-6 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {isGovernmentUser ? 'All Auctions' : 'Your Auctions'}
              </h3>
              <span className="text-slate-600">
                {filteredAuctions.length} {filteredAuctions.length === 1 ? 'auction' : 'auctions'}
              </span>
            </div>
            
            {filteredAuctions.length > 0 ? (
              <div className="space-y-4">
                {filteredAuctions.map((auction) => (
                  <div 
                    key={auction.id}
                    className="glass-card p-4 rounded-lg hover:shadow-md transition-all border border-slate-200"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="text-lg font-semibold text-slate-800 truncate">
                              {auction.cropType} ({auction.variety})
                            </h4>
                            <p className="text-sm text-slate-600 break-words">{auction.farmerName}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                              {auction.status}
                            </span>
                            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                              Score: {auction.cropScore}/10
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <div className="flex items-center space-x-2">
                            <Scale className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-medium">{auction.quantity}</span>
                              <span className="text-sm text-slate-600 ml-1">acres</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-medium">₹{auction.currentBid.toLocaleString()}</span>
                              <span className="text-sm text-slate-600 ml-1">bid</span>
                            </div>
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
                        
                        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
                          <div className="text-sm text-slate-600 break-words">
                            Ends: {formatDate(auction.endDate)}
                          </div>
                          <div className="flex space-x-2">
                            <Link 
                              href={`/auction/details/${auction.id}`}
                              className="text-green-600 font-medium text-sm touch-target flex items-center space-x-1 hover:text-green-700 transition-colors"
                            >
                              <Eye className="w-4 h-4 flex-shrink-0" />
                              <span>View Details</span>
                            </Link>
                            {isGovernmentUser && (
                              <Link 
                                href={`/auction/admin/edit/${auction.id}`}
                                className="text-blue-600 font-medium text-sm touch-target flex items-center space-x-1 hover:text-blue-700 transition-colors"
                              >
                                <Edit className="w-4 h-4 flex-shrink-0" />
                                <span>Edit</span>
                              </Link>
                            )}
                          </div>
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
                    : isGovernmentUser 
                      ? 'No auctions created yet' 
                      : 'You have not applied for any auctions yet'}
                </p>
                {isGovernmentUser ? (
                  <Link 
                    href="/auction/admin" 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg touch-target inline-flex items-center transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Auction
                  </Link>
                ) : (
                  <Link 
                    href="/auction/apply" 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg touch-target inline-flex items-center transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Apply for Auction
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="glass-card rounded-xl p-6 shadow-sm bg-white">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {isGovernmentUser ? 'Government Auction Portal' : 'Farmer Auction Portal'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">How It Works</h4>
                <div className="space-y-4">
                  {isGovernmentUser ? (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">1</span>
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-medium text-slate-800">Review Applications</h5>
                          <p className="text-sm text-slate-600 break-words mt-1">
                            Farmers submit their crops for auction with crop health scores and reports.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">2</span>
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-medium text-slate-800">Create Auctions</h5>
                          <p className="text-sm text-slate-600 break-words mt-1">
                            Set starting prices, quantities, and auction duration based on crop quality.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">3</span>
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-medium text-slate-800">Monitor Bidding</h5>
                          <p className="text-sm text-slate-600 break-words mt-1">
                            Track real-time bids and ensure fair market pricing for farmers.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">1</span>
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-medium text-slate-800">Apply for Auction</h5>
                          <p className="text-sm text-slate-600 break-words mt-1">
                            Submit your crops with crop health scores and reports for government review.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">2</span>
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-medium text-slate-800">Government Review</h5>
                          <p className="text-sm text-slate-600 break-words mt-1">
                            Government officials review your application and set a fair starting price.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">3</span>
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-medium text-slate-800">Track Bids</h5>
                          <p className="text-sm text-slate-600 break-words mt-1">
                            Monitor real-time bids and see how your crops are performing in the auction.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Benefits</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-slate-800 mb-2">For Farmers</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    <li className="break-words">Guaranteed fair market price for your crops</li>
                    <li className="break-words">Transparent bidding process</li>
                    <li className="break-words">Government-backed transactions</li>
                    <li className="break-words">AI-powered crop quality assessment</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-slate-800 mb-2">For Government</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    <li className="break-words">Support local farmers with fair pricing</li>
                    <li className="break-words">Ensure food security through transparent auctions</li>
                    <li className="break-words">Data-driven pricing decisions</li>
                    <li className="break-words">Real-time monitoring of agricultural markets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2 md:hidden">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/auction/dashboard" className="flex flex-col items-center py-2 text-green-600 touch-target">
            <Gavel className="w-6 h-6" />
            <span className="text-xs font-medium">Auctions</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Users className="w-6 h-6" />
            <span className="text-xs">Community</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}