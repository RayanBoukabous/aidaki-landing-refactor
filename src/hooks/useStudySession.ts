import { useState, useEffect, useRef, useCallback } from 'react';
import { studyTimeService, StudySessionManager } from '@/app/services/studyTime';

/**
 * Enhanced Study Session Hook with Request Throttling
 * Works with your existing studyTimeService but adds smart throttling
 */
export function useStudySession() {
  const [state, setState] = useState({
    currentSession: null,
    isTracking: false,
    isActive: true,
    loading: false,
    error: null,
    sessionDuration: 0,
  });

  // Use refs to store managers and prevent recreating them
  const sessionManagerRef = useRef(null);
  const durationTimerRef = useRef(null);
  const sessionStartTimeRef = useRef(null);
  const heartbeatQueueRef = useRef(new Set());
  const lastHeartbeatRef = useRef(0);
  const isProcessingHeartbeatRef = useRef(false);

  // Update state helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Enhanced heartbeat with request throttling
   * Prevents sending too many requests by batching them
   */
  const throttledHeartbeat = useCallback(async (heartbeatData) => {
    const now = Date.now();
    
    // Don't send heartbeat more frequently than every 30 seconds
    if (now - lastHeartbeatRef.current < 30000) {
      // Queue the heartbeat instead of sending immediately
      heartbeatQueueRef.current.add(heartbeatData);
      return;
    }

    // If we're already processing, queue this one
    if (isProcessingHeartbeatRef.current) {
      heartbeatQueueRef.current.add(heartbeatData);
      return;
    }

    isProcessingHeartbeatRef.current = true;

    try {
      // Process the current heartbeat and any queued ones
      const queuedHeartbeats = Array.from(heartbeatQueueRef.current);
      heartbeatQueueRef.current.clear();
      
      // Use the most recent heartbeat data (current or last queued)
      const finalHeartbeat = queuedHeartbeats.length > 0 
        ? queuedHeartbeats[queuedHeartbeats.length - 1] 
        : heartbeatData;

      await studyTimeService.sendHeartbeat(finalHeartbeat);
      lastHeartbeatRef.current = now;
      
      // Update activity state from heartbeat
      updateState({ isActive: finalHeartbeat.isActive });
      
    } catch (error) {
      console.error('Throttled heartbeat failed:', error);
      // Don't update error state for heartbeat failures to avoid disrupting UX
    } finally {
      isProcessingHeartbeatRef.current = false;
    }
  }, [updateState]);

  /**
   * Start a study session with enhanced error handling
   */
  const startSession = useCallback(async (lessonId = null, activity = 'lesson') => {
    if (state.isTracking) {
      console.warn('Session already active');
      return state.currentSession;
    }

    updateState({ loading: true, error: null });

    try {
      // Create enhanced session manager if not exists
      if (!sessionManagerRef.current) {
        sessionManagerRef.current = new StudySessionManager({
          heartbeatInterval: 45000, // Keep your existing 45s interval
        });
        
        // Override the sendHeartbeat method to use our throttled version
        const originalSendHeartbeat = sessionManagerRef.current.sendHeartbeat.bind(sessionManagerRef.current);
        sessionManagerRef.current.sendHeartbeat = async function() {
          if (!this.sessionId) return;

          const activityState = this.activityTracker.getActivityState();
          
          const heartbeatData = {
            sessionId: this.sessionId,
            isActive: activityState.isActive,
            timestamp: Date.now(),
            metadata: {
              currentUrl: window.location.pathname,
              isVisible: activityState.isVisible,
              isFocused: activityState.isFocused
            }
          };

          // Use our throttled heartbeat instead
          await throttledHeartbeat(heartbeatData);
        };
      }

      // Start the session
      const response = await sessionManagerRef.current.startSession(lessonId, activity);
      
      if (response.session) {
        sessionStartTimeRef.current = Date.now();
        
        updateState({
          currentSession: response.session,
          isTracking: true,
          loading: false,
          error: null,
        });

        // Start duration timer
        startDurationTimer();
      }

      return response;
    } catch (error) {
      updateState({ 
        loading: false, 
        error: error.message || 'Failed to start session' 
      });
      throw error;
    }
  }, [state.isTracking, state.currentSession, updateState, throttledHeartbeat]);

  /**
   * End the current study session
   */
  const endSession = useCallback(async () => {
    if (!state.isTracking || !sessionManagerRef.current) {
      console.warn('No active session to end');
      return;
    }

    updateState({ loading: true, error: null });

    try {
      // Stop duration timer
      stopDurationTimer();
      
      // Clear any pending heartbeats
      heartbeatQueueRef.current.clear();
      
      // End the session
      const response = await sessionManagerRef.current.endSession();
      
      updateState({
        currentSession: null,
        isTracking: false,
        loading: false,
        sessionDuration: 0,
      });

      sessionStartTimeRef.current = null;
      return response;
    } catch (error) {
      updateState({ 
        loading: false, 
        error: error.message || 'Failed to end session' 
      });
      throw error;
    }
  }, [state.isTracking, updateState]);

  /**
   * Restart session (end current and start new)
   */
  const restartSession = useCallback(async (lessonId = null, activity = 'lesson') => {
    await endSession();
    return await startSession(lessonId, activity);
  }, [endSession, startSession]);

  /**
   * Manually trigger activity (useful for specific interactions)
   */
  const updateActivity = useCallback((metadata = {}) => {
    if (sessionManagerRef.current?.activityTracker) {
      // Reset activity in the tracker
      sessionManagerRef.current.activityTracker.isActive = true;
      sessionManagerRef.current.activityTracker.lastActivity = Date.now();
      
      // Send immediate heartbeat if enough time has passed
      const timeSinceLastHeartbeat = Date.now() - lastHeartbeatRef.current;
      if (timeSinceLastHeartbeat > 30000 && state.isTracking) {
        const heartbeatData = {
          sessionId: state.currentSession?.sessionId,
          isActive: true,
          timestamp: Date.now(),
          metadata: {
            currentUrl: window.location.pathname,
            isVisible: !document.hidden,
            isFocused: document.hasFocus(),
            ...metadata
          }
        };
        
        throttledHeartbeat(heartbeatData);
      }
    }
  }, [state.isTracking, state.currentSession, throttledHeartbeat]);

  /**
   * Start duration timer
   */
  const startDurationTimer = useCallback(() => {
    stopDurationTimer(); // Clear any existing timer
    
    durationTimerRef.current = setInterval(() => {
      if (sessionStartTimeRef.current) {
        const duration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        updateState({ sessionDuration: duration });
      }
    }, 1000);
  }, [updateState]);

  /**
   * Stop duration timer
   */
  const stopDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  /**
   * Get current session status
   */
  const getSessionStatus = useCallback(() => {
    if (sessionManagerRef.current) {
      return sessionManagerRef.current.getSessionStatus();
    }
    return {
      sessionId: state.currentSession?.sessionId || null,
      isTracking: state.isTracking,
      activityState: null
    };
  }, [state.currentSession, state.isTracking]);

  /**
   * Get pending heartbeat count (useful for debugging)
   */
  const getPendingHeartbeatCount = useCallback(() => {
    return heartbeatQueueRef.current.size;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDurationTimer();
      
      // Cleanup session manager
      if (sessionManagerRef.current) {
        sessionManagerRef.current.cleanup();
        sessionManagerRef.current = null;
      }
      
      // Clear heartbeat queue
      heartbeatQueueRef.current.clear();
    };
  }, [stopDurationTimer]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state.isTracking) {
        // Send heartbeat when page becomes visible again
        updateActivity({ visibilityChange: true });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.isTracking, updateActivity]);

  return {
    // State
    ...state,
    
    // Actions
    startSession,
    endSession,
    restartSession,
    updateActivity,
    
    // Getters
    getSessionStatus,
    getPendingHeartbeatCount,
    
    // Computed values
    sessionDurationFormatted: formatDuration(state.sessionDuration),
  };
}

/**
 * Hook specifically for lesson pages
 */
export function useLessonStudySession(lessonId, activity = 'lesson', autoStart = true) {
  const studySession = useStudySession();
  const { startSession, endSession } = studySession;
  
  // Auto-start session when hook mounts
  useEffect(() => {
    if (autoStart && lessonId && !studySession.isTracking) {
      startSession(lessonId, activity).catch(console.error);
    }
  }, [autoStart, lessonId, activity, startSession, studySession.isTracking]);

  // Auto-end session when component unmounts
  useEffect(() => {
    return () => {
      if (studySession.isTracking) {
        endSession().catch(console.error);
      }
    };
  }, [endSession, studySession.isTracking]);

  return {
    ...studySession,
    lessonId,
    activity,
  };
}

/**
 * Format duration in seconds to human readable format
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default useStudySession;
