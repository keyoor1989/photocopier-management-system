import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCustomers = async () => {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Failed to fetch customers')
      customers.value = await response.json()
      return customers.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customers:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCustomerMachines = async (customerId) => {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/customers/${customerId}/machines`)
      if (!response.ok) throw new Error('Failed to fetch customer machines')
      return await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customer machines:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCustomerById = (id) => {
    return customers.value.find(customer => customer.id === id)
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    fetchCustomerMachines,
    getCustomerById
  }
}) 