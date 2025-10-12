'use client'

import api from './api';

export const useStudyModulesService = () => {
  const getAllStudyModules = async () => {
    try {
      const response = await api.get('/study-modules');
      return response.data;
    } catch (error) {
      console.error('Error fetching study modules:', error);
      throw error;
    }
  };

  const getStudyModulesForStudent = async (orderBy = 'coefficient', order = 'desc') => {
    try {
      const response = await api.get(`/study-modules/student?orderBy=${orderBy}&order=${order}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching study modules for student:', error);
      throw error;
    }
  };

  const getStudyModulesBySpecialization = async (specializationId) => {
    try {
      const response = await api.get(`/study-modules/specialization/${specializationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching study modules for specialization ${specializationId}:`, error);
      throw error;
    }
  };

  const getStudyModulesByYearOfStudy = async (yearOfStudyId) => {
    try {
      const response = await api.get(`/study-modules/year/${yearOfStudyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching study modules for year ${yearOfStudyId}:`, error);
      throw error;
    }
  };

  const getStudyModuleById = async (id) => {
    try {
      const response = await api.get(`/study-modules/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching study module with id ${id}:`, error);
      throw error;
    }
  };

  const createStudyModule = async (studyModuleData) => {
    try {
      const response = await api.post('/study-modules', studyModuleData);
      return response.data;
    } catch (error) {
      console.error('Error creating study module:', error);
      throw error;
    }
  };

  const updateStudyModule = async (id, studyModuleData) => {
    try {
      const response = await api.put(`/study-modules/${id}`, studyModuleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating study module with id ${id}:`, error);
      throw error;
    }
  };

  const deleteStudyModule = async (id) => {
    try {
      const response = await api.delete(`/study-modules/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting study module with id ${id}:`, error);
      throw error;
    }
  };

  return {
    getAllStudyModules,
    getStudyModulesForStudent,
    getStudyModulesBySpecialization,
    getStudyModulesByYearOfStudy,
    getStudyModuleById,
    createStudyModule,
    updateStudyModule,
    deleteStudyModule
  };
};
