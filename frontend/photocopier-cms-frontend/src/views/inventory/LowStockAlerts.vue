<template>
  <div class="low-stock-alerts">
    <div class="page-header">
      <h2>Low Stock Alerts</h2>
      <div class="header-actions">
        <button @click="refreshAlerts" class="refresh-btn">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading low stock items...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="refreshAlerts" class="retry-btn">
        Retry
      </button>
    </div>

    <div v-else class="alerts-content">
      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items..."
          />
        </div>
        <div class="sort-options">
          <select v-model="sortBy">
            <option value="quantity">Quantity</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
          <select v-model="sortOrder">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div class="alerts-list">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="alert-item"
        >
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-category">{{ item.category }}</div>
          </div>
          <div class="stock-info">
            <div class="stock-level">
              <span class="current-stock">{{ item.quantity }}</span>
              <span class="min-stock">/ {{ item.minQuantity }}</span>
            </div>
            <div class="stock-status" :class="getStockStatusClass(item)">
              {{ getStockStatusText(item) }}
            </div>
          </div>
          <div class="item-actions">
            <button
              @click="reorderItem(item)"
              class="reorder-btn"
              :disabled="item.reorderPending"
            >
              <i class="fas fa-shopping-cart"></i>
              {{ item.reorderPending ? 'Reorder Pending' : 'Reorder' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'

const inventoryStore = useInventoryStore()

const loading = ref(false)
const error = ref(null)
const lowStockItems = ref([])
const searchQuery = ref('')
const sortBy = ref('quantity')
const sortOrder = ref('asc')

const fetchLowStockItems = async () => {
  loading.value = true
  error.value = null

  try {
    lowStockItems.value = await inventoryStore.fetchLowStockItems()
  } catch (err) {
    error.value = 'Failed to load low stock items'
    console.error('Error fetching low stock items:', err)
  } finally {
    loading.value = false
  }
}

const refreshAlerts = () => {
  fetchLowStockItems()
}

const getStockStatusClass = (item) => {
  const percentage = (item.quantity / item.minQuantity) * 100
  if (percentage <= 20) return 'critical'
  if (percentage <= 50) return 'warning'
  return 'low'
}

const getStockStatusText = (item) => {
  const percentage = (item.quantity / item.minQuantity) * 100
  if (percentage <= 20) return 'Critical'
  if (percentage <= 50) return 'Warning'
  return 'Low'
}

const reorderItem = async (item) => {
  try {
    await inventoryStore.reorderItem(item.id)
    item.reorderPending = true
  } catch (err) {
    console.error('Error reordering item:', err)
  }
}

const filteredItems = computed(() => {
  let items = [...lowStockItems.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  items.sort((a, b) => {
    let comparison = 0
    if (sortBy.value === 'quantity') {
      comparison = a.quantity - b.quantity
    } else if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy.value === 'category') {
      comparison = a.category.localeCompare(b.category)
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return items
})

onMounted(() => {
  fetchLowStockItems()
})
</script>

<style scoped>
.low-stock-alerts {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.refresh-btn {
  padding: 0.5rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover {
  background-color: #e5e7eb;
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

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.5rem;
  flex: 1;
  max-width: 300px;
}

.search-box i {
  color: #6b7280;
  margin-right: 0.5rem;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.875rem;
}

.sort-options {
  display: flex;
  gap: 0.5rem;
}

.sort-options select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  gap: 1rem;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.item-category {
  font-size: 0.875rem;
  color: #6b7280;
}

.stock-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.stock-level {
  font-weight: 500;
}

.current-stock {
  color: #1f2937;
}

.min-stock {
  color: #6b7280;
}

.stock-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.stock-status.critical {
  background-color: #fee2e2;
  color: #dc2626;
}

.stock-status.warning {
  background-color: #fef3c7;
  color: #d97706;
}

.stock-status.low {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.reorder-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reorder-btn:hover:not(:disabled) {
  background-color: #4f46e5;
}

.reorder-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .low-stock-alerts {
    padding: 1rem;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .alert-item {
    flex-direction: column;
    align-items: stretch;
  }

  .stock-info {
    align-items: flex-start;
  }

  .item-actions {
    justify-content: flex-end;
  }
}
</style> 