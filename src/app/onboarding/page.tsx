"use client";

import { useState } from 'react';
import { Leaf, User, MapPin, Crop, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const cropOptions = [
  { value: 'CEREALS', label: 'Cereals (Rice, Wheat, Maize)', icon: '🌾' },
  { value: 'PULSES', label: 'Pulses (Lentils, Chickpeas)', icon: '🫘' },
  { value: 'VEGETABLES', label: 'Vegetables', icon: '🥬' },
  { value: 'FRUITS', label: 'Fruits', icon: '🍎' },
  { value: 'SPICES', label: 'Spices', icon: '🌶️' },
  { value: 'CASH_CROPS', label: 'Cash Crops (Cotton, Sugarcane)', icon: '🌿' },
  { value: 'OILSEEDS', label: 'Oilseeds (Mustard, Sunflower)', icon: '🌻' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    farmName: '',
    region: '',
    village: '',
    panchayat: '',
    farmSize: '',
    primaryCrops: [] as string[],
    secondaryCrops: [] as string[],
    farmingExperience: '',
    educationLevel: '',
    preferredLanguage: 'en',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCropToggle = (crop: string, type: 'primary' | 'secondary') => {
    const field = type === 'primary' ? 'primaryCrops' : 'secondaryCrops';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(crop)
        ? prev[field].filter(c => c !== crop)
        : [...prev[field], crop]
    }));
  };

  const handleSubmit = async () => {
    console.log('🚀 Starting profile completion...');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('📱 Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.error('❌ No authentication token found');
        alert('Authentication required. Please login again.');
        router.push('/auth/login');
        return;
      }
      
      console.log('📋 Form data:', formData);
      
      // Use relative URL instead of absolute URL to avoid CORS issues
      const apiUrl = `/api/auth/complete-profile`;
      console.log('🔗 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      // Handle case where response is not JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: `Server returned ${response.status}: ${text}` };
      }
      
      if (response.ok) {
        console.log('✅ Profile completed successfully:', data);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('🏠 Navigating to dashboard...');
        
        // Use Next.js router for navigation
        router.push('/dashboard');
      } else {
        console.error('❌ Profile completion failed - Status:', response.status);
        console.error('❌ Error response:', data);
        
        alert(data.error || data.message || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('🚨 Network error:', error);
      alert('Network error. Please try again. ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName;
      case 2:
        return formData.region && formData.village;
      case 3:
        return formData.primaryCrops.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-green-800">AgriQuest</h1>
          </Link>
          <div className="text-sm text-slate-600">
            Step {step} of 4
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 mb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        <div className="max-w-md mx-auto">
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Personal Information</h2>
                <p className="text-slate-600">Let's get to know you better</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Farm Location</h2>
                <p className="text-slate-600">Where is your farm located?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State/Region *
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="e.g., Punjab, Uttar Pradesh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="Enter your village name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Panchayat/Block
                  </label>
                  <input
                    type="text"
                    value={formData.panchayat}
                    onChange={(e) => handleInputChange('panchayat', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="Enter panchayat name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Farm Name
                  </label>
                  <input
                    type="text"
                    value={formData.farmName}
                    onChange={(e) => handleInputChange('farmName', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="e.g., Kumar Organic Farm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Farm Size (in acres)
                  </label>
                  <input
                    type="number"
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange('farmSize', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="e.g., 5.5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <Crop className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Crops You Grow</h2>
                <p className="text-slate-600">Select the crops you currently grow</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Primary Crops *</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {cropOptions.map((crop) => (
                      <button
                        key={crop.value}
                        onClick={() => handleCropToggle(crop.value, 'primary')}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                          formData.primaryCrops.includes(crop.value)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{crop.icon}</span>
                        <span className="text-sm font-medium text-left flex-1">
                          {crop.label}
                        </span>
                        {formData.primaryCrops.includes(crop.value) && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Secondary Crops (Optional)</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {cropOptions.map((crop) => (
                      <button
                        key={crop.value}
                        onClick={() => handleCropToggle(crop.value, 'secondary')}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                          formData.secondaryCrops.includes(crop.value)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        disabled={formData.primaryCrops.includes(crop.value)}
                      >
                        <span className="text-2xl opacity-60">{crop.icon}</span>
                        <span className="text-sm font-medium text-left flex-1">
                          {crop.label}
                        </span>
                        {formData.secondaryCrops.includes(crop.value) && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Additional Details</h2>
                <p className="text-slate-600">Help us personalize your experience</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Farming Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.farmingExperience}
                    onChange={(e) => handleInputChange('farmingExperience', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                    placeholder="e.g., 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Education Level
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  >
                    <option value="">Select education level</option>
                    <option value="Primary">Primary (1-5)</option>
                    <option value="Middle">Middle School (6-8)</option>
                    <option value="High School">High School (9-10)</option>
                    <option value="Intermediate">Intermediate (11-12)</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-green-800 mb-2">🎉 You're all set!</h3>
                  <p className="text-green-700 text-sm">
                    Complete your profile to start earning points through sustainable farming missions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 space-x-4">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}