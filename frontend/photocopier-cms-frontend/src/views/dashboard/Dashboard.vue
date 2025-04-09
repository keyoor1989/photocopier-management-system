<template>
  <div class="dashboard">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div class="dashboard-header">
      <h1><i class="fas fa-chart-line"></i> Dashboard</h1>
      <div class="date-controls">
        <div class="filter-bar">
          <span class="filter-label">Time Period:</span>
          <select v-model="selectedTimeFilter" class="filter-select" @change="handleTimeFilterChange">
            <option v-for="(label, value) in timeFilterOptions" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>
        <button 
          class="refresh-btn" 
          :class="{ loading: loading }"
          @click="refreshDashboardData" 
          :disabled="loading"
          title="Refresh data"
        >
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- KPI Cards -->
      <div class="kpi-cards">
        <div class="dashboard-card service-card">
          <h3><i class="fas fa-ticket-alt"></i> Service Tickets</h3>
          <div v-if="loadingServiceStats" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else>
            <div class="metric-value">{{ serviceStats.total }}</div>
            <div class="metric-details">
              <div><i class="fas fa-circle open-status"></i> Open: {{ serviceStats.open }}</div>
              <div><i class="fas fa-circle pending-status"></i> Pending: {{ serviceStats.pending }}</div>
              <div><i class="fas fa-circle resolved-status"></i> Resolved: {{ serviceStats.resolved }}</div>
            </div>
          </div>
        </div>

        <div class="dashboard-card machine-card">
          <h3><i class="fas fa-print"></i> Machines</h3>
          <div v-if="loadingMachineStats" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else>
            <div class="metric-value">{{ machineStats.total }}</div>
            <div class="metric-details">
              <div><i class="fas fa-circle operational-status"></i> Operational: {{ machineStats.operational }}</div>
              <div><i class="fas fa-circle maintenance-status"></i> Maintenance: {{ machineStats.maintenance }}</div>
              <div><i class="fas fa-circle offline-status"></i> Offline: {{ machineStats.offline }}</div>
            </div>
          </div>
        </div>

        <div class="dashboard-card inventory-card">
          <h3><i class="fas fa-boxes"></i> Inventory</h3>
          <div v-if="loadingInventoryStats" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else>
            <div class="metric-value">{{ inventoryStats.total }}</div>
            <div class="metric-details">
              <div><i class="fas fa-circle low-stock-status"></i> Low Stock: {{ inventoryStats.lowStock }}</div>
              <div><i class="fas fa-circle on-order-status"></i> On Order: {{ inventoryStats.onOrder }}</div>
            </div>
          </div>
        </div>

        <div class="dashboard-card revenue-card">
          <h3><i class="fas fa-dollar-sign"></i> Revenue</h3>
          <div v-if="loadingRevenueStats" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else>
            <div class="metric-value">{{ formatCurrency(revenueStats.total) }}</div>
            <div class="metric-details">
              <div><i class="fas fa-calendar-day"></i> MTD: {{ formatCurrency(revenueStats.mtd) }}</div>
              <div><i class="fas fa-calendar-alt"></i> YTD: {{ formatCurrency(revenueStats.ytd) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="dashboard-card">
          <div class="section-header">
            <h2><i class="fas fa-chart-bar"></i> Sales Performance</h2>
            <router-link to="/reports/sales" class="view-all">
              View Details <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div v-if="loadingSalesChart" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="salesChartError" class="error-message">
            {{ salesChartError }}
          </div>
          <div v-else class="chart-container">
            <!-- Sales Chart Component would go here -->
            <div class="placeholder-chart">
              <i class="fas fa-chart-line chart-icon"></i>
              <span>Sales Chart</span>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="section-header">
            <h2><i class="fas fa-tools"></i> Service Requests</h2>
            <router-link to="/reports/service" class="view-all">
              View Details <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div v-if="loadingServiceChart" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="serviceChartError" class="error-message">
            {{ serviceChartError }}
          </div>
          <div v-else class="chart-container">
            <!-- Service Chart Component would go here -->
            <div class="placeholder-chart">
              <i class="fas fa-chart-bar chart-icon"></i>
              <span>Service Chart</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activities and Alerts -->
      <div class="activities-alerts">
        <div class="dashboard-card">
          <div class="section-header">
            <h2><i class="fas fa-history"></i> Recent Activities</h2>
            <router-link to="/activities" class="view-all">
              View All <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div v-if="loadingActivities" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="activitiesError" class="error-message">
            {{ activitiesError }}
          </div>
          <div v-else-if="activities.length === 0" class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>No recent activities found.</p>
          </div>
          <div v-else class="activities-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-description">{{ activity.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="alerts-header">
            <h2><i class="fas fa-bell"></i> Alerts</h2>
            <button 
              v-if="alerts.length > 0" 
              class="dismiss-all" 
              @click="dismissAllAlerts"
            >
              Dismiss All
            </button>
          </div>
          <div v-if="loadingAlerts" class="content-loader">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="alertsError" class="error-message">
            {{ alertsError }}
          </div>
          <div v-else-if="alerts.length === 0" class="empty-state">
            <i class="fas fa-check-circle"></i>
            <p>No alerts at this time.</p>
          </div>
          <div v-else class="alerts-list">
            <div v-for="alert in alerts" :key="alert.id" class="alert-item">
              <div :class="['alert-icon', alert.type]">
                <i :class="getAlertIcon(alert.type)"></i>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-message">{{ alert.message }}</div>
                <div class="alert-actions">
                  <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
                  <div>
                    <button 
                      v-if="alert.actionUrl" 
                      class="alert-action-btn"
                      @click="handleAlertAction(alert)"
                    >
                      {{ alert.actionText || 'View' }}
                    </button>
                    <button class="alert-dismiss" @click="dismissAlert(alert.id)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useToast } from 'vue-toastification'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import KPICard from '@/components/reports/KPICard.vue'
import ServiceChart from '@/components/charts/ServiceChart.vue'
import SalesChart from '@/components/charts/SalesChart.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'

const dashboardStore = useDashboardStore()
const toast = useToast()

const loading = ref(false)
const error = ref(null)
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)),
  end: new Date()
})

