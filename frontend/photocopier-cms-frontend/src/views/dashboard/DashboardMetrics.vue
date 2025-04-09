<template>
  <div class="dashboard-metrics">
    <div class="metrics-header">
      <h2>Dashboard Overview</h2>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading metrics...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="fetchMetrics" class="retry-btn">
        Retry
      </button>
    </div>

    <div v-else class="metrics-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Service Tickets</h3>
          <div class="metric-value">{{ metrics.serviceTickets.total }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.serviceTickets.change)">
            {{ formatChange(metrics.serviceTickets.change) }}
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
              <span class="label">Resolved</span>
              <span class="value">{{ metrics.serviceTickets.resolved }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <h3>Machines</h3>
          <div class="metric-value">{{ metrics.machines.total }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.machines.change)">
            {{ formatChange(metrics.machines.change) }}
          </div>
          <div class="metric-details">
            <div class="detail-item">
              <span class="label">Active</span>
              <span class="value">{{ metrics.machines.active }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Under Maintenance</span>
              <span class="value">{{ metrics.machines.maintenance }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Out of Service</span>
              <span class="value">{{ metrics.machines.outOfService }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <h3>Inventory</h3>
          <div class="metric-value">{{ metrics.inventory.totalItems }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.inventory.change)">
            {{ formatChange(metrics.inventory.change) }}
          </div>
          <div class="metric-details">
            <div class="detail-item">
              <span class="label">Low Stock</span>
              <span class="value">{{ metrics.inventory.lowStock }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Total Value</span>
              <span class="value">{{ formatCurrency(metrics.inventory.totalValue) }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <h3>Revenue</h3>
          <div class="metric-value">{{ formatCurrency(metrics.revenue.total) }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.revenue.change)">
            {{ formatChange(metrics.revenue.change) }}
          </div>
          <div class="metric-details">
            <div class="detail-item">
              <span class="label">Service</span>
              <span class="value">{{ formatCurrency(metrics.revenue.service) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Parts</span>
              <span class="value">{{ formatCurrency(metrics.revenue.parts) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>Service Tickets Trend</h3>
          <ServiceChart :data="serviceChartData" />
        </div>
        <div class="chart-card">
          <h3>Revenue Breakdown</h3>
          <LineChart
            :labels="revenueChartData.labels"
            :datasets="revenueChartData.datasets"
            yAxisLabel="Revenue"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import ServiceChart from '@/components/charts/ServiceChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { formatCurrency, formatChange } from '@/utils/formatters'

const dashboardStore = useDashboardStore()
const dateRange = ref({ start: new Date(), end: new Date() })
const loading = ref(false)
const error = ref(null)
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
  tickets: [],
  resolved: []
})

const revenueChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Service Revenue',
      data: [],
      borderColor: '#6366f1'
    },
    {
      label: 'Parts Revenue',
      data: [],
      borderColor: '#10b981'
    }
  ]
})

const getChangeClass = (change) => {
  if (change > 0) return 'positive'
  if (change < 0) return 'negative'
  return 'neutral'
}

const fetchMetrics = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await dashboardStore.fetchMetrics({
      startDate: dateRange.value.start,
      endDate: dateRange.value.end
    })

    metrics.value = data.metrics
    serviceChartData.value = data.serviceChart
    revenueChartData.value = {
      labels: data.revenueChart.labels,
      datasets: [
        {
          label: 'Service Revenue',
          data: data.revenueChart.service,
          borderColor: '#6366f1'
        },
        {
          label: 'Parts Revenue',
          data: data.revenueChart.parts,
          borderColor: '#10b981'
        }
      ]
    }
  } catch (err) {
    error.value = 'Failed to load dashboard metrics'
    console.error('Error fetching metrics:', err)
  } finally {
    loading.value = false
  }
}

watch(dateRange, () => {
  fetchMetrics()
})

onMounted(() => {
  fetchMetrics()
})
</script>

<style scoped>
.dashboard-metrics {
  padding: 2rem;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.metrics-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loading-state i {
  font-size: 2rem;
  color: #6366f1;
}

.error-state {
  background-color: #fee2e2;
  border-radius: 8px;
  color: #ef4444;
}

.error-state i {
  font-size: 2rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #dc2626;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metric-card h3 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.metric-change {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}

.metric-change.neutral {
  color: #6b7280;
}

.metric-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-item .label {
  color: #6b7280;
}

.detail-item .value {
  font-weight: 500;
  color: #1f2937;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
}

.chart-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
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

  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 