<template>
  <div class="date-range-picker">
    <div class="date-inputs">
      <div class="input-group">
        <label for="start-date">Start Date</label>
        <input
          type="date"
          id="start-date"
          v-model="startDate"
          :max="endDate || undefined"
          @change="emitChange"
          :class="{ error: errors.startDate }"
        />
        <span class="error-message" v-if="errors.startDate">
          {{ errors.startDate }}
        </span>
      </div>
      <div class="input-group">
        <label for="end-date">End Date</label>
        <input
          type="date"
          id="end-date"
          v-model="endDate"
          :min="startDate || undefined"
          @change="emitChange"
          :class="{ error: errors.endDate }"
        />
        <span class="error-message" v-if="errors.endDate">
          {{ errors.endDate }}
        </span>
      </div>
    </div>
    <div class="quick-selects">
      <button
        v-for="preset in presets"
        :key="preset.label"
        @click="applyPreset(preset.value)"
        :class="{ active: isPresetActive(preset.value) }"
        type="button"
      >
        {{ preset.label }}
      </button>
      <button
        type="button"
        class="clear-btn"
        @click="clearDates"
        v-if="hasSelectedDates"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { formatDateForInput } from '@/utils/dateFormatter';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ start: null, end: null })
  }
});

const emit = defineEmits(['update:modelValue']);

const startDate = ref(props.modelValue.start);
const endDate = ref(props.modelValue.end);
const errors = ref({});

const hasSelectedDates = computed(() => {
  return startDate.value || endDate.value;
});

const presets = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'week' },
  { label: 'Last 30 Days', value: 'month' },
  { label: 'This Month', value: 'this-month' },
  { label: 'Last Month', value: 'last-month' }
];

const validateDates = () => {
  const newErrors = {};
  
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    
    if (start > end) {
      newErrors.startDate = 'Start date cannot be after end date';
      newErrors.endDate = 'End date cannot be before start date';
    }
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const applyPreset = (preset) => {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  switch (preset) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'this-month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last-month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  startDate.value = formatDateForInput(start);
  endDate.value = formatDateForInput(end);
  emitChange();
};

const isPresetActive = (preset) => {
  if (!startDate.value || !endDate.value) return false;
  
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const now = new Date();
  
  switch (preset) {
    case 'today':
      return start.toDateString() === now.toDateString() &&
             end.toDateString() === now.toDateString();
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return start.toDateString() === yesterday.toDateString() &&
             end.toDateString() === yesterday.toDateString();
    }
    case 'week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return start.toDateString() === weekAgo.toDateString() &&
             end.toDateString() === now.toDateString();
    }
    case 'month': {
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      return start.toDateString() === monthAgo.toDateString() &&
             end.toDateString() === now.toDateString();
    }
    case 'this-month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return start.toDateString() === firstDay.toDateString() &&
             end.toDateString() === lastDay.toDateString();
    }
    case 'last-month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      return start.toDateString() === firstDay.toDateString() &&
             end.toDateString() === lastDay.toDateString();
    }
    default:
      return false;
  }
};

const clearDates = () => {
  startDate.value = null;
  endDate.value = null;
  errors.value = {};
  emitChange();
};

const emitChange = () => {
  if (validateDates()) {
    emit('update:modelValue', {
      start: startDate.value,
      end: endDate.value
    });
  }
};

watch(() => props.modelValue, (newValue) => {
  startDate.value = newValue.start;
  endDate.value = newValue.end;
}, { deep: true });
</script>

<style scoped>
.date-range-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.date-inputs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.input-group label {
  font-size: 0.875rem;
  color: #666;
}

.input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  width: 100%;
}

.input-group input.error {
  border-color: #dc2626;
}

.error-message {
  font-size: 0.75rem;
  color: #dc2626;
}

.quick-selects {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-selects button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-selects button:hover {
  background: #f5f5f5;
}

.quick-selects button.active {
  background: #e0e7ff;
  border-color: #6366f1;
  color: #4f46e5;
}

.clear-btn {
  border-color: #dc2626 !important;
  color: #dc2626;
}

.clear-btn:hover {
  background: #fee2e2 !important;
}

@media (max-width: 640px) {
  .date-inputs {
    flex-direction: column;
  }
  
  .input-group {
    width: 100%;
  }
  
  .quick-selects {
    justify-content: flex-start;
  }
  
  .quick-selects button {
    flex: 1;
    min-width: calc(33.333% - 0.5rem);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .quick-selects button {
    min-width: calc(50% - 0.5rem);
  }
}
</style> 