<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiBook, mdiCheckCircle, mdiClockOutline, mdiTag } from '@mdi/js';

defineProps({
  stats: { type: Object, required: true }
});
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div v-for="(val, label) in { 
      'Total': { v: stats.total, i: mdiBook, c: 'text-primary-600', b: 'bg-primary-100' },
      'Available': { v: stats.available, i: mdiCheckCircle, c: 'text-green-600', b: 'bg-green-100' },
      'Borrowed': { v: stats.borrowed, i: mdiClockOutline, c: 'text-amber-600', b: 'bg-amber-100' },
      'Categories': { v: stats.categories, i: mdiTag, c: 'text-blue-600', b: 'bg-blue-100' }
    }" :key="label" class="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-2xl font-bold" :class="val.c">{{ val.v }}</p>
          <p class="text-xs text-gray-500">{{ label }}</p>
        </div>
        <div class="p-2 rounded-lg" :class="val.b">
          <BaseIcon :path="val.i" size="20" :class="val.c" />
        </div>
      </div>
    </div>
  </div>
</template>