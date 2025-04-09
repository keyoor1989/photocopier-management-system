<template>
  <div class="sales-report">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>Sales Report</h1>
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
      <i class="fas fa-spinner fa-spin"></i> Loading sales data...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchData" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else class="report-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Total Revenue</h3>
          <div class="metric-value">{{ formatCurrency(metrics.totalRevenue) }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.revenueChange)">
            {{ formatChange(metrics.revenueChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Units Sold</h3>
          <div class="metric-value">{{ metrics.totalUnits }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.unitsChange)">
            {{ formatChange(metrics.unitsChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Average Order Value</h3>
          <div class="metric-value">{{ formatCurrency(metrics.avgOrderValue) }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.orderValueChange)">
            {{ formatChange(metrics.orderValueChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>New Customers</h3>
          <div class="metric-value">{{ metrics.newCustomers }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.customerChange)">
            {{ formatChange(metrics.customerChange) }}
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>Revenue Trend</h3>
          <div class="chart-container">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Top Products</h3>
          <div class="chart-container">
            <canvas ref="productsChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Sales by Category</h3>
          <div class="chart-container">
            <canvas ref="categoriesChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Customer Distribution</h3>
          <div class="chart-container">
            <canvas ref="customersChart"></canvas>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3>Recent Sales</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in recentSales" :key="sale.id">
                <td>{{ formatDate(sale.date) }}</td>
                <td>{{ sale.customer }}</td>
                <td>{{ sale.product }}</td>
                <td>{{ sale.quantity }}</td>
                <td>{{ formatCurrency(sale.amount) }}</td>
                <td>
                  <span class="status" :class="sale.status">{{ sale.status }}</span>
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
  totalRevenue: 0,
  revenueChange: 0,
  totalUnits: 0,
  unitsChange: 0,
  avgOrderValue: 0,
  orderValueChange: 0,
  newCustomers: 0,
  customerChange: 0
})

const recentSales = ref([])
const revenueChart = ref(null)
const productsChart = ref(null)
const categoriesChart = ref(null)
const customersChart = ref(null)

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

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
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

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch sales data
    // For now, using mock data
    metrics.value = {
      totalRevenue: 125000,
      revenueChange: 15,
      totalUnits: 850,
      unitsChange: 8,
      avgOrderValue: 147,
      orderValueChange: 6,
      newCustomers: 45,
      customerChange: 12
    }

    recentSales.value = [
      {
        id: 1,
        date: '2024-02-15',
        customer: 'ABC Corp',
        product: 'Toner Cartridge',
        quantity: 5,
        amount: 750,
        status: 'Completed'
      },
      {
        id: 2,
        date: '2024-02-14',
        customer: 'XYZ Inc',
        product: 'Maintenance Kit',
        quantity: 2,
        amount: 500,
        status: 'Pending'
      }
    ]

    renderCharts()
  } catch (err) {
    error.value = 'Failed to load sales data. Please try again.'
    console.error('Error fetching sales data:', err)
  } finally {
    loading.value = false
  }
}

const renderCharts = () => {
  // Revenue Trend Chart
  new Chart(revenueChart.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
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

  // Top Products Chart
  new Chart(productsChart.value, {
    type: 'bar',
    data: {
      labels: ['Toner', 'Paper', 'Maintenance', 'Parts', 'Accessories'],
      datasets: [
        {
          label: 'Units Sold',
          data: [150, 200, 50, 75, 100],
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

  // Sales by Category Chart
  new Chart(categoriesChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Supplies', 'Parts', 'Services', 'Accessories'],
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

  // Customer Distribution Chart
  new Chart(customersChart.value, {
    type: 'pie',
    data: {
      labels: ['New', 'Returning', 'Corporate', 'Individual'],
      datasets: [
        {
          data: [25, 35, 30, 10],
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
}

watch([startDate, endDate], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.sales-report {
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

.status.Completed {
  background-color: #ecfdf5;
  color: #10b981;
}

.status.Pending {
  background-color: #fef3c7;
  color: #f59e0b;
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
  .sales-report {
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