<script setup>
import Table from '@/components/Table.vue';
import { usePrivilege } from '../store/privilegeStore';
import { useApiRequest } from '@/composables/useApiRequest';
import { toasted } from '@/utils/utils';
import { getAllPrivilege, removePrivilege } from '../Api/PrivilegeApi';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiDeleteAlert, mdiPencil } from '@mdi/js';
import { usePaginations } from '@/composables/usePaginationTemp';

const privilegeStore = usePrivilege();

const pagination = usePaginations({
  store: privilegeStore,
  cb: getAllPrivilege,
});

const removeReq = useApiRequest();
function remove(id) {
  openModal(
    'Confirmation',
    {
      title: 'Remove Privilege',
      message: 'Are you sure you want to delete this privilege?',
    },
    (res) => {
      if (res) {
        removeReq.send(
          () => removePrivilege(id),
          (res) => {
            if (res.success) {
              privilegeStore.remove(id);
            }
            toasted(res.success, 'Removed Successfully', res.error);
          }
        );
      }
    }
  );
}
</script>

<template>
  <div class="p-7">
    <!-- Add Privilege Button -->
    <div class="flex space-x-8 min-[320px]:text-center max-[600px]:flex-col justify-end mr-5">
      <div class="flex items-center space-x-4">
        <slot name="select">
          <RouterLink to="/add_privilege">
            <button class="border-red-100 p-2 flex items-center bg-primary text-white">
              <svg width="14" height="14" viewBox="0 0 12 14" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 4.04995C0.723858 4.04995 0.5 4.27381 0.5 4.54995C0.5 4.82609 0.723858 5.04995 1 5.04995V4.04995ZM2.2 5.04995C2.47614 5.04995 2.7 4.82609 2.7 4.54995C2.7 4.27381 2.47614 4.04995 2.2 4.04995V5.04995ZM1 6.44995C0.723858 6.44995 0.5 6.67381 0.5 6.94995C0.5 7.22609 0.723858 7.44995 1 7.44995V6.44995ZM2.2 7.44995C2.47614 7.44995 2.7 7.22609 2.7 6.94995C2.7 6.67381 2.47614 6.44995 2.2 6.44995V7.44995ZM1 8.84995C0.723858 8.84995 0.5 9.07381 0.5 9.34995C0.5 9.62609 0.723858 9.84995 1 9.84995V8.84995ZM2.2 9.84995C2.47614 9.84995 2.7 9.62609 2.7 9.34995C2.7 9.07381 2.47614 8.84995 2.2 8.84995V9.84995ZM5.9 5.14995V8.74995H6.9V5.14995H5.9Z"
                  fill="white" />
              </svg>
              <span class="truncate px-3">Add Privilege</span>
            </button>
          </RouterLink>
        </slot>
      </div>
    </div>

    <!-- Privileges Table -->
    <Table
      :pending="pagination.pending.value"
      :headers="{
        head: [
          'Privilege Name',
          'Privilege Description',
          'Privilege Category',
          'Actions',
        ],
        row: [
          'privilegeName',
          'privilegeDescription',
          'privilegeCategory',
        ]
      }"
      :rows="privilegeStore.privileges || []"
    >
      <template #actions="{ row }">
        <div class="flex gap-2">
          <button
            class="rounded-lg bg-gray-600 text-white px-2 py-1 flex items-center"
            @click="$router.push('/edit_privilege/' + row?.privilegeUuid)"
          >
            <BaseIcon :path="mdiPencil" />
            Edit
          </button>
          <button
            class="rounded-lg bg-[#FF4C4C] text-white px-2 py-1 flex items-center"
            @click="remove(row?.privilegeUuid)"
          >
            <BaseIcon :path="mdiDeleteAlert" />
            Delete
          </button>
        </div>
      </template>
    </Table>
  </div>
</template>
