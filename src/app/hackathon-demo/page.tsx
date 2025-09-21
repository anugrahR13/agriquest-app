"use client";

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
  Play,
  ArrowRight
} from 'lucide-react';

export default function HackathonDemoPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Gamified Missions",
      description: "Complete sustainable farming missions and earn points"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "AI Crop Analysis",
      description: "Upload photos for health analysis and recommendations"
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      title: "Leaderboards",
      description: "Compete with other farmers in sustainability challenges"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community",
      description: "Share experiences and learn from other farmers"
    },
    {
      icon: <Award className="w-8 h-8 text-red-600" />,
      title: "Rewards System",
      description: "Redeem points for seeds, tools, and training"
    },
    {
      icon: <Star className="w-8 h-8 text-indigo-600" />,
      title: "Multilingual Support",
      description: "Voice/chat bot in 6 Indian languages"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-green-800">AgriQuest</h1>
                <p className="text-sm text-slate-600">Gamified Sustainable Farming Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/demo-login')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Demo Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Empowering Farmers Through <span className="text-green-600">Gamification</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            AgriQuest is a comprehensive platform that helps farmers adopt sustainable practices 
            while earning rewards and recognition through gamified experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/demo-login')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Start Demo</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <span>View Features</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Platform Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover how AgriQuest transforms traditional farming into an engaging, 
              rewarding experience with cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Account Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Hackathon Demo Access</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Experience all features of AgriQuest with our pre-configured demo account. 
              Perfect for presentations and testing.
            </p>
            <div className="bg-white/10 rounded-xl p-6 max-w-md mx-auto mb-8">
              <div className="text-left space-y-3">
                <div>
                  <p className="text-sm opacity-80">Demo Phone Number</p>
                  <p className="font-mono text-xl">9876543210</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Demo OTP</p>
                  <p className="font-mono text-xl">123456</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/demo-login')}
              className="bg-white text-green-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-medium text-lg transition-colors"
            >
              Access Demo Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">AgriQuest</span>
              </div>
              <p className="text-slate-400 max-w-md">
                Empowering farmers with sustainable practices through gamification, 
                AI analysis, and community engagement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Gamified Missions</li>
                <li>AI Crop Analysis</li>
                <li>Leaderboards</li>
                <li>Rewards System</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>GitHub</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>© 2025 AgriQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}