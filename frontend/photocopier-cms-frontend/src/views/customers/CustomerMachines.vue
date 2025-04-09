<template>
  <div class="customer-machines">
    <div class="header">
      <h2>Customer Machines</h2>
      <div class="actions">
        <button @click="addMachine" class="btn-primary">
          <i class="fas fa-plus"></i>
          Add Machine
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
        <button @click="fetchMachines" class="retry-btn">
          <i class="fas fa-sync-alt"></i>
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="machines.length === 0" class="empty-state">
      <i class="fas fa-print"></i>
      <p>No machines found for this customer</p>
      <button @click="addMachine" class="btn-primary">
        Add First Machine
      </button>
    </div>

    <div v-else class="machines-grid">
      <div v-for="machine in machines" :key="machine.id" class="machine-card">
        <div class="machine-header">
          <div class="machine-info">
            <h3>{{ machine.model }}</h3>
            <span class="serial-number">Serial: {{ machine.serialNumber }}</span>
          </div>
          <div class="machine-status" :class="getStatusClass(machine.status)">
            {{ machine.status }}
          </div>
        </div>

        <div class="machine-details">
          <div class="detail-row">
            <span class="label">Installation Date</span>
            <span class="value">{{ formatDate(machine.installationDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Last Service</span>
            <span class="value">{{ formatDate(machine.lastServiceDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Page Count</span>
            <span class="value">{{ formatNumber(machine.pageCount) }}</span>
          </div>
        </div>

        <div class="machine-metrics">
          <div class="metric">
            <span class="label">Service Tickets</span>
            <span class="value">{{ machine.serviceTicketsCount }}</span>
          </div>
          <div class="metric">
            <span class="label">Avg. Response Time</span>
            <span class="value">{{ formatDuration(machine.avgResponseTime) }}</span>
          </div>
          <div class="metric">
            <span class="label">Uptime</span>
            <span class="value">{{ machine.uptime }}%</span>
          </div>
        </div>

        <div class="machine-actions">
          <button @click="viewServiceHistory(machine)" class="btn-secondary">
            <i class="fas fa-history"></i>
            Service History
          </button>
          <button @click="createServiceTicket(machine)" class="btn-primary">
            <i class="fas fa-tools"></i>
            Create Ticket
          </button>
        </div>
      </div>
    </div>

    <!-- Service History Modal -->
    <div v-if="selectedMachine" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Service History - {{ selectedMachine.model }}</h3>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="serviceHistoryLoading" class="loading-container">
            <div class="spinner"></div>
          </div>
          <div v-else-if="serviceHistoryError" class="error-container">
            <div class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              <p>{{ serviceHistoryError }}</p>
              <button @click="fetchServiceHistory" class="retry-btn">
                <i class="fas fa-sync-alt"></i>
                Retry
              </button>
            </div>
          </div>
          <div v-else class="service-history">
            <div v-for="service in serviceHistory" :key="service.id" class="service-item">
              <div class="service-header">
                <span class="date">{{ formatDate(service.date) }}</span>
                <span class="status" :class="getStatusClass(service.status)">
                  {{ service.status }}
                </span>
              </div>
              <div class="service-details">
                <p class="description">{{ service.description }}</p>
                <div class="technician">
                  <i class="fas fa-user"></i>
                  {{ service.technician }}
                </div>
              </div>
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
import { useCustomersStore } from '@/stores/customers'
import { useServiceTicketsStore } from '@/stores/serviceTickets'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const customersStore = useCustomersStore()
const serviceTicketsStore = useServiceTicketsStore()

const machines = ref([])
const loading = ref(false)
const error = ref(null)
const selectedMachine = ref(null)
const serviceHistory = ref([])
const serviceHistoryLoading = ref(false)
const serviceHistoryError = ref(null)

const fetchMachines = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await customersStore.fetchCustomerMachines(route.params.id)
    machines.value = data
  } catch (err) {
    error.value = err.message || 'Failed to fetch machines'
  } finally {
    loading.value = false
  }
}

const fetchServiceHistory = async () => {
  if (!selectedMachine.value) return

  serviceHistoryLoading.value = true
  serviceHistoryError.value = null

  try {
    const data = await serviceTicketsStore.fetchMachineServiceHistory(selectedMachine.value.id)
    serviceHistory.value = data
  } catch (err) {
    serviceHistoryError.value = err.message || 'Failed to fetch service history'
  } finally {
    serviceHistoryLoading.value = false
  }
}

const viewServiceHistory = (machine) => {
  selectedMachine.value = machine
  fetchServiceHistory()
}

const closeModal = () => {
  selectedMachine.value = null
  serviceHistory.value = []
}

const addMachine = () => {
  router.push(`/app/customers/${route.params.id}/machines/new`)
}

const createServiceTicket = (machine) => {
  router.push({
    path: '/app/service-tickets/new',
    query: { machineId: machine.id, customerId: route.params.id }
  })
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    'under-service': 'bg-yellow-100 text-yellow-800',
    retired: 'bg-gray-100 text-gray-800',
    'needs-attention': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return date ? format(new Date(date), 'MMM d, yyyy') : 'N/A'
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDuration = (minutes) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

onMounted(() => {
  fetchMachines()
})
</script>

<style scoped>
.customer-machines {
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

.machines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.machine-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.machine-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.machine-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.serial-number {
  font-size: 0.875rem;
  color: #6b7280;
}

.machine-status {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.machine-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.detail-row .label {
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-row .value {
  color: #1f2937;
  font-weight: 500;
}

.machine-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 4px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric .label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.metric .value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.machine-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
}

.btn-primary:hover {
  background-color: #4f46e5;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-body {
  padding: 1rem;
}

.service-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-item {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 4px;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.service-header .date {
  font-size: 0.875rem;
  color: #6b7280;
}

.service-header .status {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.service-details {
  font-size: 0.875rem;
}

.service-details .description {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.service-details .technician {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .customer-machines {
    padding: 1rem;
  }

  .machines-grid {
    grid-template-columns: 1fr;
  }

  .machine-metrics {
    grid-template-columns: 1fr;
  }

  .machine-actions {
    flex-direction: column;
  }
}
</style> 