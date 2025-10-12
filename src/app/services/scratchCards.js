'use client'

import { useState, useCallback } from 'react';
import api from './api';

export const useScratchCardsService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redeem a scratch card using private key
  const redeemCard = useCallback(async (privateKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/scratchable-card/redeem', {
        privateKey
      });
      return response.data;
    } catch (err) {
      console.error('Error redeeming scratch card:', err);
      setError(err.response?.data?.message || err.message || 'Failed to redeem scratch card');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify a scratch card using public and private keys
  const verifyCard = useCallback(async (publicKey, privateKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/scratchable-card/verify', {
        params: {
          publicKey,
          privateKey
        }
      });
      return response.data;
    } catch (err) {
      console.error('Error verifying scratch card:', err);
      setError(err.response?.data?.message || err.message || 'Card not found or invalid');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get plan information for a scratch card using public key
  const getPlanInfo = useCallback(async (publicKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/scratchable-card/plan-info/${publicKey}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching plan info:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch plan information');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Preview a scratch card using public key
  const previewCard = useCallback(async (publicKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/scratchable-card/preview/${publicKey}`);
      return response.data;
    } catch (err) {
      console.error('Error previewing scratch card:', err);
      setError(err.response?.data?.message || err.message || 'Card not found or inactive');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    redeemCard,
    verifyCard,
    getPlanInfo,
    previewCard,
    clearError,
  };
};
