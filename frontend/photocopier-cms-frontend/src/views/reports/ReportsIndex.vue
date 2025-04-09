<template>
  <div class="reports-index">
    <div class="header">
      <h1>Reports</h1>
      <div class="actions">
        <button class="btn btn-primary" @click="generateReport">
          <i class="fas fa-download"></i> Generate Report
        </button>
      </div>
    </div>

    <div class="reports-grid">
      <div class="report-card" @click="navigateTo('sales')">
        <div class="icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <h3>Sales Reports</h3>
        <p>View and analyze sales performance</p>
      </div>

      <div class="report-card" @click="navigateTo('service')">
        <div class="icon">
          <i class="fas fa-wrench"></i>
        </div>
        <h3>Service Reports</h3>
        <p>Track service performance and metrics</p>
      </div>

      <div class="report-card" @click="navigateTo('inventory')">
        <div class="icon">
          <i class="fas fa-boxes"></i>
        </div>
        <h3>Inventory Reports</h3>
        <p>Monitor stock levels and movements</p>
      </div>

      <div class="report-card" @click="navigateTo('customers')">
        <div class="icon">
          <i class="fas fa-users"></i>
        </div>
        <h3>Customer Reports</h3>
        <p>Analyze customer data and trends</p>
      </div>
    </div>

    <div class="recent-reports">
      <h2>Recent Reports</h2>
      <div class="reports-list">
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Loading reports...
        </div>
        <div v-else-if="error" class="error">
          {{ error }}
          <button @click="fetchReports" class="btn btn-secondary">Retry</button>
        </div>
        <div v-else-if="reports.length === 0" class="empty">
          No recent reports available
        </div>
        <div v-else class="report-item" v-for="report in reports" :key="report.id" @click="viewReport(report.id)">
          <div class="report-info">
            <h4>{{ report.title }}</h4>
            <p>{{ report.description }}</p>
            <span class="date">{{ formatDate(report.createdAt) }}</span>
          </div>
          <div class="report-actions">
            <button class="btn btn-icon" @click.stop="downloadReport(report.id)">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const reports = ref([])

const navigateTo = (type) => {
  router.push(`/reports/${type}`)
}

const viewReport = (id) => {
  router.push(`/reports/${id}`)
}

const generateReport = () => {
  // TODO: Implement report generation
  console.log('Generating report...')
}

const downloadReport = (id) => {
  // TODO: Implement report download
  console.log('Downloading report:', id)
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const fetchReports = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch reports
    // For now, using mock data
    reports.value = [
      {
        id: 1,
        title: 'Monthly Sales Report',
        description: 'Sales performance for January 2024',
        createdAt: '2024-01-31'
      },
      {
        id: 2,
        title: 'Service Performance',
        description: 'Service metrics for Q4 2023',
        createdAt: '2023-12-31'
      }
    ]
  } catch (err) {
    error.value = 'Failed to load reports. Please try again.'
    console.error('Error fetching reports:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReports()
})
</script>

<style scoped>
.reports-index {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.report-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.report-card .icon {
  font-size: 2rem;
  color: #6366f1;
  margin-bottom: 1rem;
}

.report-card h3 {
  margin: 0 0 0.5rem;
  color: #1f2937;
}

.report-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.recent-reports {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recent-reports h2 {
  margin: 0 0 1.5rem;
  color: #1f2937;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.report-item:hover {
  background-color: #f9fafb;
}

.report-info h4 {
  margin: 0 0 0.25rem;
  color: #1f2937;
}

.report-info p {
  margin: 0 0 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.report-info .date {
  color: #9ca3af;
  font-size: 0.75rem;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.loading,
.error,
.empty {
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

.btn-icon {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
}

.btn-icon:hover {
  color: #374151;
}

@media (max-width: 768px) {
  .reports-index {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }
}
</style> 