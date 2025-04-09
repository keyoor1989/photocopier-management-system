<template>
  <div class="customer-list">
    <div class="header">
      <h1>Customers</h1>
      <router-link to="/customers/new" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add Customer
      </router-link>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search customers..."
          @input="handleSearch"
          class="form-control"
        />
        <i class="fas fa-search search-icon"></i>
      </div>

      <div class="filter-options">
        <select v-model="statusFilter" @change="handleFilterChange" class="form-select">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>

        <select v-model="sortBy" @change="handleSortChange" class="form-select">
          <option value="name">Name</option>
          <option value="createdAt">Date Added</option>
          <option value="lastContact">Last Contact</option>
        </select>

        <button
          @click="toggleSortOrder"
          class="btn btn-outline-secondary"
          :title="sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
        >
          <i :class="sortOrder === 'asc' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'"></i>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      <button @click="fetchCustomers" class="btn btn-outline-primary">
        Try Again
      </button>
    </div>

    <!-- Customer List -->
    <div v-else class="customer-grid">
      <div v-if="customers.length === 0" class="no-results">
        <i class="fas fa-users fa-3x"></i>
        <p>No customers found</p>
      </div>

      <div
        v-for="customer in customers"
        :key="customer.id"
        class="customer-card"
        @click="navigateToCustomer(customer.id)"
      >
        <div class="customer-header">
          <h3>{{ customer.name }}</h3>
          <span :class="['status-badge', customer.status]">
            {{ customer.status }}
          </span>
        </div>

        <div class="customer-info">
          <p><i class="fas fa-building"></i> {{ customer.company }}</p>
          <p><i class="fas fa-envelope"></i> {{ customer.email }}</p>
          <p><i class="fas fa-phone"></i> {{ customer.phone }}</p>
        </div>

        <div class="customer-stats">
          <div class="stat">
            <i class="fas fa-print"></i>
            <span>{{ customer.machines?.length || 0 }} Machines</span>
          </div>
          <div class="stat">
            <i class="fas fa-sticky-note"></i>
            <span>{{ customer.notes?.length || 0 }} Notes</span>
          </div>
        </div>

        <div class="customer-footer">
          <span class="last-contact">
            Last Contact: {{ formatDate(customer.lastContact) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="customers.length > 0" class="pagination">
      <button
        @click="handlePageChange(pagination.currentPage - 1)"
        :disabled="pagination.currentPage === 1"
        class="btn btn-outline-primary"
      >
        <i class="fas fa-chevron-left"></i> Previous
      </button>

      <span class="page-info">
        Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
      </span>

      <button
        @click="handlePageChange(pagination.currentPage + 1)"
        :disabled="pagination.currentPage === pagination.totalPages"
        class="btn btn-outline-primary"
      >
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { formatDate } from '@/utils/dateFormatter'

const router = useRouter()
const customerStore = useCustomerStore()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')

// Computed properties from store
const customers = computed(() => customerStore.filteredCustomers)
const isLoading = computed(() => customerStore.isLoading)
const error = computed(() => customerStore.error)
const pagination = computed(() => customerStore.pagination)

// Methods
const handleSearch = debounce(() => {
  customerStore.setFilters({ search: searchQuery.value })
  customerStore.fetchCustomers()
}, 300)

const handleFilterChange = () => {
  customerStore.setFilters({
    status: statusFilter.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
  customerStore.fetchCustomers()
}

const handleSortChange = () => {
  customerStore.setFilters({
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
  customerStore.fetchCustomers()
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  customerStore.setFilters({ sortOrder: sortOrder.value })
  customerStore.fetchCustomers()
}

const handlePageChange = (page) => {
  customerStore.setPagination({ currentPage: page })
  customerStore.fetchCustomers()
}

const navigateToCustomer = (id) => {
  router.push(`/customers/${id}`)
}

// Lifecycle hooks
onMounted(() => {
  customerStore.fetchCustomers()
})

// Watch for filter changes
watch([searchQuery, statusFilter, sortBy, sortOrder], () => {
  customerStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
  customerStore.fetchCustomers()
})
</script>

<style scoped>
.customer-list {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.customer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.customer-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.customer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.customer-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.customer-info {
  margin-bottom: 1rem;
}

.customer-info p {
  margin: 0.5rem 0;
  color: #6c757d;
}

.customer-info i {
  width: 1.5rem;
  margin-right: 0.5rem;
}

.customer-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
}

.customer-footer {
  font-size: 0.875rem;
  color: #6c757d;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  color: #6c757d;
}

.loading-state,
.error-state,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #6c757d;
}

.no-results i {
  margin-bottom: 1rem;
}
</style> 