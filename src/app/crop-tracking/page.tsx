'use client';

import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Camera, 
  Leaf, 
  Calendar, 
  MapPin, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Plus,
  FileText,
  Target,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface FarmerCrop {
  id: string;
  cropType: string;
  variety: string;
  sowingDate: string;
  soilPH: number;
  soilTexture: string;
  soilFertility: string;
  farmSize: number;
  location: string;
  latitude: number;
  longitude: number;
  growthRecords: GrowthRecord[];
  photos: Photo[];
}

interface GrowthRecord {
  id: string;
  stage: string;
  stageDate: string;
  notes: string;
  isVerified: boolean;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  stage: string;
  latitude: number;
  longitude: number;
}

export default function CropTrackingPage() {
  const { t } = useTranslation();
  const [crops, setCrops] = useState<FarmerCrop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<FarmerCrop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCrop, setNewCrop] = useState({
    cropType: '',
    variety: '',
    sowingDate: '',
    soilPH: 7.0,
    soilTexture: '',
    soilFertility: '',
    farmSize: 1,
    location: '',
    latitude: 0,
    longitude: 0
  });

  // Growth stages for different crops
  const growthStages = {
    WHEAT: ['SOWING', 'SPROUTING', 'TILLERING', 'FLOWERING', 'HARVEST'],
    RICE: ['SOWING', 'GERMINATION', 'TILLERING', 'BOOTING', 'FLOWERING', 'HARVEST'],
    MAIZE: ['SOWING', 'SPROUTING', 'VEGETATIVE', 'TASSLING', 'SILKING', 'HARVEST']
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/crop-tracking');
      // const data = await response.json();
      // setCrops(data.crops);
      
      // Mock data for now
      setCrops([
        {
          id: '1',
          cropType: 'WHEAT',
          variety: 'HD 2967',
          sowingDate: '2023-10-15',
          soilPH: 6.5,
          soilTexture: 'Loamy',
          soilFertility: 'MEDIUM',
          farmSize: 5.5,
          location: 'Mehsana, Gujarat',
          latitude: 23.1234,
          longitude: 72.5678,
          growthRecords: [
            {
              id: '1',
              stage: 'SOWING',
              stageDate: '2023-10-15',
              notes: 'Sowing completed successfully',
              isVerified: true
            },
            {
              id: '2',
              stage: 'SPROUTING',
              stageDate: '2023-10-25',
              notes: 'Good germination observed',
              isVerified: true
            },
            {
              id: '3',
              stage: 'TILLERING',
              stageDate: '2023-11-10',
              notes: 'Healthy tillering observed',
              isVerified: false
            }
          ],
          photos: [
            {
              id: '1',
              url: '/images/crop1.jpg',
              caption: 'After sowing',
              timestamp: '2023-10-15T10:30:00Z',
              stage: 'SOWING',
              latitude: 23.1234,
              longitude: 72.5678
            },
            {
              id: '2',
              url: '/images/crop2.jpg',
              caption: 'Sprouting stage',
              timestamp: '2023-10-25T09:15:00Z',
              stage: 'SPROUTING',
              latitude: 23.1234,
              longitude: 72.5678
            }
          ]
        }
      ]);
    } catch (err) {
      setError(t('cropTracking.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/crop-tracking', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newCrop)
      // });
      // const data = await response.json();
      
      // Mock implementation
      const addedCrop: FarmerCrop = {
        id: `${crops.length + 1}`,
        ...newCrop,
        growthRecords: [
          {
            id: '1',
            stage: growthStages[newCrop.cropType as keyof typeof growthStages]?.[0] || 'SOWING',
            stageDate: newCrop.sowingDate,
            notes: 'Initial stage recorded',
            isVerified: false
          }
        ],
        photos: []
      };
      
      setCrops([...crops, addedCrop]);
      setShowAddCrop(false);
      setNewCrop({
        cropType: '',
        variety: '',
        sowingDate: '',
        soilPH: 7.0,
        soilTexture: '',
        soilFertility: '',
        farmSize: 1,
        location: '',
        latitude: 0,
        longitude: 0
      });
    } catch (err) {
      setError(t('cropTracking.fetchError'));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, stage: string) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCrop) return;
    
    try {
      // In a real app, this would be an API call
      // const formData = new FormData();
      // formData.append('image', file);
      // formData.append('cropId', selectedCrop.id);
      // formData.append('stage', stage);
      // const response = await fetch('/api/crop-tracking/photos', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      
      // Mock implementation
      const newPhoto: Photo = {
        id: `${selectedCrop.photos.length + 1}`,
        url: URL.createObjectURL(file),
        caption: `Photo for ${stage} stage`,
        timestamp: new Date().toISOString(),
        stage,
        latitude: selectedCrop.latitude,
        longitude: selectedCrop.longitude
      };
      
      const updatedCrop = {
        ...selectedCrop,
        photos: [...selectedCrop.photos, newPhoto]
      };
      
      setSelectedCrop(updatedCrop);
      setCrops(crops.map(crop => crop.id === selectedCrop.id ? updatedCrop : crop));
    } catch (err) {
      setError(t('cropTracking.fetchError'));
    }
  };

  const completeStage = async (stageId: string) => {
    if (!selectedCrop) return;
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/crop-tracking/growth-stages/${stageId}/complete`, {
      //   method: 'POST'
      // });
      // const data = await response.json();
      
      // Mock implementation
      const updatedCrop = {
        ...selectedCrop,
        growthRecords: selectedCrop.growthRecords.map(record => 
          record.id === stageId ? { ...record, isVerified: true } : record
        )
      };
      
      setSelectedCrop(updatedCrop);
      setCrops(crops.map(crop => crop.id === selectedCrop.id ? updatedCrop : crop));
    } catch (err) {
      setError(t('cropTracking.fetchError'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{t('cropTracking.title')}</h1>
              <p className="text-sm opacity-90">{t('cropTracking.subtitle')}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddCrop(true)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors touch-target"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="p-4">
        {showAddCrop ? (
          <div className="glass-card rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{t('cropTracking.addCrop')}</h2>
            <form onSubmit={handleAddCrop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('onboarding.farmLocation.cropType')}
                </label>
                <select
                  value={newCrop.cropType}
                  onChange={(e) => setNewCrop({...newCrop, cropType: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  required
                >
                  <option value="">{t('common.select')}</option>
                  <option value="WHEAT">Wheat</option>
                  <option value="RICE">Rice</option>
                  <option value="MAIZE">Maize</option>
                  <option value="COTTON">Cotton</option>
                  <option value="SUGARCANE">Sugarcane</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('onboarding.farmLocation.variety')}
                </label>
                <input
                  type="text"
                  value={newCrop.variety}
                  onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  placeholder={t('onboarding.farmLocation.enterVariety')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('cropTracking.sowingDate')}
                </label>
                <input
                  type="date"
                  value={newCrop.sowingDate}
                  onChange={(e) => setNewCrop({...newCrop, sowingDate: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('dashboard.soilPH')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={newCrop.soilPH}
                    onChange={(e) => setNewCrop({...newCrop, soilPH: parseFloat(e.target.value)})}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('cropTracking.farmSize')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newCrop.farmSize}
                    onChange={(e) => setNewCrop({...newCrop, farmSize: parseFloat(e.target.value)})}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('dashboard.soilTexture')}
                  </label>
                  <select
                    value={newCrop.soilTexture}
                    onChange={(e) => setNewCrop({...newCrop, soilTexture: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="SANDY">Sandy</option>
                    <option value="LOAMY">Loamy</option>
                    <option value="CLAY">Clay</option>
                    <option value="SILTY">Silty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('dashboard.soilFertility')}
                  </label>
                  <select
                    value={newCrop.soilFertility}
                    onChange={(e) => setNewCrop({...newCrop, soilFertility: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('onboarding.farmLocation.location')}
                </label>
                <input
                  type="text"
                  value={newCrop.location}
                  onChange={(e) => setNewCrop({...newCrop, location: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  placeholder={t('onboarding.farmLocation.enterLocation')}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCrop(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors touch-target"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors touch-target"
                >
                  {t('common.add')}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {crops.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t('cropTracking.noCrops')}</p>
            <button 
              onClick={() => setShowAddCrop(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg touch-target"
            >
              {t('cropTracking.addCrop')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {!selectedCrop ? (
              // Crop List View
              crops.map((crop) => (
                <div 
                  key={crop.id} 
                  className="glass-card rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{crop.cropType}</h3>
                      <p className="text-green-600 font-medium">{crop.variety}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">
                        {new Date(crop.sowingDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-500">{crop.farmSize} {t('common.acres')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{crop.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-600">
                        {crop.growthRecords.filter(r => r.isVerified).length} {t('common.of')} {crop.growthRecords.length} {t('cropTracking.growthStages')} {t('common.completed')}
                      </span>
                    </div>
                    <button className="text-green-600 font-medium text-sm touch-target">
                      {t('cropTracking.viewDetails')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Crop Detail View
              <div className="space-y-6">
                <div className="glass-card rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selectedCrop.cropType}</h2>
                      <p className="text-green-600 font-medium">{selectedCrop.variety}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedCrop(null)}
                      className="text-gray-500 hover:text-gray-700 touch-target"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-600">{t('cropTracking.sowingDate')}</p>
                      <p className="font-medium">{new Date(selectedCrop.sowingDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-600">{t('cropTracking.farmSize')}</p>
                      <p className="font-medium">{selectedCrop.farmSize} {t('common.acres')}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-600">{t('dashboard.soilPH')}</p>
                      <p className="font-medium">{selectedCrop.soilPH}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-600">{t('onboarding.farmLocation.location')}</p>
                      <p className="font-medium">{selectedCrop.location}</p>
                    </div>
                  </div>
                </div>

                {/* Growth Stages */}
                <div className="glass-card rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Sprout className="w-5 h-5 text-green-600 mr-2" />
                    {t('cropTracking.growthStages')}
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedCrop.growthRecords.map((record, index) => (
                      <div 
                        key={record.id} 
                        className={`p-3 rounded-lg border ${
                          record.isVerified 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            {record.isVerified ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            )}
                            <span className="font-medium">{record.stage}</span>
                          </div>
                          <span className="text-sm text-slate-500">
                            {new Date(record.stageDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {record.notes && (
                          <p className="text-sm text-slate-600 mb-2">{record.notes}</p>
                        )}
                        
                        {!record.isVerified && (
                          <div className="flex space-x-2 mt-2">
                            <label className="flex-1 bg-blue-100 text-blue-800 py-2 px-3 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors flex items-center justify-center touch-target">
                              <Camera className="w-4 h-4 mr-1" />
                              {t('cropTracking.photos')}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePhotoUpload(e, record.stage)}
                              />
                            </label>
                            <button
                              onClick={() => completeStage(record.id)}
                              className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors touch-target"
                            >
                              {t('common.complete')}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                <div className="glass-card rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Camera className="w-5 h-5 text-green-600 mr-2" />
                    {t('cropTracking.photos')}
                  </h3>
                  
                  {selectedCrop.photos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedCrop.photos.map((photo) => (
                        <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={photo.url} 
                            alt={photo.caption} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">{t('cropTracking.noPhotos')}</p>
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="glass-card rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Leaf className="w-5 h-5 text-green-600 mr-2" />
                    {t('aiAnalysis.title')}
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">{t('aiAnalysis.healthScore')}</span>
                      <span className="text-2xl font-bold text-green-600">85/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: '85%' }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-slate-600">{t('aiAnalysis.leafColor')}</p>
                        <p className="font-medium text-green-700">{t('aiAnalysis.healthy')}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-slate-600">{t('aiAnalysis.growth')}</p>
                        <p className="font-medium text-blue-700">65%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Report */}
                <div className="glass-card rounded-xl p-4 shadow-sm">
                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 touch-target">
                    <FileText className="w-5 h-5" />
                    <span>{t('cropReports.generateReport')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">{t('navigation.home')}</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Target className="w-6 h-6" />
            <span className="text-xs">{t('navigation.missions')}</span>
          </Link>
          <Link href="/crop-tracking" className="flex flex-col items-center py-2 text-green-600 touch-target">
            <Sprout className="w-6 h-6" />
            <span className="text-xs font-medium">{t('navigation.crops')}</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Users className="w-6 h-6" />
            <span className="text-xs">{t('navigation.community')}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}