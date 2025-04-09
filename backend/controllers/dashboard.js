const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      totalSales: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      totalCustomers: 0,
      totalMachines: 0,
      activeServiceTickets: 0,
      lowStockItems: 0,
      pendingQuotations: 0
    }
  });
});

// @desc    Get sales stats
// @route   GET /api/dashboard/sales
// @access  Private
exports.getSalesStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      totalSales: 0,
      monthlySales: [],
      topProducts: [],
      salesByRegion: {},
      salesByCustomerType: {}
    }
  });
});

// @desc    Get service stats
// @route   GET /api/dashboard/services
// @access  Private
exports.getServiceStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      activeTickets: 0,
      resolvedTickets: 0,
      averageResolutionTime: 0,
      servicesByType: {},
      servicesByEngineer: {}
    }
  });
});

// @desc    Get inventory stats
// @route   GET /api/dashboard/inventory
// @access  Private
exports.getInventoryStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      totalItems: 0,
      lowStockItems: [],
      stockValue: 0,
      topMovingItems: [],
      inventoryByCategory: {}
    }
  });
});

// @desc    Get customer stats
// @route   GET /api/dashboard/customers
// @access  Private
exports.getCustomerStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      totalCustomers: 0,
      newCustomers: 0,
      activeCustomers: 0,
      customersByType: {},
      customersByRegion: {}
    }
  });
});

// @desc    Get financial stats
// @route   GET /api/dashboard/financial
// @access  Private/Admin
exports.getFinancialStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      revenue: 0,
      expenses: 0,
      profit: 0,
      accountsReceivable: 0,
      accountsPayable: 0,
      monthlyRevenue: [],
      monthlyExpenses: []
    }
  });
});

// @desc    Get engineer stats
// @route   GET /api/dashboard/engineers
// @access  Private
exports.getEngineerStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      totalEngineers: 0,
      activeEngineers: 0,
      ticketsPerEngineer: {},
      performanceMetrics: {}
    }
  });
});

// @desc    Get branch stats
// @route   GET /api/dashboard/branches
// @access  Private
exports.getBranchStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {
      totalBranches: 0,
      branchPerformance: {},
      branchInventory: {},
      branchSales: {},
      branchExpenses: {}
    }
  });
});

