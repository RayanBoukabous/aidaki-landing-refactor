'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { progressService, progressUtils, progressNotifications } from '../services/progress';

/**
 * Progress Hook
 * Manages course progress, lesson completion, and dashboard data
 */
export const useProgress = (options = {}) => {
  const {
    autoFetch = true,
    onLessonComplete = null,
    onCourseComplete = null,
    onMilestone = null
  } = options;

  // State
  const [state, setState] = useState({
    courses: [],
    completedLessons: [],
    studyStats: null,
    dashboard: null,
    summary: null,
    loading: false,
    error: null,
    lastFetched: null
  });

  // Cache refs for optimization
  const cacheRef = useRef({});
  const loadingRef = useRef({});

  /**
   * Get progress dashboard data
   */
  const fetchDashboard = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await progressService.getProgressDashboard();
      
      setState(prev => ({
        ...prev,
        dashboard: response,
        summary: response.summary || null,
        courses: response.courseProgress || response.courses || [],
        studyStats: response.studyStats || null,
        loading: false,
        lastFetched: Date.now()
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch dashboard data',
        loading: false
      }));
      throw error;
    }
  }, []);

  /**
   * Get course progress for all enrolled courses
   */
  const fetchAllCourseProgress = useCallback(async () => {
    try {
      const response = await progressService.getAllCourseProgress();
      
      setState(prev => ({
        ...prev,
        courses: response.courses || response
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch course progress'
      }));
      throw error;
    }
  }, []);

  /**
   * Get progress for a specific course
   */
  const fetchCourseProgress = useCallback(async (courseId) => {
    // Check cache first
    const cacheKey = `course-${courseId}`;
    if (cacheRef.current[cacheKey] && Date.now() - cacheRef.current[cacheKey].timestamp < 30000) {
      return cacheRef.current[cacheKey].data;
    }

    // Prevent duplicate requests
    if (loadingRef.current[cacheKey]) {
      return loadingRef.current[cacheKey];
    }

    loadingRef.current[cacheKey] = progressService.getCourseProgress(courseId);

    try {
      const response = await loadingRef.current[cacheKey];
      
      // Cache the result
      cacheRef.current[cacheKey] = {
        data: response,
        timestamp: Date.now()
      };

      // Update state
      setState(prev => ({
        ...prev,
        courses: prev.courses.map(course => 
          course.courseId === courseId ? { ...course, ...response } : course
        )
      }));

      return response;
    } catch (error) {
      throw error;
    } finally {
      delete loadingRef.current[cacheKey];
    }
  }, []);

  /**
   * Complete a lesson
   */
  const completeLesson = useCallback(async (lessonId, completionData = {}) => {
    try {
      const response = await progressService.completLesson(lessonId, completionData);
      
      // Update completed lessons state
      setState(prev => ({
        ...prev,
        completedLessons: [response.completion, ...prev.completedLessons],
        courses: prev.courses.map(course => 
          course.courseId === response.courseProgress.courseId 
            ? response.courseProgress 
            : course
        )
      }));

      // Clear relevant cache
      delete cacheRef.current[`course-${response.courseProgress.courseId}`];

      // Check for milestones
      const milestones = progressNotifications.checkLessonMilestones(
        state.completedLessons.length + 1
      );
      
      if (milestones.length > 0 && onMilestone) {
        milestones.forEach(milestone => onMilestone(milestone));
      }

      // Check for course completion
      if (response.courseProgress.isCompleted && onCourseComplete) {
        const courseNotification = progressNotifications.checkCourseCompletion(
          response.courseProgress.courseName || 'Course',
          state.courses.filter(c => c.isCompleted).length + 1
        );
        onCourseComplete(response.courseProgress, courseNotification);
      }

      if (onLessonComplete) {
        onLessonComplete(response.completion, response.courseProgress);
      }

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to complete lesson'
      }));
      throw error;
    }
  }, [state.completedLessons.length, state.courses, onLessonComplete, onCourseComplete, onMilestone]);

  /**
   * Get lesson completion status
   */
  const getLessonCompletionStatus = useCallback(async (lessonId) => {
    const cacheKey = `lesson-${lessonId}`;
    
    // Check cache first
    if (cacheRef.current[cacheKey] && Date.now() - cacheRef.current[cacheKey].timestamp < 60000) {
      return cacheRef.current[cacheKey].data;
    }

    try {
      const response = await progressService.getLessonCompletionStatus(lessonId);
      
      // Cache the result
      cacheRef.current[cacheKey] = {
        data: response,
        timestamp: Date.now()
      };

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Get completed lessons
   */
  const fetchCompletedLessons = useCallback(async (courseId = null) => {
    try {
      const response = await progressService.getCompletedLessons(courseId);
      
      setState(prev => ({
        ...prev,
        completedLessons: response.completions || response
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch completed lessons'
      }));
      throw error;
    }
  }, []);

  /**
   * Update lesson progress (for partial completion)
   */
  const updateLessonProgress = useCallback(async (lessonId, progressData) => {
    try {
      const response = await progressService.updateLessonProgress(lessonId, progressData);
      
      // Clear lesson cache
      delete cacheRef.current[`lesson-${lessonId}`];
      
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Reset lesson completion
   */
  const resetLessonCompletion = useCallback(async (lessonId) => {
    try {
      const response = await progressService.resetLessonCompletion(lessonId);
      
      // Update state
      setState(prev => ({
        ...prev,
        completedLessons: prev.completedLessons.filter(lesson => lesson.lessonId !== lessonId)
      }));

      // Clear cache
      delete cacheRef.current[`lesson-${lessonId}`];
      
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to reset lesson completion'
      }));
      throw error;
    }
  }, []);

  /**
   * Refresh all progress data
   */
  const refreshProgressData = useCallback(async () => {
    try {
      // Clear cache
      cacheRef.current = {};
      
      await Promise.all([
        fetchDashboard(),
        fetchCompletedLessons()
      ]);
    } catch (error) {
      console.error('Error refreshing progress data:', error);
    }
  }, [fetchDashboard, fetchCompletedLessons]);

  /**
   * Get overall progress summary
   */
  const getOverallProgress = useCallback(() => {
    return progressUtils.calculateOverallProgress(state.courses);
  }, [state.courses]);

  /**
   * Get next lesson to study in a course
   */
  const getNextLesson = useCallback((courseId, lessons) => {
    return progressUtils.getNextLesson(lessons);
  }, []);

  /**
   * Get progress statistics
   */
  const getProgressStats = useCallback(() => {
    const overall = getOverallProgress();
    const recentCompletions = state.completedLessons
      .slice(0, 10)
      .map(completion => progressUtils.formatCompletionData(completion));

    return {
      ...overall,
      summary: state.summary,
      recentCompletions,
      studyVelocity: progressUtils.calculateStudyVelocity(state.completedLessons),
      insights: progressUtils.getLearningInsights({
        studyVelocity: progressUtils.calculateStudyVelocity(state.completedLessons),
        completionRate: overall.totalLessons > 0 ? 
          (overall.completedLessons / overall.totalLessons) * 100 : 0
      })
    };
  }, [state.completedLessons, state.summary, getOverallProgress]);

  // Initial data fetch
  useEffect(() => {
    if (autoFetch) {
      refreshProgressData();
    }
  }, [autoFetch, refreshProgressData]);

  return {
    // State
    ...state,
    
    // Actions
    fetchDashboard,
    fetchAllCourseProgress,
    fetchCourseProgress,
    completeLesson,
    getLessonCompletionStatus,
    fetchCompletedLessons,
    updateLessonProgress,
    resetLessonCompletion,
    refreshProgressData,

    // Computed values
    overallProgress: getOverallProgress(),
    progressStats: getProgressStats(),
    isLoading: state.loading,
    
    // Utilities
    getNextLesson,
    formatCompletionData: progressUtils.formatCompletionData,
    getProgressBadge: progressUtils.getProgressBadge,
    groupLessonsByStatus: progressUtils.groupLessonsByStatus
  };
};

/**
 * Course Progress Hook
 * Specialized hook for individual course progress
 */
export const useCourseProgress = (courseId, options = {}) => {
  const { autoFetch = true, lessons = [] } = options;
  
  const [courseProgress, setCourseProgress] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch course progress
   */
  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await progressService.getCourseProgress(courseId);
      setCourseProgress(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch course progress');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  /**
   * Fetch lesson progress for all lessons in course
   */
  const fetchLessonProgress = useCallback(async () => {
    if (!lessons.length) return;

    try {
      const progressPromises = lessons.map(lesson => 
        progressService.getLessonCompletionStatus(lesson.id)
          .then(status => ({ lessonId: lesson.id, ...status }))
          .catch(() => ({ lessonId: lesson.id, isCompleted: false }))
      );

      const results = await Promise.all(progressPromises);
      const progressMap = {};
      
      results.forEach(result => {
        progressMap[result.lessonId] = result;
      });

      setLessonProgress(progressMap);
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
    }
  }, [lessons]);

  /**
   * Complete lesson and update progress
   */
  const completeLesson = useCallback(async (lessonId, completionData = {}) => {
    try {
      const response = await progressService.completLesson(lessonId, completionData);
      
      // Update course progress
      setCourseProgress(response.courseProgress);
      
      // Update lesson progress
      setLessonProgress(prev => ({
        ...prev,
        [lessonId]: {
          isCompleted: true,
          completion: response.completion
        }
      }));

      return response;
    } catch (error) {
      setError(error.message || 'Failed to complete lesson');
      throw error;
    }
  }, []);

  /**
   * Get next lesson to study
   */
  const getNextLesson = useCallback(() => {
    if (!lessons.length) return null;
    
    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson,
      isCompleted: lessonProgress[lesson.id]?.isCompleted || false
    }));

    return progressUtils.getNextLesson(lessonsWithProgress);
  }, [lessons, lessonProgress]);

  /**
   * Get lesson completion percentage
   */
  const getCompletionPercentage = useCallback(() => {
    if (!lessons.length) return 0;
    
    const completedCount = lessons.filter(lesson => 
      lessonProgress[lesson.id]?.isCompleted
    ).length;

    return Math.round((completedCount / lessons.length) * 100);
  }, [lessons, lessonProgress]);

  /**
   * Get lessons grouped by status
   */
  const getLessonsGrouped = useCallback(() => {
    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson,
      isCompleted: lessonProgress[lesson.id]?.isCompleted || false,
      completion: lessonProgress[lesson.id]?.completion || null
    }));

    return progressUtils.groupLessonsByStatus(lessonsWithProgress);
  }, [lessons, lessonProgress]);

  // Fetch data when courseId or lessons change
  useEffect(() => {
    if (autoFetch && courseId) {
      fetchProgress();
    }
  }, [autoFetch, courseId, fetchProgress]);

  useEffect(() => {
    if (autoFetch && lessons.length > 0) {
      fetchLessonProgress();
    }
  }, [autoFetch, lessons, fetchLessonProgress]);

  return {
    // State
    courseProgress,
    lessonProgress,
    loading,
    error,

    // Actions
    fetchProgress,
    fetchLessonProgress,
    completeLesson,

    // Computed values
    completionPercentage: getCompletionPercentage(),
    nextLesson: getNextLesson(),
    lessonsGrouped: getLessonsGrouped(),
    isCompleted: courseProgress?.isCompleted || false,
    progressBadge: progressUtils.getProgressBadge(getCompletionPercentage())
  };
};

