<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';

defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'blue',
  },
});

const toneClasses = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
};
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-gray-500">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
        <p v-if="description" class="text-xs text-gray-500 mt-1">{{ description }}</p>
      </div>
      <div class="w-10 h-10 rounded-lg border flex items-center justify-center" :class="toneClasses[tone] || toneClasses.blue">
        <BaseIcon :path="icon" size="20" />
      </div>
    </div>
  </div>
</template>
