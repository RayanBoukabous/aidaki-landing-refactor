'use client'

import { useState, useCallback } from 'react';
import quizService from '../services/quiz';

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get quiz by ID with enhanced debugging
  const getQuizById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the quiz service instead of direct API call
      const response = await quizService.getQuizById(id);
      
      // Debug the quiz structure
      quizService.debugQuizStructure(response);
      
      // Validate quiz data
      const validation = quizService.validateQuizData(response);
      if (!validation.valid) {
        // Don't throw error, just warn - let the component handle it
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Une erreur est survenue lors de la récupération du quiz ${id}`;
      console.error('❌ useQuiz: Error in getQuizById:', {
        id,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
        errorMessage
      });
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quizzes with enhanced error handling
  const fetchQuizzes = useCallback(async (lessonId = null) => {
    console.log(`🔍 useQuiz: Fetching quizzes${lessonId ? ` for lesson ${lessonId}` : ' (all)'}`);
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (lessonId) {
        response = await quizService.getQuizzesByLessonId(lessonId);
      } else {
        response = await quizService.getAllQuizzes();
      }
      
      console.log('📊 useQuiz: Raw API Response:', response);
      
      // Determine which part of the response contains the quizzes array
      let quizzesData = [];
      if (response && Array.isArray(response)) {
        quizzesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        quizzesData = response.data;
      } else if (response && response.quizzes && Array.isArray(response.quizzes)) {
        quizzesData = response.quizzes;
      } else if (response && typeof response === 'object') {
        // Look for any array property that might contain quizzes
        const arrayProps = Object.keys(response).filter(key => Array.isArray(response[key]));
        if (arrayProps.length > 0) {
          quizzesData = response[arrayProps[0]];
          console.log(`📋 useQuiz: Found quizzes in property '${arrayProps[0]}'`);
        }
      }
      
      console.log(`✅ useQuiz: Processed ${quizzesData.length} quizzes from response`);
      setQuizzes(quizzesData);
      return response; // Return the complete response
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue lors du chargement des quiz';
      console.error('❌ useQuiz: Error fetching quizzes:', {
        lessonId,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
        errorMessage
      });
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create quiz
  const createQuiz = useCallback(async (quizData) => {
    console.log('🆕 useQuiz: Creating new quiz:', quizData);
    setLoading(true);
    setError(null);
    
    try {
      const response = await quizService.createQuiz(quizData);
      console.log('✅ useQuiz: Quiz created successfully:', response);
      
      // Refresh the list after creation
      await fetchQuizzes(quizData.lessonId);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue lors de la création du quiz';
      console.error('❌ useQuiz: Error creating quiz:', {
        quizData,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
        errorMessage
      });
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuizzes]);

  // Update quiz
  const updateQuiz = useCallback(async (id, data) => {
    console.log(`📝 useQuiz: Updating quiz ${id}:`, data);
    setLoading(true);
    setError(null);
    
    try {
      const response = await quizService.updateQuiz(id, data);
      console.log(`✅ useQuiz: Quiz ${id} updated successfully:`, response);
      
      // Refresh the list after update
      await fetchQuizzes(data.lessonId);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Une erreur est survenue lors de la mise à jour du quiz ${id}`;
      console.error('❌ useQuiz: Error updating quiz:', {
        id,
        data,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
        errorMessage
      });
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuizzes]);

  // Delete quiz
  const deleteQuiz = useCallback(async (id, lessonId = null) => {
    console.log(`🗑️ useQuiz: Deleting quiz ${id}`);
    setLoading(true);
    setError(null);
    
    try {
      const response = await quizService.deleteQuiz(id);
      console.log(`✅ useQuiz: Quiz ${id} deleted successfully:`, response);
      
      // Refresh the list after deletion
      await fetchQuizzes(lessonId);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Une erreur est survenue lors de la suppression du quiz ${id}`;
      console.error('❌ useQuiz: Error deleting quiz:', {
        id,
        lessonId,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
        errorMessage
      });
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuizzes]);

  // Get all quizzes (convenience method)
  const getAllQuizzes = useCallback(async () => {
    console.log('📚 useQuiz: Getting all quizzes');
    try {
      const response = await fetchQuizzes();
      return response?.quizzes || response?.data || response || [];
    } catch (err) {
      console.error('❌ useQuiz: Error in getAllQuizzes:', err);
      return [];
    }
  }, [fetchQuizzes]);

  // Get quiz with questions (enhanced method)
  const getQuizWithQuestions = useCallback(async (id) => {
    console.log(`🎯 useQuiz: Getting quiz with questions for ID: ${id}`);
    setLoading(true);
    setError(null);
    
    try {
      const response = await quizService.getQuizWithQuestions(id);
      
      // Debug and validate the response
      quizService.debugQuizStructure(response);
      const validation = quizService.validateQuizData(response);
      
      if (!validation.valid) {
        console.warn('⚠️ useQuiz: Quiz with questions validation failed:', validation.issues);
      }
      
      console.log('✅ useQuiz: Successfully retrieved quiz with questions');
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Une erreur est survenue lors de la récupération du quiz complet ${id}`;
      console.error('❌ useQuiz: Error in getQuizWithQuestions:', {
        id,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
        errorMessage
      });
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Debug hook state
  const debugHookState = useCallback(() => {
    console.log('🐛 useQuiz Hook State:', {
      quizzesCount: quizzes.length,
      loading,
      error,
      quizzes: quizzes.slice(0, 3) // Only show first 3 for brevity
    });
  }, [quizzes, loading, error]);

  return {
    // State
    quizzes,
    loading,
    error,

    // Actions
    fetchQuizzes,
    createQuiz,
    getQuizById,
    getQuizWithQuestions,
    updateQuiz,
    deleteQuiz, 
    getAllQuizzes,
    clearError,

    // Debug
    debugHookState
  };
};
