import React, { useState } from 'react';
import { PhotoIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';
import uploadImageToCloudinary from '../../utils/cloudinaryUpload';

const ImageUploader = ({ initialImage = '', onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const [uploading, setUploading] = useState(false);
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Upload to Cloudinary
    try {
      setUploading(true);
      const result = await uploadImageToCloudinary(file, 'course_images');
      
      if (result.success) {
        onImageUpload(result.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(`Upload failed: ${result.error}`);
        // Reset preview if upload failed
        setPreviewUrl(initialImage);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      // Reset preview
      setPreviewUrl(initialImage);
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
  };
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-center w-full">
        {previewUrl ? (
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-3">
                <label 
                  htmlFor="image-upload"
                  className="p-2 bg-white rounded-full cursor-pointer hover:bg-blue-50"
                >
                  <ArrowUpTrayIcon className="h-5 w-5 text-blue-600" />
                  <input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={uploading}
                  />
                </label>
                <button 
                  onClick={handleRemoveImage}
                  className="p-2 bg-white rounded-full hover:bg-red-50"
                  disabled={uploading}
                >
                  <XMarkIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
            </div>
            <input 
              id="image-upload" 
              type="file" 
              className="hidden" 
              onChange={handleImageChange}
              accept="image/*"
              disabled={uploading}
            />
            {uploading && (
              <div className="mt-2 flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;