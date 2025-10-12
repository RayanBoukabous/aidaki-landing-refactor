'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { studyTimeService, StudySessionManager } from '../services/studyTime';

/**
 * Study Session Hook
 * Manages study session lifecycle, heartbeat, and activity tracking
 */
export const useStudySession = (options = {}) => {
  const {
    autoStart = false,
    lessonId = null,
    activity = 'lesson',
    heartbeatInterval = 45000,
    onSessionStart = null,
    onSessionEnd = null,
    onActivityChange = null
  } = options;

  // State
  const [state, setState] = useState({
    currentSession: null,
    isTracking: false,
    isActive: true,
    totalActiveTime: 0,
    error: null,
    loading: false
  });

  // Refs
  const sessionManagerRef = useRef(null);
  const cleanupRef = useRef(false);

  /**
   * Initialize session manager
   */
  useEffect(() => {
    if (!sessionManagerRef.current) {
      sessionManagerRef.current = new StudySessionManager({
        heartbeatInterval,
        onActivityChange: (event) => {
          setState(prev => ({
            ...prev,
            isActive: event.type === 'active' || event.isVisible !== false
          }));
          
          if (onActivityChange) {
            onActivityChange(event);
          }
        }
      });
    }

    // Auto-start session if enabled
    if (autoStart && lessonId && !state.isTracking) {
      startSession(lessonId, activity);
    }

    // Cleanup function
    return () => {
      cleanupRef.current = true;
      if (sessionManagerRef.current) {
        sessionManagerRef.current.cleanup();
      }
    };
  }, [autoStart, lessonId, activity, heartbeatInterval]);

  /**
   * Start a new study session
   */
  const startSession = useCallback(async (sessionLessonId = lessonId, sessionActivity = activity) => {
    if (state.isTracking) {
      console.warn('Session already in progress');
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await sessionManagerRef.current.startSession(sessionLessonId, sessionActivity);
      
      if (!cleanupRef.current) {
        setState(prev => ({
          ...prev,
          currentSession: response.session,
          isTracking: true,
          loading: false,
          totalActiveTime: 0
        }));

        if (onSessionStart) {
          onSessionStart(response.session);
        }
      }

      return response;
    } catch (error) {
      if (!cleanupRef.current) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to start session',
          loading: false
        }));
      }
      throw error;
    }
  }, [lessonId, activity, state.isTracking, onSessionStart]);

  /**
   * End the current study session
   */
  const endSession = useCallback(async () => {
    if (!state.isTracking || !sessionManagerRef.current) {
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await sessionManagerRef.current.endSession();
      
      if (!cleanupRef.current) {
        setState(prev => ({
          ...prev,
          currentSession: null,
          isTracking: false,
          loading: false,
          totalActiveTime: response?.session?.duration || prev.totalActiveTime
        }));

        if (onSessionEnd) {
          onSessionEnd(response?.session);
        }
      }

      return response;
    } catch (error) {
      if (!cleanupRef.current) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to end session',
          loading: false
        }));
      }
      throw error;
    }
  }, [state.isTracking, onSessionEnd]);

  /**
   * Pause session (stop heartbeat but don't end session)
   */
  const pauseSession = useCallback(() => {
    if (sessionManagerRef.current) {
      sessionManagerRef.current.stopHeartbeat();
      setState(prev => ({ ...prev, isActive: false }));
    }
  }, []);

  /**
   * Resume session (restart heartbeat)
   */
  const resumeSession = useCallback(() => {
    if (sessionManagerRef.current && state.isTracking) {
      sessionManagerRef.current.startHeartbeat();
      setState(prev => ({ ...prev, isActive: true }));
    }
  }, [state.isTracking]);

  /**
   * Get current session status
   */
  const getSessionStatus = useCallback(() => {
    if (sessionManagerRef.current) {
      return sessionManagerRef.current.getSessionStatus();
    }
    return null;
  }, []);

  /**
   * Update session metadata (e.g., when video progress changes)
   */
  const updateSessionMetadata = useCallback((metadata) => {
    if (sessionManagerRef.current && state.isTracking) {
      // Store metadata for next heartbeat
      sessionManagerRef.current.nextMetadata = metadata;
    }
  }, [state.isTracking]);

  /**
   * Force send heartbeat
   */
  const sendHeartbeat = useCallback(async () => {
    if (sessionManagerRef.current && state.isTracking) {
      try {
        await sessionManagerRef.current.sendHeartbeat();
      } catch (error) {
        console.error('Manual heartbeat failed:', error);
      }
    }
  }, [state.isTracking]);

  return {
    // State
    ...state,
    
    // Actions
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    sendHeartbeat,
    updateSessionMetadata,
    getSessionStatus,

    // Computed values
    isSessionActive: state.isTracking && state.isActive,
    sessionDuration: state.currentSession ? 
      Math.floor((Date.now() - new Date(state.currentSession.startTime).getTime()) / 1000) : 0
  };
};

