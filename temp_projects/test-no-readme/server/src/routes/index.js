const express = require('express');
const authRoutes = require('./auth');

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

router.use('/auth', authRoutes);

module.exports = router;
