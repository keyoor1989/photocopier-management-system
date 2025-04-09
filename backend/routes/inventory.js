const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  adjustStock,
  getLowStockItems,
  getInventoryHistory,
  getInventoryByCategory
} = require('../controllers/inventory');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getInventory)
  .post(authorize('admin', 'manager'), createInventoryItem);

router.route('/:id')
  .get(getInventoryItem)
  .put(authorize('admin', 'manager'), updateInventoryItem)
  .delete(authorize('admin'), deleteInventoryItem);

// Additional inventory-specific routes
router.post('/:id/adjust', authorize('admin', 'manager'), adjustStock);
router.get('/low-stock', getLowStockItems);
router.get('/history', getInventoryHistory);
router.get('/category/:category', getInventoryByCategory);

module.exports = router; 