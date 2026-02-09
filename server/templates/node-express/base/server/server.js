require('dotenv').config();

const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
};

startServer().catch((err) => {
    logger.error(err?.message || 'Failed to start server');
    process.exit(1);
});
