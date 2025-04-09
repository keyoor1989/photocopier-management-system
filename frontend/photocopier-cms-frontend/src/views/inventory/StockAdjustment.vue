<template>
  <div class="stock-adjustment">
    <div class="page-header">
      <h2>Stock Adjustment</h2>
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading inventory items...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="fetchInventoryItems" class="retry-btn">
        Retry
      </button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="adjustment-form">
      <div class="form-group">
        <label for="item">Inventory Item</label>
        <select
          id="item"
          v-model="form.itemId"
          required
          @change="handleItemChange"
        >
          <option value="">Select an item</option>
          <option
            v-for="item in inventoryItems"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }} (Current Stock: {{ item.quantity }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="adjustmentType">Adjustment Type</label>
        <select
          id="adjustmentType"
          v-model="form.adjustmentType"
          required
        >
          <option value="add">Add Stock</option>
          <option value="remove">Remove Stock</option>
        </select>
      </div>

      <div class="form-group">
        <label for="quantity">Quantity</label>
        <input
          id="quantity"
          v-model.number="form.quantity"
          type="number"
          min="1"
          required
          placeholder="Enter quantity"
        />
      </div>

      <div class="form-group">
        <label for="reason">Reason</label>
        <select
          id="reason"
          v-model="form.reason"
          required
        >
          <option value="">Select a reason</option>
          <option value="damaged">Damaged Items</option>
          <option value="lost">Lost Items</option>
          <option value="return">Customer Return</option>
          <option value="restock">Restock</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="4"
          placeholder="Add any additional notes"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="goBack" class="cancel-btn">
          Cancel
        </button>
        <button type="submit" class="submit-btn">
          Submit Adjustment
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()

const loading = ref(false)
const error = ref(null)
const inventoryItems = ref([])

const form = ref({
  itemId: '',
  adjustmentType: 'add',
  quantity: 1,
  reason: '',
  notes: ''
})

const fetchInventoryItems = async () => {
  loading.value = true
  error.value = null

  try {
    inventoryItems.value = await inventoryStore.fetchInventoryItems()
  } catch (err) {
    error.value = 'Failed to load inventory items'
    console.error('Error fetching inventory items:', err)
  } finally {
    loading.value = false
  }
}

const handleItemChange = () => {
  const selectedItem = inventoryItems.value.find(item => item.id === form.value.itemId)
  if (selectedItem) {
    form.value.quantity = 1
  }
}

const handleSubmit = async () => {
  try {
    await inventoryStore.adjustStock({
      itemId: form.value.itemId,
      adjustmentType: form.value.adjustmentType,
      quantity: form.value.quantity,
      reason: form.value.reason,
      notes: form.value.notes
    })
    router.push('/inventory')
  } catch (err) {
    console.error('Error submitting adjustment:', err)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchInventoryItems()
})
</script>

<style scoped>
.stock-adjustment {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
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

.adjustment-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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
  margin-top: 2rem;
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
  .stock-adjustment {
    padding: 1rem;
  }

  .adjustment-form {
    padding: 1rem;
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