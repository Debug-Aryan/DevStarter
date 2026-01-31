const express = require('express');
const router = express.Router();

const healthRoute = require('./health');
const sampleController = require('../controllers/sampleController');

// Health Check
router.use('/health', healthRoute);

// Sample Route
router.get('/sample', sampleController.getSample);

module.exports = router;
