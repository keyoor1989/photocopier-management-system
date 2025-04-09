const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse('User account is inactive', 401));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if user belongs to the same office as the resource
exports.sameOffice = (officeField) => {
  return (req, res, next) => {
    // Skip for superadmin
    if (req.user.role === 'superadmin') {
      return next();
    }

    // For other roles, check office match
    const resourceOffice = req[officeField] ? req[officeField].office : null;
    
    if (!resourceOffice || req.user.office !== resourceOffice) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access resources from other offices' 
      });
    }
    
    next();
  };
}; 