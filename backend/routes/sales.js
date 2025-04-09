const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  generateInvoice,
  updatePaymentStatus,
  getSalesByCustomer,
  getSalesByDateRange,
  getSalesByProduct
} = require('../controllers/sales');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getSales)
  .post(authorize('admin', 'manager', 'sales'), createSale);

router.route('/:id')
  .get(getSale)
  .put(authorize('admin', 'manager'), updateSale)
  .delete(authorize('admin'), deleteSale);

// Additional sales-specific routes
router.post('/:id/invoice', authorize('admin', 'manager', 'sales'), generateInvoice);
router.put('/:id/payment', authorize('admin', 'manager', 'sales'), updatePaymentStatus);
router.get('/customer/:customerId', getSalesByCustomer);
router.get('/date-range', getSalesByDateRange);
router.get('/product/:productId', getSalesByProduct);

module.exports = router; 