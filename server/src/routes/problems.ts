import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProblems, getProblemById, submitSolution } from '../controllers/problemController';

const router = express.Router();

// Get all problems (with optional filtering)
router.get('/', authenticateToken, getProblems);

// Get a specific problem by ID
router.get('/:id', authenticateToken, getProblemById);

// Submit a solution
router.post('/:id/submit', authenticateToken, submitSolution);

export default router; 