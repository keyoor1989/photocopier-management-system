<template>
  <div class="report-details">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>{{ report?.title || 'Report Details' }}</h1>
      <div class="actions">
        <button class="btn btn-primary" @click="downloadReport">
          <i class="fas fa-download"></i> Download
        </button>
        <button class="btn btn-secondary" @click="printReport">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading report details...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchReport" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else-if="report" class="report-content">
      <div class="report-info">
        <div class="info-item">
          <span class="label">Created</span>
          <span class="value">{{ formatDate(report.createdAt) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Type</span>
          <span class="value">{{ report.type }}</span>
        </div>
        <div class="info-item">
          <span class="label">Status</span>
          <span class="value" :class="report.status">{{ report.status }}</span>
        </div>
      </div>

      <div class="report-sections">
        <div v-for="(section, index) in report.sections" :key="index" class="section">
          <h2>{{ section.title }}</h2>
          <div class="section-content">
            <div v-if="section.type === 'table'" class="table-container">
              <table>
                <thead>
                  <tr>
                    <th v-for="(header, i) in section.headers" :key="i">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in section.data" :key="i">
                    <td v-for="(cell, j) in row" :key="j">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else-if="section.type === 'chart'" class="chart-container">
              <canvas :ref="el => { if (el) chartRefs[index] = el }"></canvas>
            </div>
            <div v-else class="text-content">
              {{ section.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { Chart } from 'chart.js/auto'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const report = ref(null)
const chartRefs = ref({})

const goBack = () => {
  router.back()
}

const downloadReport = () => {
  // TODO: Implement report download
  console.log('Downloading report...')
}

const printReport = () => {
  window.print()
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

const fetchReport = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch report details
    // For now, using mock data
    report.value = {
      id: route.params.id,
      title: 'Monthly Sales Report',
      type: 'Sales',
      status: 'Completed',
      createdAt: '2024-01-31T10:00:00',
      sections: [
        {
          title: 'Sales Overview',
          type: 'chart',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#6366f1',
                tension: 0.1
              }
            ]
          }
        },
        {
          title: 'Top Products',
          type: 'table',
          headers: ['Product', 'Units Sold', 'Revenue'],
          data: [
            ['Toner Cartridge', '150', '$4,500'],
            ['Paper', '200', '$1,000'],
            ['Maintenance Kit', '50', '$2,500']
          ]
        },
        {
          title: 'Summary',
          type: 'text',
          content: 'Sales performance for the first half of 2024 shows steady growth with a 15% increase in revenue compared to the same period last year.'
        }
      ]
    }
  } catch (err) {
    error.value = 'Failed to load report details. Please try again.'
    console.error('Error fetching report:', err)
  } finally {
    loading.value = false
  }
}

const renderCharts = () => {
  if (!report.value) return

  report.value.sections.forEach((section, index) => {
    if (section.type === 'chart' && chartRefs.value[index]) {
      const ctx = chartRefs.value[index].getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: section.data,
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
  })
}

watch(report, () => {
  renderCharts()
})

onMounted(() => {
  fetchReport()
})
</script>

<style scoped>
.report-details {
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
}

.report-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-size: 0.875rem;
  color: #6b7280;
}

.info-item .value {
  font-weight: 500;
  color: #1f2937;
}

.info-item .value.Completed {
  color: #10b981;
}

.info-item .value.Pending {
  color: #f59e0b;
}

.info-item .value.Failed {
  color: #ef4444;
}

.report-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h2 {
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

.chart-container {
  height: 300px;
}

.text-content {
  color: #4b5563;
  line-height: 1.5;
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
  .report-details {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    justify-content: space-between;
  }

  .report-info {
    flex-direction: column;
    gap: 1rem;
  }
}

@media print {
  .header {
    display: none;
  }

  .report-details {
    padding: 0;
  }

  .section {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
}
</style> 