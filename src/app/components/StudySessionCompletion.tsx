'use client'

import api from './api';

export const useLessonsService = () => {
  const getAllLessons = async () => {
    try {
      const response = await api.get('/lessons');
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  };

  const getLessonById = async (id) => {
    try {
      const response = await api.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lesson with id ${id}:`, error);
      throw error;
    }
  };

  const getLessonsByCourseId = async (courseId) => {
    try {
      const response = await api.get(`/lessons?courseId=${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lessons for course ${courseId}:`, error);
      throw error;
    }
  };

  const createLesson = async (lessonData) => {
    try {
      const response = await api.post('/lessons', lessonData);
      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  };

  const updateLesson = async (id, lessonData) => {
    try {
      const response = await api.put(`/lessons/${id}`, lessonData);
      return response.data;
    } catch (error) {
      console.error(`Error updating lesson with id ${id}:`, error);
      throw error;
    }
  };

  const deleteLesson = async (id) => {
    try {
      const response = await api.delete(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting lesson with id ${id}:`, error);
      throw error;
    }
  };

  // NEW: Lesson completion functionality
  const markLessonComplete = async (lessonId, completionData = {}) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/complete`, {
        timeSpentSeconds: completionData.timeSpentSeconds,
        quizScore: completionData.quizScore,
        videoProgress: completionData.videoProgress,
        ...completionData
      });
      return response.data;
    } catch (error) {
      console.error(`Error marking lesson ${lessonId} as complete:`, error);
      throw error;
    }
  };

/*   const getLessonCompletionStatus = async (lessonId) => {
    try {
      const response = await api.get(`/lessons/${lessonId}/completion-status`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching completion status for lesson ${lessonId}:`, error);
      throw error;
    }
  }; */

  const updateLessonProgress = async (lessonId, progressData) => {
    try {
      const response = await api.put(`/lessons/${lessonId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error(`Error updating lesson progress for ${lessonId}:`, error);
      throw error;
    }
  };

  return {
    getAllLessons,
    getLessonById,
    getLessonsByCourseId,
    createLesson,
    updateLesson,
    deleteLesson,
    // New completion methods
    markLessonComplete,
    getLessonCompletionStatus,
    updateLessonProgress
  };
};