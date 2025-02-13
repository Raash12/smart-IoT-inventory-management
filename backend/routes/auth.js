const express = require('express');
const router = express.Router();
const { login, signup, forgotPassword, resetPassword } = require('../controllers/authController');

// User registration route
router.post('/register', signup);

// User login route
router.post('/login', login);

// Forgot password route (generate reset token)
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;