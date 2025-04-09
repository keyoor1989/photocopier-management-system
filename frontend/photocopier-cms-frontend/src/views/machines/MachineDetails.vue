<template>
  <div class="machine-details">
    <div class="page-header">
      <div class="header-content">
        <h1>Machine Details</h1>
        <span :class="['status-badge', machine.status]">{{ machine.status }}</span>
      </div>
      <div class="header-actions">
        <router-link :to="`/app/machines/${machineId}/edit`" class="btn btn-primary">
          <i class="fas fa-edit"></i> Edit Machine
        </router-link>
      </div>
    </div>

    <div class="details-grid">
      <div class="detail-card">
        <h2>Basic Information</h2>
        <div class="detail-item">
          <label>Machine ID</label>
          <span>{{ machine.id }}</span>
        </div>
        <div class="detail-item">
          <label>Model</label>
          <span>{{ machine.model }}</span>
        </div>
        <div class="detail-item">
          <label>Serial Number</label>
          <span>{{ machine.serialNumber }}</span>
        </div>
        <div class="detail-item">
          <label>Installation Date</label>
          <span>{{ formatDate(machine.installationDate) }}</span>
        </div>
      </div>

      <div class="detail-card">
        <h2>Customer Information</h2>
        <div class="detail-item">
          <label>Customer Name</label>
          <span>{{ machine.customer }}</span>
        </div>
        <div class="detail-item">
          <label>Location</label>
          <span>{{ machine.location }}</span>
        </div>
        <div class="detail-item">
          <label>Contact Person</label>
          <span>{{ machine.contactPerson }}</span>
        </div>
        <div class="detail-item">
          <label>Contact Number</label>
          <span>{{ machine.contactNumber }}</span>
        </div>
      </div>

      <div class="detail-card">
        <h2>Service History</h2>
        <div class="service-history">
          <div v-for="service in machine.serviceHistory" :key="service.id" class="service-item">
            <div class="service-date">{{ formatDate(service.date) }}</div>
            <div class="service-type">{{ service.type }}</div>
            <div class="service-description">{{ service.description }}</div>
            <div class="service-technician">By: {{ service.technician }}</div>
          </div>
        </div>
      </div>

      <div class="detail-card">
        <h2>Performance Metrics</h2>
        <div class="metrics-grid">
          <div class="metric-item">
            <label>Total Pages</label>
            <span class="metric-value">{{ machine.metrics.totalPages }}</span>
          </div>
          <div class="metric-item">
            <label>Monthly Average</label>
            <span class="metric-value">{{ machine.metrics.monthlyAverage }}</span>
          </div>
          <div class="metric-item">
            <label>Service Calls</label>
            <span class="metric-value">{{ machine.metrics.serviceCalls }}</span>
          </div>
          <div class="metric-item">
            <label>Uptime</label>
            <span class="metric-value">{{ machine.metrics.uptime }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const machineId = route.params.id;

// Sample data - replace with actual API call
const machine = ref({
  id: 'M001',
  model: 'Canon IR-2525',
  serialNumber: 'CNX12345',
  customer: 'ABC Corp',
  status: 'active',
  installationDate: '2023-01-15',
  location: '123 Business Street, City',
  contactPerson: 'John Doe',
  contactNumber: '(555) 123-4567',
  serviceHistory: [
    {
      id: 1,
      date: '2024-03-15',
      type: 'Preventive Maintenance',
      description: 'Regular maintenance and cleaning',
      technician: 'Mike Smith'
    },
    {
      id: 2,
      date: '2024-02-01',
      type: 'Repair',
      description: 'Paper jam mechanism repair',
      technician: 'Sarah Johnson'
    }
  ],
  metrics: {
    totalPages: '125,000',
    monthlyAverage: '5,000',
    serviceCalls: '3',
    uptime: '98.5'
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  // Fetch machine details
  console.log('Fetching details for machine:', machineId);
});
</script>

<style scoped>
.machine-details {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-content h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.detail-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-item label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.detail-item span {
  font-size: 1rem;
  color: var(--text-primary);
}

.service-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-item {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 6px;
}

.service-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.service-type {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.service-description {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.service-technician {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 6px;
}

.metric-item label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.maintenance {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 