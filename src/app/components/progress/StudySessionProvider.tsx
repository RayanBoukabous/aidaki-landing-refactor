'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useStudySession, useActivityTracker } from '../../hooks/useStudySession';
import { useStreaks } from '../../hooks/useStreaks';
import { useProgress } from '../../hooks/useProgress';

/**
 * Study Session Context
 * Global context for managing study sessions across the application
 */
const StudySessionContext = createContext(null);

/**
 * Study Session Provider Component
 * Provides global study session management and progress tracking
 */
export const StudySessionProvider = ({ children }) => {
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Memoize callback functions to prevent infinite re-renders
  const handleSessionStart = useCallback((session) => {
    console.log('Study session started:', session);
    addNotification({
      type: 'info',
      message: 'Study session started! Stay focused!',
      duration: 3000
    });
  }, []);

  const handleSessionEnd = useCallback((session) => {
    console.log('Study session ended:', session);
    if (session?.duration) {
      const minutes = Math.floor(session.duration / 60);
      addNotification({
        type: 'success',
        message: `Great work! You studied for ${minutes} minutes.`,
        duration: 5000
      });
    }
  }, []);

  const handleActivityChange = useCallback((event) => {
    console.log('Global activity change:', event);
  }, []);

  const handleStreakMilestone = useCallback((milestone) => {
    addNotification({
      type: 'achievement',
      message: milestone.message,
      title: milestone.title,
      duration: 8000
    });
  }, []);

  const handleLessonComplete = useCallback((completion, courseProgress) => {
    addNotification({
      type: 'success',
      message: 'Lesson completed! Great job!',
      duration: 5000
    });
  }, []);

  const handleCourseComplete = useCallback((courseProgress, notification) => {
    addNotification({
      type: 'achievement',
      message: notification.message,
      title: notification.title,
      duration: 10000
    });
  }, []);

  const handleProgressMilestone = useCallback((milestone) => {
    addNotification({
      type: 'achievement',
      message: milestone.message,
      title: milestone.title,
      duration: 8000
    });
  }, []);

  // Initialize hooks with memoized callbacks
  const studySessionOptions = useMemo(() => ({
    lessonId: currentLessonId,
    onSessionStart: handleSessionStart,
    onSessionEnd: handleSessionEnd,
    onActivityChange: handleActivityChange
  }), [currentLessonId, handleSessionStart, handleSessionEnd, handleActivityChange]);

  const studySession = useStudySession(studySessionOptions);

  const streaksOptions = useMemo(() => ({
    autoFetch: true,
    onMilestone: handleStreakMilestone
  }), [handleStreakMilestone]);

  const streaks = useStreaks(streaksOptions);

  const progressOptions = useMemo(() => ({
    autoFetch: true,
    onLessonComplete: handleLessonComplete,
    onCourseComplete: handleCourseComplete,
    onMilestone: handleProgressMilestone
  }), [handleLessonComplete, handleCourseComplete, handleProgressMilestone]);

  const progress = useProgress(progressOptions);

  /**
   * Add notification to the queue
   */
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      timestamp: Date.now(),
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, []);

  /**
   * Remove notification
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Start study session for a lesson
   */
  const startLessonSession = useCallback(async (lessonId) => {
    try {
      setCurrentLessonId(lessonId);
      await studySession.startSession(lessonId, 'lesson');
      return true;
    } catch (error) {
      console.error('Error starting session:', error);
      addNotification({
        type: 'error',
        message: 'Failed to start study session',
        duration: 5000
      });
      return false;
    }
  }, [studySession.startSession, addNotification]);

  /**
   * End current study session
   */
  const endCurrentSession = useCallback(async () => {
    try {
      await studySession.endSession();
      setCurrentLessonId(null);
      
      // Refresh data after session ends
      setTimeout(() => {
        streaks.refreshStreakData();
        progress.refreshProgressData();
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      addNotification({
        type: 'error',
        message: 'Failed to end study session',
        duration: 5000
      });
      return false;
    }
  }, [studySession.endSession, streaks.refreshStreakData, progress.refreshProgressData, addNotification]);

  /**
   * Complete current lesson
   */
  const completeCurrentLesson = useCallback(async (completionData = {}) => {
    if (!currentLessonId) {
      throw new Error('No active lesson to complete');
    }

    try {
      // Complete the lesson
      const result = await progress.completeLesson(currentLessonId, completionData);
      
      // End the study session
      await endCurrentSession();
      
      return result;
    } catch (error) {
      console.error('Error completing lesson:', error);
      addNotification({
        type: 'error',
        message: 'Failed to complete lesson',
        duration: 5000
      });
      throw error;
    }
  }, [currentLessonId, progress.completeLesson, endCurrentSession, addNotification]);

  /**
   * Switch to a different lesson
   */
  const switchToLesson = useCallback(async (newLessonId) => {
    try {
      // End current session if exists
      if (studySession.isTracking) {
        await studySession.endSession();
      }
      
      // Start new session
      setCurrentLessonId(newLessonId);
      await studySession.startSession(newLessonId, 'lesson');
      
      return true;
    } catch (error) {
      console.error('Error switching lesson:', error);
      addNotification({
        type: 'error',
        message: 'Failed to switch lesson',
        duration: 5000
      });
      return false;
    }
  }, [studySession.isTracking, studySession.endSession, studySession.startSession, addNotification]);

  /**
   * Get current session summary
   */
  const getSessionSummary = useCallback(() => {
    return {
      isActive: studySession.isTracking,
      lessonId: currentLessonId,
      duration: studySession.sessionDuration,
      isUserActive: studySession.isActive,
      streak: streaks.currentStreak,
      studiedToday: streaks.hasStudiedToday
    };
  }, [
    studySession.isTracking,
    currentLessonId,
    studySession.sessionDuration,
    studySession.isActive,
    streaks.currentStreak,
    streaks.hasStudiedToday
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (studySession.isTracking) {
        studySession.endSession();
      }
    };
  }, [studySession.isTracking, studySession.endSession]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Session management
    startLessonSession,
    endCurrentSession,
    completeCurrentLesson,
    switchToLesson,
    
    // Session state
    isSessionActive: studySession.isTracking,
    currentLessonId,
    sessionDuration: studySession.sessionDuration,
    
    // Activity tracking
    isUserActive: studySession.isActive,
    idleTime: studySession.idleTime,
    
    // Progress data
    streak: streaks.streak,
    currentStreak: streaks.currentStreak,
    hasStudiedToday: streaks.hasStudiedToday,
    overallProgress: progress.overallProgress,
    
    // Notifications
    notifications,
    addNotification,
    removeNotification,
    
    // Utilities
    getSessionSummary,
    
    // Raw hooks (for advanced usage)
    hooks: {
      studySession,
      streaks,
      progress
    }
  }), [
    startLessonSession,
    endCurrentSession,
    completeCurrentLesson,
    switchToLesson,
    studySession.isTracking,
    currentLessonId,
    studySession.sessionDuration,
    studySession.isActive,
    studySession.idleTime,
    streaks.streak,
    streaks.currentStreak,
    streaks.hasStudiedToday,
    progress.overallProgress,
    notifications,
    addNotification,
    removeNotification,
    getSessionSummary,
    studySession,
    streaks,
    progress
  ]);

  return (
    <StudySessionContext.Provider value={contextValue}>
      {children}
    </StudySessionContext.Provider>
  );
};

