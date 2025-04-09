<template>
  <div class="activity-feed">
    <div class="feed-header">
      <h2>Recent Activity</h2>
      <div class="filter-controls">
        <select v-model="selectedType" class="filter-select">
          <option value="all">All Activities</option>
          <option value="service">Service Tickets</option>
          <option value="machine">Machines</option>
          <option value="inventory">Inventory</option>
          <option value="customer">Customers</option>
        </select>
        <button @click="refreshFeed" class="refresh-btn" :disabled="loading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button @click="fetchActivities" class="retry-btn">
          <i class="fas fa-sync-alt"></i>
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="activities.length === 0" class="empty-state">
      <i class="fas fa-history"></i>
      <p>No activities found</p>
    </div>

    <div v-else class="activities-list">
      <div v-for="activity in filteredActivities" :key="activity.id" class="activity-item">
        <div class="activity-icon" :class="getActivityTypeClass(activity.type)">
          <i :class="getActivityIcon(activity.type)"></i>
        </div>
        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
          </div>
          <p class="activity-description">{{ activity.description }}</p>
          <div v-if="activity.metadata" class="activity-metadata">
            <template v-if="activity.type === 'service'">
              <span class="badge" :class="getStatusClass(activity.metadata.status)">
                {{ activity.metadata.status }}
              </span>
              <span class="text-sm text-gray-500">
                Ticket #{{ activity.metadata.ticketId }}
              </span>
            </template>
            <template v-else-if="activity.type === 'machine'">
              <span class="text-sm text-gray-500">
                Serial: {{ activity.metadata.serialNumber }}
              </span>
            </template>
            <template v-else-if="activity.type === 'inventory'">
              <span class="text-sm text-gray-500">
                SKU: {{ activity.metadata.sku }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" class="load-more-btn" :disabled="loading">
        Load More
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formatDistanceToNow } from 'date-fns'

const dashboardStore = useDashboardStore()
const activities = ref([])
const loading = ref(false)
const error = ref(null)
const selectedType = ref('all')
const page = ref(1)
const hasMore = ref(true)

const filteredActivities = computed(() => {
  if (selectedType.value === 'all') {
    return activities.value
  }
  return activities.value.filter(activity => activity.type === selectedType.value)
})

const getActivityTypeClass = (type) => {
  const classes = {
    service: 'bg-blue-100 text-blue-600',
    machine: 'bg-green-100 text-green-600',
    inventory: 'bg-purple-100 text-purple-600',
    customer: 'bg-yellow-100 text-yellow-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getActivityIcon = (type) => {
  const icons = {
    service: 'fas fa-tools',
    machine: 'fas fa-print',
    inventory: 'fas fa-boxes',
    customer: 'fas fa-users'
  }
  return icons[type] || 'fas fa-info-circle'
}

const getStatusClass = (status) => {
  const classes = {
    open: 'bg-red-100 text-red-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatTime = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

const fetchActivities = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await dashboardStore.fetchActivities(page.value)
    if (page.value === 1) {
      activities.value = data.items
    } else {
      activities.value.push(...data.items)
    }
    hasMore.value = data.hasMore
  } catch (err) {
    error.value = err.message || 'Failed to fetch activities'
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  page.value++
  await fetchActivities()
}

const refreshFeed = async () => {
  page.value = 1
  await fetchActivities()
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.activity-feed {
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.feed-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: white;
  color: #374151;
}

.refresh-btn {
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  color: #6366f1;
  cursor: pointer;
  border-radius: 4px;
}

.refresh-btn:hover {
  background-color: #f3f4f6;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-container,
.error-container,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s linear infinite;
}

.error-message {
  text-align: center;
  color: #ef4444;
}

.error-message i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  background-color: #4f46e5;
}

.empty-state {
  flex-direction: column;
  gap: 1rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 2rem;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9fafb;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.activity-title {
  font-weight: 500;
  color: #1f2937;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.activity-metadata {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.load-more {
  margin-top: 1.5rem;
  text-align: center;
}

.load-more-btn {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.load-more-btn:hover {
  background-color: #e5e7eb;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .activity-feed {
    padding: 1rem;
  }

  .feed-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filter-controls {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }
}
</style> 