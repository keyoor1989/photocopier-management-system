import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalPrinters: 0,
    activeCustomers: 0,
    pendingMaintenance: 0,
    alerts: 0
  })

  const salesData = ref([])
  const categoryData = ref([])
  const recentActivity = ref([])

  async function fetchDashboardData() {
    try {
      const response = await api.get('/dashboard')
      const data = response.data

      stats.value = data.stats
      salesData.value = data.salesData
      categoryData.value = data.categoryData
      recentActivity.value = data.recentActivity

      return data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }

  async function fetchSalesData(period = 6) {
    try {
      const response = await api.get('/dashboard/sales', {
        params: { period }
      })
      salesData.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching sales data:', error)
      throw error
    }
  }

  async function fetchCategoryData() {
    try {
      const response = await api.get('/dashboard/categories')
      categoryData.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching category data:', error)
      throw error
    }
  }

  async function fetchRecentActivity() {
    try {
      const response = await api.get('/dashboard/activity')
      recentActivity.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      throw error
    }
  }

  return {
    stats,
    salesData,
    categoryData,
    recentActivity,
    fetchDashboardData,
    fetchSalesData,
    fetchCategoryData,
    fetchRecentActivity
  }
}) 