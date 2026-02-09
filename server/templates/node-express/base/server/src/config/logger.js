const format = (level, message, meta) => {
    const timestamp = new Date().toISOString();
    const payload = {
        level,
        timestamp,
        message,
        ...(meta ? { meta } : {}),
    };

    if (process.env.NODE_ENV === 'production') {
        return JSON.stringify(payload);
    }

    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

const logger = {
    info: (message, meta) => console.log(format('info', message, meta)),
    warn: (message, meta) => console.warn(format('warn', message, meta)),
    error: (message, meta) => console.error(format('error', message, meta)),
};

module.exports = logger;
