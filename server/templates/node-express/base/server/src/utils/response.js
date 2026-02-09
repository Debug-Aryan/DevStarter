const send = (res, statusCode, payload) => {
    res.status(statusCode).json(payload);
};

const sendSuccess = (res, message, data, statusCode = 200) => {
    const payload = {
        success: true,
        message,
        ...(data !== undefined ? { data } : {}),
    };
    send(res, statusCode, payload);
};

const sendError = (res, message, statusCode = 400, data) => {
    const payload = {
        success: false,
        message,
        ...(data !== undefined ? { data } : {}),
    };
    send(res, statusCode, payload);
};

module.exports = { sendSuccess, sendError };
