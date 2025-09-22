'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Gavel, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Leaf,
  Target,
  Users,
  Calendar,
  MapPin,
  Scale,
  FileText
} from 'lucide-react';

interface AuctionRequest {
  id: number;
  farmId: string;
  cropScoreId: number;
  status: string;
  govtNotes: string | null;
  createdAt: string;
  cropScore: {
    score: number;
    reportUrl: string;
  };
  farm: {
    farmer: {
      user: {
        firstName: string;
        lastName: string;
      };
      farmName: string;
      region: string;
      village: string;
    };
    cropType: string;
    sowingDate: string;
  };
}

export default function AuctionStatusPage() {
  const { t } = useTranslation();
  const [auctionRequests, setAuctionRequests] = useState<AuctionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuctionStatus();
  }, []);

  const fetchAuctionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auction/status');
      const data = await response.json();
      
      if (response.ok) {
        setAuctionRequests(data.auctionRequests);
      } else {
        setError(data.error || 'Failed to fetch auction status');
      }
    } catch (err) {
      setError('Failed to fetch auction status');
      console.error('Error fetching auction status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <strong className="font-bold">{t('error')}: </strong>
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
              <h1 className="text-xl font-bold">{t('auction_status')}</h1>
              <p className="text-sm opacity-90">{t('track_your_auction_applications')}</p>
            </div>
          </div>
          <Gavel className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-3 shadow-sm text-center">
              <p className="text-sm text-slate-600">{t('total')}</p>
              <p className="text-xl font-bold text-slate-800">{auctionRequests.length}</p>
            </div>
            
            <div className="glass-card rounded-xl p-3 shadow-sm text-center">
              <p className="text-sm text-slate-600">{t('pending')}</p>
              <p className="text-xl font-bold text-slate-800">
                {auctionRequests.filter(r => r.status === 'PENDING').length}
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-3 shadow-sm text-center">
              <p className="text-sm text-slate-600">{t('approved')}</p>
              <p className="text-xl font-bold text-slate-800">
                {auctionRequests.filter(r => r.status === 'APPROVED').length}
              </p>
            </div>
          </div>
          
          {/* Auction Requests */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">{t('your_applications')}</h2>
              <Link 
                href="/auction/apply"
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg"
              >
                {t('new_application')}
              </Link>
            </div>
            
            {auctionRequests.length > 0 ? (
              <div className="space-y-4">
                {auctionRequests.map((request) => (
                  <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-slate-800">
                          {request.farm.cropType} ({request.farm.seedVariety})
                        </h3>
                        <p className="text-sm text-slate-600">{request.farm.farmer.farmName}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{t(`status_${request.status.toLowerCase()}`)}</span>
                        </div>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Scale className="w-4 h-4 text-green-600" />
                        <span className="text-sm">
                          <span className="font-medium">{request.cropScore.score.toFixed(1)}</span>/10
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{request.farm.village}, {request.farm.region}</span>
                      </div>
                    </div>
                    
                    {request.govtNotes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <h4 className="text-sm font-medium text-blue-800 mb-1">{t('government_notes')}</h4>
                        <p className="text-sm text-blue-700">{request.govtNotes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <a 
                        href={request.cropScore.reportUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 text-sm flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        {t('view_report')}
                      </a>
                      {request.status === 'APPROVED' && (
                        <Link 
                          href={`/auction/details/${request.id}`}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded-lg"
                        >
                          {t('view_auction')}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gavel className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">{t('no_applications')}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {t('no_applications_desc')}
                </p>
                <div className="mt-6">
                  <Link 
                    href="/auction/apply"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    {t('apply_now')}
                  </Link>
                </div>
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