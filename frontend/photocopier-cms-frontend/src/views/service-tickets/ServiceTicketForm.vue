<template>
  <div class="service-ticket-form">
    <div class="form-header">
      <h2>{{ isEdit ? 'Edit Service Ticket' : 'Create Service Ticket' }}</h2>
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading form data...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="fetchFormData" class="retry-btn">
        Retry
      </button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="form-content">
      <div class="form-grid">
        <div class="form-section">
          <h3>Basic Information</h3>
          <div class="form-group">
            <label for="title">Title</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              placeholder="Enter ticket title"
            />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              required
              placeholder="Describe the issue"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="priority">Priority</label>
            <select id="priority" v-model="form.priority" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h3>Customer & Machine</h3>
          <div class="form-group">
            <label for="customer">Customer</label>
            <select
              id="customer"
              v-model="form.customerId"
              required
              @change="handleCustomerChange"
            >
              <option value="">Select a customer</option>
              <option
                v-for="customer in customers"
                :key="customer.id"
                :value="customer.id"
              >
                {{ customer.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="machine">Machine</label>
            <select
              id="machine"
              v-model="form.machineId"
              required
              :disabled="!form.customerId"
            >
              <option value="">Select a machine</option>
              <option
                v-for="machine in customerMachines"
                :key="machine.id"
                :value="machine.id"
              >
                {{ machine.model }} ({{ machine.serialNumber }})
              </option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h3>Service Details</h3>
          <div class="form-group">
            <label for="scheduledDate">Scheduled Date</label>
            <input
              id="scheduledDate"
              v-model="form.scheduledDate"
              type="datetime-local"
              required
            />
          </div>
          <div class="form-group">
            <label for="technician">Assigned Technician</label>
            <select id="technician" v-model="form.technicianId" required>
              <option value="">Select a technician</option>
              <option
                v-for="technician in technicians"
                :key="technician.id"
                :value="technician.id"
              >
                {{ technician.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="goBack" class="cancel-btn">
          Cancel
        </button>
        <button type="submit" class="submit-btn">
          {{ isEdit ? 'Update Ticket' : 'Create Ticket' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceTicketsStore } from '@/stores/serviceTickets'
import { useCustomersStore } from '@/stores/customers'
import { useTechniciansStore } from '@/stores/technicians'

const route = useRoute()
const router = useRouter()
const serviceTicketsStore = useServiceTicketsStore()
const customersStore = useCustomersStore()
const techniciansStore = useTechniciansStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const error = ref(null)
const customers = ref([])
const customerMachines = ref([])
const technicians = ref([])

const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  customerId: '',
  machineId: '',
  scheduledDate: '',
  technicianId: ''
})

const handleCustomerChange = async () => {
  form.value.machineId = ''
  if (form.value.customerId) {
    try {
      const machines = await customersStore.fetchCustomerMachines(form.value.customerId)
      customerMachines.value = machines
    } catch (err) {
      console.error('Error fetching customer machines:', err)
    }
  }
}

const fetchFormData = async () => {
  loading.value = true
  error.value = null

  try {
    const [customersData, techniciansData] = await Promise.all([
      customersStore.fetchCustomers(),
      techniciansStore.fetchTechnicians()
    ])

    customers.value = customersData
    technicians.value = techniciansData

    if (isEdit.value) {
      const ticket = await serviceTicketsStore.fetchTicketDetails(route.params.id)
      form.value = {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        customerId: ticket.customer.id,
        machineId: ticket.machine.id,
        scheduledDate: ticket.scheduledDate,
        technicianId: ticket.technician.id
      }
      await handleCustomerChange()
    }
  } catch (err) {
    error.value = 'Failed to load form data'
    console.error('Error fetching form data:', err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await serviceTicketsStore.updateTicket(route.params.id, form.value)
    } else {
      await serviceTicketsStore.createTicket(form.value)
    }
    router.push('/service-tickets')
  } catch (err) {
    console.error('Error submitting form:', err)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchFormData()
})
</script>

<style scoped>
.service-ticket-form {
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
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

.form-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #6366f1;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #4f46e5;
}

@media (max-width: 768px) {
  .service-ticket-form {
    padding: 1rem;
  }

  .form-content {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style> 