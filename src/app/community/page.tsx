'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Camera, Heart, MessageCircle, Share2, Target, Trophy, Leaf, ArrowLeft, Plus, MapPin, Clock } from 'lucide-react';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    location: string;
    level: number;
    badge?: string;
  };
  content: string;
  images?: string[];
  missionRelated?: {
    missionTitle: string;
    missionType: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
  tags: string[];
  liked?: boolean;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'nearby' | 'missions'>('all');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          author: {
            name: 'Priya Sharma',
            location: 'Ahmedabad, Gujarat',
            level: 5,
            badge: '👑 Sustainability Champion'
          },
          content: 'Just completed my organic composting mission! 🌱 The results are amazing - my soil health has improved significantly and my vegetables are growing better than ever.',
          missionRelated: {
            missionTitle: 'Master Organic Composting',
            missionType: 'Soil Health'
          },
          stats: { likes: 42, comments: 8, shares: 12 },
          timestamp: '2 hours ago',
          tags: ['composting', 'organic', 'soilhealth'],
          liked: false
        },
        {
          id: '2',
          author: {
            name: 'Amit Patel',
            location: 'Surat, Gujarat',
            level: 4,
            badge: '🏆 Green Leader'
          },
          content: 'Sharing my water conservation success! 💧 Implemented drip irrigation system last month and already seeing 40% reduction in water usage. My crops are healthier!',
          missionRelated: {
            missionTitle: 'Implement Drip Irrigation',
            missionType: 'Water Conservation'
          },
          stats: { likes: 38, comments: 15, shares: 6 },
          timestamp: '5 hours ago',
          tags: ['waterconservation', 'dripirrigation', 'sustainability'],
          liked: true
        },
        {
          id: '3',
          author: {
            name: 'Sunita Devi',
            location: 'Rajkot, Gujarat',
            level: 4,
            badge: '🌿 Organic Master'
          },
          content: 'My intercropping experiment is showing great results! 🌾🌻 Growing marigolds with tomatoes has naturally reduced pest problems and increased pollination.',
          stats: { likes: 29, comments: 11, shares: 4 },
          timestamp: '1 day ago',
          tags: ['intercropping', 'organic', 'pestcontrol'],
          liked: false
        }
      ];

      setTimeout(() => {
        setPosts(mockPosts);
        setLoading(false);
      }, 1000);
    };

    fetchPosts();
  }, [activeFilter]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          stats: {
            ...post.stats,
            likes: post.liked ? post.stats.likes - 1 : post.stats.likes + 1
          }
        };
      }
      return post;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Community</h1>
              <p className="text-sm opacity-90">Share & learn together</p>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4">
          <div className="flex bg-white/20 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'following', label: 'Following' },
              { key: 'nearby', label: 'Nearby' },
              { key: 'missions', label: 'Missions' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-white text-purple-600'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="p-4 space-y-4">
        {/* Create Post Prompt */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <button className="w-full text-left p-3 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 hover:border-green-400 transition-colors flex items-center space-x-3">
            <Camera className="w-6 h-6 text-slate-400" />
            <span className="text-slate-500">Share your farming journey...</span>
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm">
              {/* Post Header */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-slate-800">{post.author.name}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Level {post.author.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span>{post.author.location}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{post.timestamp}</span>
                    </div>
                    {post.author.badge && (
                      <p className="text-xs text-purple-600 mt-1">{post.author.badge}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mission Context */}
              {post.missionRelated && (
                <div className="px-4 py-2 bg-green-50">
                  <div className="flex items-center space-x-2 text-sm">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">Mission: {post.missionRelated.missionTitle}</span>
                  </div>
                </div>
              )}

              {/* Post Content */}
              <div className="p-4">
                <p className="text-slate-800 leading-relaxed mb-4">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      post.liked 
                        ? 'bg-red-50 text-red-600' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{post.stats.likes}</span>
                  </button>

                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.stats.comments}</span>
                  </button>

                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.stats.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-6">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Load More Posts
          </button>
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
          <Link href="/leaderboard" className="flex flex-col items-center py-2 text-slate-400">
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Rankings</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-2 text-green-600">
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Community</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}