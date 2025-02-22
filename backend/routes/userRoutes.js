const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const authMiddleware = require('../middleware/authMiddleware');

// Get user details
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userDoc = await admin.firestore().collection('accounts').doc(req.user.id).get();
        
        if (!userDoc.exists) return res.status(404).send('User not found.');

        const userData = userDoc.data();
        res.json({
            uid: req.user.id,
            email: userData.email,
            username: userData.username,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

// Update user details
router.put('/update', authMiddleware, async (req, res) => {
    const { username, email } = req.body;

    try {
        // Update user in Firebase Authentication
        const updatedUser = await admin.auth().updateUser(req.user.id, {
            email,
            displayName: username,
        });

        // Update user details in Firestore
        await admin.firestore().collection('accounts').doc(req.user.id).update({
            username,
            email,
        });

        res.json({
            uid: updatedUser.uid,
            email: updatedUser.email,
            username,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

// Delete user
router.delete('/delete', authMiddleware, async (req, res) => {
    try {
        await admin.auth().deleteUser(req.user.id);
        await admin.firestore().collection('accounts').doc(req.user.id).delete();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

module.exports = router;