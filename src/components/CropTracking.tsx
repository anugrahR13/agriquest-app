import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Crop {
  id: string;
  cropType: string;
  variety: string;
  sowingDate: string;
  growthRecords: GrowthRecord[];
  photos: Photo[];
}

interface GrowthRecord {
  id: string;
  stage: string;
  stageDate: string;
  notes: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
}

const CropTracking: React.FC = () => {
  const { t } = useTranslation();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          growthRecords: [
            {
              id: '1',
              stage: 'SOWING',
              stageDate: '2023-10-15',
              notes: 'Sowing completed successfully'
            },
            {
              id: '2',
              stage: 'SPROUTING',
              stageDate: '2023-10-25',
              notes: 'Good germination observed'
            }
          ],
          photos: [
            {
              id: '1',
              url: '/images/crop1.jpg',
              caption: 'After sowing',
              timestamp: '2023-10-15T10:30:00Z'
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">{t('error')}:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('cropTracking.title')}</h2>
      
      {crops.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('cropTracking.noCrops')}</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {t('cropTracking.addCrop')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {crops.map((crop) => (
            <div key={crop.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{crop.cropType}</h3>
                  <p className="text-gray-600">{crop.variety}</p>
                  <p className="text-sm text-gray-500">
                    {t('cropTracking.sowingDate')}: {new Date(crop.sowingDate).toLocaleDateString()}
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
                  {t('cropTracking.viewDetails')}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">{t('cropTracking.growthStages')}</h4>
                  <div className="space-y-2">
                    {crop.growthRecords.map((record) => (
                      <div key={record.id} className="flex items-center p-2 bg-gray-50 rounded">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">{record.stage}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(record.stageDate).toLocaleDateString()} - {record.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">{t('cropTracking.photos')}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {crop.photos.map((photo) => (
                      <div key={photo.id} className="aspect-square overflow-hidden rounded">
                        <img 
                          src={photo.url} 
                          alt={photo.caption} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropTracking;