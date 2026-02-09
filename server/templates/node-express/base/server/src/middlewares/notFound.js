const { sendError } = require('../utils/response');

const notFound = (req, res) => {
    sendError(res, `Route not found: ${req.originalUrl}`, 404);
};

module.exports = notFound;

