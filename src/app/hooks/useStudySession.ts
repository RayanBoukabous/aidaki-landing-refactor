'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { studyTimeService } from '../services/studyTime';

/**
 * Activity Tracker Hook
 * Tracks user activity and idle time
 */
export const useActivityTracker = (options = {}) => {
  const {
    idleThreshold = 120000, // 2 minutes default
    onActivityChange = null
  } = options;

  const [isActive, setIsActive] = useState(true);
  const [idleTime, setIdleTime] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const intervalRef = useRef(null);

  // Memoize the activity change handler to prevent infinite re-renders
  const handleActivityChange = useCallback((newIsActive) => {
    if (newIsActive !== isActive) {
      setIsActive(newIsActive);
      if (onActivityChange) {
        onActivityChange({ isActive: newIsActive, idleTime });
      }
    }
  }, [isActive, idleTime, onActivityChange]);

  // Memoize activity events to prevent recreating listeners
  const activityEvents = useMemo(() => [
    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
  ], []);

  // Activity detector
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIdleTime(0);
    if (!isActive) {
      handleActivityChange(true);
    }
  }, [isActive, handleActivityChange]);

  // Setup activity listeners
  useEffect(() => {
    const handleActivity = () => resetActivity();

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetActivity, activityEvents]);

  // Setup idle timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      setIdleTime(timeSinceLastActivity);
      
      if (timeSinceLastActivity > idleThreshold && isActive) {
        handleActivityChange(false);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [idleThreshold, isActive, handleActivityChange]);

  return useMemo(() => ({
    isActive,
    idleTime,
    resetActivity,
    onActivityChange: handleActivityChange
  }), [isActive, idleTime, resetActivity, handleActivityChange]);
};

/**
 * Enhanced Study Session Hook with Backend Integration
 * Manages study sessions with proper API integration and request throttling
 */
