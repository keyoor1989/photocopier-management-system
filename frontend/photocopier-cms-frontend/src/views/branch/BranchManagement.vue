<template>
  <div class="branch-management">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Branch Management</h1>
      <button 
        class="btn btn-primary" 
        @click="openCreateBranchModal"
        v-if="canManageBranches"
      >
        <i class="fas fa-plus me-2"></i>Add Branch
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <button class="btn btn-outline-danger btn-sm ms-3" @click="retryLoading">
        Retry
      </button>
    </div>

    <!-- Branches List -->
    <div v-else class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Branches</h5>
          </div>
          <div class="list-group list-group-flush">
            <button
              v-for="branch in branches"
              :key="branch.id"
              class="list-group-item list-group-item-action"
              :class="{ active: selectedBranch?.id === branch.id }"
              @click="selectBranch(branch)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1">{{ branch.name }}</h6>
                  <small class="text-muted">{{ branch.address }}</small>
                </div>
                <span 
                  class="badge"
                  :class="branch.isActive ? 'bg-success' : 'bg-danger'"
                >
                  {{ branch.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Branch Details -->
      <div class="col-md-8">
        <div v-if="selectedBranch" class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">{{ selectedBranch.name }}</h5>
            <div class="btn-group">
              <button 
                class="btn btn-outline-primary btn-sm"
                @click="openEditBranchModal"
                v-if="canManageBranches"
              >
                <i class="fas fa-edit me-1"></i>Edit
              </button>
              <button 
                class="btn btn-outline-danger btn-sm"
                @click="confirmDeleteBranch"
                v-if="canManageBranches"
              >
                <i class="fas fa-trash me-1"></i>Delete
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted mb-2">Branch Information</h6>
                <dl class="row mb-0">
                  <dt class="col-sm-4">Address</dt>
                  <dd class="col-sm-8">{{ selectedBranch.address }}</dd>
                  
                  <dt class="col-sm-4">Phone</dt>
                  <dd class="col-sm-8">{{ selectedBranch.phone }}</dd>
                  
                  <dt class="col-sm-4">Email</dt>
                  <dd class="col-sm-8">{{ selectedBranch.email }}</dd>
                  
                  <dt class="col-sm-4">Status</dt>
                  <dd class="col-sm-8">
                    <span 
                      class="badge"
                      :class="selectedBranch.isActive ? 'bg-success' : 'bg-danger'"
                    >
                      {{ selectedBranch.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </dl>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted mb-2">Statistics</h6>
                <dl class="row mb-0">
                  <dt class="col-sm-4">Users</dt>
                  <dd class="col-sm-8">{{ branchUsers.length }}</dd>
                  
                  <dt class="col-sm-4">Inventory</dt>
                  <dd class="col-sm-8">{{ branchInventory.length }} items</dd>
                  
                  <dt class="col-sm-4">Service Tickets</dt>
                  <dd class="col-sm-8">{{ branchServiceTickets.length }} active</dd>
                  
                  <dt class="col-sm-4">Customers</dt>
                  <dd class="col-sm-8">{{ branchCustomers.length }}</dd>
                </dl>
              </div>
            </div>

            <!-- Tabs -->
            <ul class="nav nav-tabs mt-4" role="tablist">
              <li class="nav-item">
                <a 
                  class="nav-link active" 
                  data-bs-toggle="tab" 
                  href="#users" 
                  role="tab"
                >
                  Users
                </a>
              </li>
              <li class="nav-item">
                <a 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  href="#permissions" 
                  role="tab"
                >
                  Permissions
                </a>
              </li>
              <li class="nav-item">
                <a 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  href="#activity" 
                  role="tab"
                >
                  Activity
                </a>
              </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content pt-3">
              <!-- Users Tab -->
              <div class="tab-pane fade show active" id="users" role="tabpanel">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="mb-0">Branch Users</h6>
                  <button 
                    class="btn btn-primary btn-sm"
                    @click="openAddUserModal"
                    v-if="canManageBranchUsers"
                  >
                    <i class="fas fa-user-plus me-1"></i>Add User
                  </button>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in branchUsers" :key="user.id">
                        <td>{{ user.name }}</td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                          <span 
                            class="badge"
                            :class="user.isActive ? 'bg-success' : 'bg-danger'"
                          >
                            {{ user.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                        <td>
                          <button 
                            class="btn btn-outline-danger btn-sm"
                            @click="removeUser(user)"
                            v-if="canManageBranchUsers"
                          >
                            <i class="fas fa-user-minus"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Permissions Tab -->
              <div class="tab-pane fade" id="permissions" role="tabpanel">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="mb-0">Branch Permissions</h6>
                  <button 
                    class="btn btn-primary btn-sm"
                    @click="savePermissions"
                    v-if="canManageBranchPermissions"
                  >
                    <i class="fas fa-save me-1"></i>Save Changes
                  </button>
                </div>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Permission</th>
                        <th>Description</th>
                        <th>Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="permission in branchPermissions" :key="permission.id">
                        <td>{{ permission.name }}</td>
                        <td>{{ permission.description }}</td>
                        <td>
                          <div class="form-check form-switch">
                            <input 
                              class="form-check-input"
                              type="checkbox"
                              v-model="permission.granted"
                              :disabled="!canManageBranchPermissions"
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Activity Tab -->
              <div class="tab-pane fade" id="activity" role="tabpanel">
                <h6 class="mb-3">Recent Activity</h6>
                <div class="timeline">
                  <div 
                    v-for="activity in branchActivity" 
                    :key="activity.id"
                    class="timeline-item"
                  >
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <h6 class="mb-1">{{ activity.action }}</h6>
                      <p class="text-muted mb-0">
                        {{ activity.description }}
                        <small class="d-block">
                          {{ formatDate(activity.timestamp) }} by {{ activity.user }}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5 text-muted">
          <i class="fas fa-building fa-3x mb-3"></i>
          <p>Select a branch to view details</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Branch Modal -->
    <div 
      class="modal fade" 
      id="branchModal" 
      tabindex="-1"
      ref="branchModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit Branch' : 'Create Branch' }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveBranch">
              <div class="mb-3">
                <label class="form-label">Branch Name</label>
                <input 
                  type="text" 
                  class="form-control"
                  v-model="branchForm.name"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Address</label>
                <textarea 
                  class="form-control"
                  v-model="branchForm.address"
                  rows="2"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input 
                  type="tel" 
                  class="form-control"
                  v-model="branchForm.phone"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control"
                  v-model="branchForm.email"
                  required
                >
              </div>
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input"
                    type="checkbox"
                    v-model="branchForm.isActive"
                  >
                  <label class="form-check-label">Active</label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="saveBranch"
            >
              {{ isEditing ? 'Save Changes' : 'Create Branch' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div 
      class="modal fade" 
      id="userModal" 
      tabindex="-1"
      ref="userModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add User to Branch</h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addUser">
              <div class="mb-3">
                <label class="form-label">Select User</label>
                <select 
                  class="form-select"
                  v-model="userForm.userId"
                  required
                >
                  <option value="">Choose a user...</option>
                  <option 
                    v-for="user in availableUsers"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.name }} ({{ user.email }})
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Role</label>
                <select 
                  class="form-select"
                  v-model="userForm.role"
                  required
                >
                  <option value="">Choose a role...</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="addUser"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      id="deleteModal" 
      tabindex="-1"
      ref="deleteModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Branch</h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete the branch "{{ selectedBranch?.name }}"?
              This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              @click="deleteBranch"
            >
              Delete Branch
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBranchStore } from '@/stores/branch'
import { useAuthStore } from '@/stores/auth'
import { Modal } from 'bootstrap'
import { formatDate } from '@/utils/date'

const branchStore = useBranchStore()
const authStore = useAuthStore()

// State
const branchModal = ref(null)
const userModal = ref(null)
const deleteModal = ref(null)
const isEditing = ref(false)
const branchForm = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  isActive: true
})
const userForm = ref({
  userId: '',
  role: ''
})

// Computed
const branches = computed(() => branchStore.branches)
const selectedBranch = computed(() => branchStore.currentBranch)
const isLoading = computed(() => branchStore.isLoading)
const error = computed(() => branchStore.error)
const branchUsers = computed(() => branchStore.branchUsers)
const branchPermissions = computed(() => branchStore.branchPermissions)
const branchInventory = computed(() => branchStore.branchInventory)
const branchServiceTickets = computed(() => branchStore.branchServiceTickets)
const branchCustomers = computed(() => branchStore.branchCustomers)
const branchActivity = computed(() => branchStore.branchActivity)
const availableUsers = computed(() => branchStore.availableUsers)

const canManageBranches = computed(() => authStore.hasPermission('manage_branches'))
const canManageBranchUsers = computed(() => authStore.hasPermission('manage_branch_users'))
const canManageBranchPermissions = computed(() => authStore.hasPermission('manage_branch_permissions'))

// Methods
const selectBranch = async (branch) => {
  await branchStore.setCurrentBranch(branch.id)
  await Promise.all([
    branchStore.fetchBranchUsers(branch.id),
    branchStore.fetchBranchPermissions(branch.id),
    branchStore.fetchBranchInventory(branch.id),
    branchStore.fetchBranchServiceTickets(branch.id),
    branchStore.fetchBranchCustomers(branch.id),
    branchStore.fetchBranchActivity(branch.id)
  ])
}

const openCreateBranchModal = () => {
  isEditing.value = false
  branchForm.value = {
    name: '',
    address: '',
    phone: '',
    email: '',
    isActive: true
  }
  new Modal(branchModal.value).show()
}

const openEditBranchModal = () => {
  isEditing.value = true
  branchForm.value = { ...selectedBranch.value }
  new Modal(branchModal.value).show()
}

const saveBranch = async () => {
  try {
    if (isEditing.value) {
      await branchStore.updateBranch(selectedBranch.value.id, branchForm.value)
    } else {
      await branchStore.createBranch(branchForm.value)
    }
    new Modal(branchModal.value).hide()
  } catch (error) {
    console.error('Error saving branch:', error)
  }
}

const confirmDeleteBranch = () => {
  new Modal(deleteModal.value).show()
}

const deleteBranch = async () => {
  try {
    await branchStore.deleteBranch(selectedBranch.value.id)
    new Modal(deleteModal.value).hide()
  } catch (error) {
    console.error('Error deleting branch:', error)
  }
}

const openAddUserModal = () => {
  userForm.value = {
    userId: '',
    role: ''
  }
  new Modal(userModal.value).show()
}

const addUser = async () => {
  try {
    await branchStore.addUserToBranch(
      selectedBranch.value.id,
      userForm.value.userId,
      { role: userForm.value.role }
    )
    new Modal(userModal.value).hide()
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

const removeUser = async (user) => {
  if (confirm(`Are you sure you want to remove ${user.name} from this branch?`)) {
    try {
      await branchStore.removeUserFromBranch(selectedBranch.value.id, user.id)
    } catch (error) {
      console.error('Error removing user:', error)
    }
  }
}

const savePermissions = async () => {
  try {
    await branchStore.updateBranchPermissions(
      selectedBranch.value.id,
      branchPermissions.value
    )
  } catch (error) {
    console.error('Error saving permissions:', error)
  }
}

const retryLoading = () => {
  branchStore.fetchBranches()
}

// Lifecycle
onMounted(async () => {
  await branchStore.fetchBranches()
})
</script>

<style scoped>
.branch-management {
  padding: 1.5rem;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--bs-primary);
  border: 2px solid #fff;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 1rem;
  bottom: 0;
  width: 2px;
  background-color: var(--bs-gray-200);
}

.timeline-content {
  background-color: var(--bs-gray-100);
  padding: 1rem;
  border-radius: 0.5rem;
}
</style> 