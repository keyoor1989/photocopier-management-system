const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getDashboardStats,
  getSalesStats,
  getServiceStats,
  getInventoryStats,
  getCustomerStats,
  getFinancialStats,
  getEngineerStats,
  getBranchStats,
  getCustomStats
} = require('../controllers/dashboard');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getDashboardStats);

// Specific dashboard widget routes
router.get('/sales', getSalesStats);
router.get('/services', getServiceStats);
router.get('/inventory', getInventoryStats);
router.get('/customers', getCustomerStats);
router.get('/financial', authorize('admin', 'manager', 'finance'), getFinancialStats);
router.get('/engineers', getEngineerStats);
router.get('/branches', getBranchStats);

// Custom stats route with query parameters
router.get('/custom', getCustomStats);

module.exports = router; 