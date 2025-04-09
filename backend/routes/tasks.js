const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  getTasksByAssignee,
  getTasksByPriority,
  getTasksByDueDate
} = require('../controllers/tasks');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getTasks)
  .post(authorize('admin', 'manager'), createTask);

router.route('/:id')
  .get(getTask)
  .put(authorize('admin', 'manager'), updateTask)
  .delete(authorize('admin'), deleteTask);

// Additional task-specific routes
router.post('/:id/assign', authorize('admin', 'manager'), assignTask);
router.put('/:id/status', authorize('admin', 'manager', 'user'), updateTaskStatus);
router.get('/assignee/:userId', getTasksByAssignee);
router.get('/priority/:priority', getTasksByPriority);
router.get('/due-date', getTasksByDueDate);

module.exports = router; 