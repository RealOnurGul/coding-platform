const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const rateLimit = require('express-rate-limit');

/**
 * Middleware to protect routes - validates JWT token and attaches user to request
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user exists
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 401));
    }

    // Attach user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

/**
 * Middleware to authorize by role
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Rate limiting middleware to prevent abuse
 * Limits requests by IP address
 */
exports.rateLimit = (maxRequests, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    // Clear old requests
    requests.forEach((timestamp, key) => {
      if (now - timestamp > windowMs) {
        requests.delete(key);
      }
    });

    // Get current requests for this IP
    const ipRequests = requests.get(ip) || [];
    
    // If too many requests
    if (ipRequests.length >= maxRequests) {
      // Filter requests within the time window
      const recentRequests = ipRequests.filter(time => now - time < windowMs);
      
      if (recentRequests.length >= maxRequests) {
        return next(
          new ErrorResponse('Too many requests, please try again later', 429)
        );
      }
    }

    // Add this request timestamp
    requests.set(ip, [...(ipRequests || []), now]);
    
    next();
  };
}; 