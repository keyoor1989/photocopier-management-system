import api from './api'

/**
 * Service for handling all branch-related API calls
 */
const branchService = {
  /**
   * Get all branches with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with branches data
   */
  async getBranches(params = {}) {
    const response = await api.get('/branches', { params })
    return response.data
  },

  /**
   * Get a single branch by ID
   * @param {string} branchId - Branch ID
   * @returns {Promise} - API response with branch data
   */
  async getBranchById(branchId) {
    const response = await api.get(`/branches/${branchId}`)
    return response.data
  },

  /**
   * Create a new branch
   * @param {Object} branchData - Branch data
   * @returns {Promise} - API response with created branch
   */
  async createBranch(branchData) {
    const response = await api.post('/branches', branchData)
    return response.data
  },

  /**
   * Update an existing branch
   * @param {string} branchId - Branch ID
   * @param {Object} branchData - Updated branch data
   * @returns {Promise} - API response with updated branch
   */
  async updateBranch(branchId, branchData) {
    const response = await api.put(`/branches/${branchId}`, branchData)
    return response.data
  },

  /**
   * Deactivate a branch
   * @param {string} branchId - Branch ID
   * @returns {Promise} - API response
   */
  async deactivateBranch(branchId) {
    const response = await api.put(`/branches/${branchId}/deactivate`)
    return response.data
  },

  /**
   * Activate a previously deactivated branch
   * @param {string} branchId - Branch ID
   * @returns {Promise} - API response
   */
  async activateBranch(branchId) {
    const response = await api.put(`/branches/${branchId}/activate`)
    return response.data
  },

  /**
   * Delete a branch
   * @param {string} branchId - Branch ID
   * @returns {Promise} - API response
   */
  async deleteBranch(branchId) {
    const response = await api.delete(`/branches/${branchId}`)
    return response.data
  },

  /**
   * Get users assigned to a branch
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with users data
   */
  async getBranchUsers(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/users`, { params })
    return response.data
  },

  /**
   * Assign a user to a branch
   * @param {string} branchId - Branch ID
   * @param {string} userId - User ID
   * @returns {Promise} - API response
   */
  async assignUserToBranch(branchId, userId) {
    const response = await api.post(`/branches/${branchId}/users`, { userId })
    return response.data
  },

  /**
   * Remove a user from a branch
   * @param {string} branchId - Branch ID
   * @param {string} userId - User ID
   * @returns {Promise} - API response
   */
  async removeUserFromBranch(branchId, userId) {
    const response = await api.delete(`/branches/${branchId}/users/${userId}`)
    return response.data
  },

  /**
   * Get branch settings
   * @param {string} branchId - Branch ID
   * @returns {Promise} - API response with branch settings
   */
  async getBranchSettings(branchId) {
    const response = await api.get(`/branches/${branchId}/settings`)
    return response.data
  },

  /**
   * Update branch settings
   * @param {string} branchId - Branch ID
   * @param {Object} settings - Branch settings
   * @returns {Promise} - API response with updated settings
   */
  async updateBranchSettings(branchId, settings) {
    const response = await api.put(`/branches/${branchId}/settings`, settings)
    return response.data
  },

  /**
   * Get branch performance metrics
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for date range, etc.
   * @returns {Promise} - API response with performance metrics
   */
  async getBranchPerformance(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/performance`, { params })
    return response.data
  },

  /**
   * Get branch sales metrics
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for date range, etc.
   * @returns {Promise} - API response with sales metrics
   */
  async getBranchSalesMetrics(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/sales-metrics`, { params })
    return response.data
  },

  /**
   * Get branch service metrics
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for date range, etc.
   * @returns {Promise} - API response with service metrics
   */
  async getBranchServiceMetrics(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/service-metrics`, { params })
    return response.data
  },

  /**
   * Get branch inventory metrics
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for date range, etc.
   * @returns {Promise} - API response with inventory metrics
   */
  async getBranchInventoryMetrics(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/inventory-metrics`, { params })
    return response.data
  },

  /**
   * Get branch financial metrics
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for date range, etc.
   * @returns {Promise} - API response with financial metrics
   */
  async getBranchFinancialMetrics(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/financial-metrics`, { params })
    return response.data
  },

  /**
   * Get branch activity timeline
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with activity timeline
   */
  async getBranchActivityTimeline(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/activity-timeline`, { params })
    return response.data
  },

  /**
   * Get branch equipment inventory
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with equipment inventory
   */
  async getBranchEquipmentInventory(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/equipment-inventory`, { params })
    return response.data
  },

  /**
   * Get branch customer list
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with customer list
   */
  async getBranchCustomers(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/customers`, { params })
    return response.data
  },

  /**
   * Get branch service tickets
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with service tickets
   */
  async getBranchServiceTickets(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/service-tickets`, { params })
    return response.data
  },

  /**
   * Get branch sales orders
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with sales orders
   */
  async getBranchSalesOrders(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/sales-orders`, { params })
    return response.data
  },

  /**
   * Get branch quotations
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with quotations
   */
  async getBranchQuotations(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/quotations`, { params })
    return response.data
  },

  /**
   * Get branch reports
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with reports
   */
  async getBranchReports(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/reports`, { params })
    return response.data
  },

  /**
   * Generate branch report
   * @param {string} branchId - Branch ID
   * @param {Object} reportConfig - Report configuration
   * @returns {Promise} - API response with generated report
   */
  async generateBranchReport(branchId, reportConfig) {
    const response = await api.post(`/branches/${branchId}/reports`, reportConfig)
    return response.data
  },

  /**
   * Compare branch performance with other branches
   * @param {string} branchId - Branch ID
   * @param {Object} params - Query parameters for comparison
   * @returns {Promise} - API response with comparison data
   */
  async compareBranchPerformance(branchId, params = {}) {
    const response = await api.get(`/branches/${branchId}/compare`, { params })
    return response.data
  }
}

export default branchService 