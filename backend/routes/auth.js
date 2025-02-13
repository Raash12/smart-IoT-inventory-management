const express = require('express');
const router = express.Router();
const { login, signup, logout } = require('../controllers/authController');

// User registration route
router.post('/signup', signup);

// User login route
router.post('/login', login);

// User logout route
router.post('/logout', logout);

module.exports = router;