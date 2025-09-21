"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Wheat, 
  MapPin, 
  Calendar, 
  Ruler, 
  Sprout, 
  Droplets 
} from 'lucide-react';
import Link from 'next/link';

export default function FarmProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cropType: 'WHEAT',
    soilType: 'LOAM',
    seedVariety: '',
    sowingDate: '',
    farmSize: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would call the API
      // const response = await fetch('/api/missions-new', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...formData,
      //     soilInfo: { type: formData.soilType },
      //     size: parseFloat(formData.farmSize),
      //     sowingDate: new Date(formData.sowingDate)
      //   })
      // });
      
      // if (response.ok) {
      //   router.push('/missions');
      // } else {
      //   throw new Error('Failed to create farm profile');
      // }
      
      // For demo purposes, just navigate to missions
      setTimeout(() => {
        router.push('/missions');
      }, 1000);
    } catch (error) {
      console.error('Error creating farm profile:', error);
      alert('Failed to create farm profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="font-bold text-green-800">Farm Profile</h1>
                <p className="text-xs text-slate-600">Tell us about your farm</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <Wheat className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Setup</span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Farm Details</h2>
            <p className="text-slate-600 text-sm mb-6">
              Provide information about your farm to generate personalized missions
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Crop Type
                </label>
                <div className="relative">
                  <select
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                    required
                  >
                    <option value="WHEAT">Wheat</option>
                    <option value="RICE">Rice</option>
                    <option value="MAIZE">Maize</option>
                    <option value="COTTON">Cotton</option>
                  </select>
                  <Sprout className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Soil Type
                </label>
                <div className="relative">
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                    required
                  >
                    <option value="SANDY">Sandy</option>
                    <option value="LOAM">Loam</option>
                    <option value="CLAY">Clay</option>
                    <option value="SILTY">Silty</option>
                  </select>
                  <Droplets className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Seed Variety */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Seed Variety
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="seedVariety"
                    value={formData.seedVariety}
                    onChange={handleChange}
                    placeholder="e.g., HD 2967, PBW 343"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <Sprout className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Sowing Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sowing Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="sowingDate"
                    value={formData.sowingDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Farm Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Farm Size (acres)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    placeholder="e.g., 5.5"
                    step="0.1"
                    min="0"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <Ruler className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Village, District, State"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <span>Generate Missions</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}