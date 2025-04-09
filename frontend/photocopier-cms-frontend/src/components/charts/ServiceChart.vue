<template>
  <LineChart
    :labels="labels"
    :datasets="datasets"
    :title="title"
    :yAxisLabel="yAxisLabel"
  />
</template>

<script setup>
import { computed } from 'vue'
import LineChart from './LineChart.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        Array.isArray(value.labels) &&
        Array.isArray(value.tickets) &&
        Array.isArray(value.resolved)
      )
    }
  },
  title: {
    type: String,
    default: 'Service Tickets Overview'
  },
  yAxisLabel: {
    type: String,
    default: 'Number of Tickets'
  }
})

const labels = computed(() => props.data.labels)

const datasets = computed(() => [
  {
    label: 'Service Tickets',
    data: props.data.tickets,
    borderColor: '#6366f1'
  },
  {
    label: 'Resolved Tickets',
    data: props.data.resolved,
    borderColor: '#10b981'
  }
])
</script> 