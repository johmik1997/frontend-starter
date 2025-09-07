<script setup>
import { defineProps, onMounted, onUnmounted } from 'vue';
import Button from '@/components/Button.vue';
import { useRouter } from 'vue-router';
import { openModal } from '@customizer/modal-x';
import { useApiRequest } from '@/composables/useApiRequest';
import { deleteCarSpecification } from '../api/carSpecificationApi';
import { useCarSpecification } from '../store/carSpecificationStore';
import { toasted } from '@/utils/utils';
import icons from '@/utils/icons';

const router = useRouter();
const props = defineProps({  
  rowData: {  
    type: Array,  
    required: true,  
  },  
  headKeys: {  
    type: Array,  
  },  
  rowKeys: {  
    type: Array,  
    required: true,  
  },  
}); 
const emit = defineEmits(["row"]);  

const carSpecStore = useCarSpecification();
const req = useApiRequest();

const handleNavigate = (carSpecUuid) => {
  router.push(`/car_specifications/detail/${carSpecUuid}`);
};

function editCarSpec(row) {
  console.log('=== EDIT BUTTON CLICKED ===');
  console.log('Row data:', row);
  console.log('Row type:', typeof row);
  console.log('Row keys:', Object.keys(row || {}));
  console.log('===========================');
  
  openModal('EditCarSpecification', {
    props: {
      data: row
    }
  });
}

function deleteCarSpec(row) {
  if (confirm('Are you sure you want to delete this car specification?')) {
    req.send(
      () => deleteCarSpecification(row.id || row.uuid),
      (res) => {
        if (res.success) {
          carSpecStore.remove(row.id || row.uuid);
          toasted(true, 'Car Specification deleted successfully!');
        } else {
          toasted(false, 'Error', res.error);
        }
      }
    );
  }
}

function toggleDropdown(event, rowId) {
  event.stopPropagation();
  closeAllDropdowns();
  
  const dropdown = document.getElementById(`dropdown-${rowId}`);
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

// Close dropdown when clicking outside or when an option is selected
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(el => {
    el.classList.add('hidden');
  });
}

// Call this when component mounts
onMounted(() => {
  window.addEventListener('click', closeAllDropdowns);
});

// Call this when component unmounts
onUnmounted(() => {
  window.removeEventListener('click', closeAllDropdowns);
});

// Modified handler functions to close dropdown after action
function handleViewWithClose(row) {
  closeAllDropdowns();
  handleNavigate(row.uuid || row.id);
}

function handleEditWithClose(row) {
  closeAllDropdowns();
  editCarSpec(row);
}

function handleDeleteWithClose(row) {
  closeAllDropdowns();
  deleteCarSpec(row);
}
</script>
<template>  
  <tr 
    v-for="(row, idx) in rowData" 
    :key="idx"
    @click.self="emit('row', row)" 
    class="bg-white border-b hover:bg-gray-50 transition-colors duration-150 ease-in-out" 
  >  
    <td class="p-4 font-medium text-gray-500">{{ idx + 1 }}</td>  

    <td class="p-3 py-4" v-for="key in rowKeys" :key="key">  
      <div v-if="key === 'priceRanges'" class="truncate flex items-center gap-4">  
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ row.priceSpecificationRequests?.length || 0 }} ranges
        </span>
      </div>  

      <!-- Custom computation for vehicle details -->
      <span v-else-if="key === 'vehicleDetails'">
        {{ row.carName }} {{ row.carModel }} - {{ row.carType }}
      </span>
      
      <!-- Engine display -->
      <span v-else-if="key === 'engine'" class="font-medium">
        {{ row.engine }}
      </span>
      
      <!-- Car name with emphasis -->
      <span v-else-if="key === 'carName'" class="font-semibold text-gray-900">
        {{ row.carName }}
      </span>
      
      <!-- Default field rendering -->
      <span v-else class="text-gray-700">
        {{ row[key] }}
      </span>
    </td>  
    
    <td class="p-3" v-if="headKeys.includes('Actions') || headKeys.includes('actions')">  
      <div class="flex flex-col sm:flex-row gap-2">
        <!-- Dropdown toggle button - full width -->
        <!-- <button 
              @click.stop="handleViewWithClose(row)"
              class="block w-full text-start py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div class="flex items-start justify-start pl-4 gap-4">
                <i v-html="icons.eye" />
                View Details
              </div>
            </button> -->
            
            <!-- Edit option -->
            <button 
              @click.stop="handleEditWithClose(row)"
              class="bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
            >
              <i v-html="icons.edit" />
              <span class=" sm:inline">Edit</span>
            </button>
            
            <!-- Delete option -->
            <button 
              @click.stop="handleDeleteWithClose(row)"
              :disabled="req.pending.value"
              class="bg-[#FF4C4C] text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
            >
              <i v-html="icons.trash" />
              <span class=" sm:inline">Delete</span>
            </button>

        <!-- Dropdown menu -->
        <div 
          :id="`dropdown-${row.uuid || row.id}`"
          class="dropdown-menu hidden absolute right-0 z-10 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="py-1" role="none">
            <!-- View option -->
           
          </div>
        </div>
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

/* Force table elements to allow overflow */
:deep(table) {
  overflow: visible !important;
}

:deep(tbody) {
  overflow: visible !important;
}

:deep(tr) {
  position: relative;
  overflow: visible !important;
}

:deep(td) {
  overflow: visible !important;
}

/* Target the table card wrapper */
:deep(.table-card) {
  overflow: visible !important;
}

:deep(.modern-table-container) {
  overflow: visible !important;
}

:deep(.modern-table) {
  overflow: visible !important;
}
</style>









