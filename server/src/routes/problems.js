const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getProblems, getProblemById, submitSolution } = require('../controllers/problemController');

const router = express.Router();

// Get all problems (with optional filtering)
router.get('/', authenticateToken, getProblems);

// Get a specific problem by ID
router.get('/:id', authenticateToken, getProblemById);

// Submit a solution
router.post('/:id/submit', authenticateToken, submitSolution);

module.exports = router; 