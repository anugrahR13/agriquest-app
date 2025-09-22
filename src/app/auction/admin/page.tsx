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
  Trash2
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
      const response = await fetch('/api/auction/admin');
      
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
      const response = await fetch('/api/auction/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    try {
      const response = await fetch(`/api/auction/admin?id=${id}`, {
        method: 'DELETE',
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
          <span className="block sm:inline">{error}</span>
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
            <div>
              <h1 className="text-xl font-bold">Government Auction Portal</h1>
              <p className="text-sm opacity-90">Manage crop auctions</p>
            </div>
          </div>
          <Gavel className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Card */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Auction Management</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Auction</span>
              </button>
            </div>
            
            {showCreateForm && (
              <div className="glass-card p-4 rounded-lg mb-6">
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
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{auctions.length}</p>
                <p className="text-xs text-slate-600">Total Auctions</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {auctions.filter(a => a.status === 'ACTIVE').length}
                </p>
                <p className="text-xs text-slate-600">Active</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {auctions.filter(a => a.status === 'ENDED').length}
                </p>
                <p className="text-xs text-slate-600">Ended</p>
              </div>
            </div>
            
            {auctions.length > 0 ? (
              <div className="space-y-4">
                {auctions.map((auction) => (
                  <div 
                    key={auction.id}
                    className="glass-card p-4 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          {auction.cropType} ({auction.variety})
                        </h3>
                        <p className="text-sm text-slate-600">{auction.farmerName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                          {auction.status}
                        </span>
                        <button 
                          onClick={() => handleDeleteAuction(auction.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Scale className="w-4 h-4 text-green-600" />
                        <span className="text-sm">
                          <span className="font-medium">{auction.quantity}</span> acres
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="text-sm">
                          <span className="font-medium">{auction.currentBid}</span> bid
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">
                          Ends: {formatDate(auction.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{auction.farmLocation}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600">
                        Crop Score: {auction.cropScore}/10
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/auction/details/${auction.id}`}
                          className="text-green-600 font-medium text-sm touch-target flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No auctions created yet</p>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg touch-target"
                >
                  Create First Auction
                </button>
              </div>
            )}
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