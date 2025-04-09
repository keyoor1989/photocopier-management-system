<template>
  <div class="inventory-index">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Inventory Management</h1>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="exportInventory">
          <i class="fas fa-file-export me-1"></i> Export
        </button>
        <button class="btn btn-outline-success" @click="openImportModal">
          <i class="fas fa-file-import me-1"></i> Import
        </button>
        <button class="btn btn-primary" @click="openAddItemModal">
          <i class="fas fa-plus me-1"></i> Add Item
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search inventory..." 
                v-model="searchQuery"
                @input="debounceSearch"
              >
            </div>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.category">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.supplier">
              <option value="">All Suppliers</option>
              <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                {{ supplier.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.location">
              <option value="">All Locations</option>
              <option v-for="location in locations" :key="location._id" :value="location._id">
                {{ location.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.stockStatus">
              <option value="">All Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          <div class="col-md-1">
            <button class="btn btn-outline-secondary w-100" @click="resetFilters">
              <i class="fas fa-undo"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="text-nowrap" @click="sortBy('sku')">
                  SKU <i :class="getSortIcon('sku')"></i>
                </th>
                <th class="text-nowrap" @click="sortBy('name')">
                  Name <i :class="getSortIcon('name')"></i>
                </th>
                <th class="text-nowrap" @click="sortBy('category')">
                  Category <i :class="getSortIcon('category')"></i>
                </th>
                <th class="text-nowrap" @click="sortBy('quantity')">
                  Quantity <i :class="getSortIcon('quantity')"></i>
                </th>
                <th class="text-nowrap" @click="sortBy('price')">
                  Price <i :class="getSortIcon('price')"></i>
                </th>
                <th class="text-nowrap" @click="sortBy('location')">
                  Location <i :class="getSortIcon('location')"></i>
                </th>
                <th class="text-nowrap">Status</th>
                <th class="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="8" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredInventory.length === 0">
                <td colspan="8" class="text-center py-4">
                  No inventory items found
                </td>
              </tr>
              <tr v-for="item in paginatedItems" :key="item._id">
                <td class="text-nowrap">{{ item.sku }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <img 
                      v-if="item.image" 
                      :src="item.image" 
                      class="rounded me-2" 
                      width="40" 
                      height="40" 
                      alt=""
                    >
                    <div>
                      <div>{{ item.name }}</div>
                      <small class="text-muted">{{ item.barcode }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ getCategoryName(item.category) }}</td>
                <td>
                  <span :class="getStockLevelClass(item.quantity)">
                    {{ item.quantity }}
                  </span>
                </td>
                <td>{{ formatCurrency(item.price) }}</td>
                <td>{{ getLocationName(item.location) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(item)">
                    {{ getStockStatus(item) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-outline-primary" 
                      @click="viewItem(item)"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="adjustStock(item)"
                      title="Adjust Stock"
                    >
                      <i class="fas fa-boxes"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-info" 
                      @click="editItem(item)"
                      title="Edit Item"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="deleteItem(item)"
                      title="Delete Item"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalItems }} items
          </div>
          <nav aria-label="Inventory pagination">
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  <i class="fas fa-chevron-left"></i>
                </a>
              </li>
              <li 
                v-for="page in displayedPages" 
                :key="page" 
                class="page-item" 
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                  <i class="fas fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div class="modal fade" id="importModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Import Inventory</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="importFile" class="form-label">Select File (CSV or Excel)</label>
              <input 
                type="file" 
                class="form-control" 
                id="importFile" 
                accept=".csv,.xlsx,.xls"
                @change="handleFileChange"
              >
            </div>
            <div v-if="importProgress > 0 && importProgress < 100" class="mb-3">
              <div class="progress">
                <div 
                  class="progress-bar progress-bar-striped progress-bar-animated" 
                  role="progressbar" 
                  :style="{ width: importProgress + '%' }" 
                  :aria-valuenow="importProgress" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {{ importProgress }}%
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="importInventory"
              :disabled="!selectedFile || importProgress > 0"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Adjustment Modal -->
    <div class="modal fade" id="stockAdjustmentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adjust Stock Level</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Item: {{ selectedItem?.name }}</label>
              <div class="d-flex align-items-center">
                <span class="me-2">Current Stock:</span>
                <span :class="getStockLevelClass(selectedItem?.quantity)">
                  {{ selectedItem?.quantity }}
                </span>
              </div>
            </div>
            <div class="mb-3">
              <label for="adjustmentType" class="form-label">Adjustment Type</label>
              <select class="form-select" id="adjustmentType" v-model="adjustmentData.type">
                <option value="add">Add Stock</option>
                <option value="remove">Remove Stock</option>
                <option value="set">Set Stock Level</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="adjustmentQuantity" class="form-label">Quantity</label>
              <input 
                type="number" 
                class="form-control" 
                id="adjustmentQuantity" 
                v-model="adjustmentData.quantity"
                min="1"
              >
            </div>
            <div class="mb-3">
              <label for="adjustmentReason" class="form-label">Reason</label>
              <select class="form-select" id="adjustmentReason" v-model="adjustmentData.reason">
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
                <option value="damage">Damage</option>
                <option value="return">Return</option>
                <option value="adjustment">Stock Adjustment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="adjustmentReference" class="form-label">Reference Number</label>
              <input 
                type="text" 
                class="form-control" 
                id="adjustmentReference" 
                v-model="adjustmentData.reference"
                placeholder="Optional"
              >
            </div>
            <div class="mb-3">
              <label for="adjustmentNotes" class="form-label">Notes</label>
              <textarea 
                class="form-control" 
                id="adjustmentNotes" 
                v-model="adjustmentData.notes"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="submitStockAdjustment"
              :disabled="!isAdjustmentValid"
            >
              Submit Adjustment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the item <strong>{{ selectedItem?.name }}</strong>?</p>
            <p class="text-danger">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const inventoryStore = useInventoryStore()

// State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortField = ref('name')
const sortOrder = ref('asc')
const selectedFile = ref(null)
const selectedItem = ref(null)
const adjustmentData = ref({
  type: 'add',
  quantity: 1,
  reason: 'adjustment',
  reference: '',
  notes: ''
})

// Computed
const filters = computed(() => inventoryStore.filters)
const loading = computed(() => inventoryStore.loading)
const categories = computed(() => inventoryStore.categories)
const suppliers = computed(() => inventoryStore.suppliers)
const locations = computed(() => inventoryStore.locations)
const importProgress = computed(() => inventoryStore.importProgress)

const filteredInventory = computed(() => {
  let items = inventoryStore.filteredInventory

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query) ||
      item.barcode?.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  return [...items].sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]

    // Handle nested properties
    if (sortField.value === 'category') {
      aValue = getCategoryName(a.category)
      bValue = getCategoryName(b.category)
    } else if (sortField.value === 'location') {
      aValue = getLocationName(a.location)
      bValue = getLocationName(b.location)
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInventory.value.slice(start, end)
})

const totalItems = computed(() => filteredInventory.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginationStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
})

const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2))
  let end = Math.min(totalPages.value, start + maxDisplayed - 1)
  
  if (end - start + 1 < maxDisplayed) {
    start = Math.max(1, end - maxDisplayed + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const isAdjustmentValid = computed(() => {
  if (!adjustmentData.value.quantity || adjustmentData.value.quantity <= 0) return false
  if (adjustmentData.value.type === 'remove' && 
      adjustmentData.value.quantity > selectedItem.value?.quantity) return false
  return true
})

// Methods
function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
}

function sortBy(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

function getSortIcon(field) {
  if (sortField.value !== field) return 'fas fa-sort'
  return sortOrder.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
}

function getCategoryName(categoryId) {
  const category = categories.value.find(c => c._id === categoryId)
  return category ? category.name : 'Unknown'
}

function getLocationName(locationId) {
  const location = locations.value.find(l => l._id === locationId)
  return location ? location.name : 'Unknown'
}

function getStockLevelClass(quantity) {
  if (quantity === 0) return 'text-danger fw-bold'
  if (quantity <= inventoryStore.lowStockThreshold) return 'text-warning fw-bold'
  return 'text-success'
}

function getStockStatus(item) {
  if (item.quantity === 0) return 'Out of Stock'
  if (item.quantity <= inventoryStore.lowStockThreshold) return 'Low Stock'
  return 'In Stock'
}

function getStatusBadgeClass(item) {
  if (item.quantity === 0) return 'badge bg-danger'
  if (item.quantity <= inventoryStore.lowStockThreshold) return 'badge bg-warning'
  return 'badge bg-success'
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function resetFilters() {
  searchQuery.value = ''
  inventoryStore.setFilters({
    category: '',
    supplier: '',
    location: '',
    stockStatus: ''
  })
  currentPage.value = 1
}

function openImportModal() {
  selectedFile.value = null
  const modal = new bootstrap.Modal(document.getElementById('importModal'))
  modal.show()
}

function handleFileChange(event) {
  selectedFile.value = event.target.files[0]
}

async function importInventory() {
  if (!selectedFile.value) return
  
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  
  try {
    await inventoryStore.importInventory(formData)
    toast.success('Inventory imported successfully')
    const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'))
    modal.hide()
  } catch (error) {
    toast.error(`Failed to import inventory: ${error.message}`)
  }
}

function exportInventory() {
  inventoryStore.exportInventory()
}

function viewItem(item) {
  router.push(`/inventory/${item._id}`)
}

function editItem(item) {
  router.push(`/inventory/${item._id}/edit`)
}

function adjustStock(item) {
  selectedItem.value = item
  adjustmentData.value = {
    type: 'add',
    quantity: 1,
    reason: 'adjustment',
    reference: '',
    notes: ''
  }
  const modal = new bootstrap.Modal(document.getElementById('stockAdjustmentModal'))
  modal.show()
}

async function submitStockAdjustment() {
  if (!selectedItem.value || !isAdjustmentValid.value) return
  
  try {
    const data = {
      ...adjustmentData.value,
      quantity: adjustmentData.value.type === 'remove' 
        ? -adjustmentData.value.quantity 
        : adjustmentData.value.quantity
    }
    
    await inventoryStore.adjustStockLevel(selectedItem.value._id, data)
    toast.success('Stock level adjusted successfully')
    const modal = bootstrap.Modal.getInstance(document.getElementById('stockAdjustmentModal'))
    modal.hide()
  } catch (error) {
    toast.error(`Failed to adjust stock level: ${error.message}`)
  }
}

function deleteItem(item) {
  selectedItem.value = item
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'))
  modal.show()
}

async function confirmDelete() {
  if (!selectedItem.value) return
  
  try {
    await inventoryStore.deleteInventoryItem(selectedItem.value._id)
    toast.success('Item deleted successfully')
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'))
    modal.hide()
  } catch (error) {
    toast.error(`Failed to delete item: ${error.message}`)
  }
}

// Lifecycle hooks
onMounted(async () => {
  try {
    await Promise.all([
      inventoryStore.fetchInventoryItems(),
      inventoryStore.fetchCategories(),
      inventoryStore.fetchSuppliers(),
      inventoryStore.fetchLocations()
    ])
  } catch (error) {
    toast.error('Failed to load inventory data')
    console.error(error)
  }
})

// Watchers
let searchTimeout
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
.inventory-index {
  padding: 1.5rem;
}

.table th {
  cursor: pointer;
  user-select: none;
}

.table th i {
  margin-left: 0.5rem;
  opacity: 0.5;
}

.table th:hover i {
  opacity: 1;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .inventory-index {
    padding: 1rem;
  }
  
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .d-flex.gap-2 {
    width: 100%;
    justify-content: space-between;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .btn-group .btn {
    width: 100%;
    border-radius: 0.25rem !important;
  }
}
</style> 