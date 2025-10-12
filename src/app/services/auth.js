'use client'

import api from './api';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, refresh_token } = response.data;
    
    // Store in localStorage for client-side checks
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refresh_token);
    
    // Also store in cookies for middleware checks
    document.cookie = `token=${token}; path=/; max-age=${60*60*24*7}`; // 7 days expiry
    document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${60*60*24*30}`; // 30 days expiry
    
    return jwtDecode(token);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, refresh_token } = response.data;
    
    // Store in localStorage for client-side checks
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refresh_token);
    
    // Also store in cookies for middleware checks
    document.cookie = `token=${token}; path=/; max-age=${60*60*24*7}`; // 7 days expiry
    document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${60*60*24*30}`; // 30 days expiry
    
    return jwtDecode(token);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

export const resetPassword = async (email, password, confirmPassword, token) => {
  try {
    // Validate passwords match
    if (password !== confirmPassword) {
      throw new Error('auth.resetPassword.passwordsNotMatch');
    }

    // Validate password strength (basic validation)
    if (password.length < 8) {
      throw new Error('auth.resetPassword.passwordTooShort');
    }

    const response = await api.post('/users/reset-password', {
      email,
      password,
      confirmPassword: confirmPassword,
      token
    });
    
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/users/send-verification', { email });
    return response.data;
  } catch (error) {
    console.error('Send verification email error:', error);
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get('/users/verify', {
      params: { token }
    });
    return response.data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

export const logout = () => {
  // Clear from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  
  // Clear from cookies
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const localToken = localStorage.getItem('token');
  
  // Try to get token from cookies as well (for consistency with middleware)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  const cookieToken = getCookie('token');
  
  // Use whichever token is available
  const token = localToken || cookieToken;
  
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Utility function to validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('auth.validation.passwordTooShort');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('auth.validation.passwordNeedLowercase');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('auth.validation.passwordNeedUppercase');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('auth.validation.passwordNeedNumber');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
