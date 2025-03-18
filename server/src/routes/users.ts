import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getUserProfile, updateUserProfile, getUserProgress } from '../controllers/userController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.patch('/profile', updateUserProfile);

// Get user progress
router.get('/progress', getUserProgress);

export default router; 