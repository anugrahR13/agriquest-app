'use client';

import { Star, MapPin, Sprout } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  healthScore: number;
  farmerName: string;
  farmLocation: string;
  cropType: string;
}

export default function ScoreCard({
  score,
  healthScore,
  farmerName,
  farmLocation,
  cropType
}: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-blue-100 text-blue-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 text-lg">{farmerName}</h3>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getScoreBgColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
        
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
            <span className="text-2xl text-gray-500">/10</span>
          </div>
          <p className="text-gray-500 mt-2">{getScoreLabel(score)} {cropType} Crop</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1 text-gray-600">
                <Sprout className="h-4 w-4" />
                Health Score
              </span>
              <span className="font-medium">{healthScore.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{farmLocation}</span>
          </div>

          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.round(score / 2)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}