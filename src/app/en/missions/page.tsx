"use client";

import { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowLeft,
  PlayCircle,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface Mission {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  estimatedDuration: number;
  pointsReward: number;
  status: 'available' | 'in_progress' | 'completed';
  progress?: number;
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    // Mock missions data since backend endpoints are placeholders
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: 'Install Drip Irrigation System',
        description: 'Set up a drip irrigation system to conserve water and improve crop yield',
        shortDescription: 'Install drip irrigation for water conservation',
        category: 'Water Conservation',
        difficulty: 'INTERMEDIATE',
        estimatedDuration: 14,
        pointsReward: 300,
        status: 'available',
      },
      {
        id: '2',
        title: 'Switch to Bio-Pesticides',
        description: 'Replace chemical pesticides with organic bio-pesticides for 30 days',
        shortDescription: 'Use organic pest control methods',
        category: 'Organic Farming',
        difficulty: 'BEGINNER',
        estimatedDuration: 30,
        pointsReward: 250,
        status: 'in_progress',
        progress: 45,
      },
      {
        id: '3',
        title: 'Apply Vermicompost to Fields',
        description: 'Improve soil fertility by applying vermicompost to your crop fields',
        shortDescription: 'Enhance soil health with vermicompost',
        category: 'Soil Health',
        difficulty: 'BEGINNER',
        estimatedDuration: 7,
        pointsReward: 200,
        status: 'completed',
      },
      {
        id: '4',
        title: 'Implement Crop Rotation',
        description: 'Practice crop rotation to maintain soil fertility and reduce pest problems',
        shortDescription: 'Rotate crops for better soil health',
        category: 'Sustainable Practices',
        difficulty: 'INTERMEDIATE',
        estimatedDuration: 90,
        pointsReward: 400,
        status: 'available',
      },
      {
        id: '5',
        title: 'Share Farming Success Story',
        description: 'Share your sustainable farming journey and inspire other farmers',
        shortDescription: 'Inspire others with your farming story',
        category: 'Community Engagement',
        difficulty: 'BEGINNER',
        estimatedDuration: 3,
        pointsReward: 150,
        status: 'available',
      },
    ];

    setMissions(mockMissions);
    setLoading(false);
  }, []);

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return mission.status === filter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'water conservation':
        return '💧';
      case 'organic farming':
        return '🌱';
      case 'soil health':
        return '🌍';
      case 'sustainable practices':
        return '♻️';
      case 'community engagement':
        return '👥';
      default:
        return '🎯';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-blue-600';
      case 'in_progress':
        return 'text-orange-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleStartMission = (missionId: string) => {
    // Update mission status to in_progress
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, status: 'in_progress', progress: 0 }
        : mission
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
                <h1 className="font-bold text-green-800">Missions</h1>
                <p className="text-xs text-slate-600">Sustainable farming challenges</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Level 2</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { key: 'all', label: 'All' },
              { key: 'available', label: 'Available' },
              { key: 'in_progress', label: 'Active' },
              { key: 'completed', label: 'Done' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-green-600 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Missions List */}
      <main className="px-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {filteredMissions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2">No missions found</h3>
              <p className="text-slate-600 text-sm">
                {filter === 'all' 
                  ? 'No missions available at the moment.'
                  : `No ${filter.replace('_', ' ')} missions found.`
                }
              </p>
            </div>
          ) : (
            filteredMissions.map((mission) => (
              <div key={mission.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4">
                  {/* Mission Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getCategoryIcon(mission.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                          {mission.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {mission.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <Star className="w-4 h-4" />
                      <span className="font-bold text-sm">{mission.pointsReward}</span>
                    </div>
                  </div>

                  {/* Mission Details */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-600">
                          {mission.estimatedDuration} days
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    <span className={`text-xs font-medium capitalize ${getStatusColor(mission.status)}`}>
                      {mission.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress Bar (for in-progress missions) */}
                  {mission.status === 'in_progress' && mission.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Progress</span>
                        <span className="text-xs font-medium text-orange-600">
                          {mission.progress}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${mission.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex space-x-2">
                    {mission.status === 'available' && (
                      <button
                        onClick={() => handleStartMission(mission.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Start Mission</span>
                      </button>
                    )}
                    
                    {mission.status === 'in_progress' && (
                      <>
                        <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-orange-700 transition-colors">
                          Continue
                        </button>
                        <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
                          Details
                        </button>
                      </>
                    )}
                    
                    {mission.status === 'completed' && (
                      <div className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm text-green-800">Completed</span>
                        <div className="flex items-center space-x-1 text-green-600">
                          <Star className="w-3 h-3" />
                          <span className="text-xs font-bold">+{mission.pointsReward}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Mission Summary Card */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white">
            <h3 className="font-bold mb-2">📈 Your Mission Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {missions.filter(m => m.status === 'available').length}
                </p>
                <p className="text-xs opacity-90">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {missions.filter(m => m.status === 'in_progress').length}
                </p>
                <p className="text-xs opacity-90">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {missions.filter(m => m.status === 'completed').length}
                </p>
                <p className="text-xs opacity-90">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-green-600">
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">Missions</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center py-2 text-slate-400">
            <Award className="w-6 h-6" />
            <span className="text-xs">Rankings</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-2 text-slate-400">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Community</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}