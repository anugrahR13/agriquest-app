'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft, Plus, Sprout } from 'lucide-react';

export default function SimpleCropTrackingPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCrops([
        {
          id: '1',
          cropType: 'WHEAT',
          variety: 'HD 2967',
          sowingDate: '2023-10-15',
          location: 'Mehsana, Gujarat',
          farmSize: 5.5,
          growthCompleted: 2,
          growthTotal: 3
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 min-w-0">
            <Link href="/dashboard" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">Crop Tracking</h1>
              <p className="text-sm opacity-90 truncate">Monitor your crops growth</p>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors touch-target flex-shrink-0">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="p-4">
        {crops.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No crops added yet</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg touch-target">
              Add New Crop
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {crops.map((crop) => (
              <div 
                key={crop.id} 
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 truncate">{crop.cropType}</h3>
                    <p className="text-green-600 font-medium break-words">{crop.variety}</p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="text-sm text-slate-600 whitespace-nowrap">
                      {new Date(crop.sowingDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500 whitespace-nowrap">{crop.farmSize} acres</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                  <span className="truncate break-words">{crop.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-sm text-slate-600 break-words whitespace-nowrap">
                      {crop.growthCompleted} of {crop.growthTotal} stages completed
                    </span>
                  </div>
                  <button className="text-green-600 font-medium text-sm touch-target whitespace-nowrap">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}