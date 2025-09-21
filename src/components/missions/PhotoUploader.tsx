import React, { useState, useRef } from 'react';
import { Camera, Upload, X, MapPin } from 'lucide-react';

interface PhotoUploaderProps {
  onPhotosUpload: (files: File[], location?: { lat: number; lng: number }) => void;
  maxPhotos?: number;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  onPhotosUpload, 
  maxPhotos = 4 
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalPhotos = photos.length + newFiles.length;

    if (totalPhotos > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    setPhotos(prev => [...prev, ...newFiles]);
    
    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (photos.length === 0) {
      alert('Please select at least one photo');
      return;
    }
    
    onPhotosUpload(photos, location || undefined);
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsGettingLocation(false);
      },
      (error) => {
        alert('Unable to get your location');
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-slate-800 mb-4">Upload Growth Photos</h3>
      
      {/* Location Section */}
      <div className="mb-4">
        <button
          onClick={getLocation}
          disabled={isGettingLocation}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          <MapPin className="w-4 h-4" />
          <span>
            {isGettingLocation 
              ? 'Getting location...' 
              : location 
                ? `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                : 'Get Current Location'
            }
          </span>
        </button>
      </div>

      {/* Photo Preview Area */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Click to select photos or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Up to {maxPhotos} photos, max 5MB each
        </p>
      </div>

      {/* Upload Button */}
      <div className="mt-4">
        <button
          onClick={handleUpload}
          disabled={photos.length === 0}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>
    </div>
  );
};

export default PhotoUploader;