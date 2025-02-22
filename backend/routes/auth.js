// routes/auth.js
const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController');

// User registration route
router.post('/signup', signup);

// User login route
router.post('/login', login);

module.exports = router;