'use client'

import api from './api';

/**
 * Get current user subscription
 * @returns {Promise} Response with user subscription data
 */
export const getCurrentUserSubscription = async () => {
  try {
    const response = await api.get('/subscriptions/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user subscription:', error);
    throw error;
  }
};

/**
 * Get current user financial summary
 * @returns {Promise} Response with financial summary data
 */
export const getFinancialSummary = async () => {
  try {
    const response = await api.get('/subscriptions/financial-summary/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    throw error;
  }
};

/**
 * Subscriptions service object for easier importing
 */
export const subscriptionService = {
  getCurrentUserSubscription,
  getFinancialSummary
};

/**
 * Subscriptions service hook (for hook-style usage)
 * @returns {Object} Object containing all subscription service functions
 */
export const useSubscriptionsService = () => {
  return {
    getCurrentUserSubscription,
    getFinancialSummary
  };
};

// Default export
export default subscriptionService;
