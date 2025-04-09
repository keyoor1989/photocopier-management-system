import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import quotationService from '@/services/quotation'

export const useQuotationStore = defineStore('quotation', () => {
  // State
  const quotations = ref([])
  const selectedQuotation = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const metrics = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })
  const filters = ref({
    search: '',
    status: '',
    customer: '',
    validityStatus: '',
    dateRange: {
      start: null,
      end: null
    },
    minAmount: null,
    maxAmount: null
  })
  const sortBy = ref({
    field: 'createdAt',
    order: 'desc'
  })

  // Getters
  const filteredQuotations = computed(() => {
    let result = [...quotations.value]

    // Apply search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      result = result.filter(quotation => 
        quotation.quotationNumber?.toLowerCase().includes(searchTerm) ||
        quotation.customer?.name.toLowerCase().includes(searchTerm) ||
        quotation.description?.toLowerCase().includes(searchTerm)
      )
    }

    // Apply status filter
    if (filters.value.status) {
      result = result.filter(quotation => quotation.status === filters.value.status)
    }

    // Apply validity status filter
    if (filters.value.validityStatus) {
      const now = new Date()
      if (filters.value.validityStatus === 'valid') {
        result = result.filter(quotation => {
          const validUntil = new Date(quotation.validUntil)
          return validUntil > now
        })
      } else if (filters.value.validityStatus === 'expired') {
        result = result.filter(quotation => {
          const validUntil = new Date(quotation.validUntil)
          return validUntil <= now
        })
      }
    }

    // Apply customer filter
    if (filters.value.customer) {
      result = result.filter(quotation => quotation.customer?._id === filters.value.customer)
    }

    // Apply date range filter
    if (filters.value.dateRange.start && filters.value.dateRange.end) {
      const startDate = new Date(filters.value.dateRange.start)
      const endDate = new Date(filters.value.dateRange.end)
      endDate.setHours(23, 59, 59, 999) // End of day
      
      result = result.filter(quotation => {
        const quotationDate = new Date(quotation.createdAt)
        return quotationDate >= startDate && quotationDate <= endDate
      })
    }

    // Apply amount range filter
    if (filters.value.minAmount !== null) {
      result = result.filter(quotation => quotation.totalAmount >= filters.value.minAmount)
    }
    if (filters.value.maxAmount !== null) {
      result = result.filter(quotation => quotation.totalAmount <= filters.value.maxAmount)
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy.value.field]
      let bValue = b[sortBy.value.field]

      // Handle nested properties
      if (sortBy.value.field === 'customer') {
        aValue = a.customer?.name || ''
        bValue = b.customer?.name || ''
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

  const pendingQuotations = computed(() => {
    return quotations.value.filter(quotation => quotation.status === 'pending')
  })

  const approvedQuotations = computed(() => {
    return quotations.value.filter(quotation => quotation.status === 'approved')
  })

  const rejectedQuotations = computed(() => {
    return quotations.value.filter(quotation => quotation.status === 'rejected')
  })

  const expiredQuotations = computed(() => {
    const now = new Date()
    return quotations.value.filter(quotation => {
      const validUntil = new Date(quotation.validUntil)
      return validUntil <= now
    })
  })

  const expiringQuotations = computed(() => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return quotations.value.filter(quotation => {
      const validUntil = new Date(quotation.validUntil)
      return validUntil > now && validUntil <= sevenDaysFromNow
    })
  })

  const quotationsByStatus = computed(() => {
    const statusCounts = {}
    quotations.value.forEach(quotation => {
      const status = quotation.status || 'unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    return statusCounts
  })

  const totalQuotationValue = computed(() => {
    return quotations.value.reduce((total, quotation) => total + (quotation.totalAmount || 0), 0)
  })

  const conversionRate = computed(() => {
    const converted = quotations.value.filter(quotation => quotation.status === 'converted').length
    return quotations.value.length > 0 ? (converted / quotations.value.length) * 100 : 0
  })

  // Actions
  async function fetchQuotations() {
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
      
      const response = await quotationService.getQuotations(params)
      quotations.value = response.data
      pagination.value.total = response.total
    } catch (err) {
      error.value = err.message || 'Failed to fetch quotations'
      console.error('Error fetching quotations:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchQuotation(id) {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.getQuotation(id)
      selectedQuotation.value = quotation
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to fetch quotation'
      console.error('Error fetching quotation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createQuotation(quotationData) {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.createQuotation(quotationData)
      quotations.value.unshift(quotation)
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to create quotation'
      console.error('Error creating quotation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateQuotation(id, quotationData) {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.updateQuotation(id, quotationData)
      
      // Update in the list
      const index = quotations.value.findIndex(q => q._id === id)
      if (index !== -1) {
        quotations.value[index] = quotation
      }
      
      // Update selected quotation if it's the same
      if (selectedQuotation.value && selectedQuotation.value._id === id) {
        selectedQuotation.value = quotation
      }
      
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to update quotation'
      console.error('Error updating quotation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteQuotation(id) {
    loading.value = true
    error.value = null
    
    try {
      await quotationService.deleteQuotation(id)
      
      // Remove from the list
      quotations.value = quotations.value.filter(quotation => quotation._id !== id)
      
      // Clear selected quotation if it's the same
      if (selectedQuotation.value && selectedQuotation.value._id === id) {
        selectedQuotation.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete quotation'
      console.error('Error deleting quotation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generatePDF(id, options = {}) {
    loading.value = true
    error.value = null
    
    try {
      const pdfData = await quotationService.generatePDF(id, options)
      return pdfData
    } catch (err) {
      error.value = err.message || 'Failed to generate PDF'
      console.error('Error generating PDF:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function sendByEmail(id, emailData) {
    loading.value = true
    error.value = null
    
    try {
      await quotationService.sendByEmail(id, emailData)
    } catch (err) {
      error.value = err.message || 'Failed to send quotation by email'
      console.error('Error sending quotation by email:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id, status, notes = '') {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.updateStatus(id, status, notes)
      
      // Update in the list
      const index = quotations.value.findIndex(q => q._id === id)
      if (index !== -1) {
        quotations.value[index] = quotation
      }
      
      // Update selected quotation if it's the same
      if (selectedQuotation.value && selectedQuotation.value._id === id) {
        selectedQuotation.value = quotation
      }
      
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to update quotation status'
      console.error('Error updating quotation status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function extendValidity(id, newValidityDate) {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.extendValidity(id, newValidityDate)
      
      // Update in the list
      const index = quotations.value.findIndex(q => q._id === id)
      if (index !== -1) {
        quotations.value[index] = quotation
      }
      
      // Update selected quotation if it's the same
      if (selectedQuotation.value && selectedQuotation.value._id === id) {
        selectedQuotation.value = quotation
      }
      
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to extend quotation validity'
      console.error('Error extending quotation validity:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRevision(id, revisionData = {}) {
    loading.value = true
    error.value = null
    
    try {
      const revision = await quotationService.createRevision(id, revisionData)
      return revision
    } catch (err) {
      error.value = err.message || 'Failed to create revision'
      console.error('Error creating revision:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getRevisionHistory(id) {
    loading.value = true
    error.value = null
    
    try {
      const history = await quotationService.getRevisionHistory(id)
      return history
    } catch (err) {
      error.value = err.message || 'Failed to get revision history'
      console.error('Error getting revision history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitForApproval(id, approvalData = {}) {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.submitForApproval(id, approvalData)
      
      // Update in the list
      const index = quotations.value.findIndex(q => q._id === id)
      if (index !== -1) {
        quotations.value[index] = quotation
      }
      
      // Update selected quotation if it's the same
      if (selectedQuotation.value && selectedQuotation.value._id === id) {
        selectedQuotation.value = quotation
      }
      
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to submit quotation for approval'
      console.error('Error submitting quotation for approval:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function processApproval(id, approvalData) {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.processApproval(id, approvalData)
      
      // Update in the list
      const index = quotations.value.findIndex(q => q._id === id)
      if (index !== -1) {
        quotations.value[index] = quotation
      }
      
      // Update selected quotation if it's the same
      if (selectedQuotation.value && selectedQuotation.value._id === id) {
        selectedQuotation.value = quotation
      }
      
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to process approval'
      console.error('Error processing approval:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchQuotationMetrics() {
    loading.value = true
    error.value = null
    
    try {
      const data = await quotationService.getQuotationMetrics(filters.value)
      metrics.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch quotation metrics'
      console.error('Error fetching quotation metrics:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generateBatchQuotations(batchData) {
    loading.value = true
    error.value = null
    
    try {
      const newQuotations = await quotationService.generateBatchQuotations(batchData)
      quotations.value.unshift(...newQuotations)
      return newQuotations
    } catch (err) {
      error.value = err.message || 'Failed to generate batch quotations'
      console.error('Error generating batch quotations:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function scheduleFollowUp(id, followUpData) {
    loading.value = true
    error.value = null
    
    try {
      const quotation = await quotationService.scheduleFollowUp(id, followUpData)
      
      // Update in the list
      const index = quotations.value.findIndex(q => q._id === id)
      if (index !== -1) {
        quotations.value[index] = quotation
      }
      
      // Update selected quotation if it's the same
      if (selectedQuotation.value && selectedQuotation.value._id === id) {
        selectedQuotation.value = quotation
      }
      
      return quotation
    } catch (err) {
      error.value = err.message || 'Failed to schedule follow-up'
      console.error('Error scheduling follow-up:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function compareVersions(id, revisionId) {
    loading.value = true
    error.value = null
    
    try {
      const comparison = await quotationService.compareVersions(id, revisionId)
      return comparison
    } catch (err) {
      error.value = err.message || 'Failed to compare versions'
      console.error('Error comparing versions:', err)
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

  function clearSelectedQuotation() {
    selectedQuotation.value = null
  }

  return {
    // State
    quotations,
    selectedQuotation,
    loading,
    error,
    metrics,
    pagination,
    filters,
    sortBy,

    // Getters
    filteredQuotations,
    pendingQuotations,
    approvedQuotations,
    rejectedQuotations,
    expiredQuotations,
    expiringQuotations,
    quotationsByStatus,
    totalQuotationValue,
    conversionRate,

    // Actions
    fetchQuotations,
    fetchQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    generatePDF,
    sendByEmail,
    updateStatus,
    extendValidity,
    createRevision,
    getRevisionHistory,
    submitForApproval,
    processApproval,
    fetchQuotationMetrics,
    generateBatchQuotations,
    scheduleFollowUp,
    compareVersions,
    setFilters,
    setPagination,
    setSortBy,
    clearSelectedQuotation
  }
}) 