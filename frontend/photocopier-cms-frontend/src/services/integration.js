import api from './api'

/**
 * Service for handling all integration-related API calls
 */
const integrationService = {
  /**
   * Get all integrations
   * @returns {Promise} - API response with integrations data
   */
  async getIntegrations() {
    const response = await api.get('/integrations')
    return response.data
  },

  /**
   * Get a specific integration by ID
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response with integration data
   */
  async getIntegration(integrationId) {
    const response = await api.get(`/integrations/${integrationId}`)
    return response.data
  },

  /**
   * Get integration status
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response with integration status
   */
  async getIntegrationStatus(integrationId) {
    const response = await api.get(`/integrations/${integrationId}/status`)
    return response.data
  },

  /**
   * Enable an integration
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response
   */
  async enableIntegration(integrationId) {
    const response = await api.post(`/integrations/${integrationId}/enable`)
    return response.data
  },

  /**
   * Disable an integration
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response
   */
  async disableIntegration(integrationId) {
    const response = await api.post(`/integrations/${integrationId}/disable`)
    return response.data
  },

  /**
   * Get integration logs
   * @param {string} integrationId - Integration ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with integration logs
   */
  async getIntegrationLogs(integrationId, params = {}) {
    const response = await api.get(`/integrations/${integrationId}/logs`, { params })
    return response.data
  },

  /**
   * Clear integration logs
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response
   */
  async clearIntegrationLogs(integrationId) {
    const response = await api.delete(`/integrations/${integrationId}/logs`)
    return response.data
  },

  /**
   * Get integration metrics
   * @param {string} integrationId - Integration ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with integration metrics
   */
  async getIntegrationMetrics(integrationId, params = {}) {
    const response = await api.get(`/integrations/${integrationId}/metrics`, { params })
    return response.data
  },

  /**
   * Test an integration
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response with test results
   */
  async testIntegration(integrationId) {
    const response = await api.post(`/integrations/${integrationId}/test`)
    return response.data
  },

  /**
   * Get WhatsApp integration configuration
   * @returns {Promise} - API response with WhatsApp integration configuration
   */
  async getWhatsAppConfig() {
    const response = await api.get('/integrations/whatsapp')
    return response.data
  },

  /**
   * Update WhatsApp integration configuration
   * @param {Object} config - WhatsApp integration configuration
   * @returns {Promise} - API response with updated WhatsApp integration configuration
   */
  async updateWhatsAppConfig(config) {
    const response = await api.put('/integrations/whatsapp', config)
    return response.data
  },

  /**
   * Get WhatsApp templates
   * @returns {Promise} - API response with WhatsApp templates
   */
  async getWhatsAppTemplates() {
    const response = await api.get('/integrations/whatsapp/templates')
    return response.data
  },

  /**
   * Create a WhatsApp template
   * @param {Object} template - WhatsApp template data
   * @returns {Promise} - API response with created WhatsApp template
   */
  async createWhatsAppTemplate(template) {
    const response = await api.post('/integrations/whatsapp/templates', template)
    return response.data
  },

  /**
   * Update a WhatsApp template
   * @param {string} templateId - Template ID
   * @param {Object} template - Updated WhatsApp template data
   * @returns {Promise} - API response with updated WhatsApp template
   */
  async updateWhatsAppTemplate(templateId, template) {
    const response = await api.put(`/integrations/whatsapp/templates/${templateId}`, template)
    return response.data
  },

  /**
   * Delete a WhatsApp template
   * @param {string} templateId - Template ID
   * @returns {Promise} - API response
   */
  async deleteWhatsAppTemplate(templateId) {
    const response = await api.delete(`/integrations/whatsapp/templates/${templateId}`)
    return response.data
  },

  /**
   * Send a WhatsApp message
   * @param {Object} messageData - Message data
   * @returns {Promise} - API response with message status
   */
  async sendWhatsAppMessage(messageData) {
    const response = await api.post('/integrations/whatsapp/send', messageData)
    return response.data
  },

  /**
   * Get WhatsApp conversation history
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with conversation history
   */
  async getWhatsAppConversations(params = {}) {
    const response = await api.get('/integrations/whatsapp/conversations', { params })
    return response.data
  },

  /**
   * Get WhatsApp opt-in/opt-out list
   * @returns {Promise} - API response with opt-in/opt-out list
   */
  async getWhatsAppOptList() {
    const response = await api.get('/integrations/whatsapp/opt-list')
    return response.data
  },

  /**
   * Update WhatsApp opt-in/opt-out list
   * @param {Object} optList - Opt-in/opt-out list data
   * @returns {Promise} - API response with updated opt-in/opt-out list
   */
  async updateWhatsAppOptList(optList) {
    const response = await api.put('/integrations/whatsapp/opt-list', optList)
    return response.data
  },

  /**
   * Get email service configuration
   * @returns {Promise} - API response with email service configuration
   */
  async getEmailServiceConfig() {
    const response = await api.get('/integrations/email-service')
    return response.data
  },

  /**
   * Update email service configuration
   * @param {Object} config - Email service configuration
   * @returns {Promise} - API response with updated email service configuration
   */
  async updateEmailServiceConfig(config) {
    const response = await api.put('/integrations/email-service', config)
    return response.data
  },

  /**
   * Test email service configuration
   * @param {Object} config - Email service configuration to test
   * @returns {Promise} - API response with test results
   */
  async testEmailServiceConfig(config) {
    const response = await api.post('/integrations/email-service/test', config)
    return response.data
  },

  /**
   * Get accounting software configuration
   * @returns {Promise} - API response with accounting software configuration
   */
  async getAccountingConfig() {
    const response = await api.get('/integrations/accounting')
    return response.data
  },

  /**
   * Update accounting software configuration
   * @param {Object} config - Accounting software configuration
   * @returns {Promise} - API response with updated accounting software configuration
   */
  async updateAccountingConfig(config) {
    const response = await api.put('/integrations/accounting', config)
    return response.data
  },

  /**
   * Test accounting software configuration
   * @param {Object} config - Accounting software configuration to test
   * @returns {Promise} - API response with test results
   */
  async testAccountingConfig(config) {
    const response = await api.post('/integrations/accounting/test', config)
    return response.data
  },

  /**
   * Sync data with accounting software
   * @param {Object} options - Sync options
   * @returns {Promise} - API response with sync results
   */
  async syncAccountingData(options = {}) {
    const response = await api.post('/integrations/accounting/sync', options)
    return response.data
  },

  /**
   * Get accounting software mapping configuration
   * @returns {Promise} - API response with mapping configuration
   */
  async getAccountingMapping() {
    const response = await api.get('/integrations/accounting/mapping')
    return response.data
  },

  /**
   * Update accounting software mapping configuration
   * @param {Object} mapping - Mapping configuration
   * @returns {Promise} - API response with updated mapping configuration
   */
  async updateAccountingMapping(mapping) {
    const response = await api.put('/integrations/accounting/mapping', mapping)
    return response.data
  },

  /**
   * Get SMS gateway configuration
   * @returns {Promise} - API response with SMS gateway configuration
   */
  async getSmsConfig() {
    const response = await api.get('/integrations/sms')
    return response.data
  },

  /**
   * Update SMS gateway configuration
   * @param {Object} config - SMS gateway configuration
   * @returns {Promise} - API response with updated SMS gateway configuration
   */
  async updateSmsConfig(config) {
    const response = await api.put('/integrations/sms', config)
    return response.data
  },

  /**
   * Test SMS gateway configuration
   * @param {Object} config - SMS gateway configuration to test
   * @returns {Promise} - API response with test results
   */
  async testSmsConfig(config) {
    const response = await api.post('/integrations/sms/test', config)
    return response.data
  },

  /**
   * Send an SMS message
   * @param {Object} messageData - Message data
   * @returns {Promise} - API response with message status
   */
  async sendSmsMessage(messageData) {
    const response = await api.post('/integrations/sms/send', messageData)
    return response.data
  },

  /**
   * Get SMS templates
   * @returns {Promise} - API response with SMS templates
   */
  async getSmsTemplates() {
    const response = await api.get('/integrations/sms/templates')
    return response.data
  },

  /**
   * Create an SMS template
   * @param {Object} template - SMS template data
   * @returns {Promise} - API response with created SMS template
   */
  async createSmsTemplate(template) {
    const response = await api.post('/integrations/sms/templates', template)
    return response.data
  },

  /**
   * Update an SMS template
   * @param {string} templateId - Template ID
   * @param {Object} template - Updated SMS template data
   * @returns {Promise} - API response with updated SMS template
   */
  async updateSmsTemplate(templateId, template) {
    const response = await api.put(`/integrations/sms/templates/${templateId}`, template)
    return response.data
  },

  /**
   * Delete an SMS template
   * @param {string} templateId - Template ID
   * @returns {Promise} - API response
   */
  async deleteSmsTemplate(templateId) {
    const response = await api.delete(`/integrations/sms/templates/${templateId}`)
    return response.data
  },

  /**
   * Get payment gateway configuration
   * @returns {Promise} - API response with payment gateway configuration
   */
  async getPaymentConfig() {
    const response = await api.get('/integrations/payment')
    return response.data
  },

  /**
   * Update payment gateway configuration
   * @param {Object} config - Payment gateway configuration
   * @returns {Promise} - API response with updated payment gateway configuration
   */
  async updatePaymentConfig(config) {
    const response = await api.put('/integrations/payment', config)
    return response.data
  },

  /**
   * Test payment gateway configuration
   * @param {Object} config - Payment gateway configuration to test
   * @returns {Promise} - API response with test results
   */
  async testPaymentConfig(config) {
    const response = await api.post('/integrations/payment/test', config)
    return response.data
  },

  /**
   * Process a payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise} - API response with payment status
   */
  async processPayment(paymentData) {
    const response = await api.post('/integrations/payment/process', paymentData)
    return response.data
  },

  /**
   * Get payment transaction history
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with transaction history
   */
  async getPaymentTransactions(params = {}) {
    const response = await api.get('/integrations/payment/transactions', { params })
    return response.data
  },

  /**
   * Get payment transaction details
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} - API response with transaction details
   */
  async getPaymentTransaction(transactionId) {
    const response = await api.get(`/integrations/payment/transactions/${transactionId}`)
    return response.data
  },

  /**
   * Refund a payment
   * @param {string} transactionId - Transaction ID
   * @param {Object} refundData - Refund data
   * @returns {Promise} - API response with refund status
   */
  async refundPayment(transactionId, refundData) {
    const response = await api.post(`/integrations/payment/transactions/${transactionId}/refund`, refundData)
    return response.data
  },

  /**
   * Get OAuth configuration for an integration
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response with OAuth configuration
   */
  async getOAuthConfig(integrationId) {
    const response = await api.get(`/integrations/${integrationId}/oauth`)
    return response.data
  },

  /**
   * Initialize OAuth flow for an integration
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response with OAuth URL
   */
  async initOAuthFlow(integrationId) {
    const response = await api.post(`/integrations/${integrationId}/oauth/init`)
    return response.data
  },

  /**
   * Complete OAuth flow for an integration
   * @param {string} integrationId - Integration ID
   * @param {Object} oauthData - OAuth data
   * @returns {Promise} - API response with OAuth status
   */
  async completeOAuthFlow(integrationId, oauthData) {
    const response = await api.post(`/integrations/${integrationId}/oauth/callback`, oauthData)
    return response.data
  },

  /**
   * Revoke OAuth access for an integration
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response
   */
  async revokeOAuthAccess(integrationId) {
    const response = await api.post(`/integrations/${integrationId}/oauth/revoke`)
    return response.data
  },

  /**
   * Get integration webhooks
   * @param {string} integrationId - Integration ID
   * @returns {Promise} - API response with webhooks
   */
  async getWebhooks(integrationId) {
    const response = await api.get(`/integrations/${integrationId}/webhooks`)
    return response.data
  },

  /**
   * Create an integration webhook
   * @param {string} integrationId - Integration ID
   * @param {Object} webhookData - Webhook data
   * @returns {Promise} - API response with created webhook
   */
  async createWebhook(integrationId, webhookData) {
    const response = await api.post(`/integrations/${integrationId}/webhooks`, webhookData)
    return response.data
  },

  /**
   * Update an integration webhook
   * @param {string} integrationId - Integration ID
   * @param {string} webhookId - Webhook ID
   * @param {Object} webhookData - Updated webhook data
   * @returns {Promise} - API response with updated webhook
   */
  async updateWebhook(integrationId, webhookId, webhookData) {
    const response = await api.put(`/integrations/${integrationId}/webhooks/${webhookId}`, webhookData)
    return response.data
  },

  /**
   * Delete an integration webhook
   * @param {string} integrationId - Integration ID
   * @param {string} webhookId - Webhook ID
   * @returns {Promise} - API response
   */
  async deleteWebhook(integrationId, webhookId) {
    const response = await api.delete(`/integrations/${integrationId}/webhooks/${webhookId}`)
    return response.data
  },

  /**
   * Test an integration webhook
   * @param {string} integrationId - Integration ID
   * @param {string} webhookId - Webhook ID
   * @returns {Promise} - API response with test results
   */
  async testWebhook(integrationId, webhookId) {
    const response = await api.post(`/integrations/${integrationId}/webhooks/${webhookId}/test`)
    return response.data
  },

  /**
   * Get webhook logs
   * @param {string} integrationId - Integration ID
   * @param {string} webhookId - Webhook ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with webhook logs
   */
  async getWebhookLogs(integrationId, webhookId, params = {}) {
    const response = await api.get(`/integrations/${integrationId}/webhooks/${webhookId}/logs`, { params })
    return response.data
  },

  /**
   * Clear webhook logs
   * @param {string} integrationId - Integration ID
   * @param {string} webhookId - Webhook ID
   * @returns {Promise} - API response
   */
  async clearWebhookLogs(integrationId, webhookId) {
    const response = await api.delete(`/integrations/${integrationId}/webhooks/${webhookId}/logs`)
    return response.data
  }
}

export default integrationService 