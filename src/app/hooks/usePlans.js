'use client'

import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

export const usePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all active plans from the API
   */
  const fetchActivePlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/plan/plan/active');
      
      // The API returns an array directly
      let plansData = [];
      if (response.data && Array.isArray(response.data)) {
        plansData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        plansData = response.data.data;
      } else if (response.data && response.data.plans && Array.isArray(response.data.plans)) {
        plansData = response.data.plans;
      }
      
      // Process plans to handle details field
      const processedPlans = plansData.map(plan => ({
        ...plan,
        // Parse details if it's a string
        details: typeof plan.details === 'string' 
          ? JSON.parse(plan.details) 
          : plan.details
      }));
      
      console.log('Fetched plans:', processedPlans);
      setPlans(processedPlans);
      return processedPlans;
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Auto-fetch plans on mount
   */
  useEffect(() => {
    fetchActivePlans();
  }, [fetchActivePlans]);

  /**
   * Manually refresh plans
   */
  const refreshPlans = useCallback(() => {
    return fetchActivePlans();
  }, [fetchActivePlans]);

  return {
    plans,
    loading,
    error,
    fetchActivePlans,
    refreshPlans,
  };
};
