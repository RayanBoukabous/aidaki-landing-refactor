'use client'

import api from './api';

/**
 * Progress Service
 * Handles course progress, lesson completion, and dashboard data
 */
export const progressService = {
  /**
   * Mark a lesson as complete
   * @param {number} lessonId - The lesson ID to complete
   * @param {Object} completionData - { timeSpentSeconds?, quizScore?, videoProgress? }
   * @returns {Promise} API response with completion and course progress
   */
  async completLesson(lessonId, completionData = {}) {
    try {
      const response = await api.post(`/lessons/${lessonId}/complete`, completionData);
      return response.data;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  },

  /**
   * Check lesson completion status
   * @param {number} lessonId - The lesson ID to check
   * @returns {Promise} API response with completion status
   */
  async getLessonCompletionStatus(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}/completion-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson completion status:', error);
      throw error;
    }
  },

  /**
   * Get course progress for a specific course
   * @param {number} courseId - The course ID
   * @returns {Promise} API response with course progress
   */
  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/course-progress/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw error;
    }
  },

  /**
   * Get progress for all enrolled courses
   * @returns {Promise} API response with all course progress
   */
  async getAllCourseProgress() {
    try {
      const response = await api.get('/course-progress/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching all course progress:', error);
      throw error;
    }
  },

  /**
   * Get completed lessons for the user
   * @param {number} courseId - Optional course ID to filter by
   * @returns {Promise} API response with completed lessons
   */
  async getCompletedLessons(courseId = null) {
    try {
      const params = courseId ? { courseId } : {};
      const response = await api.get('/course-progress/completed-lessons', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching completed lessons:', error);
      throw error;
    }
  },

  /**
   * Get comprehensive progress dashboard data
   * @returns {Promise} API response with dashboard data
   */
  async getProgressDashboard() {
    try {
      const response = await api.get('/course-progress/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress dashboard:', error);
      throw error;
    }
  },

  /**
   * Get lesson progress within a course
   * @param {number} courseId - The course ID
   * @returns {Promise} API response with lesson progress
   */
  async getLessonProgress(courseId) {
    try {
      const response = await api.get(`/course-progress/lessons/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      throw error;
    }
  },

  /**
   * Update lesson progress (for video progress, reading progress, etc.)
   * @param {number} lessonId - The lesson ID
   * @param {Object} progressData - Progress data to update
   * @returns {Promise} API response
   */
  async updateLessonProgress(lessonId, progressData) {
    try {
      const response = await api.put(`/lessons/${lessonId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  },

  /**
   * Reset lesson completion (for retaking)
   * @param {number} lessonId - The lesson ID to reset
   * @returns {Promise} API response
   */
  async resetLessonCompletion(lessonId) {
    try {
      const response = await api.delete(`/lessons/${lessonId}/completion`);
      return response.data;
    } catch (error) {
      console.error('Error resetting lesson completion:', error);
      throw error;
    }
  },

  /**
   * Get user achievements and milestones
   * @returns {Promise} API response with achievements
   */
  async getAchievements() {
    try {
      const response = await api.get('/course-progress/achievements');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  /**
   * Get learning path progress
   * @param {number} pathId - Learning path ID
   * @returns {Promise} API response with path progress
   */
  async getLearningPathProgress(pathId) {
    try {
      const response = await api.get(`/course-progress/learning-path/${pathId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching learning path progress:', error);
      throw error;
    }
  }
};

/**
 * Progress Calculation Utilities
 * Helper functions for progress calculations and formatting
 */
export const progressUtils = {
  /**
   * Calculate course completion percentage
   * @param {number} completedLessons - Number of completed lessons
   * @param {number} totalLessons - Total number of lessons
   * @returns {number} Completion percentage (0-100)
   */
  calculateCourseProgress(completedLessons, totalLessons) {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  },

  /**
   * Calculate overall progress across multiple courses
   * @param {Array} courseProgresses - Array of course progress objects
   * @returns {Object} Overall progress summary
   */
  calculateOverallProgress(courseProgresses) {
    if (!courseProgresses || courseProgresses.length === 0) {
      return {
        averageProgress: 0,
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalLessons: 0,
        completedLessons: 0
      };
    }

    const totalCourses = courseProgresses.length;
    const completedCourses = courseProgresses.filter(course => course.isCompleted).length;
    const inProgressCourses = courseProgresses.filter(course => 
      course.progress > 0 && !course.isCompleted
    ).length;

    const totalLessons = courseProgresses.reduce((sum, course) => sum + course.totalLessons, 0);
    const completedLessons = courseProgresses.reduce((sum, course) => sum + course.completedLessons, 0);
    
    const averageProgress = courseProgresses.reduce((sum, course) => sum + course.progress, 0) / totalCourses;

    return {
      averageProgress: Math.round(averageProgress),
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalLessons,
      completedLessons
    };
  },

  /**
   * Get next lesson to study in a course
   * @param {Array} lessons - Array of lessons with completion status
   * @returns {Object|null} Next lesson to study
   */
  getNextLesson(lessons) {
    if (!lessons || lessons.length === 0) return null;
    
    // Find first incomplete lesson
    return lessons.find(lesson => !lesson.isCompleted) || null;
  },

  /**
   * Calculate estimated completion time
   * @param {number} remainingLessons - Number of remaining lessons
   * @param {number} averageLessonTime - Average time per lesson in minutes
   * @param {number} studyTimePerDay - Daily study time in minutes
   * @returns {Object} Estimation data
   */
  estimateCompletionTime(remainingLessons, averageLessonTime = 30, studyTimePerDay = 60) {
    if (remainingLessons === 0) {
      return { days: 0, weeks: 0, formattedTime: 'Already completed!' };
    }

    const totalTimeNeeded = remainingLessons * averageLessonTime;
    const daysNeeded = Math.ceil(totalTimeNeeded / studyTimePerDay);
    const weeksNeeded = Math.ceil(daysNeeded / 7);

    let formattedTime;
    if (daysNeeded === 1) {
      formattedTime = '1 day';
    } else if (daysNeeded < 7) {
      formattedTime = `${daysNeeded} days`;
    } else if (weeksNeeded === 1) {
      formattedTime = '1 week';
    } else if (weeksNeeded < 5) {
      formattedTime = `${weeksNeeded} weeks`;
    } else {
      const monthsNeeded = Math.ceil(weeksNeeded / 4);
      formattedTime = monthsNeeded === 1 ? '1 month' : `${monthsNeeded} months`;
    }

    return { days: daysNeeded, weeks: weeksNeeded, formattedTime };
  },

  /**
   * Get progress badge based on completion percentage
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Object} Badge information
   */
  getProgressBadge(progress) {
    if (progress === 100) {
      return { level: 'completed', color: 'green', icon: '🏆', text: 'Completed' };
    } else if (progress >= 75) {
      return { level: 'advanced', color: 'blue', icon: '⭐', text: 'Almost Done' };
    } else if (progress >= 50) {
      return { level: 'intermediate', color: 'yellow', icon: '💪', text: 'Making Progress' };
    } else if (progress >= 25) {
      return { level: 'beginner', color: 'orange', icon: '🚀', text: 'Getting Started' };
    } else if (progress > 0) {
      return { level: 'started', color: 'gray', icon: '📚', text: 'Just Started' };
    } else {
      return { level: 'not-started', color: 'light-gray', icon: '➡️', text: 'Not Started' };
    }
  },

  /**
   * Format completion data for display
   * @param {Object} completion - Completion object
   * @returns {Object} Formatted completion data
   */
  formatCompletionData(completion) {
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    };

    return {
      ...completion,
      formattedTimeSpent: completion.timeSpent ? formatTime(completion.timeSpent) : 'N/A',
      formattedCompletedAt: completion.completedAt ? 
        new Date(completion.completedAt).toLocaleDateString() : 'N/A',
      formattedQuizScore: completion.quizScore ? 
        `${Math.round(completion.quizScore)}%` : 'N/A'
    };
  },

  /**
   * Group lessons by status
   * @param {Array} lessons - Array of lessons with completion status
   * @returns {Object} Lessons grouped by status
   */
  groupLessonsByStatus(lessons) {
    if (!lessons || lessons.length === 0) {
      return { completed: [], inProgress: [], notStarted: [] };
    }

    return lessons.reduce((groups, lesson) => {
      if (lesson.isCompleted) {
        groups.completed.push(lesson);
      } else if (lesson.progress && lesson.progress > 0) {
        groups.inProgress.push(lesson);
      } else {
        groups.notStarted.push(lesson);
      }
      return groups;
    }, { completed: [], inProgress: [], notStarted: [] });
  },

  /**
   * Calculate study velocity (lessons per week)
   * @param {Array} completions - Array of recent completions
   * @param {number} weeks - Number of weeks to analyze (default: 4)
   * @returns {number} Average lessons completed per week
   */
  calculateStudyVelocity(completions, weeks = 4) {
    if (!completions || completions.length === 0) return 0;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));

    const recentCompletions = completions.filter(completion => 
      new Date(completion.completedAt) >= cutoffDate
    );

    return Math.round(recentCompletions.length / weeks * 10) / 10; // Round to 1 decimal
  },

  /**
   * Get learning insights based on progress data
   * @param {Object} progressData - User's progress data
   * @returns {Array} Array of insight objects
   */
  getLearningInsights(progressData) {
    const insights = [];

    if (progressData.studyVelocity > 0) {
      insights.push({
        type: 'velocity',
        message: `You're completing ${progressData.studyVelocity} lessons per week on average.`,
        suggestion: progressData.studyVelocity < 2 ? 
          'Try to increase your study pace to reach your goals faster.' : 
          'Great pace! Keep it up!'
      });
    }

    if (progressData.completionRate > 80) {
      insights.push({
        type: 'engagement',
        message: 'Excellent engagement! You complete most lessons you start.',
        suggestion: 'Consider taking on more challenging courses.'
      });
    } else if (progressData.completionRate < 50) {
      insights.push({
        type: 'engagement',
        message: 'You might be taking on too many courses at once.',
        suggestion: 'Focus on completing one course before starting another.'
      });
    }

    return insights;
  }
};

/**
 * Progress Notifications and Achievements
 * Handle progress-related notifications and milestone tracking
 */
export const progressNotifications = {
  /**
   * Check for lesson completion achievements
   * @param {number} totalCompletedLessons - Total lessons completed
   * @returns {Array} Achievement notifications
   */
  checkLessonMilestones(totalCompletedLessons) {
    const milestones = [1, 5, 10, 25, 50, 100, 250, 500];
    const achievements = [];

    milestones.forEach(milestone => {
      if (totalCompletedLessons === milestone) {
        achievements.push({
          id: `lesson-milestone-${milestone}`,
          type: 'achievement',
          title: `${milestone} Lessons Completed! 🎯`,
          message: `Congratulations! You've completed ${milestone} lessons.`,
          timestamp: Date.now()
        });
      }
    });

    return achievements;
  },

  /**
   * Check for course completion achievement
   * @param {string} courseName - Name of completed course
   * @param {number} totalCompletedCourses - Total courses completed
   * @returns {Object} Course completion notification
   */
  checkCourseCompletion(courseName, totalCompletedCourses) {
    return {
      id: `course-completed-${Date.now()}`,
      type: 'completion',
      title: 'Course Completed! 🏆',
      message: `Congratulations! You've completed "${courseName}". That's your ${totalCompletedCourses}${this.getOrdinalSuffix(totalCompletedCourses)} course!`,
      timestamp: Date.now()
    };
  },

  /**
   * Get ordinal suffix for numbers
   * @param {number} number - The number
   * @returns {string} Ordinal suffix (st, nd, rd, th)
   */
  getOrdinalSuffix(number) {
    const teen = number % 100;
    if (teen >= 11 && teen <= 13) return 'th';
    
    const unit = number % 10;
    switch (unit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  },

  /**
   * Generate progress summary notification
   * @param {Object} weeklyProgress - Weekly progress data
   * @returns {Object|null} Weekly summary notification
   */
  generateWeeklySummary(weeklyProgress) {
    if (!weeklyProgress || weeklyProgress.lessonsCompleted === 0) return null;

    return {
      id: `weekly-summary-${Date.now()}`,
      type: 'summary',
      title: 'Weekly Progress Summary 📊',
      message: `This week: ${weeklyProgress.lessonsCompleted} lessons completed, ${weeklyProgress.studyTime} minutes studied.`,
      timestamp: Date.now(),
      data: weeklyProgress
    };
  }
};

export default progressService;
