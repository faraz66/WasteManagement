const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, validateResetToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/validate-reset-token', validateResetToken);

module.exports = router;
