const express = require('express');
const { body } = require('express-validator');
const { register, login, logout } = require('../controllers/authController');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    validateRequest,
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required'),
    validateRequest,
  ],
  login
);

router.post('/logout', logout);

module.exports = router; 