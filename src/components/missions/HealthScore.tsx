import React from 'react';
import { Leaf, AlertTriangle, CheckCircle } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  notes?: string;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

const HealthScore: React.FC<HealthScoreProps> = ({ 
  score, 
  notes, 
  onAnalyze, 
  isAnalyzing = false 
}) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = () => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreIcon = () => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className={`rounded-xl border p-4 ${getScoreBg()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-slate-800">Plant Health Analysis</h3>
        </div>
        {getScoreIcon()}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">Health Score</span>
          <span className={`text-lg font-bold ${getScoreColor()}`}>{score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              score >= 80 ? 'bg-green-500' : 
              score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {notes && (
        <div className="mb-4">
          <p className="text-sm text-slate-700">{notes}</p>
        </div>
      )}

      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAnalyzing ? 'Analyzing...' : 'Re-analyze Photos'}
      </button>
    </div>
  );
};

export default HealthScore;