const Branch = require('../models/Branch');
const User = require('../models/User');
const Customer = require('../models/Customer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private
exports.getBranches = asyncHandler(async (req, res, next) => {
  // Extract query parameters
  const { page = 1, perPage = 10, search = '', sortBy = 'name', sortDirection = 'asc' } = req.query;
  
  // Build query
  let query = {};
  
  // Add search filter if provided
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ]
    };
  }
  
  // Count total documents for pagination
  const total = await Branch.countDocuments(query);
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
  
  // Execute query with pagination
  const branches = await Branch.find(query)
    .sort(sort)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));
  
  res.status(200).json({
    success: true,
    count: branches.length,
    total,
    page: parseInt(page),
    perPage: parseInt(perPage),
    totalPages: Math.ceil(total / perPage),
    data: branches
  });
});

// @desc    Get single branch
// @route   GET /api/branches/:id
// @access  Private/Admin
exports.getBranch = asyncHandler(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);
  
  if (!branch) {
    return next(new ErrorResponse(`Branch not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: branch
  });
});

// @desc    Create branch
// @route   POST /api/branches
// @access  Private/Admin
exports.createBranch = asyncHandler(async (req, res, next) => {
  const branch = await Branch.create(req.body);
  
  res.status(201).json({
    success: true,
    data: branch
  });
});

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
exports.updateBranch = asyncHandler(async (req, res, next) => {
  let branch = await Branch.findById(req.params.id);

  if (!branch) {
    return next(new ErrorResponse(`Branch not found with id of ${req.params.id}`, 404));
  }

  branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: branch
  });
});

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
exports.deleteBranch = asyncHandler(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    return next(new ErrorResponse(`Branch not found with id of ${req.params.id}`, 404));
  }

  await branch.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get branch users
// @route   GET /api/branches/:id/users
// @access  Private/Admin
exports.getBranchUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ branch: req.params.id }).select('-password');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get branch inventory
// @route   GET /api/branches/:id/inventory
// @access  Private/Admin
exports.getBranchInventory = asyncHandler(async (req, res, next) => {
  // This would typically involve a separate Inventory model
  // For now, we'll return a placeholder
  res.status(200).json({
    success: true,
    data: []
  });
});

// @desc    Get branch service tickets
// @route   GET /api/branches/:id/service-tickets
// @access  Private/Admin
exports.getBranchServiceTickets = asyncHandler(async (req, res, next) => {
  // This would typically involve a separate ServiceTicket model
  // For now, we'll return a placeholder
  res.status(200).json({
    success: true,
    data: []
  });
});

// @desc    Get branch customers
// @route   GET /api/branches/:id/customers
// @access  Private/Admin
exports.getBranchCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find({ branch: req.params.id });
  
  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers
  });
});

// @desc    Get branch activity
// @route   GET /api/branches/:id/activity
// @access  Private/Admin
exports.getBranchActivity = asyncHandler(async (req, res, next) => {
  // This would typically involve a separate Activity model
  // For now, we'll return a placeholder
  res.status(200).json({
    success: true,
    data: []
  });
}); 