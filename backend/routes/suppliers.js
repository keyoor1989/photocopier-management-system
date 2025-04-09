const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierProducts,
  getSupplierOrders,
  getSupplierPayments,
  getSupplierPerformance
} = require('../controllers/suppliers');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getSuppliers)
  .post(authorize('admin', 'manager'), createSupplier);

router.route('/:id')
  .get(getSupplier)
  .put(authorize('admin', 'manager'), updateSupplier)
  .delete(authorize('admin'), deleteSupplier);

// Additional supplier-specific routes
router.get('/:id/products', getSupplierProducts);
router.get('/:id/orders', getSupplierOrders);
router.get('/:id/payments', getSupplierPayments);
router.get('/:id/performance', getSupplierPerformance);

module.exports = router; 