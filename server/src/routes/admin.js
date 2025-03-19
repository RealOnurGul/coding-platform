const express = require('express');
const { User } = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Get all users
router.get('/users', asyncHandler(async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
  });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
}));

module.exports = router; 