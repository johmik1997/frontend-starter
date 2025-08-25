<script setup>
import Table from '@/components/Table.vue';
import PrivilegesDataProvider from '../components/PrivilegesDataProvider.vue';
import { usePagination } from '@/composables/usePagination';
import { usePrivilege } from '../store/privilegeStore';
import { useApiRequest } from '@/composables/useApiRequest';
import { toasted } from '@/utils/utils';
import { getAllPrivilege, removePrivilege } from '../Api/PrivilegeApi';
import { openModal } from '@customizer/modal-x';
import Dropdown from '@/components/Dropdown.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiDeleteAlert, mdiDotsVertical, mdiPencil } from '@mdi/js';


const privilegeStore = usePrivilege();
const pagination = usePagination({
  state: privilegeStore,
  cb: getAllPrivilege,
})


const removeReq = useApiRequest();
function remove(id) {
  openModal('Confirmation', {
    title: 'Remove Privilege',
    message: 'Are you sure you want to delete this role'
  },
    (res) => {
      if (res) {
        removeReq.send(() => removePrivilege(id),
          (res) => {
            if (res.success) {
              privilegeStore.remove(id);
            }
            toasted(res.success, 'Removed Successfully', res.error);
          })
      }
    })
}

</script>

<template>
  <div class="p-7">

    <div class="flex space-x-8 min-[320px]:text-center max-[600px]:flex-col justify-end mr-5">
    

      <div class="flex items-center space-x-4">
        <slot name="select">
          <button class="border-red-100 p-2 flex items-center bg-primary ">
            <svg width="14" height="14" viewBox="0 0 12 14" fill="#263558" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4.04995C0.723858 4.04995 0.5 4.27381 0.5 4.54995C0.5 4.82609 0.723858 5.04995 1 5.04995V4.04995ZM2.2 5.04995C2.47614 5.04995 2.7 4.82609 2.7 4.54995C2.7 4.27381 2.47614 4.04995 2.2 4.04995V5.04995ZM1 6.44995C0.723858 6.44995 0.5 6.67381 0.5 6.94995C0.5 7.22609 0.723858 7.44995 1 7.44995V6.44995ZM2.2 7.44995C2.47614 7.44995 2.7 7.22609 2.7 6.94995C2.7 6.67381 2.47614 6.44995 2.2 6.44995V7.44995ZM1 8.84995C0.723858 8.84995 0.5 9.07381 0.5 9.34995C0.5 9.62609 0.723858 9.84995 1 9.84995V8.84995ZM2.2 9.84995C2.47614 9.84995 2.7 9.62609 2.7 9.34995C2.7 9.07381 2.47614 8.84995 2.2 8.84995V9.84995ZM6.9 5.14995V4.64995H5.9V5.14995H6.9ZM5.9 8.74995V9.24995H6.9V8.74995H5.9ZM8.2 7.44995H8.7V6.44995H8.2V7.44995ZM4.6 6.44995H4.1V7.44995H4.6V6.44995ZM1 5.04995H2.2V4.04995H1V5.04995ZM1 7.44995H2.2V6.44995H1V7.44995ZM1 9.84995H2.2V8.84995H1V9.84995ZM2.8 13.45H10V12.45H2.8V13.45ZM10 13.45C10.9389 13.45 11.7 12.6889 11.7 11.75H10.7C10.7 12.1366 10.3866 12.45 10 12.45V13.45ZM11.7 11.75V2.14995H10.7V11.75H11.7ZM11.7 2.14995C11.7 1.21107 10.9389 0.449951 10 0.449951V1.44995C10.3866 1.44995 10.7 1.76335 10.7 2.14995H11.7ZM10 0.449951H2.8V1.44995H10V0.449951ZM2.8 0.449951C1.86112 0.449951 1.1 1.21107 1.1 2.14995H2.1C2.1 1.76335 2.4134 1.44995 2.8 1.44995V0.449951ZM1.1 2.14995V11.75H2.1V2.14995H1.1ZM1.1 11.75C1.1 12.6889 1.86112 13.45 2.8 13.45V12.45C2.4134 12.45 2.1 12.1366 2.1 11.75H1.1ZM5.9 5.14995V8.74995H6.9V5.14995H5.9ZM8.2 6.44995H4.6V7.44995H8.2V6.44995Z"
                fill="white" />
            </svg>
            <RouterLink to="/add_privilege"><span class="truncate px-3  text-white">Add
                Privilege</span></RouterLink>
            <!-- <span class="truncate px-3">Add Privilege</span> -->
          </button>
        </slot>
      </div>
    </div>
    <PrivilegesDataProvider v-slot="{ privileges, pending }">
      {{ console.log(privileges) }}
      <Table :headers="{
        head: [
          'Privilege Name',
          'Privilege Description',
          'Privilege Category',
          'actions',
        ],
        row: [
          'privilegeName',
          'privilegeDescription',
          'privilegeCategory',
        ]
      }" :pending="pending" :rows="privileges || []">
        <template #actions="{ row }">
          <div class="flex gap-2">
            <button class="rounded-lg bg-gray-600 items-center text-white px-2 py-1 border-gray-300 flex gap-1"
              @click='$router.push("/edit_privilege/" + row?.privilegeUuid)'>
              <BaseIcon :path="mdiPencil" />
              Edit
            </button>
            <button class="rounded-lg bg-[#FF4C4C] items-center text-white px-2 py-1 border-gray-300 flex gap-1"
              @click="remove(row?.privilegeUuid)">
              <BaseIcon :path="mdiDeleteAlert" />
              Delete
            </button>
            <!-- <Dropdown top="120%" v-slot="{ setRef, toggleDropdown }">
              <button @click="toggleDropdown">
                <BaseIcon :path="mdiDotsVertical" class="bg-black/10 rounded-full" />
              </button>
              <div :ref="setRef">
                <div class="flex flex-col *:text-left gap-2 p-2 bg-white shadow-lg w-40">
                  <button class="rounded-lg bg-gray-600 text-white px-2 py-1 border-gray-300 flex gap-1"
                    @click='$router.push("/edit_privilege/" + row?.privilegeUuid)'>
                    <BaseIcon :path="mdiPencil" />
                    Edit
                  </button>
                  <button class="rounded-lg bg-[#FF4C4C] text-white px-2 py-1 border-gray-300 flex gap-1"
                    @click="remove(row?.privilegeUuid)">
                    <BaseIcon :path="mdiDeleteAlert" />
                    Delete
                  </button>
                </div>
              </div>
            </Dropdown> -->
          </div>
        </template>
      </Table>
    </PrivilegesDataProvider>
  </div>


</template>