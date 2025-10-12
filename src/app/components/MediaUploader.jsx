"use client";

import { useState, useRef } from 'react';
import StorageService from '../services/storage';

const MediaUploader = ({ onUploadComplete, mediaType = 'image' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const allowedTypes = {
    image: 'image/*',
    video: 'video/mp4,video/webm,video/ogg'
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate progress for better UX
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Call the appropriate upload method based on mediaType
      let result;
      if (mediaType === 'image') {
        result = await StorageService.uploadImage(file);
      } else if (mediaType === 'video') {
        result = await StorageService.uploadVideo(file);
      }

      // Clear the interval and set progress to 100%
      clearInterval(interval);
      setUploadProgress(100);

      // Reset the file input
      fileInputRef.current.value = '';

      // Callback with upload result
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000); // Keep progress at 100% briefly for UX
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="media-upload" className="block text-sm font-medium text-gray-700 mb-2">
          {mediaType === 'image' ? 'Upload Image' : 'Upload Video'}
        </label>
        <div className="mt-1 flex items-center">
          <input
            ref={fileInputRef}
            type="file"
            id="media-upload"
            accept={allowedTypes[mediaType]}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUploading}
          />
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="ml-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}%</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
