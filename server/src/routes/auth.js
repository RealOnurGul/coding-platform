const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import controllers
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  updatePreferences,
  logout
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/auth');

// Rate limiters for auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again after 15 minutes'
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many accounts created from this IP, please try again after an hour'
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many password reset attempts, please try again after an hour'
});

// Authentication routes
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPasswordLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/preferences', protect, updatePreferences);
router.get('/logout', protect, logout);

module.exports = router; 