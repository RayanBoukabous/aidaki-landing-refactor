import { useState, useEffect, useCallback } from 'react';
import { useNotesService } from '../services/notes';

export const useNotes = (lessonId) => {
  const notesService = useNotesService();
  const [notes, setNotes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch notes for a specific lesson
  const fetchLessonNotes = useCallback(async (id) => {
    const fetchedNotes = await notesService.getLessonNotes(id);
    if (fetchedNotes) {
      setNotes(fetchedNotes);
    }
  }, []); // Remove notesService from dependencies to prevent infinite loop

  // Fetch notes sessions
  const fetchSessions = useCallback(async () => {
    const fetchedSessions = await notesService.getNoteSessions();
    if (fetchedSessions) {
      setSessions(fetchedSessions);
    }
  }, []); // Remove notesService from dependencies

  // Create a new note
  const createNote = useCallback(async (content, targetLessonId) => {
    const lessonIdToUse = targetLessonId || lessonId;
    if (!lessonIdToUse) {
      console.error('No lesson ID provided for creating note');
      return null;
    }

    const noteData = { content };
    const newNote = await notesService.createNote(lessonIdToUse, noteData);
    
    if (newNote) {
      // Refresh notes list
      const updatedNotes = await notesService.getLessonNotes(lessonIdToUse);
      if (updatedNotes) {
        setNotes(updatedNotes);
      }
    }
    
    return newNote;
  }, [lessonId]); // Only depend on lessonId

  // Update an existing note
  const updateNote = useCallback(async (noteId, content, targetLessonId) => {
    const lessonIdToUse = targetLessonId || lessonId;
    if (!lessonIdToUse) {
      console.error('No lesson ID provided for updating note');
      return null;
    }

    const noteData = { content };
    const updatedNote = await notesService.updateNote(lessonIdToUse, noteId, noteData);
    
    if (updatedNote) {
      // Update the note in the local state
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? updatedNote : note
        )
      );
    }
    
    return updatedNote;
  }, [lessonId]);

  // Delete a note
  const deleteNote = useCallback(async (noteId, targetLessonId) => {
    const lessonIdToUse = targetLessonId || lessonId;
    if (!lessonIdToUse) {
      console.error('No lesson ID provided for deleting note');
      return false;
    }

    const success = await notesService.deleteNote(lessonIdToUse, noteId);
    
    if (success) {
      // Remove the note from local state
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    }
    
    return success;
  }, [lessonId]);

  // Refresh notes
  const refreshNotes = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Effect to fetch notes when lessonId changes or refreshKey changes
  useEffect(() => {
    if (lessonId) {
      const loadNotes = async () => {
        const fetchedNotes = await notesService.getLessonNotes(lessonId);
        if (fetchedNotes) {
          setNotes(fetchedNotes);
        }
      };
      loadNotes();
    }
  }, [lessonId, refreshKey]); // Remove fetchLessonNotes from dependencies

  // Get notes for a specific lesson (useful when not using the hook with a default lessonId)
  const getNotesForLesson = useCallback(async (id) => {
    return await notesService.getLessonNotes(id);
  }, []);

  return {
    // Data
    notes,
    sessions,
    
    // Loading states
    loading: notesService.loading,
    error: notesService.error,
    
    // Actions
    createNote,
    updateNote,
    deleteNote,
    fetchLessonNotes,
    fetchSessions,
    getNotesForLesson,
    refreshNotes,
  };
};
