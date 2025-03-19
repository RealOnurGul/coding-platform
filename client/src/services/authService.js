// authService.js - Handles user authentication

/**
 * CURRENT DATABASE IMPLEMENTATION:
 * 
 * This implementation now connects to a MySQL database on the backend server
 * instead of using localStorage. This allows for proper user management and
 * data persistence across devices and browsers.
 */

import axios from 'axios';

// Set base URL for API requests
const API_URL = 'http://localhost:5001/api';

/**
 * Set the current session with user data
 * @param {Object} userData - User data to set in the session
 */
const setSessionData = (userData) => {
  localStorage.setItem('token', userData.token);
  localStorage.setItem('currentUser', JSON.stringify(userData.user));
};

/**
 * Get the current user's data from local storage
 * @returns {Object|null} The current user's data or null if not logged in
 */
const getCurrentUser = () => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @returns {Promise} Promise that resolves to user data with token
 */
const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Make API request to login
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    // Check for success
    if (response.data.success) {
      // Set session data
      setSessionData(response.data);
      return response.data;
    } else {
      throw new Error(response.data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.error || error.message || 'Login failed');
  }
};

/**
 * Register user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise that resolves to user data with token
 */
const register = async (userData) => {
  try {
    const { name, email, password } = userData;
    
    // Validate inputs
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    
    // Make API request to register
    const response = await axios.post(`${API_URL}/auth/register`, { 
      name, 
      email, 
      password 
    });
    
    // Check for success
    if (response.data.success) {
      // Set session data
      setSessionData(response.data);
      return response.data;
    } else {
      throw new Error(response.data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.error || error.message || 'Registration failed');
  }
};

/**
 * Logout user
 */
const logout = async () => {
  try {
    // Get token
    const token = localStorage.getItem('token');
    
    if (token) {
      // Call logout API endpoint
      await axios.get(`${API_URL}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage regardless of API success/failure
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} Promise that resolves to updated user data
 */
const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Make API request to update profile
    const response = await axios.put(
      `${API_URL}/auth/updatedetails`, 
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Check for success
    if (response.data.success) {
      // Update local storage with new user data
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    } else {
      throw new Error(response.data.error || 'Profile update failed');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error(error.response?.data?.error || error.message || 'Profile update failed');
  }
};

/**
 * Update user preferences
 * @param {Object} preferences - Updated preferences
 * @returns {Promise} Promise that resolves to updated user data
 */
const updatePreferences = async (preferences) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Make API request to update preferences
    const response = await axios.put(
      `${API_URL}/auth/preferences`, 
      preferences,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Check for success
    if (response.data.success) {
      // Update local storage with new user data
      const currentUser = getCurrentUser();
      const updatedUser = { 
        ...currentUser, 
        preferences: {
          ...currentUser.preferences,
          ...response.data.data.preferences
        }
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    } else {
      throw new Error(response.data.error || 'Preferences update failed');
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw new Error(error.response?.data?.error || error.message || 'Preferences update failed');
  }
};

const authService = {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  updateUserProfile,
  updatePreferences
};

export default authService; 