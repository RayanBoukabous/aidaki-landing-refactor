'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useProgress } from './useProgress';

/**
 * Lesson Progress Hook
 * Tracks progress for a specific lesson including video and reading progress
 */
export const useLessonProgress = (
  lessonId,
  options = {}
) => {
  const {
    autoFetch = true,
    trackVideo = false,
    trackReading = false
  } = options;

  const [state, setState] = useState({
    videoProgress: 0,
    readingProgress: 0,
    overallProgress: 0,
    isCompleted: false,
    completion: null,
    error: null,
    loading: false
  });

  const progressOptions = useMemo(() => ({ autoFetch: false }), []);
  const progress = useProgress(progressOptions);
  const lastUpdateRef = useRef({ video: 0, reading: 0 });

  // Memoize addNotification to prevent dependency issues
  const addNotification = useCallback((notification) => {
    // This would typically come from StudySessionContext
    // For now, we'll just log to avoid circular dependencies
    console.log('Lesson progress notification:', notification);
  }, []);

  // Fetch lesson completion status
  useEffect(() => {
    if (autoFetch && lessonId) {
      fetchLessonProgress();
    }
  }, [lessonId, autoFetch]); // Only depend on lessonId and autoFetch

  /**
   * Fetch lesson progress from the server
   */
  const fetchLessonProgress = useCallback(async () => {
    if (state.loading) return; // Prevent multiple simultaneous calls
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Get completions and session progress
      const completions = JSON.parse(localStorage.getItem('lesson_completions') || '{}');
      const lessonCompletion = completions[lessonId];
      
      if (lessonCompletion) {
        setState(prev => ({
          ...prev,
          isCompleted: true,
          completion: lessonCompletion,
          videoProgress: lessonCompletion.videoProgress || 0,
          readingProgress: lessonCompletion.readingProgress || 0,
          overallProgress: 100,
          loading: false
        }));
      } else {
        // Get progress from localStorage for active session
        const sessionProgress = JSON.parse(localStorage.getItem(`lesson_progress_${lessonId}`) || '{}');
        const videoProgress = sessionProgress.videoProgress || 0;
        const readingProgress = sessionProgress.readingProgress || 0;
        
        setState(prev => ({
          ...prev,
          videoProgress,
          readingProgress,
          overallProgress: calculateOverallProgress(videoProgress, readingProgress),
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch lesson progress',
        loading: false
      }));
    }
  }, [lessonId, state.loading]);

  /**
   * Calculate overall progress based on video and reading progress
   */
  const calculateOverallProgress = useCallback((videoProgress, readingProgress) => {
    // Simple average for now, but could be weighted
    const hasVideo = trackVideo;
    const hasReading = trackReading;
    
    if (hasVideo && hasReading) {
      return Math.round((videoProgress + readingProgress) / 2);
    } else if (hasVideo) {
      return Math.round(videoProgress);
    } else if (hasReading) {
      return Math.round(readingProgress);
    } else {
      return Math.max(videoProgress, readingProgress);
    }
  }, [trackVideo, trackReading]);

  /**
   * Update video progress
   */
  const updateVideoProgress = useCallback((progressValue) => {
    const clampedProgress = Math.min(Math.max(progressValue, 0), 100);
    
    // Only update if progress increased significantly (avoid spam)
    if (clampedProgress > lastUpdateRef.current.video + 5) {
      lastUpdateRef.current.video = clampedProgress;
      
      setState(prev => {
        const newOverallProgress = calculateOverallProgress(clampedProgress, prev.readingProgress);
        
        // Save to localStorage
        const sessionProgress = {
          videoProgress: clampedProgress,
          readingProgress: prev.readingProgress,
          overallProgress: newOverallProgress,
          lastUpdated: Date.now()
        };
        localStorage.setItem(`lesson_progress_${lessonId}`, JSON.stringify(sessionProgress));
        
        return {
          ...prev,
          videoProgress: clampedProgress,
          overallProgress: newOverallProgress
        };
      });

      // Show milestone notifications
      if (clampedProgress >= 25 && lastUpdateRef.current.video < 25) {
        addNotification({
          type: 'info',
          message: '25% of video watched! Keep going!',
          duration: 3000
        });
      } else if (clampedProgress >= 50 && lastUpdateRef.current.video < 50) {
        addNotification({
          type: 'info',
          message: 'Halfway through the video! 🎯',
          duration: 3000
        });
      } else if (clampedProgress >= 75 && lastUpdateRef.current.video < 75) {
        addNotification({
          type: 'success',
          message: 'Almost done with the video! 🔥',
          duration: 3000
        });
      }
    }
  }, [lessonId, calculateOverallProgress, addNotification]);

  /**
   * Update reading progress
   */
  const updateReadingProgress = useCallback((progressValue) => {
    const clampedProgress = Math.min(Math.max(progressValue, 0), 100);
    
    // Only update if progress increased significantly
    if (clampedProgress > lastUpdateRef.current.reading + 10) {
      lastUpdateRef.current.reading = clampedProgress;
      
      setState(prev => {
        const newOverallProgress = calculateOverallProgress(prev.videoProgress, clampedProgress);
        
        // Save to localStorage
        const sessionProgress = {
          videoProgress: prev.videoProgress,
          readingProgress: clampedProgress,
          overallProgress: newOverallProgress,
          lastUpdated: Date.now()
        };
        localStorage.setItem(`lesson_progress_${lessonId}`, JSON.stringify(sessionProgress));
        
        return {
          ...prev,
          readingProgress: clampedProgress,
          overallProgress: newOverallProgress
        };
      });

      // Show milestone notifications
      if (clampedProgress >= 50 && lastUpdateRef.current.reading < 50) {
        addNotification({
          type: 'info',
          message: 'Halfway through reading! 📖',
          duration: 3000
        });
      } else if (clampedProgress >= 100 && lastUpdateRef.current.reading < 100) {
        addNotification({
          type: 'success',
          message: 'Finished reading! Great job! ✅',
          duration: 4000
        });
      }
    }
  }, [lessonId, calculateOverallProgress, addNotification]);

  /**
   * Mark lesson as completed
   */
  const completeLesson = useCallback(async (completionData = {}) => {
    if (state.loading) return null;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const completion = {
        lessonId,
        completedAt: new Date().toISOString(),
        timeSpentSeconds: completionData.timeSpentSeconds || 0,
        videoProgress: completionData.videoProgress || state.videoProgress,
        readingProgress: completionData.readingProgress || state.readingProgress,
        quizScore: completionData.quizScore || null,
        overallProgress: 100
      };

      // Save completion to localStorage (would be API call in real app)
      const completions = JSON.parse(localStorage.getItem('lesson_completions') || '{}');
      completions[lessonId] = completion;
      localStorage.setItem('lesson_completions', JSON.stringify(completions));

      // Clear session progress
      localStorage.removeItem(`lesson_progress_${lessonId}`);

      setState(prev => ({
        ...prev,
        isCompleted: true,
        completion,
        overallProgress: 100,
        loading: false
      }));

      // Refresh overall progress
      setTimeout(() => {
        progress.refreshProgressData();
      }, 100);

      // Show completion notification
      addNotification({
        type: 'achievement',
        title: 'Lesson Completed! 🎉',
        message: 'Congratulations on completing this lesson!',
        duration: 6000
      });

      return completion;
    } catch (error) {
      console.error('Error completing lesson:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to complete lesson',
        loading: false
      }));
      throw error;
    }
  }, [lessonId, state.videoProgress, state.readingProgress, state.loading, progress.refreshProgressData, addNotification]);

  /**
   * Reset lesson progress
   */
  const resetProgress = useCallback(() => {
    localStorage.removeItem(`lesson_progress_${lessonId}`);
    setState({
      videoProgress: 0,
      readingProgress: 0,
      overallProgress: 0,
      isCompleted: false,
      completion: null,
      error: null,
      loading: false
    });
    lastUpdateRef.current = { video: 0, reading: 0 };
  }, [lessonId]);

  /**
   * Get lesson statistics
   */
  const getStats = useCallback(() => {
    return {
      timeSpent: state.completion?.timeSpentSeconds || 0,
      videoProgress: state.videoProgress,
      readingProgress: state.readingProgress,
      overallProgress: state.overallProgress,
      isCompleted: state.isCompleted,
      completedAt: state.completion?.completedAt,
      quizScore: state.completion?.quizScore
    };
  }, [state]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    videoProgress: state.videoProgress,
    readingProgress: state.readingProgress,
    overallProgress: state.overallProgress,
    isCompleted: state.isCompleted,
    completion: state.completion,
    error: state.error,
    loading: state.loading,
    
    // Actions
    updateVideoProgress,
    updateReadingProgress,
    completeLesson,
    resetProgress,
    fetchLessonProgress,
    
    // Utilities
    getStats
  }), [
    state,
    updateVideoProgress,
    updateReadingProgress,
    completeLesson,
    resetProgress,
    fetchLessonProgress,
    getStats
  ]);
};