// @desc    Get custom stats
// @route   GET /api/dashboard/custom
// @access  Private
exports.getCustomStats = asyncHandler(async (req, res, next) => {
  // Placeholder response until controller is fully implemented
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get sales chart data
// @route   GET /api/dashboard/sales-chart
// @access  Private
exports.getSalesChartData = asyncHandler(async (req, res, next) => {
  // Get date range parameters or use default (last 30 days)
  const { startDate, endDate } = req.query;
  
  // Placeholder chart data with sample values in the format expected by the frontend
  const salesData = [
    { month: 'Jan', amount: 3500 },
    { month: 'Feb', amount: 4200 },
    { month: 'Mar', amount: 3800 },
    { month: 'Apr', amount: 5100 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 5500 },
    { month: 'Jul', amount: 6200 },
    { month: 'Aug', amount: 5900 },
    { month: 'Sep', amount: 6500 },
    { month: 'Oct', amount: 7200 },
    { month: 'Nov', amount: 6800 },
    { month: 'Dec', amount: 7500 }
  ];
  
  res.status(200).json({
    success: true,
    data: salesData
  });
});

// @desc    Get service chart data
// @route   GET /api/dashboard/service-chart
// @access  Private
exports.getServiceChartData = asyncHandler(async (req, res, next) => {
  // Get date range parameters or use default (last 30 days)
  const { startDate, endDate } = req.query;
  
  // Placeholder chart data with sample values in the format expected by the frontend
  const serviceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tickets: [12, 15, 10, 8, 14, 16, 9, 7, 13, 11, 8, 10],
    resolved: [8, 10, 12, 15, 9, 11, 14, 16, 10, 12, 15, 13]
  };
  
  res.status(200).json({
    success: true,
    data: serviceData
  });
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = asyncHandler(async (req, res, next) => {
  // Get date range parameters or use default (last 30 days)
  const { startDate, endDate } = req.query;
  
  // Placeholder activity data
  const activities = [
    {
      id: '1',
      type: 'service_ticket',
      action: 'created',
      title: 'New Service Ticket #ST-2023-001',
      description: 'Service ticket for printer maintenance was created',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
      user: {
        id: '1',
        name: 'John Doe'
      },
      entity: {
        id: 'ST-2023-001',
        type: 'service_ticket',
        url: '/service-tickets/ST-2023-001'
      }
    },
    {
      id: '2',
      type: 'machine',
      action: 'updated',
      title: 'Machine Status Updated',
      description: 'Photocopier #PC-2023-105 status changed to Maintenance',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
      user: {
        id: '2',
        name: 'Jane Smith'
      },
      entity: {
        id: 'PC-2023-105',
        type: 'machine',
        url: '/machines/PC-2023-105'
      }
    },
    {
      id: '3',
      type: 'customer',
      action: 'created',
      title: 'New Customer Added',
      description: 'ABC Corporation added as a new customer',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
      user: {
        id: '1',
        name: 'John Doe'
      },
      entity: {
        id: 'CUST-2023-042',
        type: 'customer',
        url: '/customers/CUST-2023-042'
      }
    },
    {
      id: '4',
      type: 'inventory',
      action: 'updated',
      title: 'Low Inventory Alert',
      description: 'Toner cartridge TC-105 is running low in stock',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 4)),
      user: {
        id: '3',
        name: 'Mike Johnson'
      },
      entity: {
        id: 'TC-105',
        type: 'inventory',
        url: '/inventory/TC-105'
      }
    },
    {
      id: '5',
      type: 'sale',
      action: 'created',
      title: 'New Sale Completed',
      description: 'Sale of Printer Model XYZ-123 to ABC Corporation',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
      user: {
        id: '2',
        name: 'Jane Smith'
      },
      entity: {
        id: 'SALE-2023-089',
        type: 'sale',
        url: '/sales/SALE-2023-089'
      }
    }
  ];
  
  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities
  });
});

// @desc    Get alerts
// @route   GET /api/dashboard/alerts
// @access  Private
exports.getAlerts = asyncHandler(async (req, res, next) => {
  // Placeholder alerts data
  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Low Inventory',
      message: '5 items are running low in stock and need replenishment',
      timestamp: new Date(),
      read: false,
      action: {
        label: 'View Inventory',
        url: '/inventory?filter=low-stock'
      }
    },
    {
      id: '2',
      type: 'error',
      title: 'Payment Overdue',
      message: 'Customer ABC Corporation has an overdue payment of $1,500',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
      read: false,
      action: {
        label: 'View Customer',
        url: '/customers/CUST-2023-042'
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'Service Due',
      message: '3 machines are due for regular maintenance this week',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
      read: false,
      action: {
        label: 'Schedule Service',
        url: '/service-tickets/create'
      }
    }
  ];
  
  res.status(200).json({
    success: true,
    count: alerts.length,
    data: alerts
  });
});

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/metrics
// @access  Private
exports.getMetrics = asyncHandler(async (req, res, next) => {
  // Enhanced metrics data with more detailed information
  const metrics = {
    serviceTickets: {
      total: 42,
      change: 8,
      open: 15,
      inProgress: 12,
      resolved: 15,
      averageResolutionTime: 36, // in hours
      overdueTickets: 3
    },
    machines: {
      total: 120,
      change: 5,
      active: 105,
      maintenance: 10,
      outOfService: 5,
      needingMaintenance: 8,
      utilization: 78, // percentage
      averageAge: 2.4 // years
    },
    inventory: {
      totalItems: 250,
      change: -3,
      lowStock: 8,
      totalValue: 45000,
      topSellingItems: ['Toner XYZ-123', 'Drum Unit DR-123', 'Maintenance Kit MK-456'],
      recentlyAddedItems: 12,
      inventoryTurnover: 3.2
    },
    revenue: {
      total: 128500,
      change: 12,
      service: 32500,
      parts: 96000,
      projectedMonthly: 135000,
      previousPeriod: 114800,
      yearToDate: 965000,
      recurring: 85000
    },
    customers: {
      total: 86,
      new: 5,
      active: 72,
      dormant: 14,
      retention: 92, // percentage
      satisfaction: 4.7, // out of 5
      nps: 72 // Net Promoter Score
    }
  };
  
  res.status(200).json({
    success: true,
    data: metrics
  });
});

