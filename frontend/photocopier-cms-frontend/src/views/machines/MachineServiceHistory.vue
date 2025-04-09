<template>
  <div class="machine-service-history">
    <div class="header">
      <div class="machine-info">
        <h2>Service History</h2>
        <div class="machine-details">
          <span class="model">{{ machine?.model }}</span>
          <span class="serial">Serial: {{ machine?.serialNumber }}</span>
        </div>
      </div>
      <div class="filter-controls">
        <select v-model="selectedType" class="filter-select">
          <option value="all">All Services</option>
          <option value="maintenance">Maintenance</option>
          <option value="repair">Repair</option>
          <option value="inspection">Inspection</option>
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
      <i class="fas fa-tools"></i>
      <p>No service history found for this machine</p>
    </div>

    <div v-else class="history-grid">
      <div v-for="service in filteredHistory" :key="service.id" class="service-card">
        <div class="service-header">
          <div class="service-type" :class="getTypeClass(service.type)">
            <i :class="getTypeIcon(service.type)"></i>
            {{ service.type }}
          </div>
          <div class="service-date">
            {{ formatDate(service.date) }}
          </div>
        </div>

        <div class="service-details">
          <div class="detail-section">
            <h3>Service Details</h3>
            <div class="detail-row">
              <span class="label">Technician:</span>
              <span class="value">{{ service.technician }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span class="value">{{ formatDuration(service.duration) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="badge" :class="getStatusClass(service.status)">
                {{ service.status }}
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h3>Description</h3>
            <p class="description">{{ service.description }}</p>
          </div>

          <div v-if="service.parts?.length" class="detail-section">
            <h3>Parts Used</h3>
            <div class="parts-list">
              <div v-for="part in service.parts" :key="part.id" class="part-item">
                <div class="part-info">
                  <span class="part-name">{{ part.name }}</span>
                  <span class="part-sku">SKU: {{ part.sku }}</span>
                </div>
                <div class="part-details">
                  <span class="quantity">Qty: {{ part.quantity }}</span>
                  <span class="cost">Cost: {{ formatCurrency(part.cost) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="service.notes?.length" class="detail-section">
            <h3>Technician Notes</h3>
            <div class="notes-list">
              <div v-for="note in service.notes" :key="note.id" class="note-item">
                <div class="note-header">
                  <span class="note-author">{{ note.author }}</span>
                  <span class="note-date">{{ formatDate(note.date) }}</span>
                </div>
                <p class="note-content">{{ note.content }}</p>
              </div>
            </div>
          </div>

          <div v-if="service.attachments?.length" class="detail-section">
            <h3>Attachments</h3>
            <div class="attachments-list">
              <div v-for="attachment in service.attachments" :key="attachment.id" class="attachment">
                <i :class="getFileIcon(attachment.type)"></i>
                <span class="filename">{{ attachment.name }}</span>
                <button @click="downloadAttachment(attachment)" class="download-btn">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="service-footer">
          <div class="service-cost">
            <span class="label">Total Cost:</span>
            <span class="value">{{ formatCurrency(service.totalCost) }}</span>
          </div>
          <button @click="createFollowUp(service)" class="btn-primary">
            <i class="fas fa-plus"></i>
            Create Follow-up
          </button>
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
import { useRoute, useRouter } from 'vue-router'
import { useMachinesStore } from '@/stores/machines'
import { useServiceTicketsStore } from '@/stores/serviceTickets'
import DateRangePicker from '@/components/reports/DateRangePicker.vue'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const machinesStore = useMachinesStore()
const serviceTicketsStore = useServiceTicketsStore()

const machine = ref(null)
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
    maintenance: 'bg-blue-100 text-blue-600',
    repair: 'bg-red-100 text-red-600',
    inspection: 'bg-green-100 text-green-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getTypeIcon = (type) => {
  const icons = {
    maintenance: 'fas fa-wrench',
    repair: 'fas fa-tools',
    inspection: 'fas fa-clipboard-check'
  }
  return icons[type] || 'fas fa-info-circle'
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800'
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

const formatDuration = (minutes) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const fetchMachine = async () => {
  try {
    machine.value = await machinesStore.fetchMachine(route.params.id)
  } catch (err) {
    error.value = err.message || 'Failed to fetch machine details'
  }
}

const fetchHistory = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await machinesStore.fetchServiceHistory(
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
    error.value = err.message || 'Failed to fetch service history'
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
    await machinesStore.downloadAttachment(attachment.id)
  } catch (err) {
    error.value = err.message || 'Failed to download attachment'
  }
}

const createFollowUp = (service) => {
  router.push({
    path: '/app/service-tickets/new',
    query: {
      machineId: route.params.id,
      followUpId: service.id
    }
  })
}

onMounted(async () => {
  await Promise.all([fetchMachine(), fetchHistory()])
})
</script>

<style scoped>
.machine-service-history {
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.machine-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.machine-details {
  display: flex;
  gap: 1rem;
  color: #6b7280;
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

.history-grid {
  display: grid;
  gap: 1.5rem;
}

.service-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.service-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.service-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.service-details {
  padding: 1rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.detail-row .label {
  color: #6b7280;
}

.detail-row .value {
  color: #1f2937;
  font-weight: 500;
}

.description {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
}

.parts-list,
.notes-list,
.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.part-item,
.note-item,
.attachment {
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 4px;
}

.part-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.part-name {
  font-weight: 500;
  color: #1f2937;
}

.part-sku {
  color: #6b7280;
  font-size: 0.75rem;
}

.part-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.note-author {
  font-weight: 500;
  color: #1f2937;
}

.note-date {
  color: #6b7280;
}

.note-content {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.attachment i {
  color: #6b7280;
}

.filename {
  flex: 1;
  font-size: 0.875rem;
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

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.service-cost {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-cost .label {
  color: #6b7280;
  font-size: 0.875rem;
}

.service-cost .value {
  font-weight: 600;
  color: #1f2937;
}

.btn-primary {
  padding: 0.5rem 1rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background-color: #4f46e5;
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
  .machine-service-history {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-controls {
    width: 100%;
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .service-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style> 