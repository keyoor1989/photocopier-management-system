const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerMachines,
  getCustomerServiceHistory
} = require('../controllers/customers');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getCustomers)
  .post(createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

// Additional customer-specific routes
router.get('/:id/machines', getCustomerMachines);
router.get('/:id/service-history', getCustomerServiceHistory);

module.exports = router; 