// @desc    Get service performance data
// @route   GET /api/dashboard/service-performance
// @access  Private
exports.getServicePerformance = asyncHandler(async (req, res, next) => {
  // Service performance data
  const data = {
    ticketResolutionTime: {
      average: 36, // hours
      target: 24, // hours
      min: 1.5, // hours
      max: 120, // hours
      byPriority: {
        high: 18, // hours
        medium: 36, // hours
        low: 60 // hours
      }
    },
    engineerPerformance: [
      { 
        name: "John Smith", 
        ticketsResolved: 24, 
        averageResolutionTime: 22, // hours
        customerRating: 4.8, // out of 5
        productivity: 92 // percentage
      },
      { 
        name: "Emma Johnson", 
        ticketsResolved: 18, 
        averageResolutionTime: 24, // hours
        customerRating: 4.9, // out of 5
        productivity: 88 // percentage
      },
      { 
        name: "Michael Lee", 
        ticketsResolved: 16, 
        averageResolutionTime: 28, // hours
        customerRating: 4.6, // out of 5
        productivity: 85 // percentage
      },
      { 
        name: "Sarah Williams", 
        ticketsResolved: 20, 
        averageResolutionTime: 26, // hours
        customerRating: 4.7, // out of 5
        productivity: 87 // percentage
      }
    ],
    ticketTypeDistribution: [
      { type: "Hardware Failure", count: 15, percentage: 36 },
      { type: "Software Issue", count: 10, percentage: 24 },
      { type: "Maintenance", count: 8, percentage: 19 },
      { type: "User Training", count: 5, percentage: 12 },
      { type: "Other", count: 4, percentage: 9 }
    ],
    serviceTicketStatus: {
      open: 15,
      inProgress: 12,
      resolved: 15,
      closed: 185,
      reopened: 3
    },
    firstTimeResolution: 82, // percentage
    customerSatisfaction: {
      average: 4.7, // out of 5
      distribution: [
        { stars: 5, percentage: 75 },
        { stars: 4, percentage: 20 },
        { stars: 3, percentage: 3 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 1 }
      ]
    }
  };
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get inventory status data
// @route   GET /api/dashboard/inventory-status
// @access  Private
exports.getInventoryStatus = asyncHandler(async (req, res, next) => {
  // Inventory status data
  const data = {
    lowStockItems: [
      { id: "INV-001", name: "Toner XYZ-123", currentStock: 5, minThreshold: 10, supplier: "ABC Supplies", lastOrderDate: "2023-03-15", reorderAmount: 20 },
      { id: "INV-034", name: "Drum Unit DR-123", currentStock: 3, minThreshold: 8, supplier: "XYZ Electronics", lastOrderDate: "2023-03-22", reorderAmount: 10 },
      { id: "INV-089", name: "Maintenance Kit MK-456", currentStock: 2, minThreshold: 5, supplier: "ABC Supplies", lastOrderDate: "2023-02-28", reorderAmount: 5 },
      { id: "INV-112", name: "Fuser Unit FU-789", currentStock: 1, minThreshold: 3, supplier: "Tech Parts Inc", lastOrderDate: "2023-04-05", reorderAmount: 3 },
      { id: "INV-156", name: "Paper Feed Rollers", currentStock: 4, minThreshold: 10, supplier: "Office Parts Ltd", lastOrderDate: "2023-03-12", reorderAmount: 15 }
    ],
    inventoryValueByCategory: [
      { category: "Toner & Ink", value: 18500, itemCount: 45 },
      { category: "Drums & Imaging Units", value: 12800, itemCount: 30 },
      { category: "Maintenance Kits", value: 8400, itemCount: 20 },
      { category: "Paper Handling", value: 3200, itemCount: 60 },
      { category: "Replacement Parts", value: 2100, itemCount: 95 }
    ],
    topSellingItems: [
      { id: "INV-001", name: "Toner XYZ-123", sold: 48, revenue: 9600 },
      { id: "INV-034", name: "Drum Unit DR-123", sold: 22, revenue: 5500 },
      { id: "INV-089", name: "Maintenance Kit MK-456", sold: 18, revenue: 5400 },
      { id: "INV-023", name: "Toner ABC-456", sold: 15, revenue: 3000 },
      { id: "INV-067", name: "Paper Tray PT-789", sold: 12, revenue: 2400 }
    ],
    inventoryTurnover: {
      overall: 3.2,
      byCategory: [
        { category: "Toner & Ink", turnover: 4.8 },
        { category: "Drums & Imaging Units", turnover: 2.5 },
        { category: "Maintenance Kits", turnover: 3.0 },
        { category: "Paper Handling", turnover: 5.2 },
        { category: "Replacement Parts", turnover: 1.8 }
      ]
    },
    stockMovement: {
      received: 75,
      issued: 128,
      returned: 12,
      adjusted: 8
    },
    orderStatus: {
      pending: 3,
      processing: 2,
      shipped: 5,
      completed: 42
    }
  };
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get customer insights data
// @route   GET /api/dashboard/customer-insights
// @access  Private
exports.getCustomerInsights = asyncHandler(async (req, res, next) => {
  // Customer insights data
  const data = {
    customerSegmentation: [
      { segment: "Enterprise", count: 12, percentage: 14, revenue: 52000 },
      { segment: "SMB", count: 38, percentage: 44, revenue: 42500 },
      { segment: "Government", count: 8, percentage: 9, revenue: 18000 },
      { segment: "Education", count: 15, percentage: 17, revenue: 12000 },
      { segment: "Healthcare", count: 13, percentage: 16, revenue: 4000 }
    ],
    customerSatisfaction: {
      overall: 4.7,
      byService: [
        { service: "Repair", rating: 4.5 },
        { service: "Maintenance", rating: 4.8 },
        { service: "Installation", rating: 4.9 },
        { service: "Training", rating: 4.6 },
        { service: "Support", rating: 4.4 }
      ],
      netPromoterScore: 72
    },
    newVsReturning: {
      new: { count: 5, revenue: 18500 },
      returning: { count: 81, revenue: 110000 }
    },
    topCustomers: [
      { id: "CUST-042", name: "ABC Corporation", revenue: 15800, machineCount: 12, activeServiceTickets: 2 },
      { id: "CUST-028", name: "XYZ Industries", revenue: 12500, machineCount: 8, activeServiceTickets: 1 },
      { id: "CUST-103", name: "123 Government Office", revenue: 9200, machineCount: 10, activeServiceTickets: 0 },
      { id: "CUST-076", name: "City University", revenue: 7500, machineCount: 15, activeServiceTickets: 3 },
      { id: "CUST-054", name: "Metropolitan Hospital", revenue: 6800, machineCount: 6, activeServiceTickets: 1 }
    ],
    customerRetention: {
      rate: 92, // percentage
      churnRate: 8, // percentage
      averageLifetimeValue: 45000
    },
    contractStatus: {
      active: 72,
      expiringSoon: 8,
      expired: 6,
      pending: 4
    },
    customerGrowth: [
      { month: "Jan", newCustomers: 3 },
      { month: "Feb", newCustomers: 2 },
      { month: "Mar", newCustomers: 4 },
      { month: "Apr", newCustomers: 1 },
      { month: "May", newCustomers: 5 },
      { month: "Jun", newCustomers: 2 },
      { month: "Jul", newCustomers: 3 },
      { month: "Aug", newCustomers: 2 },
      { month: "Sep", newCustomers: 3 },
      { month: "Oct", newCustomers: 4 },
      { month: "Nov", newCustomers: 2 },
      { month: "Dec", newCustomers: 3 }
    ]
  };
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get overview stats
// @route   GET /api/dashboard/overview
// @access  Private
exports.getOverviewStats = asyncHandler(async (req, res, next) => {
  // Sample overview stats
  const stats = {
    totalPrinters: 120,
    activeCustomers: 48,
    pendingMaintenance: 15,
    alerts: 3
  };
  
  res.status(200).json({
    success: true,
    stats
  });
}); 