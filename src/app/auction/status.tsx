'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

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
    };
  };
}

export default function AuctionStatusPage() {
  const { t } = useTranslation();
  const [auctionRequest, setAuctionRequest] = useState<AuctionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, we would get the farmId from the user context or route params
    // For demo purposes, we'll use a mock farmId
    fetchAuctionStatus();
  }, []);

  const fetchAuctionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auction`);
      const data = await response.json();
      
      if (response.ok) {
        setAuctionRequest(data.auctionRequest);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('auction_status_pending');
      case 'APPROVED':
        return t('auction_status_approved');
      case 'REJECTED':
        return t('auction_status_rejected');
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <strong className="font-bold">{t('error')}:</strong>
          </div>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!auctionRequest) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <strong className="font-bold">{t('no_data')}:</strong>
          </div>
          <span className="block sm:inline"> {t('no_auction_request_found')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('auction_status')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{t('auction_request_details')}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auctionRequest.status)}`}>
            <div className="flex items-center">
              {getStatusIcon(auctionRequest.status)}
              <span className="ml-1">{getStatusText(auctionRequest.status)}</span>
            </div>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">{t('farmer_name')}</h3>
            <p className="text-gray-900">
              {auctionRequest.farm.farmer.user.firstName} {auctionRequest.farm.farmer.user.lastName}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">{t('crop_score')}</h3>
            <p className="text-gray-900">{auctionRequest.cropScore.score.toFixed(1)}/10</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">{t('application_date')}</h3>
            <p className="text-gray-900">
              {new Date(auctionRequest.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">{t('current_status')}</h3>
            <p className="text-gray-900">{getStatusText(auctionRequest.status)}</p>
          </div>
        </div>
        
        {auctionRequest.govtNotes && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">{t('government_notes')}</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{auctionRequest.govtNotes}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-800 mb-2">{t('auction_process_info')}</h3>
        <p className="text-blue-700 mb-4">{t('auction_process_description')}</p>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>{t('auction_process_timeline1')}</li>
          <li>{t('auction_process_timeline2')}</li>
          <li>{t('auction_process_timeline3')}</li>
        </ul>
      </div>
    </div>
  );
}