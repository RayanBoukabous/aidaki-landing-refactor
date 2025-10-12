'use client'

import api from './api';

export const useStorageService = () => {
  const uploadImage = async (imageFile, additionalData = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Add any additional data to the form
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await api.post('/api/storage/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const uploadVideo = async (videoFile, additionalData = {}) => {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      
      // Add any additional data to the form
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await api.post('/api/storage/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  const getStreamUrl = async (id) => {
    try {
      const response = await api.get(`/api/storage/stream/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stream URL for id ${id}:`, error);
      throw error;
    }
  };

  const getStreamUrlWithFilename = async (id, filename) => {
    try {
      const response = await api.get(`/api/storage/stream/${id}/${filename}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stream URL for id ${id} and filename ${filename}:`, error);
      throw error;
    }
  };

  const getAllFiles = async () => {
    try {
      const response = await api.get('/api/storage/files');
      return response.data;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  };

  const deleteFile = async (filename) => {
    try {
      const response = await api.delete(`/api/storage/files/${filename}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
      throw error;
    }
  };

  return {
    uploadImage,
    uploadVideo,
    getStreamUrl,
    getStreamUrlWithFilename,
    getAllFiles,
    deleteFile,
  };
};