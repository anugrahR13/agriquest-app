"use client";

import { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowLeft,
  Bot,
  MessageCircle,
  Calendar,
  Award,
  TrendingUp,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import MissionCard from '@/components/missions/MissionCard';

interface Mission {
  id: string;
  title: string;
  description: string;
  stageOrder: number;
  isCompleted: boolean;
  photoCount: number;
  healthScore?: number;
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

  useEffect(() => {
    // In a real app, this would fetch from the API
    // fetchMissions();
    
    // Mock missions data
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: 'Land Preparation',
        description: 'Prepare the field by plowing and leveling the soil',
        stageOrder: 1,
        isCompleted: true,
        photoCount: 3,
        healthScore: 92
      },
      {
        id: '2',
        title: 'Sowing',
        description: 'Sow wheat seeds at the recommended depth and spacing',
        stageOrder: 2,
        isCompleted: true,
        photoCount: 2,
        healthScore: 88
      },
      {
        id: '3',
        title: 'First Irrigation',
        description: 'Provide first irrigation after sowing',
        stageOrder: 3,
        isCompleted: false,
        photoCount: 0
      },
      {
        id: '4',
        title: 'First Weeding',
        description: 'Remove weeds to prevent competition for nutrients',
        stageOrder: 4,
        isCompleted: false,
        photoCount: 0
      },
      {
        id: '5',
        title: 'Fertilizer Application',
        description: 'Apply nitrogen fertilizer for healthy growth',
        stageOrder: 5,
        isCompleted: false,
        photoCount: 0
      }
    ];

    setMissions(mockMissions);
    setLoading(false);
  }, []);

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    if (filter === 'available') return !mission.isCompleted;
    if (filter === 'completed') return mission.isCompleted;
    return true;
  });

  const handleUploadPhotos = (missionId: string) => {
    // Navigate to mission detail page for photo upload
    window.location.href = `/missions/${missionId}`;
  };

  const handleCompleteMission = (missionId: string) => {
    // Update mission status to completed
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, isCompleted: true }
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
                <h1 className="font-bold text-green-800">Growth Missions</h1>
                <p className="text-xs text-slate-600">Wheat cultivation plan</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Wheat</span>
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
              { key: 'completed', label: 'Completed' },
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
                  : `No ${filter} missions found.`
                }
              </p>
            </div>
          ) : (
            filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                id={mission.id}
                title={mission.title}
                description={mission.description}
                stageOrder={mission.stageOrder}
                isCompleted={mission.isCompleted}
                photoCount={mission.photoCount}
                healthScore={mission.healthScore}
                onUploadPhotos={handleUploadPhotos}
                onCompleteMission={handleCompleteMission}
              />
            ))
          )}

          {/* Mission Summary Card */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white">
            <h3 className="font-bold mb-2">📈 Your Growth Progress</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {missions.filter(m => m.isCompleted).length}
                </p>
                <p className="text-xs opacity-90">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {missions.filter(m => !m.isCompleted).length}
                </p>
                <p className="text-xs opacity-90">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((missions.filter(m => m.isCompleted).length / missions.length) * 100) || 0}%
                </p>
                <p className="text-xs opacity-90">Progress</p>
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
          <Link href="/chatbot" className="flex flex-col items-center py-2 text-slate-400">
            <Bot className="w-6 h-6" />
            <span className="text-xs">AI Assistant</span>
          </Link>
          <Link href="/help-desk" className="flex flex-col items-center py-2 text-slate-400">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Help Desk</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}