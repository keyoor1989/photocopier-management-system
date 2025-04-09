const Maintenance = require('../models/Maintenance');
const Printer = require('../models/Printer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all maintenance records
// @route   GET /api/v1/maintenance
// @access  Private
exports.getMaintenanceRecords = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single maintenance record
// @route   GET /api/v1/maintenance/:id
// @access  Private
exports.getMaintenanceRecord = asyncHandler(async (req, res, next) => {
  const maintenance = await Maintenance.findById(req.params.id);

  if (!maintenance) {
    return next(
      new ErrorResponse(`Maintenance record not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: maintenance
  });
});

// @desc    Create new maintenance record
// @route   POST /api/v1/maintenance
// @access  Private/Admin
exports.createMaintenanceRecord = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if printer exists
  const printer = await Printer.findById(req.body.printer);
  if (!printer) {
    return next(
      new ErrorResponse(`Printer not found with id of ${req.body.printer}`, 404)
    );
  }

  const maintenance = await Maintenance.create(req.body);

  res.status(201).json({
    success: true,
    data: maintenance
  });
});

// @desc    Update maintenance record
// @route   PUT /api/v1/maintenance/:id
// @access  Private/Admin
exports.updateMaintenanceRecord = asyncHandler(async (req, res, next) => {
  let maintenance = await Maintenance.findById(req.params.id);

  if (!maintenance) {
    return next(
      new ErrorResponse(`Maintenance record not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is maintenance record owner
  if (maintenance.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this maintenance record`,
        401
      )
    );
  }

  maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: maintenance
  });
});

// @desc    Delete maintenance record
// @route   DELETE /api/v1/maintenance/:id
// @access  Private/Admin
exports.deleteMaintenanceRecord = asyncHandler(async (req, res, next) => {
  const maintenance = await Maintenance.findById(req.params.id);

  if (!maintenance) {
    return next(
      new ErrorResponse(`Maintenance record not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is maintenance record owner
  if (maintenance.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this maintenance record`,
        401
      )
    );
  }

  await maintenance.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 