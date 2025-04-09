import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMachinesStore = defineStore('machines', () => {
  // State
  const machines = ref([]);
  const selectedMachine = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const filters = ref({
    search: '',
    status: 'all',
    customer: '',
    dateRange: {
      start: null,
      end: null
    }
  });
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  // Getters
  const filteredMachines = computed(() => {
    let result = [...machines.value];
    
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      result = result.filter(machine => 
        machine.model.toLowerCase().includes(searchTerm) ||
        machine.serialNumber.toLowerCase().includes(searchTerm) ||
        machine.customer.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.value.status !== 'all') {
      result = result.filter(machine => machine.status === filters.value.status);
    }
    
    if (filters.value.customer) {
      result = result.filter(machine => 
        machine.customer.toLowerCase().includes(filters.value.customer.toLowerCase())
      );
    }
    
    return result;
  });

  const machinesByStatus = computed(() => {
    const stats = {
      active: 0,
      maintenance: 0,
      inactive: 0
    };
    
    machines.value.forEach(machine => {
      if (stats.hasOwnProperty(machine.status)) {
        stats[machine.status]++;
      }
    });
    
    return stats;
  });

  const machinesRequiringService = computed(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return machines.value.filter(machine => {
      const lastService = new Date(machine.lastServiceDate);
      return lastService < thirtyDaysAgo;
    });
  });

  // Actions
  const fetchMachines = async (params = {}) => {
    try {
      loading.value = true;
      error.value = null;
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/machines', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch machines');
      }
      
      const data = await response.json();
      machines.value = data.machines;
      pagination.value = data.pagination;
      
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching machines:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchMachine = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      
      // TODO: Replace with actual API call
      const response = await fetch(`/api/machines/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch machine');
      }
      
      const data = await response.json();
      selectedMachine.value = data;
      
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching machine:', err);
    } finally {
      loading.value = false;
    }
  };

  const createMachine = async (machineData) => {
    try {
      loading.value = true;
      error.value = null;
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/machines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(machineData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create machine');
      }
      
      const data = await response.json();
      machines.value.push(data);
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Error creating machine:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateMachine = async (id, machineData) => {
    try {
      loading.value = true;
      error.value = null;
      
      // TODO: Replace with actual API call
      const response = await fetch(`/api/machines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(machineData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update machine');
      }
      
      const data = await response.json();
      const index = machines.value.findIndex(m => m.id === id);
      if (index !== -1) {
        machines.value[index] = data;
      }
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Error updating machine:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteMachine = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      
      // TODO: Replace with actual API call
      const response = await fetch(`/api/machines/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete machine');
      }
      
      machines.value = machines.value.filter(m => m.id !== id);
      
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting machine:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateFilters = (newFilters) => {
    filters.value = {
      ...filters.value,
      ...newFilters
    };
  };

  const resetFilters = () => {
    filters.value = {
      search: '',
      status: 'all',
      customer: '',
      dateRange: {
        start: null,
        end: null
      }
    };
  };

  return {
    // State
    machines,
    selectedMachine,
    loading,
    error,
    filters,
    pagination,
    
    // Getters
    filteredMachines,
    machinesByStatus,
    machinesRequiringService,
    
    // Actions
    fetchMachines,
    fetchMachine,
    createMachine,
    updateMachine,
    deleteMachine,
    updateFilters,
    resetFilters
  };
}); 