// Loading states
const loadingServiceStats = ref(false)
const loadingMachineStats = ref(false)
const loadingInventoryStats = ref(false)
const loadingRevenueStats = ref(false)
const loadingSalesChart = ref(false)
const loadingServiceChart = ref(false)
const loadingActivities = ref(false)
const loadingAlerts = ref(false)

// Error states
const salesChartError = ref(null)
const serviceChartError = ref(null)
const activitiesError = ref(null)
const alertsError = ref(null)

const metrics = ref({
  serviceTickets: {
    total: 0,
    change: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    averageResolutionTime: 0
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
  },
  customers: {
    satisfaction: 0,
    total: 0,
    active: 0
  }
})

// Computed properties for stats
const serviceStats = computed(() => ({
  total: metrics.value?.serviceTickets?.total || 0,
  open: metrics.value?.serviceTickets?.open || 0,
  pending: metrics.value?.serviceTickets?.inProgress || 0,
  resolved: metrics.value?.serviceTickets?.resolved || 0
}))

const machineStats = computed(() => ({
  total: metrics.value?.machines?.total || 0,
  operational: metrics.value?.machines?.active || 0,
  maintenance: metrics.value?.machines?.maintenance || 0,
  offline: metrics.value?.machines?.outOfService || 0
}))

const inventoryStats = computed(() => ({
  total: metrics.value?.inventory?.totalItems || 0,
  lowStock: metrics.value?.inventory?.lowStock || 0,
  onOrder: 0 // This isn't available in the metrics, so defaulting to 0
}))

const revenueStats = computed(() => ({
  total: metrics.value?.revenue?.total || 0,
  mtd: metrics.value?.revenue?.monthly || 0,
  ytd: metrics.value?.revenue?.yearToDate || 0
}))

