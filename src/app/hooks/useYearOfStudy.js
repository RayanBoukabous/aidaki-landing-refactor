// src/app/hooks/useYearOfStudy.js
'use client'

import { useState, useCallback } from 'react';
import api from '../services/api';

export const useYearOfStudy = () => {
  const [yearsOfStudy, setYearsOfStudy] = useState([]);
  const [yearOfStudy, setYearOfStudy] = useState(null); // Add individual year state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchYearsOfStudy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/year-of-study');
      console.log('API Raw Response:', response);
      
      // Determine which part of the response contains the years of study array
      let yearsData = [];
      if (response.data && Array.isArray(response.data)) {
        yearsData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        yearsData = response.data.data;
      } else if (response.data && response.data.years && Array.isArray(response.data.years)) {
        yearsData = response.data.years;
      }
      
      setYearsOfStudy(yearsData);
      return response.data; // Return the complete response
    } catch (err) {
      console.error('Error fetching years of study:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des années d\'étude');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createYearOfStudy = useCallback(async (yearData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/year-of-study', yearData);
      fetchYearsOfStudy(); // Refresh the list after creation
      return response.data;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création de l\'année d\'étude');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchYearsOfStudy]);

  const getYearOfStudyById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/year-of-study/${id}`);
      
      // Handle different response structures and store in state
      let yearData = null;
      if (response.data) {
        if (response.data.yearOfStudy) {
          yearData = response.data.yearOfStudy;
        } else if (response.data.data) {
          yearData = response.data.data;
        } else {
          yearData = response.data;
        }
      }
      
      setYearOfStudy(yearData); // Store the individual year in state
      return yearData;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la récupération de l'année d'étude ${id}`);
      setYearOfStudy(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateYearOfStudy = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/year-of-study/${id}`, data);
      
      // Update the individual year state if it's the same year
      if (yearOfStudy && yearOfStudy.id === id) {
        const updatedYear = response.data.yearOfStudy || response.data.data || response.data;
        setYearOfStudy(updatedYear);
      }
      
      fetchYearsOfStudy(); // Refresh the list after update
      return response.data;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la mise à jour de l'année d'étude ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchYearsOfStudy, yearOfStudy]);

  const getAllYearOfStudies = useCallback(async () => {
    try {
      const response = await fetchYearsOfStudy();
      return response.data;
    } catch (err) {
      console.error('Error in getAllYearOfStudies:', err);
      return null;
    }
  }, [fetchYearsOfStudy]);

  const deleteYearOfStudy = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/year-of-study/${id}`);
      
      // Clear individual year if it's the deleted one
      if (yearOfStudy && yearOfStudy.id === id) {
        setYearOfStudy(null);
      }
      
      fetchYearsOfStudy(); // Refresh the list after deletion
      return response.data;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la suppression de l'année d'étude ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchYearsOfStudy, yearOfStudy]);

  return {
    yearsOfStudy,
    yearOfStudy, // Return the individual year state
    loading,
    error,
    fetchYearsOfStudy,
    createYearOfStudy,
    getYearOfStudyById,
    updateYearOfStudy,
    deleteYearOfStudy,
    getAllYearOfStudies
  };
};