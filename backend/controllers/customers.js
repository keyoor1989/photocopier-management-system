const Customer = require('../models/Customer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find();
  
  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers
  });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  
  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.create(req.body);
  
  res.status(201).json({
    success: true,
    data: customer
  });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  await customer.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get customer machines
// @route   GET /api/customers/:id/machines
// @access  Private
exports.getCustomerMachines = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  // This would typically involve a separate Machine model
  // For now, we'll return a placeholder
  res.status(200).json({
    success: true,
    data: []
  });
});

// @desc    Get customer service history
// @route   GET /api/customers/:id/service-history
// @access  Private
exports.getCustomerServiceHistory = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  // This would typically involve a separate Service model
  // For now, we'll return a placeholder
  res.status(200).json({
    success: true,
    data: []
  });
}); 