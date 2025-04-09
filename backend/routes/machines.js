const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  getMachines,
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine,
  getMachineServiceHistory,
  getMachineParts,
  getMachineMaintenanceSchedule
} = require('../controllers/machines');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getMachines)
  .post(authorize('admin', 'manager'), createMachine);

router.route('/:id')
  .get(getMachine)
  .put(authorize('admin', 'manager'), updateMachine)
  .delete(authorize('admin'), deleteMachine);

// Additional machine-specific routes
router.get('/:id/service-history', getMachineServiceHistory);
router.get('/:id/parts', getMachineParts);
router.get('/:id/maintenance-schedule', getMachineMaintenanceSchedule);

module.exports = router; 