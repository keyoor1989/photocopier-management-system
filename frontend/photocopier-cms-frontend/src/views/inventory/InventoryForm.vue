<template>
  <div class="inventory-form">
    <div class="form-header">
      <h1>{{ isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item' }}</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Saving inventory item...</p>
      </div>

      <div class="form-grid">
        <!-- Basic Information -->
        <div class="form-section">
          <h2>Basic Information</h2>
          
          <div class="form-group">
            <label for="itemName">Item Name *</label>
            <input
              id="itemName"
              v-model="formData.itemName"
              type="text"
              :class="{ 'error': errors.itemName }"
              placeholder="Enter item name"
            />
            <span v-if="errors.itemName" class="error-message">{{ errors.itemName }}</span>
          </div>

          <div class="form-group">
            <label for="brand">Brand *</label>
            <input
              id="brand"
              v-model="formData.brand"
              type="text"
              :class="{ 'error': errors.brand }"
              placeholder="Enter brand name"
            />
            <span v-if="errors.brand" class="error-message">{{ errors.brand }}</span>
          </div>

          <div class="form-group">
            <label for="modelNumber">Model Number *</label>
            <input
              id="modelNumber"
              v-model="formData.modelNumber"
              type="text"
              :class="{ 'error': errors.modelNumber }"
              placeholder="Enter model number"
            />
            <span v-if="errors.modelNumber" class="error-message">{{ errors.modelNumber }}</span>
          </div>

          <div class="form-group">
            <label for="category">Category *</label>
            <select
              id="category"
              v-model="formData.category"
              :class="{ 'error': errors.category }"
            >
              <option value="">Select a category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
            <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
          </div>
        </div>

        <!-- Stock Information -->
        <div class="form-section">
          <h2>Stock Information</h2>
          
          <div class="form-group">
            <label for="quantity">Quantity *</label>
            <input
              id="quantity"
              v-model.number="formData.quantity"
              type="number"
              min="0"
              :class="{ 'error': errors.quantity }"
              placeholder="Enter quantity"
            />
            <span v-if="errors.quantity" class="error-message">{{ errors.quantity }}</span>
          </div>

          <div class="form-group">
            <label for="costPrice">Cost Price *</label>
            <div class="input-with-prefix">
              <span class="prefix">$</span>
              <input
                id="costPrice"
                v-model.number="formData.costPrice"
                type="number"
                min="0"
                step="0.01"
                :class="{ 'error': errors.costPrice }"
                placeholder="Enter cost price"
              />
            </div>
            <span v-if="errors.costPrice" class="error-message">{{ errors.costPrice }}</span>
          </div>

          <div class="form-group">
            <label for="sellingPrice">Selling Price *</label>
            <div class="input-with-prefix">
              <span class="prefix">$</span>
              <input
                id="sellingPrice"
                v-model.number="formData.sellingPrice"
                type="number"
                min="0"
                step="0.01"
                :class="{ 'error': errors.sellingPrice }"
                placeholder="Enter selling price"
              />
            </div>
            <span v-if="errors.sellingPrice" class="error-message">{{ errors.sellingPrice }}</span>
          </div>

          <div class="form-group">
            <label for="supplierName">Supplier Name *</label>
            <input
              id="supplierName"
              v-model="formData.supplierName"
              type="text"
              :class="{ 'error': errors.supplierName }"
              placeholder="Enter supplier name"
            />
            <span v-if="errors.supplierName" class="error-message">{{ errors.supplierName }}</span>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="form-section">
          <h2>Additional Information</h2>
          
          <div class="form-group">
            <label for="dateAdded">Date Added *</label>
            <input
              id="dateAdded"
              v-model="formData.dateAdded"
              type="date"
              :class="{ 'error': errors.dateAdded }"
            />
            <span v-if="errors.dateAdded" class="error-message">{{ errors.dateAdded }}</span>
          </div>

          <div class="form-group">
            <label for="remarks">Remarks</label>
            <textarea
              id="remarks"
              v-model="formData.remarks"
              rows="4"
              :class="{ 'error': errors.remarks }"
              placeholder="Enter any additional remarks"
            ></textarea>
            <span v-if="errors.remarks" class="error-message">{{ errors.remarks }}</span>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn-secondary">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ isEditMode ? 'Update Item' : 'Add Item' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInventoryStore } from '@/stores/inventory';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const inventoryStore = useInventoryStore();

const loading = ref(false);
const errors = ref({});

const categories = [
  'Spare',
  'Toner',
  'Machine',
  'Accessory'
];

const formData = ref({
  itemName: '',
  brand: '',
  modelNumber: '',
  category: '',
  quantity: 0,
  costPrice: 0,
  sellingPrice: 0,
  supplierName: '',
  dateAdded: new Date().toISOString().split('T')[0],
  remarks: ''
});

const isEditMode = computed(() => route.params.id !== undefined);

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.itemName.trim()) {
    errors.value.itemName = 'Item name is required';
    isValid = false;
  }

  if (!formData.value.brand.trim()) {
    errors.value.brand = 'Brand is required';
    isValid = false;
  }

  if (!formData.value.modelNumber.trim()) {
    errors.value.modelNumber = 'Model number is required';
    isValid = false;
  }

  if (!formData.value.category) {
    errors.value.category = 'Category is required';
    isValid = false;
  }

  if (formData.value.quantity < 0) {
    errors.value.quantity = 'Quantity cannot be negative';
    isValid = false;
  }

  if (formData.value.costPrice < 0) {
    errors.value.costPrice = 'Cost price cannot be negative';
    isValid = false;
  }

  if (formData.value.sellingPrice < 0) {
    errors.value.sellingPrice = 'Selling price cannot be negative';
    isValid = false;
  }

  if (formData.value.sellingPrice < formData.value.costPrice) {
    errors.value.sellingPrice = 'Selling price cannot be less than cost price';
    isValid = false;
  }

  if (!formData.value.supplierName.trim()) {
    errors.value.supplierName = 'Supplier name is required';
    isValid = false;
  }

  if (!formData.value.dateAdded) {
    errors.value.dateAdded = 'Date added is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    if (isEditMode.value) {
      await inventoryStore.updateInventoryItem(route.params.id, formData.value);
      toast.success('Inventory item updated successfully');
    } else {
      await inventoryStore.createInventoryItem(formData.value);
      toast.success('Inventory item added successfully');
    }
    router.push('/app/inventory');
  } catch (error) {
    toast.error(error.message || 'Failed to save inventory item');
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push('/app/inventory');
};

const fetchInventoryItem = async (id) => {
  loading.value = true;
  try {
    const item = await inventoryStore.fetchInventoryItem(id);
    formData.value = {
      ...item,
      dateAdded: new Date(item.dateAdded).toISOString().split('T')[0]
    };
  } catch (error) {
    toast.error('Failed to load inventory item');
    router.push('/app/inventory');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (isEditMode.value) {
    fetchInventoryItem(route.params.id);
  }
});
</script>

<style scoped>
.inventory-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.form-container {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 8px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
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
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.input-with-prefix {
  position: relative;
}

.input-with-prefix .prefix {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
}

.input-with-prefix input {
  padding-left: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #6366f1;
  border: 1px solid #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4f46e5;
}

.btn-primary:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

@media (max-width: 768px) {
  .inventory-form {
    padding: 1rem;
  }

  .form-container {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style> 