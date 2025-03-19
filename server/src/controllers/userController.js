const { User, UserPreference, UserStats, Theme } = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
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

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Format user data for response
  const userData = {
    ...user.toJSON(),
    themes: user.themes ? user.themes.map(theme => theme.name) : []
  };

  res.status(200).json({
    success: true,
    data: userData
  });
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { name, bio, avatarColor } = req.body;
  
  const fieldsToUpdate = {
    name: name,
    bio: bio,
    avatarColor: avatarColor
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
      { model: UserPreference, as: 'preferences' },
      { model: UserStats, as: 'stats' },
      { 
        model: Theme, 
        as: 'themes',
        through: { attributes: [] }
      }
    ]
  });

  // Format user data for response
  const userData = {
    ...updatedUser.toJSON(),
    themes: updatedUser.themes ? updatedUser.themes.map(theme => theme.name) : []
  };

  res.status(200).json({
    success: true,
    data: userData
  });
});

/**
 * @desc    Get user progress
 * @route   GET /api/users/progress
 * @access  Private
 */
const getUserProgress = asyncHandler(async (req, res, next) => {
  const userStats = await UserStats.findOne({
    where: { userId: req.user.id }
  });

  if (!userStats) {
    return next(new ErrorResponse('User stats not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      totalSolved: userStats.totalProblemsSolved || 0,
      progressByDifficulty: {
        easy: userStats.easyProblemsSolved || 0,
        medium: userStats.mediumProblemsSolved || 0,
        hard: userStats.hardProblemsSolved || 0
      },
      streak: userStats.maxStreak || 0,
      activeDays: userStats.activeDays || 0
    }
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserProgress
}; 