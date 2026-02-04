const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api', routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
