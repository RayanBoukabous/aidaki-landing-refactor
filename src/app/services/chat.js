'use client';

import api from './api';

export const chat = () => {
  const sendMessageToLesson = async (lessonId, content, options = {}) => {
    try {
      const payload = { content };
      
      // Add sessionId if provided
      if (options.sessionId) {
        payload.sessionId = options.sessionId;
      }
      
      // Add general mode flag (defaults to false for lesson-specific)
      payload.general = options.general || false;
      
      const response = await api.post(`/chat/lesson/${lessonId}/message`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error sending chat message for lesson ${lessonId}:`, error);
      throw error;
    }
  };

  const getChatSessions = async () => {
    try {
      const response = await api.get(`/chat/sessions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  };

  const getChatMessagesBySession = async (sessionId) => {
    try {
      const response = await api.get(`/chat/session/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chat messages for session ${sessionId}:`, error);
      throw error;
    }
  };

  const getTokenUsage = async () => {
    try {
      const response = await api.get('/chat/token-usage');
      return response.data;
    } catch (error) {
      console.error('Error fetching token usage:', error);
      throw error;
    }
  };

  return {
    sendMessageToLesson,
    getChatSessions,
    getChatMessagesBySession,
    getTokenUsage,
  };
};