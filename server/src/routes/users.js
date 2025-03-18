const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getUserProfile, updateUserProfile, getUserProgress } = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.patch('/profile', updateUserProfile);

// Get user progress
router.get('/progress', getUserProgress);

module.exports = router; 