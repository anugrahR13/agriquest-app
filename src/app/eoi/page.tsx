'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Leaf, Target, Users, Gavel } from 'lucide-react';

export default function EOIPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Express Interest</h1>
              <p className="text-sm opacity-90">Join our waiting list for AgriQuest</p>
            </div>
          </div>
          <FileText className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Join the Sustainable Farming Movement
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Become part of our community of forward-thinking farmers who are adopting sustainable practices while earning rewards.
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
                Thank You for Your Interest!
              </h3>
              <p className="text-gray-600 mb-6">
                We've received your expression of interest. Our team will contact you soon with more information about AgriQuest.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-800 mb-2">What Happens Next?</h4>
                <ul className="text-sm text-blue-700 list-disc list-inside text-left max-w-md mx-auto">
                  <li>You'll receive a confirmation email shortly</li>
                  <li>Our team will review your application within 2-3 business days</li>
                  <li>We'll schedule a demo session to show you the platform</li>
                  <li>You'll get early access when we launch</li>
                </ul>
              </div>
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
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 md:p-8 animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Express Your Interest</h3>
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
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-lg"
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
              </div>
              
              {/* Info Section */}
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Why Join AgriQuest?</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">AI Crop Scoring</h4>
                        <p className="text-sm text-gray-600">Get accurate health assessments of your crops with our advanced AI technology</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Gavel className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Government Auction Access</h4>
                        <p className="text-sm text-gray-600">Apply for government crop auctions with automated report generation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Target className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Expert Mentorship</h4>
                        <p className="text-sm text-gray-600">Connect with agricultural experts for personalized guidance and support</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Community Support</h4>
                        <p className="text-sm text-gray-600">Join a network of like-minded farmers working towards sustainable agriculture</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">How It Works</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                        1
                      </div>
                      <p className="text-sm text-gray-600">Submit your interest and farm details</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                        2
                      </div>
                      <p className="text-sm text-gray-600">Get early access when we launch</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                        3
                      </div>
                      <p className="text-sm text-gray-600">Complete your profile and start missions</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                        4
                      </div>
                      <p className="text-sm text-gray-600">Generate crop reports and apply for auctions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Target className="w-6 h-6" />
            <span className="text-xs">Missions</span>
          </Link>
          <Link href="/auction/listings" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Gavel className="w-6 h-6" />
            <span className="text-xs">Auctions</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Users className="w-6 h-6" />
            <span className="text-xs">Community</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}