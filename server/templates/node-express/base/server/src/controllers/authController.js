const authService = require('../services/authService');
const generateToken = require('../utils/generateToken');
const { sendSuccess } = require('../utils/response');

const parseDurationToMs = (duration) => {
    if (!duration) return undefined;
    const match = String(duration).trim().match(/^(\d+)([smhd])$/i);
    if (!match) return undefined;
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
};

const getCookieOptions = () => {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        ...(parseDurationToMs(process.env.JWT_EXPIRES_IN)
            ? { maxAge: parseDurationToMs(process.env.JWT_EXPIRES_IN) }
            : {}),
    };
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const err = new Error('Name, email, and password are required');
            err.statusCode = 400;
            throw err;
        }

        if (String(password).length < 8) {
            const err = new Error('Password must be at least 8 characters');
            err.statusCode = 400;
            throw err;
        }

        const user = await authService.register({ name, email, password });
        const token = generateToken(user.id);

        res.cookie('token', token, getCookieOptions());
        sendSuccess(res, 'Registered successfully', { user, token }, 201);
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const err = new Error('Email and password are required');
            err.statusCode = 400;
            throw err;
        }

        const user = await authService.login({ email, password });
        const token = generateToken(user.id);

        res.cookie('token', token, getCookieOptions());
        sendSuccess(res, 'Logged in successfully', { user, token });
    } catch (err) {
        next(err);
    }
};

const me = async (req, res, next) => {
    try {
        sendSuccess(res, 'Authenticated user', { user: req.user });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, me };
