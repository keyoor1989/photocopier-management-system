import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import customerService from '@/services/customer'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customers = ref([])
  const selectedCustomer = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })
  const filters = ref({
    search: '',
    status: '',
    branch: '',
    tags: []
  })
  const importProgress = ref(0)
  const exportProgress = ref(0)
  const timeline = ref([])
  const selectedTags = ref([])

  // Getters
  const filteredCustomers = computed(() => {
    return customers.value.filter(customer => {
      const matchesSearch = !filters.value.search || 
        customer.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.value.search.toLowerCase())
      const matchesStatus = !filters.value.status || customer.status === filters.value.status
      const matchesBranch = !filters.value.branch || customer.branch === filters.value.branch
      const matchesTags = !filters.value.tags.length || 
        filters.value.tags.every(tag => customer.tags?.includes(tag))
      return matchesSearch && matchesStatus && matchesBranch && matchesTags
    })
  })

  const customerById = computed(() => (id) => {
    return customers.value.find(customer => customer.id === id)
  })

  // Actions
  async function fetchCustomers() {
    loading.value = true
    error.value = null
    try {
      const response = await customerService.getCustomers({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value
      })
      customers.value = response.data
      pagination.value.total = response.total
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customers:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomer(id) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerService.getCustomer(id)
      selectedCustomer.value = customer
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customer:', err)
    } finally {
      loading.value = false
    }
  }

  async function createCustomer(customerData) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerService.createCustomer(customerData)
      customers.value.push(customer)
      return customer
    } catch (err) {
      error.value = err.message
      console.error('Error creating customer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCustomer(id, customerData) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerService.updateCustomer(id, customerData)
      const index = customers.value.findIndex(c => c._id === id)
      if (index !== -1) {
        customers.value[index] = customer
      }
      if (selectedCustomer.value?._id === id) {
        selectedCustomer.value = customer
      }
      return customer
    } catch (err) {
      error.value = err.message
      console.error('Error updating customer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCustomer(id) {
    loading.value = true
    error.value = null
    try {
      await customerService.deleteCustomer(id)
      customers.value = customers.value.filter(c => c._id !== id)
      if (selectedCustomer.value?._id === id) {
        selectedCustomer.value = null
      }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting customer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addNote(customerId, noteData) {
    loading.value = true
    error.value = null
    try {
      const note = await customerService.addNote(customerId, noteData)
      if (selectedCustomer.value?._id === customerId) {
        selectedCustomer.value.notes = [...(selectedCustomer.value.notes || []), note]
      }
      return note
    } catch (err) {
      error.value = err.message
      console.error('Error adding note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addMachine(customerId, machineData) {
    loading.value = true
    error.value = null
    try {
      const machine = await customerService.addMachine(customerId, machineData)
      if (selectedCustomer.value?._id === customerId) {
        selectedCustomer.value.machines = [...(selectedCustomer.value.machines || []), machine]
      }
      return machine
    } catch (err) {
      error.value = err.message
      console.error('Error adding machine:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerMachines(customerId) {
    loading.value = true
    error.value = null
    try {
      const machines = await customerService.getCustomerMachines(customerId)
      if (selectedCustomer.value?._id === customerId) {
        selectedCustomer.value.machines = machines
      }
      return machines
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customer machines:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerNotes(customerId) {
    loading.value = true
    error.value = null
    try {
      const notes = await customerService.getCustomerNotes(customerId)
      if (selectedCustomer.value?._id === customerId) {
        selectedCustomer.value.notes = notes
      }
      return notes
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customer notes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerServiceHistory(customerId) {
    loading.value = true
    error.value = null
    try {
      const history = await customerService.getCustomerServiceHistory(customerId)
      if (selectedCustomer.value?._id === customerId) {
        selectedCustomer.value.serviceHistory = history
      }
      return history
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customer service history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerSales(customerId) {
    loading.value = true
    error.value = null
    try {
      const sales = await customerService.getCustomerSales(customerId)
      if (selectedCustomer.value?._id === customerId) {
        selectedCustomer.value.sales = sales
      }
      return sales
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customer sales:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function importCustomers(formData) {
    loading.value = true
    error.value = null
    importProgress.value = 0
    try {
      const response = await customerService.importCustomers(formData)
      await fetchCustomers() // Refresh the customer list
      return response
    } catch (err) {
      error.value = err.message
      console.error('Error importing customers:', err)
      throw err
    } finally {
      loading.value = false
      importProgress.value = 100
    }
  }

  async function exportCustomers() {
    loading.value = true
    error.value = null
    exportProgress.value = 0
    try {
      const blob = await customerService.exportCustomers(filters.value)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customers-export-${new Date().toISOString()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      error.value = err.message
      console.error('Error exporting customers:', err)
      throw err
    } finally {
      loading.value = false
      exportProgress.value = 100
    }
  }

  async function updateCustomerStatus(customerId, status) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerService.updateCustomerStatus(customerId, status)
      const index = customers.value.findIndex(c => c._id === customerId)
      if (index !== -1) {
        customers.value[index] = customer
      }
      if (selectedCustomer.value?._id === customerId) {
        selectedCustomer.value = customer
      }
      return customer
    } catch (err) {
      error.value = err.message
      console.error('Error updating customer status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerTimeline(customerId) {
    loading.value = true
    error.value = null
    try {
      const activities = await customerService.getCustomerTimeline(customerId)
      timeline.value = activities
      return activities
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customer timeline:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generateCustomerReport(customerId, reportOptions) {
    loading.value = true
    error.value = null
    try {
      const blob = await customerService.generateCustomerReport(customerId, reportOptions)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customer-report-${customerId}-${new Date().toISOString()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      error.value = err.message
      console.error('Error generating customer report:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function bulkUpdateTags(customerIds, tags, action) {
    loading.value = true
    error.value = null
    try {
      await customerService.bulkUpdateTags(customerIds, tags, action)
      await fetchCustomers() // Refresh the customer list
    } catch (err) {
      error.value = err.message
      console.error('Error updating customer tags:', err)
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

  function clearSelectedCustomer() {
    selectedCustomer.value = null
  }

  return {
    // State
    customers,
    selectedCustomer,
    loading,
    error,
    pagination,
    filters,
    importProgress,
    exportProgress,
    timeline,
    selectedTags,

    // Getters
    filteredCustomers,
    customerById,

    // Actions
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addNote,
    addMachine,
    fetchCustomerMachines,
    fetchCustomerNotes,
    fetchCustomerServiceHistory,
    fetchCustomerSales,
    importCustomers,
    exportCustomers,
    updateCustomerStatus,
    fetchCustomerTimeline,
    generateCustomerReport,
    bulkUpdateTags,
    setFilters,
    setPagination,
    clearSelectedCustomer
  }
}) 