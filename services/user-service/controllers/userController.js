const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const updatedUser = await User.updateProfile(userId, { username });
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        user_type: updatedUser.user_type,
        created_at: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