const serviceData = ref({
  labels: [],
  tickets: [],
  resolved: []
})
const salesData = ref([])
const activities = ref([])
const alerts = ref([])
const servicePerformance = ref({})
const inventoryStatus = ref({})
const customerInsights = ref({})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

const getAlertIcon = (type) => {
  const icons = {
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    success: 'fas fa-check-circle',
    info: 'fas fa-info-circle'
  }
  return icons[type] || 'fas fa-info-circle'
}

// Helper to determine the change type (positive, negative, neutral)
const getChangeType = (change, invert = false) => {
  if (!change) return 'neutral'
  
  if (invert) {
    return change > 0 ? 'negative' : 'positive'
  }
  
  return change > 0 ? 'positive' : 'negative'
}

const fetchData = async () => {
  loading.value = true;
  loadingServiceStats.value = true;
  loadingMachineStats.value = true;
  loadingInventoryStats.value = true;
  loadingRevenueStats.value = true;
  loadingSalesChart.value = true;
  loadingServiceChart.value = true;
  loadingActivities.value = true;
  loadingAlerts.value = true;
  
  error.value = null;
  salesChartError.value = null;
  serviceChartError.value = null;
  activitiesError.value = null;
  alertsError.value = null;

  try {
    const [
      metricsData,
      serviceChartData,
      salesChartData,
      activityData,
      alertData,
      servicePerformanceData,
      inventoryStatusData,
      customerInsightsData
    ] = await Promise.all([
      dashboardStore.fetchMetrics(dateRange.value),
      dashboardStore.fetchServiceChartData(dateRange.value),
      dashboardStore.fetchSalesChartData(dateRange.value),
      dashboardStore.fetchRecentActivities(),
      dashboardStore.fetchAlerts(),
      dashboardStore.fetchServicePerformance(dateRange.value),
      dashboardStore.fetchInventoryStatus(dateRange.value),
      dashboardStore.fetchCustomerInsights(dateRange.value)
    ])

    metrics.value = metricsData?.data || {}
    serviceData.value = serviceChartData?.data || { labels: [], tickets: [], resolved: [] }
    salesData.value = salesChartData?.data || []
    activities.value = activityData?.data || []
    alerts.value = alertData?.data || []
    servicePerformance.value = servicePerformanceData?.data || {}
    inventoryStatus.value = inventoryStatusData?.data || {}
    customerInsights.value = customerInsightsData?.data || {}
  } catch (err) {
    error.value = err.message || 'Failed to fetch dashboard data'
    toast.error(error.value)
  } finally {
    loading.value = false;
    loadingServiceStats.value = false;
    loadingMachineStats.value = false;
    loadingInventoryStats.value = false;
    loadingRevenueStats.value = false;
    loadingSalesChart.value = false;
    loadingServiceChart.value = false;
    loadingActivities.value = false;
    loadingAlerts.value = false;
  }
}

const refreshDashboardData = () => {
  fetchData();
}

const dismissAlert = async (alertId) => {
  try {
    await dashboardStore.dismissAlert(alertId)
    alerts.value = alerts.value.filter(alert => alert.id !== alertId)
    toast.success('Alert dismissed')
  } catch (err) {
    toast.error('Failed to dismiss alert')
  }
}

const dismissAllAlerts = async () => {
  try {
    await dashboardStore.dismissAllAlerts()
    alerts.value = []
    toast.success('All alerts dismissed')
  } catch (err) {
    toast.error('Failed to dismiss alerts')
  }
}

const handleAlertAction = (alert) => {
  if (alert.action && alert.action.url) {
    window.location.href = alert.action.url
  }
}

// Filter options for time period charts
const timeFilterOptions = computed(() => ({
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly'
}))

const selectedTimeFilter = ref('monthly')

