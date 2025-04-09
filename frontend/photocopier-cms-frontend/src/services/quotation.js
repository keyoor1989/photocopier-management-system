import api from './api'

export const quotationService = {
  /**
   * Get a list of quotations with filtering and pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response
   */
  async getQuotations(params = {}) {
    const response = await api.get('/quotations', { params })
    return response.data
  },

  /**
   * Get a single quotation by ID
   * @param {string} id - Quotation ID
   * @returns {Promise} - API response
   */
  async getQuotation(id) {
    const response = await api.get(`/quotations/${id}`)
    return response.data
  },

  /**
   * Create a new quotation
   * @param {Object} quotationData - Quotation data
   * @returns {Promise} - API response
   */
  async createQuotation(quotationData) {
    const response = await api.post('/quotations', quotationData)
    return response.data
  },

  /**
   * Update an existing quotation
   * @param {string} id - Quotation ID
   * @param {Object} quotationData - Updated quotation data
   * @returns {Promise} - API response
   */
  async updateQuotation(id, quotationData) {
    const response = await api.put(`/quotations/${id}`, quotationData)
    return response.data
  },

  /**
   * Delete a quotation
   * @param {string} id - Quotation ID
   * @returns {Promise} - API response
   */
  async deleteQuotation(id) {
    const response = await api.delete(`/quotations/${id}`)
    return response.data
  },

  /**
   * Generate PDF for a quotation
   * @param {string} id - Quotation ID
   * @param {Object} options - PDF generation options
   * @returns {Promise} - API response with PDF data
   */
  async generatePDF(id, options = {}) {
    const response = await api.post(`/quotations/${id}/pdf`, options, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Send quotation by email
   * @param {string} id - Quotation ID
   * @param {Object} emailData - Email details
   * @returns {Promise} - API response
   */
  async sendByEmail(id, emailData) {
    const response = await api.post(`/quotations/${id}/send`, emailData)
    return response.data
  },

  /**
   * Update quotation status
   * @param {string} id - Quotation ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes about the status change
   * @returns {Promise} - API response
   */
  async updateStatus(id, status, notes = '') {
    const response = await api.patch(`/quotations/${id}/status`, { status, notes })
    return response.data
  },

  /**
   * Extend quotation validity
   * @param {string} id - Quotation ID
   * @param {Date} newValidityDate - New validity date
   * @returns {Promise} - API response
   */
  async extendValidity(id, newValidityDate) {
    const response = await api.patch(`/quotations/${id}/extend`, { validUntil: newValidityDate })
    return response.data
  },

  /**
   * Get quotation history for a customer
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerQuotationHistory(customerId) {
    const response = await api.get(`/quotations/customer/${customerId}`)
    return response.data
  },

  /**
   * Create a revision of an existing quotation
   * @param {string} id - Quotation ID
   * @param {Object} revisionData - Data for the new revision
   * @returns {Promise} - API response
   */
  async createRevision(id, revisionData = {}) {
    const response = await api.post(`/quotations/${id}/revisions`, revisionData)
    return response.data
  },

  /**
   * Get revision history of a quotation
   * @param {string} id - Quotation ID
   * @returns {Promise} - API response
   */
  async getRevisionHistory(id) {
    const response = await api.get(`/quotations/${id}/revisions`)
    return response.data
  },

  /**
   * Submit quotation for approval
   * @param {string} id - Quotation ID
   * @param {Object} approvalData - Approval submission data
   * @returns {Promise} - API response
   */
  async submitForApproval(id, approvalData = {}) {
    const response = await api.post(`/quotations/${id}/submit-approval`, approvalData)
    return response.data
  },

  /**
   * Approve or reject a quotation
   * @param {string} id - Quotation ID
   * @param {Object} approvalData - Approval decision data
   * @returns {Promise} - API response
   */
  async processApproval(id, approvalData) {
    const response = await api.post(`/quotations/${id}/process-approval`, approvalData)
    return response.data
  },

  /**
   * Get quotation metrics and analytics
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getQuotationMetrics(params = {}) {
    const response = await api.get('/quotations/metrics', { params })
    return response.data
  },

  /**
   * Generate batch quotations
   * @param {Object} batchData - Data for generating multiple quotations
   * @returns {Promise} - API response
   */
  async generateBatchQuotations(batchData) {
    const response = await api.post('/quotations/batch', batchData)
    return response.data
  },

  /**
   * Get expiring quotations
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getExpiringQuotations(params = {}) {
    const response = await api.get('/quotations/expiring', { params })
    return response.data
  },

  /**
   * Schedule follow-up for a quotation
   * @param {string} id - Quotation ID
   * @param {Object} followUpData - Follow-up scheduling data
   * @returns {Promise} - API response
   */
  async scheduleFollowUp(id, followUpData) {
    const response = await api.post(`/quotations/${id}/follow-up`, followUpData)
    return response.data
  },

  /**
   * Compare quotation versions
   * @param {string} id - Quotation ID
   * @param {string} revisionId - Revision ID to compare with
   * @returns {Promise} - API response
   */
  async compareVersions(id, revisionId) {
    const response = await api.get(`/quotations/${id}/compare/${revisionId}`)
    return response.data
  }
}

export default quotationService 