/**
 * Activity Tracker Hook
 * Tracks user activity and idle states
 */
export const useActivityTracker = (options = {}) => {
  const {
    idleThreshold = 120000, // 2 minutes
    onActivityChange = null,
    trackVisibility = true,
    trackFocus = true
  } = options;

  const [activityState, setActivityState] = useState({
    isActive: true,
    lastActivity: Date.now(),
    isVisible: true,
    isFocused: true,
    idleTime: 0
  });

  const activityTimerRef = useRef(null);
  const updateIntervalRef = useRef(null);
  const listenersRef = useRef([]);

  /**
   * Update activity state
   */
  const updateActivity = useCallback(() => {
    const now = Date.now();
    setActivityState(prev => ({
      ...prev,
      isActive: true,
      lastActivity: now,
      idleTime: 0
    }));

    // Clear existing timer
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }

    // Set new idle timer
    activityTimerRef.current = setTimeout(() => {
      setActivityState(prev => ({
        ...prev,
        isActive: false
      }));

      if (onActivityChange) {
        onActivityChange({ type: 'idle', timestamp: Date.now() });
      }
    }, idleThreshold);

    if (onActivityChange) {
      onActivityChange({ type: 'active', timestamp: now });
    }
  }, [idleThreshold, onActivityChange]);

  /**
   * Setup activity listeners
   */
  useEffect(() => {
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'wheel'
    ];

    // Add activity event listeners
    activityEvents.forEach(eventName => {
      const listener = updateActivity;
      document.addEventListener(eventName, listener, { passive: true });
      listenersRef.current.push({ event: eventName, listener });
    });

    // Visibility change listener
    if (trackVisibility) {
      const visibilityListener = () => {
        const isVisible = !document.hidden;
        setActivityState(prev => ({ ...prev, isVisible }));

        if (onActivityChange) {
          onActivityChange({ 
            type: 'visibility', 
            isVisible, 
            timestamp: Date.now() 
          });
        }

        if (isVisible) {
          updateActivity();
        }
      };

      document.addEventListener('visibilitychange', visibilityListener);
      listenersRef.current.push({ event: 'visibilitychange', listener: visibilityListener });
    }

    // Focus change listeners
    if (trackFocus) {
      const focusListener = () => {
        setActivityState(prev => ({ ...prev, isFocused: true }));
        updateActivity();
      };

      const blurListener = () => {
        setActivityState(prev => ({ ...prev, isFocused: false }));
      };

      window.addEventListener('focus', focusListener);
      window.addEventListener('blur', blurListener);
      listenersRef.current.push({ event: 'focus', listener: focusListener, target: window });
      listenersRef.current.push({ event: 'blur', listener: blurListener, target: window });
    }

    // Update idle time periodically
    updateIntervalRef.current = setInterval(() => {
      setActivityState(prev => ({
        ...prev,
        idleTime: Date.now() - prev.lastActivity
      }));
    }, 1000);

    // Initial activity update
    updateActivity();

    // Cleanup
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }

      listenersRef.current.forEach(({ event, listener, target = document }) => {
        target.removeEventListener(event, listener);
      });
      listenersRef.current = [];
    };
  }, [updateActivity, trackVisibility, trackFocus, onActivityChange]);

  /**
   * Force set activity state
   */
  const setActive = useCallback((isActive) => {
    if (isActive) {
      updateActivity();
    } else {
      setActivityState(prev => ({ ...prev, isActive: false }));
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    }
  }, [updateActivity]);

  return {
    ...activityState,
    setActive,
    isIdle: !activityState.isActive,
    idleTimeFormatted: Math.floor(activityState.idleTime / 1000) + 's'
  };
};

/**
 * Study Statistics Hook
 * Fetches and manages study time statistics
 */
export const useStudyStats = (autoFetch = true) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch study statistics
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await studyTimeService.getStudyStats();
      setStats(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch study statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch daily study time
   */
  const fetchDailyStudyTime = useCallback(async (startDate, endDate) => {
    try {
      const response = await studyTimeService.getDailyStudyTime(startDate, endDate);
      return response;
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch daily study time');
    }
  }, []);

  /**
   * Fetch weekly study time
   */
  const fetchWeeklyStudyTime = useCallback(async (weeks = 4) => {
    try {
      const response = await studyTimeService.getWeeklyStudyTime(weeks);
      return response;
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch weekly study time');
    }
  }, []);

  /**
   * Fetch study time by subject
   */
  const fetchStudyTimeBySubject = useCallback(async (startDate, endDate) => {
    try {
      const response = await studyTimeService.getStudyTimeBySubject(startDate, endDate);
      return response;
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch study time by subject');
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    fetchDailyStudyTime,
    fetchWeeklyStudyTime,
    fetchStudyTimeBySubject,
    
    // Computed values
    totalStudyTime: stats?.totalStudyTime || 0,
    currentStreak: stats?.currentStreak || 0,
    averageSessionLength: stats?.averageSessionLength || 0
  };
};

export default useStudySession;
