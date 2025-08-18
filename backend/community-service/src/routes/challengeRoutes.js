const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get active challenges endpoint (placeholder)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // TODO: Implement challenges logic
    res.json({
      success: true,
      challenges: [
        {
          id: 1,
          title: "30-Day Plastic-Free Challenge",
          description: "Eliminate single-use plastics from your daily routine",
          category: "plastic_reduction",
          difficulty: "medium",
          participants_count: 1247,
          end_date: "2024-02-15T23:59:59Z",
          reward_points: 500,
          is_active: true
        },
        {
          id: 2,
          title: "Community Garden Project",
          description: "Help establish a local community garden",
          category: "gardening",
          difficulty: "easy",
          participants_count: 89,
          end_date: "2024-01-30T23:59:59Z",
          reward_points: 300,
          is_active: true
        }
      ]
    });
  } catch (error) {
    console.error('Error getting challenges:', error);
    res.status(500).json({ message: 'Failed to get challenges' });
  }
});

module.exports = router;
