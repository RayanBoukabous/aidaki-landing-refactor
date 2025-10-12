'use client'

import { useState, useCallback } from 'react';
import api from '../services/api';

export const useStudyModules = () => {
  const [studyModules, setStudyModules] = useState([]);
  const [studyModule, setStudyModule] = useState(null); // Add individual study module state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudyModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/study-modules');
      console.log('API Raw Response:', response);
      
      // Determine which part of the response contains the study modules array
      let modulesData = [];
      if (response.data && Array.isArray(response.data)) {
        modulesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        modulesData = response.data.data;
      } else if (response.data && response.data.modules && Array.isArray(response.data.modules)) {
        modulesData = response.data.modules;
      }
      
      setStudyModules(modulesData);
      return response.data; // Return the complete response
    } catch (err) {
      console.error('Error fetching study modules:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des modules d\'étude');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudyModulesForStudent = useCallback(async (orderBy = 'coefficient', order = 'desc') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/study-modules/student?orderBy=${orderBy}&order=${order}`);
      console.log('Student Study Modules Response:', response);
      
      // Determine which part of the response contains the study modules array
      let modulesData = [];
      if (response.data && Array.isArray(response.data)) {
        modulesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        modulesData = response.data.data;
      } else if (response.data && response.data.modules && Array.isArray(response.data.modules)) {
        modulesData = response.data.modules;
      }
      
      setStudyModules(modulesData);
      return response.data; // Return the complete response
    } catch (err) {
      console.error('Error fetching student study modules:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des modules d\'étude de l\'étudiant');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudyModule = useCallback(async (moduleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/study-modules', moduleData);
      fetchStudyModules(); // Refresh the list after creation
      return response.data;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création du module d\'étude');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchStudyModules]);

  const getStudyModuleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/study-modules/${id}`);
      
      // Handle different response structures and store in state
      let moduleData = null;
      if (response.data) {
        if (response.data.studyModule) {
          moduleData = response.data.studyModule;
        } else if (response.data.data) {
          moduleData = response.data.data;
        } else {
          moduleData = response.data;
        }
      }
      
      setStudyModule(moduleData); // Store the individual study module in state
      console.log('Fetched Study Module:', moduleData);
      return moduleData;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la récupération du module d'étude ${id}`);
      setStudyModule(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudyModule = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/study-modules/${id}`, data);
      
      // Update the individual study module state if it's the same module
      if (studyModule && studyModule.id === id) {
        const updatedModule = response.data.studyModule || response.data.data || response.data;
        setStudyModule(updatedModule);
      }
      
      fetchStudyModules(); // Refresh the list after update
      return response.data;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la mise à jour du module d'étude ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchStudyModules, studyModule]);

  const deleteStudyModule = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/study-modules/${id}`);
      
      // Clear individual study module if it's the deleted one
      if (studyModule && studyModule.id === id) {
        setStudyModule(null);
      }
      
      fetchStudyModules(); // Refresh the list after deletion
      return response.data;
    } catch (err) {
      setError(err.message || `Une erreur est survenue lors de la suppression du module d'étude ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchStudyModules, studyModule]);

  const getAllStudyModules = useCallback(async () => {
    try {
      const response = await fetchStudyModules();
      return response.data; // Return the complete response
    } catch (err) {
      console.error('Error in getAllStudyModules:', err);
      return null;
    }
  }, [fetchStudyModules]);

  return {
    studyModules,
    studyModule, // Return the individual study module state
    loading,
    getAllStudyModules,
    fetchStudyModulesForStudent, // New method for student endpoint
    error,
    fetchStudyModules,
    createStudyModule,
    getStudyModuleById,
    updateStudyModule,
    deleteStudyModule
  };
};