<template>
  <div class="branch-management">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>Branch Management</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="fas fa-plus"></i> Add Branch
      </button>
    </div>

    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search branches..."
          @input="handleSearch"
        />
      </div>
      <div class="filter-group">
        <select v-model="statusFilter" @change="handleFilter">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading branches...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchBranches" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else class="branches-grid">
      <div v-for="branch in paginatedBranches" :key="branch.id" class="branch-card">
        <div class="branch-header">
          <h3>{{ branch.name }}</h3>
          <span class="status-badge" :class="{ active: branch.status === 'active' }">
            {{ branch.status }}
          </span>
        </div>
        <div class="branch-details">
          <div class="detail-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ branch.address }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-phone"></i>
            <span>{{ branch.phone }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-envelope"></i>
            <span>{{ branch.email }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-users"></i>
            <span>{{ branch.userCount }} users</span>
          </div>
        </div>
        <div class="branch-actions">
          <button class="btn-icon" @click="openEditModal(branch)" title="Edit Branch">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" @click="openAssignUsersModal(branch)" title="Assign Users">
            <i class="fas fa-user-plus"></i>
          </button>
          <button
            class="btn-icon"
            :class="{ danger: branch.status === 'active' }"
            @click="toggleBranchStatus(branch)"
            :title="branch.status === 'active' ? 'Deactivate' : 'Activate'"
          >
            <i
              class="fas"
              :class="branch.status === 'active' ? 'fa-toggle-off' : 'fa-toggle-on'"
            ></i>
          </button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button
        class="btn btn-secondary"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </button>
    </div>

    <!-- Create Branch Modal -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Branch</h2>
          <button class="btn-icon" @click="closeCreateModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="createBranch" class="modal-form">
          <div class="form-group">
            <label for="newName">Branch Name</label>
            <input
              type="text"
              id="newName"
              v-model="newBranch.name"
              required
            />
          </div>
          <div class="form-group">
            <label for="newAddress">Address</label>
            <textarea
              id="newAddress"
              v-model="newBranch.address"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="newPhone">Phone Number</label>
            <input
              type="tel"
              id="newPhone"
              v-model="newBranch.phone"
              required
            />
          </div>
          <div class="form-group">
            <label for="newEmail">Email</label>
            <input
              type="email"
              id="newEmail"
              v-model="newBranch.email"
              required
            />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeCreateModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              {{ creating ? 'Creating...' : 'Create Branch' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Branch Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Branch</h2>
          <button class="btn-icon" @click="closeEditModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="updateBranch" class="modal-form">
          <div class="form-group">
            <label for="editName">Branch Name</label>
            <input
              type="text"
              id="editName"
              v-model="editingBranch.name"
              required
            />
          </div>
          <div class="form-group">
            <label for="editAddress">Address</label>
            <textarea
              id="editAddress"
              v-model="editingBranch.address"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="editPhone">Phone Number</label>
            <input
              type="tel"
              id="editPhone"
              v-model="editingBranch.phone"
              required
            />
          </div>
          <div class="form-group">
            <label for="editEmail">Email</label>
            <input
              type="email"
              id="editEmail"
              v-model="editingBranch.email"
              required
            />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="updating">
              {{ updating ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Assign Users Modal -->
    <div v-if="showAssignUsersModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Assign Users to {{ editingBranch.name }}</h2>
          <button class="btn-icon" @click="closeAssignUsersModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-form">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="userSearchQuery"
              placeholder="Search users..."
            />
          </div>
          <div class="users-list">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="user-item"
              :class="{ selected: isUserSelected(user) }"
              @click="toggleUserSelection(user)"
            >
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
              <div class="user-role">
                <span class="role-badge" :class="user.role.toLowerCase()">
                  {{ user.role }}
                </span>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeAssignUsersModal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveUserAssignments"
              :disabled="savingAssignments"
            >
              {{ savingAssignments ? 'Saving...' : 'Save Assignments' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 9

const branches = ref([])
const users = ref([])
const selectedUsers = ref(new Set())

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showAssignUsersModal = ref(false)
const creating = ref(false)
const updating = ref(false)
const savingAssignments = ref(false)
const userSearchQuery = ref('')

const newBranch = ref({
  name: '',
  address: '',
  phone: '',
  email: ''
})

const editingBranch = ref({
  id: '',
  name: '',
  address: '',
  phone: '',
  email: ''
})

const goBack = () => {
  router.back()
}

const fetchBranches = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch branches
    // For now, using mock data
    branches.value = [
      {
        id: 1,
        name: 'Main Branch',
        address: '123 Main St, City, Country',
        phone: '+1 234 567 8900',
        email: 'main@example.com',
        status: 'active',
        userCount: 5
      },
      {
        id: 2,
        name: 'Downtown Branch',
        address: '456 Downtown Ave, City, Country',
        phone: '+1 234 567 8901',
        email: 'downtown@example.com',
        status: 'active',
        userCount: 3
      }
    ]
  } catch (err) {
    error.value = 'Failed to load branches. Please try again.'
    console.error('Error fetching branches:', err)
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    // TODO: Implement API call to fetch users
    // For now, using mock data
    users.value = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Administrator'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Manager'
      }
    ]
  } catch (err) {
    console.error('Error fetching users:', err)
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const filteredBranches = computed(() => {
  return branches.value.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || branch.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredBranches.value.length / pageSize)
})

const paginatedBranches = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredBranches.value.slice(start, end)
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    return user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
  })
})

// Modal handlers
const openCreateModal = () => {
  newBranch.value = { name: '', address: '', phone: '', email: '' }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const openEditModal = (branch) => {
  editingBranch.value = { ...branch }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const openAssignUsersModal = async (branch) => {
  editingBranch.value = { ...branch }
  selectedUsers.value = new Set()
  await fetchUsers()
  showAssignUsersModal.value = true
}

const closeAssignUsersModal = () => {
  showAssignUsersModal.value = false
}

const isUserSelected = (user) => {
  return selectedUsers.value.has(user.id)
}

const toggleUserSelection = (user) => {
  if (selectedUsers.value.has(user.id)) {
    selectedUsers.value.delete(user.id)
  } else {
    selectedUsers.value.add(user.id)
  }
}

// Branch actions
const createBranch = async () => {
  creating.value = true
  try {
    // TODO: Implement API call to create branch
    console.log('Creating branch:', newBranch.value)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeCreateModal()
    fetchBranches()
  } catch (err) {
    error.value = 'Failed to create branch. Please try again.'
    console.error('Error creating branch:', err)
  } finally {
    creating.value = false
  }
}

const updateBranch = async () => {
  updating.value = true
  try {
    // TODO: Implement API call to update branch
    console.log('Updating branch:', editingBranch.value)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeEditModal()
    fetchBranches()
  } catch (err) {
    error.value = 'Failed to update branch. Please try again.'
    console.error('Error updating branch:', err)
  } finally {
    updating.value = false
  }
}

const toggleBranchStatus = async (branch) => {
  if (!confirm(`Are you sure you want to ${branch.status === 'active' ? 'deactivate' : 'activate'} this branch?`)) {
    return
  }
  try {
    // TODO: Implement API call to toggle branch status
    console.log('Toggling branch status:', branch.id)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    fetchBranches()
  } catch (err) {
    error.value = 'Failed to update branch status. Please try again.'
    console.error('Error toggling branch status:', err)
  }
}

const saveUserAssignments = async () => {
  savingAssignments.value = true
  try {
    // TODO: Implement API call to save user assignments
    console.log('Saving user assignments:', {
      branchId: editingBranch.value.id,
      userIds: Array.from(selectedUsers.value)
    })
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeAssignUsersModal()
    fetchBranches()
  } catch (err) {
    error.value = 'Failed to save user assignments. Please try again.'
    console.error('Error saving user assignments:', err)
  } finally {
    savingAssignments.value = false
  }
}

onMounted(() => {
  fetchBranches()
})
</script>

<style scoped>
.branch-management {
  padding: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #1f2937;
  flex: 1;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  flex: 1;
  min-width: 200px;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
}

.branches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.branch-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.branch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.branch-header h3 {
  margin: 0;
  color: #1f2937;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #e5e7eb;
  color: #6b7280;
}

.status-badge.active {
  background-color: #ecfdf5;
  color: #10b981;
}

.branch-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.detail-item i {
  width: 1rem;
  color: #9ca3af;
}

.branch-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #f3f4f6;
}

.btn-icon.danger {
  color: #ef4444;
}

.btn-icon.danger:hover {
  background-color: #fee2e2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.users-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #f3f4f6;
}

.user-item.selected {
  background-color: #eef2ff;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-badge.admin {
  background-color: #fee2e2;
  color: #ef4444;
}

.role-badge.manager {
  background-color: #fef3c7;
  color: #f59e0b;
}

.role-badge.technician {
  background-color: #dbeafe;
  color: #3b82f6;
}

.role-badge.staff {
  background-color: #ecfdf5;
  color: #10b981;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error {
  color: #ef4444;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #4f46e5;
}

.btn-primary:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .branch-management {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filters {
    flex-direction: column;
  }

  .search-box,
  .filter-group {
    width: 100%;
  }

  .filter-group select {
    flex: 1;
  }

  .branches-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style> 