export const useStudySession = (options = {}) => {
  const {
    lessonId = null,
    sessionType = 'lesson',
    autoStart = false,
    autoEnd = true,
    heartbeatInterval = 45000, // 45 seconds
    onSessionStart = null,
    onSessionEnd = null,
    onActivityChange = null,
    onError = null
  } = options;

  const [state, setState] = useState({
    isTracking: false,
    sessionData: null,
    sessionDuration: 0,
    isPaused: false,
    error: null,
    loading: false
  });

  // Refs for session management
  const sessionStartRef = useRef(null);
  const intervalRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const pauseTimeRef = useRef(0);
  const lastHeartbeatRef = useRef(0);
  
  // Request throttling
  const heartbeatQueueRef = useRef(new Map());
  const isProcessingHeartbeatsRef = useRef(false);

  // Memoize callbacks to prevent infinite re-renders
  const memoizedOnSessionStart = useCallback((session) => {
    if (onSessionStart) {
      onSessionStart(session);
    }
  }, [onSessionStart]);

  const memoizedOnSessionEnd = useCallback((session) => {
    if (onSessionEnd) {
      onSessionEnd(session);
    }
  }, [onSessionEnd]);

  const memoizedOnActivityChange = useCallback((event) => {
    if (onActivityChange) {
      onActivityChange(event);
    }
  }, [onActivityChange]);

  const memoizedOnError = useCallback((error) => {
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Activity tracker with memoized options
  const activityOptions = useMemo(() => ({
    idleThreshold: 120000,
    onActivityChange: memoizedOnActivityChange
  }), [memoizedOnActivityChange]);

  const activityTracker = useActivityTracker(activityOptions);

  /**
   * Process heartbeat queue to prevent spam requests
   */
  const processHeartbeatQueue = useCallback(async () => {
    if (isProcessingHeartbeatsRef.current || heartbeatQueueRef.current.size === 0) {
      return;
    }

    isProcessingHeartbeatsRef.current = true;

    try {
      // Wait a bit to collect multiple heartbeats
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get all queued heartbeats and clear the queue
      const heartbeats = Array.from(heartbeatQueueRef.current.values());
      heartbeatQueueRef.current.clear();

      // Process only the most recent heartbeat for each session
      const latestHeartbeats = new Map();
      heartbeats.forEach(heartbeat => {
        const existing = latestHeartbeats.get(heartbeat.sessionId);
        if (!existing || heartbeat.timestamp > existing.timestamp) {
          latestHeartbeats.set(heartbeat.sessionId, heartbeat);
        }
      });

      // Send heartbeats (one at a time to avoid overwhelming server)
      for (const heartbeat of latestHeartbeats.values()) {
        try {
          await studyTimeService.sendHeartbeat(heartbeat);
          lastHeartbeatRef.current = Date.now();
        } catch (error) {
          console.error('Heartbeat failed:', error);
          // Don't throw error to avoid disrupting other heartbeats
        }
      }
    } finally {
      isProcessingHeartbeatsRef.current = false;
    }
  }, []);

  /**
   * Queue heartbeat with throttling
   */
  const queueHeartbeat = useCallback((heartbeatData) => {
    const now = Date.now();
    
    // Don't send heartbeats too frequently (minimum 30 seconds)
    if (now - lastHeartbeatRef.current < 30000) {
      return;
    }

    // Add to queue
    heartbeatQueueRef.current.set(heartbeatData.sessionId, heartbeatData);
    
    // Process queue if not already processing
    if (!isProcessingHeartbeatsRef.current) {
      processHeartbeatQueue();
    }
  }, [processHeartbeatQueue]);

  /**
   * Send heartbeat to server
   */
  const sendHeartbeat = useCallback(() => {
    if (!state.sessionData || !state.isTracking) return;

    const heartbeatData = {
      sessionId: state.sessionData.sessionId,
      isActive: activityTracker.isActive && !document.hidden && document.hasFocus(),
      timestamp: Date.now(),
      metadata: {
        currentUrl: window.location.pathname,
        isVisible: !document.hidden,
        isFocused: document.hasFocus(),
        videoProgress: null, // Can be set by parent components
        scrollPosition: window.pageYOffset
      }
    };

    queueHeartbeat(heartbeatData);
  }, [state.sessionData, state.isTracking, activityTracker.isActive, queueHeartbeat]);

  /**
   * Start heartbeat timer
   */
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // Send initial heartbeat
    setTimeout(sendHeartbeat, 1000);

    // Setup interval
    heartbeatIntervalRef.current = setInterval(sendHeartbeat, heartbeatInterval);
  }, [sendHeartbeat, heartbeatInterval]);

  /**
   * Stop heartbeat timer
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  /**
   * Start a new study session with backend API
   */
  const startSession = useCallback(async (sessionLessonId, sessionSessionType = 'lesson') => {
    if (state.isTracking) {
      throw new Error('Session already active');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Prepare session data
      const sessionData = {
        activity: sessionSessionType || sessionType
      };

      if (sessionLessonId || lessonId) {
        sessionData.lessonId = sessionLessonId || lessonId;
      }

      // Start session via API
      const response = await studyTimeService.startSession(sessionData);
      
      if (!response.session || !response.session.sessionId) {
        throw new Error('Invalid session response from server');
      }

      const session = response.session;

      setState(prev => ({
        ...prev,
        isTracking: true,
        sessionData: session,
        sessionDuration: 0,
        isPaused: false,
        loading: false,
        error: null
      }));

      sessionStartRef.current = Date.now();
      pauseTimeRef.current = 0;
      lastHeartbeatRef.current = Date.now();

      // Start heartbeat system
      startHeartbeat();

      // Start duration timer
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartRef.current - pauseTimeRef.current) / 1000);
        setState(prev => ({
          ...prev,
          sessionDuration: elapsed
        }));
      }, 1000);

      // Save to localStorage as backup
      localStorage.setItem('current_session', JSON.stringify({
        ...session,
        clientStartTime: sessionStartRef.current
      }));

      memoizedOnSessionStart(session);
      return session;

    } catch (error) {
      const errorMessage = error.message || 'Failed to start session';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      memoizedOnError?.(error);
      throw error;
    }
  }, [state.isTracking, lessonId, sessionType, studyTimeService, startHeartbeat, memoizedOnSessionStart, memoizedOnError]);

  /**
   * End current session with backend API
   */
  const endSession = useCallback(async () => {
    if (!state.isTracking || !state.sessionData) {
      return null;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      // Stop heartbeat first
      stopHeartbeat();

      // Clear any pending heartbeats
      heartbeatQueueRef.current.clear();

      // End session via API
      const response = await studyTimeService.endSession(state.sessionData.sessionId);

      const endedSession = {
        ...state.sessionData,
        endTime: new Date().toISOString(),
        duration: state.sessionDuration,
        totalPauseTime: pauseTimeRef.current
      };

      // Clear timers
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Save to sessions history
      const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
      sessions.push(endedSession);
      localStorage.setItem('study_sessions', JSON.stringify(sessions));

      // Clear current session
      localStorage.removeItem('current_session');

      setState(prev => ({
        ...prev,
        isTracking: false,
        sessionData: null,
        sessionDuration: 0,
        isPaused: false,
        loading: false
      }));

      memoizedOnSessionEnd(endedSession);
      return endedSession;

    } catch (error) {
      const errorMessage = error.message || 'Failed to end session';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      memoizedOnError?.(error);
      throw error;
    }
  }, [state.isTracking, state.sessionData, state.sessionDuration, stopHeartbeat, memoizedOnSessionEnd, memoizedOnError]);

  /**
   * Pause current session
   */
  const pauseSession = useCallback(() => {
    if (!state.isTracking || state.isPaused) return;

    setState(prev => ({ ...prev, isPaused: true }));
    pauseTimeRef.current = Date.now();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Continue sending heartbeats but mark as inactive
    sendHeartbeat();
  }, [state.isTracking, state.isPaused, sendHeartbeat]);

  /**
   * Resume paused session
   */
  const resumeSession = useCallback(() => {
    if (!state.isTracking || !state.isPaused) return;

    setState(prev => ({ ...prev, isPaused: false }));
    const pauseDuration = Date.now() - pauseTimeRef.current;
    pauseTimeRef.current += pauseDuration;

    // Restart duration timer
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartRef.current - pauseTimeRef.current) / 1000);
      setState(prev => ({
        ...prev,
        sessionDuration: elapsed
      }));
    }, 1000);

    // Send heartbeat to mark as active
    sendHeartbeat();
  }, [state.isTracking, state.isPaused, sendHeartbeat]);

  /**
   * Update activity (for manual triggers)
   */
  const updateActivity = useCallback((metadata = {}) => {
    activityTracker.resetActivity();
    
    // Send immediate heartbeat if enough time has passed
    const timeSinceLastHeartbeat = Date.now() - lastHeartbeatRef.current;
    if (timeSinceLastHeartbeat > 30000 && state.sessionData) {
      const heartbeatData = {
        sessionId: state.sessionData.sessionId,
        isActive: true,
        timestamp: Date.now(),
        metadata: {
          currentUrl: window.location.pathname,
          isVisible: !document.hidden,
          isFocused: document.hasFocus(),
          ...metadata
        }
      };
      queueHeartbeat(heartbeatData);
    }
  }, [activityTracker, state.sessionData, queueHeartbeat]);

  /**
   * Get session statistics
   */
  const getSessionStats = useCallback(() => {
    const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
    const today = new Date().toDateString();
    
    const todaysSessions = sessions.filter(session => 
      new Date(session.startTime).toDateString() === today
    );

    const totalStudyTime = sessions.reduce((total, session) => total + session.duration, 0);
    const todaysStudyTime = todaysSessions.reduce((total, session) => total + session.duration, 0);

    return {
      totalSessions: sessions.length,
      totalStudyTime,
      todaysStudyTime,
      averageSessionLength: sessions.length > 0 ? Math.round(totalStudyTime / sessions.length) : 0,
      longestSession: Math.max(...sessions.map(s => s.duration), 0)
    };
  }, []);

  // Auto-start session if configured
  useEffect(() => {
    if (autoStart && !state.isTracking && !state.loading) {
      startSession(lessonId, sessionType).catch(console.error);
    }
  }, [autoStart, lessonId, sessionType, state.isTracking, state.loading, startSession]);

  // Auto-end session on unmount if configured
  useEffect(() => {
    return () => {
      if (autoEnd && state.isTracking) {
        // Use a fire-and-forget approach for cleanup
        endSession().catch(console.error);
      }
      
      // Always cleanup timers
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopHeartbeat();
    };
  }, [autoEnd, state.isTracking]); // Dependencies needed for the cleanup function

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.sessionData && state.isTracking) {
        // Try to send a final heartbeat
        if (navigator.sendBeacon) {
          const heartbeatData = {
            sessionId: state.sessionData.sessionId,
            isActive: false,
            timestamp: Date.now(),
            metadata: { finalHeartbeat: true }
          };
          
          navigator.sendBeacon(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}/study-time/heartbeat`,
            JSON.stringify(heartbeatData)
          );
        }
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && state.isTracking) {
        // Send heartbeat when page becomes visible
        sendHeartbeat();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.sessionData, state.isTracking, sendHeartbeat]);

  // Auto-pause on idle (with proper conditions to prevent infinite loops)
  useEffect(() => {
    if (state.isTracking && !state.isPaused && !activityTracker.isActive) {
      const timer = setTimeout(() => {
        if (state.isTracking && !state.isPaused && !activityTracker.isActive) {
          pauseSession();
        }
      }, 5000); // Wait 5 seconds before auto-pausing

      return () => clearTimeout(timer);
    }
  }, [state.isTracking, state.isPaused, activityTracker.isActive, pauseSession]);

  // Auto-resume on activity (with proper conditions)
  useEffect(() => {
    if (state.isTracking && state.isPaused && activityTracker.isActive) {
      const timer = setTimeout(() => {
        if (state.isTracking && state.isPaused && activityTracker.isActive) {
          resumeSession();
        }
      }, 1000); // Wait 1 second before auto-resuming

      return () => clearTimeout(timer);
    }
  }, [state.isTracking, state.isPaused, activityTracker.isActive, resumeSession]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    isTracking: state.isTracking,
    sessionData: state.sessionData,
    sessionDuration: state.sessionDuration,
    isPaused: state.isPaused,
    error: state.error,
    loading: state.loading,
    
    // Activity tracking
    isActive: activityTracker.isActive,
    idleTime: activityTracker.idleTime,
    
    // Actions
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    updateActivity,
    
    // Utilities
    getSessionStats,
    
    // Debug info (only in development)
    ...(process.env.NODE_ENV === 'development' && {
      _debug: {
        pendingHeartbeats: heartbeatQueueRef.current.size,
        lastHeartbeat: lastHeartbeatRef.current,
        isProcessingHeartbeats: isProcessingHeartbeatsRef.current
      }
    })
  }), [
    state,
    activityTracker.isActive,
    activityTracker.idleTime,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    updateActivity,
    getSessionStats
  ]);
};

/**
 * Simplified hook for lesson pages
 */
export const useLessonStudySession = (lessonId, options = {}) => {
  return useStudySession({
    lessonId,
    sessionType: 'lesson',
    autoStart: true,
    autoEnd: true,
    ...options
  });
};

/**
 * Simplified hook for general study sessions
 */
export const useGeneralStudySession = (sessionType = 'general', options = {}) => {
  return useStudySession({
    sessionType,
    autoStart: false,
    autoEnd: true,
    ...options
  });
};

export default useStudySession;
