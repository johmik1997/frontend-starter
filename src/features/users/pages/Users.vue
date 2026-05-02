<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import Table from '@/components/Table.vue';
import { useUsers } from '../store/userStore';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllUser, removeUserById, verifyUser } from '../Api/UserApi';
import { toasted } from '@/utils/utils';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { 
  mdiPencil, 
  mdiDeleteAlert, 
  mdiCheckDecagram, 
  mdiBagPersonalPlus, 
  mdiNaturePeople, 
  mdiHuman,
  mdiMagnify,
  mdiFilter,
  mdiRefresh,
  mdiAccountCheck,
  mdiAccountCancel,
  mdiShieldAccount,
  mdiShieldAccountVariant,
  mdiEmail,
  mdiPhone,
  mdiIdentifier
} from '@mdi/js';
import { usePaginations } from '@/composables/usePaginationTemp';
import { emitEntityMutation, subscribeEntityMutation } from '@/utils/entitySync';

const usersStore = useUsers();
let unsubscribeEntitySync = () => {};
const selectedUser = ref(null);
const roleFilter = ref('');
const statusFilter = ref('');
const searchQuery = ref('');
const searchTimeout = ref(null);

// Role options for filter
const roleOptions = [
  { value: 'MEMBER', label: 'Member', icon: mdiHuman, color: 'blue' },
  { value: 'ADMIN', label: 'Admin', icon: mdiShieldAccount, color: 'purple' },
  { value: 'SUPER ADMIN', label: 'Super Admin', icon: mdiShieldAccountVariant, color: 'red' },
  { value: 'TECHNICAL STAFF', label: 'Technical Staff', icon: mdiNaturePeople, color: 'green' },
  { value: 'STACK STAFF', label: 'Stack Staff', icon: mdiAccountCheck, color: 'emerald' },
  { value: 'FRONT DESK STAFF', label: 'Front Desk Staff', icon: mdiAccountCheck, color: 'teal' },
  { value: 'DEPARTMENT HEAD', label: 'Department Head', icon: mdiBagPersonalPlus, color: 'orange' }
];

// Status options
const statusOptions = [
  { value: 'ACTIVE', label: 'Active', color: 'green' },
  { value: 'INACTIVE', label: 'Inactive', color: 'gray' },
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'BLOCKED', label: 'Blocked', color: 'red' }
];

function getUserId(user) {
  return user?.userUuid || user?.id;
}

function getPhone(user) {
  return user?.phone || user?.mobilePhone || "";
}

function getFullName(user) {
  const first = user?.first_name || user?.firstName || '';
  const last = user?.last_name || user?.lastName || user?.fatherName || '';
  return [first, last].filter(Boolean).join(' ');
}

// Enhanced pagination with filters
const pagination = usePaginations({
  store: usersStore,
  cb: (query) => {
    const filters = {
      ...query,
      role: roleFilter.value || '',
      search: searchQuery.value || ''
    };
    return getAllUser(filters);
  },
});

onMounted(() => {
  unsubscribeEntitySync = subscribeEntityMutation('users', () => {
    pagination.refresh();
  });
});

onBeforeUnmount(() => {
  unsubscribeEntitySync?.();
});

// Watch for filter changes
watch([roleFilter, statusFilter], () => {
  pagination.goToPage(1);
});

// Debounced search
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    pagination.goToPage(1);
  }, 500);
});

// Reset all filters
function resetFilters() {
  roleFilter.value = '';
  statusFilter.value = '';
  searchQuery.value = '';
}

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0;
  if (roleFilter.value) count++;
  if (statusFilter.value) count++;
  if (searchQuery.value) count++;
  return count;
});

// Get role badge color
function getRoleColor(role) {
  const found = roleOptions.find(r => r.value === role);
  return found?.color || 'gray';
}

// Get status badge color
function getStatusColor(status) {
  const found = statusOptions.find(s => s.value === status);
  return found?.color || 'gray';
}

