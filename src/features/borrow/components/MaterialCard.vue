<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiBook, mdiAccount, mdiCheckCircle } from '@mdi/js';
import { computed } from 'vue';

const props = defineProps({
  material: Object,
  isSelected: Boolean,
  selectUnavailableOnly: {
    type: Boolean,
    default: false,
  },
  viewMode: {
    type: String,
    default: 'grid',
  },
});

const emit = defineEmits(['select']);

const availabilityStatus = computed(() => {
  if (props.material.available_copies === 0) return 'unavailable';
  if (props.material.available_copies < 3) return 'limited';
  return 'available';
});

const statusClasses = {
  available: 'bg-green-100 text-green-700',
  limited: 'bg-amber-100 text-amber-700',
  unavailable: 'bg-red-100 text-red-700'
};

const isSelectable = computed(() => {
  const availableCopies = Number(props.material?.available_copies || 0);
  return props.selectUnavailableOnly ? availableCopies <= 0 : availableCopies > 0;
});
</script>

<template>
  <div 
    @click="isSelectable && emit('select', material)"
    class="group relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden"
    :class="[
      isSelected ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200 hover:border-blue-300',
      !isSelectable ? 'opacity-60 cursor-not-allowed hover:border-gray-200' : '',
      viewMode === 'list' ? 'flex items-stretch' : ''
    ]"
  >
  <div
      class="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      :class="viewMode === 'list' ? 'w-28 border-r border-gray-100' : 'h-28 border-b border-gray-100'"
    >
      <div class="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
        <BaseIcon :path="mdiBook" size="28" class="text-blue-300" />
      </div>
      
      <div v-if="isSelected" class="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-1.5 rounded-lg shadow-md">
        <BaseIcon :path="mdiCheckCircle" size="14" />
      </div>
    </div>
    <div class="p-3" :class="viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''">
      <h5 class="font-medium text-gray-900 truncate mb-1 group-hover:text-blue-700 transition-colors text-sm">
        {{ material.title }}
      </h5>
      <p class="text-xs text-gray-500 flex items-center gap-1 mb-2">
        <BaseIcon :path="mdiAccount" size="10" class="text-gray-400" />
        {{ material.author }}
      </p>
      <div class="flex items-center justify-between" :class="viewMode === 'list' ? 'mt-1' : ''">
        <span 
          class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          :class="statusClasses[availabilityStatus]"
        >
          {{ material.available_copies > 0 ? 'Available' : 'Out' }}
        </span>
        <span class="text-xs font-medium text-gray-700">
          {{ material.available_copies }}/{{ material.total_copies }}
        </span>
      </div>
    </div>
  </div>
</template>
