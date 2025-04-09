<template>
  <div class="service-report">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>Service Report</h1>
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
      <i class="fas fa-spinner fa-spin"></i> Loading service data...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchData" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else class="report-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Total Tickets</h3>
          <div class="metric-value">{{ metrics.totalTickets }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.ticketChange)">
            {{ formatChange(metrics.ticketChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Average Response Time</h3>
          <div class="metric-value">{{ formatTime(metrics.avgResponseTime) }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.responseTimeChange)">
            {{ formatChange(metrics.responseTimeChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Resolution Rate</h3>
          <div class="metric-value">{{ formatPercentage(metrics.resolutionRate) }}</div>
          <div class="metric-change" :class="getChangeClass(metrics.resolutionRateChange)">
            {{ formatChange(metrics.resolutionRateChange) }}
          </div>
        </div>

        <div class="metric-card">
          <h3>Customer Satisfaction</h3>
          <div class="metric-value">{{ metrics.satisfactionScore }}/5</div>
          <div class="metric-change" :class="getChangeClass(metrics.satisfactionChange)">
            {{ formatChange(metrics.satisfactionChange) }}
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>Ticket Volume</h3>
          <div class="chart-container">
            <canvas ref="ticketsChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Service Types</h3>
          <div class="chart-container">
            <canvas ref="typesChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Resolution Time</h3>
          <div class="chart-container">
            <canvas ref="timeChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Technician Performance</h3>
          <div class="chart-container">
            <canvas ref="techChart"></canvas>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3>Recent Service Tickets</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Issue</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in recentTickets" :key="ticket.id">
                <td>{{ ticket.id }}</td>
                <td>{{ ticket.customer }}</td>
                <td>{{ ticket.issue }}</td>
                <td>
                  <span class="priority" :class="ticket.priority">{{ ticket.priority }}</span>
                </td>
                <td>
                  <span class="status" :class="ticket.status">{{ ticket.status }}</span>
                </td>
                <td>{{ formatDate(ticket.createdAt) }}</td>
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
  totalTickets: 0,
  ticketChange: 0,
  avgResponseTime: 0,
  responseTimeChange: 0,
  resolutionRate: 0,
  resolutionRateChange: 0,
  satisfactionScore: 0,
  satisfactionChange: 0
})

const recentTickets = ref([])
const ticketsChart = ref(null)
const typesChart = ref(null)
const timeChart = ref(null)
const techChart = ref(null)

const goBack = () => {
  router.back()
}

const generateReport = () => {
  fetchData()
}

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatPercentage = (value) => {
  return `${Math.round(value * 100)}%`
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
    // TODO: Implement API call to fetch service data
    // For now, using mock data
    metrics.value = {
      totalTickets: 125,
      ticketChange: 8,
      avgResponseTime: 45,
      responseTimeChange: -12,
      resolutionRate: 0.92,
      resolutionRateChange: 5,
      satisfactionScore: 4.5,
      satisfactionChange: 2
    }

    recentTickets.value = [
      {
        id: 'ST-2024-001',
        customer: 'ABC Corp',
        issue: 'Paper Jam',
        priority: 'High',
        status: 'In Progress',
        createdAt: '2024-02-15T10:00:00'
      },
      {
        id: 'ST-2024-002',
        customer: 'XYZ Inc',
        issue: 'Toner Replacement',
        priority: 'Medium',
        status: 'Completed',
        createdAt: '2024-02-14T14:30:00'
      }
    ]

    renderCharts()
  } catch (err) {
    error.value = 'Failed to load service data. Please try again.'
    console.error('Error fetching service data:', err)
  } finally {
    loading.value = false
  }
}

const renderCharts = () => {
  // Ticket Volume Chart
  new Chart(ticketsChart.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Tickets',
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

  // Service Types Chart
  new Chart(typesChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Maintenance', 'Repair', 'Installation', 'Training'],
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

  // Resolution Time Chart
  new Chart(timeChart.value, {
    type: 'bar',
    data: {
      labels: ['<1h', '1-4h', '4-8h', '8-24h', '>24h'],
      datasets: [
        {
          label: 'Tickets',
          data: [20, 35, 25, 15, 5],
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

  // Technician Performance Chart
  new Chart(techChart.value, {
    type: 'bar',
    data: {
      labels: ['John D.', 'Sarah M.', 'Mike R.', 'Lisa T.'],
      datasets: [
        {
          label: 'Tickets Resolved',
          data: [45, 38, 42, 35],
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
.service-report {
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

.priority,
.status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority.High {
  background-color: #fee2e2;
  color: #ef4444;
}

.priority.Medium {
  background-color: #fef3c7;
  color: #f59e0b;
}

.priority.Low {
  background-color: #ecfdf5;
  color: #10b981;
}

.status.Completed {
  background-color: #ecfdf5;
  color: #10b981;
}

.status.In-Progress {
  background-color: #fef3c7;
  color: #f59e0b;
}

.status.Pending {
  background-color: #e5e7eb;
  color: #6b7280;
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
  .service-report {
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