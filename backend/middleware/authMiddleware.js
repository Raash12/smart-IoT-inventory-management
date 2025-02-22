const admin = require('firebase-admin');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token is required.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(403).send('Invalid token.');
    }
};

module.exports = authMiddleware;