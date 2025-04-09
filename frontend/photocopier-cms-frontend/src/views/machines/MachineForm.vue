<template>
  <div class="machine-form">
    <div class="page-header">
      <h1>{{ isEditing ? 'Edit Machine' : 'Add New Machine' }}</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-grid">
        <div class="form-section">
          <h2>Basic Information</h2>
          
          <div class="form-group">
            <label for="model" class="form-label">Model</label>
            <input 
              type="text" 
              id="model" 
              v-model="formData.model" 
              class="form-input"
              :class="{ 'error': errors.model }"
              required
            />
            <p v-if="errors.model" class="error-message">{{ errors.model }}</p>
          </div>

          <div class="form-group">
            <label for="serialNumber" class="form-label">Serial Number</label>
            <input 
              type="text" 
              id="serialNumber" 
              v-model="formData.serialNumber" 
              class="form-input"
              :class="{ 'error': errors.serialNumber }"
              required
            />
            <p v-if="errors.serialNumber" class="error-message">{{ errors.serialNumber }}</p>
          </div>

          <div class="form-group">
            <label for="status" class="form-label">Status</label>
            <select 
              id="status" 
              v-model="formData.status" 
              class="form-input"
              required
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="form-group">
            <label for="installationDate" class="form-label">Installation Date</label>
            <input 
              type="date" 
              id="installationDate" 
              v-model="formData.installationDate" 
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <h2>Customer Information</h2>
          
          <div class="form-group">
            <label for="customer" class="form-label">Customer</label>
            <input 
              type="text" 
              id="customer" 
              v-model="formData.customer" 
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="location" class="form-label">Location</label>
            <input 
              type="text" 
              id="location" 
              v-model="formData.location" 
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="contactPerson" class="form-label">Contact Person</label>
            <input 
              type="text" 
              id="contactPerson" 
              v-model="formData.contactPerson" 
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="contactNumber" class="form-label">Contact Number</label>
            <input 
              type="tel" 
              id="contactNumber" 
              v-model="formData.contactNumber" 
              class="form-input"
              required
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="handleCancel">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Machine' : 'Add Machine') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isEditing = !!route.params.id;

const formData = ref({
  model: '',
  serialNumber: '',
  status: 'active',
  installationDate: '',
  customer: '',
  location: '',
  contactPerson: '',
  contactNumber: ''
});

const errors = ref({});
const isSubmitting = ref(false);

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.value.model) {
    newErrors.model = 'Model is required';
  }
  
  if (!formData.value.serialNumber) {
    newErrors.serialNumber = 'Serial number is required';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    if (isEditing) {
      // Update existing machine
      console.log('Updating machine:', route.params.id, formData.value);
    } else {
      // Create new machine
      console.log('Creating new machine:', formData.value);
    }
    
    router.push('/app/machines');
  } catch (error) {
    console.error('Error saving machine:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/app/machines');
};

onMounted(async () => {
  if (isEditing) {
    // Fetch machine data if editing
    console.log('Fetching machine data for:', route.params.id);
    // Simulate API call
    formData.value = {
      model: 'Canon IR-2525',
      serialNumber: 'CNX12345',
      status: 'active',
      installationDate: '2023-01-15',
      customer: 'ABC Corp',
      location: '123 Business Street, City',
      contactPerson: 'John Doe',
      contactNumber: '(555) 123-4567'
    };
  }
});
</script>

<style scoped>
.machine-form {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: var(--text-primary);
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style> 