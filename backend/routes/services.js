const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  assignService,
  updateServiceStatus,
  getServiceHistory,
  getServiceByCustomer,
  getServiceByEngineer
} = require('../controllers/services');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getServices)
  .post(authorize('admin', 'manager'), createService);

router.route('/:id')
  .get(getService)
  .put(authorize('admin', 'manager'), updateService)
  .delete(authorize('admin'), deleteService);

// Additional service-specific routes
router.post('/:id/assign', authorize('admin', 'manager'), assignService);
router.put('/:id/status', authorize('admin', 'manager', 'engineer'), updateServiceStatus);
router.get('/history', getServiceHistory);
router.get('/customer/:customerId', getServiceByCustomer);
router.get('/engineer/:engineerId', getServiceByEngineer);

module.exports = router; 