<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import Status_row from '../components/carSpecificationStatusRow.vue'
import { openModal } from "@customizer/modal-x"
import { useCarSpecification } from '../store/carSpecificationStore'
import { getAllCarSpecifications } from '../api/carSpecificationApi'
import { removeUndefined } from '@/utils/utils'
import { usePaginationcopy } from '@/composables/usePaginationcopy.js'
import { useApiRequest } from '@/composables/useApiRequest'

const carSpecStore = useCarSpecification()
const searchKey = ref('')

// Pagination setup for the car specifications table
const pagination = usePaginationcopy({
  store: carSpecStore,
  cb: (data, config) => getAllCarSpecifications(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})
const req = useApiRequest();
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

// Function to open the add car specification modal
function openAddCarSpecModal() {
  openModal('AddCarSpecification')
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
  <DefaultPage placeholder="Search Car Specifications" v-model="searchKey">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center">
        <Button @click="openAddCarSpecModal" type="primary" class="flex items-center gap-2">
          <i v-html="icons.plus"></i>
          Add Car Specification
        </Button>
      </div>
    </template>

    <!-- Car Specifications table -->
    <Table
      :pending="pagination.pending.value"
      :headers="{
        head: ['Car Name', 'Car Type', 'Model', 'Engine', 'Price Ranges', 'actions'],
        row: ['carName', 'carType', 'carModel', 'engine', 'priceRanges'],
      }"
      :rowCom="Status_row"
      :rows="carSpecStore.carSpecifications || []"
      :Fallback="TableRowSkeleton"
    >
      <template #actions="{ row }">
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
        </template>
    </Table>
  </DefaultPage>
</template>
