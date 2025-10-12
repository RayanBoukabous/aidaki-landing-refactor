/**
 * Quiz utilities and helper functions
 */

// Question types enum
export const QUESTION_TYPES = {
  MULTI_CHOICE: 'MULTI_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  FILL_IN_THE_BLANK: 'FILL_IN_THE_BLANK',
  MATCHING: 'MATCHING'
};

// Quiz attempt status enum
export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED'
};

// Grade thresholds
export const GRADE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
  NEEDS_IMPROVEMENT: 0
};

/**
 * Calculate grade based on score percentage
 * @param {number} score - Score percentage (0-100)
 * @returns {string} Grade level
 */
export const calculateGrade = (score) => {
  if (score >= GRADE_THRESHOLDS.EXCELLENT) return 'excellent';
  if (score >= GRADE_THRESHOLDS.GOOD) return 'good';
  if (score >= GRADE_THRESHOLDS.AVERAGE) return 'average';
  return 'needsImprovement';
};

/**
 * Get color class for grade
 * @param {string} grade - Grade level
 * @returns {string} CSS color class
 */
export const getGradeColor = (grade) => {
  const colors = {
    excellent: 'text-green-600 bg-green-50',
    good: 'text-blue-600 bg-blue-50',
    average: 'text-yellow-600 bg-yellow-50',
    needsImprovement: 'text-red-600 bg-red-50'
  };
  return colors[grade] || colors.needsImprovement;
};

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time string
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format short time duration (for displays)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Short formatted time string
 */
export const formatShortDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;
  return Math.round((part / total) * 100);
};

/**
 * Validate quiz answer based on question type
 * @param {string} questionType - Type of question
 * @param {any} answer - Answer to validate
 * @returns {boolean} Whether answer is valid
 */
export const validateAnswer = (questionType, answer) => {
  switch (questionType) {
    case QUESTION_TYPES.MULTI_CHOICE:
      return typeof answer === 'number' && answer >= 0;
    case QUESTION_TYPES.TRUE_FALSE:
      return typeof answer === 'boolean' || (typeof answer === 'number' && (answer === 0 || answer === 1));
    case QUESTION_TYPES.FILL_IN_THE_BLANK:
      return typeof answer === 'string' && answer.trim().length > 0;
    case QUESTION_TYPES.MATCHING:
      return Array.isArray(answer) && answer.length > 0;
    default:
      return false;
  }
};

/**
 * Transform frontend quiz data to API format
 * @param {object} quizData - Frontend quiz data
 * @param {function} t - Translation function
 * @returns {object} Transformed quiz data
 */
export const transformQuizForAPI = (quizData, t) => {
  if (!quizData) return null;

  const transformedQuestions = [];

  // Transform multiple choice questions
  if (quizData.multipleChoiceQuestions) {
    quizData.multipleChoiceQuestions.forEach((mcq) => {
      transformedQuestions.push({
        id: mcq.id,
        type: "multiple-choice",
        question: mcq.question,
        options: [
          mcq.options.a,
          mcq.options.b,
          mcq.options.c,
          mcq.options.d,
        ].filter(Boolean),
        correctAnswer: ["a", "b", "c", "d"].indexOf(mcq.correctAnswer),
        explanation: `${t("lesson.quiz.correctAnswer")}: ${
          mcq.options[mcq.correctAnswer]
        }`,
      });
    });
  }

  // Transform true/false questions
  if (quizData.trueFalseQuestions) {
    quizData.trueFalseQuestions.forEach((tfq) => {
      transformedQuestions.push({
        id: tfq.id,
        type: "true-false",
        question: tfq.question,
        options: [t("lesson.quiz.true"), t("lesson.quiz.false")],
        correctAnswer: tfq.correctAnswer ? 0 : 1,
        explanation: `${t("lesson.quiz.correctAnswer")}: ${
          tfq.correctAnswer ? t("lesson.quiz.true") : t("lesson.quiz.false")
        }`,
      });
    });
  }

  return {
    title: quizData.title || t("lesson.quiz.title"),
    description: quizData.description || t("lesson.quiz.description"),
    timeLimit: quizData.timeLimit || 300,
    questions: transformedQuestions,
  };
};

