<template>
  <div class="reports-dashboard">
    <!-- Header Section -->
    <header class="dashboard-header">
      <h1 class="text-2xl font-bold mb-4">Reports Dashboard</h1>
      <div class="flex items-center gap-4">
        <DateRangePicker v-model="selectedDateRange" @update:modelValue="handleDateRangeChange" />
        <button
          class="btn btn-primary"
          @click="refreshDashboard"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </header>

    <!-- Key Performance Indicators -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        v-for="kpi in kpiData"
        :key="kpi.id"
        :title="kpi.title"
        :value="kpi.value"
        :change="kpi.change"
        :trend="kpi.trend"
        :icon="kpi.icon"
      />
    </section>

    <!-- Quick Actions and Recent Reports -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Quick Actions -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              v-for="action in quickActions"
              :key="action.id"
              class="btn btn-outline flex flex-col items-center p-4"
              @click="handleQuickAction(action)"
            >
              <i :class="action.icon" class="text-2xl mb-2" />
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold mb-4">Recent Reports</h2>
          <div class="space-y-3">
            <div
              v-for="report in recentReports"
              :key="report.id"
              class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
              @click="viewReport(report)"
            >
              <div>
                <p class="font-medium">{{ report.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(report.generatedAt) }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  class="btn btn-icon btn-sm"
                  @click.stop="downloadReport(report)"
                  title="Download"
                >
                  <i class="fas fa-download" />
                </button>
                <button
                  class="btn btn-icon btn-sm"
                  @click.stop="shareReport(report)"
                  title="Share"
                >
                  <i class="fas fa-share-alt" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in reportCategories"
        :key="category.id"
        class="bg-white rounded-lg shadow p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ category.name }}</h2>
          <button
            class="btn btn-sm btn-outline"
            @click="viewCategory(category)"
          >
            View All
          </button>
        </div>
        <div class="space-y-2">
          <button
            v-for="report in category.reports"
            :key="report.id"
            class="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center justify-between"
            @click="generateReport(report)"
          >
            <span>{{ report.name }}</span>
            <i class="fas fa-chevron-right text-gray-400" />
          </button>
        </div>
      </div>
    </div>

    <!-- Saved Reports -->
    <section class="mt-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Saved Reports</h2>
          <button
            class="btn btn-sm btn-primary"
            @click="createCustomReport"
          >
            Create Custom Report
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="report in savedReports"
            :key="report.id"
            class="border rounded p-3 hover:border-primary cursor-pointer"
            @click="runSavedReport(report)"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium">{{ report.name }}</h3>
              <div class="flex gap-2">
                <button
                  class="btn btn-icon btn-xs"
                  @click.stop="editSavedReport(report)"
                  title="Edit"
                >
                  <i class="fas fa-edit" />
                </button>
                <button
                  class="btn btn-icon btn-xs"
                  @click.stop="deleteSavedReport(report)"
                  title="Delete"
                >
                  <i class="fas fa-trash" />
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-500 mb-2">
              {{ report.description }}
            </p>
            <div class="flex items-center text-sm text-gray-500">
              <i class="far fa-clock mr-1" />
              Last run: {{ formatDate(report.lastRun) }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { useRouter } from 'vue-router'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import KPICard from '@/components/reports/KPICard.vue'

const router = useRouter()
const reportsStore = useReportsStore()

// State
const selectedDateRange = ref({
  start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  end: new Date()
})

// Computed
const loading = computed(() => reportsStore.loading)
const recentReports = computed(() => reportsStore.recentReports)
const savedReports = computed(() => reportsStore.favoriteReports)

// Data
const kpiData = ref([
  {
    id: 1,
    title: 'Total Revenue',
    value: '$0',
    change: 0,
    trend: 'up',
    icon: 'fas fa-dollar-sign'
  },
  {
    id: 2,
    title: 'Service Tickets',
    value: '0',
    change: 0,
    trend: 'down',
    icon: 'fas fa-tools'
  },
  {
    id: 3,
    title: 'Inventory Value',
    value: '$0',
    change: 0,
    trend: 'up',
    icon: 'fas fa-box'
  },
  {
    id: 4,
    title: 'Customer Satisfaction',
    value: '0%',
    change: 0,
    trend: 'up',
    icon: 'fas fa-smile'
  }
])

const quickActions = [
  {
    id: 'sales',
    label: 'Sales Report',
    icon: 'fas fa-chart-line',
    route: '/reports/sales'
  },
  {
    id: 'service',
    label: 'Service Report',
    icon: 'fas fa-wrench',
    route: '/reports/service'
  },
  {
    id: 'inventory',
    label: 'Inventory Report',
    icon: 'fas fa-warehouse',
    route: '/reports/inventory'
  },
  {
    id: 'financial',
    label: 'Financial Report',
    icon: 'fas fa-file-invoice-dollar',
    route: '/reports/financial'
  },
  {
    id: 'custom',
    label: 'Custom Report',
    icon: 'fas fa-plus',
    route: '/reports/builder'
  },
  {
    id: 'schedule',
    label: 'Schedule Report',
    icon: 'fas fa-clock',
    route: '/reports/schedule'
  }
]

const reportCategories = [
  {
    id: 'sales',
    name: 'Sales Reports',
    reports: [
      { id: 'sales-summary', name: 'Sales Summary' },
      { id: 'sales-by-product', name: 'Sales by Product' },
      { id: 'sales-by-customer', name: 'Sales by Customer' },
      { id: 'sales-trends', name: 'Sales Trends' }
    ]
  },
  {
    id: 'service',
    name: 'Service Reports',
    reports: [
      { id: 'service-summary', name: 'Service Summary' },
      { id: 'engineer-performance', name: 'Engineer Performance' },
      { id: 'resolution-times', name: 'Resolution Times' },
      { id: 'customer-satisfaction', name: 'Customer Satisfaction' }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory Reports',
    reports: [
      { id: 'stock-levels', name: 'Stock Levels' },
      { id: 'low-stock', name: 'Low Stock Items' },
      { id: 'inventory-movement', name: 'Inventory Movement' },
      { id: 'valuation', name: 'Inventory Valuation' }
    ]
  }
]

// Methods
async function refreshDashboard() {
  try {
    await reportsStore.fetchDashboardMetrics()
    updateKPIData()
  } catch (error) {
    console.error('Error refreshing dashboard:', error)
  }
}

function updateKPIData() {
  const metrics = reportsStore.dashboardMetrics
  if (!metrics) return

  kpiData.value = [
    {
      id: 1,
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: metrics.revenueChange,
      trend: metrics.revenueChange >= 0 ? 'up' : 'down',
      icon: 'fas fa-dollar-sign'
    },
    {
      id: 2,
      title: 'Service Tickets',
      value: metrics.totalTickets,
      change: metrics.ticketsChange,
      trend: metrics.ticketsChange >= 0 ? 'up' : 'down',
      icon: 'fas fa-tools'
    },
    {
      id: 3,
      title: 'Inventory Value',
      value: formatCurrency(metrics.inventoryValue),
      change: metrics.inventoryChange,
      trend: metrics.inventoryChange >= 0 ? 'up' : 'down',
      icon: 'fas fa-box'
    },
    {
      id: 4,
      title: 'Customer Satisfaction',
      value: `${metrics.satisfaction}%`,
      change: metrics.satisfactionChange,
      trend: metrics.satisfactionChange >= 0 ? 'up' : 'down',
      icon: 'fas fa-smile'
    }
  ]
}

function handleDateRangeChange() {
  reportsStore.setFilters({
    dateRange: {
      start: selectedDateRange.value.start,
      end: selectedDateRange.value.end
    }
  })
  refreshDashboard()
}

function handleQuickAction(action) {
  router.push(action.route)
}

function viewCategory(category) {
  router.push(`/reports/${category.id}`)
}

async function generateReport(report) {
  try {
    await reportsStore.generateReport(report.id)
    router.push(`/reports/view/${report.id}`)
  } catch (error) {
    console.error('Error generating report:', error)
  }
}

function viewReport(report) {
  router.push(`/reports/view/${report.id}`)
}

async function downloadReport(report) {
  try {
    await reportsStore.exportReport(report.id, 'pdf')
  } catch (error) {
    console.error('Error downloading report:', error)
  }
}

function shareReport(report) {
  // Implement share functionality
  console.log('Share report:', report)
}

function createCustomReport() {
  router.push('/reports/builder')
}

async function runSavedReport(report) {
  try {
    await reportsStore.generateReport('custom', report.config)
    router.push(`/reports/view/${report.id}`)
  } catch (error) {
    console.error('Error running saved report:', error)
  }
}

function editSavedReport(report) {
  router.push(`/reports/builder?id=${report.id}`)
}

async function deleteSavedReport(report) {
  if (!confirm('Are you sure you want to delete this saved report?')) return
  
  try {
    await reportsStore.deleteReportConfig(report.id)
  } catch (error) {
    console.error('Error deleting saved report:', error)
  }
}

// Utility functions
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    reportsStore.fetchDashboardMetrics(),
    reportsStore.fetchSavedConfigs()
  ])
  updateKPIData()
})
</script>

<style scoped>
.reports-dashboard {
  @apply p-6;
}

.dashboard-header {
  @apply flex flex-col md:flex-row md:items-center md:justify-between mb-6;
}

.btn {
  @apply px-4 py-2 rounded font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}

.btn-outline {
  @apply border border-gray-300 hover:border-primary hover:text-primary;
}

.btn-icon {
  @apply p-1 rounded hover:bg-gray-100;
}

.btn-sm {
  @apply px-3 py-1 text-sm;
}

.btn-xs {
  @apply px-2 py-0.5 text-xs;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 