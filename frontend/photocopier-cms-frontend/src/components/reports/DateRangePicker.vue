<template>
  <div class="date-range-picker">
    <div class="preset-options">
      <button
        v-for="preset in presets"
        :key="preset.value"
        class="preset-btn"
        :class="{ active: isPresetActive(preset.value) }"
        @click="selectPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div class="date-inputs">
      <div class="date-input-group">
        <label for="startDate">Start Date</label>
        <input
          id="startDate"
          v-model="startDate"
          type="date"
          class="date-input"
          :max="endDate"
          @change="handleDateChange"
        />
      </div>

      <div class="date-input-group">
        <label for="endDate">End Date</label>
        <input
          id="endDate"
          v-model="endDate"
          type="date"
          class="date-input"
          :min="startDate"
          :max="maxDate"
          @change="handleDateChange"
        />
      </div>
    </div>

    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const error = ref(null)
const startDate = ref(formatDate(props.modelValue.start))
const endDate = ref(formatDate(props.modelValue.end))

const maxDate = computed(() => {
  return formatDate(new Date())
})

const presets = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' }
]

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function getDateRange(preset) {
  const today = new Date()
  const start = new Date()
  const end = new Date()

  switch (preset) {
    case 'today':
      return { start: today, end: today }
    case 'yesterday':
      start.setDate(today.getDate() - 1)
      end.setDate(today.getDate() - 1)
      return { start, end }
    case 'last7days':
      start.setDate(today.getDate() - 7)
      return { start, end: today }
    case 'last30days':
      start.setDate(today.getDate() - 30)
      return { start, end: today }
    case 'thisMonth':
      start.setDate(1)
      return { start, end: today }
    case 'lastMonth':
      start.setMonth(today.getMonth() - 1)
      start.setDate(1)
      end.setMonth(today.getMonth())
      end.setDate(0)
      return { start, end }
    default:
      return { start: props.modelValue.start, end: props.modelValue.end }
  }
}

function isPresetActive(preset) {
  const range = getDateRange(preset)
  return (
    formatDate(range.start) === startDate.value &&
    formatDate(range.end) === endDate.value
  )
}

function selectPreset(preset) {
  const range = getDateRange(preset)
  startDate.value = formatDate(range.start)
  endDate.value = formatDate(range.end)
  emit('update:modelValue', range)
}

function handleDateChange() {
  error.value = null

  if (!startDate.value || !endDate.value) {
    error.value = 'Please select both start and end dates'
    return
  }

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  if (start > end) {
    error.value = 'Start date cannot be after end date'
    return
  }

  emit('update:modelValue', { start, end })
}

watch(
  () => props.modelValue,
  (newValue) => {
    startDate.value = formatDate(newValue.start)
    endDate.value = formatDate(newValue.end)
  },
  { deep: true }
)
</script>

<style scoped>
.date-range-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preset-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preset-btn {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background-color: #e5e7eb;
}

.preset-btn.active {
  background-color: #6366f1;
  border-color: #6366f1;
  color: white;
}

.date-inputs {
  display: flex;
  gap: 1rem;
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.date-input {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
  transition: border-color 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #ef4444;
  border-radius: 4px;
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .date-inputs {
    flex-direction: column;
  }

  .preset-options {
    flex-direction: column;
  }

  .preset-btn {
    width: 100%;
  }
}
</style> 