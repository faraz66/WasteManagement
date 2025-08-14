/**
 * Shared constants for all backend services
 */

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Database Tables
const TABLES = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CART_ITEMS: 'cart_items',
  COURSES: 'courses',
  ARTICLES: 'articles',
  USER_PROGRESS: 'user_progress'
};

// JWT Configuration
const JWT_CONFIG = {
  EXPIRES_IN: '24h',
  ALGORITHM: 'HS256'
};

// Validation Rules
const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid or expired token',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error'
};

// Success Messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  DATA_RETRIEVED: 'Data retrieved successfully',
  DATA_UPDATED: 'Data updated successfully',
  DATA_DELETED: 'Data deleted successfully'
};

module.exports = {
  HTTP_STATUS,
  TABLES,
  JWT_CONFIG,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
