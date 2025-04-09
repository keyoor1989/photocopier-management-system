<template>
  <div class="dashboard-metrics">
    <div class="metrics-header">
      <h2>Dashboard Overview</h2>
      <div class="date-range">
        <DateRangePicker v-model="dateRange" @update="fetchMetrics" />
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button @click="fetchMetrics" class="retry-btn">
          <i class="fas fa-sync-alt"></i>
          Retry
        </button>
      </div>
    </div>

    <div v-else class="metrics-grid">
      <!-- Service Metrics -->
      <div class="metric-card">
        <div class="metric-header">
          <h3>Service Tickets</h3>
          <i class="fas fa-tools"></i>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ metrics.serviceTickets.total }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.serviceTickets.change)">
            <i :class="getChangeIcon(metrics.serviceTickets.change)"></i>
            {{ Math.abs(metrics.serviceTickets.change) }}%
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span class="label">Open</span>
            <span class="value">{{ metrics.serviceTickets.open }}</span>
          </div>
          <div class="detail-item">
            <span class="label">In Progress</span>
            <span class="value">{{ metrics.serviceTickets.inProgress }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Completed</span>
            <span class="value">{{ metrics.serviceTickets.completed }}</span>
          </div>
        </div>
      </div>

      <!-- Machine Metrics -->
      <div class="metric-card">
        <div class="metric-header">
          <h3>Machines</h3>
          <i class="fas fa-print"></i>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ metrics.machines.total }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.machines.change)">
            <i :class="getChangeIcon(metrics.machines.change)"></i>
            {{ Math.abs(metrics.machines.change) }}%
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span class="label">Active</span>
            <span class="value">{{ metrics.machines.active }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Under Service</span>
            <span class="value">{{ metrics.machines.underService }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Retired</span>
            <span class="value">{{ metrics.machines.retired }}</span>
          </div>
        </div>
      </div>

      <!-- Inventory Metrics -->
      <div class="metric-card">
        <div class="metric-header">
          <h3>Inventory</h3>
          <i class="fas fa-boxes"></i>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ metrics.inventory.total }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.inventory.change)">
            <i :class="getChangeIcon(metrics.inventory.change)"></i>
            {{ Math.abs(metrics.inventory.change) }}%
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span class="label">In Stock</span>
            <span class="value">{{ metrics.inventory.inStock }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Low Stock</span>
            <span class="value">{{ metrics.inventory.lowStock }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Out of Stock</span>
            <span class="value">{{ metrics.inventory.outOfStock }}</span>
          </div>
        </div>
      </div>

      <!-- Revenue Metrics -->
      <div class="metric-card">
        <div class="metric-header">
          <h3>Revenue</h3>
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="metric-content">
          <div class="metric-value">${{ formatNumber(metrics.revenue.total) }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.revenue.change)">
            <i :class="getChangeIcon(metrics.revenue.change)"></i>
            {{ Math.abs(metrics.revenue.change) }}%
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span class="label">Service</span>
            <span class="value">${{ formatNumber(metrics.revenue.service) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Parts</span>
            <span class="value">${{ formatNumber(metrics.revenue.parts) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Machines</span>
            <span class="value">${{ formatNumber(metrics.revenue.machines) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h3>Service Tickets Trend</h3>
        <div class="chart">
          <LineChart :data="serviceTicketsChartData" />
        </div>
      </div>

      <div class="chart-card">
        <h3>Revenue Breakdown</h3>
        <div class="chart">
          <PieChart :data="revenueChartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

const dashboardStore = useDashboardStore()
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)),
  end: new Date()
})
const loading = ref(false)
const error = ref(null)

const metrics = ref({
  serviceTickets: {
    total: 0,
    change: 0,
    open: 0,
    inProgress: 0,
    completed: 0
  },
  machines: {
    total: 0,
    change: 0,
    active: 0,
    underService: 0,
    retired: 0
  },
  inventory: {
    total: 0,
    change: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  },
  revenue: {
    total: 0,
    change: 0,
    service: 0,
    parts: 0,
    machines: 0
  }
})

const serviceTicketsChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Open',
      data: [12, 19, 3, 5, 2, 3, 7],
      borderColor: '#ef4444',
      tension: 0.1
    },
    {
      label: 'In Progress',
      data: [7, 11, 5, 8, 3, 7, 4],
      borderColor: '#f59e0b',
      tension: 0.1
    },
    {
      label: 'Completed',
      data: [15, 12, 6, 9, 4, 2, 8],
      borderColor: '#10b981',
      tension: 0.1
    }
  ]
}))

const revenueChartData = computed(() => ({
  labels: ['Service', 'Parts', 'Machines'],
  datasets: [
    {
      data: [45, 30, 25],
      backgroundColor: ['#6366f1', '#f59e0b', '#10b981']
    }
  ]
}))

const getChangeClass = (change) => ({
  'positive': change > 0,
  'negative': change < 0
})

const getChangeIcon = (change) => ({
  'fas fa-arrow-up': change > 0,
  'fas fa-arrow-down': change < 0
})

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(value)
}

const fetchMetrics = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await dashboardStore.fetchMetrics(dateRange.value)
    metrics.value = data
  } catch (err) {
    error.value = err.message || 'Failed to fetch metrics'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMetrics()
})
</script>

<style scoped>
.dashboard-metrics {
  padding: 1.5rem;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.metrics-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s linear infinite;
}

.error-message {
  text-align: center;
  color: #ef4444;
}

.error-message i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  background-color: #4f46e5;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.metric-header i {
  font-size: 1.25rem;
  color: #6366f1;
}

.metric-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}

.metric-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item .label {
  font-size: 0.75rem;
  color: #6b7280;
}

.detail-item .value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.chart-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.chart {
  height: 300px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .dashboard-metrics {
    padding: 1rem;
  }

  .metrics-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style> 