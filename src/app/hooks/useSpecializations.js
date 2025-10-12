'use client'

import { useState, useCallback } from 'react';
import api from '../services/api';

export const useSpecializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [specialization, setSpecialization] = useState(null); // Add individual specialization state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSpecializations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/specializations');
      console.log('API Raw Response:', response);
      
      // Determine which part of the response contains the specializations array
      let specializationsData = [];
      if (response.data && Array.isArray(response.data)) {
        specializationsData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        specializationsData = response.data.data;
      } else if (response.data && response.data.specializations && Array.isArray(response.data.specializations)) {
        specializationsData = response.data.specializations;
      }
      
      setSpecializations(specializationsData);
      return response.data; // Return the complete response
    } catch (err) {
      console.error('Error fetching specializations:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des spécialisations');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSpecialization = useCallback(async (specializationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/specializations', specializationData);
      fetchSpecializations(); // Refresh the list after creation
      return response.data;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création de la spécialisation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchSpecializations]);

  const getSpecializationById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/specializations/${id}`);
      
      // Handle different response structures and store in state
      let specializationData = null;
      if (response.data) {
        if (response.data.specialization) {
          specializationData = response.data.specialization;
        } else if (response.data.data) {
          specializationData = response.data.data;
        } else {
          specializationData = response.data;
        }
      }
      
      setSpecialization(specializationData); // Store the individual specialization in state
      return specializationData;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la récupération de la spécialisation ${id}`);
      setSpecialization(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSpecialization = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/specializations/${id}`, data);
      
      // Update the individual specialization state if it's the same specialization
      if (specialization && specialization.id === id) {
        const updatedSpecialization = response.data.specialization || response.data.data || response.data;
        setSpecialization(updatedSpecialization);
      }
      
      fetchSpecializations(); // Refresh the list after update
      return response.data;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la mise à jour de la spécialisation ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchSpecializations, specialization]);

  const deleteSpecialization = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/specializations/${id}`);
      
      // Clear individual specialization if it's the deleted one
      if (specialization && specialization.id === id) {
        setSpecialization(null);
      }
      
      fetchSpecializations(); // Refresh the list after deletion
      return response.data;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la suppression de la spécialisation ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchSpecializations, specialization]);

  const getAllSpecializations = useCallback(async () => {
    try {
      const response = await fetchSpecializations();
      return response; // Fix: Return the response directly
    } catch (err) {
      console.error('Error in getAllSpecializations:', err);
      return null;
    }
  }, [fetchSpecializations]);

  return {
    getAllSpecializations,
    specializations,
    specialization, // Return the individual specialization state
    loading,
    error,
    fetchSpecializations,
    createSpecialization,
    getSpecializationById,
    updateSpecialization,
    deleteSpecialization
  };
};