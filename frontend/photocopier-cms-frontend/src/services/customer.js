import api from './api'

export const customerService = {
  /**
   * Get a list of customers with filtering and pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response
   */
  async getCustomers(params = {}) {
    const response = await api.get('/customers', { params })
    return response.data
  },

  /**
   * Get a single customer by ID
   * @param {string} id - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomer(id) {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise} - API response
   */
  async createCustomer(customerData) {
    const response = await api.post('/customers', customerData)
    return response.data
  },

  /**
   * Update an existing customer
   * @param {string} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise} - API response
   */
  async updateCustomer(id, customerData) {
    const response = await api.put(`/customers/${id}`, customerData)
    return response.data
  },

  /**
   * Delete a customer
   * @param {string} id - Customer ID
   * @returns {Promise} - API response
   */
  async deleteCustomer(id) {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  },

  /**
   * Add a note to a customer
   * @param {string} customerId - Customer ID
   * @param {Object} noteData - Note data
   * @returns {Promise} - API response
   */
  async addNote(customerId, noteData) {
    const response = await api.post(`/customers/${customerId}/notes`, noteData)
    return response.data
  },

  /**
   * Add a machine to a customer
   * @param {string} customerId - Customer ID
   * @param {Object} machineData - Machine data
   * @returns {Promise} - API response
   */
  async addMachine(customerId, machineData) {
    const response = await api.post(`/customers/${customerId}/machines`, machineData)
    return response.data
  },

  /**
   * Get customer machines
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerMachines(customerId) {
    const response = await api.get(`/customers/${customerId}/machines`)
    return response.data
  },

  /**
   * Get customer notes
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerNotes(customerId) {
    const response = await api.get(`/customers/${customerId}/notes`)
    return response.data
  },

  /**
   * Get customer service history
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerServiceHistory(customerId) {
    const response = await api.get(`/customers/${customerId}/service-history`)
    return response.data
  },

  /**
   * Get customer sales and quotations
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerSales(customerId) {
    const response = await api.get(`/customers/${customerId}/sales`)
    return response.data
  },

  /**
   * Import customers from CSV or Excel file
   * @param {FormData} formData - Form data containing the file
   * @returns {Promise} - API response
   */
  async importCustomers(formData) {
    const response = await api.post('/customers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * Export customers to CSV or Excel file
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with file blob
   */
  async exportCustomers(params = {}) {
    const response = await api.get('/customers/export', { 
      params,
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Update customer status
   * @param {string} customerId - Customer ID
   * @param {string} status - New status
   * @returns {Promise} - API response
   */
  async updateCustomerStatus(customerId, status) {
    const response = await api.patch(`/customers/${customerId}/status`, { status })
    return response.data
  },

  /**
   * Get customer activity timeline
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerTimeline(customerId) {
    const response = await api.get(`/customers/${customerId}/timeline`)
    return response.data
  },

  /**
   * Generate customer report
   * @param {string} customerId - Customer ID
   * @param {Object} reportOptions - Report options
   * @returns {Promise} - API response with file blob
   */
  async generateCustomerReport(customerId, reportOptions = {}) {
    const response = await api.post(`/customers/${customerId}/report`, reportOptions, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Bulk update customer tags
   * @param {Array} customerIds - Array of customer IDs
   * @param {Array} tags - Array of tags to add or remove
   * @param {string} action - 'add' or 'remove'
   * @returns {Promise} - API response
   */
  async bulkUpdateTags(customerIds, tags, action = 'add') {
    const response = await api.post('/customers/bulk/tags', {
      customerIds,
      tags,
      action
    })
    return response.data
  }
}

export default customerService 