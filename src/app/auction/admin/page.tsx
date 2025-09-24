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
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Award
} from 'lucide-react';

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

export default function AdminAuctionPage() {
  const { t } = useTranslation();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [newAuction, setNewAuction] = useState({
    cropType: '',
    variety: '',
    quantity: '',
    startingPrice: '',
    endDate: '',
    farmerName: '',
    farmLocation: '',
    cropScore: ''
  });

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auction/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch auctions');
      }
      
      const data = await response.json();
      setAuctions(data.auctions);
    } catch (err) {
      setError('Failed to fetch auctions');
      console.error('Error fetching auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would be an API call
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auction/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newAuction,
          quantity: parseFloat(newAuction.quantity),
          startingPrice: parseFloat(newAuction.startingPrice),
          cropScore: parseFloat(newAuction.cropScore),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create auction');
      }
      
      const data = await response.json();
      setAuctions([...auctions, data.auction]);
      setShowCreateForm(false);
      setNewAuction({
        cropType: '',
        variety: '',
        quantity: '',
        startingPrice: '',
        endDate: '',
        farmerName: '',
        farmLocation: '',
        cropScore: ''
      });
    } catch (err) {
      setError('Failed to create auction');
      console.error('Error creating auction:', err);
    }
  };

  const handleDeleteAuction = async (id: number) => {
    if (!confirm('Are you sure you want to delete this auction?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auction/admin?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete auction');
      }
      
      setAuctions(auctions.filter(auction => auction.id !== id));
    } catch (err) {
      setError('Failed to delete auction');
      console.error('Error deleting auction:', err);
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
      } else if (sortBy === 'createdAt') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
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
            <div className="min-w-0"> {/* Added min-w-0 to prevent flex item overflow */}
              <h1 className="text-xl font-bold truncate">Government Auction Portal</h1>
              <p className="text-sm opacity-90 truncate">Manage crop auctions</p>
            </div>
          </div>
          <Gavel className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Card */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="min-w-0"> {/* Added min-w-0 to prevent flex item overflow */}
                <h2 className="text-2xl font-bold text-slate-800 truncate">Auction Management</h2>
                <p className="text-slate-600 break-words">
                  Manage and monitor all crop auctions in the system
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="whitespace-nowrap">Create Auction</span>
                </button>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600 truncate">{auctions.length}</p>
                <p className="text-xs text-slate-600 truncate">Total Auctions</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600 truncate">
                  {auctions.filter(a => a.status === 'ACTIVE').length}
                </p>
                <p className="text-xs text-slate-600 truncate">Active</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600 truncate">
                  {auctions.filter(a => a.status === 'ENDED').length}
                </p>
                <p className="text-xs text-slate-600 truncate">Ended</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600 truncate">
                  ₹{auctions.reduce((sum, a) => sum + a.currentBid, 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 truncate">Total Value</p>
              </div>
            </div>
            
            {showCreateForm && (
              <div className="glass-card p-4 rounded-lg mb-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Auction</h3>
                <form onSubmit={handleCreateAuction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Crop Type
                      </label>
                      <input
                        type="text"
                        value={newAuction.cropType}
                        onChange={(e) => setNewAuction({...newAuction, cropType: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., WHEAT"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Variety
                      </label>
                      <input
                        type="text"
                        value={newAuction.variety}
                        onChange={(e) => setNewAuction({...newAuction, variety: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., HD 2967"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Quantity (acres)
                      </label>
                      <input
                        type="number"
                        value={newAuction.quantity}
                        onChange={(e) => setNewAuction({...newAuction, quantity: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., 5.5"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Starting Price (₹ per acre)
                      </label>
                      <input
                        type="number"
                        value={newAuction.startingPrice}
                        onChange={(e) => setNewAuction({...newAuction, startingPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., 2000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newAuction.endDate}
                        onChange={(e) => setNewAuction({...newAuction, endDate: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Crop Score
                      </label>
                      <input
                        type="number"
                        value={newAuction.cropScore}
                        onChange={(e) => setNewAuction({...newAuction, cropScore: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., 8.5"
                        step="0.1"
                        min="0"
                        max="10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Farmer Name
                      </label>
                      <input
                        type="text"
                        value={newAuction.farmerName}
                        onChange={(e) => setNewAuction({...newAuction, farmerName: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Rajesh Kumar"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Farm Location
                      </label>
                      <input
                        type="text"
                        value={newAuction.farmLocation}
                        onChange={(e) => setNewAuction({...newAuction, farmLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Mehsana, Gujarat"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Create Auction
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
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
                  <option value="createdAt">Newest First</option>
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
                      <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent flex item overflow */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="min-w-0"> {/* Added min-w-0 to prevent flex item overflow */}
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
                              Ends: {formatDate(auction.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate break-words">{auction.farmLocation}</span>
                          </div>
                        </div>
                        
                        {auction.governmentNotes && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700 break-words">
                            <strong>Notes:</strong> {auction.governmentNotes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/auction/details/${auction.id}`}
                            className="text-green-600 font-medium text-sm touch-target flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4 flex-shrink-0" />
                            <span>View</span>
                          </Link>
                          <button 
                            onClick={() => handleDeleteAuction(auction.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm touch-target flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4 flex-shrink-0" />
                            <span>Delete</span>
                          </button>
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
                    : 'No auctions created yet'}
                </p>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg touch-target"
                >
                  Create First Auction
                </button>
              </div>
            )}
          </div>
          
          {/* Insights Section */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
              Auction Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                  Market Trends
                </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="truncate">Wheat</span>
                    <span className="font-medium">₹2,450/acre</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="truncate">Rice</span>
                    <span className="font-medium">₹3,120/acre</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="truncate">Corn</span>
                    <span className="font-medium">₹1,890/acre</span>
                  </div>
                  <div className="pt-2 border-t border-green-100">
                    <div className="flex justify-between font-medium">
                      <span className="truncate">Avg. Increase</span>
                      <span className="text-green-600">+12%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  Performance Metrics
                </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="truncate">Success Rate</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="truncate">Avg. Bids/Auction</span>
                    <span className="font-medium">7.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="truncate">Farmer Satisfaction</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                  <div className="pt-2 border-t border-blue-100">
                    <div className="flex justify-between font-medium">
                      <span className="truncate">Total Value</span>
                      <span>₹24.5M</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                  <Gavel className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" />
                  Top Performing
                </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="truncate">Rajesh Kumar</span>
                    <span className="font-medium">₹3.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="truncate">Priya Sharma</span>
                    <span className="font-medium">₹2.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="truncate">Amit Patel</span>
                    <span className="font-medium">₹2.1M</span>
                  </div>
                  <div className="pt-2 border-t border-amber-100">
                    <div className="flex justify-between font-medium">
                      <span className="truncate">Top Region</span>
                      <span>Gujarat</span>
                    </div>
                  </div>
                </div>
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
            <Target className="w-6 h-6" />
            <span className="text-xs">Missions</span>
          </Link>
          <Link href="/auction/admin" className="flex flex-col items-center py-2 text-green-600 touch-target">
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