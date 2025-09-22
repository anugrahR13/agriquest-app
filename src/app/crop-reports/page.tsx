'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Printer,
  BarChart3,
  Leaf,
  Calendar,
  MapPin,
  TrendingUp,
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface CropReport {
  id: string;
  cropType: string;
  variety: string;
  season: string;
  farmSize: number;
  location: string;
  growthTimeline: GrowthPoint[];
  healthScore: number;
  predictedYield: {
    min: number;
    max: number;
    unit: string;
  };
  sustainabilityScore: number;
  recommendations: string[];
  photos: Photo[];
  generatedAt: string;
}

interface GrowthPoint {
  date: string;
  stage: string;
  healthScore: number;
  notes: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  stage: string;
}

const COLORS = ['#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0'];

export default function CropReportsPage() {
  const [reports, setReports] = useState<CropReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CropReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockReports: CropReport[] = [
    {
      id: '1',
      cropType: 'WHEAT',
      variety: 'HD 2967',
      season: 'RABI 2023-24',
      farmSize: 5.5,
      location: 'Mehsana, Gujarat',
      healthScore: 85,
      predictedYield: {
        min: 18,
        max: 22,
        unit: 'quintals'
      },
      sustainabilityScore: 78,
      generatedAt: '2023-12-15T10:30:00Z',
      growthTimeline: [
        { date: '2023-10-15', stage: 'Sowing', healthScore: 70, notes: 'Initial sowing completed' },
        { date: '2023-10-25', stage: 'Sprouting', healthScore: 75, notes: 'Good germination observed' },
        { date: '2023-11-10', stage: 'Tillering', healthScore: 80, notes: 'Healthy tillering' },
        { date: '2023-12-01', stage: 'Flowering', healthScore: 85, notes: 'Flowering stage reached' },
        { date: '2023-12-15', stage: 'Grain Filling', healthScore: 85, notes: 'Current stage' }
      ],
      recommendations: [
        'Continue with current watering schedule',
        'Apply nitrogen fertilizer in 10 days',
        'Monitor for pest activity',
        'Consider pruning lower leaves'
      ],
      photos: [
        { id: '1', url: '/images/crop1.jpg', caption: 'After sowing', stage: 'Sowing' },
        { id: '2', url: '/images/crop2.jpg', caption: 'Sprouting stage', stage: 'Sprouting' },
        { id: '3', url: '/images/crop3.jpg', caption: 'Tillering stage', stage: 'Tillering' },
        { id: '4', url: '/images/crop4.jpg', caption: 'Flowering stage', stage: 'Flowering' }
      ]
    }
  ];

  const healthData = [
    { name: 'Sowing', value: 70 },
    { name: 'Sprouting', value: 75 },
    { name: 'Tillering', value: 80 },
    { name: 'Flowering', value: 85 },
    { name: 'Grain Filling', value: 85 }
  ];

  const sustainabilityData = [
    { name: 'Water Usage', value: 85 },
    { name: 'Soil Health', value: 75 },
    { name: 'Pest Control', value: 90 },
    { name: 'Fertilizer Use', value: 70 },
    { name: 'Biodiversity', value: 80 }
  ];

  const handleDownload = () => {
    // In a real app, this would download the PDF report
    alert('Report downloaded successfully!');
  };

  const handleShare = () => {
    // In a real app, this would share the report
    alert('Report shared successfully!');
  };

  const handlePrint = () => {
    // In a real app, this would print the report
    alert('Report sent to printer!');
  };

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
              <h1 className="text-xl font-bold">Crop Reports</h1>
              <p className="text-sm opacity-90">Credit reports and analytics</p>
            </div>
          </div>
          <FileText className="w-6 h-6" />
        </div>
      </header>

      <main className="p-4">
        {!selectedReport ? (
          // Report List View
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Your Crop Reports</h2>
                  <p className="text-slate-600">Detailed analytics and credit reports for your crops</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                  Generate New Report
                </button>
              </div>
              
              {mockReports.length > 0 ? (
                <div className="space-y-4">
                  {mockReports.map((report) => (
                    <div 
                      key={report.id}
                      className="glass-card p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">
                            {report.cropType} ({report.variety})
                          </h3>
                          <p className="text-sm text-slate-600">{report.season}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">{report.farmSize} acres</p>
                          <p className="text-xs text-slate-500">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            Health: <span className="font-medium">{report.healthScore}/100</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">
                            Yield: {report.predictedYield.min}-{report.predictedYield.max} {report.predictedYield.unit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{report.location}</span>
                        </div>
                        <button className="text-green-600 font-medium text-sm touch-target">
                          View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No crop reports generated yet</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg touch-target">
                    Generate First Report
                  </button>
                </div>
              )}
            </div>
            
            {/* Info Section */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">About Crop Reports</h3>
              
              <div className="space-y-4 text-sm text-slate-600">
                <p>
                  Crop reports provide detailed analysis of your farm's health and performance. 
                  These reports are essential for government auction applications and help determine fair pricing for your crops.
                </p>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Benefits of Crop Reports
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>AI-powered crop health assessment (0-100 score)</li>
                    <li>Predicted yield estimates</li>
                    <li>Sustainability metrics</li>
                    <li>Personalized recommendations for improvement</li>
                    <li>Required for government auction applications</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
                    How to Generate Reports
                  </h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Upload photos of your crops at different growth stages</li>
                    <li>Our AI analyzes the images for health indicators</li>
                    <li>Review the generated report and recommendations</li>
                    <li>Use the report for auction applications or personal reference</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Report Detail View
          <div className="space-y-6">
            {/* Report Header */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedReport.cropType} Crop Credit Report
                  </h2>
                  <p className="text-slate-600">{selectedReport.season}</p>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 touch-target"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">Farm Size</p>
                  <p className="font-medium">{selectedReport.farmSize} acres</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">Location</p>
                  <p className="font-medium">{selectedReport.location}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">Generated On</p>
                  <p className="font-medium">{new Date(selectedReport.generatedAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">Variety</p>
                  <p className="font-medium">{selectedReport.variety}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors touch-target"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors touch-target"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors touch-target"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <Link
                  href="/auction/apply"
                  className="flex items-center space-x-2 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors touch-target"
                >
                  <FileText className="w-4 h-4" />
                  <span>Apply for Auction</span>
                </Link>
              </div>
            </div>
            
            {/* Health Score */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Leaf className="w-5 h-5 text-green-600 mr-2" />
                Crop Health Score
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-green-600">{selectedReport.healthScore}</span>
                  <span className="text-slate-500">/100</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Sustainability Score</p>
                  <p className="text-xl font-bold text-blue-600">{selectedReport.sustainabilityScore}/100</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full" 
                  style={{ width: `${selectedReport.healthScore}%` }}
                ></div>
              </div>
              
              <p className="text-slate-600 text-sm">
                Your crop health score is based on AI analysis of growth patterns, color variations, and potential disease indicators.
                A higher score indicates better crop health and potential yield.
              </p>
            </div>
            
            {/* Growth Timeline */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                Growth Timeline
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedReport.growthTimeline}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="stage" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[60, 100]} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="healthScore" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#059669' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Sustainability Breakdown */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Sustainability Breakdown
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sustainabilityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                    >
                      {sustainabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Predicted Yield */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                Predicted Yield
              </h3>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                <p className="text-sm text-slate-600 mb-2">Estimated Yield Range</p>
                <p className="text-3xl font-bold text-green-600">
                  {selectedReport.predictedYield.min} - {selectedReport.predictedYield.max} {selectedReport.predictedYield.unit}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Based on current growth patterns and environmental conditions
                </p>
              </div>
            </div>
            
            {/* Photos */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Eye className="w-5 h-5 text-green-600 mr-2" />
                Growth Photos
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedReport.photos.map((photo) => (
                  <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                    <p className="text-xs text-center mt-1 text-slate-600">{photo.stage}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recommendations</h3>
              
              <div className="space-y-3">
                {selectedReport.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-slate-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <CheckCircle className="w-6 h-6" />
            <span className="text-xs">Missions</span>
          </Link>
          <Link href="/crop-tracking" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Crops</span>
          </Link>
          <Link href="/crop-reports" className="flex flex-col items-center py-2 text-green-600 touch-target">
            <FileText className="w-6 h-6" />
            <span className="text-xs font-medium">Reports</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}