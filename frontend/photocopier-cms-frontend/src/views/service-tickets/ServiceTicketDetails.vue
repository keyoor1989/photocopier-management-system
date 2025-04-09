<template>
  <div class="service-ticket-details">
    <div class="details-header">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2>Service Ticket #{{ ticket.id }}</h2>
      </div>
      <div class="header-right">
        <button
          v-if="ticket.status !== 'completed'"
          @click="updateStatus"
          class="status-btn"
          :class="ticket.status"
        >
          {{ ticket.status }}
        </button>
        <button @click="editTicket" class="edit-btn">
          <i class="fas fa-edit"></i>
          Edit
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading ticket details...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="fetchTicketDetails" class="retry-btn">
        Retry
      </button>
    </div>

    <div v-else class="details-content">
      <div class="details-grid">
        <div class="details-card">
          <h3>Ticket Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Status</span>
              <span class="value" :class="ticket.status">{{ ticket.status }}</span>
            </div>
            <div class="info-item">
              <span class="label">Priority</span>
              <span class="value" :class="ticket.priority">{{ ticket.priority }}</span>
            </div>
            <div class="info-item">
              <span class="label">Created</span>
              <span class="value">{{ formatDate(ticket.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Updated</span>
              <span class="value">{{ formatDate(ticket.updatedAt) }}</span>
            </div>
          </div>
        </div>

        <div class="details-card">
          <h3>Customer Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Name</span>
              <span class="value">{{ ticket.customer.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Contact</span>
              <span class="value">{{ ticket.customer.contact }}</span>
            </div>
            <div class="info-item">
              <span class="label">Location</span>
              <span class="value">{{ ticket.customer.location }}</span>
            </div>
          </div>
        </div>

        <div class="details-card">
          <h3>Machine Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Model</span>
              <span class="value">{{ ticket.machine.model }}</span>
            </div>
            <div class="info-item">
              <span class="label">Serial Number</span>
              <span class="value">{{ ticket.machine.serialNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">Last Service</span>
              <span class="value">{{ formatDate(ticket.machine.lastService) }}</span>
            </div>
          </div>
        </div>

        <div class="details-card">
          <h3>Issue Description</h3>
          <p class="description">{{ ticket.description }}</p>
        </div>

        <div class="details-card">
          <h3>Service History</h3>
          <div class="history-list">
            <div
              v-for="entry in ticket.history"
              :key="entry.id"
              class="history-item"
            >
              <div class="history-header">
                <span class="history-date">{{ formatDate(entry.date) }}</span>
                <span class="history-status" :class="entry.status">
                  {{ entry.status }}
                </span>
              </div>
              <p class="history-notes">{{ entry.notes }}</p>
              <div class="history-technician">
                <i class="fas fa-user"></i>
                {{ entry.technician }}
              </div>
            </div>
          </div>
        </div>

        <div class="details-card">
          <h3>Parts Used</h3>
          <div class="parts-list">
            <div
              v-for="part in ticket.parts"
              :key="part.id"
              class="part-item"
            >
              <div class="part-info">
                <span class="part-name">{{ part.name }}</span>
                <span class="part-quantity">x{{ part.quantity }}</span>
              </div>
              <span class="part-cost">{{ formatCurrency(part.cost) }}</span>
            </div>
            <div class="parts-total">
              <span>Total Parts Cost:</span>
              <span>{{ formatCurrency(ticket.totalPartsCost) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/formatters'
import { useServiceTicketsStore } from '@/stores/serviceTickets'

const route = useRoute()
const router = useRouter()
const serviceTicketsStore = useServiceTicketsStore()

const loading = ref(false)
const error = ref(null)
const ticket = ref({
  id: '',
  status: '',
  priority: '',
  createdAt: '',
  updatedAt: '',
  description: '',
  customer: {
    name: '',
    contact: '',
    location: ''
  },
  machine: {
    model: '',
    serialNumber: '',
    lastService: ''
  },
  history: [],
  parts: [],
  totalPartsCost: 0
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

const goBack = () => {
  router.back()
}

const editTicket = () => {
  router.push(`/service-tickets/${route.params.id}/edit`)
}

const updateStatus = async () => {
  try {
    const nextStatus = {
      'open': 'in-progress',
      'in-progress': 'completed',
      'completed': 'open'
    }[ticket.value.status]

    await serviceTicketsStore.updateTicketStatus(route.params.id, nextStatus)
    ticket.value.status = nextStatus
  } catch (err) {
    console.error('Error updating ticket status:', err)
  }
}

const fetchTicketDetails = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await serviceTicketsStore.fetchTicketDetails(route.params.id)
    ticket.value = data
  } catch (err) {
    error.value = 'Failed to load ticket details'
    console.error('Error fetching ticket details:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTicketDetails()
})
</script>

<style scoped>
.service-ticket-details {
  padding: 2rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  padding: 0.5rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #e5e7eb;
}

.details-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.header-right {
  display: flex;
  gap: 1rem;
}

.status-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.status-btn.open {
  background-color: #fee2e2;
  color: #ef4444;
}

.status-btn.in-progress {
  background-color: #fef3c7;
  color: #f59e0b;
}

.status-btn.completed {
  background-color: #dcfce7;
  color: #10b981;
}

.edit-btn {
  padding: 0.5rem 1rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-btn:hover {
  background-color: #4f46e5;
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

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.details-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.details-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

.info-item .value.open {
  color: #ef4444;
}

.info-item .value.in-progress {
  color: #f59e0b;
}

.info-item .value.completed {
  color: #10b981;
}

.info-item .value.high {
  color: #ef4444;
}

.info-item .value.medium {
  color: #f59e0b;
}

.info-item .value.low {
  color: #10b981;
}

.description {
  color: #4b5563;
  line-height: 1.5;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 4px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.history-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  text-transform: capitalize;
}

.history-status.open {
  background-color: #fee2e2;
  color: #ef4444;
}

.history-status.in-progress {
  background-color: #fef3c7;
  color: #f59e0b;
}

.history-status.completed {
  background-color: #dcfce7;
  color: #10b981;
}

.history-notes {
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.history-technician {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.parts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.part-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 4px;
}

.part-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.part-name {
  font-weight: 500;
  color: #1f2937;
}

.part-quantity {
  font-size: 0.875rem;
  color: #6b7280;
}

.part-cost {
  font-weight: 500;
  color: #1f2937;
}

.parts-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-weight: 500;
  color: #1f2937;
}

@media (max-width: 768px) {
  .service-ticket-details {
    padding: 1rem;
  }

  .details-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style> 