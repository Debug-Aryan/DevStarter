const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            const err = new Error('Not authorized');
            err.statusCode = 401;
            throw err;
        }

        if (!process.env.JWT_SECRET) {
            const err = new Error('JWT_SECRET is not configured');
            err.statusCode = 500;
            throw err;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserById(decoded.id);

        if (!user) {
            const err = new Error('Not authorized');
            err.statusCode = 401;
            throw err;
        }

        req.user = user;
        next();
    } catch (err) {
        if (!err.statusCode) err.statusCode = 401;
        next(err);
    }
};

module.exports = authMiddleware;
