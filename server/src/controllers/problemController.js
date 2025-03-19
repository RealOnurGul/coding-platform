const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Mock problems data for demonstration
const problems = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    topic: 'arrays',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ]
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters (,),{,},[ and ], determine if the input string is valid.',
    difficulty: 'easy',
    topic: 'strings',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      }
    ]
  },
  {
    id: 3,
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    difficulty: 'medium',
    topic: 'dynamic-programming',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: '[4,-1,2,1] has the largest sum = 6.'
      }
    ]
  }
];

/**
 * @desc    Get all problems with optional filtering
 * @route   GET /api/problems
 * @access  Private
 */
const getProblems = asyncHandler(async (req, res, next) => {
  const { difficulty, topic } = req.query;
  let filteredProblems = [...problems];

  // Apply filters if provided
  if (difficulty) {
    filteredProblems = filteredProblems.filter(problem => 
      problem.difficulty === difficulty
    );
  }
  
  if (topic) {
    filteredProblems = filteredProblems.filter(problem => 
      problem.topic === topic
    );
  }

  res.status(200).json({
    success: true,
    count: filteredProblems.length,
    data: filteredProblems
  });
});

/**
 * @desc    Get a problem by ID
 * @route   GET /api/problems/:id
 * @access  Private
 */
const getProblemById = asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const problem = problems.find(p => p.id === id);

  if (!problem) {
    return next(new ErrorResponse(`Problem not found with id of ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: problem
  });
});

/**
 * @desc    Submit a solution for a problem
 * @route   POST /api/problems/:id/submit
 * @access  Private
 */
const submitSolution = asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { solution } = req.body;
  const userId = req.user.id;

  // Check if problem exists
  const problem = problems.find(p => p.id === id);
  if (!problem) {
    return next(new ErrorResponse(`Problem not found with id of ${id}`, 404));
  }

  // Simulate solution verification (in a real app, this would run tests)
  const isCorrect = solution && solution.length > 0;
  
  // Simulate saving submission to database
  const submission = {
    id: Date.now(),
    userId,
    problemId: id,
    solution,
    status: isCorrect ? 'accepted' : 'wrong-answer',
    createdAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: {
      submission,
      result: {
        status: submission.status,
        runtime: '5ms',
        memory: '39.8MB'
      }
    }
  });
});

module.exports = {
  getProblems,
  getProblemById,
  submitSolution
}; 