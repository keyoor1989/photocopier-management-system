<template>
  <div class="inventory-report">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>Inventory Report</h1>
      <div class="actions">
        <div class="date-range">
          <input type="date" v-model="startDate" />
          <span>to</span>
          <input type="date" v-model="endDate" />
        </div>
        <button class="btn btn-primary" @click="generateReport">
          <i class="fas fa-sync"></i> Generate
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading inventory data...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchData" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else class="report-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Total Items</h3>
          <div class="metric-value">{{ metrics.totalItems }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.itemsChange)">
            {{ formatChange(metrics.itemsChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Total Value</h3>
          <div class="metric-value">{{ formatCurrency(metrics.totalValue) }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.valueChange)">
            {{ formatChange(metrics.valueChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Low Stock Items</h3>
          <div class="metric-value">{{ metrics.lowStockItems }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.lowStockChange)">
            {{ formatChange(metrics.lowStockChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Stock Turnover</h3>
          <div class="metric-value">{{ metrics.stockTurnover }}x</div>
          <div class="metric-change" :class="getChangeClass(metrics.turnoverChange)">
            {{ formatChange(metrics.turnoverChange) }}
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>Stock Levels</h3>
          <div class="chart-container">
            <canvas ref="stockChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Category Distribution</h3>
          <div class="chart-container">
            <canvas ref="categoryChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Stock Movements</h3>
          <div class="chart-container">
            <canvas ref="movementChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Value Distribution</h3>
          <div class="chart-container">
            <canvas ref="valueChart"></canvas>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3>Low Stock Items</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>Reorder Point</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in lowStockItems" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.currentStock }}</td>
                <td>{{ item.minimumStock }}</td>
                <td>{{ item.reorderPoint }}</td>
                <td>
                  <span class="status" :class="getStockStatus(item.currentStock, item.minimumStock)">
                    {{ getStockStatusText(item.currentStock, item.minimumStock) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { Chart } from 'chart.js/auto'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const startDate = ref(format(new Date(), 'yyyy-MM-dd'))
const endDate = ref(format(new Date(), 'yyyy-MM-dd'))

const metrics = ref({
  totalItems: 0,
  itemsChange: 0,
  totalValue: 0,
  valueChange: 0,
  lowStockItems: 0,
  lowStockChange: 0,
  stockTurnover: 0,
  turnoverChange: 0
})

const lowStockItems = ref([])
const stockChart = ref(null)
const categoryChart = ref(null)
const movementChart = ref(null)
const valueChart = ref(null)

const goBack = () => {
  router.back()
}

const generateReport = () => {
  fetchData()
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatChange = (change) => {
  if (change > 0) return `+${change}%`
  if (change < 0) return `${change}%`
  return '0%'
}

const getChangeClass = (change) => {
  if (change > 0) return 'positive'
  if (change < 0) return 'negative'
  return 'neutral'
}

const getStockStatus = (current, minimum) => {
  if (current <= minimum) return 'critical'
  if (current <= minimum * 1.5) return 'warning'
  return 'healthy'
}

const getStockStatusText = (current, minimum) => {
  if (current <= minimum) return 'Critical'
  if (current <= minimum * 1.5) return 'Low'
  return 'Healthy'
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch inventory data
    // For now, using mock data
    metrics.value = {
      totalItems: 250,
      itemsChange: 5,
      totalValue: 125000,
      valueChange: 8,
      lowStockItems: 12,
      lowStockChange: -15,
      stockTurnover: 3.5,
      turnoverChange: 10
    }

    lowStockItems.value = [
      {
        id: 1,
        name: 'Toner Cartridge',
        category: 'Supplies',
        currentStock: 5,
        minimumStock: 10,
        reorderPoint: 15
      },
      {
        id: 2,
        name: 'Fuser Unit',
        category: 'Parts',
        currentStock: 2,
        minimumStock: 5,
        reorderPoint: 8
      }
    ]

    renderCharts()
  } catch (err) {
    error.value = 'Failed to load inventory data. Please try again.'
    console.error('Error fetching inventory data:', err)
  } finally {
    loading.value = false
  }
}

const renderCharts = () => {
  // Stock Levels Chart
  new Chart(stockChart.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Stock Level',
          data: [65, 59, 80, 81, 56, 55],
          borderColor: '#6366f1',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  })

  // Category Distribution Chart
  new Chart(categoryChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Supplies', 'Parts', 'Accessories', 'Consumables'],
      datasets: [
        {
          data: [40, 30, 20, 10],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  })

  // Stock Movements Chart
  new Chart(movementChart.value, {
    type: 'bar',
    data: {
      labels: ['In', 'Out', 'Adjustments', 'Returns'],
      datasets: [
        {
          label: 'Movements',
          data: [150, 120, 30, 20],
          backgroundColor: '#6366f1'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  })

  // Value Distribution Chart
  new Chart(valueChart.value, {
    type: 'bar',
    data: {
      labels: ['High Value', 'Medium Value', 'Low Value'],
      datasets: [
        {
          label: 'Items',
          data: [20, 50, 180],
          backgroundColor: '#6366f1'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  })
}

watch([startDate, endDate], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.inventory-report {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #1f2937;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.date-range {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.date-range input {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metric-card h3 {
  margin: 0 0 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
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

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin: 0 0 1rem;
  color: #1f2937;
}

.chart-container {
  height: 300px;
}

.table-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-section h3 {
  margin: 0 0 1rem;
  color: #1f2937;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 500;
  color: #6b7280;
  background-color: #f9fafb;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status.critical {
  background-color: #fee2e2;
  color: #ef4444;
}

.status.warning {
  background-color: #fef3c7;
  color: #f59e0b;
}

.status.healthy {
  background-color: #ecfdf5;
  color: #10b981;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error {
  color: #ef4444;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #4f46e5;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .inventory-report {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .date-range {
    width: 100%;
    justify-content: space-between;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 