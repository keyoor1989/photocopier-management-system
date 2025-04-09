import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import integrationService from '@/services/integration'

export const useIntegrationStore = defineStore('integration', () => {
  // State
  const integrations = ref([])
  const selectedIntegration = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const metrics = ref({})
  const webhooks = ref([])
  const logs = ref([])
  const filters = ref({
    search: '',
    status: '',
    type: '',
    dateRange: null
  })
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })

  // Getters
  const filteredIntegrations = computed(() => {
    return integrations.value.filter(integration => {
      const matchesSearch = !filters.value.search || 
        integration.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        integration.description.toLowerCase().includes(filters.value.search.toLowerCase())
      
      const matchesStatus = !filters.value.status || 
        integration.status === filters.value.status
      
      const matchesType = !filters.value.type || 
        integration.type === filters.value.type
      
      const matchesDateRange = !filters.value.dateRange || 
        (integration.createdAt >= filters.value.dateRange[0] && 
         integration.createdAt <= filters.value.dateRange[1])
      
      return matchesSearch && matchesStatus && matchesType && matchesDateRange
    })
  })

  const activeIntegrations = computed(() => 
    integrations.value.filter(integration => integration.status === 'active')
  )

  const inactiveIntegrations = computed(() => 
    integrations.value.filter(integration => integration.status === 'inactive')
  )

  const integrationsByType = computed(() => {
    const types = {}
    integrations.value.forEach(integration => {
      if (!types[integration.type]) {
        types[integration.type] = []
      }
      types[integration.type].push(integration)
    })
    return types
  })

  const integrationMetrics = computed(() => ({
    total: integrations.value.length,
    active: activeIntegrations.value.length,
    inactive: inactiveIntegrations.value.length,
    byType: Object.keys(integrationsByType.value).reduce((acc, type) => {
      acc[type] = integrationsByType.value[type].length
      return acc
    }, {})
  }))

  // Actions
  const fetchIntegrations = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getIntegrations()
      integrations.value = response.data
      pagination.value = {
        ...pagination.value,
        total: response.total
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching integrations:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchIntegration = async (integrationId) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getIntegration(integrationId)
      selectedIntegration.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching integration:', err)
    } finally {
      loading.value = false
    }
  }

  const enableIntegration = async (integrationId) => {
    try {
      loading.value = true
      error.value = null
      await integrationService.enableIntegration(integrationId)
      await fetchIntegration(integrationId)
    } catch (err) {
      error.value = err.message
      console.error('Error enabling integration:', err)
    } finally {
      loading.value = false
    }
  }

  const disableIntegration = async (integrationId) => {
    try {
      loading.value = true
      error.value = null
      await integrationService.disableIntegration(integrationId)
      await fetchIntegration(integrationId)
    } catch (err) {
      error.value = err.message
      console.error('Error disabling integration:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchIntegrationLogs = async (integrationId, params = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getIntegrationLogs(integrationId, params)
      logs.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching integration logs:', err)
    } finally {
      loading.value = false
    }
  }

  const clearIntegrationLogs = async (integrationId) => {
    try {
      loading.value = true
      error.value = null
      await integrationService.clearIntegrationLogs(integrationId)
      logs.value = []
    } catch (err) {
      error.value = err.message
      console.error('Error clearing integration logs:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchIntegrationMetrics = async (integrationId, params = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getIntegrationMetrics(integrationId, params)
      metrics.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching integration metrics:', err)
    } finally {
      loading.value = false
    }
  }

  const testIntegration = async (integrationId) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.testIntegration(integrationId)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error testing integration:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // WhatsApp Integration Actions
  const fetchWhatsAppConfig = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getWhatsAppConfig()
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching WhatsApp config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWhatsAppConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.updateWhatsAppConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating WhatsApp config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchWhatsAppTemplates = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getWhatsAppTemplates()
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching WhatsApp templates:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createWhatsAppTemplate = async (template) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.createWhatsAppTemplate(template)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error creating WhatsApp template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWhatsAppTemplate = async (templateId, template) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.updateWhatsAppTemplate(templateId, template)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating WhatsApp template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWhatsAppTemplate = async (templateId) => {
    try {
      loading.value = true
      error.value = null
      await integrationService.deleteWhatsAppTemplate(templateId)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting WhatsApp template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendWhatsAppMessage = async (messageData) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.sendWhatsAppMessage(messageData)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error sending WhatsApp message:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Email Service Integration Actions
  const fetchEmailServiceConfig = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getEmailServiceConfig()
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching email service config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateEmailServiceConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.updateEmailServiceConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating email service config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const testEmailServiceConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.testEmailServiceConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error testing email service config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Accounting Integration Actions
  const fetchAccountingConfig = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getAccountingConfig()
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching accounting config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAccountingConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.updateAccountingConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating accounting config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const testAccountingConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.testAccountingConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error testing accounting config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const syncAccountingData = async (options = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.syncAccountingData(options)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error syncing accounting data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // SMS Integration Actions
  const fetchSmsConfig = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getSmsConfig()
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching SMS config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSmsConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.updateSmsConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating SMS config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const testSmsConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.testSmsConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error testing SMS config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendSmsMessage = async (messageData) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.sendSmsMessage(messageData)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error sending SMS message:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Payment Gateway Integration Actions
  const fetchPaymentConfig = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getPaymentConfig()
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching payment config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePaymentConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.updatePaymentConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating payment config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const testPaymentConfig = async (config) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.testPaymentConfig(config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error testing payment config:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const processPayment = async (paymentData) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.processPayment(paymentData)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error processing payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Webhook Actions
  const fetchWebhooks = async (integrationId) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.getWebhooks(integrationId)
      webhooks.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching webhooks:', err)
    } finally {
      loading.value = false
    }
  }

  const createWebhook = async (integrationId, webhookData) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.createWebhook(integrationId, webhookData)
      await fetchWebhooks(integrationId)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error creating webhook:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWebhook = async (integrationId, webhookId, webhookData) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.updateWebhook(integrationId, webhookId, webhookData)
      await fetchWebhooks(integrationId)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating webhook:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWebhook = async (integrationId, webhookId) => {
    try {
      loading.value = true
      error.value = null
      await integrationService.deleteWebhook(integrationId, webhookId)
      await fetchWebhooks(integrationId)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting webhook:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const testWebhook = async (integrationId, webhookId) => {
    try {
      loading.value = true
      error.value = null
      const response = await integrationService.testWebhook(integrationId, webhookId)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error testing webhook:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper Actions
  const setFilters = (newFilters) => {
    filters.value = {
      ...filters.value,
      ...newFilters
    }
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      status: '',
      type: '',
      dateRange: null
    }
  }

  const setPagination = (newPagination) => {
    pagination.value = {
      ...pagination.value,
      ...newPagination
    }
  }

  const resetPagination = () => {
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0
    }
  }

  const resetState = () => {
    integrations.value = []
    selectedIntegration.value = null
    loading.value = false
    error.value = null
    metrics.value = {}
    webhooks.value = []
    logs.value = []
    resetFilters()
    resetPagination()
  }

  return {
    // State
    integrations,
    selectedIntegration,
    loading,
    error,
    metrics,
    webhooks,
    logs,
    filters,
    pagination,

    // Getters
    filteredIntegrations,
    activeIntegrations,
    inactiveIntegrations,
    integrationsByType,
    integrationMetrics,

    // Actions
    fetchIntegrations,
    fetchIntegration,
    enableIntegration,
    disableIntegration,
    fetchIntegrationLogs,
    clearIntegrationLogs,
    fetchIntegrationMetrics,
    testIntegration,

    // WhatsApp Integration Actions
    fetchWhatsAppConfig,
    updateWhatsAppConfig,
    fetchWhatsAppTemplates,
    createWhatsAppTemplate,
    updateWhatsAppTemplate,
    deleteWhatsAppTemplate,
    sendWhatsAppMessage,

    // Email Service Integration Actions
    fetchEmailServiceConfig,
    updateEmailServiceConfig,
    testEmailServiceConfig,

    // Accounting Integration Actions
    fetchAccountingConfig,
    updateAccountingConfig,
    testAccountingConfig,
    syncAccountingData,

    // SMS Integration Actions
    fetchSmsConfig,
    updateSmsConfig,
    testSmsConfig,
    sendSmsMessage,

    // Payment Gateway Integration Actions
    fetchPaymentConfig,
    updatePaymentConfig,
    testPaymentConfig,
    processPayment,

    // Webhook Actions
    fetchWebhooks,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook,

    // Helper Actions
    setFilters,
    resetFilters,
    setPagination,
    resetPagination,
    resetState
  }
}) 