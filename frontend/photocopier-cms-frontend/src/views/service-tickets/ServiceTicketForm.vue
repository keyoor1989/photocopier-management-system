<template>
  <div class="service-ticket-form">
    <h2 class="form-title">{{ isEditing ? 'Edit Service Ticket' : 'Create Service Ticket' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-section">
        <h3>Basic Information</h3>
        <div class="form-group">
          <label for="title">Title*</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            :class="{ error: errors.title }"
            placeholder="Brief description of the issue"
          />
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label for="description">Description*</label>
          <textarea
            id="description"
            v-model="formData.description"
            :class="{ error: errors.description }"
            rows="4"
            placeholder="Detailed description of the issue"
          ></textarea>
          <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priority">Priority*</label>
            <select
              id="priority"
              v-model="formData.priority"
              :class="{ error: errors.priority }"
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <span class="error-message" v-if="errors.priority">{{ errors.priority }}</span>
          </div>

          <div class="form-group">
            <label for="status">Status*</label>
            <select
              id="status"
              v-model="formData.status"
              :class="{ error: errors.status }"
            >
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Machine Information</h3>
        <div class="form-group">
          <label for="machine">Machine*</label>
          <select
            id="machine"
            v-model="formData.machineId"
            :class="{ error: errors.machineId }"
            @change="handleMachineChange"
          >
            <option value="">Select Machine</option>
            <option v-for="machine in machines" :key="machine.id" :value="machine.id">
              {{ machine.model }} - {{ machine.serialNumber }}
            </option>
          </select>
          <span class="error-message" v-if="errors.machineId">{{ errors.machineId }}</span>
        </div>

        <div class="machine-details" v-if="selectedMachine">
          <p><strong>Model:</strong> {{ selectedMachine.model }}</p>
          <p><strong>Serial Number:</strong> {{ selectedMachine.serialNumber }}</p>
          <p><strong>Location:</strong> {{ selectedMachine.location }}</p>
          <p><strong>Last Service:</strong> {{ formatDate(selectedMachine.lastServiceDate) }}</p>
        </div>
      </div>

      <div class="form-section">
        <h3>Assignment</h3>
        <div class="form-group">
          <label for="assignee">Assign To</label>
          <select
            id="assignee"
            v-model="formData.assigneeId"
            :class="{ error: errors.assigneeId }"
          >
            <option value="">Select Technician</option>
            <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
              {{ tech.name }}
            </option>
          </select>
          <span class="error-message" v-if="errors.assigneeId">{{ errors.assigneeId }}</span>
        </div>

        <div class="form-group">
          <label for="scheduledDate">Scheduled Date</label>
          <input
            type="datetime-local"
            id="scheduledDate"
            v-model="formData.scheduledDate"
            :class="{ error: errors.scheduledDate }"
            :min="minScheduledDate"
          />
          <span class="error-message" v-if="errors.scheduledDate">{{ errors.scheduledDate }}</span>
        </div>
      </div>

      <div class="form-section" v-if="formData.status === 'completed'">
        <h3>Resolution</h3>
        <div class="form-group">
          <label for="resolution">Resolution Notes*</label>
          <textarea
            id="resolution"
            v-model="formData.resolution"
            :class="{ error: errors.resolution }"
            rows="4"
            placeholder="Describe how the issue was resolved"
          ></textarea>
          <span class="error-message" v-if="errors.resolution">{{ errors.resolution }}</span>
        </div>

        <div class="form-group">
          <label for="partsUsed">Parts Used</label>
          <div class="parts-list">
            <div v-for="(part, index) in formData.partsUsed" :key="index" class="part-item">
              <input
                type="text"
                v-model="part.name"
                placeholder="Part name"
                class="part-name"
              />
              <input
                type="number"
                v-model="part.quantity"
                placeholder="Qty"
                min="1"
                class="part-quantity"
              />
              <button type="button" @click="removePart(index)" class="remove-part">×</button>
            </div>
          </div>
          <button type="button" @click="addPart" class="add-part-btn">
            Add Part
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="$router.back()" class="cancel-btn">
          Cancel
        </button>
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Ticket' : 'Create Ticket') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useServiceTicketsStore } from '@/stores/serviceTickets';
import { useMachinesStore } from '@/stores/machines';
import { useUsersStore } from '@/stores/users';
import { formatDate } from '@/utils/dateFormatter';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const serviceTicketsStore = useServiceTicketsStore();
const machinesStore = useMachinesStore();
const usersStore = useUsersStore();

const isEditing = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const machines = ref([]);
const technicians = ref([]);
const selectedMachine = ref(null);

const formData = ref({
  title: '',
  description: '',
  priority: '',
  status: '',
  machineId: '',
  assigneeId: '',
  scheduledDate: '',
  resolution: '',
  partsUsed: []
});

const errors = ref({});

const minScheduledDate = computed(() => {
  const now = new Date();
  return formatDate(now, 'YYYY-MM-DDTHH:mm');
});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.value.title?.trim()) {
    newErrors.title = 'Title is required';
  }
  
  if (!formData.value.description?.trim()) {
    newErrors.description = 'Description is required';
  }
  
  if (!formData.value.priority) {
    newErrors.priority = 'Priority is required';
  }
  
  if (!formData.value.status) {
    newErrors.status = 'Status is required';
  }
  
  if (!formData.value.machineId) {
    newErrors.machineId = 'Machine selection is required';
  }
  
  if (formData.value.status === 'completed' && !formData.value.resolution?.trim()) {
    newErrors.resolution = 'Resolution notes are required for completed tickets';
  }
  
  if (formData.value.scheduledDate) {
    const scheduledDate = new Date(formData.value.scheduledDate);
    const now = new Date();
    if (scheduledDate < now) {
      newErrors.scheduledDate = 'Scheduled date cannot be in the past';
    }
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleMachineChange = async () => {
  if (formData.value.machineId) {
    selectedMachine.value = machines.value.find(m => m.id === formData.value.machineId);
  } else {
    selectedMachine.value = null;
  }
};

const addPart = () => {
  formData.value.partsUsed.push({ name: '', quantity: 1 });
};

const removePart = (index) => {
  formData.value.partsUsed.splice(index, 1);
};

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fix the errors before submitting');
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    const ticketData = {
      ...formData.value,
      partsUsed: formData.value.partsUsed.filter(part => part.name.trim())
    };
    
    if (isEditing.value) {
      await serviceTicketsStore.updateTicket(route.params.id, ticketData);
      toast.success('Service ticket updated successfully');
    } else {
      await serviceTicketsStore.createTicket(ticketData);
      toast.success('Service ticket created successfully');
    }
    
    router.push('/service-tickets');
  } catch (error) {
    toast.error(error.message || 'Failed to save service ticket');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    // Load machines and technicians
    machines.value = await machinesStore.fetchMachines();
    technicians.value = await usersStore.fetchTechnicians();
    
    // Load ticket data if editing
    if (isEditing.value) {
      const ticket = await serviceTicketsStore.fetchTicket(route.params.id);
      formData.value = {
        ...ticket,
        partsUsed: ticket.partsUsed || []
      };
      if (ticket.machineId) {
        await handleMachineChange();
      }
    }
  } catch (error) {
    toast.error('Failed to load required data');
    router.push('/service-tickets');
  }
});
</script>

<style scoped>
.service-ticket-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #1f2937;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #374151;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.error {
  border-color: #dc2626;
}

.error-message {
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

.machine-details {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.machine-details p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.parts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.part-item {
  display: flex;
  gap: 0.5rem;
}

.part-name {
  flex: 1;
}

.part-quantity {
  width: 80px;
}

.remove-part {
  padding: 0 0.5rem;
  background: #fee2e2;
  border: 1px solid #dc2626;
  color: #dc2626;
  border-radius: 4px;
  cursor: pointer;
}

.add-part-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
}

.add-part-btn:hover {
  background: #e5e7eb;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.cancel-btn:hover {
  background: #f3f4f6;
}

.submit-btn {
  background: #6366f1;
  border: 1px solid #4f46e5;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .service-ticket-form {
    padding: 1rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style> 