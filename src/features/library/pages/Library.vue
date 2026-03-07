<script setup>
import { ref } from 'vue';
import Table from '@/components/Table.vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllLibrary, removeLibraryById } from '../api/libraryApi';
import { toasted } from '@/utils/utils';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiPencil, mdiDeleteAlert, mdiLibrary } from '@mdi/js';
import { usePaginations } from '@/composables/usePaginationTemp';
// Change useLibraryStore to useLibrary
import { useLibrary } from "../store/libraryStore"; 

// Update the variable initialization
const libraryStore = useLibrary();

// Setup pagination using the Library API and Store
const pagination = usePaginations({
  store: libraryStore,
  cb: getAllLibrary,
});

const removeReq = useApiRequest();

function remove(id) {
  openModal(
    'Confirmation',
    {
      title: 'Remove Library',
      message: 'Are you sure you want to delete this library? This action cannot be undone.',
    },
    (confirm) => {
      if (confirm) {
        removeReq.send(
          () => removeLibraryById(id),
          (res) => {
            if (res.success) {
              libraryStore.remove(id); // Ensure your store has a remove method
              toasted(true, 'Library removed successfully');
            } else {
              toasted(false, 'Failed to remove library', res.error);
            }
          }
        );
      }
    }
  );
}
</script>

<template>
  <div class="p-4 sm:p-7">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <BaseIcon :path="mdiLibrary" size="28" />
        Library Management
      </h1>
      
      <button
        @click="openModal('AddLibrary')"
        class="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 12 14" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 0V14M0 7H12" stroke="white" stroke-width="2"/>
        </svg>
        <span>Add New Library</span>
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <Table 
        :headers="{
          head: [
            'Library Name',
            'Location',
            'Contact Phone',
            'Admin Name',
            'Status',
            'Actions',
          ],
          row: [
            'name',
            'location',
            'mobilePhone',
            'adminName',
            'libraryStatus',
          ]
        }" 
        :cells="{
          libraryStatus: (val) => {
            const colors = {
              'ACTIVE': 'text-green-600 bg-green-50',
              'PENDING': 'text-orange-600 bg-orange-50',
              'SUSPENDED': 'text-red-600 bg-red-50'
            }
            return `<span class='px-2 py-1 rounded-full text-xs font-bold ${colors[val] || 'bg-gray-50'}'>${val}</span>`
          }
        }" 
        :rows="libraryStore.libraries || []"
        :pagination="pagination.meta.value"
        @next-page="pagination.next"
        @prev-page="pagination.previous"
        @page-change="pagination.goToPage"
        @page-size-change="pagination.setPerPage"
      >
        <template #actions="{ row }">
          <div class="flex gap-2 justify-center">
            <button
              class="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded transition-colors"
              title="Edit Library"
              @click="$router.push('/edit_library/' + row.uuid)"
            >
              <BaseIcon :path="mdiPencil" size="18" />
            </button>

            <button
              class="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded transition-colors"
              title="Delete Library"
              @click="remove(row.uuid)"
            >
              <BaseIcon :path="mdiDeleteAlert" size="18" />
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
