"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StorageService from '../services/storage';

const MediaList = ({ onSelect, mediaType = 'all' }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const allFiles = await StorageService.listFiles();
      
      // Filter files based on mediaType if needed
      let filteredFiles = allFiles;
      if (mediaType !== 'all') {
        filteredFiles = allFiles.filter(file => {
          if (mediaType === 'image') {
            return file.type.startsWith('image/');
          } else if (mediaType === 'video') {
            return file.type.startsWith('video/');
          }
          return true;
        });
      }
      
      setFiles(filteredFiles);
    } catch (err) {
      setError('Failed to load files. Please try again.');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [mediaType]);

  const handleDelete = async (name) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await StorageService.deleteFile(name);
      // Refresh the file list
      fetchFiles();
    } catch (err) {
      setError('Failed to delete file. Please try again.');
      console.error('Error deleting file:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="flex justify-center items-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (files.length === 0) {
    return <div className="text-gray-500 text-center py-6">
      No {mediaType !== 'all' ? mediaType : 'media'} files found.
    </div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => {
          const isVideo = file.type.startsWith('video/');
          const isImage = file.type.startsWith('image/');

          return (
            <div key={file.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {isImage && (
                  <div className="relative w-full h-full">
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                {isVideo && (
                  <Link href={`/dashboard/player/${file.id}`} className="block w-full h-full">
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="bg-blue-500 text-white p-3 rounded-full opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold truncate">{file.name}</h3>
                  <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Uploaded: {formatDate(file.createdAt)}</p>
                <div className="mt-4 flex justify-between">
                  {onSelect ? (
                    <button 
                      onClick={() => onSelect(file)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Select
                    </button>
                  ) : (
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      View
                    </a>
                  )}
                  <button 
                    onClick={() => handleDelete(file.name)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaList;
