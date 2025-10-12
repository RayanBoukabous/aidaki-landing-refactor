'use client'

import api from './api';

/**
 * Get all active plans
 * @returns {Promise} Response with active plans data
 */
export const getActivePlans = async () => {
  try {
    const response = await api.get('/plan/plan/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active plans:', error);
    throw error;
  }
};

/**
 * Create a payment invoice
 * @param {number} planId - ID of the plan to purchase
 * @returns {Promise} Response with payment URL and invoice details
 */
export const createPayment = async (planId) => {
  try {
    const response = await api.post('/payment/create', { planId });
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

/**
 * Get payment status by invoice ID
 * @param {number} invoiceId - ID of the invoice
 * @returns {Promise} Response with payment status
 */
export const getPaymentStatus = async (invoiceId) => {
  try {
    const response = await api.get(`/payment/status/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};

/**
 * Get user's payment history (all invoices)
 * @returns {Promise} Response with payment history
 */
export const getMyInvoices = async () => {
  try {
    const response = await api.get('/payment/my-invoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

/**
 * Payment service object for easier importing
 */
export const paymentService = {
  getActivePlans,
  createPayment,
  getPaymentStatus,
  getMyInvoices
};

/**
 * Payment service hook (for hook-style usage)
 * @returns {Object} Object containing all payment service functions
 */
export const usePaymentService = () => {
  return {
    getActivePlans,
    createPayment,
    getPaymentStatus,
    getMyInvoices
  };
};

// Default export
export default paymentService;
