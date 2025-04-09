<template>
  <div class="customer-history">
    <div class="header">
      <h2>Customer History</h2>
      <div class="filter-controls">
        <select v-model="selectedType" class="filter-select">
          <option value="all">All History</option>
          <option value="service">Service Tickets</option>
          <option value="contract">Contracts</option>
          <option value="payment">Payments</option>
          <option value="note">Notes</option>
        </select>
        <DateRangePicker v-model="dateRange" @update:modelValue="fetchHistory" />
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button @click="fetchHistory" class="retry-btn">
          <i class="fas fa-sync-alt"></i>
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="history.length === 0" class="empty-state">
      <i class="fas fa-history"></i>
      <p>No history found for this customer</p>
    </div>

    <div v-else class="history-timeline">
      <div v-for="item in filteredHistory" :key="item.id" class="timeline-item">
        <div class="timeline-marker" :class="getTypeClass(item.type)">
          <i :class="getTypeIcon(item.type)"></i>
        </div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="title">{{ item.title }}</span>
            <span class="date">{{ formatDate(item.date) }}</span>
          </div>
          <div class="timeline-body">
            <p class="description">{{ item.description }}</p>
            <div v-if="item.type === 'service'" class="service-details">
              <span class="badge" :class="getStatusClass(item.status)">
                {{ item.status }}
              </span>
              <span class="machine">
                <i class="fas fa-print"></i>
                {{ item.machineModel }}
              </span>
              <span class="technician">
                <i class="fas fa-user"></i>
                {{ item.technician }}
              </span>
            </div>
            <div v-else-if="item.type === 'contract'" class="contract-details">
              <div class="detail-row">
                <span class="label">Type:</span>
                <span class="value">{{ item.contractType }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ item.duration }} months</span>
              </div>
              <div class="detail-row">
                <span class="label">Value:</span>
                <span class="value">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
            <div v-else-if="item.type === 'payment'" class="payment-details">
              <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value">{{ formatCurrency(item.amount) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Method:</span>
                <span class="value">{{ item.paymentMethod }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Reference:</span>
                <span class="value">{{ item.reference }}</span>
              </div>
            </div>
          </div>
          <div v-if="item.attachments?.length" class="timeline-attachments">
            <div v-for="attachment in item.attachments" :key="attachment.id" class="attachment">
              <i :class="getFileIcon(attachment.type)"></i>
              <span class="filename">{{ attachment.name }}</span>
              <button @click="downloadAttachment(attachment)" class="download-btn">
                <i class="fas fa-download"></i>
              </button>
            </div>
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
import { useRoute } from 'vue-router'
import { useCustomersStore } from '@/stores/customers'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import { format } from 'date-fns'

const route = useRoute()
const customersStore = useCustomersStore()

const history = ref([])
const loading = ref(false)
const error = ref(null)
const selectedType = ref('all')
const dateRange = ref({ start: null, end: null })
const page = ref(1)
const hasMore = ref(true)

const filteredHistory = computed(() => {
  if (selectedType.value === 'all') {
    return history.value
  }
  return history.value.filter(item => item.type === selectedType.value)
})

const getTypeClass = (type) => {
  const classes = {
    service: 'bg-blue-100 text-blue-600',
    contract: 'bg-green-100 text-green-600',
    payment: 'bg-purple-100 text-purple-600',
    note: 'bg-yellow-100 text-yellow-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getTypeIcon = (type) => {
  const icons = {
    service: 'fas fa-tools',
    contract: 'fas fa-file-contract',
    payment: 'fas fa-money-bill-wave',
    note: 'fas fa-sticky-note'
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

const getFileIcon = (type) => {
  const icons = {
    pdf: 'fas fa-file-pdf',
    doc: 'fas fa-file-word',
    xls: 'fas fa-file-excel',
    img: 'fas fa-file-image'
  }
  return icons[type] || 'fas fa-file'
}

const formatDate = (date) => {
  return date ? format(new Date(date), 'MMM d, yyyy') : 'N/A'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const fetchHistory = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await customersStore.fetchCustomerHistory(
      route.params.id,
      page.value,
      dateRange.value,
      selectedType.value
    )
    if (page.value === 1) {
      history.value = data.items
    } else {
      history.value.push(...data.items)
    }
    hasMore.value = data.hasMore
  } catch (err) {
    error.value = err.message || 'Failed to fetch history'
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  page.value++
  await fetchHistory()
}

const downloadAttachment = async (attachment) => {
  try {
    await customersStore.downloadAttachment(attachment.id)
  } catch (err) {
    error.value = err.message || 'Failed to download attachment'
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.customer-history {
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: white;
  color: #374151;
}

.loading-container,
.error-container,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
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

.history-timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 2rem;
  bottom: 0;
  width: 2px;
  background-color: #e5e7eb;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-header .title {
  font-weight: 500;
  color: #1f2937;
}

.timeline-header .date {
  font-size: 0.875rem;
  color: #6b7280;
}

.timeline-body {
  font-size: 0.875rem;
}

.timeline-body .description {
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.service-details,
.contract-details,
.payment-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.machine,
.technician {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.detail-row .label {
  color: #6b7280;
}

.detail-row .value {
  color: #1f2937;
  font-weight: 500;
}

.timeline-attachments {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 4px;
  margin-bottom: 0.25rem;
}

.attachment i {
  color: #6b7280;
}

.filename {
  flex: 1;
  font-size: 0.75rem;
  color: #4b5563;
}

.download-btn {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  padding: 0.25rem;
}

.download-btn:hover {
  color: #4f46e5;
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
  .customer-history {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filter-controls {
    width: 100%;
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }
}
</style> 