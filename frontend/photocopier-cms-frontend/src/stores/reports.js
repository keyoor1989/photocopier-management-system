import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import reportsService from '@/services/reports'

export const useReportsStore = defineStore('reports', () => {
  // State
  const dashboardMetrics = ref(null)
  const currentReport = ref(null)
  const reportHistory = ref([])
  const savedConfigs = ref([])
  const scheduledReports = ref([])
  const loading = ref(false)
  const error = ref(null)
  const reportCache = ref(new Map())
  const alertHistory = ref([])
  const benchmarkData = ref(null)
  const filters = ref({
    dateRange: {
      start: null,
      end: null
    },
    location: null,
    category: null,
    customer: null,
    employee: null,
    product: null
  })

  // Cache configuration
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  const MAX_CACHE_SIZE = 20

  // Getters
  const recentReports = computed(() => {
    return reportHistory.value
      .slice()
      .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
      .slice(0, 5)
  })

  const favoriteReports = computed(() => {
    return savedConfigs.value.filter(config => config.isFavorite)
  })

  const upcomingScheduledReports = computed(() => {
    const now = new Date()
    return scheduledReports.value
      .filter(report => new Date(report.nextRunDate) > now)
      .sort((a, b) => new Date(a.nextRunDate) - new Date(b.nextRunDate))
  })

  const alertsByPriority = computed(() => {
    const priorities = {}
    alertHistory.value.forEach(alert => {
      const priority = alert.priority || 'normal'
      priorities[priority] = (priorities[priority] || 0) + 1
    })
    return priorities
  })

  // Actions
  async function fetchDashboardMetrics() {
    loading.value = true
    error.value = null
    
    try {
      const metrics = await reportsService.getDashboardMetrics(filters.value)
      dashboardMetrics.value = metrics
      return metrics
    } catch (err) {
      error.value = err.message || 'Failed to fetch dashboard metrics'
      console.error('Error fetching dashboard metrics:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generateReport(type, params = {}) {
    loading.value = true
    error.value = null
    
    try {
      let report
      switch (type) {
        case 'sales':
          report = await reportsService.generateSalesReport(params)
          break
        case 'service':
          report = await reportsService.generateServiceReport(params)
          break
        case 'inventory':
          report = await reportsService.generateInventoryReport(params)
          break
        case 'financial':
          report = await reportsService.generateFinancialReport(params)
          break
        case 'custom':
          report = await reportsService.generateCustomReport(params)
          break
        default:
          throw new Error('Invalid report type')
      }
      
      currentReport.value = report
      addToReportHistory(report)
      cacheReport(type, params, report)
      return report
    } catch (err) {
      error.value = err.message || 'Failed to generate report'
      console.error('Error generating report:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function exportReport(reportId, format, options = {}) {
    loading.value = true
    error.value = null
    
    try {
      let data
      switch (format.toLowerCase()) {
        case 'pdf':
          data = await reportsService.exportAsPDF(reportId, options)
          break
        case 'excel':
          data = await reportsService.exportAsExcel(reportId, options)
          break
        case 'csv':
          data = await reportsService.exportAsCSV(reportId, options)
          break
        default:
          throw new Error('Invalid export format')
      }
      return data
    } catch (err) {
      error.value = err.message || 'Failed to export report'
      console.error('Error exporting report:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveConfig(config) {
    loading.value = true
    error.value = null
    
    try {
      const savedConfig = await reportsService.saveReportConfig(config)
      savedConfigs.value.push(savedConfig)
      return savedConfig
    } catch (err) {
      error.value = err.message || 'Failed to save report configuration'
      console.error('Error saving report configuration:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSavedConfigs() {
    loading.value = true
    error.value = null
    
    try {
      const configs = await reportsService.getSavedConfigs()
      savedConfigs.value = configs
      return configs
    } catch (err) {
      error.value = err.message || 'Failed to fetch saved configurations'
      console.error('Error fetching saved configurations:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function scheduleReport(schedule) {
    loading.value = true
    error.value = null
    
    try {
      const scheduledReport = await reportsService.scheduleReport(schedule)
      scheduledReports.value.push(scheduledReport)
      return scheduledReport
    } catch (err) {
      error.value = err.message || 'Failed to schedule report'
      console.error('Error scheduling report:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchScheduledReports() {
    loading.value = true
    error.value = null
    
    try {
      const reports = await reportsService.getScheduledReports()
      scheduledReports.value = reports
      return reports
    } catch (err) {
      error.value = err.message || 'Failed to fetch scheduled reports'
      console.error('Error fetching scheduled reports:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchReportHistory() {
    loading.value = true
    error.value = null
    
    try {
      const history = await reportsService.getReportHistory()
      reportHistory.value = history
      return history
    } catch (err) {
      error.value = err.message || 'Failed to fetch report history'
      console.error('Error fetching report history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBenchmarkData(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const data = await reportsService.getBenchmarkData(params)
      benchmarkData.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch benchmark data'
      console.error('Error fetching benchmark data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function setAlertThresholds(thresholds) {
    loading.value = true
    error.value = null
    
    try {
      await reportsService.setAlertThresholds(thresholds)
    } catch (err) {
      error.value = err.message || 'Failed to set alert thresholds'
      console.error('Error setting alert thresholds:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAlertHistory() {
    loading.value = true
    error.value = null
    
    try {
      const history = await reportsService.getAlertHistory()
      alertHistory.value = history
      return history
    } catch (err) {
      error.value = err.message || 'Failed to fetch alert history'
      console.error('Error fetching alert history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper functions
  function addToReportHistory(report) {
    reportHistory.value.unshift({
      ...report,
      generatedAt: new Date().toISOString()
    })
  }

  function cacheReport(type, params, report) {
    const cacheKey = JSON.stringify({ type, params })
    const cacheEntry = {
      data: report,
      timestamp: Date.now()
    }
    
    // Remove oldest entries if cache is full
    if (reportCache.value.size >= MAX_CACHE_SIZE) {
      const oldestKey = Array.from(reportCache.value.keys())[0]
      reportCache.value.delete(oldestKey)
    }
    
    reportCache.value.set(cacheKey, cacheEntry)
  }

  function getCachedReport(type, params) {
    const cacheKey = JSON.stringify({ type, params })
    const cacheEntry = reportCache.value.get(cacheKey)
    
    if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION) {
      return cacheEntry.data
    }
    
    return null
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearCache() {
    reportCache.value.clear()
  }

  function clearCurrentReport() {
    currentReport.value = null
  }

  return {
    // State
    dashboardMetrics,
    currentReport,
    reportHistory,
    savedConfigs,
    scheduledReports,
    loading,
    error,
    alertHistory,
    benchmarkData,
    filters,

    // Getters
    recentReports,
    favoriteReports,
    upcomingScheduledReports,
    alertsByPriority,

    // Actions
    fetchDashboardMetrics,
    generateReport,
    exportReport,
    saveConfig,
    fetchSavedConfigs,
    scheduleReport,
    fetchScheduledReports,
    fetchReportHistory,
    fetchBenchmarkData,
    setAlertThresholds,
    fetchAlertHistory,
    setFilters,
    clearCache,
    clearCurrentReport,
    getCachedReport
  }
}) 