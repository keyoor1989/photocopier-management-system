<template>
  <div class="machine-details" v-if="machine">
    <div class="header">
      <h2>{{ machine.model }}</h2>
      <div class="status-badge" :class="machine.status">
        {{ machine.status }}
      </div>
    </div>

    <div class="content">
      <div class="info-section">
        <h3>Basic Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Serial Number</label>
            <span>{{ machine.serialNumber }}</span>
          </div>
          <div class="info-item">
            <label>Installation Date</label>
            <span>{{ formatDate(machine.installationDate) }}</span>
          </div>
          <div class="info-item">
            <label>Last Service Date</label>
            <span>{{ formatDate(machine.lastServiceDate) }}</span>
          </div>
          <div class="info-item">
            <label>Next Service Due</label>
            <span>{{ formatDate(machine.nextServiceDue) }}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>Customer Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Customer Name</label>
            <span>{{ machine.customer }}</span>
          </div>
          <div class="info-item">
            <label>Location</label>
            <span>{{ machine.location }}</span>
          </div>
          <div class="info-item">
            <label>Contact Person</label>
            <span>{{ machine.contactPerson }}</span>
          </div>
          <div class="info-item">
            <label>Contact Number</label>
            <span>{{ machine.contactNumber }}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>Service History</h3>
        <div class="service-history" v-if="machine.serviceHistory?.length">
          <div class="service-entry" v-for="service in machine.serviceHistory" :key="service.id">
            <div class="service-date">{{ formatDate(service.date) }}</div>
            <div class="service-type">{{ service.type }}</div>
            <div class="service-description">{{ service.description }}</div>
            <div class="service-technician">{{ service.technician }}</div>
          </div>
        </div>
        <p v-else>No service history available</p>
      </div>
    </div>

    <div class="actions">
      <button class="btn primary" @click="$emit('edit')">
        Edit Machine
      </button>
      <button class="btn" @click="scheduleService">
        Schedule Service
      </button>
      <button class="btn danger" @click="confirmDelete">
        Delete Machine
      </button>
    </div>
  </div>
  <div v-else class="loading">
    Loading machine details...
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useMachinesStore } from '@/stores/machines';
import { formatDate } from '@/utils/dateFormatter';
import { useToast } from 'vue-toastification';

const props = defineProps({
  machineId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['edit']);
const store = useMachinesStore();
const toast = useToast();

const machine = computed(() => store.selectedMachine);

const loadMachine = async () => {
  try {
    await store.fetchMachine(props.machineId);
  } catch (error) {
    toast.error('Failed to load machine details');
  }
};

const scheduleService = () => {
  // TODO: Implement service scheduling
  toast.info('Service scheduling feature coming soon');
};

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete this machine?')) {
    try {
      await store.deleteMachine(props.machineId);
      toast.success('Machine deleted successfully');
      // Navigate away or emit event
    } catch (error) {
      toast.error('Failed to delete machine');
    }
  }
};

watch(() => props.machineId, loadMachine);

onMounted(loadMachine);
</script>

<style scoped>
.machine-details {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.maintenance {
  background: #fef9c3;
  color: #854d0e;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
}

.info-section h3 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #374151;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.875rem;
  color: #6b7280;
}

.info-item span {
  font-size: 1rem;
  color: #1f2937;
}

.service-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-entry {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  align-items: center;
}

.service-date {
  font-weight: 500;
  color: #374151;
}

.service-type {
  color: #6b7280;
}

.service-description {
  color: #374151;
}

.service-technician {
  color: #6b7280;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
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
}

.btn.primary:hover {
  background: #4338ca;
}

.btn.danger {
  background: white;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.btn.danger:hover {
  background: #fee2e2;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
</style> 