/**
 * Calculate quiz statistics from attempts array
 * @param {Array} attempts - Array of quiz attempts
 * @param {number} quizId - Optional quiz ID to filter by
 * @returns {object} Calculated statistics
 */
export const calculateQuizStatistics = (attempts, quizId = null) => {
  const filteredAttempts = quizId 
    ? attempts.filter(attempt => attempt.quizId === quizId)
    : attempts;

  if (filteredAttempts.length === 0) {
    return {
      totalAttempts: 0,
      bestScore: 0,
      averageScore: 0,
      lastAttempted: null,
      completed: 0,
      completionRate: 0,
      averageTime: 0,
      bestTime: 0,
      consistency: 0,
      trend: 0
    };
  }

  const completedAttempts = filteredAttempts.filter(attempt => attempt.status === ATTEMPT_STATUS.COMPLETED);
  const scores = completedAttempts.map(attempt => attempt.score || 0);
  const times = completedAttempts.map(attempt => attempt.timeSpent || 0);

  const totalAttempts = filteredAttempts.length;
  const completed = completedAttempts.length;
  const bestScore = Math.max(...scores, 0);
  const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  const completionRate = totalAttempts > 0 ? (completed / totalAttempts) * 100 : 0;
  const averageTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
  const bestTime = times.length > 0 ? Math.min(...times) : 0;

  // Calculate consistency (inverse of standard deviation)
  const variance = scores.length > 1 
    ? scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length
    : 0;
  const standardDeviation = Math.sqrt(variance);
  const consistency = Math.max(0, 100 - standardDeviation);

  // Calculate trend (comparing recent scores with older ones)
  const recentAttempts = completedAttempts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const olderAttempts = completedAttempts
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 3);

  let trend = 0;
  if (recentAttempts.length > 0 && olderAttempts.length > 0) {
    const recentAvg = recentAttempts.reduce((sum, att) => sum + (att.score || 0), 0) / recentAttempts.length;
    const olderAvg = olderAttempts.reduce((sum, att) => sum + (att.score || 0), 0) / olderAttempts.length;
    trend = recentAvg - olderAvg;
  }

  const lastAttempted = filteredAttempts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt;

  return {
    totalAttempts,
    bestScore: Math.round(bestScore * 100) / 100,
    averageScore: Math.round(averageScore * 100) / 100,
    lastAttempted,
    completed,
    completionRate: Math.round(completionRate * 100) / 100,
    averageTime: Math.round(averageTime),
    bestTime: Math.round(bestTime),
    consistency: Math.round(consistency * 100) / 100,
    trend: Math.round(trend * 100) / 100
  };
};

/**
 * Get performance level based on statistics
 * @param {object} stats - Quiz statistics
 * @returns {object} Performance level info
 */
export const getPerformanceLevel = (stats) => {
  const { averageScore, consistency, completionRate } = stats;
  
  // Calculate overall performance score
  const performanceScore = (averageScore * 0.5) + (consistency * 0.3) + (completionRate * 0.2);
  
  if (performanceScore >= 85) {
    return {
      level: 'expert',
      color: 'text-purple-600 bg-purple-50',
      icon: '👑',
      description: 'Expert Level'
    };
  } else if (performanceScore >= 70) {
    return {
      level: 'advanced',
      color: 'text-green-600 bg-green-50',
      icon: '🎯',
      description: 'Advanced'
    };
  } else if (performanceScore >= 50) {
    return {
      level: 'intermediate',
      color: 'text-blue-600 bg-blue-50',
      icon: '📈',
      description: 'Intermediate'
    };
  } else {
    return {
      level: 'beginner',
      color: 'text-yellow-600 bg-yellow-50',
      icon: '🌱',
      description: 'Beginner'
    };
  }
};

/**
 * Generate study recommendations based on quiz performance
 * @param {object} stats - Quiz statistics
 * @param {function} t - Translation function
 * @returns {Array} Array of recommendations
 */
