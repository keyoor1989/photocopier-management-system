const Printer = require('../models/Printer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all printers
// @route   GET /api/v1/printers
// @access  Private
exports.getPrinters = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single printer
// @route   GET /api/v1/printers/:id
// @access  Private
exports.getPrinter = asyncHandler(async (req, res, next) => {
  const printer = await Printer.findById(req.params.id);

  if (!printer) {
    return next(
      new ErrorResponse(`Printer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: printer
  });
});

// @desc    Create new printer
// @route   POST /api/v1/printers
// @access  Private/Admin
exports.createPrinter = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const printer = await Printer.create(req.body);

  res.status(201).json({
    success: true,
    data: printer
  });
});

// @desc    Update printer
// @route   PUT /api/v1/printers/:id
// @access  Private/Admin
exports.updatePrinter = asyncHandler(async (req, res, next) => {
  let printer = await Printer.findById(req.params.id);

  if (!printer) {
    return next(
      new ErrorResponse(`Printer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is printer owner
  if (printer.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this printer`,
        401
      )
    );
  }

  printer = await Printer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: printer
  });
});

// @desc    Delete printer
// @route   DELETE /api/v1/printers/:id
// @access  Private/Admin
exports.deletePrinter = asyncHandler(async (req, res, next) => {
  const printer = await Printer.findById(req.params.id);

  if (!printer) {
    return next(
      new ErrorResponse(`Printer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is printer owner
  if (printer.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this printer`,
        401
      )
    );
  }

  await printer.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 