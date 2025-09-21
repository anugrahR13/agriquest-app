'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, Trophy, Star, Coins, ShoppingBag, Target, Users, Leaf, ArrowLeft, Check, Clock, Lock } from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'seeds' | 'tools' | 'fertilizer' | 'training' | 'cash';
  imageUrl?: string;
  availability: 'available' | 'limited' | 'sold_out';
  validUntil?: string;
  requiresLevel?: number;
  claimed?: boolean;
}

interface UserStats {
  totalPoints: number;
  availablePoints: number;
  level: number;
  claimedRewards: number;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'seeds' | 'tools' | 'fertilizer' | 'training' | 'cash'>('all');

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      
      // Mock data - would be replaced with actual API call
      const mockUserStats: UserStats = {
        totalPoints: 1250,
        availablePoints: 850,
        level: 3,
        claimedRewards: 4
      };

      const mockRewards: Reward[] = [
        {
          id: '1',
          title: 'Premium Organic Seeds Pack',
          description: '10 varieties of certified organic vegetable seeds including tomato, brinjal, and okra',
          pointsCost: 500,
          category: 'seeds',
          availability: 'available'
        },
        {
          id: '2',
          title: 'Drip Irrigation Kit (Basic)',
          description: 'Complete drip irrigation system for 1000 sq ft area with pipes, emitters, and timer',
          pointsCost: 1200,
          category: 'tools',
          availability: 'available',
          requiresLevel: 4
        },
        {
          id: '3',
          title: 'Organic Fertilizer (25kg)',
          description: 'Premium vermicompost and neem-based organic fertilizer for healthy crop growth',
          pointsCost: 300,
          category: 'fertilizer',
          availability: 'available'
        },
        {
          id: '4',
          title: 'Sustainable Farming Workshop',
          description: '2-day hands-on training on advanced sustainable farming techniques by experts',
          pointsCost: 800,
          category: 'training',
          availability: 'limited',
          validUntil: '2024-12-31'
        },
        {
          id: '5',
          title: 'Smart Soil pH Meter',
          description: 'Digital soil testing device to monitor pH, moisture, and light levels',
          pointsCost: 600,
          category: 'tools',
          availability: 'available'
        },
        {
          id: '6',
          title: 'Cash Reward ₹500',
          description: 'Direct bank transfer of ₹500 to your registered account',
          pointsCost: 1000,
          category: 'cash',
          availability: 'available',
          requiresLevel: 5
        },
        {
          id: '7',
          title: 'Bio-Pesticide Kit',
          description: 'Natural pest control solution kit with neem oil and beneficial microbes',
          pointsCost: 400,
          category: 'fertilizer',
          availability: 'available'
        },
        {
          id: '8',
          title: 'Premium Hand Tools Set',
          description: 'High-quality gardening tools including spade, fork, pruner, and weeder',
          pointsCost: 700,
          category: 'tools',
          availability: 'sold_out'
        }
      ];

      setTimeout(() => {
        setUserStats(mockUserStats);
        setRewards(mockRewards);
        setLoading(false);
      }, 1000);
    };

    fetchRewards();
  }, []);

  const filteredRewards = rewards.filter(reward => 
    activeCategory === 'all' || reward.category === activeCategory
  );

  const canClaim = (reward: Reward) => {
    if (!userStats) return false;
    if (reward.pointsCost > userStats.availablePoints) return false;
    if (reward.requiresLevel && reward.requiresLevel > userStats.level) return false;
    if (reward.availability === 'sold_out') return false;
    return true;
  };

  const handleClaim = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || !userStats || !canClaim(reward)) return;

    // Update user stats
    setUserStats({
      ...userStats,
      availablePoints: userStats.availablePoints - reward.pointsCost,
      claimedRewards: userStats.claimedRewards + 1
    });

    // Mark reward as claimed
    setRewards(rewards.map(r => 
      r.id === rewardId ? { ...r, claimed: true } : r
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seeds': return '🌱';
      case 'tools': return '🔧';
      case 'fertilizer': return '🌿';
      case 'training': return '📚';
      case 'cash': return '💰';
      default: return '🎁';
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>;
      case 'limited':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Limited Time</span>;
      case 'sold_out':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Sold Out</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Rewards Store</h1>
              <p className="text-sm opacity-90">Redeem your AgriPoints</p>
            </div>
          </div>
          <Gift className="w-8 h-8" />
        </div>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Your AgriPoints</h2>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{userStats.availablePoints.toLocaleString()}</p>
                <p className="text-xs text-slate-600">Available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{userStats.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-slate-600">Total Earned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{userStats.claimedRewards}</p>
                <p className="text-xs text-slate-600">Rewards Claimed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All', icon: '🎁' },
            { key: 'seeds', label: 'Seeds', icon: '🌱' },
            { key: 'tools', label: 'Tools', icon: '🔧' },
            { key: 'fertilizer', label: 'Fertilizer', icon: '🌿' },
            { key: 'training', label: 'Training', icon: '📚' },
            { key: 'cash', label: 'Cash', icon: '💰' }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.key
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-green-50'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Grid */}
      <main className="p-4">
        <div className="grid gap-4">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl">
                    {getCategoryIcon(reward.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{reward.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-700">{reward.pointsCost.toLocaleString()}</span>
                      </div>
                      {getAvailabilityBadge(reward.availability)}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4">{reward.description}</p>

              {/* Requirements & Restrictions */}
              <div className="space-y-2 mb-4">
                {reward.requiresLevel && (
                  <div className="flex items-center space-x-2 text-sm">
                    {userStats && userStats.level >= reward.requiresLevel ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-red-500" />
                    )}
                    <span className={userStats && userStats.level >= reward.requiresLevel ? 'text-green-700' : 'text-red-700'}>
                      Requires Level {reward.requiresLevel}
                    </span>
                  </div>
                )}
                
                {reward.validUntil && (
                  <div className="flex items-center space-x-2 text-sm text-orange-700">
                    <Clock className="w-4 h-4" />
                    <span>Valid until {reward.validUntil}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleClaim(reward.id)}
                disabled={!canClaim(reward) || reward.claimed}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  reward.claimed
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : canClaim(reward)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                {reward.claimed ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Claimed</span>
                  </div>
                ) : canClaim(reward) ? (
                  `Claim for ${reward.pointsCost.toLocaleString()} points`
                ) : reward.availability === 'sold_out' ? (
                  'Sold Out'
                ) : !userStats || reward.pointsCost > userStats.availablePoints ? (
                  `Need ${(reward.pointsCost - (userStats?.availablePoints || 0)).toLocaleString()} more points`
                ) : (
                  `Requires Level ${reward.requiresLevel}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No rewards available in this category</p>
          </div>
        )}
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
          <Link href="/leaderboard" className="flex flex-col items-center py-2 text-slate-400">
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Rankings</span>
          </Link>
          <Link href="/rewards" className="flex flex-col items-center py-2 text-green-600">
            <Gift className="w-6 h-6" />
            <span className="text-xs font-medium">Rewards</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}