const removeReq = useApiRequest();
function remove(id) {
  openModal(
    'Confirmation',
    {
      title: 'Remove User',
      message: 'Are you sure you want to delete this user?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    },
    (confirm) => {
      if (confirm) {
        removeReq.send(
          () => removeUserById(id),
          (res) => {
            if (res?.success) {
              usersStore.remove(id);
              emitEntityMutation('users', { action: 'deleted', id });
              toasted(true, 'User removed successfully');
              pagination.refresh();
            } else {
              toasted(false, 'Failed to remove user', res?.error || 'Unknown error');
            }
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
      inputPlaceholder: 'Enter 6-digit code',
      inputType: 'text',
      inputPattern: '[0-9]{6}',
      confirmText: 'Verify',
      cancelText: 'Cancel'
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
      if (res?.success) {
        usersStore.updateVerification(getUserId(selectedUser.value), true);
        emitEntityMutation('users', { action: 'verified', id: getUserId(selectedUser.value) });
        toasted(true, 'User verified successfully');
        pagination.refresh();
      } else {
        toasted(false, 'Verification failed', res?.error || 'Invalid code');
      }
    }
  );
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2.5 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg shadow-gray-200">
          <BaseIcon :path="mdiHuman" size="28" class="text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
            User Management
          </h1>
          <p class="text-gray-500 text-sm">Manage users, roles, and permissions</p>
        </div>
      </div>
    </div>
    
    <!-- Filters and Actions Card -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg mb-6 overflow-hidden">
      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-100">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div class="flex-1">
            <div class="relative">
              <BaseIcon 
                :path="mdiMagnify" 
                size="18" 
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, ID, email, or phone..."
                class="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm transition-all focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>
          
          <!-- Active Filters Badge -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="openModal('AddUser')"
              class="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-gray-200 transition-all hover:from-gray-700 hover:to-gray-800"
            >
              <svg width="14" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0V14M0 7H12" stroke="white" stroke-width="2"/>
              </svg>
              <span>Add New User</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Options -->
      <div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Role Filter -->
        <div>
          <label class="block text-xs  font-medium text-gray-500 mb-1.5 flex items-center gap-1">
            <BaseIcon :path="mdiFilter" size="12" />
            Role
          </label>
          <select
            v-model="roleFilter"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all text-sm"
          >
            <option value="">All Roles</option>
            <option v-for="role in roleOptions" :key="role.value" :value="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>


        <!-- Stats Cards -->
        <div class="sm:col-span-2 grid grid-cols-2 gap-3">
          <div class="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200">
            <p class="text-xs text-green-700">Total Users</p>
            <p class="text-xl font-bold text-green-800">{{ usersStore.users?.length || 0 }}</p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-200">
            <p class="text-xs text-blue-700">Active Now</p>
            <p class="text-xl font-bold text-blue-800">
              {{ usersStore.users?.filter(u => u.status === 'ACTIVE').length || 0 }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
<!-- Users Table -->
<div class="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
  
  <div class="border-b border-gray-100">
    <Table 
      :pending="pagination.pending.value" 
      :pagination="pagination.meta.value" 
      @next-page="pagination.next"
      @prev-page="pagination.previous" 
      @page-change="pagination.goToPage" 
      @page-size-change="pagination.setPerPage" 
      :headers="{
        head: [
          'User',
          'ID Number',
          'Email',
          'Phone',
          'Library',
          'Role',
          'Status',
          'Actions'
        ],
        row: [
          'fullname',
          'id_number',
          'email',
          'phone',
          'library_name',
          'role',
          'status',
          'actions'
        ]
      }" 
      :cells="{
        fullname: (_, row) => getFullName(row) || '-',
        id_number: (_, row) => row?.id_number || row?.memberId || row?.userId || '-',
        email: (_, row) => row?.email || '-',
        phone: (_, row) => row?.phone || row?.mobilePhone || '-',
        library_name: (_, row) => row?.library_name || '-',
        role: (_, row) => row?.role || row?.roleName || '-',
        status: (_, row) => row?.status || row?.userStatus || '-'
      }" 
      :rows="usersStore.users || []"
    >

      <!-- Actions -->
      <template #actions="{ row }">
        <div class="flex items-center justify-center gap-2">
          <button
            class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            @click="openModal('EditUser', { user: row })"
          >
            <BaseIcon :path="mdiPencil" size="18" />
          </button>

          <button
            class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
            @click="remove(getUserId(row))"
          >
            <BaseIcon :path="mdiDeleteAlert" size="18" />
          </button>
        </div>
      </template>

      <!-- Empty State -->
      <template #empty>
        <div class="flex flex-col items-center justify-center py-14">
          <BaseIcon :path="mdiHuman" size="48" class="text-gray-300 mb-3" />
          <p class="text-gray-600 font-medium">No users found</p>
          <p class="text-sm text-gray-400">Try changing filters or search</p>
        </div>
      </template>

    </Table>
  </div>
</div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Prevent text wrapping in table cells */
:deep(td) {
  white-space: nowrap;
}

/* Responsive table container */
@media (max-width: 768px) {
  .overflow-x-auto {
    overflow-x: auto;
  }
}
</style>
