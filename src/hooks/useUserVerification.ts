'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUsersService } from '../app/services/users';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  yearOfStudyId?: number;
  specializationId?: number;
  grade?: number;
  [key: string]: any;
}

interface UseUserVerificationReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isVerified: boolean;
  checkingVerification: boolean;
}

/**
 * Custom hook to check user verification status and redirect if needed
 * @param locale - Current locale string for routing
 * @returns Object with user data, loading states, and verification status
 */
export const useUserVerification = (locale: string): UseUserVerificationReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingVerification, setCheckingVerification] = useState(true);
  
  const router = useRouter();
  const { getCurrentUserInfo } = useUsersService();

  useEffect(() => {
    checkUserVerification();
  }, [locale]);

  const checkUserVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      setCheckingVerification(true);

      // Fetch current user information
      const userInfo = await getCurrentUserInfo();
      setUser(userInfo);

      // Check if user is verified
      if (!userInfo.isVerified) {
        // Redirect to standalone verification page with user's email
        router.push(`/${locale}/verify-email?email=${encodeURIComponent(userInfo.email)}`);
        return;
      }

      setCheckingVerification(false);
    } catch (err) {
      console.error('Error checking user verification:', err);
      setError('Failed to verify user authentication status');
      setCheckingVerification(false);
    } finally {
      setLoading(false);
    }
  };

  const isVerified = user?.isVerified ?? false;

  return {
    user,
    loading,
    error,
    isVerified,
    checkingVerification
  };
};

export default useUserVerification;
