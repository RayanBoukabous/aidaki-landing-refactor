"use client";

import { useEffect, useRef, useState } from 'react';
import StorageService from '../services/storage';

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) {
      setError('Video ID is required');
      setLoading(false);
      return;
    }

    // Get the streaming URL
    const videoUrl = StorageService.getVideoStreamUrl(videoId);

    // Set up video element
    const video = videoRef.current;
    if (!video) return;

    // Handle loading state and errors
    const handleLoadedData = () => {
      setLoading(false);
    };

    const handleError = () => {
      setError('Failed to load video. Please try again.');
      setLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Set the video source
    video.src = videoUrl;
    video.load();

    // Clean up
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.pause();
      video.src = '';
    };
  }, [videoId]);

  return (
    <div className="max-w-3xl mx-auto">
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}
      
      <video
        ref={videoRef}
        controls
        className="w-full rounded"
        style={{ display: loading ? 'none' : 'block' }}
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
