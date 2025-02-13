// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: { username, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


// Forgot Password - Generate Reset Token
exports.forgotPassword = async (req, res) => {
    const { username, email } = req.body;

    try {
        // Find the user by username and email
        const user = await User.findOne({ username, email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token (valid for 15 minutes)
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '15m' }
        );

        // Send the reset token to the user (In a real app, you'd email it)
        res.status(200).json({
            message: 'Password reset token generated successfully',
            resetToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error generating password reset token',
            error: error.message,
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your_jwt_secret');

        // Find the user by decoded ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Invalid reset token or user not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Invalid or expired reset token',
            error: error.message,
        });
    }
};


