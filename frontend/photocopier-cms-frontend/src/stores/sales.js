import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import salesService from '@/services/sales'

export const useSalesStore = defineStore('sales', () => {
  // State
  const sales = ref([])
  const selectedSale = ref(null)
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
    paymentStatus: '',
    deliveryStatus: '',
    customer: '',
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
  const filteredSales = computed(() => {
    let result = [...sales.value]

    // Apply search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      result = result.filter(sale => 
        sale.invoiceNumber?.toLowerCase().includes(searchTerm) ||
        sale.customer?.name.toLowerCase().includes(searchTerm) ||
        sale.description?.toLowerCase().includes(searchTerm)
      )
    }

    // Apply status filter
    if (filters.value.status) {
      result = result.filter(sale => sale.status === filters.value.status)
    }

    // Apply payment status filter
    if (filters.value.paymentStatus) {
      result = result.filter(sale => sale.paymentStatus === filters.value.paymentStatus)
    }

    // Apply delivery status filter
    if (filters.value.deliveryStatus) {
      result = result.filter(sale => sale.deliveryStatus === filters.value.deliveryStatus)
    }

    // Apply customer filter
    if (filters.value.customer) {
      result = result.filter(sale => sale.customer?._id === filters.value.customer)
    }

    // Apply date range filter
    if (filters.value.dateRange.start && filters.value.dateRange.end) {
      const startDate = new Date(filters.value.dateRange.start)
      const endDate = new Date(filters.value.dateRange.end)
      endDate.setHours(23, 59, 59, 999) // End of day
      
      result = result.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate >= startDate && saleDate <= endDate
      })
    }

    // Apply amount range filter
    if (filters.value.minAmount !== null) {
      result = result.filter(sale => sale.totalAmount >= filters.value.minAmount)
    }
    if (filters.value.maxAmount !== null) {
      result = result.filter(sale => sale.totalAmount <= filters.value.maxAmount)
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

  const pendingSales = computed(() => {
    return sales.value.filter(sale => sale.status === 'pending')
  })

  const completedSales = computed(() => {
    return sales.value.filter(sale => sale.status === 'completed')
  })

  const unpaidSales = computed(() => {
    return sales.value.filter(sale => sale.paymentStatus === 'unpaid')
  })

  const partiallyPaidSales = computed(() => {
    return sales.value.filter(sale => sale.paymentStatus === 'partial')
  })

  const totalRevenue = computed(() => {
    return sales.value.reduce((total, sale) => total + (sale.totalAmount || 0), 0)
  })

  const totalProfit = computed(() => {
    return sales.value.reduce((total, sale) => total + (sale.profit || 0), 0)
  })

  const salesByStatus = computed(() => {
    const statusCounts = {}
    sales.value.forEach(sale => {
      const status = sale.status || 'unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    return statusCounts
  })

  const salesByPaymentStatus = computed(() => {
    const statusCounts = {}
    sales.value.forEach(sale => {
      const status = sale.paymentStatus || 'unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    return statusCounts
  })

  // Actions
  async function fetchSales() {
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
      
      const response = await salesService.getSales(params)
      sales.value = response.data
      pagination.value.total = response.total
    } catch (err) {
      error.value = err.message || 'Failed to fetch sales'
      console.error('Error fetching sales:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchSale(id) {
    loading.value = true
    error.value = null
    
    try {
      const sale = await salesService.getSale(id)
      selectedSale.value = sale
      return sale
    } catch (err) {
      error.value = err.message || 'Failed to fetch sale'
      console.error('Error fetching sale:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSale(saleData) {
    loading.value = true
    error.value = null
    
    try {
      const sale = await salesService.createSale(saleData)
      sales.value.unshift(sale)
      return sale
    } catch (err) {
      error.value = err.message || 'Failed to create sale'
      console.error('Error creating sale:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSale(id, saleData) {
    loading.value = true
    error.value = null
    
    try {
      const sale = await salesService.updateSale(id, saleData)
      
      // Update in the list
      const index = sales.value.findIndex(s => s._id === id)
      if (index !== -1) {
        sales.value[index] = sale
      }
      
      // Update selected sale if it's the same
      if (selectedSale.value && selectedSale.value._id === id) {
        selectedSale.value = sale
      }
      
      return sale
    } catch (err) {
      error.value = err.message || 'Failed to update sale'
      console.error('Error updating sale:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSale(id) {
    loading.value = true
    error.value = null
    
    try {
      await salesService.deleteSale(id)
      
      // Remove from the list
      sales.value = sales.value.filter(sale => sale._id !== id)
      
      // Clear selected sale if it's the same
      if (selectedSale.value && selectedSale.value._id === id) {
        selectedSale.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete sale'
      console.error('Error deleting sale:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generateInvoice(id, options = {}) {
    loading.value = true
    error.value = null
    
    try {
      const pdfData = await salesService.generateInvoice(id, options)
      return pdfData
    } catch (err) {
      error.value = err.message || 'Failed to generate invoice'
      console.error('Error generating invoice:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function processPayment(id, paymentData) {
    loading.value = true
    error.value = null
    
    try {
      const sale = await salesService.processPayment(id, paymentData)
      
      // Update in the list
      const index = sales.value.findIndex(s => s._id === id)
      if (index !== -1) {
        sales.value[index] = sale
      }
      
      // Update selected sale if it's the same
      if (selectedSale.value && selectedSale.value._id === id) {
        selectedSale.value = sale
      }
      
      return sale
    } catch (err) {
      error.value = err.message || 'Failed to process payment'
      console.error('Error processing payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDeliveryStatus(id, deliveryData) {
    loading.value = true
    error.value = null
    
    try {
      const sale = await salesService.updateDeliveryStatus(id, deliveryData)
      
      // Update in the list
      const index = sales.value.findIndex(s => s._id === id)
      if (index !== -1) {
        sales.value[index] = sale
      }
      
      // Update selected sale if it's the same
      if (selectedSale.value && selectedSale.value._id === id) {
        selectedSale.value = sale
      }
      
      return sale
    } catch (err) {
      error.value = err.message || 'Failed to update delivery status'
      console.error('Error updating delivery status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSalesMetrics() {
    loading.value = true
    error.value = null
    
    try {
      const data = await salesService.getSalesMetrics(filters.value)
      metrics.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch sales metrics'
      console.error('Error fetching sales metrics:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function convertQuotationToSale(quotationId, conversionData = {}) {
    loading.value = true
    error.value = null
    
    try {
      const sale = await salesService.convertQuotationToSale(quotationId, conversionData)
      sales.value.unshift(sale)
      return sale
    } catch (err) {
      error.value = err.message || 'Failed to convert quotation to sale'
      console.error('Error converting quotation to sale:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generateSalesReport(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const reportData = await salesService.generateSalesReport(params)
      return reportData
    } catch (err) {
      error.value = err.message || 'Failed to generate sales report'
      console.error('Error generating sales report:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function calculateCommission(id) {
    loading.value = true
    error.value = null
    
    try {
      const commission = await salesService.calculateCommission(id)
      return commission
    } catch (err) {
      error.value = err.message || 'Failed to calculate commission'
      console.error('Error calculating commission:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function sendInvoiceByEmail(id, emailData) {
    loading.value = true
    error.value = null
    
    try {
      await salesService.sendInvoiceByEmail(id, emailData)
    } catch (err) {
      error.value = err.message || 'Failed to send invoice by email'
      console.error('Error sending invoice by email:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getPaymentHistory(id) {
    loading.value = true
    error.value = null
    
    try {
      const history = await salesService.getPaymentHistory(id)
      return history
    } catch (err) {
      error.value = err.message || 'Failed to get payment history'
      console.error('Error getting payment history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRecurringBilling(id, billingData) {
    loading.value = true
    error.value = null
    
    try {
      const billing = await salesService.createRecurringBilling(id, billingData)
      return billing
    } catch (err) {
      error.value = err.message || 'Failed to create recurring billing'
      console.error('Error creating recurring billing:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getSalesForecast(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const forecast = await salesService.getSalesForecast(params)
      return forecast
    } catch (err) {
      error.value = err.message || 'Failed to get sales forecast'
      console.error('Error getting sales forecast:', err)
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

  function clearSelectedSale() {
    selectedSale.value = null
  }

  return {
    // State
    sales,
    selectedSale,
    loading,
    error,
    metrics,
    pagination,
    filters,
    sortBy,

    // Getters
    filteredSales,
    pendingSales,
    completedSales,
    unpaidSales,
    partiallyPaidSales,
    totalRevenue,
    totalProfit,
    salesByStatus,
    salesByPaymentStatus,

    // Actions
    fetchSales,
    fetchSale,
    createSale,
    updateSale,
    deleteSale,
    generateInvoice,
    processPayment,
    updateDeliveryStatus,
    fetchSalesMetrics,
    convertQuotationToSale,
    generateSalesReport,
    calculateCommission,
    sendInvoiceByEmail,
    getPaymentHistory,
    createRecurringBilling,
    getSalesForecast,
    setFilters,
    setPagination,
    setSortBy,
    clearSelectedSale
  }
}) 