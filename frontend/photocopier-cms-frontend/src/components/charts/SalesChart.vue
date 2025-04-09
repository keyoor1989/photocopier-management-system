<template>
  <div class="sales-chart">
    <Bar
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const chartData = computed(() => ({
  labels: props.data.map(item => item.month),
  datasets: [
    {
      label: 'Sales',
      data: props.data.map(item => item.amount),
      backgroundColor: '#3b82f6',
      borderRadius: 4
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context) => {
          return '$' + context.parsed.y.toLocaleString()
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#e5e7eb'
      },
      ticks: {
        callback: (value) => '$' + value.toLocaleString(),
        color: '#6b7280'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6b7280'
      }
    }
  }
}
</script>

<style scoped>
.sales-chart {
  height: 300px;
}
</style> 