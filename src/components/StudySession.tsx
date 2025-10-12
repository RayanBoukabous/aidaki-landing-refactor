'use client';

import React from 'react';
import { useStudySession, useLessonStudySession } from '@/hooks/useStudySession';

/**
 * Study Session Status Component
 * Shows current session information and controls
 */
interface StudySessionStatusProps {
  lessonId?: number;
  activity?: string;
  showControls?: boolean;
  className?: string;
}

export function StudySessionStatus({
  lessonId,
  activity = 'lesson',
  showControls = true,
  className = '',
}: StudySessionStatusProps) {
  // Use lesson-specific hook if lessonId provided, otherwise general hook
  const sessionHook = lessonId 
    ? useLessonStudySession(lessonId, activity, false) // Don't auto-start
    : useStudySession();

  const {
    currentSession,
    isTracking,
    isActive,
    loading,
    error,
    sessionDurationFormatted,
    startSession,
    endSession,
    updateActivity,
    getPendingHeartbeatCount,
  } = sessionHook;

  const handleStart = async () => {
    try {
      await startSession(lessonId, activity);
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const handleEnd = async () => {
    try {
      await endSession();
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const pendingHeartbeats = getPendingHeartbeatCount();

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
        <span className="text-sm">Loading session...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        <div className="flex items-center space-x-2">
          <span>⚠️ Session Error: {error}</span>
          {showControls && (
            <button
              onClick={handleStart}
              className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`study-session-status ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isTracking
                ? isActive
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-yellow-500'
                : 'bg-gray-400'
            }`}
          />
          <span className="text-sm font-medium">
            {isTracking ? (isActive ? 'Studying' : 'Idle') : 'Not Tracking'}
          </span>
        </div>

        {/* Duration */}
        {isTracking && (
          <div className="text-sm text-gray-600">
            {sessionDurationFormatted}
          </div>
        )}

        {/* Session Info */}
        {currentSession && (
          <div className="text-xs text-gray-500">
            Session #{currentSession.sessionId}
            {lessonId && ` • Lesson ${lessonId}`}
            {activity && ` • ${activity}`}
          </div>
        )}

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && pendingHeartbeats > 0 && (
          <div className="text-xs text-orange-600">
            ({pendingHeartbeats} pending)
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="flex space-x-1">
            {!isTracking ? (
              <button
                onClick={handleStart}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Start Tracking
              </button>
            ) : (
              <>
                <button
                  onClick={handleEnd}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Stop Tracking
                </button>
                
                <button
                  onClick={() => updateActivity({ manualTrigger: true })}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Mark as active"
                >
                  💡
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Lesson Page Integration Component
 * Easy wrapper for lesson pages
 */
interface LessonStudyWrapperProps {
  lessonId: number;
  lessonTitle?: string;
  activity?: string;
  children: React.ReactNode;
  showStatusBar?: boolean;
}

export function LessonStudyWrapper({
  lessonId,
  lessonTitle,
  activity = 'lesson',
  children,
  showStatusBar = true,
}: LessonStudyWrapperProps) {
  const studySession = useLessonStudySession(lessonId, activity, true); // Auto-start
  
  const {
    isTracking,
    isActive,
    error,
    updateActivity,
    sessionDurationFormatted,
  } = studySession;

  // Track lesson interactions
  const handleLessonInteraction = React.useCallback((metadata = {}) => {
    updateActivity({
      lessonInteraction: true,
      timestamp: Date.now(),
      ...metadata,
    });
  }, [updateActivity]);

  return (
    <div className="lesson-study-wrapper">
      {/* Status Bar */}
      {showStatusBar && (
        <div className="sticky top-0 z-10 bg-white border-b p-3 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold truncate">
              {lessonTitle || `Lesson ${lessonId}`}
            </h1>
            <StudySessionStatus 
              lessonId={lessonId} 
              activity={activity}
              className="border rounded-lg p-2 bg-gray-50"
            />
          </div>
        </div>
      )}

      {/* Session Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 m-4 rounded">
          <strong>Study tracking error:</strong> {error}
        </div>
      )}

      {/* Lesson Content with interaction tracking */}
      <div 
        className="lesson-content"
        onClick={() => handleLessonInteraction({ type: 'click' })}
        onScroll={() => handleLessonInteraction({ type: 'scroll' })}
        onKeyDown={() => handleLessonInteraction({ type: 'keydown' })}
      >
        {children}
      </div>

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs">
          <div>🎯 Study Session Debug</div>
          <div>Tracking: {isTracking ? '✅' : '❌'}</div>
          <div>Active: {isActive ? '✅' : '❌'}</div>
          <div>Duration: {sessionDurationFormatted}</div>
          <div>Lesson: {lessonId}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Study Session Widget
 * Compact widget for navigation or sidebar
 */
export function StudySessionWidget() {
  const { isTracking, isActive, sessionDurationFormatted } = useStudySession();

  if (!isTracking) return null;

  return (
    <div className="study-session-widget flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <span className="text-sm font-medium text-blue-800">{sessionDurationFormatted}</span>
    </div>
  );
}

/**
 * Interactive Elements for Lessons
 * Components that automatically track interactions
 */
export function TrackedVideoPlayer({ 
  src, 
  onProgress, 
  className = '',
  ...props 
}: {
  src: string;
  onProgress?: (progress: number) => void;
  className?: string;
  [key: string]: any;
}) {
  const { updateActivity } = useStudySession();

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const progress = (video.currentTime / video.duration) * 100;
    
    // Track video progress
    updateActivity({
      type: 'video_progress',
      progress,
      currentTime: video.currentTime,
      duration: video.duration,
    });

    onProgress?.(progress);
  };

  const handlePlay = () => {
    updateActivity({ type: 'video_play' });
  };

  const handlePause = () => {
    updateActivity({ type: 'video_pause' });
  };

  return (
    <video
      src={src}
      onTimeUpdate={handleTimeUpdate}
      onPlay={handlePlay}
      onPause={handlePause}
      className={`tracked-video ${className}`}
      controls
      {...props}
    />
  );
}

export function TrackedButton({ 
  children, 
  onClick, 
  actionType = 'button_click',
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  actionType?: string;
  className?: string;
  [key: string]: any;
}) {
  const { updateActivity } = useStudySession();

  const handleClick = () => {
    updateActivity({
      type: actionType,
      timestamp: Date.now(),
    });
    
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`tracked-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Study Session Provider for Global State (Optional)
 */
interface StudySessionContextType {
  globalSession: ReturnType<typeof useStudySession>;
}

const StudySessionContext = React.createContext<StudySessionContextType | null>(null);

export function StudySessionProvider({ children }: { children: React.ReactNode }) {
  const globalSession = useStudySession();

  return (
    <StudySessionContext.Provider value={{ globalSession }}>
      {children}
    </StudySessionContext.Provider>
  );
}

export function useGlobalStudySession() {
  const context = React.useContext(StudySessionContext);
  if (!context) {
    throw new Error('useGlobalStudySession must be used within StudySessionProvider');
  }
  return context.globalSession;
}

export default StudySessionStatus;
