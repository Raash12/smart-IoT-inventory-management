// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get user details
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).send('User not found.');
        res.json(user);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

// Get all users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

// Update user details
router.put('/update', authMiddleware, async (req, res) => {
    const { username, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

// Delete user
router.delete('/delete', authMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (!deletedUser) {
            return res.status(404).send('User not found.');
        }
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

module.exports = router;