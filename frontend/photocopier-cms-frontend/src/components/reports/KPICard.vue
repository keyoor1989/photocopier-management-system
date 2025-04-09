<template>
  <div class="kpi-card" :class="{ trending: showTrend }">
    <div class="kpi-content">
      <div class="kpi-header">
        <h3 class="kpi-title">{{ title }}</h3>
        <div v-if="icon" class="kpi-icon" :class="iconClass">
          <i :class="icon"></i>
        </div>
      </div>
      
      <div class="kpi-value">
        <span class="value">{{ formattedValue }}</span>
        <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
      </div>

      <div v-if="showTrend" class="kpi-trend" :class="trendClass">
        <span class="trend-value">
          {{ trend >= 0 ? '+' : '' }}{{ trend }}%
        </span>
        <span class="trend-period">vs last period</span>
      </div>
    </div>

    <div v-if="showChart" class="kpi-chart">
      <!-- Chart placeholder - implement with your preferred charting library -->
      <slot name="chart"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: ''
  },
  trend: {
    type: Number,
    default: null
  },
  showTrend: {
    type: Boolean,
    default: false
  },
  showChart: {
    type: Boolean,
    default: false
  },
  formatter: {
    type: Function,
    default: value => value
  }
});

const formattedValue = computed(() => {
  return props.formatter(props.value);
});

const trendClass = computed(() => {
  if (props.trend === null) return '';
  return props.trend >= 0 ? 'positive' : 'negative';
});
</script>

<style scoped>
.kpi-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.kpi-title {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.kpi-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f3f4f6;
}

.kpi-value {
  margin-bottom: 1rem;
}

.value {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1;
}

.subtitle {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.kpi-trend {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.trend-value {
  font-weight: 500;
}

.trend-period {
  color: #6b7280;
}

.positive {
  color: #059669;
}

.negative {
  color: #dc2626;
}

.kpi-chart {
  margin-top: 1rem;
  height: 60px;
}

/* Custom icon classes */
.icon-primary {
  background: #e0e7ff;
  color: #4f46e5;
}

.icon-success {
  background: #dcfce7;
  color: #15803d;
}

.icon-warning {
  background: #fef9c3;
  color: #854d0e;
}

.icon-danger {
  background: #fee2e2;
  color: #dc2626;
}
</style> 