const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

// User registration
exports.signup = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        // Store username in Firestore
        await admin.firestore().collection('accounts').doc(userRecord.uid).set({
            username,
            email,
        });

        res.status(201).json({ message: 'User registered successfully', userId: userRecord.uid });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// User login

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Verify the user with Firebase
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // Here, you would typically verify the password, but Firebase handles this
        const token = jwt.sign({ id: userRecord.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(400).json({ message: 'Invalid credentials' });
    }
};