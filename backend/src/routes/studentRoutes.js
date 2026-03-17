const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// @route   POST /api/students
// @desc    Register a new student
// @access  Private (Admin, Assistant)
router.post('/', auth, requireRole('admin', 'assistant'), studentController.registerStudent);

module.exports = router;
