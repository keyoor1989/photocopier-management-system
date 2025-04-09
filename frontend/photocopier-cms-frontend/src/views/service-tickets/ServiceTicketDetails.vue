<template>
  <div class="service-ticket-details">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading ticket details...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Error Loading Ticket</h2>
      <p>{{ error }}</p>
      <button @click="fetchTicketDetails" class="retry-btn">Retry</button>
      <button @click="$router.push('/service-tickets')" class="back-btn">Back to Tickets</button>
    </div>
    
    <div v-else-if="!ticket" class="not-found-container">
      <div class="not-found-icon">🔍</div>
      <h2>Ticket Not Found</h2>
      <p>The requested service ticket could not be found.</p>
      <button @click="$router.push('/service-tickets')" class="back-btn">Back to Tickets</button>
    </div>
    
    <div v-else class="ticket-container">
      <div class="ticket-header">
        <div class="ticket-title">
          <h1>Service Ticket #{{ ticket.id }}</h1>
          <span :class="['status-badge', ticket.status]">{{ formatStatus(ticket.status) }}</span>
        </div>
        <div class="ticket-actions">
          <button @click="handleEdit" class="edit-btn">Edit Ticket</button>
          <button @click="handleDelete" class="delete-btn">Delete Ticket</button>
        </div>
      </div>
      
      <div class="ticket-content">
        <div class="ticket-section">
          <h2>Basic Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Title</span>
              <span class="info-value">{{ ticket.title }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Priority</span>
              <span :class="['priority-badge', ticket.priority]">{{ formatPriority(ticket.priority) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Created</span>
              <span class="info-value">{{ formatDate(ticket.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Updated</span>
              <span class="info-value">{{ formatDate(ticket.updatedAt) }}</span>
            </div>
          </div>
        </div>
        
        <div class="ticket-section">
          <h2>Description</h2>
          <div class="description-box">
            {{ ticket.description }}
          </div>
        </div>
        
        <div class="ticket-section">
          <h2>Machine Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Machine</span>
              <span class="info-value">{{ ticket.machine?.model || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Serial Number</span>
              <span class="info-value">{{ ticket.machine?.serialNumber || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Location</span>
              <span class="info-value">{{ ticket.machine?.location || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Customer</span>
              <span class="info-value">{{ ticket.machine?.customer?.name || 'N/A' }}</span>
            </div>
          </div>
        </div>
        
        <div class="ticket-section">
          <h2>Assignment</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Assigned To</span>
              <span class="info-value">{{ ticket.assignee?.name || 'Unassigned' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Scheduled Date</span>
              <span class="info-value">{{ ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'Not scheduled' }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="ticket.status === 'completed'" class="ticket-section">
          <h2>Resolution</h2>
          <div class="description-box">
            {{ ticket.resolution }}
          </div>
          
          <div v-if="ticket.partsUsed && ticket.partsUsed.length > 0" class="parts-section">
            <h3>Parts Used</h3>
            <table class="parts-table">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(part, index) in ticket.partsUsed" :key="index">
                  <td>{{ part.name }}</td>
                  <td>{{ part.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="ticket-section">
          <h2>Activity Log</h2>
          <div class="activity-timeline">
            <div v-for="(activity, index) in ticket.activities" :key="index" class="activity-item">
              <div class="activity-time">{{ formatDate(activity.timestamp) }}</div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.action }}</div>
                <div class="activity-description">{{ activity.description }}</div>
                <div class="activity-user">By: {{ activity.user?.name || 'System' }}</div>
              </div>
            </div>
            <div v-if="!ticket.activities || ticket.activities.length === 0" class="no-activities">
              No activity recorded yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useServiceTicketsStore } from '@/stores/serviceTickets';
import { formatDate } from '@/utils/dateFormatter';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const serviceTicketsStore = useServiceTicketsStore();

const ticket = ref(null);
const loading = ref(true);
const error = ref(null);

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    'open': 'Open',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
};

const formatPriority = (priority) => {
  if (!priority) return 'Unknown';
  
  const priorityMap = {
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low'
  };
  
  return priorityMap[priority] || priority;
};

const fetchTicketDetails = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const ticketId = route.params.id;
    const data = await serviceTicketsStore.fetchTicket(ticketId);
    ticket.value = data;
  } catch (err) {
    error.value = err.message || 'Failed to load ticket details';
    console.error('Error fetching ticket details:', err);
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  router.push(`/service-tickets/${ticket.value.id}/edit`);
};

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
    return;
  }
  
  try {
    await serviceTicketsStore.deleteTicket(ticket.value.id);
    toast.success('Ticket deleted successfully');
    router.push('/service-tickets');
  } catch (err) {
    toast.error(err.message || 'Failed to delete ticket');
  }
};

onMounted(() => {
  fetchTicketDetails();
});
</script>

<style scoped>
.service-ticket-details {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-container,
.error-container,
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon,
.not-found-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn,
.back-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn {
  background: #6366f1;
  border: 1px solid #4f46e5;
  color: white;
  margin-right: 0.5rem;
}

.retry-btn:hover {
  background: #4f46e5;
}

.back-btn {
  background: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.back-btn:hover {
  background: #f3f4f6;
}

.ticket-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.ticket-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ticket-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.open {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.in_progress {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: #6366f1;
  border: 1px solid #4f46e5;
  color: white;
}

.edit-btn:hover {
  background: #4f46e5;
}

.delete-btn {
  background: white;
  border: 1px solid #dc2626;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
}

.ticket-content {
  padding: 1.5rem;
}

.ticket-section {
  margin-bottom: 2rem;
}

.ticket-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.ticket-section h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 1rem 0 0.5rem;
  color: #4b5563;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
}

.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #fee2e2;
  color: #991b1b;
}

.priority-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-badge.low {
  background: #dcfce7;
  color: #166534;
}

.description-box {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #4b5563;
  white-space: pre-line;
}

.parts-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.parts-table th,
.parts-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.parts-table th {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.parts-table td {
  font-size: 0.875rem;
  color: #1f2937;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 150px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.activity-user {
  font-size: 0.75rem;
  color: #6b7280;
}

.no-activities {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .service-ticket-details {
    padding: 1rem;
  }
  
  .ticket-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .ticket-actions {
    width: 100%;
  }
  
  .edit-btn,
  .delete-btn {
    flex: 1;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .activity-time {
    min-width: auto;
  }
}
</style> 