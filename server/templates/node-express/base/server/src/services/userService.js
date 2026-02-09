const User = require('../models/User');
const mongoose = require('mongoose');

const ensureDbConnected = () => {
    if (mongoose.connection.readyState !== 1) {
        const err = new Error('Database not connected. Set MONGO_URI and restart the server.');
        err.statusCode = 503;
        throw err;
    }
};

const createUser = async ({ name, email, password }) => {
    ensureDbConnected();
    const user = await User.create({ name, email, password });
    return { id: user._id.toString(), name: user.name, email: user.email };
};

const findUserByEmail = async (email, { withPassword = false } = {}) => {
    ensureDbConnected();
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (withPassword) query.select('+password');
    return query;
};

const getUserById = async (id) => {
    ensureDbConnected();
    const user = await User.findById(id);
    if (!user) return null;
    return { id: user._id.toString(), name: user.name, email: user.email };
};

module.exports = {
    createUser,
    findUserByEmail,
    getUserById,
};
