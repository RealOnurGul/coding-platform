/**
 * Custom error response class for handling API errors
 * @extends Error
 */
class ErrorResponse extends Error {
  /**
   * Create a new ErrorResponse
   * @param {string|string[]} message - Error message or array of messages
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    // If message is an array, join it with commas
    const formattedMessage = Array.isArray(message) ? message.join(', ') : message;
    super(formattedMessage);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse; 