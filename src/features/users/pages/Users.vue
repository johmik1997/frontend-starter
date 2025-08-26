<script setup>
import Table from '@/components/Table.vue';
import { useUsers } from '../store/userStore';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllUser, removeUserById, verifyUser } from '../Api/UserApi';
import { toasted } from '@/utils/utils';
import { openModal } from '@customizer/modal-x';
import Dropdown from '@/components/Dropdown.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiDeleteAlert, mdiDotsVertical, mdiPencil, mdiCheckDecagram } from '@mdi/js';
import { usePaginations } from '@/composables/usePaginationTemp';
import { ref } from 'vue';

const usersStore = useUsers();
const verificationCode = ref('');
const selectedUser = ref(null);

const pagination = usePaginations({
  store: usersStore,
  cb: getAllUser,
})

const removeReq = useApiRequest();
function remove(id) {
  openModal('Confirmation', {
    title: 'Remove User',
    message: 'Are you sure you want to delete this user'
  }, (res) => {
    if (res) {
      removeReq.send(() => removeUserById(id),
        (res) => {
          if (res.success) {
            usersStore.remove(id)
          }
          toasted(res.success, 'Removed Successfully', res.error);
        })
    }
  })
}

// Verify user function
const verifyReq = useApiRequest();
function openVerifyModal(user) {
  selectedUser.value = user;
  openModal('VerificationModal', {
    title: 'Verify User',
    message: `Enter verification code sent to ${user.mobilePhone}`,
    inputLabel: 'Verification Code',
    inputPlaceholder: 'Enter code here'
  }, (code) => {
    if (code) {
      verifyUserCode(user.mobilePhone, code);
    }
  });
}

function verifyUserCode(phoneNumber, code) {
  verifyReq.send(() => verifyUser(phoneNumber, code),
    (res) => {
      if (res.success) {
        // Update user verification status in the store
        usersStore.updateVerification(selectedUser.value.userUuid, true);
        toasted(true, 'User verified successfully');
      } else {
        toasted(false, '', res.error || 'Verification failed');
      }
    }
  );
}
</script>

<template>
  <div class="p-7">
    <div class="flex space-x-8  min-[320px]:text-center max-[600px]:flex-col justify-end mr-5">
      <div class="m-6 ml-1 flex  item-center ">

      </div>

      <div class="flex items-center space-x-4">
        <slot name="select">
          <button @click="openModal('AddUser')"
            class="border-red-100 gap-3 bg-primary p-2 text-white flex items-center ">
            <svg width="14" height="14" viewBox="0 0 12 14" fill="#263558" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4.04995C0.723858 4.04995 0.5 4.27381 0.5 4.54995C0.5 4.82609 0.723858 5.04995 1 5.04995V4.04995ZM2.2 5.04995C2.47614 5.04995 2.7 4.82609 2.7 4.54995C2.7 4.27381 2.47614 4.04995 2.2 4.04995V5.04995ZM1 6.44995C0.723858 6.44995 0.5 6.67381 0.5 6.94995C0.5 7.22609 0.723858 7.44995 1 7.44995V6.44995ZM2.2 7.44995C2.47614 7.44995 2.7 7.22609 2.7 6.94995C2.7 6.67381 2.47614 6.44995 2.2 6.44995V7.44995ZM1 8.84995C0.723858 8.84995 0.5 9.07381 0.5 9.34995C0.5 9.62609 0.723858 9.84995 1 9.84995V8.84995ZM2.2 9.84995C2.47614 9.84995 2.7 9.62609 2.7 9.34995C2.7 9.07381 2.47614 8.84995 2.2 8.84995V9.84995ZM6.9 5.14995V4.64995H5.9V5.14995H6.9ZM5.9 8.74995V9.24995H6.9V8.74995H5.9ZM8.2 7.44995H8.7V6.44995H8.2V7.44995ZM4.6 6.44995H4.1V7.44995H4.6V6.44995ZM1 5.04995H2.2V4.04995H1V5.04995ZM1 7.44995H2.2V6.44995H1V7.44995ZM1 9.84995H2.2V8.84995H1V9.84995ZM2.8 13.45H10V12.45H2.8V13.45ZM10 13.45C10.9389 13.45 11.7 12.6889 11.7 11.75H10.7C10.7 12.1366 10.3866 12.45 10 12.45V13.45ZM11.7 11.75V2.14995H10.7V11.75H11.7ZM11.7 2.14995C11.7 1.21107 10.9389 0.449951 10 0.449951V1.44995C10.3866 1.44995 10.7 1.76335 10.7 2.14995H11.7ZM10 0.449951H2.8V1.44995H10V0.449951ZM2.8 0.449951C1.86112 0.449951 1.1 1.21107 1.1 2.14995H2.1C2.1 1.76335 2.4134 1.44995 2.8 1.44995V0.449951ZM1.1 2.14995V11.75H2.1V2.14995H1.1ZM1.1 11.75C1.1 12.6889 1.86112 13.45 2.8 13.45V12.45C2.4134 12.45 2.1 12.1366 2.1 11.75H1.1ZM5.9 5.14995V8.74995H6.9V5.14995H5.9ZM8.2 6.44995H4.6V7.44995H8.2V6.44995Z"
                fill="white" />
            </svg>
            Add User
          </button>
        </slot>
      </div>
    </div>

    <Table :pending="pagination.pending.value" :headers="{
      head: [
        'Fullname',
        'Email',
        'Mobile Phone',
        'Role Name',
        'Gender',
        'Verified',
        'Actions',
      ],
      row: [
        'fullname',
        'email',
        'mobilePhone',
        'roleName',
        'gender',
        'isVerified',
      ]
    }" :cells="{
      fullname: (_, row) => {
        return `${row?.title} ${row?.firstName} ${row?.fatherName} ${row?.grandFatherName}`
      },
      isVerified: (_, row) => {
        return row.isVerified ? 'Yes' : 'No'
      }
    }" :rows="usersStore.users || []">

      <template #actions="{ row }">
        <div class="flex gap-2">
          <button class="rounded-lg  bg-gray-600 text-white items-center px-2 py-1 border-gray-300 flex "
            @click='$router.push("/edit_user/" + row?.userUuid)'>
            <BaseIcon :path="mdiPencil" />
            Edit
          </button>
          <button v-if="!row.isVerified" class="rounded-lg bg-green-600 text-white px-2 py-1 items-center border-gray-300 flex"
            @click="openVerifyModal(row)">
            <BaseIcon :path="mdiCheckDecagram" />
            Verify
          </button>
          <button class="rounded-lg bg-[#FF4C4C] text-white px-2 py-1 items-center border-gray-300 flex"
            @click="remove(row?.userUuid)">
            <BaseIcon :path="mdiDeleteAlert" />
            Delete
          </button>
        </div>
      </template>
    </Table>
  </div>
</template>