<template>
  <div class="activity-feed">
    <div class="feed-header">
      <h3>Recent Activities</h3>
      <button @click="refreshActivities" class="refresh-btn">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading activities...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="refreshActivities" class="retry-btn">
        Retry
      </button>
    </div>

    <div v-else class="activities-list">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-item"
      >
        <div class="activity-icon" :class="activity.type">
          <i :class="getActivityIcon(activity.type)"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">{{ activity.title }}</div>
          <div class="activity-details">
            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
            <span class="activity-user">{{ activity.user }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatDistanceToNow } from 'date-fns'

const loading = ref(false)
const error = ref(null)
const activities = ref([])

const getActivityIcon = (type) => {
  const icons = {
    'service': 'fas fa-wrench',
    'inventory': 'fas fa-box',
    'customer': 'fas fa-user',
    'machine': 'fas fa-print',
    'system': 'fas fa-cog'
  }
  return icons[type] || 'fas fa-info-circle'
}

const formatTime = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

const fetchActivities = async () => {
  loading.value = true
  error.value = null

  try {
    // TODO: Replace with actual API call
    const response = await fetch('/api/activities')
    if (!response.ok) throw new Error('Failed to fetch activities')
    activities.value = await response.json()
  } catch (err) {
    error.value = err.message
    console.error('Error fetching activities:', err)
  } finally {
    loading.value = false
  }
}

const refreshActivities = () => {
  fetchActivities()
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.activity-feed {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.feed-header h3 {
  font-size: 1.125rem;
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

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f9fafb;
  transition: background-color 0.2s;
}

.activity-item:hover {
  background-color: #f3f4f6;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  color: white;
}

.activity-icon.service {
  background-color: #6366f1;
}

.activity-icon.inventory {
  background-color: #10b981;
}

.activity-icon.customer {
  background-color: #f59e0b;
}

.activity-icon.machine {
  background-color: #8b5cf6;
}

.activity-icon.system {
  background-color: #6b7280;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-time {
  color: #6b7280;
}

.activity-user {
  color: #4b5563;
}

@media (max-width: 768px) {
  .activity-feed {
    padding: 1rem;
  }

  .activity-item {
    padding: 0.75rem;
  }

  .activity-icon {
    width: 2rem;
    height: 2rem;
  }

  .activity-details {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style> 