const handleTimeFilterChange = () => {
  // In a real implementation, you would refetch data based on the new filter
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 60px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard-header h1 i {
  color: #6366f1;
}

.date-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: #d1d5db;
}

.filter-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.375rem;
  border: none;
  background-color: #f3f4f6;
  color: #6366f1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background-color: #e5e7eb;
  transform: rotate(15deg);
}

.refresh-btn.loading i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.activities-alerts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.dashboard-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01);
  transform: translateY(-2px);
}

.dashboard-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.dashboard-card h3::before {
  display: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.section-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header h2 i,
.alerts-header h2 i {
  color: #6366f1;
  font-size: 0.875rem;
}

.view-all {
  text-decoration: none;
  color: #6366f1;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: #4f46e5;
  text-decoration: underline;
}

.dismiss-all {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

.dismiss-all:hover {
  color: #4f46e5;
  text-decoration: underline;
}

.content-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.content-loader .spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25rem;
  color: #6366f1;
  animation: spin 1s linear infinite;
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.chart-container {
  min-height: 250px;
}

.placeholder-chart {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  border: 1px dashed #d1d5db;
  flex-direction: column;
}

.chart-icon {
  font-size: 2.5rem;
  color: #d1d5db;
  margin-bottom: 0.75rem;
}

.activities-list, .alerts-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.activities-list::-webkit-scrollbar, .alerts-list::-webkit-scrollbar {
  width: 6px;
}

.activities-list::-webkit-scrollbar-track, .alerts-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.activities-list::-webkit-scrollbar-thumb, .alerts-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.activities-list::-webkit-scrollbar-thumb:hover, .alerts-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.activity-item, .alert-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  gap: 0.75rem;
  transition: background-color 0.2s ease;
}

.activity-item:hover, .alert-item:hover {
  background-color: rgba(249, 250, 251, 0.5);
}

.activity-item:last-child, .alert-item:last-child {
  border-bottom: none;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.activity-content {
  flex: 1;
}

.activity-title, .alert-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #111827;
}

.activity-description, .alert-message {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.4;
}

.alert-icon {
  width: 1.75rem;
  height: 1.75rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-icon.warning {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.alert-icon.error {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.alert-icon.info {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.alert-icon.success {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.alert-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.alert-action-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
  transition: color 0.2s ease;
}

.alert-action-btn:hover {
  color: #4f46e5;
  text-decoration: underline;
}

.alert-dismiss {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  font-size: 0.75rem;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.alert-dismiss:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #111827;
}

.metric-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.metric-details div {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message {
  padding: 1rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message::before {
  content: '⚠️';
  font-size: 1rem;
}

.service-card {
  border-top: 3px solid #3b82f6;
}

.machine-card {
  border-top: 3px solid #10b981;
}

.inventory-card {
  border-top: 3px solid #f59e0b;
}

.revenue-card {
  border-top: 3px solid #6366f1;
}

.service-card h3 i {
  color: #3b82f6;
  margin-right: 0.5rem;
}

.machine-card h3 i {
  color: #10b981;
  margin-right: 0.5rem;
}

.inventory-card h3 i {
  color: #f59e0b;
  margin-right: 0.5rem;
}

.revenue-card h3 i {
  color: #6366f1;
  margin-right: 0.5rem;
}

.open-status {
  color: #3b82f6;
  font-size: 8px;
}

.pending-status {
  color: #f59e0b;
  font-size: 8px;
}

.resolved-status {
  color: #10b981;
  font-size: 8px;
}

.operational-status {
  color: #10b981;
  font-size: 8px;
}

.maintenance-status {
  color: #f59e0b;
  font-size: 8px;
}

.offline-status {
  color: #ef4444;
  font-size: 8px;
}

.low-stock-status {
  color: #ef4444;
  font-size: 8px;
}

.on-order-status {
  color: #3b82f6;
  font-size: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9ca3af;
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 1200px) {
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section,
  .activities-alerts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .date-controls {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .kpi-cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard {
    padding: 1rem;
  }
}
</style> 