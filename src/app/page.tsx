'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, FileText } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    region: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization/Farm name is required';
    }
    
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = 'Either email or phone is required';
      newErrors.phone = 'Either email or phone is required';
    }
    
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  AgriQuest
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/missions" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Missions
              </Link>
              <Link href="/auction/listings" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Auctions
              </Link>
              <Link href="/community" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Community
              </Link>
              <Link href="/eoi" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse">
                Express Interest
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/missions" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Missions
              </Link>
              <Link 
                href="/auction/listings" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Auctions
              </Link>
              <Link 
                href="/community" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                href="/eoi" 
                className="block px-3 py-2 rounded-md text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg animate-pulse"
                onClick={() => setIsMenuOpen(false)}
              >
                Express Interest
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden pt-16">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1500937804297-71c2f1f8c8e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Glassmorphism hero card */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="glass-card max-w-2xl w-full p-8 md:p-12 text-center fade-in">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-down">
                Join the Sustainable Farming Movement
              </h1>
              <p className="text-xl text-white opacity-90 animate-fade-in-up">
                Empowering farmers through technology and community
              </p>
            </div>
            
            <p className="text-lg text-white mb-8 opacity-90 animate-fade-in-up delay-100">
              AgriQuest is a gamified platform that helps farmers adopt sustainable practices while earning rewards. Join our community of forward-thinking farmers today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <button 
                onClick={() => document.getElementById('eoi-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 pulse shadow-lg"
              >
                Express Interest
              </button>
              <Link 
                href="/demo-login" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 border border-white/30"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Why Join Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
              Why Join AgriQuest?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in delay-100">
              Discover the benefits of becoming part of our sustainable farming community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="glass-card p-6 text-center hover:transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI Crop Scoring
              </h3>
              <p className="text-gray-600">
                Get accurate health assessments of your crops with our advanced AI technology
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="glass-card p-6 text-center hover:transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-100">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Government Auction Access
              </h3>
              <p className="text-gray-600">
                Apply for government crop auctions with automated report generation
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="glass-card p-6 text-center hover:transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Expert Mentorship
              </h3>
              <p className="text-gray-600">
                Connect with agricultural experts for personalized guidance and support
              </p>
            </div>
            
            {/* Benefit 4 */}
            <div className="glass-card p-6 text-center hover:transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Crop Reports & Analytics
              </h3>
              <p className="text-gray-600">
                Generate detailed crop reports for better decision making and government auctions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in delay-100">
              Get started with AgriQuest in four simple steps
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 to-yellow-500 hidden md:block"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center animate-fade-in-up">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 text-center md:text-right">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Create Your Profile
                  </h3>
                  <p className="text-gray-600">
                    Set up your farmer profile with farm details, crops grown, and location information
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 flex justify-center md:justify-start">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center text-white text-xl font-bold z-10">
                    1
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center animate-fade-in-up delay-100">
                <div className="md:w-1/2 md:pl-12 order-first md:order-last mb-6 md:mb-0 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Complete Missions
                  </h3>
                  <p className="text-gray-600">
                    Engage with sustainable farming missions tailored to your crops and region
                  </p>
                </div>
                <div className="md:w-1/2 md:pr-12 flex justify-center md:justify-end">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center text-white text-xl font-bold z-10">
                    2
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center animate-fade-in-up delay-200">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 text-center md:text-right">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Generate Crop Score
                  </h3>
                  <p className="text-gray-600">
                    Upload photos and get an AI-powered health score for your crops (0-10 rating)
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 flex justify-center md:justify-start">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center text-white text-xl font-bold z-10">
                    3
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-center animate-fade-in-up delay-300">
                <div className="md:w-1/2 md:pl-12 order-first md:order-last mb-6 md:mb-0 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Access Government Auctions
                  </h3>
                  <p className="text-gray-600">
                    Apply for government crop auctions with your AI report and get verified
                  </p>
                </div>
                <div className="md:w-1/2 md:pr-12 flex justify-center md:justify-end">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center text-white text-xl font-bold z-10">
                    4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EOI Form Section */}
      <section id="eoi-form" className="py-16 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
              Express Interest
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in delay-100">
              Join our waiting list to be among the first to access AgriQuest when we launch
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="glass-card p-8 md:p-12 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-6">
                We've received your expression of interest. Our team will contact you soon with more information about AgriQuest.
              </p>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    organization: '',
                    email: '',
                    phone: '',
                    region: '',
                    message: ''
                  });
                }}
                className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <div className="glass-card p-6 md:p-8 animate-fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Farm/Organization Name *
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.organization ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your farm or organization name"
                    />
                    {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your 10-digit phone number"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Region/State *
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.region ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your region or state"
                    />
                    {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your farming practices or any questions you have"
                  ></textarea>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  * Required fields. Either email or phone is required.
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Interest"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">AgriQuest</h3>
              <p className="text-gray-300 mb-4">
                A gamified platform for sustainable farming that empowers farmers through technology, community, and rewards.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/community" className="text-gray-300 hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/support" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Farm Road, Agriculture District</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@agriquest.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 AgriQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
