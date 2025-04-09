<template>
  <div class="machines-page">
    <div class="page-header">
      <h1>Machines</h1>
      <router-link to="/app/machines/new" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add Machine
      </router-link>
    </div>

    <div class="filters">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search machines..." 
        class="form-input"
      />
      <select v-model="statusFilter" class="form-input">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="maintenance">Maintenance</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Machine ID</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Last Service</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="machine in machines" :key="machine.id">
            <td>{{ machine.id }}</td>
            <td>{{ machine.model }}</td>
            <td>{{ machine.serialNumber }}</td>
            <td>{{ machine.customer }}</td>
            <td>
              <span :class="['status-badge', machine.status]">
                {{ machine.status }}
              </span>
            </td>
            <td>{{ formatDate(machine.lastService) }}</td>
            <td>
              <div class="actions">
                <router-link 
                  :to="`/app/machines/${machine.id}`" 
                  class="btn btn-icon"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </router-link>
                <router-link 
                  :to="`/app/machines/${machine.id}/edit`" 
                  class="btn btn-icon"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </router-link>
                <button 
                  @click="deleteMachine(machine.id)" 
                  class="btn btn-icon delete"
                  title="Delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--" 
        class="btn"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++" 
        class="btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Sample data - replace with actual API calls
const machines = ref([
  {
    id: 'M001',
    model: 'Canon IR-2525',
    serialNumber: 'CNX12345',
    customer: 'ABC Corp',
    status: 'active',
    lastService: '2024-03-15'
  },
  {
    id: 'M002',
    model: 'Xerox WorkCentre 7845',
    serialNumber: 'XRX98765',
    customer: 'XYZ Ltd',
    status: 'maintenance',
    lastService: '2024-03-10'
  }
]);

const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const totalPages = ref(5);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const deleteMachine = async (id) => {
  if (confirm('Are you sure you want to delete this machine?')) {
    // Add delete logic here
    console.log('Deleting machine:', id);
  }
};

onMounted(() => {
  // Fetch machines data
});
</script>

<style scoped>
.machines-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters .form-input {
  max-width: 250px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 500;
  color: var(--text-secondary);
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.maintenance {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  border-radius: 6px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #f3f4f6;
  color: var(--text-primary);
}

.btn-icon.delete:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination .btn {
  padding: 0.5rem 1rem;
}

.pagination span {
  color: var(--text-secondary);
}
</style> 