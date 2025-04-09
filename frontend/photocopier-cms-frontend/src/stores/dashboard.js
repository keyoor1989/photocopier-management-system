import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  // State with default values
  const loading = ref(false)
  const error = ref(null)
  const dateRange = ref({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  })

  // Dashboard Data with default values
  const stats = ref({
    totalPrinters: 0,
    activeCustomers: 0,
    pendingMaintenance: 0,
    alerts: 0
  })

  const salesData = ref([])
  const categoryData = ref([])
  const recentActivities = ref([])
  const alerts = ref([])
  const metrics = ref({
    serviceTickets: {
      total: 0,
      change: 0,
      open: 0,
      inProgress: 0,
      resolved: 0
    },
    machines: {
      total: 0,
      change: 0,
      active: 0,
      maintenance: 0,
      outOfService: 0
    },
    inventory: {
      totalItems: 0,
      change: 0,
      lowStock: 0,
      totalValue: 0
    },
    revenue: {
      total: 0,
      change: 0,
      service: 0,
      parts: 0
    }
  })

  const serviceChartData = ref({
    labels: [],
    datasets: []
  })

  const revenueChartData = ref({
    labels: [],
    datasets: []
  })

  // Add new state variables for additional dashboard sections
  const servicePerformance = ref({})
  const inventoryStatus = ref({})
  const customerInsights = ref({})

  // Getters with safe access
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value)
  const currentDateRange = computed(() => dateRange.value)
  const getStats = computed(() => stats.value || {})
  const getMetrics = computed(() => metrics.value || {})
  const getRecentActivities = computed(() => recentActivities.value || [])
  const getAlerts = computed(() => alerts.value || [])
  const getServiceChartData = computed(() => serviceChartData.value || { labels: [], datasets: [] })
  const getRevenueChartData = computed(() => revenueChartData.value || { labels: [], datasets: [] })

  // Add new getters for the additional dashboard data
  const getServicePerformance = computed(() => servicePerformance.value || {})
  const getInventoryStatus = computed(() => inventoryStatus.value || {})
  const getCustomerInsights = computed(() => customerInsights.value || {})

  // Helper Functions
  const makeApiCall = async (endpoint, params = {}) => {
    try {
      const response = await api.get(endpoint, { params })
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  const buildDateRangeParams = (customRange = null) => {
    const range = customRange || dateRange.value
    return {
      startDate: range?.start || dateRange.value.start,
      endDate: range?.end || dateRange.value.end
    }
  }

  const safeUpdateState = (stateRef, data, defaultValues = {}) => {
    if (!data) {
      stateRef.value = defaultValues
      return
    }
    stateRef.value = { ...defaultValues, ...data }
  }

  // Actions
  const setDateRange = (newRange) => {
    if (!newRange?.start || !newRange?.end) {
      console.warn('Invalid date range provided')
      return
    }
    dateRange.value = {
      start: new Date(newRange.start),
      end: new Date(newRange.end)
    }
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  // Data Fetching Functions with safe data handling
  const fetchOverviewStats = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/overview', params)
      safeUpdateState(stats, data?.stats, {
        totalPrinters: 0,
        activeCustomers: 0,
        pendingMaintenance: 0,
        alerts: 0
      })
      return data
    } catch (err) {
      setError('Failed to fetch overview stats')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchMetrics = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/metrics', params)
      safeUpdateState(metrics, data, {
        serviceTickets: { total: 0, change: 0, open: 0, inProgress: 0, resolved: 0 },
        machines: { total: 0, change: 0, active: 0, maintenance: 0, outOfService: 0 },
        inventory: { totalItems: 0, change: 0, lowStock: 0, totalValue: 0 },
        revenue: { total: 0, change: 0, service: 0, parts: 0 }
      })
      return data
    } catch (err) {
      setError('Failed to fetch metrics')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesChartData = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/sales-chart', params)
      safeUpdateState(revenueChartData, data, { labels: [], datasets: [] })
      return data
    } catch (err) {
      setError('Failed to fetch sales chart data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceChartData = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/service-chart', params)
      safeUpdateState(serviceChartData, data, { labels: [], datasets: [] })
      return data
    } catch (err) {
      setError('Failed to fetch service chart data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivities = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/activities', params)
      safeUpdateState(recentActivities, data, [])
      return data
    } catch (err) {
      setError('Failed to fetch recent activities')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchAlerts = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/alerts', params)
      safeUpdateState(alerts, data, [])
      return data
    } catch (err) {
      setError('Failed to fetch alerts')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add new data fetching functions for the enhanced dashboard
  const fetchServicePerformance = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/service-performance', params)
      safeUpdateState(servicePerformance, data, {})
      return data
    } catch (err) {
      setError('Failed to fetch service performance data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchInventoryStatus = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/inventory-status', params)
      safeUpdateState(inventoryStatus, data, {})
      return data
    } catch (err) {
      setError('Failed to fetch inventory status data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerInsights = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const params = buildDateRangeParams(customRange)
      const data = await makeApiCall('/dashboard/customer-insights', params)
      safeUpdateState(customerInsights, data, {})
      return data
    } catch (err) {
      setError('Failed to fetch customer insights data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update fetchAllDashboardData to include new data sections
  const fetchAllDashboardData = async (customRange = null) => {
    setLoading(true)
    clearError()
    try {
      const [
        overview, 
        metricsData, 
        salesChart, 
        serviceChart, 
        activities, 
        alertsData,
        servicePerformanceData,
        inventoryStatusData,
        customerInsightsData
      ] = await Promise.all([
        fetchOverviewStats(customRange),
        fetchMetrics(customRange),
        fetchSalesChartData(customRange),
        fetchServiceChartData(customRange),
        fetchRecentActivities(customRange),
        fetchAlerts(customRange),
        fetchServicePerformance(customRange),
        fetchInventoryStatus(customRange),
        fetchCustomerInsights(customRange)
      ])
      
      return {
        overview,
        metrics: metricsData,
        salesChart,
        serviceChart,
        activities,
        alerts: alertsData,
        servicePerformance: servicePerformanceData,
        inventoryStatus: inventoryStatusData,
        customerInsights: customerInsightsData
      }
    } catch (err) {
      setError('Failed to fetch dashboard data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Return store interface
  return {
    // State
    stats,
    salesData,
    categoryData,
    recentActivities,
    alerts,
    metrics,
    serviceChartData,
    revenueChartData,
    servicePerformance,
    inventoryStatus,
    customerInsights,

    // Getters
    isLoading,
    hasError,
    currentDateRange,
    getStats,
    getMetrics,
    getRecentActivities,
    getAlerts,
    getServiceChartData,
    getRevenueChartData,
    getServicePerformance, 
    getInventoryStatus,
    getCustomerInsights,

    // Actions
    setDateRange,
    fetchOverviewStats,
    fetchMetrics,
    fetchSalesChartData,
    fetchServiceChartData,
    fetchRecentActivities,
    fetchAlerts,
    fetchServicePerformance,
    fetchInventoryStatus,
    fetchCustomerInsights,
    fetchAllDashboardData,
    
    // Alert management
    dismissAlert: async (alertId) => {
      try {
        // In a real implementation, you would make an API call here
        console.log('Dismissing alert:', alertId);
        return true;
      } catch (err) {
        setError('Failed to dismiss alert');
        throw err;
      }
    },
    
    dismissAllAlerts: async () => {
      try {
        // In a real implementation, you would make an API call here
        console.log('Dismissing all alerts');
        return true;
      } catch (err) {
        setError('Failed to dismiss all alerts');
        throw err;
      }
    }
  }
}) 