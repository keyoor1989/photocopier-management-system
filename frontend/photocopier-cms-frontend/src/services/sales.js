import api from './api'

export const salesService = {
  /**
   * Get a list of sales with filtering and pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response
   */
  async getSales(params = {}) {
    const response = await api.get('/sales', { params })
    return response.data
  },

  /**
   * Get a single sale by ID
   * @param {string} id - Sale ID
   * @returns {Promise} - API response
   */
  async getSale(id) {
    const response = await api.get(`/sales/${id}`)
    return response.data
  },

  /**
   * Create a new sale
   * @param {Object} saleData - Sale data
   * @returns {Promise} - API response
   */
  async createSale(saleData) {
    const response = await api.post('/sales', saleData)
    return response.data
  },

  /**
   * Update an existing sale
   * @param {string} id - Sale ID
   * @param {Object} saleData - Updated sale data
   * @returns {Promise} - API response
   */
  async updateSale(id, saleData) {
    const response = await api.put(`/sales/${id}`, saleData)
    return response.data
  },

  /**
   * Delete a sale
   * @param {string} id - Sale ID
   * @returns {Promise} - API response
   */
  async deleteSale(id) {
    const response = await api.delete(`/sales/${id}`)
    return response.data
  },

  /**
   * Generate invoice for a sale
   * @param {string} id - Sale ID
   * @param {Object} options - Invoice generation options
   * @returns {Promise} - API response with PDF data
   */
  async generateInvoice(id, options = {}) {
    const response = await api.post(`/sales/${id}/invoice`, options, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Process payment for a sale
   * @param {string} id - Sale ID
   * @param {Object} paymentData - Payment details
   * @returns {Promise} - API response
   */
  async processPayment(id, paymentData) {
    const response = await api.post(`/sales/${id}/payment`, paymentData)
    return response.data
  },

  /**
   * Update delivery status for a sale
   * @param {string} id - Sale ID
   * @param {Object} deliveryData - Delivery status and details
   * @returns {Promise} - API response
   */
  async updateDeliveryStatus(id, deliveryData) {
    const response = await api.patch(`/sales/${id}/delivery`, deliveryData)
    return response.data
  },

  /**
   * Get sales metrics and analytics
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getSalesMetrics(params = {}) {
    const response = await api.get('/sales/metrics', { params })
    return response.data
  },

  /**
   * Get sales history for a customer
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerSalesHistory(customerId) {
    const response = await api.get(`/sales/customer/${customerId}`)
    return response.data
  },

  /**
   * Convert quotation to sale
   * @param {string} quotationId - Quotation ID
   * @param {Object} conversionData - Additional data for conversion
   * @returns {Promise} - API response
   */
  async convertQuotationToSale(quotationId, conversionData = {}) {
    const response = await api.post(`/sales/convert-quotation/${quotationId}`, conversionData)
    return response.data
  },

  /**
   * Generate sales report
   * @param {Object} params - Report parameters
   * @returns {Promise} - API response with PDF data
   */
  async generateSalesReport(params = {}) {
    const response = await api.get('/sales/report', {
      params,
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Calculate commission for a sale
   * @param {string} id - Sale ID
   * @returns {Promise} - API response
   */
  async calculateCommission(id) {
    const response = await api.get(`/sales/${id}/commission`)
    return response.data
  },

  /**
   * Send invoice by email
   * @param {string} id - Sale ID
   * @param {Object} emailData - Email details
   * @returns {Promise} - API response
   */
  async sendInvoiceByEmail(id, emailData) {
    const response = await api.post(`/sales/${id}/send-invoice`, emailData)
    return response.data
  },

  /**
   * Get payment history for a sale
   * @param {string} id - Sale ID
   * @returns {Promise} - API response
   */
  async getPaymentHistory(id) {
    const response = await api.get(`/sales/${id}/payments`)
    return response.data
  },

  /**
   * Create recurring billing schedule
   * @param {string} id - Sale ID
   * @param {Object} billingData - Recurring billing details
   * @returns {Promise} - API response
   */
  async createRecurringBilling(id, billingData) {
    const response = await api.post(`/sales/${id}/recurring-billing`, billingData)
    return response.data
  },

  /**
   * Get sales forecast
   * @param {Object} params - Forecast parameters
   * @returns {Promise} - API response
   */
  async getSalesForecast(params = {}) {
    const response = await api.get('/sales/forecast', { params })
    return response.data
  }
}

export default salesService 