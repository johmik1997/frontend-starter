<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import icons from '@/utils/icons';
import { openModal } from '@customizer/modal-x';

const props = defineProps({
  headKeys: Array,
  rowData: Array,
  rowKeys: Array,
  cells: Object
});

function editPremium(row) {
  openModal('EditPremium', {
    props: {
      data: row
    }
  });
}

function deletePremium(row) {
  // Add delete functionality
  console.log('Delete premium:', row);
}

function viewDetails(row) {
  const router = useRouter();
  router.push({ 
    name: 'premiumDetails', 
    params: { premiumUuid: row.premiumRateUuid || row.id } 
  });
}

function toggleDropdown(event, rowId) {
  event.stopPropagation();
  closeAllDropdowns();
  
  const dropdown = document.getElementById(`dropdown-${rowId}`);
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('[id^="dropdown-"]').forEach(dropdown => {
    dropdown.classList.add('hidden');
  });
}

// Close dropdowns when clicking outside
document.addEventListener('click', closeAllDropdowns);

function formatCategory(row) {
  if (row.car_type === 'PRIVATE') {
    return row.privateType || 'N/A';
  } else if (row.car_type === 'COMMERCIAL') {
    return row.commercialType || 'N/A';
  }
  return 'N/A';
}

function formatSubCategory(row) {
  if (row.car_type === 'COMMERCIAL') {
    return row.goodsCarryingType || row.passengerCarryingType || row.publicServiceType || 'N/A';
  }
  return 'N/A';
}
</script>

<template>
  <tbody>
    <tr 
      v-for="(row, index) in rowData" 
      :key="row.premiumRateUuid || row.id || index"
      class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
    >
      <!-- Car Type -->
      <td class="px-6 py-4 text-sm text-gray-900">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-blue-100 text-blue-800': row.car_type === 'PRIVATE',
                'bg-green-100 text-green-800': row.car_type === 'COMMERCIAL'
              }">
          {{ row.car_type }}
        </span>
      </td>

      <!-- Category -->
      <td class="px-6 py-4 text-sm text-gray-900">
        {{ formatCategory(row) }}
      </td>

      <!-- Sub Category -->
      <td class="px-6 py-4 text-sm text-gray-900">
        {{ formatSubCategory(row) }}
      </td>

      <!-- Rate -->
      <td class="px-6 py-4 text-sm text-gray-900">
        <span class="font-semibold text-primary">{{ (row.rate * 100).toFixed(2) }}%</span>
      </td>

      <!-- Actions -->
      <td class="px-6 py-4 text-sm text-gray-900">
        <div class="dropdown-container relative">
          <button 
            @click="toggleDropdown($event, row.premiumRateUuid || row.id)"
            class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <i v-html="icons.more_vert" class="w-4 h-4"></i>
          </button>

          <!-- Dropdown menu -->
          <div 
            :id="`dropdown-${row.premiumRateUuid || row.id}`"
            class="dropdown-menu hidden absolute right-0 z-10 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="py-1">
              <button
                @click="viewDetails(row)"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
              >
                <i v-html="icons.visibility" class="w-4 h-4 mr-3 text-gray-400"></i>
                View Details
              </button>
              <button
                @click="editPremium(row)"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
              >
                <i v-html="icons.edit" class="w-4 h-4 mr-3 text-gray-400"></i>
                Edit
              </button>
              <button
                @click="deletePremium(row)"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
              >
                <i v-html="icons.delete" class="w-4 h-4 mr-3 text-red-400"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<style scoped>
.dropdown-container {
  min-width: 80px;
  position: relative;
}

.dropdown-menu {
  min-width: 150px;
  transition: all 0.2s ease-out;
  transform-origin: top right;
  z-index: 9999;
  top: 100%;
  right: 0;
}

.dropdown-menu.hidden {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}

.dropdown-menu:not(.hidden) {
  opacity: 1;
  transform: scale(1);
}

.dropdown-container button {
  width: 100%;
}
</style>