/**
 * Hook to use Study Session Context
 */
export const useStudySessionContext = () => {
  const context = useContext(StudySessionContext);
  
  if (!context) {
    throw new Error('useStudySessionContext must be used within a StudySessionProvider');
  }
  
  return context;
};

/**
 * Activity Tracker Component
 * Visual component that shows activity status
 */
export const ActivityTracker = React.memo(({ 
  showStatus = true, 
  showIdleWarning = true,
  className = "" 
}) => {
  const { isUserActive, idleTime } = useStudySessionContext();
  
  if (!showStatus) return null;

  const isIdle = idleTime > 120000; // 2 minutes
  const isLongIdle = idleTime > 300000; // 5 minutes

  return (
    <div className={`activity-tracker ${className}`}>
      <div className={`flex items-center gap-2 text-sm ${
        isUserActive ? 'text-green-600' : 'text-yellow-600'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isUserActive ? 'bg-green-500' : 'bg-yellow-500'
        }`} />
        <span>
          {isUserActive ? 'Active' : 'Idle'}
          {isIdle && ` (${Math.floor(idleTime / 60000)}m)`}
        </span>
      </div>
      
      {showIdleWarning && isLongIdle && (
        <div className="mt-1 text-xs text-orange-600">
          Long idle period detected
        </div>
      )}
    </div>
  );
});

ActivityTracker.displayName = 'ActivityTracker';

/**
 * Session Status Component
 * Shows current session information
 */
export const SessionStatus = React.memo(({ 
  showDuration = true,
  showLesson = true,
  className = ""
}) => {
  const { 
    isSessionActive, 
    currentLessonId, 
    sessionDuration 
  } = useStudySessionContext();

  const formatDuration = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  if (!isSessionActive) return null;

  return (
    <div className={`session-status ${className}`}>
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-gray-700">Recording</span>
        </div>
        
        {showDuration && (
          <div className="font-mono text-gray-600">
            {formatDuration(sessionDuration)}
          </div>
        )}
        
        {showLesson && currentLessonId && (
          <div className="text-gray-500">
            Lesson {currentLessonId}
          </div>
        )}
      </div>
    </div>
  );
});

SessionStatus.displayName = 'SessionStatus';

/**
 * Study Session Controls Component
 * Provides controls for session management
 */
export const SessionControls = React.memo(({ 
  onLessonSelect = null,
  showEndButton = true,
  className = ""
}) => {
  const { 
    isSessionActive,
    endCurrentSession,
    startLessonSession
  } = useStudySessionContext();

  const handleEndSession = useCallback(async () => {
    if (window.confirm('Are you sure you want to end your study session?')) {
      await endCurrentSession();
    }
  }, [endCurrentSession]);

  return (
    <div className={`session-controls ${className}`}>
      <div className="flex items-center gap-2">
        {!isSessionActive && onLessonSelect && (
          <button
            onClick={onLessonSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Study Session
          </button>
        )}
        
        {isSessionActive && showEndButton && (
          <button
            onClick={handleEndSession}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
});

SessionControls.displayName = 'SessionControls';

export default StudySessionProvider;
