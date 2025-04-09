<template>
  <div class="inventory-details">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      <button @click="fetchItem" class="btn btn-outline-primary">
        Try Again
      </button>
    </div>

    <!-- Item Details -->
    <div v-else-if="item" class="item-details">
      <div class="header">
        <div class="d-flex align-items-center">
          <button @click="goBack" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <h1>{{ item.name }}</h1>
        </div>
        <div class="header-actions">
          <button @click="printBarcode" class="btn btn-outline-primary me-2">
            <i class="fas fa-barcode"></i> Print Barcode
          </button>
          <button @click="adjustStock" class="btn btn-outline-info me-2">
            <i class="fas fa-boxes"></i> Adjust Stock
          </button>
          <button @click="editItem" class="btn btn-outline-secondary me-2">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button @click="confirmDelete" class="btn btn-outline-danger">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>

      <div class="row mt-4">
        <!-- Item Information -->
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Item Information</h5>
              <span :class="['badge', getStatusBadgeClass]">
                {{ getStatusText }}
              </span>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Item Code</label>
                    <p class="mb-0">{{ item.code }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Category</label>
                    <p class="mb-0">{{ getCategoryName(item.categoryId) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Location</label>
                    <p class="mb-0">{{ getLocationName(item.locationId) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Description</label>
                    <p class="mb-0">{{ item.description || 'No description provided' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Purchase Price</label>
                    <p class="mb-0">${{ formatPrice(item.purchasePrice) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Selling Price</label>
                    <p class="mb-0">${{ formatPrice(item.price) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Profit Margin</label>
                    <p class="mb-0">{{ calculateProfitMargin }}%</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Supplier</label>
                    <p class="mb-0">{{ item.supplier || 'Not specified' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock Information -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Stock Information</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="stock-card">
                    <div class="stock-value" :class="getStockLevelClass">
                      {{ item.stockLevel }}
                    </div>
                    <div class="stock-label">Current Stock</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stock-card">
                    <div class="stock-value">
                      {{ item.lowStockThreshold || 'N/A' }}
                    </div>
                    <div class="stock-label">Low Stock Threshold</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stock-card">
                    <div class="stock-value">
                      {{ item.reorderPoint || 'N/A' }}
                    </div>
                    <div class="stock-label">Reorder Point</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock History Chart -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Stock History</h5>
              <div class="btn-group">
                <button 
                  v-for="period in chartPeriods" 
                  :key="period.value"
                  @click="selectedPeriod = period.value"
                  class="btn btn-sm"
                  :class="selectedPeriod === period.value ? 'btn-primary' : 'btn-outline-primary'"
                >
                  {{ period.label }}
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="stockHistory.length === 0" class="text-center py-4">
                <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
                <p class="mb-0">No stock history available</p>
              </div>
              <div v-else class="chart-container">
                <!-- Chart will be rendered here -->
                <canvas ref="stockChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-md-4">
          <!-- Item Image -->
          <div class="card mb-4">
            <div class="card-body text-center">
              <div class="item-image-container">
                <img 
                  v-if="item.image" 
                  :src="item.image" 
                  :alt="item.name" 
                  class="img-fluid rounded"
                />
                <div v-else class="placeholder-image">
                  <i class="fas fa-box fa-3x"></i>
                  <p class="mt-2">No image available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Barcode -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Barcode</h5>
            </div>
            <div class="card-body text-center">
              <div v-if="barcode" class="barcode-container">
                <img :src="barcode" :alt="item.name" class="img-fluid" />
                <p class="mt-2">{{ item.code }}</p>
              </div>
              <div v-else class="text-center py-4">
                <button @click="generateBarcode" class="btn btn-outline-primary">
                  <i class="fas fa-barcode"></i> Generate Barcode
                </button>
              </div>
            </div>
          </div>

          <!-- Compatible Machines -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Compatible Machines</h5>
            </div>
            <div class="card-body">
              <div v-if="compatibleMachines.length === 0" class="text-center py-3">
                <p class="mb-0 text-muted">No compatible machines found</p>
              </div>
              <ul v-else class="list-group list-group-flush">
                <li 
                  v-for="machine in compatibleMachines" 
                  :key="machine.id" 
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ machine.name }}
                  <span class="badge bg-primary rounded-pill">{{ machine.model }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Recent Stock Adjustments -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Recent Stock Adjustments</h5>
            </div>
            <div class="card-body p-0">
              <div v-if="recentAdjustments.length === 0" class="text-center py-3">
                <p class="mb-0 text-muted">No recent adjustments</p>
              </div>
              <ul v-else class="list-group list-group-flush">
                <li 
                  v-for="adjustment in recentAdjustments" 
                  :key="adjustment.id" 
                  class="list-group-item"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span 
                        :class="['badge', adjustment.quantity > 0 ? 'bg-success' : 'bg-danger']"
                      >
                        {{ adjustment.quantity > 0 ? '+' : '' }}{{ adjustment.quantity }}
                      </span>
                      <small class="text-muted ms-2">{{ formatDate(adjustment.date) }}</small>
                    </div>
                    <small class="text-muted">{{ adjustment.reason }}</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete <strong>{{ item?.name }}</strong>?
            This action cannot be undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteItem">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { formatDate } from '@/utils/dateFormatter'
import Chart from 'chart.js/auto'

const route = useRoute()
const router = useRouter()
const inventoryStore = useInventoryStore()

// Reactive state
const item = computed(() => inventoryStore.selectedItem)
const isLoading = computed(() => inventoryStore.isLoading)
const error = computed(() => inventoryStore.error)
const categories = computed(() => inventoryStore.categories)
const locations = computed(() => inventoryStore.locations)
const stockHistory = computed(() => inventoryStore.stockHistory)
const barcode = ref(null)
const compatibleMachines = ref([])
const recentAdjustments = ref([])
const selectedPeriod = ref('month')
const stockChart = ref(null)
const chartInstance = ref(null)

const chartPeriods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' }
]

// Computed properties
const getStatusBadgeClass = computed(() => {
  if (!item.value) return ''
  
  if (item.value.stockLevel <= 0) return 'bg-danger'
  if (item.value.lowStockThreshold && item.value.stockLevel <= item.value.lowStockThreshold) return 'bg-warning text-dark'
  if (item.value.discontinued) return 'bg-secondary'
  return 'bg-success'
})

const getStatusText = computed(() => {
  if (!item.value) return ''
  
  if (item.value.discontinued) return 'Discontinued'
  if (item.value.stockLevel <= 0) return 'Out of Stock'
  if (item.value.lowStockThreshold && item.value.stockLevel <= item.value.lowStockThreshold) return 'Low Stock'
  return 'In Stock'
})

const getStockLevelClass = computed(() => {
  if (!item.value) return ''
  
  if (item.value.stockLevel <= 0) return 'out-of-stock'
  if (item.value.lowStockThreshold && item.value.stockLevel <= item.value.lowStockThreshold) return 'low-stock'
  return 'in-stock'
})

const calculateProfitMargin = computed(() => {
  if (!item.value || !item.value.purchasePrice || !item.value.price) return 0
  
  const margin = ((item.value.price - item.value.purchasePrice) / item.value.price) * 100
  return margin.toFixed(2)
})

// Methods
const fetchItem = async () => {
  try {
    await inventoryStore.fetchInventoryItem(route.params.id)
    await Promise.all([
      inventoryStore.fetchStockHistory(route.params.id),
      fetchCompatibleMachines(),
      processStockHistory()
    ])
  } catch (error) {
    console.error('Error fetching item details:', error)
  }
}

const fetchCompatibleMachines = async () => {
  try {
    const machines = await inventoryStore.fetchCompatibleMachines(route.params.id)
    compatibleMachines.value = machines
  } catch (error) {
    console.error('Error fetching compatible machines:', error)
  }
}

const generateBarcode = async () => {
  try {
    const response = await inventoryStore.generateBarcode(route.params.id)
    barcode.value = response.barcodeUrl
  } catch (error) {
    console.error('Error generating barcode:', error)
  }
}

const printBarcode = () => {
  if (!barcode.value) return
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Barcode - ${item.value.name}</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .barcode-container { margin: 20px; }
          .barcode-image { max-width: 100%; }
          .barcode-text { margin-top: 10px; font-size: 14px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="barcode-container">
          <img src="${barcode.value}" class="barcode-image" alt="${item.value.name}" />
          <div class="barcode-text">${item.value.code}</div>
        </div>
        <button class="no-print" onclick="window.print()">Print</button>
      </body>
    </html>
  `)
  printWindow.document.close()
}

const goBack = () => {
  router.back()
}

const editItem = () => {
  router.push(`/inventory/${route.params.id}/edit`)
}

const adjustStock = () => {
  router.push(`/inventory/${route.params.id}/adjust`)
}

const confirmDelete = () => {
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))
  deleteModal.show()
}

const deleteItem = async () => {
  try {
    await inventoryStore.deleteInventoryItem(route.params.id)
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'))
    deleteModal.hide()
    router.push('/inventory')
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Unknown'
}

const getLocationName = (locationId) => {
  const location = locations.value.find(l => l.id === locationId)
  return location ? location.name : 'Unknown'
}

const formatPrice = (price) => {
  return price.toFixed(2)
}

const processStockHistory = () => {
  // Process stock history data for the chart
  if (stockHistory.value.length === 0) return
  
  // Get recent adjustments for the sidebar
  recentAdjustments.value = stockHistory.value
    .slice(0, 5)
    .map(entry => ({
      id: entry.id,
      quantity: entry.quantity,
      date: entry.date,
      reason: entry.reason
    }))
  
  // Filter data based on selected period
  const now = new Date()
  let startDate = new Date()
  
  switch (selectedPeriod.value) {
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3)
      break
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }
  
  const filteredData = stockHistory.value
    .filter(entry => new Date(entry.date) >= startDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  
  // Prepare data for the chart
  const labels = filteredData.map(entry => formatDate(entry.date))
  const stockLevels = []
  let currentStock = item.value.stockLevel
  
  // Calculate stock levels over time
  for (let i = filteredData.length - 1; i >= 0; i--) {
    currentStock -= filteredData[i].quantity
    stockLevels.unshift(currentStock)
  }
  
  // Render the chart
  renderChart(labels, stockLevels)
}

const renderChart = (labels, data) => {
  const ctx = stockChart.value.getContext('2d')
  
  // Destroy existing chart if it exists
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  // Create new chart
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Stock Level',
          data: data,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Stock Level'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  })
}

// Lifecycle hooks
onMounted(() => {
  fetchItem()
})

// Watch for period changes
watch(selectedPeriod, () => {
  processStockHistory()
})
</script>

<style scoped>
.inventory-details {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.item-image-container {
  max-width: 300px;
  margin: 0 auto;
}

.item-image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.placeholder-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #adb5bd;
}

.stock-card {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.stock-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stock-value.in-stock {
  color: #198754;
}

.stock-value.low-stock {
  color: #ffc107;
}

.stock-value.out-of-stock {
  color: #dc3545;
}

.stock-label {
  color: #6c757d;
  font-size: 0.875rem;
}

.chart-container {
  height: 300px;
  position: relative;
}

.barcode-container {
  padding: 1rem;
}

.barcode-container img {
  max-width: 100%;
  height: auto;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}
</style> 