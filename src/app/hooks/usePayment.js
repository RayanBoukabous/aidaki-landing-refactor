'use client'

import { useState, useCallback } from 'react';
import { paymentService } from '../services/payment';

/**
 * Payment Hook
 * Manages payment operations including fetching plans, creating payments, and checking status
 */
export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  /**
   * Fetch all active plans
   */
  const fetchActivePlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getActivePlans();
      setPlans(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch plans';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a payment for a specific plan
   * @param {number} planId - ID of the plan to purchase
   * @returns {Promise} Payment response with paymentUrl
   */
  const createPayment = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.createPayment(planId);
      setCurrentInvoice(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check payment status
   * @param {number} invoiceId - ID of the invoice
   * @returns {Promise} Payment status response
   */
  const checkPaymentStatus = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPaymentStatus(invoiceId);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to check payment status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user's payment history
   * @returns {Promise} Array of invoices
   */
  const fetchPaymentHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getMyInvoices();
      setInvoices(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch payment history';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initiate payment flow for a plan
   * Creates payment and redirects to payment gateway
   * @param {number} planId - ID of the plan
   */
  const initiatePayment = useCallback(async (planId) => {
    try {
      const paymentData = await createPayment(planId);
      
      // Redirect to payment gateway
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      }
      
      return paymentData;
    } catch (err) {
      console.error('Error initiating payment:', err);
      throw err;
    }
  }, [createPayment]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    plans,
    invoices,
    currentInvoice,
    
    // Actions
    fetchActivePlans,
    createPayment,
    checkPaymentStatus,
    fetchPaymentHistory,
    initiatePayment,
    clearError,
  };
}

/**
 * Hook for simple plan selection and payment
 * @param {Function} onPaymentSuccess - Callback when payment is initiated
 * @param {Function} onPaymentError - Callback when payment fails
 */
export function useSimplePayment(onPaymentSuccess, onPaymentError) {
  const payment = usePayment();

  const handlePayment = useCallback(async (planId) => {
    try {
      const result = await payment.initiatePayment(planId);
      onPaymentSuccess?.(result);
    } catch (error) {
      onPaymentError?.(error);
    }
  }, [payment, onPaymentSuccess, onPaymentError]);

  return {
    ...payment,
    handlePayment,
  };
}

export default usePayment;
