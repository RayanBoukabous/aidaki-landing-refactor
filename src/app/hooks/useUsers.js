'use client'

import { useState, useCallback } from 'react';
import { useUsersService } from '../services/users';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Get service functions
  const {
    getAllStates,
    getAllCommunes,
    getAllUsers,
    getUserTypes,
    sendVerificationEmail,
    verifyUserEmail,
    getUsersForApiKeys,
    getCurrentUserInfo,
    updateCurrentUserInfo,
    changeSpecialization,
    updateHasUsedGuid,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    searchUsers,
    updateUserRole,
    updateUserStatus
  } = useUsersService();

  // Reset error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all users (Admin only)
  const fetchStates = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStates(params);
      setUsers(response.data || response.users || response);
    
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAllStates]);

  // Fetch communes by wilaya
  const fetchCommunes = useCallback(async (wilayaId = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCommunes(wilayaId);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAllCommunes]);

  // Fetch all users (Admin only)
  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers(params);
      setUsers(response.data || response.users || response);
      
      // Update pagination if provided in response
      if (response.pagination) {
        setPagination(response.pagination);
      }
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  // Fetch user types/roles
  const fetchUserTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserTypes();
      setUserTypes(response.data || response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUserTypes]);

  // Send verification email
  const sendVerification = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sendVerificationEmail(email);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [sendVerificationEmail]);

  // Verify user email
  const verifyEmail = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyUserEmail(token);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [verifyUserEmail]);

  // Fetch users for API keys
  const fetchUsersForApiKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsersForApiKeys();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUsersForApiKeys]);

  // Fetch current user info
  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCurrentUserInfo();
      setCurrentUser(response.data || response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserInfo]);

  // Update current user info
  const updateCurrentUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateCurrentUserInfo(userData);
      setCurrentUser(response.data || response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateCurrentUserInfo]);

  // Change user specialization using change-specialization endpoint
  const changeUserSpecialization = useCallback(async (specializationId, yearOfStudyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await changeSpecialization(specializationId, yearOfStudyId);
      // Update current user with the new specialization
      if (response.user) {
        setCurrentUser(prevUser => ({
          ...prevUser,
          specialization: response.user.newSpecialization,
          hasChangedSpecialization: response.user.hasChangedSpecialization
        }));
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [changeSpecialization]);

  // Update hasUsedGuid status after completing the dashboard tour
  const markTourAsCompleted = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateHasUsedGuid();
      // Update current user with the new hasUsedGuid status
      setCurrentUser(prevUser => ({
        ...prevUser,
        hasUsedGuid: true
      }));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateHasUsedGuid]);

  // Create new user
  const createNewUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createUser(userData);
      // Add new user to the list if we have users loaded
      if (users.length > 0) {
        setUsers(prev => [response.data || response, ...prev]);
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [createUser, users]);

  // Update user
  const updateExistingUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUser(userId, userData);
      // Update user in the list
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...(response.data || response) } : user
      ));
      // Update selected user if it's the same
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, ...(response.data || response) });
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateUser, selectedUser]);

  // Delete user
  const deleteExistingUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteUser(userId);
      // Remove user from the list
      setUsers(prev => prev.filter(user => user.id !== userId));
      // Clear selected user if it's the deleted one
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [deleteUser, selectedUser]);

  // Fetch user by ID
  const fetchUserById = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(userId);
      setSelectedUser(response.data || response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUserById]);

  // Search users
  const searchUsersFunction = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchUsers(searchParams);
      setUsers(response.data || response.users || response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [searchUsers]);

  // Update user role
  const changeUserRole = useCallback(async (userId, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserRole(userId, role);
      // Update user in the list
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
      // Update selected user if it's the same
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role });
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateUserRole, selectedUser]);

  // Update user status
  const changeUserStatus = useCallback(async (userId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserStatus(userId, status);
      // Update user in the list
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      // Update selected user if it's the same
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status });
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateUserStatus, selectedUser]);

  return {
    // State
    users,
    userTypes,
    currentUser,
    selectedUser,
    loading,
    error,
    pagination,
    
    // User management functions
    fetchUsers,
    fetchUserTypes,
    fetchCurrentUser,
    updateCurrentUser,
    changeUserSpecialization,
    markTourAsCompleted,
    createNewUser,
    updateExistingUser,
    deleteExistingUser,
    fetchUserById,
    searchUsersFunction,
    changeUserRole,
    changeUserStatus,
    
    // Geographic data functions
    fetchStates,
    fetchCommunes,
    
    // Email verification functions
    sendVerification,
    verifyEmail,
    
    // API keys related
    fetchUsersForApiKeys,
    
    // Utility functions
    clearError,
    setSelectedUser,
    setPagination
  };
};
