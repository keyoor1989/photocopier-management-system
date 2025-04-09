<template>
  <div class="branch-selector">
    <div class="dropdown">
      <button 
        class="btn btn-outline-secondary dropdown-toggle d-flex align-items-center" 
        type="button" 
        id="branchDropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
        :disabled="isLoading"
      >
        <i class="fas fa-building me-2"></i>
        <span class="branch-name">{{ currentBranch ? currentBranch.name : 'Select Branch' }}</span>
        <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="branchDropdown">
        <li v-if="isLoading" class="dropdown-item text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span class="ms-2">Loading branches...</span>
        </li>
        <li v-else-if="error" class="dropdown-item text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>Error loading branches
        </li>
        <li v-else-if="branches.length === 0" class="dropdown-item text-muted">
          No branches available
        </li>
        <li v-else>
          <div class="dropdown-header">Select Branch</div>
          <li v-for="branch in branches" :key="branch.id">
            <a 
              class="dropdown-item d-flex align-items-center" 
              href="#" 
              @click.prevent="selectBranch(branch)"
              :class="{ 'active': currentBranch && currentBranch.id === branch.id }"
            >
              <i class="fas fa-building me-2"></i>
              {{ branch.name }}
              <i v-if="currentBranch && currentBranch.id === branch.id" class="fas fa-check ms-auto"></i>
            </a>
          </li>
        </li>
        <li v-if="canManageBranches"><hr class="dropdown-divider"></li>
        <li v-if="canManageBranches">
          <a class="dropdown-item" href="#" @click.prevent="openBranchManagement">
            <i class="fas fa-cog me-2"></i>Manage Branches
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBranchStore } from '@/stores/branch'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const branchStore = useBranchStore()
const authStore = useAuthStore()

// Computed properties
const branches = computed(() => branchStore.branches)
const currentBranch = computed(() => branchStore.currentBranch)
const isLoading = computed(() => branchStore.isLoading)
const error = computed(() => branchStore.error)
const canManageBranches = computed(() => authStore.hasPermission('manage_branches'))

// Methods
function selectBranch(branch) {
  branchStore.setCurrentBranch(branch)
}

function openBranchManagement() {
  router.push('/admin/branches')
}

// Watch for changes in the current branch
watch(currentBranch, (newBranch) => {
  if (newBranch) {
    // Emit an event that can be listened to by parent components
    emit('branch-changed', newBranch)
  }
})

// Define emits
const emit = defineEmits(['branch-changed'])

// Lifecycle hooks
onMounted(() => {
  // Fetch branches if not already loaded
  if (branches.value.length === 0) {
    branchStore.fetchBranches()
  }
})
</script>

<style scoped>
.branch-selector {
  min-width: 200px;
}

.branch-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
</style> 