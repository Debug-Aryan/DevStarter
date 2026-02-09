const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const parseOrigins = (value) => {
    if (!value) return [];
    return value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};

const allowedOrigins = parseOrigins(process.env.CLIENT_URL);
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            const err = new Error('Not allowed by CORS');
            err.statusCode = 403;
            return callback(err);
        },
        credentials: true,
    })
);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