/**
 * Lesson Progress Hook
 * Specialized hook for individual lesson progress tracking
 */
export const useLessonProgress = (lessonId, options = {}) => {
  const { autoFetch = true, trackVideo = false, trackReading = false } = options;
  
  const [progress, setProgress] = useState({
    isCompleted: false,
    completion: null,
    videoProgress: 0,
    readingProgress: 0,
    timeSpent: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const timeTracker = useRef({ startTime: null, totalTime: 0 });

  /**
   * Fetch lesson progress
   */
  const fetchProgress = useCallback(async () => {
    if (!lessonId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await progressService.getLessonCompletionStatus(lessonId);
      setProgress(prev => ({
        ...prev,
        isCompleted: response.isCompleted,
        completion: response.completion
      }));
    } catch (err) {
      setError(err.message || 'Failed to fetch lesson progress');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  /**
   * Update video progress
   */
  const updateVideoProgress = useCallback(async (progressPercentage) => {
    if (!trackVideo || !lessonId) return;

    setProgress(prev => ({ ...prev, videoProgress: progressPercentage }));

    try {
      await progressService.updateLessonProgress(lessonId, {
        videoProgress: progressPercentage
      });
    } catch (error) {
      console.error('Failed to update video progress:', error);
    }
  }, [lessonId, trackVideo]);

  /**
   * Update reading progress
   */
  const updateReadingProgress = useCallback(async (progressPercentage) => {
    if (!trackReading || !lessonId) return;

    setProgress(prev => ({ ...prev, readingProgress: progressPercentage }));

    try {
      await progressService.updateLessonProgress(lessonId, {
        readingProgress: progressPercentage
      });
    } catch (error) {
      console.error('Failed to update reading progress:', error);
    }
  }, [lessonId, trackReading]);

  /**
   * Start time tracking
   */
  const startTimeTracking = useCallback(() => {
    timeTracker.current.startTime = Date.now();
  }, []);

  /**
   * Stop time tracking
   */
  const stopTimeTracking = useCallback(() => {
    if (timeTracker.current.startTime) {
      const elapsed = Date.now() - timeTracker.current.startTime;
      timeTracker.current.totalTime += elapsed;
      timeTracker.current.startTime = null;
      
      setProgress(prev => ({
        ...prev,
        timeSpent: Math.floor(timeTracker.current.totalTime / 1000)
      }));
    }
  }, []);

  /**
   * Complete the lesson
   */
  const completeLesson = useCallback(async (completionData = {}) => {
    try {
      // Stop time tracking
      stopTimeTracking();

      const finalCompletionData = {
        timeSpentSeconds: timeTracker.current.totalTime / 1000,
        videoProgress: progress.videoProgress,
        ...completionData
      };

      const response = await progressService.completLesson(lessonId, finalCompletionData);
      
      setProgress(prev => ({
        ...prev,
        isCompleted: true,
        completion: response.completion
      }));

      return response;
    } catch (error) {
      setError(error.message || 'Failed to complete lesson');
      throw error;
    }
  }, [lessonId, progress.videoProgress, stopTimeTracking]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && lessonId) {
      fetchProgress();
    }
  }, [autoFetch, lessonId, fetchProgress]);

  // Auto-start time tracking
  useEffect(() => {
    if (lessonId && !progress.isCompleted) {
      startTimeTracking();
      return stopTimeTracking;
    }
  }, [lessonId, progress.isCompleted, startTimeTracking, stopTimeTracking]);

  return {
    // State
    ...progress,
    loading,
    error,

    // Actions
    fetchProgress,
    updateVideoProgress,
    updateReadingProgress,
    completeLesson,
    startTimeTracking,
    stopTimeTracking,

    // Computed values
    overallProgress: Math.max(progress.videoProgress, progress.readingProgress),
    timeSpentFormatted: `${Math.floor(progress.timeSpent / 60)}m ${progress.timeSpent % 60}s`
  };
};

export default useProgress;
