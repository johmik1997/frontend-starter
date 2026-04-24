<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';
import { 
  mdiLibrary, 
  mdiViewGrid, 
  mdiFormatListBulleted,
  mdiBook,
  mdiCheckCircle,
  mdiClockOutline,
  mdiTag
} from '@mdi/js';

defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      available: 0,
      borrowed: 0,
      categories: 0,
    }),
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  showViewToggle: {
    type: Boolean,
    default: true,
  }
});

defineEmits(['update:viewMode']);
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
    <!-- Title Section with exact parent styling -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-md">
          <BaseIcon :path="mdiLibrary" size="24" class="text-white" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Library Catalog</h2>
          <p class="text-sm text-gray-500">Browse and select materials</p>
        </div>
      </div>
      
      <!-- View Toggle matching parent button styles -->
      <div v-if="showViewToggle" class="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
        <button
          @click="$emit('update:viewMode', 'grid')"
          class="p-2 rounded-lg transition-all duration-200"
          :class="viewMode === 'grid' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'"
        >
          <BaseIcon :path="mdiViewGrid" size="18" />
        </button>
        <button
          @click="$emit('update:viewMode', 'list')"
          class="p-2 rounded-lg transition-all duration-200"
          :class="viewMode === 'list' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'"
        >
          <BaseIcon :path="mdiFormatListBulleted" size="18" />
        </button>
      </div>
    </div>
    
    <!-- Stats Grid with exact color scheme -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Books -->
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            <p class="text-xs font-medium text-gray-500">Total Books</p>
          </div>
          <div class="p-2.5 bg-blue-100 rounded-lg">
            <BaseIcon :path="mdiBook" size="20" class="text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Available -->
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-green-600">{{ stats.available }}</p>
            <p class="text-xs font-medium text-gray-500">Available</p>
          </div>
          <div class="p-2.5 bg-green-100 rounded-lg">
            <BaseIcon :path="mdiCheckCircle" size="20" class="text-green-600" />
          </div>
        </div>
      </div>

      <!-- On Loan -->
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-amber-600">{{ stats.borrowed }}</p>
            <p class="text-xs font-medium text-gray-500">On Loan</p>
          </div>
          <div class="p-2.5 bg-amber-100 rounded-lg">
            <BaseIcon :path="mdiClockOutline" size="20" class="text-amber-600" />
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-blue-600">{{ stats.categories }}</p>
            <p class="text-xs font-medium text-gray-500">Categories</p>
          </div>
          <div class="p-2.5 bg-blue-100 rounded-lg">
            <BaseIcon :path="mdiTag" size="20" class="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
