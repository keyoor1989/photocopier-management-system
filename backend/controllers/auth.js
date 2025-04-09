const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { formatResponse } = require('../utils/utilities');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Admin
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, office, phone } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse('User already exists', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    office,
    phone
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user is active
  if (!user.active) {
    return next(new ErrorResponse('Your account is deactivated. Please contact admin.', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json(
    formatResponse(true, 'User profile retrieved successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      office: user.office,
      phone: user.phone,
      active: user.active
    })
  );
});

// @desc    Change password
// @route   PUT /api/auth/changepassword
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json(
        formatResponse(false, 'Current password is incorrect')
      );
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json(
      formatResponse(true, 'Password updated successfully')
    );
  } catch (error) {
    res.status(500).json(
      formatResponse(false, error.message)
    );
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
}); 