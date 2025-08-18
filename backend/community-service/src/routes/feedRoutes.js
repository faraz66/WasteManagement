const express = require('express');
const { body, query, validationResult } = require('express-validator');
const feedController = require('../controllers/feedController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Get personalized feed
router.get('/',
  authMiddleware,
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
    query('category').optional().isString().trim(),
    query('location').optional().isString().trim(),
    query('type').optional().isIn(['all', 'following', 'local', 'trending']).withMessage('Invalid feed type')
  ],
  validateRequest,
  feedController.getPersonalizedFeed
);

// Get trending posts
router.get('/trending',
  authMiddleware,
  [
    query('timeframe').optional().isIn(['hour', 'day', 'week', 'month']).withMessage('Invalid timeframe'),
    query('category').optional().isString().trim(),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  validateRequest,
  feedController.getTrendingPosts
);

// Get local feed based on user location
router.get('/local',
  authMiddleware,
  [
    query('radius').optional().isFloat({ min: 1, max: 1000 }).withMessage('Radius must be between 1 and 1000 km'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
  ],
  validateRequest,
  feedController.getLocalFeed
);

// Get posts from followed users
router.get('/following',
  authMiddleware,
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
  ],
  validateRequest,
  feedController.getFollowingFeed
);

// Record feed interaction for algorithm learning
router.post('/interaction',
  authMiddleware,
  [
    body('postId').isInt().withMessage('Post ID is required'),
    body('interactionType').isIn(['view', 'click', 'like', 'comment', 'share', 'skip', 'hide']).withMessage('Invalid interaction type'),
    body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be non-negative'),
    body('scrollPosition').optional().isFloat({ min: 0, max: 1 }).withMessage('Scroll position must be between 0 and 1')
  ],
  validateRequest,
  feedController.recordFeedInteraction
);

// Get feed analytics for user (engagement patterns)
router.get('/analytics',
  authMiddleware,
  [
    query('timeframe').optional().isIn(['week', 'month', 'quarter', 'year']).withMessage('Invalid timeframe')
  ],
  validateRequest,
  feedController.getFeedAnalytics
);

// Update user feed preferences
router.put('/preferences',
  authMiddleware,
  [
    body('interests').optional().isArray().withMessage('Interests must be an array'),
    body('interests.*').optional().isString().trim().withMessage('Each interest must be a string'),
    body('preferredContentTypes').optional().isArray().withMessage('Preferred content types must be an array'),
    body('preferredContentTypes.*').optional().isIn(['tips', 'projects', 'news', 'events', 'questions', 'achievements']).withMessage('Invalid content type'),
    body('notificationPreferences').optional().isObject().withMessage('Notification preferences must be an object'),
    body('privacySettings').optional().isObject().withMessage('Privacy settings must be an object'),
    body('location').optional().isObject().withMessage('Location must be an object'),
    body('location.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('location.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    body('location.city').optional().isString().trim().withMessage('City must be a string'),
    body('location.country').optional().isString().trim().withMessage('Country must be a string')
  ],
  validateRequest,
  feedController.updateFeedPreferences
);

// Get personalized content recommendations
router.get('/recommendations',
  authMiddleware,
  [
    query('type').optional().isIn(['users', 'groups', 'challenges', 'content']).withMessage('Invalid recommendation type'),
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
  ],
  validateRequest,
  feedController.getRecommendations
);

// Search feed content
router.get('/search',
  authMiddleware,
  [
    query('q').isString().isLength({ min: 1, max: 100 }).withMessage('Search query is required (1-100 characters)'),
    query('category').optional().isString().trim(),
    query('location').optional().isString().trim(),
    query('sortBy').optional().isIn(['relevance', 'recent', 'popular']).withMessage('Invalid sort option'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
  ],
  validateRequest,
  feedController.searchFeed
);

// Get feed for specific category
router.get('/category/:category',
  authMiddleware,
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
    query('sortBy').optional().isIn(['recent', 'popular', 'trending']).withMessage('Invalid sort option')
  ],
  validateRequest,
  feedController.getCategoryFeed
);

module.exports = router;
