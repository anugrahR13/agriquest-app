'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Crown, Medal, TrendingUp, Users, Target, Calendar, Award, Leaf, ArrowLeft, Filter, Bot, MessageCircle } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  sustainabilityScore: number;
  completedMissions: number;
  level: number;
  streak: number;
  badge?: string;
  location: string;
  rank: number;
}

interface LeaderboardData {
  currentUser: LeaderboardEntry;
  topFarmers: LeaderboardEntry[];
  nearbyFarmers: LeaderboardEntry[];
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'village' | 'panchayat'>('global');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchLeaderboard = async () => {
      setLoading(true);
      
      // Mock data - would be replaced with actual API call
      const mockData: LeaderboardData = {
        currentUser: {
          id: 'current-user',
          name: 'Rajesh Kumar',
          points: 1250,
          sustainabilityScore: 78,
          completedMissions: 8,
          level: 3,
          streak: 5,
          badge: '🌱 Eco Warrior',
          location: 'Mehsana, Gujarat',
          rank: 12
        },
        topFarmers: [
          {
            id: '1',
            name: 'Priya Sharma',
            points: 2850,
            sustainabilityScore: 95,
            completedMissions: 18,
            level: 5,
            streak: 12,
            badge: '👑 Sustainability Champion',
            location: 'Ahmedabad, Gujarat',
            rank: 1
          },
          {
            id: '2',
            name: 'Amit Patel',
            points: 2650,
            sustainabilityScore: 92,
            completedMissions: 16,
            level: 5,
            streak: 8,
            badge: '🏆 Green Leader',
            location: 'Surat, Gujarat',
            rank: 2
          },
          {
            id: '3',
            name: 'Sunita Devi',
            points: 2400,
            sustainabilityScore: 89,
            completedMissions: 15,
            level: 4,
            streak: 7,
            badge: '🌿 Organic Master',
            location: 'Rajkot, Gujarat',
            rank: 3
          },
          {
            id: '4',
            name: 'Ravi Singh',
            points: 2200,
            sustainabilityScore: 86,
            completedMissions: 14,
            level: 4,
            streak: 6,
            badge: '💧 Water Saver',
            location: 'Vadodara, Gujarat',
            rank: 4
          },
          {
            id: '5',
            name: 'Meera Joshi',
            points: 2000,
            sustainabilityScore: 84,
            completedMissions: 13,
            level: 4,
            streak: 5,
            badge: '🌾 Crop Innovator',
            location: 'Bhavnagar, Gujarat',
            rank: 5
          }
        ],
        nearbyFarmers: [
          {
            id: '10',
            name: 'Kiran Patel',
            points: 1400,
            sustainabilityScore: 80,
            completedMissions: 9,
            level: 3,
            streak: 4,
            location: 'Mehsana, Gujarat',
            rank: 10
          },
          {
            id: '11',
            name: 'Gopal Shah',
            points: 1350,
            sustainabilityScore: 79,
            completedMissions: 9,
            level: 3,
            streak: 3,
            location: 'Mehsana, Gujarat',
            rank: 11
          }
        ]
      };

      setTimeout(() => {
        setLeaderboardData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchLeaderboard();
  }, [activeTab, timeFilter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Leaderboard</h1>
              <p className="text-sm opacity-90">Compete with fellow farmers</p>
            </div>
          </div>
          <Trophy className="w-8 h-8" />
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pb-4">
          <div className="flex bg-white/20 rounded-lg p-1">
            {[
              { key: 'global', label: 'Global' },
              { key: 'village', label: 'Village' },
              { key: 'panchayat', label: 'Panchayat' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-green-600'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div className="px-4 pb-6">
          <div className="flex space-x-2">
            {[
              { key: 'weekly', label: 'This Week' },
              { key: 'monthly', label: 'This Month' },
              { key: 'allTime', label: 'All Time' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTimeFilter(filter.key as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  timeFilter === filter.key
                    ? 'bg-white text-green-600'
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="p-4 space-y-6">
        {/* Current User Position */}
        {leaderboardData?.currentUser && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-bold">#{leaderboardData.currentUser.rank}</span>
                </div>
                <div>
                  <p className="font-semibold">{leaderboardData.currentUser.name}</p>
                  <p className="text-sm opacity-90">{leaderboardData.currentUser.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{leaderboardData.currentUser.points.toLocaleString()}</p>
                <p className="text-sm opacity-90">points</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-lg font-bold">{leaderboardData.currentUser.sustainabilityScore}%</p>
                <p className="text-xs opacity-90">Sustainability</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{leaderboardData.currentUser.completedMissions}</p>
                <p className="text-xs opacity-90">Missions</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{leaderboardData.currentUser.streak}</p>
                <p className="text-xs opacity-90">Day Streak</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Performers */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            Top Performers
          </h2>
          
          <div className="space-y-3">
            {leaderboardData?.topFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className={`p-3 rounded-lg ${getRankColor(farmer.rank)} ${
                  farmer.rank <= 3 ? 'text-white' : 'border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(farmer.rank)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className={`font-semibold ${farmer.rank <= 3 ? 'text-white' : 'text-slate-800'}`}>
                          {farmer.name}
                        </p>
                        {farmer.badge && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            farmer.rank <= 3 
                              ? 'bg-white/20 text-white' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {farmer.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${farmer.rank <= 3 ? 'text-white/80' : 'text-slate-600'}`}>
                        {farmer.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${farmer.rank <= 3 ? 'text-white' : 'text-slate-800'}`}>
                      {farmer.points.toLocaleString()}
                    </p>
                    <p className={`text-sm ${farmer.rank <= 3 ? 'text-white/80' : 'text-slate-600'}`}>
                      Level {farmer.level}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/20">
                  <div className="text-center">
                    <p className={`font-semibold ${farmer.rank <= 3 ? 'text-white' : 'text-slate-800'}`}>
                      {farmer.sustainabilityScore}%
                    </p>
                    <p className={`text-xs ${farmer.rank <= 3 ? 'text-white/80' : 'text-slate-600'}`}>
                      Sustainability
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold ${farmer.rank <= 3 ? 'text-white' : 'text-slate-800'}`}>
                      {farmer.completedMissions}
                    </p>
                    <p className={`text-xs ${farmer.rank <= 3 ? 'text-white/80' : 'text-slate-600'}`}>
                      Missions
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold ${farmer.rank <= 3 ? 'text-white' : 'text-slate-800'}`}>
                      {farmer.streak}d
                    </p>
                    <p className={`text-xs ${farmer.rank <= 3 ? 'text-white/80' : 'text-slate-600'}`}>
                      Streak
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Farmers */}
        {leaderboardData?.nearbyFarmers && leaderboardData.nearbyFarmers.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              Farmers Near You
            </h2>
            
            <div className="space-y-3">
              {leaderboardData?.nearbyFarmers.map((farmer) => (
                <div key={farmer.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-600 bg-slate-100 rounded-full">
                      #{farmer.rank}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">{farmer.name}</p>
                      <p className="text-sm text-slate-600">{farmer.location}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{farmer.points.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Level {farmer.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Competition Info */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <h3 className="font-bold mb-2">🏆 Weekly Competition</h3>
          <p className="text-sm opacity-90 mb-3">
            Complete sustainable farming missions to climb the rankings and win exciting rewards!
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-80">Ends in</p>
              <p className="font-bold">4 days 12 hours</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Prize Pool</p>
              <p className="font-bold">₹10,000 worth rewards</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400">
            <Target className="w-6 h-6" />
            <span className="text-xs">Missions</span>
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