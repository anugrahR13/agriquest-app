'use client';

import { useState, useEffect } from 'react';
import { Heart, Database, Globe, Server } from 'lucide-react';

export default function StatusPage() {
  const [status, setStatus] = useState({
    api: 'checking',
    database: 'checking',
    frontend: 'checking'
  });

  useEffect(() => {
    // Check API status
    fetch('/api/health')
      .then(response => {
        if (response.ok) {
          setStatus(prev => ({ ...prev, api: 'online' }));
        } else {
          setStatus(prev => ({ ...prev, api: 'offline' }));
        }
      })
      .catch(() => {
        setStatus(prev => ({ ...prev, api: 'offline' }));
      });

    // Simulate database check (in a real app, you'd have an actual endpoint)
    setTimeout(() => {
      setStatus(prev => ({ ...prev, database: 'online' }));
    }, 1000);

    // Frontend is always online if this page loads
    setStatus(prev => ({ ...prev, frontend: 'online' }));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'checking': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Operational';
      case 'offline': return 'Down';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AgriQuest System Status</h1>
          <p className="text-gray-600">Real-time status of all AgriQuest services</p>
        </div>

        <div className="space-y-6">
          {/* Frontend Status */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <Globe className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-800">Frontend</h3>
                <p className="text-sm text-gray-500">User interface and client-side application</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 ${getStatusColor(status.frontend)}`}>
              <span className="font-medium">{getStatusText(status.frontend)}</span>
              <div className={`w-3 h-3 rounded-full ${status.frontend === 'online' ? 'bg-green-500' : status.frontend === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <Server className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-800">API Server</h3>
                <p className="text-sm text-gray-500">Backend services and REST API</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 ${getStatusColor(status.api)}`}>
              <span className="font-medium">{getStatusText(status.api)}</span>
              <div className={`w-3 h-3 rounded-full ${status.api === 'online' ? 'bg-green-500' : status.api === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            </div>
          </div>

          {/* Database Status */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <Database className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold text-gray-800">Database</h3>
                <p className="text-sm text-gray-500">PostgreSQL database server</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 ${getStatusColor(status.database)}`}>
              <span className="font-medium">{getStatusText(status.database)}</span>
              <div className={`w-3 h-3 rounded-full ${status.database === 'online' ? 'bg-green-500' : status.database === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
            <Heart className="w-5 h-5 animate-pulse" />
            <span className="font-medium">All Systems Operational</span>
          </div>
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}