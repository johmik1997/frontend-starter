<script setup>
import { ref } from 'vue';
import Table from '@/components/Table.vue';
import { useUsers } from '../store/userStore';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllUser, removeUserById, verifyUser } from '../Api/UserApi';
import { toasted } from '@/utils/utils';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiPencil, mdiDeleteAlert, mdiCheckDecagram } from '@mdi/js';
import { usePaginations } from '@/composables/usePaginationTemp';

const usersStore = useUsers();
const selectedUser = ref(null);

const pagination = usePaginations({
  store: usersStore,
  cb: getAllUser,
});

const removeReq = useApiRequest();
function remove(id) {
  openModal(
    'Confirmation',
    {
      title: 'Remove User',
      message: 'Are you sure you want to delete this user?',
    },
    (confirm) => {
      if (confirm) {
        removeReq.send(
          () => removeUserById(id),
          (res) => {
            if (res.success) usersStore.remove(id);
            toasted(res.success, 'Removed Successfully', res.error);
          }
        );
      }
    }
  );
}

const verifyReq = useApiRequest();
function openVerifyModal(user) {
  selectedUser.value = user;
  openModal(
    'VerificationModal',
    {
      title: 'Verify User',
      message: `Enter verification code sent to ${user.mobilePhone}`,
      inputLabel: 'Verification Code',
      inputPlaceholder: 'Enter code here',
    },
    (code) => {
      if (code) verifyUserCode(user.mobilePhone, code);
    }
  );
}

function verifyUserCode(phone, code) {
  verifyReq.send(
    () => verifyUser(phone, code),
    (res) => {
      if (res.success) {
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
  <div class="p-4 sm:p-7">
    <!-- Add User Button -->
    <div class="flex flex-col sm:flex-row justify-end mb-6 gap-4">
      <button
        @click="openModal('AddUser')"
        class="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 sm:w-auto justify-center"
      >
        <!-- Icon SVG simplified -->
        <svg width="14" height="14" viewBox="0 0 12 14" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 4.05 C0.72 4.05 0.5 4.27 0.5 4.55 C0.5 4.83 0.72 5.05 1 5.05 V4.05 Z..."
            fill="white"
          />
        </svg>
        <span>Add User</span>
      </button>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto">
     
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
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              class="bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
              @click="$router.push('/edit_user/' + row.userUuid)"
            >
              <BaseIcon :path="mdiPencil" />
              <span class=" sm:inline">Edit</span>
            </button>

            <button
              v-if="!row.isVerified"
              class="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
              @click="openVerifyModal(row)"
            >
              <BaseIcon :path="mdiCheckDecagram" />
              <span class=" sm:inline">Verify</span>
            </button>

            <button
              class="bg-[#FF4C4C] text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
              @click="remove(row.userUuid)"
            >
              <BaseIcon :path="mdiDeleteAlert" />
              <span class=" sm:inline">Delete</span>
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
