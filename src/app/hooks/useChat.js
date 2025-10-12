"use client";

import { useState, useCallback } from "react";
import { chat } from "../services/chat";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenUsage, setTokenUsage] = useState(null);
  
  // New state for enhanced chat features
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isGeneralMode, setIsGeneralMode] = useState(false);

  const { sendMessageToLesson, getChatSessions, getChatMessagesBySession, getTokenUsage } =
    chat();

  const sendMessage = useCallback(
    async (lessonId, content, options = {}) => {
      setLoading(true);
      setError(null);

      // Add user message to messages immediately
      const userMessage = {
        id: Date.now(), // temporary ID
        content,
        senderType: "USER",
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        // Prepare options for the API call
        const apiOptions = {
          general: options.general !== undefined ? options.general : isGeneralMode,
        };

        // Add sessionId if we have a current session or one is provided
        if (options.sessionId || currentSessionId) {
          apiOptions.sessionId = options.sessionId || currentSessionId;
        }

        const response = await sendMessageToLesson(lessonId, content, apiOptions);

        // Update current session ID if this is a new session
        if (response && response.sessionId && !currentSessionId) {
          setCurrentSessionId(response.sessionId);
        }

        // Extract only the AI response content (before ---METADATA---)
        if (response && response.aiResponse) {
          const cleanResponse = response.aiResponse
            .split("---METADATA---")[0]
            .trim();

          const aiMessage = {
            id: Date.now() + 1, // temporary ID
            content: cleanResponse,
            senderType: "AI",
            timestamp: new Date().toISOString(),
          };

          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }

        return response;
      } catch (err) {
        console.error("Chat error:", err);
        
        // Handle insufficient permissions
        if (err.response?.data?.reason === "INSUFFICIENT_PERMISSIONS") {
          setError("INSUFFICIENT_PERMISSIONS");
        } else {
          setError(
            err.message || "Une erreur est survenue lors de l'envoi du message"
          );
        }

        // Optionally add error message to chat
        const errorMessage = {
          id: Date.now() + 2,
          content: "Désolé, une erreur est survenue. Veuillez réessayer.",
          senderType: "ERROR",
          timestamp: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, errorMessage]);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [sendMessageToLesson, currentSessionId, isGeneralMode]
  );

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChatSessions();
      setSessions(data || []);
      return data || []; // Return the sessions array directly
    } catch (err) {
      if (err.response?.data?.reason === "INSUFFICIENT_PERMISSIONS") {
        setError("INSUFFICIENT_PERMISSIONS");
      } else {
        setError(err.message || "Erreur lors du chargement des sessions");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [getChatSessions]);

  const fetchMessages = useCallback(
    async (sessionId) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getChatMessagesBySession(sessionId);
        const fetchedMessages = data || [];
        
        
        // Clean up any AI responses that might contain metadata
        const cleanedMessages = fetchedMessages.map((msg) => {
          if (
            msg.senderType === "AI" &&
            msg.content.includes("---METADATA---")
          ) {
            return {
              ...msg,
              content: msg.content.split("---METADATA---")[0].trim(),
            };
          }
          return msg;
        });

        setMessages(cleanedMessages);
        setCurrentSessionId(sessionId); // Update current session
        return cleanedMessages; // Return the messages array directly
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des messages");
        setMessages([]); // Clear messages on error
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getChatMessagesBySession]
  );

  const fetchTokenUsage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTokenUsage();
      setTokenUsage(data);
      return data;
    } catch (err) {
      console.error('Error fetching token usage:', err);
      setError(err.message || "Error loading token usage");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getTokenUsage]);

  // Start a new chat session
  const startNewSession = useCallback(() => {
    setCurrentSessionId(null);
    setMessages([]);
    setError(null);
  }, []);

  // Switch between general and lesson-specific mode
  const toggleGeneralMode = useCallback((isGeneral) => {
    setIsGeneralMode(isGeneral);
    // Clear current session when switching modes to start fresh
    setCurrentSessionId(null);
    setMessages([]);
    setError(null);
  }, []);

  // Clear messages function
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Existing exports
    messages,
    setMessages,
    sessions,
    setSessions,
    loading,
    error,
    sendMessage,
    fetchSessions,
    fetchMessages,
    clearMessages,
    clearError,
    tokenUsage,
    fetchTokenUsage,
    
    // New exports for enhanced chat
    currentSessionId,
    isGeneralMode,
    startNewSession,
    toggleGeneralMode,
    setCurrentSessionId,
  };
};