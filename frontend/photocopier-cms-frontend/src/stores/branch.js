import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import branchService from '@/services/branch'
import { useAuthStore } from '@/stores/auth'

export const useBranchStore = defineStore('branch', {
  state: () => ({
    branches: ref([]),
    currentBranch: ref(null),
    isLoading: ref(false),
    error: ref(null),
    branchPermissions: ref({}),
    metrics: {
      performance: null,
      sales: null,
      service: null,
      inventory: null,
      financial: null
    },
    pagination: {
      page: 1,
      perPage: 10,
      total: 0
    },
    filters: {
      search: '',
      status: null,
      region: null,
      dateRange: null
    },
    sortBy: {
      field: 'name',
      direction: 'asc'
    }
  }),

  getters: {
    /**
     * Get filtered branches based on current filters
     */
    filteredBranches: (state) => {
      let filtered = [...state.branches]

      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(branch => 
          branch.name.toLowerCase().includes(searchTerm) ||
          branch.code.toLowerCase().includes(searchTerm) ||
          branch.address.toLowerCase().includes(searchTerm)
        )
      }

      // Apply status filter
      if (state.filters.status) {
        filtered = filtered.filter(branch => branch.status === state.filters.status)
      }

      // Apply region filter
      if (state.filters.region) {
        filtered = filtered.filter(branch => branch.region === state.filters.region)
      }

      // Apply date range filter
      if (state.filters.dateRange) {
        const { start, end } = state.filters.dateRange
        filtered = filtered.filter(branch => {
          const branchDate = new Date(branch.createdAt)
          return branchDate >= start && branchDate <= end
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const direction = state.sortBy.direction === 'asc' ? 1 : -1
        return direction * (a[state.sortBy.field] > b[state.sortBy.field] ? 1 : -1)
      })

      return filtered
    },

    /**
     * Get active branches
     */
    activeBranches: (state) => {
      return state.branches.filter(branch => branch.status === 'active')
    },

    /**
     * Get inactive branches
     */
    inactiveBranches: (state) => {
      return state.branches.filter(branch => branch.status === 'inactive')
    },

    /**
     * Get branches by region
     */
    branchesByRegion: (state) => {
      const regions = {}
      state.branches.forEach(branch => {
        if (!regions[branch.region]) {
          regions[branch.region] = []
        }
        regions[branch.region].push(branch)
      })
      return regions
    },

    /**
     * Get total number of branches
     */
    totalBranches: (state) => state.branches.length,

    /**
     * Get total number of active branches
     */
    totalActiveBranches: (state) => {
      return state.branches.filter(branch => branch.status === 'active').length
    },

    /**
     * Get total number of inactive branches
     */
    totalInactiveBranches: (state) => {
      return state.branches.filter(branch => branch.status === 'inactive').length
    },

    /**
     * Get total number of users across all branches
     */
    totalBranchUsers: (state) => {
      return state.branches.reduce((total, branch) => total + (branch.users?.length || 0), 0)
    },

    availableBranches: (state) => {
      const authStore = useAuthStore()
      
      // If user has access to all branches, return all branches
      if (authStore.hasPermission('access_all_branches')) {
        return state.branches
      }
      
      // Otherwise, filter branches based on user's permissions
      return state.branches.filter(branch => {
        return authStore.hasPermission(`access_branch_${branch.id}`)
      })
    },

    branchById: (state) => {
      return (id) => state.branches.find(branch => branch.id === id)
    },

    canAccessBranch: (state) => {
      const authStore = useAuthStore()
      return (branchId) => {
        if (authStore.hasPermission('access_all_branches')) {
          return true
        }
        return authStore.hasPermission(`access_branch_${branchId}`)
      }
    }
  },

  actions: {
    /**
     * Fetch all branches with pagination and filtering
     */
    async fetchBranches() {
      this.isLoading = true
      this.error = null
      try {
        const params = {
          page: this.pagination.page,
          perPage: this.pagination.perPage,
          ...this.filters,
          sortBy: this.sortBy.field,
          sortDirection: this.sortBy.direction
        }
        const response = await branchService.getBranches(params)
        this.branches = response.data
        this.pagination.total = response.total
        
        // If no current branch is selected and branches are available, select the first one
        if (!this.currentBranch && this.branches.length > 0) {
          this.setCurrentBranch(this.branches[0])
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch branches'
        console.error('Error fetching branches:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch a single branch by ID
     */
    async fetchBranchById(id) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchById(id)
        
        // Update the branch in the branches array if it exists
        const index = this.branches.findIndex(branch => branch.id === id)
        if (index !== -1) {
          this.branches[index] = response.data
        } else {
          this.branches.push(response.data)
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch branch with ID ${id}`
        console.error(`Error fetching branch with ID ${id}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create a new branch
     */
    async createBranch(branchData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.createBranch(branchData)
        this.branches.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create branch'
        console.error('Error creating branch:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update an existing branch
     */
    async updateBranch(id, branchData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.updateBranch(id, branchData)
        
        // Update the branch in the branches array
        const index = this.branches.findIndex(branch => branch.id === id)
        if (index !== -1) {
          this.branches[index] = response.data
        }
        
        // If the updated branch is the current branch, update it
        if (this.currentBranch && this.currentBranch.id === id) {
          this.currentBranch = response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to update branch with ID ${id}`
        console.error(`Error updating branch with ID ${id}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Deactivate a branch
     */
    async deactivateBranch(id) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.deactivateBranch(id)
        
        // Remove the branch from the branches array
        this.branches = this.branches.filter(branch => branch.id !== id)
        
        // If the deleted branch is the current branch, select another branch
        if (this.currentBranch && this.currentBranch.id === id) {
          if (this.branches.length > 0) {
            this.setCurrentBranch(this.branches[0])
          } else {
            this.currentBranch = null
          }
        }
        
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to deactivate branch with ID ${id}`
        console.error(`Error deactivating branch with ID ${id}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Activate a branch
     */
    async activateBranch(id) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.activateBranch(id)
        
        // Update the branch in the branches array
        const index = this.branches.findIndex(branch => branch.id === id)
        if (index !== -1) {
          this.branches[index] = response.data
        }
        
        // If the updated branch is the current branch, update it
        if (this.currentBranch && this.currentBranch.id === id) {
          this.currentBranch = response.data
        }
        
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to activate branch with ID ${id}`
        console.error(`Error activating branch with ID ${id}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete a branch
     */
    async deleteBranch(id) {
      this.isLoading = true
      this.error = null
      try {
        await branchService.deleteBranch(id)
        
        // Remove the branch from the branches array
        this.branches = this.branches.filter(branch => branch.id !== id)
        
        // If the deleted branch is the current branch, select another branch
        if (this.currentBranch && this.currentBranch.id === id) {
          if (this.branches.length > 0) {
            this.setCurrentBranch(this.branches[0])
          } else {
            this.currentBranch = null
          }
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to delete branch with ID ${id}`
        console.error(`Error deleting branch with ID ${id}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch branch users
     */
    async fetchBranchUsers(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchUsers(branchId)
        if (this.currentBranch && this.currentBranch.id === branchId) {
          this.currentBranch.users = response
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch users for branch with ID ${branchId}`
        console.error(`Error fetching users for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Assign a user to a branch
     */
    async assignUserToBranch(branchId, userId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.assignUserToBranch(branchId, userId)
        if (this.currentBranch && this.currentBranch.id === branchId) {
          this.currentBranch.users = this.currentBranch.users || []
          this.currentBranch.users.push(response)
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to assign user to branch with ID ${branchId}`
        console.error(`Error assigning user to branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Remove a user from a branch
     */
    async removeUserFromBranch(branchId, userId) {
      this.isLoading = true
      this.error = null
      try {
        await branchService.removeUserFromBranch(branchId, userId)
        if (this.currentBranch && this.currentBranch.id === branchId) {
          this.currentBranch.users = this.currentBranch.users.filter(user => user.id !== userId)
        }
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to remove user from branch with ID ${branchId}`
        console.error(`Error removing user from branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch branch settings
     */
    async fetchBranchSettings(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchSettings(branchId)
        if (this.currentBranch && this.currentBranch.id === branchId) {
          this.currentBranch.settings = response
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch settings for branch with ID ${branchId}`
        console.error(`Error fetching settings for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update branch settings
     */
    async updateBranchSettings(branchId, settings) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.updateBranchSettings(branchId, settings)
        if (this.currentBranch && this.currentBranch.id === branchId) {
          this.currentBranch.settings = response
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to update settings for branch with ID ${branchId}`
        console.error(`Error updating settings for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch branch performance metrics
     */
    async fetchBranchPerformance(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchPerformance(branchId)
        this.metrics.performance = response
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch performance metrics for branch with ID ${branchId}`
        console.error(`Error fetching performance metrics for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch branch sales metrics
     */
    async fetchBranchSalesMetrics(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchSalesMetrics(branchId)
        this.metrics.sales = response
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch sales metrics for branch with ID ${branchId}`
        console.error(`Error fetching sales metrics for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch branch service metrics
     */
    async fetchBranchServiceMetrics(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchServiceMetrics(branchId)
        this.metrics.service = response
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch service metrics for branch with ID ${branchId}`
        console.error(`Error fetching service metrics for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch branch inventory metrics
     */
    async fetchBranchInventoryMetrics(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchInventoryMetrics(branchId)
        this.metrics.inventory = response
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch inventory metrics for branch with ID ${branchId}`
        console.error(`Error fetching inventory metrics for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch branch financial metrics
     */
    async fetchBranchFinancialMetrics(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchFinancialMetrics(branchId)
        this.metrics.financial = response
        return response
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch financial metrics for branch with ID ${branchId}`
        console.error(`Error fetching financial metrics for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update pagination
     */
    updatePagination(page, perPage) {
      this.pagination.page = page
      this.pagination.perPage = perPage
    },

    /**
     * Update filters
     */
    updateFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Update sort
     */
    updateSort(field, direction) {
      this.sortBy = { field, direction }
    },

    /**
     * Reset store state
     */
    resetState() {
      this.branches = []
      this.currentBranch = null
      this.isLoading = false
      this.error = null
      this.metrics = {
        performance: null,
        sales: null,
        service: null,
        inventory: null,
        financial: null
      }
      this.pagination = {
        page: 1,
        perPage: 10,
        total: 0
      }
      this.filters = {
        search: '',
        status: null,
        region: null,
        dateRange: null
      }
      this.sortBy = {
        field: 'name',
        direction: 'asc'
      }
    },

    async fetchBranchPermissions(branchId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await branchService.getBranchPermissions(branchId)
        this.branchPermissions[branchId] = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch permissions for branch with ID ${branchId}`
        console.error(`Error fetching permissions for branch with ID ${branchId}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    setCurrentBranch(branch) {
      // Check if the user has permission to access this branch
      if (!this.canAccessBranch(branch.id)) {
        this.error = `You don't have permission to access the branch: ${branch.name}`
        return false
      }
      
      this.currentBranch = branch
      
      // Store the selected branch in localStorage for persistence
      localStorage.setItem('currentBranchId', branch.id)
      
      return true
    },

    clearError() {
      this.error = null
    },

    // Initialize the current branch from localStorage if available
    initializeCurrentBranch() {
      const storedBranchId = localStorage.getItem('currentBranchId')
      
      if (storedBranchId && this.branches.length > 0) {
        const branch = this.branches.find(b => b.id === storedBranchId)
        if (branch) {
          this.setCurrentBranch(branch)
        } else {
          // If the stored branch ID doesn't exist in the branches array,
          // select the first available branch
          this.setCurrentBranch(this.branches[0])
        }
      } else if (this.branches.length > 0) {
        // If no stored branch ID and branches are available, select the first one
        this.setCurrentBranch(this.branches[0])
      }
    }
  }
}) 