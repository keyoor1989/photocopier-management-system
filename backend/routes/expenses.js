const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getExpensesByDateRange,
  getExpensesByBranch,
  getExpenseReport
} = require('../controllers/expenses');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getExpenses)
  .post(authorize('admin', 'manager', 'finance'), createExpense);

router.route('/:id')
  .get(getExpense)
  .put(authorize('admin', 'manager', 'finance'), updateExpense)
  .delete(authorize('admin'), deleteExpense);

// Additional expense-specific routes
router.get('/category/:category', getExpensesByCategory);
router.get('/date-range', getExpensesByDateRange);
router.get('/branch/:branchId', getExpensesByBranch);
router.get('/report', authorize('admin', 'manager', 'finance'), getExpenseReport);

module.exports = router; 