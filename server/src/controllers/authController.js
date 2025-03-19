const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');
const { pool } = require('../config/database');
const { 
  User, 
  UserPreference, 
  UserStats, 
  Theme 
} = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');
const { sequelize } = require('../config/database');

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
  console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !name.trim()) {
    return next(new ErrorResponse('Name is required', 400));
  }

  if (!email || !email.trim()) {
    return next(new ErrorResponse('Email is required', 400));
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  if (!password) {
    return next(new ErrorResponse('Password is required', 400));
  }

  if (password.length < 6) {
    return next(new ErrorResponse('Password must be at least 6 characters', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ErrorResponse('User with this email already exists', 400));
  }

  // Generate random avatar color
  const colors = [
    '#4F46E5', '#0EA5E9', '#14B8A6', '#10B981', '#22C55E', 
    '#EAB308', '#F59E0B', '#F97316', '#EF4444', '#EC4899', '#8B5CF6'
  ];
  const defaultColor = colors[Math.floor(Math.random() * colors.length)];

  // Use transaction to ensure all related data is created or nothing is created
  const transaction = await sequelize.transaction();

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by model hooks
      avatarColor: defaultColor
    }, { transaction });

    // Create default preferences
    await UserPreference.create({
      userId: user.id,
      difficulty: 'medium',
      dailyGoal: 1
    }, { transaction });

    // Create empty stats
    await UserStats.create({
      userId: user.id
    }, { transaction });

    // Add default themes
    const defaultThemes = await Theme.findAll({
      where: { name: ['arrays', 'strings'] },
      transaction
    });
    
    await user.addThemes(defaultThemes, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Send JWT token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    return next(error);
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !email.trim()) {
    return next(new ErrorResponse('Email is required', 400));
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  if (!password) {
    return next(new ErrorResponse('Password is required', 400));
  }

  // Check if user exists - include password for comparison
  const user = await User.scope('withPassword').findOne({ 
    where: { email },
    include: [
      { 
        model: UserPreference, 
        as: 'preferences',
        required: false 
      },
      { 
        model: UserStats, 
        as: 'stats',
        required: false 
      },
      {
        model: Theme,
        as: 'themes',
        required: false,
        through: { attributes: [] } // Don't include join table
      }
    ]
  });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last active timestamp
  user.lastActive = Date.now();
  await user.save();

  // Send JWT token response
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    include: [
      { 
        model: UserPreference, 
        as: 'preferences',
        required: false 
      },
      { 
        model: UserStats, 
        as: 'stats',
        required: false 
      },
      {
        model: Theme,
        as: 'themes',
        required: false,
        through: { attributes: [] } // Don't include join table
      }
    ]
  });
  
  // Format user preferences and themes for API response
  const formattedUser = {
    ...user.toJSON(),
    themes: user.themes ? user.themes.map(theme => theme.name) : []
  };
  
  // Update last active timestamp
  user.lastActive = Date.now();
  await user.save();
  
  res.status(200).json({
    success: true,
    data: formattedUser
  });
});

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    bio: req.body.bio,
    avatarColor: req.body.avatarColor
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Update user fields
  Object.assign(user, fieldsToUpdate);
  await user.save();

  // Get complete user with related data
  const updatedUser = await User.findByPk(req.user.id, {
    include: [
      { model: UserPreference, as: 'preferences', required: false },
      { model: UserStats, as: 'stats', required: false },
      { 
        model: Theme, 
        as: 'themes', 
        required: false,
        through: { attributes: [] }
      }
    ]
  });

  res.status(200).json({
    success: true,
    data: {
      ...updatedUser.toJSON(),
      themes: updatedUser.themes ? updatedUser.themes.map(theme => theme.name) : []
    }
  });
});

/**
 * @desc    Update user preferences
 * @route   PUT /api/auth/preferences
 * @access  Private
 */
exports.updatePreferences = asyncHandler(async (req, res, next) => {
  const { difficulty, dailyGoal, themes } = req.body;
  const transaction = await sequelize.transaction();
  
  try {
    // Update UserPreference
    let userPreference = await UserPreference.findOne({
      where: { userId: req.user.id },
      transaction
    });
    
    if (!userPreference) {
      userPreference = await UserPreference.create({
        userId: req.user.id,
        difficulty: 'medium',
        dailyGoal: 1
      }, { transaction });
    }
    
    if (difficulty) userPreference.difficulty = difficulty;
    if (dailyGoal) userPreference.dailyGoal = dailyGoal;
    
    await userPreference.save({ transaction });
    
    // Update themes if provided
    if (themes && Array.isArray(themes)) {
      const user = await User.findByPk(req.user.id, { transaction });
      
      // Get theme objects
      const themeObjects = await Promise.all(
        themes.map(async (themeName) => {
          const [theme] = await Theme.findOrCreate({
            where: { name: themeName },
            transaction
          });
          return theme;
        })
      );
      
      // Clear existing themes and set new ones
      await user.setThemes(themeObjects, { transaction });
    }
    
    await transaction.commit();
    
    // Get updated user with all preferences
    const updatedUser = await User.findByPk(req.user.id, {
      include: [
        { model: UserPreference, as: 'preferences' },
        { model: UserStats, as: 'stats' },
        { 
          model: Theme, 
          as: 'themes',
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        ...updatedUser.toJSON(),
        themes: updatedUser.themes ? updatedUser.themes.map(theme => theme.name) : []
      }
    });
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }
  
  // Get user with password
  const user = await User.scope('withPassword').findByPk(req.user.id);
  
  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }
  
  // Set new password (will be hashed by model hooks)
  user.password = newPassword;
  await user.save();
  
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }
  
  // Get reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Set expire to 10 minutes
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  await user.save();
  
  // In a production app, send email with reset token
  // For now, just return the token in the response
  
  res.status(200).json({
    success: true,
    message: 'In production, an email would be sent with reset instructions.',
    resetToken
  });
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  
  const user = await User.scope('withPassword').findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { [sequelize.Op.gt]: Date.now() }
    }
  });
  
  if (!user) {
    return next(new ErrorResponse('Invalid token or expired token', 400));
  }
  
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  
  await user.save();
  
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  // For token-based auth, no server-side logout is needed
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * Helper function to get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.generateAuthToken();
  
  // Format user data for response
  const userData = user.toJSON();
  
  // Handle themes formatting
  if (userData.themes) {
    userData.themes = userData.themes.map(theme => 
      typeof theme === 'string' ? theme : theme.name
    );
  }
  
  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
}; 