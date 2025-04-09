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
  getCustomStats,
  // Add new controller functions for the missing endpoints
  getSalesChartData,
  getServiceChartData,
  getRecentActivities,
  getAlerts,
  getMetrics,
  getOverviewStats,
  // New enhanced dashboard endpoints
  getServicePerformance,
  getInventoryStatus,
  getCustomerInsights
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

// New endpoints required by the frontend
router.get('/sales-chart', getSalesChartData);
router.get('/service-chart', getServiceChartData);
router.get('/activities', getRecentActivities);
router.get('/alerts', getAlerts);
router.get('/metrics', getMetrics);
router.get('/overview', getOverviewStats);

// New enhanced dashboard endpoints
router.get('/service-performance', getServicePerformance);
router.get('/inventory-status', getInventoryStatus);
router.get('/customer-insights', getCustomerInsights);

// Custom stats route with query parameters
router.get('/custom', getCustomStats);

module.exports = router; 