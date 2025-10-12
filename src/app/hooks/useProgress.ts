'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Progress Hook
 * Manages overall learning progress and course completion
 */
export const useProgress = (options = {}) => {
  const {
    autoFetch = true,
    onLessonComplete = null,
    onCourseComplete = null,
    onMilestone = null
  } = options;

  const [state, setState] = useState({
    overallProgress: null,
    progressStats: null,
    loading: false,
    error: null,
    lastFetch: null
  });

  // Memoize callbacks to prevent infinite re-renders
  const memoizedOnLessonComplete = useCallback((completion, courseProgress) => {
    if (onLessonComplete) {
      onLessonComplete(completion, courseProgress);
    }
  }, [onLessonComplete]);

  const memoizedOnCourseComplete = useCallback((courseProgress, notification) => {
    if (onCourseComplete) {
      onCourseComplete(courseProgress, notification);
    }
  }, [onCourseComplete]);

  const memoizedOnMilestone = useCallback((milestone) => {
    if (onMilestone) {
      onMilestone(milestone);
    }
  }, [onMilestone]);

  /**
   * Calculate overall progress from stored data
   */
  const calculateOverallProgress = useCallback(() => {
    try {
      const completions = JSON.parse(localStorage.getItem('lesson_completions') || '{}');
      const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
      
      // Mock course data (in real app, this would come from API)
      const mockCourses = [
        { id: 1, title: 'React Fundamentals', totalLessons: 10 },
        { id: 2, title: 'Advanced JavaScript', totalLessons: 8 },
        { id: 3, title: 'Node.js Backend', totalLessons: 12 },
        { id: 4, title: 'Database Design', totalLessons: 6 },
        { id: 5, title: 'DevOps Basics', totalLessons: 9 }
      ];

      const totalLessons = mockCourses.reduce((sum, course) => sum + course.totalLessons, 0);
      const completedLessons = Object.keys(completions).length;
      
      // Calculate course progress
      const courseProgress = mockCourses.map(course => {
        const courseLessons = Object.values(completions).filter((completion: any) => 
          completion.lessonId >= (course.id - 1) * 10 + 1 && 
          completion.lessonId <= course.id * 10
        );
        
        const completedInCourse = courseLessons.length;
        const progressPercentage = Math.round((completedInCourse / course.totalLessons) * 100);
        
        return {
          ...course,
          completedLessons: completedInCourse,
          progressPercentage,
          isCompleted: completedInCourse >= course.totalLessons
        };
      });

      const completedCourses = courseProgress.filter(course => course.isCompleted).length;
      const inProgressCourses = courseProgress.filter(course => 
        course.completedLessons > 0 && !course.isCompleted
      ).length;

      const averageProgress = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      // Calculate study statistics
      const totalStudyTime = sessions.reduce((total, session) => total + (session.duration || 0), 0);
      const averageQuizScore = Object.values(completions)
        .map((c: any) => c.quizScore)
        .filter(score => score !== null && score !== undefined)
        .reduce((sum, score, _, arr) => arr.length > 0 ? sum + score / arr.length : 0, 0);

      return {
        totalCourses: mockCourses.length,
        completedCourses,
        inProgressCourses,
        totalLessons,
        completedLessons,
        averageProgress,
        courseProgress,
        totalStudyTime: Math.floor(totalStudyTime / 60), // Convert to minutes
        averageQuizScore: Math.round(averageQuizScore)
      };
    } catch (error) {
      console.error('Error calculating progress:', error);
      return {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        averageProgress: 0,
        courseProgress: [],
        totalStudyTime: 0,
        averageQuizScore: 0
      };
    }
  }, []);

  /**
   * Refresh progress data
   */
  const refreshProgressData = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (state.loading) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const progressData = calculateOverallProgress();
      
      setState(prev => ({
        ...prev,
        overallProgress: progressData,
        progressStats: {
          totalStudyTime: progressData.totalStudyTime,
          averageQuizScore: progressData.averageQuizScore,
          completionRate: progressData.averageProgress,
          coursesInProgress: progressData.inProgressCourses
        },
        loading: false,
        lastFetch: Date.now()
      }));

    } catch (error) {
      console.error('Error refreshing progress data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to refresh progress data',
        loading: false
      }));
    }
  }, [state.loading, calculateOverallProgress]);

  /**
   * Complete a lesson
   */
  const completeLesson = useCallback(async (lessonId, completionData = {}) => {
    try {
      const completion = {
        lessonId,
        completedAt: new Date().toISOString(),
        timeSpentSeconds: completionData.timeSpentSeconds || 0,
        quizScore: completionData.quizScore || null,
        videoProgress: completionData.videoProgress || 0,
        readingProgress: completionData.readingProgress || 0
      };

      // Save completion
      const completions = JSON.parse(localStorage.getItem('lesson_completions') || '{}');
      completions[lessonId] = completion;
      localStorage.setItem('lesson_completions', JSON.stringify(completions));

      // Refresh progress data
      await refreshProgressData();

      // Get updated course progress
      const updatedProgress = calculateOverallProgress();
      const courseId = Math.ceil(lessonId / 10); // Simple course mapping
      const courseProgress = updatedProgress.courseProgress.find(c => c.id === courseId);

      // Trigger lesson complete callback
      memoizedOnLessonComplete(completion, courseProgress);

      // Check for course completion
      if (courseProgress && courseProgress.isCompleted) {
        const notification = {
          title: `Course Complete! 🎉`,
          message: `Congratulations! You've completed ${courseProgress.title}!`
        };
        memoizedOnCourseComplete(courseProgress, notification);
      }

      // Check for milestones
      checkProgressMilestones(updatedProgress);

      return completion;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  }, [refreshProgressData, calculateOverallProgress, memoizedOnLessonComplete, memoizedOnCourseComplete]);

  /**
   * Check for progress milestones
   */
  const checkProgressMilestones = useCallback((progressData) => {
    const milestones = [
      { lessons: 5, title: 'First 5 Lessons!', message: 'Great start! You\'re building momentum!' },
      { lessons: 10, title: '10 Lessons Complete!', message: 'You\'re making excellent progress!' },
      { lessons: 25, title: 'Quarter Century!', message: '25 lessons down! You\'re on fire!' },
      { lessons: 50, title: 'Half Century Hero!', message: '50 lessons completed! Incredible dedication!' },
      { lessons: 100, title: 'Century Club!', message: '100 lessons! You\'re a learning machine! 🚀' }
    ];

    const milestone = milestones.find(m => m.lessons === progressData.completedLessons);
    if (milestone) {
      memoizedOnMilestone(milestone);
    }
  }, [memoizedOnMilestone]);

  /**
   * Get course progress by course ID
   */
  const getCourseProgress = useCallback((courseId) => {
    if (!state.overallProgress) return null;
    return state.overallProgress.courseProgress.find(course => course.id === courseId);
  }, [state.overallProgress]);

  /**
   * Get lesson completion status
   */
  const getLessonCompletion = useCallback((lessonId) => {
    const completions = JSON.parse(localStorage.getItem('lesson_completions') || '{}');
    return completions[lessonId] || null;
  }, []);

  // Auto-fetch on mount (only once)
  useEffect(() => {
    if (autoFetch && !state.lastFetch) {
      refreshProgressData();
    }
  }, [autoFetch, state.lastFetch, refreshProgressData]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // Current state
    overallProgress: state.overallProgress,
    progressStats: state.progressStats,
    loading: state.loading,
    error: state.error,
    
    // Actions
    refreshProgressData,
    completeLesson,
    
    // Utilities
    getCourseProgress,
    getLessonCompletion,
    calculateOverallProgress
  }), [
    state.overallProgress,
    state.progressStats,
    state.loading,
    state.error,
    refreshProgressData,
    completeLesson,
    getCourseProgress,
    getLessonCompletion,
    calculateOverallProgress
  ]);
};

export default useProgress;
