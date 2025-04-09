const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  changePassword
} = require('../controllers/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/changepassword', protect, changePassword);

// Admin only routes
router.post('/register', protect, authorize('superadmin', 'admin'), register);

module.exports = router; 