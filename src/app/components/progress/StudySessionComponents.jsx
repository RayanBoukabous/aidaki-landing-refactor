'use client'

import React, { useState, useEffect } from 'react';
import { useLessonStudySession } from '../../hooks/useStudySession';

/**
 * Study Session Status Bar
 * Shows current session information and controls
 */
export const StudySessionStatus = ({ 
  lessonId, 
  sessionType = 'lesson',
  showControls = true,
  className = '' 
}) => {
  const studySession = useLessonStudySession(lessonId, {
    sessionType,
    onError: (error) => {
      console.error('Study session error:', error);
    }
  });

  const {
    isTracking,
    sessionData,
    sessionDuration,
    isPaused,
    isActive,
    loading,
    error,
    startSession,
    endSession,
    updateActivity
  } = studySession;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    if (error) return 'text-red-600';
    if (!isTracking) return 'text-gray-500';
    if (isPaused || !isActive) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusText = () => {
    if (loading) return 'Loading...';
    if (error) return 'Error';
    if (!isTracking) return 'Not Tracking';
    if (isPaused) return 'Paused';
    if (!isActive) return 'Idle';
    return 'Studying';
  };

  if (error && !showControls) {
    return null; // Hide completely if there's an error and no controls
  }

  return (
    <div className={`flex items-center space-x-3 p-2 bg-gray-50 rounded-lg border ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isTracking && isActive && !isPaused
              ? 'bg-green-500 animate-pulse'
              : isTracking && (isPaused || !isActive)
              ? 'bg-yellow-500'
              : loading
              ? 'bg-blue-500 animate-pulse'
              : error
              ? 'bg-red-500'
              : 'bg-gray-400'
          }`}
        />
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Duration */}
      {isTracking && (
        <div className="text-sm text-gray-600">
          {formatDuration(sessionDuration)}
        </div>
      )}

      {/* Session Info */}
      {sessionData && (
        <div className="text-xs text-gray-500">
          {lessonId && `Lesson ${lessonId} • `}
          {sessionType}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-600 max-w-xs truncate">
          {error}
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="flex space-x-1 ml-auto">
          {!isTracking ? (
            <button
              onClick={() => startSession(lessonId, sessionType)}
              disabled={loading}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Starting...' : 'Start Tracking'}
            </button>
          ) : (
            <button
              onClick={endSession}
              disabled={loading}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Ending...' : 'Stop Tracking'}
            </button>
          )}
          
          {isTracking && (
            <button
              onClick={() => updateActivity({ manualTrigger: true })}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              title="Mark as active"
            >
              Active
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Compact Study Session Widget for Navigation
 */
export const StudySessionWidget = ({ className = '' }) => {
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    // Check for any active session in localStorage
    const storedSession = localStorage.getItem('current_session');
    if (storedSession) {
      try {
        setCurrentSession(JSON.parse(storedSession));
      } catch (error) {
        console.error('Error parsing stored session:', error);
      }
    }

    // Listen for session changes
    const handleStorageChange = (e) => {
      if (e.key === 'current_session') {
        if (e.newValue) {
          try {
            setCurrentSession(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing session from storage event:', error);
          }
        } else {
          setCurrentSession(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!currentSession) return null;

  const elapsed = Math.floor((Date.now() - new Date(currentSession.startTime).getTime()) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full text-sm ${className}`}>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="font-medium text-blue-800">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

/**
 * Study Session Progress Card
 */
export const StudySessionProgress = ({ 
  lessonId, 
  title, 
  sessionType = 'lesson',
  showDetailedStats = false 
}) => {
  const studySession = useLessonStudySession(lessonId, {
    sessionType,
    autoStart: false, // Don't auto-start from progress card
  });

  const {
    isTracking,
    sessionDuration,
    isPaused,
    isActive,
    error,
    getSessionStats
  } = studySession;

  const stats = getSessionStats();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{title || `Lesson ${lessonId}`}</h3>
        <StudySessionStatus 
          lessonId={lessonId} 
          sessionType={sessionType}
          showControls={false}
          className="border-0 bg-transparent p-0"
        />
      </div>

      {/* Current Session Info */}
      {isTracking && (
        <div className="mb-3 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Current Session</span>
            <span className="text-sm font-medium text-blue-900">
              {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          {(isPaused || !isActive) && (
            <div className="text-xs text-yellow-700 mt-1">
              {isPaused ? 'Session paused' : 'User idle'}
            </div>
          )}
        </div>
      )}

      {/* Session Statistics */}
      {showDetailedStats && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Study Time:</span>
            <span className="font-medium">{Math.floor(stats.totalStudyTime / 60)} minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Today's Study Time:</span>
            <span className="font-medium">{Math.floor(stats.todaysStudyTime / 60)} minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Sessions:</span>
            <span className="font-medium">{stats.totalSessions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Average Session:</span>
            <span className="font-medium">{Math.floor(stats.averageSessionLength / 60)} minutes</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <strong>Tracking Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

/**
 * Lesson Page Integration Component
 */
export const LessonStudyTracker = ({ 
  lessonId, 
  title,
  onVideoProgress,
  onInteraction,
  children 
}) => {
  const studySession = useLessonStudySession(lessonId, {
    autoStart: true,
    autoEnd: true,
    onActivityChange: (event) => {
      console.log('Activity changed:', event);
    },
    onError: (error) => {
      console.error('Study session error:', error);
    }
  });

  const { updateActivity, isTracking, sessionDuration } = studySession;

  // Handle video progress updates
  const handleVideoProgress = (progress) => {
    updateActivity({ 
      videoProgress: progress,
      interaction: 'video_progress'
    });
    onVideoProgress?.(progress);
  };

  // Handle general interactions
  const handleInteraction = (interactionType, data = {}) => {
    updateActivity({ 
      interaction: interactionType,
      ...data
    });
    onInteraction?.(interactionType, data);
  };

  // Track when lesson content is clicked/interacted with
  const handleContentInteraction = (e) => {
    // Only track meaningful interactions
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'INPUT') {
      handleInteraction('content_interaction', {
        element: e.target.tagName.toLowerCase(),
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Study Session Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <StudySessionStatus 
              lessonId={lessonId}
              className="border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div 
        className="max-w-6xl mx-auto px-4 py-6"
        onClick={handleContentInteraction}
      >
        {/* Progress Card */}
        <div className="mb-6">
          <StudySessionProgress 
            lessonId={lessonId}
            title={title}
            showDetailedStats={true}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {children}
        </div>

        {/* Interaction Helpers */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => handleInteraction('note_taken')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📝 Take Note
          </button>
          <button
            onClick={() => handleInteraction('bookmark')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔖 Bookmark
          </button>
          <button
            onClick={() => handleVideoProgress(Math.random() * 100)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🎥 Simulate Video Progress
          </button>
        </div>

        {/* Debug Info in Development */}
        {process.env.NODE_ENV === 'development' && isTracking && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <details>
              <summary className="cursor-pointer font-medium text-gray-700">
                🐛 Debug Info (Development Only)
              </summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify({
                  isTracking,
                  sessionDuration,
                  lessonId,
                  sessionData: studySession.sessionData,
                  isActive: studySession.isActive,
                  isPaused: studySession.isPaused,
                  ...(studySession._debug || {})
                }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySessionStatus;