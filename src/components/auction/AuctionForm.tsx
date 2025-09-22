'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface AuctionFormProps {
  farmId: string;
  cropScoreId: number;
  onApplicationSubmitted: () => void;
}

export default function AuctionForm({ farmId, cropScoreId, onApplicationSubmitted }: AuctionFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmId,
          cropScoreId
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        onApplicationSubmitted();
      } else {
        setError(data.error || 'Failed to submit auction application');
      }
    } catch (err) {
      setError('Failed to submit auction application');
      console.error('Error submitting auction application:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-green-800">{t('auction_application_submitted')}</h3>
        </div>
        <p className="mt-2 text-green-700">
          {t('auction_application_submitted_description')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('apply_for_government_auction')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <strong className="font-bold">{t('error')}:</strong>
            </div>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <p className="text-gray-700">{t('auction_application_description')}</p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">{t('what_happens_next')}</h4>
            <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
              <li>{t('auction_process_step1')}</li>
              <li>{t('auction_process_step2')}</li>
              <li>{t('auction_process_step3')}</li>
            </ul>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('submitting')}
            </div>
          ) : (
            t('submit_application')
          )}
        </button>
      </form>
    </div>
  );
}