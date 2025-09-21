"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Tractor, User, Zap, Rocket } from 'lucide-react';

export default function LoginOptionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-4">
        <div className="flex items-center bg-white bg-opacity-80 px-3 py-1 rounded-lg">
          <Tractor className="text-green-600 mr-2 text-2xl" />
          <h1 className="text-xl font-bold text-green-800">AgriQuest</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8">
        <div className="glass-card max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to AgriQuest</h1>
            <p className="text-slate-600">Choose your login method</p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/auth/login"
              className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-slate-800">Normal Login</h3>
                <p className="text-sm text-slate-600">Login with your phone number and OTP</p>
              </div>
              <div className="text-green-600">→</div>
            </Link>

            <Link 
              href="/demo-login"
              className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-slate-800">Demo Login</h3>
                <p className="text-sm text-slate-600">Skip login and use demo account</p>
              </div>
              <div className="text-yellow-600">→</div>
            </Link>

            <Link 
              href="/quick-login"
              className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="bg-blue-100 p-3 rounded-lg">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-slate-800">Quick Login</h3>
                <p className="text-sm text-slate-600">Auto-login with demo credentials</p>
              </div>
              <div className="text-blue-600">→</div>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Use Demo Login to quickly access the app with a pre-configured profile</p>
            <p className="mt-2">Use Quick Login to automatically login with demo credentials (9876543210 / 123456)</p>
          </div>
        </div>
      </main>

      <footer className="px-4 py-6">
        <div className="max-w-md mx-auto text-center text-sm bg-white/30 py-3 px-4 rounded-full backdrop-blur-sm">
          Secure login options for farmers
        </div>
      </footer>
    </div>
  );
}