export const generateStudyRecommendations = (stats, t) => {
  const recommendations = [];
  const { averageScore, consistency, completionRate, trend } = stats;

  if (averageScore < 70) {
    recommendations.push({
      type: 'review',
      icon: '📚',
      title: t('quiz.recommendations.reviewContent'),
      description: t('quiz.recommendations.reviewContentDesc')
    });
  }

  if (consistency < 60) {
    recommendations.push({
      type: 'practice',
      icon: '🎯',
      title: t('quiz.recommendations.practiceMore'),
      description: t('quiz.recommendations.practiceMoreDesc')
    });
  }

  if (completionRate < 80) {
    recommendations.push({
      type: 'focus',
      icon: '⏰',
      title: t('quiz.recommendations.improveTime'),
      description: t('quiz.recommendations.improveTimeDesc')
    });
  }

  if (trend < -10) {
    recommendations.push({
      type: 'motivation',
      icon: '💪',
      title: t('quiz.recommendations.stayMotivated'),
      description: t('quiz.recommendations.stayMotivatedDesc')
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'excellence',
      icon: '🌟',
      title: t('quiz.recommendations.keepItUp'),
      description: t('quiz.recommendations.keepItUpDesc')
    });
  }

  return recommendations;
};

/**
 * Local storage utilities for quiz data
 */
export const quizStorage = {
  /**
   * Save quiz progress to local storage
   * @param {string} quizId - Quiz ID
   * @param {object} progress - Progress data
   */
  saveProgress: (quizId, progress) => {
    try {
      localStorage.setItem(`quiz_progress_${quizId}`, JSON.stringify({
        ...progress,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Could not save quiz progress to localStorage:', error);
    }
  },

  /**
   * Load quiz progress from local storage
   * @param {string} quizId - Quiz ID
   * @returns {object|null} Progress data or null
   */
  loadProgress: (quizId) => {
    try {
      const data = localStorage.getItem(`quiz_progress_${quizId}`);
      if (data) {
        const progress = JSON.parse(data);
        // Check if progress is not too old (24 hours)
        if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
          return progress;
        } else {
          // Remove old progress
          localStorage.removeItem(`quiz_progress_${quizId}`);
        }
      }
    } catch (error) {
      console.warn('Could not load quiz progress from localStorage:', error);
    }
    return null;
  },

  /**
   * Clear quiz progress from local storage
   * @param {string} quizId - Quiz ID
   */
  clearProgress: (quizId) => {
    try {
      localStorage.removeItem(`quiz_progress_${quizId}`);
    } catch (error) {
      console.warn('Could not clear quiz progress from localStorage:', error);
    }
  }
};

/**
 * Quiz validation utilities
 */
export const quizValidation = {
  /**
   * Validate quiz configuration
   * @param {object} quiz - Quiz object
   * @returns {object} Validation result
   */
  validateQuiz: (quiz) => {
    const errors = [];

    if (!quiz.title || quiz.title.trim().length === 0) {
      errors.push('Quiz title is required');
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      errors.push('Quiz must have at least one question');
    }

    if (quiz.timeLimit && quiz.timeLimit < 30) {
      errors.push('Time limit must be at least 30 seconds');
    }

    quiz.questions?.forEach((question, index) => {
      if (!question.question || question.question.trim().length === 0) {
        errors.push(`Question ${index + 1} is missing question text`);
      }

      if (question.type === 'multiple-choice' && (!question.options || question.options.length < 2)) {
        errors.push(`Question ${index + 1} must have at least 2 options`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate quiz attempt
   * @param {object} attempt - Attempt object
   * @returns {object} Validation result
   */
  validateAttempt: (attempt) => {
    const errors = [];

    if (!attempt.quizId) {
      errors.push('Quiz ID is required');
    }

    if (!attempt.userId) {
      errors.push('User ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default {
  QUESTION_TYPES,
  ATTEMPT_STATUS,
  GRADE_THRESHOLDS,
  calculateGrade,
  getGradeColor,
  formatDuration,
  formatShortDuration,
  calculatePercentage,
  validateAnswer,
  transformQuizForAPI,
  calculateQuizStatistics,
  getPerformanceLevel,
  generateStudyRecommendations,
  quizStorage,
  quizValidation
};
