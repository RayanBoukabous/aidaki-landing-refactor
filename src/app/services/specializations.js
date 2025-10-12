'use client'

import api from './api';

export const useSpecializationsService = () => {
  const getAllSpecializations = async () => {
    try {
      const response = await api.get('/specializations');
      return response.data;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw error;
    }
  };

  const getSpecializationById = async (id) => {
    try {
      const response = await api.get(`/specializations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching specialization with id ${id}:`, error);
      throw error;
    }
  };

  const getSpecializationsByYearOfStudy = async (yearOfStudyId) => {
    try {
      const response = await api.get(`/specializations/year/${yearOfStudyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching specializations for year ${yearOfStudyId}:`, error);
      throw error;
    }
  };

  const createSpecialization = async (specializationData) => {
    try {
      const response = await api.post('/specializations', specializationData);
      return response.data;
    } catch (error) {
      console.error('Error creating specialization:', error);
      throw error;
    }
  };

  const updateSpecialization = async (id, specializationData) => {
    try {
      const response = await api.put(`/specializations/${id}`, specializationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating specialization with id ${id}:`, error);
      throw error;
    }
  };

  const deleteSpecialization = async (id) => {
    try {
      const response = await api.delete(`/specializations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting specialization with id ${id}:`, error);
      throw error;
    }
  };

  return {
    getAllSpecializations,
    getSpecializationById,
    getSpecializationsByYearOfStudy,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization
  };
};