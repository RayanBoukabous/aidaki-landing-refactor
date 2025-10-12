'use client'

import { useState, useCallback, useRef } from 'react';
import quizResponsesService from '../services/quizResponses';

export const useQuizResponses = () => {
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Prevent multiple simultaneous requests
  const isLoadingRef = useRef(false);

  // Start a new quiz attempt
  const startQuizAttempt = useCallback(async (quizId) => {
    if (isLoadingRef.current) return null;
    
    setLoading(true);
    setError(null);
    isLoadingRef.current = true;
    
    try {
      const attempt = await quizResponsesService.startAttempt(quizId);
      setCurrentAttempt(attempt);
      return attempt;
    } catch (err) {
      setError(err.message || 'Erreur lors du démarrage du quiz');
      return null;
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // Submit answers based on question type
  const submitAnswer = useCallback(async (answerData) => {
    if (submitting) return null;
    
    setSubmitting(true);
    setError(null);
    try {
      const { questionType, ...data } = answerData;
      let response;

      switch (questionType) {
        case 'MULTI_CHOICE':
          response = await quizResponsesService.submitMultipleChoice(
            data.attemptId,
            data.questionId,
            data.selectedOption,
            data.timeSpent
          );
          break;
        case 'TRUE_FALSE':
          response = await quizResponsesService.submitTrueFalse(
            data.attemptId,
            data.questionId,
            data.selectedAnswer,
            data.timeSpent
          );
          break;
        case 'FILL_IN_THE_BLANK':
          response = await quizResponsesService.submitFillInBlank(
            data.attemptId,
            data.questionId,
            data.userAnswer,
            data.timeSpent
          );
          break;
        case 'MATCHING':
          response = await quizResponsesService.submitMatching(
            data.attemptId,
            data.questionId,
            data.userMatches,
            data.timeSpent
          );
          break;
        default:
          throw new Error(`Type de question non supporté: ${questionType}`);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la soumission de la réponse');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [submitting]);

  // Complete the current attempt
  const completeQuizAttempt = useCallback(async (attemptId, totalTimeSpent) => {
    if (isLoadingRef.current) return null;
    
    setLoading(true);
    setError(null);
    isLoadingRef.current = true;
    
    try {
      const result = await quizResponsesService.completeAttempt(attemptId, totalTimeSpent);
      setCurrentAttempt(null);
      return result;
    } catch (err) {
      setError(err.message || 'Erreur lors de la finalisation du quiz');
      return null;
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // Get attempt details
  const getAttemptDetails = useCallback(async (attemptId) => {
    if (isLoadingRef.current) return null;
    
    setLoading(true);
    setError(null);
    try {
      const attempt = await quizResponsesService.getAttemptDetails(attemptId);
      return attempt;
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des détails de la tentative');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user attempts - FIXED: removed attempts dependency to prevent loops
  const fetchUserAttempts = useCallback(async (quizId = null, forceRefresh = false) => {
    if (isLoadingRef.current && !forceRefresh) return;
    
    setLoading(true);
    setError(null);
    isLoadingRef.current = true;
    
    try {
      const userAttempts = await quizResponsesService.getUserAttempts(quizId);
      
      // Handle different response structures
      let attemptsData = [];
      if (Array.isArray(userAttempts)) {
        attemptsData = userAttempts;
      } else if (userAttempts && userAttempts.data && Array.isArray(userAttempts.data)) {
        attemptsData = userAttempts.data;
      } else if (userAttempts && userAttempts.attempts && Array.isArray(userAttempts.attempts)) {
        attemptsData = userAttempts.attempts;
      }

      setAttempts(attemptsData);
      return attemptsData;
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération de l\'historique des tentatives');
      return [];
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []); // NO dependencies to prevent loops

  // Get quiz statistics for a user
  const getQuizStatistics = useCallback((quizId) => {
    const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);
    
    if (quizAttempts.length === 0) {
      return {
        totalAttempts: 0,
        bestScore: 0,
        averageScore: 0,
        lastAttempted: null,
        completed: 0
      };
    }

    const completedAttempts = quizAttempts.filter(attempt => attempt.status === 'COMPLETED');
    const scores = completedAttempts.map(attempt => attempt.score || 0);
    const bestScore = Math.max(...scores, 0);
    const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    const lastAttempted = quizAttempts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt;

    return {
      totalAttempts: quizAttempts.length,
      bestScore: Math.round(bestScore * 100) / 100,
      averageScore: Math.round(averageScore * 100) / 100,
      lastAttempted,
      completed: completedAttempts.length
    };
  }, [attempts]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset current attempt
  const resetCurrentAttempt = useCallback(() => {
    setCurrentAttempt(null);
  }, []);

  return {
    // State
    attempts,
    currentAttempt,
    loading,
    error,
    submitting,

    // Actions
    startQuizAttempt,
    submitAnswer,
    completeQuizAttempt,
    getAttemptDetails,
    fetchUserAttempts,
    getQuizStatistics,
    clearError,
    resetCurrentAttempt,

    // Utilities
    setCurrentAttempt,
    setAttempts
  };
};
