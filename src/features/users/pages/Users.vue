<script setup>
import { ref } from 'vue';
import Table from '@/components/Table.vue';
import { useUsers } from '../store/userStore';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllUser, removeUserById, verifyUser } from '../Api/UserApi';
import { toasted } from '@/utils/utils';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiPencil, mdiDeleteAlert, mdiCheckDecagram, mdiBagPersonalPlus, mdiNaturePeople, mdiHuman } from '@mdi/js';
import { usePaginations } from '@/composables/usePaginationTemp';

const usersStore = useUsers();
const selectedUser = ref(null);

function getUserId(user) {
  return user?.userUuid || user?.id;
}

function getPhone(user) {
  return user?.phone || user?.mobilePhone || "";
}

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
      message: `Enter verification code sent to ${getPhone(user)}`,
      inputLabel: 'Verification Code',
      inputPlaceholder: 'Enter code here',
    },
    (code) => {
      if (code) verifyUserCode(getPhone(user), code);
    }
  );
}

function verifyUserCode(phone, code) {
  verifyReq.send(
    () => verifyUser(phone, code),
    (res) => {
      if (res.success) {
        usersStore.updateVerification(getUserId(selectedUser.value), true);
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
     <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
       <h1 class="text-2xl font-bold flex items-center gap-2">
        <BaseIcon :path="mdiHuman" size="28" />
        User Management
      </h1>
      
      <button
        @click="openModal('AddUser')"
        class="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 12 14" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 0V14M0 7H12" stroke="white" stroke-width="2"/>
        </svg>
        <span>Add User</span>
      </button>
    </div>
    
    <!-- Users Table -->
    <div class="overflow-x-auto">
     
    <Table :pending="pagination.pending.value" :pagination="pagination.meta.value" @next-page="pagination.next"
      @prev-page="pagination.previous" @page-change="pagination.goToPage" @page-size-change="pagination.setPerPage" :headers="{
      head: [
        'Fullname',
        'Email',
        'Mobile Phone',
        'Role',
        'Status',
        'Verified',
        'Actions',
      ],
      row: [
        'fullname',
        'email',
        'phone',
        'role',
        'status',
        'isVerified',
      ]
    }" :cells="{
      fullname: (_, row) => {
        const first = row?.first_name || row?.firstName || '';
        const last = row?.last_name || row?.lastName || row?.fatherName || '';
        return [first, last].filter(Boolean).join(' ')
      },
      phone: (_, row) => {
        return row?.phone || row?.mobilePhone || '-'
      },
      role: (_, row) => {
        return row?.role || row?.roleName || '-'
      },
      status: (_, row) => {
        return row?.status || row?.userStatus || '-'
      },
      isVerified: (_, row) => {
        return row?.isVerified ? 'Yes' : 'No'
      }
    }" :rows="usersStore.users || []">

        <template #actions="{ row }">
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              class="bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
              @click="$router.push('/edit_user/' + getUserId(row))"
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
              @click="remove(getUserId(row))"
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
