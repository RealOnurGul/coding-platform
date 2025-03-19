// userService.js - Handles user profile-related API calls
import authService from './authService';

/**
 * Get user profile data
 * @returns {Promise} Promise that resolves to user data
 */
const getProfile = async () => {
  try {
    // Check authentication
    if (!authService.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    
    // Get current user from database
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // Remove sensitive data
    const { password, ...userData } = currentUser;
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userData);
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} Promise that resolves to updated user data
 */
const updateProfile = async (userData) => {
  try {
    // Check authentication
    if (!authService.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    
    // Call the auth service to update user data
    const updatedUser = await authService.updateUserProfile(userData);
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          ...updatedUser,
          success: true 
        });
      }, 800);
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * This functionality is no longer needed as we're using avatar colors
 * Kept for backwards compatibility
 */
const uploadProfilePicture = async (file) => {
  try {
    // Check file type
    if (!file.type.match('image.*')) {
      throw new Error('Please select an image file');
    }
    
    // Check file size
    if (file.size > 5 * 1024 * 1024) {  // 5MB limit
      throw new Error('Image file size must be less than 5MB');
    }
    
    // In a real app, this would upload to a server or cloud storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const imageUrl = reader.result;
        localStorage.setItem('userProfilePicture', imageUrl);
        setTimeout(() => {
          resolve(imageUrl);
        }, 1000);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @returns {Promise} Promise that resolves to user statistics
 */
const getUserStats = async () => {
  try {
    // Check authentication
    if (!authService.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    
    // Get current user from database
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(currentUser.stats || {
          problemsSolved: {
            easy: 0,
            medium: 0,
            hard: 0,
            total: 0
          },
          submissions: 0,
          activeDays: 0,
          maxStreak: 0
        });
      }, 300);
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

/**
 * Update user statistics
 * @param {Object} stats - Updated statistics
 * @returns {Promise} Promise that resolves to updated statistics
 */
const updateUserStats = async (stats) => {
  try {
    // Check authentication
    if (!authService.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    
    // Get current user from database
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // Update stats
    const updatedUser = {
      ...currentUser,
      stats: {
        ...currentUser.stats,
        ...stats
      }
    };
    
    // Save updated user
    await authService.updateUserProfile(updatedUser);
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(updatedUser.stats);
      }, 300);
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

const userService = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getUserStats,
  updateUserStats
};

export default userService; 