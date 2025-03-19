/**
 * Async handler to wrap async route handlers and catch errors
 * Eliminates the need for try/catch blocks in route handlers
 * @param {Function} fn - The async route handler function
 * @returns {Function} - Express middleware function that handles errors
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 