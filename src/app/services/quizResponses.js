'use client'

import api from './api';
import { jwtDecode } from 'jwt-decode';

// Helper function to get current user ID from JWT token
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const decoded = jwtDecode(token);
    return decoded.userId || decoded.id || decoded.sub;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    throw new Error('Could not get current user ID');
  }
};

// Quiz Responses Service - API calls for quiz functionality
class QuizResponsesService {
  // Start a new quiz attempt
  async startAttempt(quizId) {
    try {
      const userId = getCurrentUserId();
      const response = await api.post('/quiz-responses/start-attempt', {
        quizId,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      throw error;
    }
  }

  // Submit multiple choice answer
  async submitMultipleChoice(attemptId, questionId, selectedOption, timeSpent) {
    try {
      const response = await api.post('/quiz-responses/submit-multiple-choice', {
        attemptId,
        questionId,
        questionType: 'MULTI_CHOICE',
        selectedOption,
        timeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting multiple choice answer:', error);
      throw error;
    }
  }

  // Submit true/false answer
  async submitTrueFalse(attemptId, questionId, selectedAnswer, timeSpent) {
    try {
      const response = await api.post('/quiz-responses/submit-true-false', {
        attemptId,
        questionId,
        questionType: 'TRUE_FALSE',
        selectedAnswer,
        timeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting true/false answer:', error);
      throw error;
    }
  }

  // Submit fill-in-blank answer
  async submitFillInBlank(attemptId, questionId, userAnswer, timeSpent) {
    try {
      const response = await api.post('/quiz-responses/submit-fill-in-blank', {
        attemptId,
        questionId,
        questionType: 'FILL_IN_THE_BLANK',
        userAnswer,
        timeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting fill-in-blank answer:', error);
      throw error;
    }
  }

  // Submit matching answer
  async submitMatching(attemptId, questionId, userMatches, timeSpent) {
    try {
      const response = await api.post('/quiz-responses/submit-matching', {
        attemptId,
        questionId,
        questionType: 'MATCHING',
        userMatches,
        timeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting matching answer:', error);
      throw error;
    }
  }

  // Complete quiz attempt
  async completeAttempt(attemptId, totalTimeSpent) {
    try {
      const response = await api.put('/quiz-responses/complete-attempt', {
        attemptId,
        totalTimeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error completing quiz attempt:', error);
      throw error;
    }
  }

  // Get attempt details
  async getAttemptDetails(attemptId) {
    try {
      const response = await api.get(`/quiz-responses/attempt/${attemptId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attempt details:', error);
      throw error;
    }
  }

  // Get user attempts (all or filtered by quiz ID)
  async getUserAttempts(quizId = null) {
    try {
      const url = quizId 
        ? `/quiz-responses/user-attempts?quizId=${quizId}`
        : '/quiz-responses/user-attempts';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user attempts:', error);
      throw error;
    }
  }

  // Get quiz statistics for a user
  async getQuizStatistics(quizId) {
    try {
      const response = await api.get(`/quiz-responses/statistics/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
      throw error;
    }
  }

  // Get leaderboard for a quiz
  async getQuizLeaderboard(quizId, limit = 10) {
    try {
      const response = await api.get(`/quiz-responses/leaderboard/${quizId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz leaderboard:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const quizResponsesService = new QuizResponsesService();

// Export the service instance as default
export default quizResponsesService;

// Named exports for direct function access
export const {
  startAttempt,
  submitMultipleChoice,
  submitTrueFalse,
  submitFillInBlank,
  submitMatching,
  completeAttempt,
  getAttemptDetails,
  getUserAttempts,
  getQuizStatistics,
  getQuizLeaderboard,
} = quizResponsesService;

// Export the service class for testing
export { QuizResponsesService };
