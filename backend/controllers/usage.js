const Usage = require('../models/Usage');
const Printer = require('../models/Printer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all usage records
// @route   GET /api/v1/usage
// @access  Private
exports.getUsageRecords = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single usage record
// @route   GET /api/v1/usage/:id
// @access  Private
exports.getUsageRecord = asyncHandler(async (req, res, next) => {
  const usage = await Usage.findById(req.params.id);

  if (!usage) {
    return next(
      new ErrorResponse(`Usage record not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: usage
  });
});

// @desc    Create new usage record
// @route   POST /api/v1/usage
// @access  Private/Admin
exports.createUsageRecord = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if printer exists
  const printer = await Printer.findById(req.body.printer);
  if (!printer) {
    return next(
      new ErrorResponse(`Printer not found with id of ${req.body.printer}`, 404)
    );
  }

  const usage = await Usage.create(req.body);

  res.status(201).json({
    success: true,
    data: usage
  });
});

// @desc    Update usage record
// @route   PUT /api/v1/usage/:id
// @access  Private/Admin
exports.updateUsageRecord = asyncHandler(async (req, res, next) => {
  let usage = await Usage.findById(req.params.id);

  if (!usage) {
    return next(
      new ErrorResponse(`Usage record not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is usage record owner
  if (usage.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this usage record`,
        401
      )
    );
  }

  usage = await Usage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: usage
  });
});

// @desc    Delete usage record
// @route   DELETE /api/v1/usage/:id
// @access  Private/Admin
exports.deleteUsageRecord = asyncHandler(async (req, res, next) => {
  const usage = await Usage.findById(req.params.id);

  if (!usage) {
    return next(
      new ErrorResponse(`Usage record not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is usage record owner
  if (usage.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this usage record`,
        401
      )
    );
  }

  await usage.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 