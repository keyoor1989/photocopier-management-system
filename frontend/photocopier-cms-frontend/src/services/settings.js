import api from './api'

/**
 * Service for handling all settings-related API calls
 */
const settingsService = {
  /**
   * Get all system settings
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with settings data
   */
  async getSettings(params = {}) {
    const response = await api.get('/settings', { params })
    return response.data
  },

  /**
   * Get a specific setting by key
   * @param {string} key - Setting key
   * @returns {Promise} - API response with setting data
   */
  async getSetting(key) {
    const response = await api.get(`/settings/${key}`)
    return response.data
  },

  /**
   * Update a specific setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise} - API response with updated setting
   */
  async updateSetting(key, value) {
    const response = await api.put(`/settings/${key}`, { value })
    return response.data
  },

  /**
   * Update multiple settings at once
   * @param {Object} settings - Object containing settings to update
   * @returns {Promise} - API response with updated settings
   */
  async updateSettings(settings) {
    const response = await api.put('/settings/batch', settings)
    return response.data
  },

  /**
   * Reset a setting to its default value
   * @param {string} key - Setting key
   * @returns {Promise} - API response
   */
  async resetSetting(key) {
    const response = await api.post(`/settings/${key}/reset`)
    return response.data
  },

  /**
   * Reset all settings to their default values
   * @returns {Promise} - API response
   */
  async resetAllSettings() {
    const response = await api.post('/settings/reset-all')
    return response.data
  },

  /**
   * Get company profile information
   * @returns {Promise} - API response with company profile data
   */
  async getCompanyProfile() {
    const response = await api.get('/settings/company-profile')
    return response.data
  },

  /**
   * Update company profile information
   * @param {Object} profileData - Company profile data
   * @returns {Promise} - API response with updated company profile
   */
  async updateCompanyProfile(profileData) {
    const response = await api.put('/settings/company-profile', profileData)
    return response.data
  },

  /**
   * Upload company logo
   * @param {FormData} formData - Form data containing the logo file
   * @returns {Promise} - API response with logo URL
   */
  async uploadCompanyLogo(formData) {
    const response = await api.post('/settings/company-profile/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * Get email configuration
   * @returns {Promise} - API response with email configuration
   */
  async getEmailConfig() {
    const response = await api.get('/settings/email-config')
    return response.data
  },

  /**
   * Update email configuration
   * @param {Object} config - Email configuration data
   * @returns {Promise} - API response with updated email configuration
   */
  async updateEmailConfig(config) {
    const response = await api.put('/settings/email-config', config)
    return response.data
  },

  /**
   * Test email configuration
   * @param {Object} config - Email configuration data to test
   * @returns {Promise} - API response with test results
   */
  async testEmailConfig(config) {
    const response = await api.post('/settings/email-config/test', config)
    return response.data
  },

  /**
   * Get notification settings
   * @returns {Promise} - API response with notification settings
   */
  async getNotificationSettings() {
    const response = await api.get('/settings/notifications')
    return response.data
  },

  /**
   * Update notification settings
   * @param {Object} settings - Notification settings data
   * @returns {Promise} - API response with updated notification settings
   */
  async updateNotificationSettings(settings) {
    const response = await api.put('/settings/notifications', settings)
    return response.data
  },

  /**
   * Get email templates
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with email templates
   */
  async getEmailTemplates(params = {}) {
    const response = await api.get('/settings/email-templates', { params })
    return response.data
  },

  /**
   * Get a specific email template
   * @param {string} templateId - Template ID
   * @returns {Promise} - API response with email template
   */
  async getEmailTemplate(templateId) {
    const response = await api.get(`/settings/email-templates/${templateId}`)
    return response.data
  },

  /**
   * Create a new email template
   * @param {Object} templateData - Email template data
   * @returns {Promise} - API response with created email template
   */
  async createEmailTemplate(templateData) {
    const response = await api.post('/settings/email-templates', templateData)
    return response.data
  },

  /**
   * Update an email template
   * @param {string} templateId - Template ID
   * @param {Object} templateData - Updated email template data
   * @returns {Promise} - API response with updated email template
   */
  async updateEmailTemplate(templateId, templateData) {
    const response = await api.put(`/settings/email-templates/${templateId}`, templateData)
    return response.data
  },

  /**
   * Delete an email template
   * @param {string} templateId - Template ID
   * @returns {Promise} - API response
   */
  async deleteEmailTemplate(templateId) {
    const response = await api.delete(`/settings/email-templates/${templateId}`)
    return response.data
  },

  /**
   * Test an email template
   * @param {string} templateId - Template ID
   * @param {Object} testData - Test data for the template
   * @returns {Promise} - API response with test results
   */
  async testEmailTemplate(templateId, testData) {
    const response = await api.post(`/settings/email-templates/${templateId}/test`, testData)
    return response.data
  },

  /**
   * Create a backup of the system
   * @param {Object} options - Backup options
   * @returns {Promise} - API response with backup information
   */
  async createBackup(options = {}) {
    const response = await api.post('/settings/backup', options)
    return response.data
  },

  /**
   * Get list of available backups
   * @returns {Promise} - API response with backup list
   */
  async getBackups() {
    const response = await api.get('/settings/backup')
    return response.data
  },

  /**
   * Restore system from a backup
   * @param {string} backupId - Backup ID
   * @param {Object} options - Restore options
   * @returns {Promise} - API response with restore information
   */
  async restoreBackup(backupId, options = {}) {
    const response = await api.post(`/settings/backup/${backupId}/restore`, options)
    return response.data
  },

  /**
   * Delete a backup
   * @param {string} backupId - Backup ID
   * @returns {Promise} - API response
   */
  async deleteBackup(backupId) {
    const response = await api.delete(`/settings/backup/${backupId}`)
    return response.data
  },

  /**
   * Get system logs
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with system logs
   */
  async getSystemLogs(params = {}) {
    const response = await api.get('/settings/logs', { params })
    return response.data
  },

  /**
   * Clear system logs
   * @param {Object} options - Options for clearing logs
   * @returns {Promise} - API response
   */
  async clearSystemLogs(options = {}) {
    const response = await api.delete('/settings/logs', { data: options })
    return response.data
  },

  /**
   * Get system health information
   * @returns {Promise} - API response with system health data
   */
  async getSystemHealth() {
    const response = await api.get('/settings/health')
    return response.data
  },

  /**
   * Get system cache information
   * @returns {Promise} - API response with cache information
   */
  async getCacheInfo() {
    const response = await api.get('/settings/cache')
    return response.data
  },

  /**
   * Clear system cache
   * @param {Object} options - Options for clearing cache
   * @returns {Promise} - API response
   */
  async clearCache(options = {}) {
    const response = await api.delete('/settings/cache', { data: options })
    return response.data
  },

  /**
   * Get system update information
   * @returns {Promise} - API response with update information
   */
  async getUpdateInfo() {
    const response = await api.get('/settings/updates')
    return response.data
  },

  /**
   * Check for system updates
   * @returns {Promise} - API response with update check results
   */
  async checkForUpdates() {
    const response = await api.post('/settings/updates/check')
    return response.data
  },

  /**
   * Install system updates
   * @param {Object} options - Update options
   * @returns {Promise} - API response with update installation information
   */
  async installUpdates(options = {}) {
    const response = await api.post('/settings/updates/install', options)
    return response.data
  },

  /**
   * Get data retention policies
   * @returns {Promise} - API response with data retention policies
   */
  async getDataRetentionPolicies() {
    const response = await api.get('/settings/data-retention')
    return response.data
  },

  /**
   * Update data retention policies
   * @param {Object} policies - Data retention policies
   * @returns {Promise} - API response with updated policies
   */
  async updateDataRetentionPolicies(policies) {
    const response = await api.put('/settings/data-retention', policies)
    return response.data
  },

  /**
   * Get custom field configurations
   * @param {string} entityType - Entity type (e.g., 'customer', 'product')
   * @returns {Promise} - API response with custom field configurations
   */
  async getCustomFields(entityType) {
    const response = await api.get(`/settings/custom-fields/${entityType}`)
    return response.data
  },

  /**
   * Update custom field configurations
   * @param {string} entityType - Entity type (e.g., 'customer', 'product')
   * @param {Array} fields - Custom field configurations
   * @returns {Promise} - API response with updated custom field configurations
   */
  async updateCustomFields(entityType, fields) {
    const response = await api.put(`/settings/custom-fields/${entityType}`, { fields })
    return response.data
  },

  /**
   * Get workflow rules
   * @returns {Promise} - API response with workflow rules
   */
  async getWorkflowRules() {
    const response = await api.get('/settings/workflows')
    return response.data
  },

  /**
   * Create a workflow rule
   * @param {Object} rule - Workflow rule data
   * @returns {Promise} - API response with created workflow rule
   */
  async createWorkflowRule(rule) {
    const response = await api.post('/settings/workflows', rule)
    return response.data
  },

  /**
   * Update a workflow rule
   * @param {string} ruleId - Rule ID
   * @param {Object} rule - Updated workflow rule data
   * @returns {Promise} - API response with updated workflow rule
   */
  async updateWorkflowRule(ruleId, rule) {
    const response = await api.put(`/settings/workflows/${ruleId}`, rule)
    return response.data
  },

  /**
   * Delete a workflow rule
   * @param {string} ruleId - Rule ID
   * @returns {Promise} - API response
   */
  async deleteWorkflowRule(ruleId) {
    const response = await api.delete(`/settings/workflows/${ruleId}`)
    return response.data
  },

  /**
   * Get API access tokens
   * @returns {Promise} - API response with API access tokens
   */
  async getApiTokens() {
    const response = await api.get('/settings/api-tokens')
    return response.data
  },

  /**
   * Create an API access token
   * @param {Object} tokenData - API token data
   * @returns {Promise} - API response with created API token
   */
  async createApiToken(tokenData) {
    const response = await api.post('/settings/api-tokens', tokenData)
    return response.data
  },

  /**
   * Revoke an API access token
   * @param {string} tokenId - Token ID
   * @returns {Promise} - API response
   */
  async revokeApiToken(tokenId) {
    const response = await api.delete(`/settings/api-tokens/${tokenId}`)
    return response.data
  },

  /**
   * Get white-labeling options
   * @returns {Promise} - API response with white-labeling options
   */
  async getWhiteLabelOptions() {
    const response = await api.get('/settings/white-label')
    return response.data
  },

  /**
   * Update white-labeling options
   * @param {Object} options - White-labeling options
   * @returns {Promise} - API response with updated white-labeling options
   */
  async updateWhiteLabelOptions(options) {
    const response = await api.put('/settings/white-label', options)
    return response.data
  },

  /**
   * Get available languages
   * @returns {Promise} - API response with available languages
   */
  async getLanguages() {
    const response = await api.get('/settings/languages')
    return response.data
  },

  /**
   * Get translations for a language
   * @param {string} language - Language code
   * @returns {Promise} - API response with translations
   */
  async getTranslations(language) {
    const response = await api.get(`/settings/languages/${language}/translations`)
    return response.data
  },

  /**
   * Update translations for a language
   * @param {string} language - Language code
   * @param {Object} translations - Translations data
   * @returns {Promise} - API response with updated translations
   */
  async updateTranslations(language, translations) {
    const response = await api.put(`/settings/languages/${language}/translations`, translations)
    return response.data
  },

  /**
   * Get mobile app settings
   * @returns {Promise} - API response with mobile app settings
   */
  async getMobileAppSettings() {
    const response = await api.get('/settings/mobile-app')
    return response.data
  },

  /**
   * Update mobile app settings
   * @param {Object} settings - Mobile app settings
   * @returns {Promise} - API response with updated mobile app settings
   */
  async updateMobileAppSettings(settings) {
    const response = await api.put('/settings/mobile-app', settings)
    return response.data
  },

  /**
   * Get push notification settings
   * @returns {Promise} - API response with push notification settings
   */
  async getPushNotificationSettings() {
    const response = await api.get('/settings/push-notifications')
    return response.data
  },

  /**
   * Update push notification settings
   * @param {Object} settings - Push notification settings
   * @returns {Promise} - API response with updated push notification settings
   */
  async updatePushNotificationSettings(settings) {
    const response = await api.put('/settings/push-notifications', settings)
    return response.data
  },

  /**
   * Test push notification
   * @param {Object} testData - Test data for push notification
   * @returns {Promise} - API response with test results
   */
  async testPushNotification(testData) {
    const response = await api.post('/settings/push-notifications/test', testData)
    return response.data
  }
}

export default settingsService 