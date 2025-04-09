const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  convertToSale,
  sendQuotation,
  getQuotationsByCustomer,
  getQuotationsByStatus,
  getQuotationsByDateRange
} = require('../controllers/quotations');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getQuotations)
  .post(authorize('admin', 'manager', 'sales'), createQuotation);

router.route('/:id')
  .get(getQuotation)
  .put(authorize('admin', 'manager', 'sales'), updateQuotation)
  .delete(authorize('admin'), deleteQuotation);

// Additional quotation-specific routes
router.post('/:id/convert', authorize('admin', 'manager', 'sales'), convertToSale);
router.post('/:id/send', authorize('admin', 'manager', 'sales'), sendQuotation);
router.get('/customer/:customerId', getQuotationsByCustomer);
router.get('/status/:status', getQuotationsByStatus);
router.get('/date-range', getQuotationsByDateRange);

module.exports = router; 