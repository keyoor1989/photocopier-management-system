<template>
  <div class="customer-form">
    <h1>{{ isEdit ? 'Edit Customer' : 'Add New Customer' }}</h1>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="phone">Phone *</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          required
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="company">Company</label>
        <input
          type="text"
          id="company"
          v-model="formData.company"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="address">Address *</label>
        <textarea
          id="address"
          v-model="formData.address"
          required
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="branch">Branch</label>
        <select id="branch" v-model="formData.branch" class="form-control">
          <option value="">Select Branch</option>
          <!-- Branch options will be populated dynamically -->
        </select>
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? 'Update' : 'Create' }} Customer
        </button>
        <button type="button" class="btn btn-secondary" @click="handleCancel">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'CustomerForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isEdit = computed(() => route.params.id !== undefined);

    const formData = ref({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      branch: '',
      notes: '',
      status: 'active'
    });

    const handleSubmit = async () => {
      try {
        // TODO: Implement form submission logic
        console.log('Form submitted:', formData.value);
        router.push('/customers');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    const handleCancel = () => {
      router.push('/customers');
    };

    return {
      formData,
      isEdit,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<style scoped>
.customer-form {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style> 