<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  labels: {
    type: Array,
    default: () => [],
  },
  borrowSeries: {
    type: Array,
    default: () => [],
  },
  reservationSeries: {
    type: Array,
    default: () => [],
  },
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Borrows',
      data: props.borrowSeries,
      backgroundColor: '#2563EB',
      borderRadius: 6,
    },
    {
      label: 'Reservations',
      data: props.reservationSeries,
      backgroundColor: '#10B981',
      borderRadius: 6,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
      grid: {
        color: '#EEF2F7',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};
</script>

<template>
  <div class="h-[320px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
