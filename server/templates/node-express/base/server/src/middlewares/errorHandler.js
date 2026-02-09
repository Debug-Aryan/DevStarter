const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
    const message = err.message || 'Server error';

    const data =
        process.env.NODE_ENV === 'production'
            ? undefined
            : {
                  stack: err.stack,
              };

    sendError(res, message, statusCode, data);
};

module.exports = errorHandler;
