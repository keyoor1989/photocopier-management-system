<template>
  <div class="service-tickets">
    <div class="page-header">
      <h1>Service Tickets</h1>
      <router-link to="/service-tickets/new" class="btn primary">
        Create Ticket
      </router-link>
    </div>

    <div class="filters">
      <div class="search-box">
        <input
          type="text"
          v-model="filters.search"
          placeholder="Search tickets..."
          @input="handleSearch"
        />
      </div>

      <div class="filter-group">
        <select v-model="filters.status" @change="handleFilterChange">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select v-model="filters.priority" @change="handleFilterChange">
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <DateRangePicker
          v-model="filters.dateRange"
          @update:modelValue="handleFilterChange"
        />
      </div>
    </div>

    <div class="tickets-grid" v-if="!loading">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="ticket-card"
        @click="viewTicket(ticket.id)"
      >
        <div class="ticket-header">
          <span class="ticket-number">#{{ ticket.number }}</span>
          <div class="ticket-status" :class="ticket.status">
            {{ ticket.status }}
          </div>
        </div>

        <div class="ticket-content">
          <h3>{{ ticket.title }}</h3>
          <p>{{ ticket.description }}</p>
        </div>

        <div class="ticket-meta">
          <div class="meta-item">
            <span class="label">Machine:</span>
            <span>{{ ticket.machine.model }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Customer:</span>
            <span>{{ ticket.customer }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Created:</span>
            <span>{{ formatDate(ticket.createdAt) }}</span>
          </div>
        </div>

        <div class="ticket-footer">
          <div class="priority" :class="ticket.priority">
            {{ ticket.priority }}
          </div>
          <div class="assigned-to" v-if="ticket.assignedTo">
            Assigned to: {{ ticket.assignedTo }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      Loading tickets...
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceTicketsStore } from '@/stores/serviceTickets';
import { formatDate } from '@/utils/dateFormatter';
import DateRangePicker from '@/components/reports/DateRangePicker.vue';

const router = useRouter();
const store = useServiceTicketsStore();

const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const tickets = ref([]);

const filters = ref({
  search: '',
  status: 'all',
  priority: 'all',
  dateRange: {
    start: null,
    end: null
  }
});

const loadTickets = async () => {
  loading.value = true;
  try {
    const response = await store.fetchTickets({
      page: currentPage.value,
      ...filters.value
    });
    tickets.value = response.tickets;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Failed to load tickets:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadTickets();
};

const handleFilterChange = () => {
  currentPage.value = 1;
  loadTickets();
};

const changePage = (page) => {
  currentPage.value = page;
  loadTickets();
};

const viewTicket = (id) => {
  router.push(`/service-tickets/${id}`);
};

onMounted(loadTickets);
</script>

<style scoped>
.service-tickets {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #111827;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-box input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.ticket-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ticket-number {
  font-weight: 500;
  color: #6b7280;
}

.ticket-status {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.ticket-status.open {
  background: #fee2e2;
  color: #991b1b;
}

.ticket-status.in_progress {
  background: #fef9c3;
  color: #854d0e;
}

.ticket-status.completed {
  background: #dcfce7;
  color: #15803d;
}

.ticket-status.cancelled {
  background: #f3f4f6;
  color: #4b5563;
}

.ticket-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #111827;
}

.ticket-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ticket-meta {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.meta-item .label {
  color: #6b7280;
  font-weight: 500;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.priority {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  text-transform: capitalize;
}

.priority.high {
  background: #fee2e2;
  color: #991b1b;
}

.priority.medium {
  background: #fef9c3;
  color: #854d0e;
}

.priority.low {
  background: #dcfce7;
  color: #15803d;
}

.assigned-to {
  color: #6b7280;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #f9fafb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: #4f46e5;
  color: white;
  border: none;
  text-decoration: none;
}

.btn.primary:hover {
  background: #4338ca;
}
</style> 