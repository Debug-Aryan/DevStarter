const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    mongoose.set('bufferCommands', false);

    if (!process.env.MONGO_URI) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('MONGO_URI is required in production');
        }
        logger.warn('MONGO_URI not set. Skipping DB connection (auth routes will not work).');
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB };
