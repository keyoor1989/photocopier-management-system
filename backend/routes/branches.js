const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchUsers,
  getBranchInventory,
  getBranchServiceTickets,
  getBranchCustomers,
  getBranchActivity
} = require('../controllers/branches');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getBranches);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .post(createBranch);

router.route('/:id')
  .get(getBranch)
  .put(updateBranch)
  .delete(deleteBranch);

// Additional branch-specific routes
router.get('/:id/users', getBranchUsers);
router.get('/:id/inventory', getBranchInventory);
router.get('/:id/service-tickets', getBranchServiceTickets);
router.get('/:id/customers', getBranchCustomers);
router.get('/:id/activity', getBranchActivity);

module.exports = router; 