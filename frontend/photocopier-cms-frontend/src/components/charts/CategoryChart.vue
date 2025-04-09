<template>
  <div class="category-chart">
    <Pie
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
)

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const colors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#8b5cf6', // purple
  '#f59e0b', // yellow
  '#ef4444', // red
  '#6b7280'  // gray
]

const chartData = computed(() => ({
  labels: props.data.map(item => item.category),
  datasets: [
    {
      data: props.data.map(item => item.count),
      backgroundColor: colors.slice(0, props.data.length),
      borderWidth: 0
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        color: '#6b7280'
      }
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context) => {
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value * 100) / total).toFixed(1)
          return context.label + ': ' + value + ' (' + percentage + '%)'
        }
      }
    }
  }
}
</script>

<style scoped>
.category-chart {
  height: 300px;
}
</style> 