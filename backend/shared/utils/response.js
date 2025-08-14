/**
 * Standardized API response utilities
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} error - Error details
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : null,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 */
const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError
};
