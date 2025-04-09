import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import serviceService from '@/services/service'

export const useServiceStore = defineStore('service', () => {
  // State
  const serviceTickets = ref([])
  const selectedTicket = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const engineers = ref([])
  const serviceTypes = ref([])
  const serviceChecklists = ref({})
  const recurringServices = ref([])
  const calendarEvents = ref([])
  const metrics = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })
  const filters = ref({
    search: '',
    status: '',
    priority: '',
    engineer: '',
    customer: '',
    machine: '',
    dateRange: {
      start: null,
      end: null
    },
    serviceType: ''
  })
  const sortBy = ref({
    field: 'createdAt',
    order: 'desc'
  })

  // Getters
  const filteredTickets = computed(() => {
    let result = [...serviceTickets.value]

    // Apply search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      result = result.filter(ticket => 
        ticket.ticketNumber.toLowerCase().includes(searchTerm) ||
        ticket.customer?.name.toLowerCase().includes(searchTerm) ||
        ticket.machine?.model.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm)
      )
    }

    // Apply status filter
    if (filters.value.status) {
      result = result.filter(ticket => ticket.status === filters.value.status)
    }

    // Apply priority filter
    if (filters.value.priority) {
      result = result.filter(ticket => ticket.priority === filters.value.priority)
    }

    // Apply engineer filter
    if (filters.value.engineer) {
      result = result.filter(ticket => ticket.engineer?._id === filters.value.engineer)
    }

    // Apply customer filter
    if (filters.value.customer) {
      result = result.filter(ticket => ticket.customer?._id === filters.value.customer)
    }

    // Apply machine filter
    if (filters.value.machine) {
      result = result.filter(ticket => ticket.machine?._id === filters.value.machine)
    }

    // Apply date range filter
    if (filters.value.dateRange.start && filters.value.dateRange.end) {
      const startDate = new Date(filters.value.dateRange.start)
      const endDate = new Date(filters.value.dateRange.end)
      endDate.setHours(23, 59, 59, 999) // End of day
      
      result = result.filter(ticket => {
        const ticketDate = new Date(ticket.scheduledDate || ticket.createdAt)
        return ticketDate >= startDate && ticketDate <= endDate
      })
    }

    // Apply service type filter
    if (filters.value.serviceType) {
      result = result.filter(ticket => ticket.serviceType === filters.value.serviceType)
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy.value.field]
      let bValue = b[sortBy.value.field]

      // Handle nested properties
      if (sortBy.value.field === 'customer') {
        aValue = a.customer?.name || ''
        bValue = b.customer?.name || ''
      } else if (sortBy.value.field === 'engineer') {
        aValue = a.engineer?.name || ''
        bValue = b.engineer?.name || ''
      } else if (sortBy.value.field === 'machine') {
        aValue = a.machine?.model || ''
        bValue = b.machine?.model || ''
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortBy.value.order === 'asc' ? -1 : 1
      if (aValue > bValue) return sortBy.value.order === 'asc' ? 1 : -1
      return 0
    })

    return result
  })

  const pendingTickets = computed(() => {
    return serviceTickets.value.filter(ticket => 
      ['open', 'assigned', 'in-progress'].includes(ticket.status)
    )
  })

  const completedTickets = computed(() => {
    return serviceTickets.value.filter(ticket => ticket.status === 'completed')
  })

  const overdueTickets = computed(() => {
    const now = new Date()
    return serviceTickets.value.filter(ticket => {
      if (ticket.status === 'completed') return false
      if (!ticket.dueDate) return false
      
      const dueDate = new Date(ticket.dueDate)
      return dueDate < now
    })
  })

  const ticketsByStatus = computed(() => {
    const statusCounts = {}
    
    serviceTickets.value.forEach(ticket => {
      const status = ticket.status || 'unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    
    return statusCounts
  })

  const ticketsByPriority = computed(() => {
    const priorityCounts = {}
    
    serviceTickets.value.forEach(ticket => {
      const priority = ticket.priority || 'medium'
      priorityCounts[priority] = (priorityCounts[priority] || 0) + 1
    })
    
    return priorityCounts
  })

  const ticketsByEngineer = computed(() => {
    const engineerCounts = {}
    
    serviceTickets.value.forEach(ticket => {
      if (!ticket.engineer) return
      
      const engineerId = ticket.engineer._id
      const engineerName = ticket.engineer.name
      
      if (!engineerCounts[engineerId]) {
        engineerCounts[engineerId] = {
          name: engineerName,
          count: 0,
          completed: 0,
          pending: 0
        }
      }
      
      engineerCounts[engineerId].count++
      
      if (ticket.status === 'completed') {
        engineerCounts[engineerId].completed++
      } else if (['open', 'assigned', 'in-progress'].includes(ticket.status)) {
        engineerCounts[engineerId].pending++
      }
    })
    
    return engineerCounts
  })

  const averageResolutionTime = computed(() => {
    const completedTickets = serviceTickets.value.filter(ticket => 
      ticket.status === 'completed' && ticket.completedAt && ticket.createdAt
    )
    
    if (completedTickets.length === 0) return 0
    
    const totalTime = completedTickets.reduce((total, ticket) => {
      const created = new Date(ticket.createdAt)
      const completed = new Date(ticket.completedAt)
      return total + (completed - created)
    }, 0)
    
    return totalTime / completedTickets.length
  })

  // Actions
  async function fetchServiceTickets() {
    loading.value = true
    error.value = null
    
    try {
      const params = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        sortBy: sortBy.value.field,
        sortOrder: sortBy.value.order,
        ...filters.value
      }
      
      const response = await serviceService.getServiceTickets(params)
      serviceTickets.value = response.data
      pagination.value.total = response.total
    } catch (err) {
      error.value = err.message || 'Failed to fetch service tickets'
      console.error('Error fetching service tickets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchServiceTicket(id) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.getServiceTicket(id)
      selectedTicket.value = ticket
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to fetch service ticket'
      console.error('Error fetching service ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createServiceTicket(ticketData) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.createServiceTicket(ticketData)
      serviceTickets.value.unshift(ticket)
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to create service ticket'
      console.error('Error creating service ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateServiceTicket(id, ticketData) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.updateServiceTicket(id, ticketData)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to update service ticket'
      console.error('Error updating service ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteServiceTicket(id) {
    loading.value = true
    error.value = null
    
    try {
      await serviceService.deleteServiceTicket(id)
      
      // Remove from the list
      serviceTickets.value = serviceTickets.value.filter(ticket => ticket._id !== id)
      
      // Clear selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete service ticket'
      console.error('Error deleting service ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateServiceStatus(id, status, notes = '') {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.updateServiceStatus(id, status, notes)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to update service status'
      console.error('Error updating service status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function assignEngineer(id, engineerId, notes = '') {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.assignEngineer(id, engineerId, notes)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to assign engineer'
      console.error('Error assigning engineer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addParts(id, parts) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.addParts(id, parts)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to add parts'
      console.error('Error adding parts:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerServiceHistory(customerId) {
    loading.value = true
    error.value = null
    
    try {
      const history = await serviceService.getCustomerServiceHistory(customerId)
      return history
    } catch (err) {
      error.value = err.message || 'Failed to fetch customer service history'
      console.error('Error fetching customer service history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMachineServiceHistory(machineId) {
    loading.value = true
    error.value = null
    
    try {
      const history = await serviceService.getMachineServiceHistory(machineId)
      return history
    } catch (err) {
      error.value = err.message || 'Failed to fetch machine service history'
      console.error('Error fetching machine service history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEngineerServiceHistory(engineerId) {
    loading.value = true
    error.value = null
    
    try {
      const history = await serviceService.getEngineerServiceHistory(engineerId)
      return history
    } catch (err) {
      error.value = err.message || 'Failed to fetch engineer service history'
      console.error('Error fetching engineer service history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchServiceMetrics() {
    loading.value = true
    error.value = null
    
    try {
      const data = await serviceService.getServiceMetrics(filters.value)
      metrics.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch service metrics'
      console.error('Error fetching service metrics:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchServiceCalendar() {
    loading.value = true
    error.value = null
    
    try {
      const events = await serviceService.getServiceCalendar(filters.value)
      calendarEvents.value = events
      return events
    } catch (err) {
      error.value = err.message || 'Failed to fetch service calendar'
      console.error('Error fetching service calendar:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function scheduleService(appointmentData) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.scheduleService(appointmentData)
      serviceTickets.value.unshift(ticket)
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to schedule service'
      console.error('Error scheduling service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rescheduleService(id, appointmentData) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.rescheduleService(id, appointmentData)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to reschedule service'
      console.error('Error rescheduling service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function completeService(id, completionData) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.completeService(id, completionData)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to complete service'
      console.error('Error completing service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelService(id, reason) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.cancelService(id, reason)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to cancel service'
      console.error('Error canceling service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addNote(id, note, isInternal = false) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.addNote(id, note, isInternal)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to add note'
      console.error('Error adding note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadPhoto(id, formData) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.uploadPhoto(id, formData)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to upload photo'
      console.error('Error uploading photo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableEngineers() {
    loading.value = true
    error.value = null
    
    try {
      const engineers = await serviceService.getAvailableEngineers(filters.value)
      return engineers
    } catch (err) {
      error.value = err.message || 'Failed to fetch available engineers'
      console.error('Error fetching available engineers:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEngineerWorkload(engineerId) {
    loading.value = true
    error.value = null
    
    try {
      const workload = await serviceService.getEngineerWorkload(engineerId, filters.value)
      return workload
    } catch (err) {
      error.value = err.message || 'Failed to fetch engineer workload'
      console.error('Error fetching engineer workload:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchServiceChecklist(serviceType) {
    loading.value = true
    error.value = null
    
    try {
      // Check if we already have this checklist cached
      if (serviceChecklists.value[serviceType]) {
        return serviceChecklists.value[serviceType]
      }
      
      const checklist = await serviceService.getServiceChecklist(serviceType)
      serviceChecklists.value[serviceType] = checklist
      return checklist
    } catch (err) {
      error.value = err.message || 'Failed to fetch service checklist'
      console.error('Error fetching service checklist:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateServiceChecklist(id, checklist) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.updateServiceChecklist(id, checklist)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to update service checklist'
      console.error('Error updating service checklist:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchServiceSLA(id) {
    loading.value = true
    error.value = null
    
    try {
      const sla = await serviceService.getServiceSLA(id)
      return sla
    } catch (err) {
      error.value = err.message || 'Failed to fetch service SLA'
      console.error('Error fetching service SLA:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRecurringServices() {
    loading.value = true
    error.value = null
    
    try {
      const services = await serviceService.getRecurringServices(filters.value)
      recurringServices.value = services
      return services
    } catch (err) {
      error.value = err.message || 'Failed to fetch recurring services'
      console.error('Error fetching recurring services:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRecurringService(scheduleData) {
    loading.value = true
    error.value = null
    
    try {
      const service = await serviceService.createRecurringService(scheduleData)
      recurringServices.value.push(service)
      return service
    } catch (err) {
      error.value = err.message || 'Failed to create recurring service'
      console.error('Error creating recurring service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRecurringService(id, scheduleData) {
    loading.value = true
    error.value = null
    
    try {
      const service = await serviceService.updateRecurringService(id, scheduleData)
      
      // Update in the list
      const index = recurringServices.value.findIndex(s => s._id === id)
      if (index !== -1) {
        recurringServices.value[index] = service
      }
      
      return service
    } catch (err) {
      error.value = err.message || 'Failed to update recurring service'
      console.error('Error updating recurring service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRecurringService(id) {
    loading.value = true
    error.value = null
    
    try {
      await serviceService.deleteRecurringService(id)
      
      // Remove from the list
      recurringServices.value = recurringServices.value.filter(service => service._id !== id)
    } catch (err) {
      error.value = err.message || 'Failed to delete recurring service'
      console.error('Error deleting recurring service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerSatisfaction() {
    loading.value = true
    error.value = null
    
    try {
      const data = await serviceService.getCustomerSatisfaction(filters.value)
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch customer satisfaction data'
      console.error('Error fetching customer satisfaction data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitCustomerFeedback(id, feedbackData) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await serviceService.submitCustomerFeedback(id, feedbackData)
      
      // Update in the list
      const index = serviceTickets.value.findIndex(t => t._id === id)
      if (index !== -1) {
        serviceTickets.value[index] = ticket
      }
      
      // Update selected ticket if it's the same
      if (selectedTicket.value && selectedTicket.value._id === id) {
        selectedTicket.value = ticket
      }
      
      return ticket
    } catch (err) {
      error.value = err.message || 'Failed to submit customer feedback'
      console.error('Error submitting customer feedback:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchServiceCostAnalysis() {
    loading.value = true
    error.value = null
    
    try {
      const data = await serviceService.getServiceCostAnalysis(filters.value)
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch service cost analysis'
      console.error('Error fetching service cost analysis:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchServiceTrendAnalysis() {
    loading.value = true
    error.value = null
    
    try {
      const data = await serviceService.getServiceTrendAnalysis(filters.value)
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch service trend analysis'
      console.error('Error fetching service trend analysis:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function sendServiceNotification(id, notificationType, notificationData = {}) {
    loading.value = true
    error.value = null
    
    try {
      const result = await serviceService.sendServiceNotification(id, notificationType, notificationData)
      return result
    } catch (err) {
      error.value = err.message || 'Failed to send service notification'
      console.error('Error sending service notification:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page when filters change
  }

  function setPagination(newPagination) {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  function setSortBy(field) {
    if (sortBy.value.field === field) {
      sortBy.value.order = sortBy.value.order === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value.field = field
      sortBy.value.order = 'asc'
    }
  }

  function clearSelectedTicket() {
    selectedTicket.value = null
  }

  return {
    // State
    serviceTickets,
    selectedTicket,
    loading,
    error,
    engineers,
    serviceTypes,
    serviceChecklists,
    recurringServices,
    calendarEvents,
    metrics,
    pagination,
    filters,
    sortBy,

    // Getters
    filteredTickets,
    pendingTickets,
    completedTickets,
    overdueTickets,
    ticketsByStatus,
    ticketsByPriority,
    ticketsByEngineer,
    averageResolutionTime,

    // Actions
    fetchServiceTickets,
    fetchServiceTicket,
    createServiceTicket,
    updateServiceTicket,
    deleteServiceTicket,
    updateServiceStatus,
    assignEngineer,
    addParts,
    fetchCustomerServiceHistory,
    fetchMachineServiceHistory,
    fetchEngineerServiceHistory,
    fetchServiceMetrics,
    fetchServiceCalendar,
    scheduleService,
    rescheduleService,
    completeService,
    cancelService,
    addNote,
    uploadPhoto,
    fetchAvailableEngineers,
    fetchEngineerWorkload,
    fetchServiceChecklist,
    updateServiceChecklist,
    fetchServiceSLA,
    fetchRecurringServices,
    createRecurringService,
    updateRecurringService,
    deleteRecurringService,
    fetchCustomerSatisfaction,
    submitCustomerFeedback,
    fetchServiceCostAnalysis,
    fetchServiceTrendAnalysis,
    sendServiceNotification,
    setFilters,
    setPagination,
    setSortBy,
    clearSelectedTicket
  }
}) 