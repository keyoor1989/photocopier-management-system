import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient, handleApiError } from '@/utils/apiClient';
import { useToast } from 'vue-toastification';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const useUsersStore = defineStore('users', () => {
  const toast = useToast();
  
  // State
  const currentUser = ref(null);
  const token = ref(localStorage.getItem(TOKEN_KEY) || null);
  const loading = ref(false);
  const error = ref(null);
  const users = ref([]);
  const technicians = ref([]);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  });
  const filters = ref({
    search: '',
    role: 'all',
    status: 'all',
    branch: 'all'
  });

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  
  const userRole = computed(() => currentUser.value?.role || null);
  
  const isAdmin = computed(() => userRole.value === 'admin');
  
  const isManager = computed(() => userRole.value === 'manager');
  
  const isTechnician = computed(() => userRole.value === 'technician');
  
  const isCustomer = computed(() => userRole.value === 'customer');
  
  const filteredUsers = computed(() => {
    let result = [...users.value];
    
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phone?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.value.role !== 'all') {
      result = result.filter(user => user.role === filters.value.role);
    }
    
    if (filters.value.status !== 'all') {
      result = result.filter(user => user.status === filters.value.status);
    }
    
    if (filters.value.branch !== 'all') {
      result = result.filter(user => user.branchId === filters.value.branch);
    }
    
    return result;
  });

  // Actions
  const login = async (credentials) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      token.value = response.token;
      localStorage.setItem(TOKEN_KEY, response.token);
      
      // Set auth header for future requests
      apiClient.setAuthHeader(response.token);
      
      // Fetch user details
      await fetchUserDetails();
      
      toast.success('Login successful');
      return response;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const logout = () => {
    token.value = null;
    currentUser.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    apiClient.removeAuthHeader();
    toast.success('Logged out successfully');
  };
  
  const fetchUserDetails = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.request('/auth/me', {
        method: 'GET'
      });
      
      currentUser.value = response;
      localStorage.setItem(USER_KEY, JSON.stringify(response));
      
      return response;
    } catch (err) {
      error.value = handleApiError(err);
      console.error('Error fetching user details:', err);
      
      // If token is invalid, log out
      if (err.status === 401) {
        logout();
      }
      
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchUsers = async (params = {}) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.request('/users', {
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...params
        }
      });
      
      users.value = response.users;
      pagination.value = response.pagination;
      
      return response;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchUser = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.request(`/users/${id}`, {
        method: 'GET'
      });
      
      return response;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const createUser = async (userData) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.request('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      users.value.push(response);
      toast.success('User created successfully');
      
      return response;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const updateUser = async (id, userData) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value[index] = response;
      }
      
      // Update current user if it's the same user
      if (currentUser.value?.id === id) {
        currentUser.value = response;
        localStorage.setItem(USER_KEY, JSON.stringify(response));
      }
      
      toast.success('User updated successfully');
      
      return response;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const deleteUser = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      
      await apiClient.request(`/users/${id}`, {
        method: 'DELETE'
      });
      
      users.value = users.value.filter(u => u.id !== id);
      
      // Log out if the deleted user is the current user
      if (currentUser.value?.id === id) {
        logout();
      }
      
      toast.success('User deleted successfully');
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchTechnicians = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.request('/users/technicians', {
        method: 'GET'
      });
      
      technicians.value = response;
      
      return response;
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      loading.value = true;
      error.value = null;
      
      await apiClient.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      toast.success('Password updated successfully');
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const resetPassword = async (email) => {
    try {
      loading.value = true;
      error.value = null;
      
      await apiClient.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      
      toast.success('Password reset instructions sent to your email');
    } catch (err) {
      error.value = handleApiError(err);
      toast.error(error.value);
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
      role: 'all',
      status: 'all',
      branch: 'all'
    };
  };
  
  // Initialize auth state from localStorage
  const initializeAuth = () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    
    if (savedToken) {
      token.value = savedToken;
      apiClient.setAuthHeader(savedToken);
    }
    
    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser);
      } catch (e) {
        console.error('Error parsing saved user data:', e);
        localStorage.removeItem(USER_KEY);
      }
    }
  };
  
  // Call initialize on store creation
  initializeAuth();
  
  return {
    // State
    currentUser,
    token,
    loading,
    error,
    users,
    technicians,
    pagination,
    filters,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isManager,
    isTechnician,
    isCustomer,
    filteredUsers,
    
    // Actions
    login,
    logout,
    fetchUserDetails,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    fetchTechnicians,
    updatePassword,
    resetPassword,
    updateFilters,
    resetFilters,
    initializeAuth
  };
}); 