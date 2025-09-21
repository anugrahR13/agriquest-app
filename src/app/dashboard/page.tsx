"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Leaf, 
  Target, 
  Trophy, 
  Users, 
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  Award,
  Plus,
  ArrowRight,
  Gift,
  MessageCircle,
  Bot,
  Sprout,
  Zap,
  FileText,
  Gavel
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  farmer?: {
    farmName: string;
    region: string;
    village: string;
    totalPoints: number;
    level: number;
    currentStreak: number;
    sustainabilityScore: string;
  };
}

interface Stats {
  totalPoints: number;
  thisMonthPoints: number;
  currentStreak: number;
  level: number;
  completedMissions: number;
  totalBadges: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch user stats
    fetchUserStats(token);
  }, [router]);

  const fetchUserStats = async (token: string) => {
    try {
      // Use relative URL instead of absolute URL to avoid CORS issues
      const response = await fetch(`/api/users/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Handle case where response is not JSON
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Response is not JSON:', await response.text());
        }
      } else {
        console.error('Failed to fetch stats:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-green-800">AgriQuest</h1>
                <p className="text-xs text-slate-600">
                  Welcome, {user.firstName}!
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Farmer Profile Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-slate-800">
                  {user.firstName} {user.lastName}
                </h2>
                {user.farmer && (
                  <>
                    <p className="text-green-600 font-medium">
                      {user.farmer.farmName || 'Farmer'}
                    </p>
                    <div className="flex items-center space-x-1 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{user.farmer.village}, {user.farmer.region}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                  <span className="text-yellow-600 font-bold text-sm">
                    {user.farmer?.level || 1}
                  </span>
                </div>
                <span className="text-xs text-slate-500">Level</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats?.totalPoints || user.farmer?.totalPoints || 0}
                  </p>
                  <p className="text-sm text-slate-600">Total Points</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats?.currentStreak || user.farmer?.currentStreak || 0}
                  </p>
                  <p className="text-sm text-slate-600">Day Streak</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats?.completedMissions || 0}
                  </p>
                  <p className="text-sm text-slate-600">Missions Done</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats?.totalBadges || 0}
                  </p>
                  <p className="text-sm text-slate-600">Badges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability Score */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Sustainability Score</h3>
              <span className="text-2xl font-bold text-green-600">
                {user.farmer?.sustainabilityScore || '0'}/100
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${user.farmer?.sustainabilityScore || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Great progress! Keep completing sustainable farming missions to improve your score.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/missions" className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Target className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">View Missions</span>
              </Link>

              <Link href="/leaderboard" className="flex flex-col items-center space-y-2 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Leaderboard</span>
              </Link>

              <Link href="/rewards" className="flex flex-col items-center space-y-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <Gift className="w-8 h-8 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Rewards</span>
              </Link>

              <Link href="/community" className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Community</span>
              </Link>
              
              <Link href="/chatbot" className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Bot className="w-8 h-8 text-green-600" />
                <span className="text-sm font-medium text-green-800">AI Assistant</span>
              </Link>
              
              <Link href="/help-desk" className="flex flex-col items-center space-y-2 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-800">Help Desk</span>
              </Link>

              <Link href="/crop-tracking" className="flex flex-col items-center space-y-2 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <Sprout className="w-8 h-8 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">Crop Tracking</span>
              </Link>

              <Link href="/ai-analysis" className="flex flex-col items-center space-y-2 p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                <Zap className="w-8 h-8 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-800">AI Analysis</span>
              </Link>

              <Link href="/crop-reports" className="flex flex-col items-center space-y-2 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                <FileText className="w-8 h-8 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">Crop Reports</span>
              </Link>

              <Link href="/auction/apply" className="flex flex-col items-center space-y-2 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <Gavel className="w-8 h-8 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Auction Apply</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-600 p-1 rounded-full">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Profile Completed</p>
                  <p className="text-xs text-slate-600">Welcome to AgriQuest! Start your sustainable farming journey.</p>
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-sm text-slate-500">Complete your first mission to see more activity</p>
                <Link href="/missions" className="inline-flex items-center space-x-1 text-green-600 font-medium mt-2 hover:text-green-700">
                  <span>View Available Missions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white">
            <h3 className="font-bold mb-2">🚀 Coming Soon</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Personalized mission recommendations</li>
              <li>• Real-time leaderboard competitions</li>
              <li>• Community knowledge sharing</li>
              <li>• Reward redemption system</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-green-600">
            <Leaf className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400">
            <Target className="w-6 h-6" />
            <span className="text-xs">Missions</span>
          </Link>
          <Link href="/crop-tracking" className="flex flex-col items-center py-2 text-slate-400">
            <Sprout className="w-6 h-6" />
            <span className="text-xs">Crops</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-2 text-slate-400">
            <Users className="w-6 h-6" />
            <span className="text-xs">Community</span>
          </Link>
          <Link href="/rewards" className="flex flex-col items-center py-2 text-slate-400">
            <Gift className="w-6 h-6" />
            <span className="text-xs">Rewards</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}