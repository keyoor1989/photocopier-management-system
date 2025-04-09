<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-print"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.totalPrinters }}</h3>
          <p class="stat-label">Total Printers</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.activeCustomers }}</h3>
          <p class="stat-label">Active Customers</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tools"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.pendingMaintenance }}</h3>
          <p class="stat-label">Pending Maintenance</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.alerts }}</h3>
          <p class="stat-label">Active Alerts</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="card-header">
          <h3>Monthly Sales</h3>
          <div class="card-actions">
            <select v-model="salesPeriod" class="select-period">
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
            </select>
          </div>
        </div>
        <SalesChart :data="salesData" />
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3>Printer Categories</h3>
        </div>
        <CategoryChart :data="categoryData" />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="card-header">
        <h3>Recent Activity</h3>
        <button class="btn-link">View All</button>
      </div>
      
      <div class="activity-list">
        <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.description }}</p>
            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import SalesChart from '@/components/charts/SalesChart.vue'
import CategoryChart from '@/components/charts/CategoryChart.vue'

const dashboardStore = useDashboardStore()
const salesPeriod = ref(6)

const stats = ref({
  totalPrinters: 0,
  activeCustomers: 0,
  pendingMaintenance: 0,
  alerts: 0
})

const salesData = ref([])
const categoryData = ref([])
const recentActivity = ref([])

const getActivityIcon = (type) => {
  const icons = {
    maintenance: 'fas fa-tools',
    sale: 'fas fa-shopping-cart',
    alert: 'fas fa-exclamation-circle',
    customer: 'fas fa-user'
  }
  return icons[type] || 'fas fa-info-circle'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

onMounted(async () => {
  try {
    const data = await dashboardStore.fetchDashboardData()
    stats.value = data.stats
    salesData.value = data.salesData
    categoryData.value = data.categoryData
    recentActivity.value = data.recentActivity
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.select-period {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #4b5563;
}

.activity-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-link {
  color: #3b82f6;
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f9fafb;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-icon.maintenance {
  background-color: #3b82f6;
}

.activity-icon.sale {
  background-color: #10b981;
}

.activity-icon.alert {
  background-color: #ef4444;
}

.activity-icon.customer {
  background-color: #8b5cf6;
}

.activity-content {
  flex-grow: 1;
}

.activity-text {
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 