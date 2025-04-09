const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/users');

// Public routes
router.post('/register', createUser);

// Protected routes
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router; 