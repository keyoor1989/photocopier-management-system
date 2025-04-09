<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  datasets: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(dataset => 
        Array.isArray(dataset.data) &&
        typeof dataset.label === 'string' &&
        typeof dataset.borderColor === 'string'
      )
    }
  },
  title: {
    type: String,
    default: ''
  },
  yAxisLabel: {
    type: String,
    default: ''
  }
})

const chartCanvas = ref(null)
let chart = null

const initChart = () => {
  if (chart) {
    chart.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.datasets.map(dataset => ({
        ...dataset,
        fill: false,
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: !!props.title,
          text: props.title,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: !!props.yAxisLabel,
            text: props.yAxisLabel
          }
        }
      }
    }
  })
}

watch(
  () => [props.labels, props.datasets],
  () => {
    initChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}
</style> 