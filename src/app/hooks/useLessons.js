"use client";

import { useState, useCallback } from "react";
import api from "../services/api";

export const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async (courseId = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = courseId ? `/lessons/course/${courseId}` : "/lessons";
      const response = await api.get(url);
      console.log("API Raw Response:", response);

      // Determine which part of the response contains the lessons array
      let lessonsData = [];
      if (response.data && Array.isArray(response.data)) {
        lessonsData = response.data;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        lessonsData = response.data.data;
      } else if (
        response.data &&
        response.data.lessons &&
        Array.isArray(response.data.lessons)
      ) {
        lessonsData = response.data.lessons;
      }

      setLessons(lessonsData);
      return response.data; // Return the complete response
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError(
        err.message || "Une erreur est survenue lors du chargement des leçons"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLesson = useCallback(
    async (lessonData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("/lessons", lessonData);
        fetchLessons(lessonData.courseId); // Refresh the list after creation, with courseId if available
        return response.data;
      } catch (err) {
        setError(
          err.message ||
            "Une erreur est survenue lors de la création de la leçon"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchLessons]
  );

  const getLessonById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/lessons/${id}`);
      return response.data;
    } catch (err) {
      console.log(err);
      setError(
        err.message ||
          `Une erreur est survenue lors de la récupération de la leçon ${id}`
      );
      return { err: { message: err.response?.data?.requiredPermission || "" } };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLesson = useCallback(
    async (id, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/lessons/${id}`, data);
        fetchLessons(data.courseId); // Refresh the list after update, with courseId if available
        return response.data;
      } catch (err) {
        setError(
          err.message ||
            `Une erreur est survenue lors de la mise à jour de la leçon ${id}`
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchLessons]
  );

  const deleteLesson = useCallback(
    async (id, courseId = null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.delete(`/lessons/${id}`);
        fetchLessons(courseId); // Refresh the list after deletion, with courseId if available
        return response.data;
      } catch (err) {
        setError(
          err.message ||
            `Une erreur est survenue lors de la suppression de la leçon ${id}`
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchLessons]
  );

  const getAllLessons = useCallback(async () => {
    try {
      const response = await fetchLessons();
      console.log("All lessons fetched:", response);
      return response.lessons;
    } catch (err) {
      console.error("Error in getAllLessons:", err);
      return null;
    }
  }, [fetchLessons]);

  return {
    lessons,
    loading,
    error,
    fetchLessons,
    createLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
    getAllLessons,
  };
};
