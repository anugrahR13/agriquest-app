'use client';

import { useState, useEffect } from 'react';

export default function TestApiPage() {
  const [cropScoreData, setCropScoreData] = useState<any>(null);
  const [auctionData, setAuctionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testCropScoreApi = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using mock token for testing
      const response = await fetch('/api/crop-score', {
        headers: {
          'Authorization': 'Bearer mock_jwt_user_demo_12345_1234567890'
        }
      });
      const data = await response.json();
      setCropScoreData(data);
    } catch (err) {
      setError('Failed to fetch crop score data: ' + (err as Error).message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testAuctionApi = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using mock token for testing
      const response = await fetch('/api/auction', {
        headers: {
          'Authorization': 'Bearer mock_jwt_user_demo_12345_1234567890'
        }
      });
      const data = await response.json();
      setAuctionData(data);
    } catch (err) {
      setError('Failed to fetch auction data: ' + (err as Error).message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Crop Score API Test</h2>
          <button 
            onClick={testCropScoreApi}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Test Crop Score API
          </button>
          
          {cropScoreData && (
            <div className="mt-4">
              <h3 className="font-medium">Response:</h3>
              <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(cropScoreData, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Auction API Test</h2>
          <button 
            onClick={testAuctionApi}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Test Auction API
          </button>
          
          {auctionData && (
            <div className="mt-4">
              <h3 className="font-medium">Response:</h3>
              <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(auctionData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-center">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}