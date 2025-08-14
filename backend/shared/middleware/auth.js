const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

/**
 * JWT Authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, ERROR_MESSAGES.UNAUTHORIZED_ACCESS, HTTP_STATUS.UNAUTHORIZED);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return sendError(res, ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.FORBIDDEN);
    }
    req.user = user;
    next();
  });
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
