const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/me', authMiddleware, authController.me);

module.exports = router;
