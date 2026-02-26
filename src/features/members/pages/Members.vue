<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import icons from "@/utils/icons";
import { ref, onMounted, watch } from 'vue';
import Status_row from '../components/statusRow.vue';

import { removeUndefined } from '@/utils/utils';

import { useMembers } from '../store/members';
import { getMembers } from '../api/membersApi';
import { usePaginationcopy } from '@/composables/usePaginationcopy';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
const membersStore = useMembers();
const searchKey = ref('');

// Use usePaginationcopy instead of usePaginations for consistency
const pagination = usePaginationcopy({
  store: membersStore,
  cb: (data, config) =>
    getMembers(
      removeUndefined({
        ...data,
        search: searchKey.value,
      })
    ),
});
const reservations = ref([
  {
    id: 1,
    bookTitle: "Introduction to Algorithms",
    reservedBy: "Abebe Beso",
    reservedDate: "2025-12-10",
    dueDate: "2025-12-20",
    status: "Active",
    userId: "U1001",
  },
  {
    id: 2,
    bookTitle: "Clean Code",
    reservedBy: "Mekdes Alem",
    reservedDate: "2025-12-12",
    dueDate: "2025-12-22",
    status: "Returned",
    userId: "U1002",
  },
  {
    id: 3,
    bookTitle: "Design Patterns",
    reservedBy: "Samuel Tesfaye",
    reservedDate: "2025-12-05",
    dueDate: "2025-12-15",
    status: "Overdue",
    userId: "U1003",
  },
  {
    id: 4,
    bookTitle: "The Pragmatic Programmer",
    reservedBy: "Aster Tadesse",
    reservedDate: "2025-12-08",
    dueDate: "2025-12-18",
    status: "Active",
    userId: "U1004",
  },
]);

onMounted(async () => {
  await membersStore.fetchMembers();
});

// Watch for changes in searchKey
watch(searchKey, (newValue) => {
  console.log('Search value changed:', newValue);
  // Use send to trigger a new search
  pagination.send();
});

onMounted(async () => {
  // Initial data load
  pagination.send();
});
</script>
<template>
  <DefaultPage placeholder="Search For a Member" class=" justify-start">
    <template #more>
     
     <div class="flex items-center justify-end rounded-lg border-2 border-[#3C3C9E]">
    <button
      class="flex items-center py-2 px-4 gap-2 bg-primary hover:bg-[#3C3C9E] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      role="tab" aria-selected="true" id="tab-all" aria-controls="panel-all"
      @click="activeTab = 'all'">
      <span class="text-white font-semibold">All Reservations</span>
    </button>
    <button
      class="py-2 px-4 text-primary hover:text-[#121238] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      role="tab" aria-selected="false" id="tab-active" aria-controls="panel-active"
      @click="activeTab = 'active'">
      Active
    </button>
    <button
      class="py-2 px-4 text-primary hover:text-[#121238] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      role="tab" aria-selected="false" id="tab-overdue" aria-controls="panel-overdue"
      @click="activeTab = 'overdue'">
      Overdue
    </button>
    <button
      class="py-2 px-4 text-primary hover:text-[#121238] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 rounded-r-lg"
      role="tab" aria-selected="false" id="tab-returned" aria-controls="panel-returned"
      @click="activeTab = 'returned'">
      Returned
    </button>
  </div>

  <!-- Panels -->
  <div v-show="activeTab === 'all'" role="tabpanel" id="panel-all" aria-labelledby="tab-all">
    <p>All book reservations</p>
  </div>
  <div v-show="activeTab === 'active'" role="tabpanel" id="panel-active" aria-labelledby="tab-active">
    <p>Currently active reservations</p>
  </div>
  <div v-show="activeTab === 'overdue'" role="tabpanel" id="panel-overdue" aria-labelledby="tab-overdue">
    <p>Overdue books</p>
  </div>
  <div v-show="activeTab === 'returned'" role="tabpanel" id="panel-returned" aria-labelledby="tab-returned">
    <p>Returned books</p>
  </div>

    </template>
    <Table :headers="{
     head: ['#', 'Book Title', 'Reserved By', 'Reserved Date', 'Due Date', 'Status', 'User ID', 'Actions'],
        row: ['id', 'bookTitle', 'reservedBy', 'reservedDate', 'dueDate', 'status', 'userId']
      
    }" :rowCom="Status_row"
      :rows="reservations"
      :Fallback="TableRowSkeleton">
    <!-- :rowCom="Status_row" :rows="membersStore.members" :Fallback="TableRowSkeleton" -->
    
 <template #actions="{ row }">
          <Button
        @click.prevent="openModal('SendSMS', { userUuid: row.userUuid })"
        className="rounded-[4px] px-[14px] py-[8px] bg-primary text-white"
      >
        Send SMS
      </Button>
        </template>
    </Table>

  </DefaultPage>
</template>
