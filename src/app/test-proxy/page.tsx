"use client";

import { useState, useEffect } from 'react';

export default function TestProxyPage() {
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testApiConnection = async () => {
    setStatus('Testing API connection through proxy...');
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        setStatus('API connection through proxy successful!');
      } else {
        setError(`API Error: ${data.error || 'Unknown error'}`);
        setStatus('API connection through proxy failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError(`Network Error: ${(err as Error).message}`);
      setStatus('API connection through proxy failed');
    }
  };

  const testLoginApi = async () => {
    setStatus('Testing login API through proxy...');
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: '9876543210' }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        setStatus('Login API test through proxy successful!');
      } else {
        setError(`Login API Error: ${data.error || 'Unknown error'}`);
        setStatus('Login API test through proxy failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError(`Network Error: ${(err as Error).message}`);
      setStatus('Login API test through proxy failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">API Proxy Test Page</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testApiConnection}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Test API Connection
          </button>
          
          <button
            onClick={testLoginApi}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Test Login API
          </button>
        </div>

        {status && (
          <div className="mb-4 p-4 rounded-lg bg-gray-100">
            <p className="font-medium text-slate-800">{status}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-100 border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mb-4 p-4 rounded-lg bg-green-100 border border-green-200">
            <pre className="text-green-800 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/login-options" className="text-green-600 hover:underline">
            ← Back to Login Options
          </a>
        </div>
      </div>
    </div>
  );
}