/**
 * Study Stats Hook
 * Provides aggregated study statistics
 */
export const useStudyStats = () => {
  const [stats, setStats] = useState({
    totalStudyTime: 0,
    totalLessonsCompleted: 0,
    averageSessionLength: 0,
    longestSession: 0,
    totalSessions: 0,
    averageQuizScore: 0,
    loading: false,
    error: null
  });

  const calculateStats = useCallback(async () => {
    if (stats.loading) return;
    
    setStats(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Get study sessions from localStorage (would be API call)
      const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
      const completions = JSON.parse(localStorage.getItem('lesson_completions') || '{}');
      
      const totalStudyTime = sessions.reduce((total, session) => {
        return total + (session.duration || 0);
      }, 0);

      const completedLessons = Object.values(completions);
      const totalLessonsCompleted = completedLessons.length;
      
      const averageSessionLength = sessions.length > 0 
        ? Math.round(totalStudyTime / sessions.length) 
        : 0;
      
      const longestSession = sessions.reduce((max, session) => {
        return Math.max(max, session.duration || 0);
      }, 0);

      const quizScores = completedLessons
        .map((completion) => completion.quizScore)
        .filter((score) => score !== null && score !== undefined);
      
      const averageQuizScore = quizScores.length > 0
        ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
        : 0;

      setStats({
        totalStudyTime,
        totalLessonsCompleted,
        averageSessionLength,
        longestSession,
        totalSessions: sessions.length,
        averageQuizScore,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
      setStats(prev => ({
        ...prev,
        error: 'Failed to calculate statistics',
        loading: false
      }));
    }
  }, [stats.loading]);

  const refreshStats = useCallback(() => {
    calculateStats();
  }, [calculateStats]);

  useEffect(() => {
    calculateStats();
  }, []); // Only run once on mount

  return useMemo(() => ({
    stats,
    refreshStats,
    loading: stats.loading,
    error: stats.error
  }), [stats, refreshStats]);
};

export default useLessonProgress;
