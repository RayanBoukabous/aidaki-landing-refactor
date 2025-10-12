// src/app/services/yearOfStudy.js
'use client'

import api from './api';

export const useYearOfStudy = () => {
  const getAllYearsOfStudy = async () => {
    try {
      const response = await api.get('/year-of-study');
      console.log('Fetched years of study:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching years of study:', error);
      throw error;
    }
  };

  const getYearOfStudyById = async (id) => {
    try {
      const response = await api.get(`/year-of-study/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching year of study with id ${id}:`, error);
      throw error;
    }
  };

  const createYearOfStudy = async (yearOfStudyData) => {
    try {
      const response = await api.post('/year-of-study', yearOfStudyData);
      return response.data;
    } catch (error) {
      console.error('Error creating year of study:', error);
      throw error;
    }
  };

  const updateYearOfStudy = async (id, yearOfStudyData) => {
    try {
      const response = await api.put(`/year-of-study/${id}`, yearOfStudyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating year of study with id ${id}:`, error);
      throw error;
    }
  };

  const deleteYearOfStudy = async (id) => {
    try {
      const response = await api.delete(`/year-of-study/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting year of study with id ${id}:`, error);
      throw error;
    }
  };

  return {
    getAllYearsOfStudy,
    getYearOfStudyById,
    createYearOfStudy,
    updateYearOfStudy,
    deleteYearOfStudy
  };
};