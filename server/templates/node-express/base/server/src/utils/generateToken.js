const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!secret) {
        const err = new Error('JWT_SECRET is not configured');
        err.statusCode = 500;
        throw err;
    }

    if (!expiresIn) {
        const err = new Error('JWT_EXPIRES_IN is not configured');
        err.statusCode = 500;
        throw err;
    }

    return jwt.sign({ id: userId }, secret, { expiresIn });
};

module.exports = generateToken;
