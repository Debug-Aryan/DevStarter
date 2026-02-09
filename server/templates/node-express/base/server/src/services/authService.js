const userService = require('./userService');

const register = async ({ name, email, password }) => {
    const existing = await userService.findUserByEmail(email);
    if (existing) {
        const err = new Error('User already exists');
        err.statusCode = 400;
        throw err;
    }

    const user = await userService.createUser({ name, email, password });
    return user;
};

const login = async ({ email, password }) => {
    const userDoc = await userService.findUserByEmail(email, { withPassword: true });
    if (!userDoc) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const isMatch = await userDoc.comparePassword(password);
    if (!isMatch) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    return { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email };
};

module.exports = { register, login };
