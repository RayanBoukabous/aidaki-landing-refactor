'use client'

import { useState, useCallback } from 'react';
import api from './api';

export const useNotesService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a note for a lesson
  const createNote = useCallback(async (lessonId, noteData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/notes/lesson/${lessonId}/note`, noteData);
      return response.data;
    } catch (err) {
      console.error('Error creating note:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create note');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all notes for a lesson
  const getLessonNotes = useCallback(async (lessonId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notes/lesson/${lessonId}/notes`);
      return response.data?.notes || [];
    } catch (err) {
      console.error('Error fetching lesson notes:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch notes');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a note
  const updateNote = useCallback(async (lessonId, noteId, noteData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/notes/lesson/${lessonId}/notes/${noteId}`, noteData);
      return response.data;
    } catch (err) {
      console.error('Error updating note:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update note');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get notes sessions
  const getNoteSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/notes/sessions');
      return response.data;
    } catch (err) {
      console.error('Error fetching note sessions:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch note sessions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a note
  const deleteNote = useCallback(async (lessonId, noteId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/notes/lesson/${lessonId}/notes/${noteId}`);
      return true;
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete note');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createNote,
    getLessonNotes,
    updateNote,
    getNoteSessions,
    deleteNote,
  };
};
