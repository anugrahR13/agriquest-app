import React from 'react';
import { Clock, Image, CheckCircle, PlayCircle, Star } from 'lucide-react';

interface MissionCardProps {
  id: string;
  title: string;
  description: string;
  stageOrder: number;
  isCompleted: boolean;
  photoCount: number;
  healthScore?: number;
  onUploadPhotos: (missionId: string) => void;
  onCompleteMission: (missionId: string) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  id,
  title,
  description,
  stageOrder,
  isCompleted,
  photoCount,
  healthScore,
  onUploadPhotos,
  onCompleteMission
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-4">
        {/* Mission Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Stage {stageOrder}
              </span>
              {healthScore && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Health: {healthScore}%
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Mission Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Image className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600">
                {photoCount} photos
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600">
                2 days ago
              </span>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!isCompleted ? (
            <>
              <button
                onClick={() => onUploadPhotos(id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Image className="w-4 h-4" />
                <span>Upload Photos</span>
              </button>
              <button
                onClick={() => onCompleteMission(id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete</span>
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-sm text-green-800">Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;