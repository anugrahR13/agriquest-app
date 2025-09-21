"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Leaf, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import MissionCard from '@/components/missions/MissionCard';
import PhotoUploader from '@/components/missions/PhotoUploader';
import HealthScore from '@/components/missions/HealthScore';
import Image from 'next/image';

interface Mission {
  id: string;
  title: string;
  description: string;
  stageOrder: number;
  isCompleted: boolean;
  photos: Photo[];
  analyses: Analysis[];
}

interface Photo {
  id: string;
  url: string;
  createdAt: string;
}

interface Analysis {
  id: string;
  healthScore: number;
  notes: string;
  createdAt: string;
}

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string;
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from the API
    // fetchMissionDetails();
    
    // Mock data for now
    setTimeout(() => {
      setMission({
        id: missionId,
        title: "First Irrigation",
        description: "Provide first irrigation after sowing to ensure proper germination",
        stageOrder: 2,
        isCompleted: false,
        photos: [
          {
            id: "1",
            url: "/mock/photo1.jpg",
            createdAt: "2023-06-15T10:30:00Z"
          },
          {
            id: "2",
            url: "/mock/photo2.jpg",
            createdAt: "2023-06-15T11:45:00Z"
          }
        ],
        analyses: [
          {
            id: "1",
            healthScore: 85,
            notes: "Plant appears healthy with good growth indicators. Soil moisture level is optimal.",
            createdAt: "2023-06-15T12:00:00Z"
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [missionId]);

  const handleUploadPhotos = (files: File[], location?: { lat: number; lng: number }) => {
    // In a real app, this would upload to the API
    console.log('Uploading photos:', files, location);
    setShowPhotoUploader(false);
    
    // Mock adding new photos
    if (mission) {
      const newPhotos = files.map((file, index) => ({
        id: `${mission.photos.length + index + 1}`,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString()
      }));
      
      setMission({
        ...mission,
        photos: [...mission.photos, ...newPhotos]
      });
    }
  };

  const handleAnalyzePhotos = () => {
    setIsAnalyzing(true);
    
    // Mock analysis
    setTimeout(() => {
      if (mission) {
        const newAnalysis = {
          id: `${mission.analyses.length + 1}`,
          healthScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          notes: "Updated analysis: Plant health is improving. Recommended to maintain current watering schedule.",
          createdAt: new Date().toISOString()
        };
        
        setMission({
          ...mission,
          analyses: [...mission.analyses, newAnalysis]
        });
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCompleteMission = (id: string) => {
    if (mission) {
      setMission({
        ...mission,
        isCompleted: true
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Mission not found</p>
          <Link href="/missions" className="text-green-600 hover:underline mt-2 inline-block">
            Back to missions
          </Link>
        </div>
      </div>
    );
  }

  const latestAnalysis = mission.analyses[mission.analyses.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              <Link href="/missions" className="text-slate-600 hover:text-slate-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="font-bold text-green-800">Mission Details</h1>
                <p className="text-xs text-slate-600">Stage {mission.stageOrder}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Wheat</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {/* Mission Card */}
          <MissionCard
            id={mission.id}
            title={mission.title}
            description={mission.description}
            stageOrder={mission.stageOrder}
            isCompleted={mission.isCompleted}
            photoCount={mission.photos.length}
            healthScore={latestAnalysis?.healthScore}
            onUploadPhotos={() => setShowPhotoUploader(true)}
            onCompleteMission={handleCompleteMission}
          />

          {/* Health Analysis */}
          {latestAnalysis && (
            <HealthScore
              score={latestAnalysis.healthScore}
              notes={latestAnalysis.notes}
              onAnalyze={handleAnalyzePhotos}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* Photo Gallery */}
          {mission.photos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                <span>Growth Photos</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {mission.photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <Image 
                      src={photo.url} 
                      alt="Growth stage" 
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                      {new Date(photo.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Uploader Modal */}
          {showPhotoUploader && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Upload Photos</h3>
                  <button 
                    onClick={() => setShowPhotoUploader(false)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <PhotoUploader 
                    onPhotosUpload={handleUploadPhotos}
                    maxPhotos={4}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-green-600">
            <Leaf className="w-6 h-6" />
            <span className="text-xs font-medium">Missions</span>
          </Link>
          <button 
            onClick={() => setShowPhotoUploader(true)}
            className="flex flex-col items-center py-2 text-slate-400"
          >
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs">Upload</span>
          </button>
          <button 
            onClick={handleAnalyzePhotos}
            disabled={isAnalyzing}
            className="flex flex-col items-center py-2 text-slate-400 disabled:opacity-50"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="text-xs">Analyze</span>
          </button>
        </div>
      </nav>
    </div>
  );
}