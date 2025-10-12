'use client'

import api from './api';

/**
 * Users service hook
 * @returns {Object} Object containing all user service functions
 */
export const useUsersService = () => {
 /**
   * Get all users (Admin only)
   * @param {Object} params - Query parameters for pagination, filtering, etc.
   * @returns {Promise} Response with users list
   */
  const getAllStates = async (params = {}) => {
    try {
      const response = await api.get('/users/states', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  /**
   * Get communes by wilaya ID
   * @param {string|number} wilayaId - Wilaya ID to filter communes
   * @returns {Promise} Response with communes list
   */
  const getAllCommunes = async (wilayaId = null) => {
    try {
      const params = wilayaId ? { wilayaId } : {};
      const response = await api.get('/users/communes', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching communes:', error);
      throw error;
    }
  };


  /**
   * Get all users (Admin only)
   * @param {Object} params - Query parameters for pagination, filtering, etc.
   * @returns {Promise} Response with users list
   */
  const getAllUsers = async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  /**
   * Get all user roles/types (Admin only)
   * @returns {Promise} Response with user roles
   */
  const getUserTypes = async () => {
    try {
      const response = await api.get('/users/types');
      return response.data;
    } catch (error) {
      console.error('Error fetching user types:', error);
      throw error;
    }
  };

  /**
   * Send verification email to user
   * @param {string} email - User email address
   * @returns {Promise} Response confirmation
   */
  const sendVerificationEmail = async (email) => {
    try {
      const response = await api.post('/users/send-verification', { email });
      return response.data;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  /**
   * Verify user email with token
   * @param {string} token - Verification token
   * @returns {Promise} Response confirmation
   */
  const verifyUserEmail = async (token) => {
    try {
      const response = await api.get('/users/verify', { 
        params: { token } 
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying user email:', error);
      throw error;
    }
  };

  /**
   * Get users for API keys (Admin only)
   * @returns {Promise} Response with users who have API access
   */
  const getUsersForApiKeys = async () => {
    try {
      const response = await api.get('/users/api-keys');
      return response.data;
    } catch (error) {
      console.error('Error fetching users for API keys:', error);
      throw error;
    }
  };

  /**
   * Get current user info (authenticated user)
   * @returns {Promise} Response with user information
   */
  const getCurrentUserInfo = async () => {
    try {
      const response = await api.get('/users/user-info');
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return error
      throw error;
    }
  };

  /**
   * Update current user info (authenticated user)
   * @param {Object} userData - User data to update
   * @returns {Promise} Response with updated user info
   */
  const updateCurrentUserInfo = async (userData) => {
    try {
      const response = await api.put('/users/update-user-info', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error;
    }
  };

  /**
   * Update current user's year of study
   * @param {number} yearOfStudyId - Year of study ID
   * @returns {Promise} Response with updated user info
   */
  const updateUserYearOfStudy = async (yearOfStudyId) => {
    try {
      const response = await api.put('/users/update-user-info', { yearOfStudyId });
      return response.data;
    } catch (error) {
      console.error('Error updating user year of study:', error);
      throw error;
    }
  };

  /**
   * Update current user's specialization
   * @param {number} specializationId - Specialization ID
   * @returns {Promise} Response with updated user info
   */
  const updateUserSpecialization = async (specializationId) => {
    try {
      const response = await api.put('/users/update-user-info', { specializationId });
      return response.data;
    } catch (error) {
      console.error('Error updating user specialization:', error);
      throw error;
    }
  };

  /**
   * Change user's specialization using the change-specialization endpoint
   * @param {number} specializationId - Specialization ID to change to
   * @returns {Promise} Response with previous/new specialization info
   */
  const changeSpecialization = async (specializationId, yearOfStudyId) => {
    try {
      const response = await api.put('/users/change-specialization', { specializationId, yearOfStudyId });
      return response.data;
    } catch (error) {
      console.error('Error changing specialization:', error);
      throw error;
    }
  };

  /**
   * Update user's hasUsedGuid status after completing the dashboard tour
   * @returns {Promise} Response with updated user info
   */
  const updateHasUsedGuid = async () => {
    try {
      const response = await api.put('/users/update-has-used-guid', {});
      return response.data;
    } catch (error) {
      console.error('Error updating hasUsedGuid status:', error);
      throw error;
    }
  };

  /**
   * Create a new user (Admin only)
   * @param {Object} userData - New user data
   * @returns {Promise} Response with created user
   */
  const createUser = async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  /**
   * Update user by ID (Admin only)
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise} Response with updated user
   */
  const updateUser = async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  /**
   * Delete user by ID (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise} Response confirmation
   */
  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  /**
   * Get user by ID (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise} Response with user data
   */
  const getUserById = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  };

  /**
   * Search users by criteria (Admin only)
   * @param {Object} searchParams - Search criteria
   * @returns {Promise} Response with matching users
   */
  const searchUsers = async (searchParams) => {
    try {
      const response = await api.get('/users/search', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  };

  /**
   * Update user role (Admin only)
   * @param {string} userId - User ID
   * @param {string} role - New user role
   * @returns {Promise} Response confirmation
   */
  const updateUserRole = async (userId, role) => {
    try {
      const response = await api.patch(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  /**
   * Update user status (Admin only)
   * @param {string} userId - User ID
   * @param {string} status - New user status (active, inactive, suspended)
   * @returns {Promise} Response confirmation
   */
  const updateUserStatus = async (userId, status) => {
    try {
      const response = await api.patch(`/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  return {
    getAllStates,
    getAllCommunes,
    getAllUsers,
    getUserTypes,
    sendVerificationEmail,
    verifyUserEmail,
    getUsersForApiKeys,
    getCurrentUserInfo,
    updateCurrentUserInfo,
    updateUserYearOfStudy,
    updateUserSpecialization,
    changeSpecialization,
    updateHasUsedGuid,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    searchUsers,
    updateUserRole,
    updateUserStatus
  };
};

export const getAllStates = async (params = {}) => {
  try {
    const response = await api.get('/users/states', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getAllCommunes = async (wilayaId = null) => {
  try {
    const params = wilayaId ? { wilayaId } : {};
    const response = await api.get('/users/communes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching communes:', error);
    throw error;
  }
};



// Export individual functions for backward compatibility
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getCurrentUserInfo = async () => {
  try {
    const response = await api.get('/users/user-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const updateCurrentUserInfo = async (userData) => {
  try {
    const response = await api.put('/users/update-user-info', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user info:', error);
    throw error;
  }
};

export const updateUserYearOfStudy = async (yearOfStudyId) => {
  try {
    const response = await api.put('/users/update-user-info', { yearOfStudyId });
    return response.data;
  } catch (error) {
    console.error('Error updating user year of study:', error);
    throw error;
  }
};

export const updateUserSpecialization = async (specializationId) => {
  try {
    const response = await api.put('/users/update-user-info', { specializationId });
    return response.data;
  } catch (error) {
    console.error('Error updating user specialization:', error);
    throw error;
  }
};

/**
 * Change user's specialization using the change-specialization endpoint
 * @param {number} specializationId - Specialization ID to change to
 * @returns {Promise} Response with previous/new specialization info
 */
export const changeSpecialization = async (specializationId) => {
  try {
    const response = await api.put('/users/change-specialization', { specializationId });
    return response.data;
  } catch (error) {
    console.error('Error changing specialization:', error);
    throw error;
  }
};

/**
 * Update user's hasUsedGuid status after completing the dashboard tour
 * @returns {Promise} Response with updated user info
 */
export const updateHasUsedGuid = async () => {
  try {
    const response = await api.put('/users/update-has-used-guid', {});
    return response.data;
  } catch (error) {
    console.error('Error updating hasUsedGuid status:', error);
    throw error;
  }
};
