<template>
  <form @submit.prevent="handleSubmit" class="machine-form">
    <h2>{{ isEditing ? 'Edit Machine' : 'Add New Machine' }}</h2>

    <div class="form-section">
      <h3>Basic Information</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="model">Model *</label>
          <input
            id="model"
            v-model="formData.model"
            type="text"
            required
            :class="{ error: errors.model }"
          />
          <span class="error-message" v-if="errors.model">{{ errors.model }}</span>
        </div>

        <div class="form-group">
          <label for="serialNumber">Serial Number *</label>
          <input
            id="serialNumber"
            v-model="formData.serialNumber"
            type="text"
            required
            :class="{ error: errors.serialNumber }"
          />
          <span class="error-message" v-if="errors.serialNumber">{{ errors.serialNumber }}</span>
        </div>

        <div class="form-group">
          <label for="status">Status *</label>
          <select
            id="status"
            v-model="formData.status"
            required
            :class="{ error: errors.status }"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
          <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
        </div>

        <div class="form-group">
          <label for="installationDate">Installation Date *</label>
          <input
            id="installationDate"
            v-model="formData.installationDate"
            type="date"
            required
            :class="{ error: errors.installationDate }"
          />
          <span class="error-message" v-if="errors.installationDate">{{ errors.installationDate }}</span>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3>Customer Information</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="customer">Customer Name *</label>
          <input
            id="customer"
            v-model="formData.customer"
            type="text"
            required
            :class="{ error: errors.customer }"
          />
          <span class="error-message" v-if="errors.customer">{{ errors.customer }}</span>
        </div>

        <div class="form-group">
          <label for="location">Location *</label>
          <input
            id="location"
            v-model="formData.location"
            type="text"
            required
            :class="{ error: errors.location }"
          />
          <span class="error-message" v-if="errors.location">{{ errors.location }}</span>
        </div>

        <div class="form-group">
          <label for="contactPerson">Contact Person *</label>
          <input
            id="contactPerson"
            v-model="formData.contactPerson"
            type="text"
            required
            :class="{ error: errors.contactPerson }"
          />
          <span class="error-message" v-if="errors.contactPerson">{{ errors.contactPerson }}</span>
        </div>

        <div class="form-group">
          <label for="contactNumber">Contact Number *</label>
          <input
            id="contactNumber"
            v-model="formData.contactNumber"
            type="tel"
            required
            :class="{ error: errors.contactNumber }"
          />
          <span class="error-message" v-if="errors.contactNumber">{{ errors.contactNumber }}</span>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn secondary" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn primary" :disabled="loading">
        {{ isEditing ? 'Update Machine' : 'Add Machine' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMachinesStore } from '@/stores/machines';
import { formatDateForInput } from '@/utils/dateFormatter';
import { useToast } from 'vue-toastification';

const props = defineProps({
  machineId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['cancel', 'saved']);
const store = useMachinesStore();
const toast = useToast();

const isEditing = computed(() => !!props.machineId);
const loading = ref(false);
const errors = ref({});

const formData = ref({
  model: '',
  serialNumber: '',
  status: 'active',
  installationDate: formatDateForInput(new Date()),
  customer: '',
  location: '',
  contactPerson: '',
  contactNumber: ''
});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.value.model) newErrors.model = 'Model is required';
  if (!formData.value.serialNumber) newErrors.serialNumber = 'Serial number is required';
  if (!formData.value.status) newErrors.status = 'Status is required';
  if (!formData.value.installationDate) newErrors.installationDate = 'Installation date is required';
  if (!formData.value.customer) newErrors.customer = 'Customer name is required';
  if (!formData.value.location) newErrors.location = 'Location is required';
  if (!formData.value.contactPerson) newErrors.contactPerson = 'Contact person is required';
  if (!formData.value.contactNumber) newErrors.contactNumber = 'Contact number is required';
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fill in all required fields');
    return;
  }

  loading.value = true;
  try {
    if (isEditing.value) {
      await store.updateMachine(props.machineId, formData.value);
      toast.success('Machine updated successfully');
    } else {
      await store.createMachine(formData.value);
      toast.success('Machine added successfully');
    }
    emit('saved');
  } catch (error) {
    toast.error(isEditing.value ? 'Failed to update machine' : 'Failed to add machine');
  } finally {
    loading.value = false;
  }
};

const loadMachine = async () => {
  if (props.machineId) {
    loading.value = true;
    try {
      await store.fetchMachine(props.machineId);
      const machine = store.selectedMachine;
      if (machine) {
        formData.value = {
          ...machine,
          installationDate: formatDateForInput(machine.installationDate)
        };
      }
    } catch (error) {
      toast.error('Failed to load machine details');
    } finally {
      loading.value = false;
    }
  }
};

onMounted(loadMachine);
</script>

<style scoped>
.machine-form {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.form-section {
  margin-bottom: 2rem;
}

h3 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #374151;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

input.error, select.error {
  border-color: #dc2626;
}

.error-message {
  font-size: 0.75rem;
  color: #dc2626;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background: #4f46e5;
  color: white;
  border: none;
}

.btn.primary:hover:not(:disabled) {
  background: #4338ca;
}

.btn.secondary {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn.secondary:hover {
  background: #f9fafb;
}
</style> 