import api from './api'

/**
 * Service for handling all report-related API calls
 */
const reportsService = {
  /**
   * Get sales report data with filtering options
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with sales report data
   */
  async getSalesReport(params = {}) {
    const response = await api.get('/reports/sales', { params })
    return response.data
  },

  /**
   * Get service performance metrics
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with service metrics
   */
  async getServiceMetrics(params = {}) {
    const response = await api.get('/reports/service-metrics', { params })
    return response.data
  },

  /**
   * Get inventory status report
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with inventory report data
   */
  async getInventoryReport(params = {}) {
    const response = await api.get('/reports/inventory', { params })
    return response.data
  },

  /**
   * Get customer activity report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with customer activity data
   */
  async getCustomerActivityReport(params = {}) {
    const response = await api.get('/reports/customer-activity', { params })
    return response.data
  },

  /**
   * Get financial summary report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with financial summary data
   */
  async getFinancialSummary(params = {}) {
    const response = await api.get('/reports/financial', { params })
    return response.data
  },

  /**
   * Get revenue by segment report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with revenue by segment data
   */
  async getRevenueBySegment(params = {}) {
    const response = await api.get('/reports/revenue-by-segment', { params })
    return response.data
  },

  /**
   * Get profit margins report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with profit margins data
   */
  async getProfitMargins(params = {}) {
    const response = await api.get('/reports/profit-margins', { params })
    return response.data
  },

  /**
   * Get monthly P&L summary
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with monthly P&L data
   */
  async getMonthlyPL(params = {}) {
    const response = await api.get('/reports/monthly-pl', { params })
    return response.data
  },

  /**
   * Get accounts receivable aging report
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with accounts receivable aging data
   */
  async getAccountsReceivableAging(params = {}) {
    const response = await api.get('/reports/accounts-receivable-aging', { params })
    return response.data
  },

  /**
   * Get top performing products report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with top performing products data
   */
  async getTopPerformingProducts(params = {}) {
    const response = await api.get('/reports/top-products', { params })
    return response.data
  },

  /**
   * Get top performing customers report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with top performing customers data
   */
  async getTopPerformingCustomers(params = {}) {
    const response = await api.get('/reports/top-customers', { params })
    return response.data
  },

  /**
   * Get slow-moving inventory report
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with slow-moving inventory data
   */
  async getSlowMovingInventory(params = {}) {
    const response = await api.get('/reports/slow-moving-inventory', { params })
    return response.data
  },

  /**
   * Get inventory turnover report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with inventory turnover data
   */
  async getInventoryTurnover(params = {}) {
    const response = await api.get('/reports/inventory-turnover', { params })
    return response.data
  },

  /**
   * Get reorder forecast report
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with reorder forecast data
   */
  async getReorderForecast(params = {}) {
    const response = await api.get('/reports/reorder-forecast', { params })
    return response.data
  },

  /**
   * Get inventory valuation report
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with inventory valuation data
   */
  async getInventoryValuation(params = {}) {
    const response = await api.get('/reports/inventory-valuation', { params })
    return response.data
  },

  /**
   * Get consumption patterns report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with consumption patterns data
   */
  async getConsumptionPatterns(params = {}) {
    const response = await api.get('/reports/consumption-patterns', { params })
    return response.data
  },

  /**
   * Get service ticket resolution times report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with service ticket resolution times data
   */
  async getServiceResolutionTimes(params = {}) {
    const response = await api.get('/reports/service-resolution-times', { params })
    return response.data
  },

  /**
   * Get engineer performance metrics report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with engineer performance metrics data
   */
  async getEngineerPerformance(params = {}) {
    const response = await api.get('/reports/engineer-performance', { params })
    return response.data
  },

  /**
   * Get common service issues report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with common service issues data
   */
  async getCommonServiceIssues(params = {}) {
    const response = await api.get('/reports/common-service-issues', { params })
    return response.data
  },

  /**
   * Get machine reliability report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with machine reliability data
   */
  async getMachineReliability(params = {}) {
    const response = await api.get('/reports/machine-reliability', { params })
    return response.data
  },

  /**
   * Get service revenue and costs report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with service revenue and costs data
   */
  async getServiceRevenueAndCosts(params = {}) {
    const response = await api.get('/reports/service-revenue-costs', { params })
    return response.data
  },

  /**
   * Get customer satisfaction report
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with customer satisfaction data
   */
  async getCustomerSatisfaction(params = {}) {
    const response = await api.get('/reports/customer-satisfaction', { params })
    return response.data
  },

  /**
   * Get saved report configurations
   * @returns {Promise} - API response with saved report configurations
   */
  async getSavedReportConfigs() {
    const response = await api.get('/reports/saved-configs')
    return response.data
  },

  /**
   * Save a report configuration
   * @param {Object} configData - Report configuration data
   * @returns {Promise} - API response with saved configuration
   */
  async saveReportConfig(configData) {
    const response = await api.post('/reports/saved-configs', configData)
    return response.data
  },

  /**
   * Delete a saved report configuration
   * @param {string} configId - ID of the configuration to delete
   * @returns {Promise} - API response
   */
  async deleteReportConfig(configId) {
    const response = await api.delete(`/reports/saved-configs/${configId}`)
    return response.data
  },

  /**
   * Generate a custom report
   * @param {Object} reportConfig - Custom report configuration
   * @returns {Promise} - API response with custom report data
   */
  async generateCustomReport(reportConfig) {
    const response = await api.post('/reports/custom', reportConfig)
    return response.data
  },

  /**
   * Schedule a report for regular generation
   * @param {Object} scheduleConfig - Schedule configuration
   * @returns {Promise} - API response with scheduled report details
   */
  async scheduleReport(scheduleConfig) {
    const response = await api.post('/reports/schedule', scheduleConfig)
    return response.data
  },

  /**
   * Get scheduled reports
   * @returns {Promise} - API response with scheduled reports
   */
  async getScheduledReports() {
    const response = await api.get('/reports/scheduled')
    return response.data
  },

  /**
   * Delete a scheduled report
   * @param {string} scheduleId - ID of the schedule to delete
   * @returns {Promise} - API response
   */
  async deleteScheduledReport(scheduleId) {
    const response = await api.delete(`/reports/scheduled/${scheduleId}`)
    return response.data
  },

  /**
   * Export report data in various formats
   * @param {string} reportType - Type of report to export
   * @param {string} format - Export format (pdf, excel, csv)
   * @param {Object} params - Query parameters for filtering and date range
   * @returns {Promise} - API response with export data
   */
  async exportReport(reportType, format, params = {}) {
    const response = await api.get(`/reports/export/${reportType}`, {
      params: { ...params, format },
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Get dashboard metrics and KPIs
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getDashboardMetrics(params = {}) {
    const response = await api.get('/reports/dashboard', { params })
    return response.data
  },

  /**
   * Generate a sales report
   * @param {Object} params - Report parameters (date range, filters, grouping)
   * @returns {Promise} - API response
   */
  async generateSalesReport(params = {}) {
    const response = await api.post('/reports/sales', params)
    return response.data
  },

  /**
   * Generate a service report
   * @param {Object} params - Report parameters
   * @returns {Promise} - API response
   */
  async generateServiceReport(params = {}) {
    const response = await api.post('/reports/service', params)
    return response.data
  },

  /**
   * Generate an inventory report
   * @param {Object} params - Report parameters
   * @returns {Promise} - API response
   */
  async generateInventoryReport(params = {}) {
    const response = await api.post('/reports/inventory', params)
    return response.data
  },

  /**
   * Generate a financial report
   * @param {Object} params - Report parameters
   * @returns {Promise} - API response
   */
  async generateFinancialReport(params = {}) {
    const response = await api.post('/reports/financial', params)
    return response.data
  },

  /**
   * Export report as PDF
   * @param {string} reportId - Report ID
   * @param {Object} options - Export options
   * @returns {Promise} - API response with PDF data
   */
  async exportAsPDF(reportId, options = {}) {
    const response = await api.get(`/reports/${reportId}/export/pdf`, {
      params: options,
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Export report as Excel
   * @param {string} reportId - Report ID
   * @param {Object} options - Export options
   * @returns {Promise} - API response with Excel data
   */
  async exportAsExcel(reportId, options = {}) {
    const response = await api.get(`/reports/${reportId}/export/excel`, {
      params: options,
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Export report as CSV
   * @param {string} reportId - Report ID
   * @param {Object} options - Export options
   * @returns {Promise} - API response with CSV data
   */
  async exportAsCSV(reportId, options = {}) {
    const response = await api.get(`/reports/${reportId}/export/csv`, {
      params: options,
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Save report configuration
   * @param {Object} config - Report configuration to save
   * @returns {Promise} - API response
   */
  async saveReportConfig(config) {
    const response = await api.post('/reports/configs', config)
    return response.data
  },

  /**
   * Get saved report configurations
   * @returns {Promise} - API response
   */
  async getSavedConfigs() {
    const response = await api.get('/reports/configs')
    return response.data
  },

  /**
   * Delete saved report configuration
   * @param {string} configId - Configuration ID
   * @returns {Promise} - API response
   */
  async deleteReportConfig(configId) {
    const response = await api.delete(`/reports/configs/${configId}`)
    return response.data
  },

  /**
   * Schedule report generation
   * @param {Object} schedule - Schedule configuration
   * @returns {Promise} - API response
   */
  async scheduleReport(schedule) {
    const response = await api.post('/reports/schedule', schedule)
    return response.data
  },

  /**
   * Get scheduled reports
   * @returns {Promise} - API response
   */
  async getScheduledReports() {
    const response = await api.get('/reports/schedule')
    return response.data
  },

  /**
   * Delete scheduled report
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} - API response
   */
  async deleteScheduledReport(scheduleId) {
    const response = await api.delete(`/reports/schedule/${scheduleId}`)
    return response.data
  },

  /**
   * Get report history
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getReportHistory(params = {}) {
    const response = await api.get('/reports/history', { params })
    return response.data
  },

  /**
   * Get sales forecasting data
   * @param {Object} params - Forecast parameters
   * @returns {Promise} - API response
   */
  async getSalesForecast(params = {}) {
    const response = await api.get('/reports/forecast/sales', { params })
    return response.data
  },

  /**
   * Get inventory forecasting data
   * @param {Object} params - Forecast parameters
   * @returns {Promise} - API response
   */
  async getInventoryForecast(params = {}) {
    const response = await api.get('/reports/forecast/inventory', { params })
    return response.data
  },

  /**
   * Get benchmark data
   * @param {Object} params - Benchmark parameters
   * @returns {Promise} - API response
   */
  async getBenchmarkData(params = {}) {
    const response = await api.get('/reports/benchmarks', { params })
    return response.data
  },

  /**
   * Set alert thresholds
   * @param {Object} thresholds - Alert threshold configuration
   * @returns {Promise} - API response
   */
  async setAlertThresholds(thresholds) {
    const response = await api.post('/reports/alerts/thresholds', thresholds)
    return response.data
  },

  /**
   * Get alert history
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getAlertHistory(params = {}) {
    const response = await api.get('/reports/alerts/history', { params })
    return response.data
  }
}

export default reportsService 