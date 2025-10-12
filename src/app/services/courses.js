'use client'

import { useState, useCallback } from 'react';
import api from '../services/api';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState({}); // Track enrollment loading per course

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/courses/active');
      
      let coursesData = [];
      if (response.data && Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        coursesData = response.data.data;
      } else if (response.data && response.data.courses && Array.isArray(response.data.courses)) {
        coursesData = response.data.courses;
      }
      
      setCourses(coursesData);
      return response.data;
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des cours');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCoursesByStudyModule = useCallback(async (studyModuleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/courses/${studyModuleId}/active`);
      
      let coursesData = [];
      if (response.data && Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        coursesData = response.data.data;
      } else if (response.data && response.data.courses && Array.isArray(response.data.courses)) {
        coursesData = response.data.courses;
      }
      
      setCourses(coursesData);
      return response.data;
    } catch (err) {
      console.error('Error fetching courses by study module:', err);
      setError(err.message || `Une erreur est survenue lors du chargement des cours pour le module ${studyModuleId}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/courses', courseData);
      fetchCourses();
      return response.data;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création du cours');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses]);

  const getCourseById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/courses/${id}`);
      
      let courseData = null;
      if (response.data) {
        if (response.data.course) {
          courseData = response.data.course;
        } else if (response.data.data) {
          courseData = response.data.data;
        } else {
          courseData = response.data;
        }
      }
      
      setCourse(courseData);
      return courseData;
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.message || `Une erreur est survenue lors de la récupération du cours ${id}`);
      setCourse(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/courses/${id}`, data);
      
      if (course && course.id === id) {
        setCourse(response.data.course || response.data.data || response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err.message || `Une erreur est survenue lors de la mise à jour du cours ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [course]);

  const deleteCourse = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/courses/${id}`);
      
      if (course && course.id === id) {
        setCourse(null);
      }
      
      fetchCourses();
      return response.data;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la suppression du cours ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, course]);

  // New enrollment functionality
  const enrollInCourse = useCallback(async (courseId) => {
    setEnrollmentLoading(prev => ({ ...prev, [courseId]: true }));
    setError(null);
    try {
      const response = await api.post(`/courses/enroll/${courseId}`);
      
      // Update the course in the courses array
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                isEnrolled: true,
                enrollmentInfo: { enrolledAt: new Date().toISOString() },
                users: [{ enrolledAt: new Date().toISOString() }]
              }
            : course
        )
      );

      // Update single course if it's the same course
      if (course && course.id === courseId) {
        setCourse(prev => ({
          ...prev,
          isEnrolled: true,
          enrollmentInfo: { enrolledAt: new Date().toISOString() },
          users: [{ enrolledAt: new Date().toISOString() }]
        }));
      }
      
      return response.data;
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError(err.message || `Une erreur est survenue lors de l'inscription au cours ${courseId}`);
      return null;
    } finally {
      setEnrollmentLoading(prev => ({ ...prev, [courseId]: false }));
    }
  }, [course]);

  const unenrollFromCourse = useCallback(async (courseId) => {
    setEnrollmentLoading(prev => ({ ...prev, [courseId]: true }));
    setError(null);
    try {
      const response = await api.delete(`/courses/enroll/${courseId}`);
      
      // Update the course in the courses array
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                isEnrolled: false,
                enrollmentInfo: null,
                users: []
              }
            : course
        )
      );

      // Update single course if it's the same course
      if (course && course.id === courseId) {
        setCourse(prev => ({
          ...prev,
          isEnrolled: false,
          enrollmentInfo: null,
          users: []
        }));
      }
      
      return response.data;
    } catch (err) {
      console.error('Error unenrolling from course:', err);
      setError(err.message || `Une erreur est survenue lors de la désinscription du cours ${courseId}`);
      return null;
    } finally {
      setEnrollmentLoading(prev => ({ ...prev, [courseId]: false }));
    }
  }, [course]);

  const getAllCourses = useCallback(async () => {
    try {
      const response = await fetchCourses();
      return response?.courses || response?.data || response;
    } catch (err) {
      console.error('Error in getAllCourses:', err);
      return null;
    }
  }, [fetchCourses]);

  const getCoursesByStudyModule = useCallback(async (studyModuleId) => {
    try {
      const response = await fetchCoursesByStudyModule(studyModuleId);
      return response?.courses || response?.data || response;
    } catch (err) {
      console.error('Error in getCoursesByStudyModule:', err);
      return null;
    }
  }, [fetchCoursesByStudyModule]);

  return {
    courses,
    course,
    loading,
    error,
    enrollmentLoading,
    fetchCourses,
    fetchCoursesByStudyModule,
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCoursesByStudyModule,
    enrollInCourse,
    unenrollFromCourse,
  };
};