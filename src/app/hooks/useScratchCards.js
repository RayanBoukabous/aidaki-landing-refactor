import { useState, useCallback } from 'react';
import { useScratchCardsService } from '../services/scratchCards';

export const useScratchCards = () => {
  const scratchCardsService = useScratchCardsService();
  const [cardData, setCardData] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [redemptionResult, setRedemptionResult] = useState(null);

  // Redeem a scratch card
  const redeemCard = useCallback(async (privateKey) => {
    const result = await scratchCardsService.redeemCard(privateKey);
    if (result) {
      setRedemptionResult(result);
    }
    return result;
  }, [scratchCardsService]);

  // Verify a scratch card
  const verifyCard = useCallback(async (publicKey, privateKey) => {
    const result = await scratchCardsService.verifyCard(publicKey, privateKey);
    if (result) {
      setCardData(result);
    }
    return result;
  }, [scratchCardsService]);

  // Get plan information for a card
  const fetchPlanInfo = useCallback(async (publicKey) => {
    const result = await scratchCardsService.getPlanInfo(publicKey);
    if (result) {
      setPlanInfo(result);
    }
    return result;
  }, [scratchCardsService]);

  // Preview a card
  const previewCard = useCallback(async (publicKey) => {
    const result = await scratchCardsService.previewCard(publicKey);
    return result;
  }, [scratchCardsService]);

  // Validate card keys format
  const validateKeys = useCallback((publicKey, privateKey) => {
    const errors = [];
    
    if (!publicKey || publicKey.trim() === '') {
      errors.push('Public key is required');
    } else if (!publicKey.startsWith('SK_')) {
      errors.push('Public key must start with SK_');
    }
    
    if (!privateKey || privateKey.trim() === '') {
      errors.push('Private key is required');
    } else if (!privateKey.startsWith('PK_')) {
      errors.push('Private key must start with PK_');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Validate private key for redemption
  const validatePrivateKey = useCallback((privateKey) => {
    if (!privateKey || privateKey.trim() === '') {
      return {
        isValid: false,
        error: 'Private key is required'
      };
    }
    
    if (!privateKey.startsWith('PK_')) {
      return {
        isValid: false,
        error: 'Private key must start with PK_'
      };
    }
    
    return {
      isValid: true,
      error: null
    };
  }, []);

  // Validate public key
  const validatePublicKey = useCallback((publicKey) => {
    if (!publicKey || publicKey.trim() === '') {
      return {
        isValid: false,
        error: 'Public key is required'
      };
    }
    
    if (!publicKey.startsWith('SK_')) {
      return {
        isValid: false,
        error: 'Public key must start with SK_'
      };
    }
    
    return {
      isValid: true,
      error: null
    };
  }, []);

  // Check if a card can be redeemed
  const canRedeem = useCallback((cardInfo) => {
    if (!cardInfo) return false;
    return cardInfo.canRedeem && 
           cardInfo.remainingRedemptions > 0 && 
           cardInfo.status === 'ACTIVATED' && 
           cardInfo.isActive;
  }, []);

  // Get card status display text
  const getCardStatusText = useCallback((status) => {
    const statusMap = {
      'CREATED': 'Created',
      'ACTIVATED': 'Active',
      'REDEEMED': 'Redeemed',
      'EXPIRED': 'Expired',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || status;
  }, []);

  // Format expiration date
  const formatExpirationDate = useCallback((expiresAt) => {
    if (!expiresAt) return 'No expiration';
    return new Date(expiresAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Reset all state
  const resetState = useCallback(() => {
    setCardData(null);
    setPlanInfo(null);
    setRedemptionResult(null);
    scratchCardsService.clearError();
  }, [scratchCardsService]);

  // Clear error
  const clearError = useCallback(() => {
    scratchCardsService.clearError();
  }, [scratchCardsService]);

  return {
    // Data
    cardData,
    planInfo,
    redemptionResult,
    
    // Loading and error states
    loading: scratchCardsService.loading,
    error: scratchCardsService.error,
    
    // Actions
    redeemCard,
    verifyCard,
    fetchPlanInfo,
    previewCard,
    
    // Validation helpers
    validateKeys,
    validatePrivateKey,
    validatePublicKey,
    
    // Utility functions
    canRedeem,
    getCardStatusText,
    formatExpirationDate,
    
    // State management
    resetState,
    clearError,
  };
};
