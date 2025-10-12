'use client'

import { useState, useCallback } from 'react';
import api from '../services/api';

export const useStorage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/storage/files');
      console.log('Files API Raw Response:', response);
      
      let filesData = [];
      if (response.data && Array.isArray(response.data)) {
        filesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        filesData = response.data.data;
      } else if (response.data && response.data.files && Array.isArray(response.data.files)) {
        filesData = response.data.files;
      }
      
      setFiles(filesData);
      return response.data;
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des fichiers');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (imageFile, additionalData = {}) => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Add any additional data to the form
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await api.post('/storage/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });
      
      // Refresh files list after successful upload
      await fetchFiles();
      return response.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Une erreur est survenue lors du téléchargement de l\'image');
      return null;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [fetchFiles]);

  const uploadVideo = useCallback(async (videoFile, additionalData = {}) => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      
      // Add any additional data to the form
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await api.post('/storage/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });
      
      // Refresh files list after successful upload
      await fetchFiles();
      return response.data;
    } catch (err) {
      console.error('Error uploading video:', err);
      setError(err.message || 'Une erreur est survenue lors du téléchargement de la vidéo');
      return null;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [fetchFiles]);

  const getStreamUrl = useCallback(async (id) => {
    setError(null);
    try {
      const response = await api.get(`/storage/stream/${id}`);
      console.log('Stream URL response:', response);
      return response.data;
    } catch (err) {
      console.error(`Error fetching stream URL for id ${id}:`, err);
      setError(err.message || `Une erreur est survenue lors de la récupération du lien de streaming pour l'ID ${id}`);
      return null;
    }
  }, []);

  const getStreamUrlWithFilename = useCallback(async (id, filename) => {
    setError(null);
    try {
      const response = await api.get(`/storage/stream/${id}/${filename}`);
      console.log('Stream URL with filename response:', response);
      return response.data;
    } catch (err) {
      console.error(`Error fetching stream URL for id ${id} and filename ${filename}:`, err);
      setError(err.message || `Une erreur est survenue lors de la récupération du lien de streaming`);
      return null;
    }
  }, []);

  const deleteFile = useCallback(async (filename) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/storage/files/${filename}`);
      // Refresh files list after successful deletion
      await fetchFiles();
      return response.data;
    } catch (err) {
      console.error(`Error deleting file ${filename}:`, err);
      setError(err.message || `Une erreur est survenue lors de la suppression du fichier ${filename}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFiles]);

  const getAllFiles = useCallback(async () => {
    try {
      const response = await fetchFiles();
      return response?.files || response;
    } catch (err) {
      console.error('Error in getAllFiles:', err);
      return null;
    }
  }, [fetchFiles]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getStreamLink = useCallback(async (objectName) => {
    setError(null);
    try {
      const response = await api.get(`/stream/${objectName}/manifest`);
      console.log('Stream link response:', response);
      return response.data;
    } catch (err) {
      console.error(`Error fetching stream link for objectName ${objectName}:`, err);
      setError(err.message || `Une erreur est survenue lors de la récupération du lien de streaming pour ${objectName}`);
      return null;
    }
  }, []);

  return {
    files,
    loading,
    uploadProgress,
    error,
    fetchFiles,
    uploadImage,
    uploadVideo,
    getStreamUrl,
    getStreamUrlWithFilename,
    deleteFile,
    getAllFiles,
    clearError,
    getStreamLink,
  };
};