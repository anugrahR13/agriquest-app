'use client';

import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface SuggestionsProps {
  recommendations: string[];
}

export default function Suggestions({ recommendations }: SuggestionsProps) {
  const getRecommendationIcon = (index: number) => {
    if (index < 2) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (index < 4) return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-slate-800 text-lg">AI Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5">
                {getRecommendationIcon(index)}
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}