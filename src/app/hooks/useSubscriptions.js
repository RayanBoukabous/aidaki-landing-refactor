import { useState, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptions';

export const useSubscriptions = () => {
  const [subscription, setSubscription] = useState(null);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch current subscription data
   */
  const fetchCurrentSubscription = async () => {
    try {
      const data = await subscriptionService.getCurrentUserSubscription();
      setSubscription(data);
      return data;
    } catch (err) {
      console.error('Error fetching subscription:', err);
      throw err;
    }
  };

  /**
   * Fetch financial summary data
   */
  const fetchFinancialSummary = async () => {
    try {
      const data = await subscriptionService.getFinancialSummary();
      setFinancialSummary(data);
      return data;
    } catch (err) {
      console.error('Error fetching financial summary:', err);
      throw err;
    }
  };

  /**
   * Fetch all subscription data (subscription + financial summary)
   */
  const fetchSubscriptionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both subscription and financial summary in parallel
      const [subscriptionData, financialData] = await Promise.all([
        fetchCurrentSubscription(),
        fetchFinancialSummary()
      ]);
      
      return { subscription: subscriptionData, financialSummary: financialData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch subscription data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if subscription is expired
   */
  const isSubscriptionExpired = () => {
    if (!subscription) return true;
    if (!subscription.endDate) return true;
    
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    return endDate < now;
  };

  /**
   * Get days remaining in subscription
   */
  const getDaysRemaining = () => {
    if (!subscription || !subscription.endDate) return 0;
    
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  /**
   * Check if user has an active subscription
   */
  const hasActiveSubscription = () => {
    if (!subscription) return false;
    return subscription.status === 'ACTIVE' && !isSubscriptionExpired();
  };

  /**
   * Check if subscription is a trial
   */
  const isTrialSubscription = () => {
    if (!subscription) return false;
    return subscription.status === 'TRIAL';
  };

  /**
   * Get current subscription status
   */
  const getSubscriptionStatus = () => {
    if (!subscription) return 'NONE';
    
    if (isSubscriptionExpired()) {
      return 'EXPIRED';
    }
    
    return subscription.status;
  };

  /**
   * Get subscription plan information
   */
  const getSubscriptionPlan = () => {
    return subscription?.plan || null;
  };

  /**
   * Check if subscription is about to expire (within 7 days)
   */
  const isSubscriptionExpiringSoon = () => {
    const daysRemaining = getDaysRemaining();
    return daysRemaining > 0 && daysRemaining <= 7;
  };

  /**
   * Get formatted subscription period
   */
  const getSubscriptionPeriod = () => {
    if (!subscription) return null;
    
    const startDate = new Date(subscription.startDate).toLocaleDateString();
    const endDate = new Date(subscription.endDate).toLocaleDateString();
    
    return { startDate, endDate };
  };

  return {
    // State
    subscription,
    financialSummary,
    loading,
    error,
    
    // Actions
    fetchSubscriptionData,
    fetchCurrentSubscription,
    fetchFinancialSummary,
    
    // Subscription status helpers
    hasActiveSubscription,
    isSubscriptionExpired,
    isTrialSubscription,
    isSubscriptionExpiringSoon,
    getSubscriptionStatus,
    
    // Subscription info helpers
    getDaysRemaining,
    getSubscriptionPlan,
    getSubscriptionPeriod,
    
    // Legacy/compatibility
    refetch: fetchSubscriptionData
  };
};
