/**
 * Format response for consistency
 */
exports.formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data && { data })
  };
};

/**
 * Generate a unique code with prefix
 */
exports.generateUniqueCode = (prefix, count) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${prefix}${year}${month}${(count + 1).toString().padStart(4, '0')}`;
};

/**
 * Calculate pagination values
 */
exports.getPagination = (page, limit) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skipCount = (pageNum - 1) * limitNum;
  
  return {
    skip: skipCount,
    limit: limitNum,
    page: pageNum
  };
};

/**
 * Create pagination info for response
 */
exports.createPaginationInfo = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
};

/**
 * Filter by office based on user role
 */
exports.getOfficeFilter = (user) => {
  if (user.role === 'superadmin') {
    return {};
  }
  return { office: user.office };
};

/**
 * Calculate GST for items
 */
exports.calculateGST = (price, gstRate) => {
  return (price * gstRate) / 100;
};

/**
 * Calculate days since a date
 */
exports.daysSince = (date) => {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}; 