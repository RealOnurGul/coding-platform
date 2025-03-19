const express = require('express');
const { protect } = require('../middleware/auth');
const { getProblems, getProblemById, submitSolution } = require('../controllers/problemController');

const router = express.Router();

// Get all problems (with optional filtering)
router.get('/', protect, getProblems);

// Get a specific problem by ID
router.get('/:id', protect, getProblemById);

// Submit a solution
router.post('/:id/submit', protect, submitSolution);

module.exports = router; 