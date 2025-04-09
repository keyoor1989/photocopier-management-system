import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { isDateInRange } from '@/utils/dateFormatter';
import { apiClient, handleApiError } from '@/utils/apiClient';
import { useToast } from 'vue-toastification';

export const useServiceTicketsStore = defineStore('serviceTickets', () => {
  const toast = useToast();
  
  // State
  const tickets = ref([]);
  const selectedTicket = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const filters = ref({
    search: '',
    status: 'all',
    priority: 'all',
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
  const filteredTickets = computed(() => {
    let result = [...tickets.value];
    
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      result = result.filter(ticket => 
        ticket.number?.toLowerCase().includes(searchTerm) ||
        ticket.title?.toLowerCase().includes(searchTerm) ||
        ticket.description?.toLowerCase().includes(searchTerm) ||
        ticket.customer?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.value.status !== 'all') {
      result = result.filter(ticket => ticket.status === filters.value.status);
    }
    
    if (filters.value.priority !== 'all') {
      result = result.filter(ticket => ticket.priority === filters.value.priority);
    }
    
    if (filters.value.dateRange.start || filters.value.dateRange.end) {
      result = result.filter(ticket => 
        isDateInRange(
          ticket.createdAt,
          filters.value.dateRange.start,
          filters.value.dateRange.end
        )
      );
    }
    
    return result;
  });

  const ticketsByStatus = computed(() => {
    const stats = {
      open: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };
    
    tickets.value.forEach(ticket => {
      if (stats.hasOwnProperty(ticket.status)) {
        stats[ticket.status]++;
      }
    });
    
    return stats;
  });

  const ticketsByPriority = computed(() => {
    const stats = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    tickets.value.forEach(ticket => {
      if (stats.hasOwnProperty(ticket.priority)) {
        stats[ticket.priority]++;
      }
    });
    
    return stats;
  });

  const averageResolutionTime = computed(() => {
    const completedTickets = tickets.value.filter(ticket => ticket.status === 'completed');
    if (!completedTickets.length) return 0;
    
    const totalTime = completedTickets.reduce((sum, ticket) => {
      const created = new Date(ticket.createdAt);
      const completed = new Date(ticket.completedAt);
      return sum + (completed - created);
    }, 0);
    
    return Math.round(totalTime / completedTickets.length / (1000 * 60 * 60)); // in hours
  });

  // Actions
  const fetchTickets = async (params = {}) => {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await apiClient.request('/service-tickets', {
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...params
        }
      });
      
      tickets.value = data.tickets;
      pagination.value = data.pagination;
      
      return data;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchTicket = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await apiClient.request(`/service-tickets/${id}`, {
        method: 'GET'
      });
      
      selectedTicket.value = data;
      return data;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createTicket = async (ticketData) => {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await apiClient.request('/service-tickets', {
        method: 'POST',
        body: JSON.stringify(ticketData)
      });
      
      tickets.value.push(data);
      toast.success('Service ticket created successfully');
      return data;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTicket = async (id, ticketData) => {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await apiClient.request(`/service-tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ticketData)
      });
      
      const index = tickets.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tickets.value[index] = data;
      }
      if (selectedTicket.value?.id === id) {
        selectedTicket.value = data;
      }
      
      toast.success('Service ticket updated successfully');
      return data;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTicket = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      
      await apiClient.request(`/service-tickets/${id}`, {
        method: 'DELETE'
      });
      
      tickets.value = tickets.value.filter(t => t.id !== id);
      if (selectedTicket.value?.id === id) {
        selectedTicket.value = null;
      }
      
      toast.success('Service ticket deleted successfully');
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const assignTicket = async (id, userId) => {
    try {
      const data = await updateTicket(id, {
        assignedTo: userId,
        status: 'in_progress'
      });
      toast.success('Ticket assigned successfully');
      return data;
    } catch (err) {
      throw err;
    }
  };

  const completeTicket = async (id, resolution) => {
    try {
      const data = await updateTicket(id, {
        status: 'completed',
        resolution,
        completedAt: new Date().toISOString()
      });
      toast.success('Ticket marked as completed');
      return data;
    } catch (err) {
      throw err;
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
      priority: 'all',
      dateRange: {
        start: null,
        end: null
      }
    };
  };

  const refreshTickets = async () => {
    apiClient.invalidateCache('/service-tickets');
    return fetchTickets({
      page: pagination.value.currentPage,
      ...filters.value
    });
  };

  return {
    // State
    tickets,
    selectedTicket,
    loading,
    error,
    filters,
    pagination,
    
    // Getters
    filteredTickets,
    ticketsByStatus,
    ticketsByPriority,
    averageResolutionTime,
    
    // Actions
    fetchTickets,
    fetchTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTicket,
    completeTicket,
    updateFilters,
    resetFilters,
    refreshTickets
  };
}); 