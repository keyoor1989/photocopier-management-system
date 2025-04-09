<template>
  <div class="user-management">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>User Management</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="fas fa-plus"></i> Add User
      </button>
    </div>

    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search users..."
          @input="handleSearch"
        />
      </div>
      <div class="filter-group">
        <select v-model="roleFilter" @change="handleFilter">
          <option value="">All Roles</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
        <select v-model="statusFilter" @change="handleFilter">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading users...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchUsers" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else class="users-table">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('name')">
              Name
              <i
                class="fas"
                :class="{
                  'fa-sort': sortField !== 'name',
                  'fa-sort-up': sortField === 'name' && !sortDesc,
                  'fa-sort-down': sortField === 'name' && sortDesc
                }"
              ></i>
            </th>
            <th @click="sortBy('email')">
              Email
              <i
                class="fas"
                :class="{
                  'fa-sort': sortField !== 'email',
                  'fa-sort-up': sortField === 'email' && !sortDesc,
                  'fa-sort-down': sortField === 'email' && sortDesc
                }"
              ></i>
            </th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span
                class="status-badge"
                :class="{ active: user.status === 'active' }"
              >
                {{ user.status }}
              </span>
            </td>
            <td>{{ formatDate(user.lastLogin) }}</td>
            <td class="actions">
              <button
                class="btn-icon"
                @click="openEditModal(user)"
                title="Edit User"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn-icon"
                @click="openResetPasswordModal(user)"
                title="Reset Password"
              >
                <i class="fas fa-key"></i>
              </button>
              <button
                class="btn-icon"
                :class="{ danger: user.status === 'active' }"
                @click="toggleUserStatus(user)"
                :title="user.status === 'active' ? 'Deactivate' : 'Activate'"
              >
                <i
                  class="fas"
                  :class="
                    user.status === 'active' ? 'fa-user-slash' : 'fa-user-check'
                  "
                ></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

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
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New User</h2>
          <button class="btn-icon" @click="closeCreateModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="createUser" class="modal-form">
          <div class="form-group">
            <label for="newName">Name</label>
            <input
              type="text"
              id="newName"
              v-model="newUser.name"
              required
            />
          </div>
          <div class="form-group">
            <label for="newEmail">Email</label>
            <input
              type="email"
              id="newEmail"
              v-model="newUser.email"
              required
            />
          </div>
          <div class="form-group">
            <label for="newRole">Role</label>
            <select id="newRole" v-model="newUser.role" required>
              <option value="">Select Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeCreateModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              {{ creating ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit User</h2>
          <button class="btn-icon" @click="closeEditModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="updateUser" class="modal-form">
          <div class="form-group">
            <label for="editName">Name</label>
            <input
              type="text"
              id="editName"
              v-model="editingUser.name"
              required
            />
          </div>
          <div class="form-group">
            <label for="editEmail">Email</label>
            <input
              type="email"
              id="editEmail"
              v-model="editingUser.email"
              required
            />
          </div>
          <div class="form-group">
            <label for="editRole">Role</label>
            <select id="editRole" v-model="editingUser.role" required>
              <option value="">Select Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
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

    <!-- Reset Password Modal -->
    <div v-if="showResetPasswordModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Reset Password</h2>
          <button class="btn-icon" @click="closeResetPasswordModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="resetPassword" class="modal-form">
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              v-model="newPassword"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              required
            />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeResetPasswordModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="resetting">
              {{ resetting ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const sortField = ref('name')
const sortDesc = ref(false)
const currentPage = ref(1)
const pageSize = 10

const users = ref([])
const roles = ref([
  { id: 'admin', name: 'Administrator' },
  { id: 'manager', name: 'Manager' },
  { id: 'technician', name: 'Technician' },
  { id: 'staff', name: 'Staff' }
])

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showResetPasswordModal = ref(false)
const creating = ref(false)
const updating = ref(false)
const resetting = ref(false)

const newUser = ref({
  name: '',
  email: '',
  role: ''
})

const editingUser = ref({
  id: '',
  name: '',
  email: '',
  role: ''
})

const newPassword = ref('')
const confirmPassword = ref('')

const goBack = () => {
  router.back()
}

const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch users
    // For now, using mock data
    users.value = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Administrator',
        status: 'active',
        lastLogin: '2024-02-15T10:00:00'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Manager',
        status: 'active',
        lastLogin: '2024-02-14T15:30:00'
      }
    ]
  } catch (err) {
    error.value = 'Failed to load users. Please try again.'
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDesc.value = !sortDesc.value
  } else {
    sortField.value = field
    sortDesc.value = false
  }
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value
    return matchesSearch && matchesRole && matchesStatus
  })
})

const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => {
    const aValue = a[sortField.value]
    const bValue = b[sortField.value]
    if (aValue < bValue) return sortDesc.value ? 1 : -1
    if (aValue > bValue) return sortDesc.value ? -1 : 1
    return 0
  })
})

const totalPages = computed(() => {
  return Math.ceil(sortedUsers.value.length / pageSize)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedUsers.value.slice(start, end)
})

// Modal handlers
const openCreateModal = () => {
  newUser.value = { name: '', email: '', role: '' }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const openEditModal = (user) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const openResetPasswordModal = (user) => {
  editingUser.value = { ...user }
  newPassword.value = ''
  confirmPassword.value = ''
  showResetPasswordModal.value = true
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
}

// User actions
const createUser = async () => {
  creating.value = true
  try {
    // TODO: Implement API call to create user
    console.log('Creating user:', newUser.value)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeCreateModal()
    fetchUsers()
  } catch (err) {
    error.value = 'Failed to create user. Please try again.'
    console.error('Error creating user:', err)
  } finally {
    creating.value = false
  }
}

const updateUser = async () => {
  updating.value = true
  try {
    // TODO: Implement API call to update user
    console.log('Updating user:', editingUser.value)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeEditModal()
    fetchUsers()
  } catch (err) {
    error.value = 'Failed to update user. Please try again.'
    console.error('Error updating user:', err)
  } finally {
    updating.value = false
  }
}

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  resetting.value = true
  try {
    // TODO: Implement API call to reset password
    console.log('Resetting password for user:', editingUser.value.id)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeResetPasswordModal()
  } catch (err) {
    error.value = 'Failed to reset password. Please try again.'
    console.error('Error resetting password:', err)
  } finally {
    resetting.value = false
  }
}

const toggleUserStatus = async (user) => {
  if (!confirm(`Are you sure you want to ${user.status === 'active' ? 'deactivate' : 'activate'} this user?`)) {
    return
  }
  try {
    // TODO: Implement API call to toggle user status
    console.log('Toggling user status:', user.id)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    fetchUsers()
  } catch (err) {
    error.value = 'Failed to update user status. Please try again.'
    console.error('Error toggling user status:', err)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
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

.users-table {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}

th:hover {
  background-color: #f3f4f6;
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

.actions {
  display: flex;
  gap: 0.5rem;
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
.form-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group input:focus,
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
  .user-management {
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

  .users-table {
    overflow-x: auto;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style> 