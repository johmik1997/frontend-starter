<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import icons from '@/utils/icons';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiDeleteAlert, mdiPencil } from '@mdi/js';

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

  // function viewDetails(row) {
  //   const router = useRouter();
  //   router.push({ 
  //     name: 'premiumDetails', 
  //     params: { premiumUuid: row.premiumRateUuid || row.id } 
  //   });
  // }

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
  if (row.carType === 'PRIVATE') {
    return row.privateType || 'N/A';
  } else if (row.carType === 'COMMERCIAL') {
    return row.commercialType || 'N/A';
  }
  return 'N/A';
}

function formatSubCategory(row) {
  if (row.carType === 'COMMERCIAL') {
    return row.goodsCarryingType || row.passengerCarryingType || row.publicServiceType || 'N/A';
  }
  return 'N/A';
}

function viewDetails(row) {
  const router = useRouter();
  router.push({ 
    name: 'premiumDetails', 
    params: { premiumUuid: row.premiumUuid || row.id } 
  });
}
</script>
<template>
 
    <tr 
      v-for="(row, idx) in rowData" 
      :key="row.premiumUuid || row.id || idx"
      class="bg-white border-b-[0.2px]"
    >
    <td class="p-3">{{ idx + 1 }}</td>
      <!-- Car Type -->
      <td class="px-6 py-4 text-sm text-gray-900">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-blue-100 text-blue-800': row.carType === 'PRIVATE',
                'bg-green-100 text-green-800': row.carType === 'COMMERCIAL'
              }">
          {{ row.carType }}
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
        <span class="font-semibold text-primary">{{ (row.premiumRate) }}</span>
      </td>

      <!-- Actions -->
      <td class="px-6 py-4 text-sm text-gray-900" v-if="headKeys.includes('actions')">
      
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              class="bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
             @click="editPremium(row)"
            >
              <BaseIcon :path="mdiPencil" />
              <span class=" sm:inline">Edit</span>
            </button>

            <button
              class="bg-[#FF4C4C] text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
             @click="deletePremium(row)"
            >
              <BaseIcon :path="mdiDeleteAlert" />
              <span class=" sm:inline">Delete</span>
            </button>
          </div>
      </td>
    </tr>
 
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



