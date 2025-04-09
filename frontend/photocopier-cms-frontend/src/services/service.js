import api from './api'

export const serviceService = {
  /**
   * Get a list of service tickets with filtering and pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response
   */
  async getServiceTickets(params = {}) {
    const response = await api.get('/services', { params })
    return response.data
  },

  /**
   * Get a single service ticket by ID
   * @param {string} id - Service ticket ID
   * @returns {Promise} - API response
   */
  async getServiceTicket(id) {
    const response = await api.get(`/services/${id}`)
    return response.data
  },

  /**
   * Create a new service ticket
   * @param {Object} ticketData - Service ticket data
   * @returns {Promise} - API response
   */
  async createServiceTicket(ticketData) {
    const response = await api.post('/services', ticketData)
    return response.data
  },

  /**
   * Update an existing service ticket
   * @param {string} id - Service ticket ID
   * @param {Object} ticketData - Updated service ticket data
   * @returns {Promise} - API response
   */
  async updateServiceTicket(id, ticketData) {
    const response = await api.put(`/services/${id}`, ticketData)
    return response.data
  },

  /**
   * Delete a service ticket
   * @param {string} id - Service ticket ID
   * @returns {Promise} - API response
   */
  async deleteServiceTicket(id) {
    const response = await api.delete(`/services/${id}`)
    return response.data
  },

  /**
   * Update the status of a service ticket
   * @param {string} id - Service ticket ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes about the status change
   * @returns {Promise} - API response
   */
  async updateServiceStatus(id, status, notes = '') {
    const response = await api.patch(`/services/${id}/status`, { status, notes })
    return response.data
  },

  /**
   * Assign an engineer to a service ticket
   * @param {string} id - Service ticket ID
   * @param {string} engineerId - Engineer ID
   * @param {string} notes - Optional notes about the assignment
   * @returns {Promise} - API response
   */
  async assignEngineer(id, engineerId, notes = '') {
    const response = await api.post(`/services/${id}/assign`, { engineerId, notes })
    return response.data
  },

  /**
   * Add parts to a service ticket
   * @param {string} id - Service ticket ID
   * @param {Array} parts - Array of parts with quantity and price
   * @returns {Promise} - API response
   */
  async addParts(id, parts) {
    const response = await api.post(`/services/${id}/parts`, { parts })
    return response.data
  },

  /**
   * Get service history for a customer
   * @param {string} customerId - Customer ID
   * @returns {Promise} - API response
   */
  async getCustomerServiceHistory(customerId) {
    const response = await api.get(`/services/customer/${customerId}`)
    return response.data
  },

  /**
   * Get service history for a machine
   * @param {string} machineId - Machine ID
   * @returns {Promise} - API response
   */
  async getMachineServiceHistory(machineId) {
    const response = await api.get(`/services/machine/${machineId}`)
    return response.data
  },

  /**
   * Get service history for an engineer
   * @param {string} engineerId - Engineer ID
   * @returns {Promise} - API response
   */
  async getEngineerServiceHistory(engineerId) {
    const response = await api.get(`/services/engineer/${engineerId}`)
    return response.data
  },

  /**
   * Get service metrics
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getServiceMetrics(params = {}) {
    const response = await api.get('/services/metrics', { params })
    return response.data
  },

  /**
   * Get service calendar events
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getServiceCalendar(params = {}) {
    const response = await api.get('/services/calendar', { params })
    return response.data
  },

  /**
   * Schedule a service appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise} - API response
   */
  async scheduleService(appointmentData) {
    const response = await api.post('/services/schedule', appointmentData)
    return response.data
  },

  /**
   * Reschedule a service appointment
   * @param {string} id - Service ticket ID
   * @param {Object} appointmentData - Updated appointment data
   * @returns {Promise} - API response
   */
  async rescheduleService(id, appointmentData) {
    const response = await api.put(`/services/${id}/schedule`, appointmentData)
    return response.data
  },

  /**
   * Complete a service ticket
   * @param {string} id - Service ticket ID
   * @param {Object} completionData - Completion data
   * @returns {Promise} - API response
   */
  async completeService(id, completionData) {
    const response = await api.post(`/services/${id}/complete`, completionData)
    return response.data
  },

  /**
   * Cancel a service ticket
   * @param {string} id - Service ticket ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} - API response
   */
  async cancelService(id, reason) {
    const response = await api.post(`/services/${id}/cancel`, { reason })
    return response.data
  },

  /**
   * Add a note to a service ticket
   * @param {string} id - Service ticket ID
   * @param {string} note - Note content
   * @param {boolean} isInternal - Whether the note is internal
   * @returns {Promise} - API response
   */
  async addNote(id, note, isInternal = false) {
    const response = await api.post(`/services/${id}/notes`, { note, isInternal })
    return response.data
  },

  /**
   * Upload a photo to a service ticket
   * @param {string} id - Service ticket ID
   * @param {FormData} formData - Form data containing the photo
   * @returns {Promise} - API response
   */
  async uploadPhoto(id, formData) {
    const response = await api.post(`/services/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * Get available engineers for a service ticket
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getAvailableEngineers(params = {}) {
    const response = await api.get('/services/available-engineers', { params })
    return response.data
  },

  /**
   * Get engineer workload
   * @param {string} engineerId - Engineer ID
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getEngineerWorkload(engineerId, params = {}) {
    const response = await api.get(`/services/engineer/${engineerId}/workload`, { params })
    return response.data
  },

  /**
   * Get service checklist for a service type
   * @param {string} serviceType - Service type
   * @returns {Promise} - API response
   */
  async getServiceChecklist(serviceType) {
    const response = await api.get(`/services/checklist/${serviceType}`)
    return response.data
  },

  /**
   * Update service checklist progress
   * @param {string} id - Service ticket ID
   * @param {Array} checklist - Updated checklist items
   * @returns {Promise} - API response
   */
  async updateServiceChecklist(id, checklist) {
    const response = await api.put(`/services/${id}/checklist`, { checklist })
    return response.data
  },

  /**
   * Get service SLA information
   * @param {string} id - Service ticket ID
   * @returns {Promise} - API response
   */
  async getServiceSLA(id) {
    const response = await api.get(`/services/${id}/sla`)
    return response.data
  },

  /**
   * Get recurring service schedules
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getRecurringServices(params = {}) {
    const response = await api.get('/services/recurring', { params })
    return response.data
  },

  /**
   * Create a recurring service schedule
   * @param {Object} scheduleData - Recurring service schedule data
   * @returns {Promise} - API response
   */
  async createRecurringService(scheduleData) {
    const response = await api.post('/services/recurring', scheduleData)
    return response.data
  },

  /**
   * Update a recurring service schedule
   * @param {string} id - Recurring service ID
   * @param {Object} scheduleData - Updated recurring service schedule data
   * @returns {Promise} - API response
   */
  async updateRecurringService(id, scheduleData) {
    const response = await api.put(`/services/recurring/${id}`, scheduleData)
    return response.data
  },

  /**
   * Delete a recurring service schedule
   * @param {string} id - Recurring service ID
   * @returns {Promise} - API response
   */
  async deleteRecurringService(id) {
    const response = await api.delete(`/services/recurring/${id}`)
    return response.data
  },

  /**
   * Get customer satisfaction data
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getCustomerSatisfaction(params = {}) {
    const response = await api.get('/services/satisfaction', { params })
    return response.data
  },

  /**
   * Submit customer satisfaction feedback
   * @param {string} id - Service ticket ID
   * @param {Object} feedbackData - Customer satisfaction feedback data
   * @returns {Promise} - API response
   */
  async submitCustomerFeedback(id, feedbackData) {
    const response = await api.post(`/services/${id}/feedback`, feedbackData)
    return response.data
  },

  /**
   * Get service cost analysis
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getServiceCostAnalysis(params = {}) {
    const response = await api.get('/services/cost-analysis', { params })
    return response.data
  },

  /**
   * Get service trend analysis
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  async getServiceTrendAnalysis(params = {}) {
    const response = await api.get('/services/trend-analysis', { params })
    return response.data
  },

  /**
   * Send service notification to customer
   * @param {string} id - Service ticket ID
   * @param {string} notificationType - Type of notification
   * @param {Object} notificationData - Additional notification data
   * @returns {Promise} - API response
   */
  async sendServiceNotification(id, notificationType, notificationData = {}) {
    const response = await api.post(`/services/${id}/notify`, { 
      type: notificationType, 
      ...notificationData 
    })
    return response.data
  }
}

export default serviceService 