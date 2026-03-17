const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// @route POST /api/auth/login
router.post('/login', authController.login);

// @route POST /api/auth/register
router.post('/register', auth, requireRole('admin'), authController.register);

module.exports = router;