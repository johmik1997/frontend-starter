<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Table from '@/components/Table.vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { usePaginations } from '@/composables/usePaginationTemp';
import { useRouter } from 'vue-router';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { mdiBookmark, mdiCloseCircle, mdiMagnify } from '@mdi/js';
import { secondDateFormatWithTime, toasted } from '@/utils/utils';
import { getAllBorrows, updateBorrowById } from '../api/borrowApi';
import { useBorrow } from '../store/borrowStore';
import BorrowHeader from '../components/BorrowHeader.vue';
import { emitEntityMutation, subscribeEntityMutation } from '@/utils/entitySync';

const borrowStore = useBorrow();
const cancelReq = useApiRequest();
const router = useRouter();
const searchQuery = ref('');
let unsubscribeEntitySync = () => {};

const pagination = usePaginations({
  store: borrowStore,
  cb: getAllBorrows,
});

onMounted(() => {
  unsubscribeEntitySync = subscribeEntityMutation('borrows', () => {
    pagination.refresh();
  });
});

onBeforeUnmount(() => {
  unsubscribeEntitySync?.();
});

const filteredBorrows = computed(() => {
  const rows = borrowStore.borrows || [];
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return rows;

  return rows.filter((row) => {
    return [
      row?.material_title,
      row?.material_author,
      row?.member_name,
      row?.member_id_number,
      row?.status,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
});

const headerStats = computed(() => {
  const rows = borrowStore.borrows || [];
  return {
    total: rows.length,
    available: rows.filter((row) => row?.status === 'RETURNED' || row?.status === 'COMPLETED').length,
    borrowed: rows.filter((row) => row?.status === 'BORROWED' || row?.status === 'RESERVED').length,
    categories: new Set(
      rows
        .map((row) => row?.material_category || row?.category)
        .filter(Boolean)
    ).size,
  };
});

function getBorrowId(row) {
  return row?.id || row?.borrowUuid || row?.uuid;
}

function cancelBorrow(row) {
  const id = getBorrowId(row);
  if (!id) return;

  openModal(
    'Confirmation',
    {
      title: 'Cancel Borrow',
      message: 'Are you sure you want to cancel this borrow?',
    },
    (confirm) => {
      if (!confirm) return;

      cancelReq.send(
        () => updateBorrowById(id, { status: 'CANCELLED' }),
        (res) => {
          if (res.success) {
            const updated = res.data || { ...row, status: 'CANCELLED' };
            borrowStore.update(id, updated);
            emitEntityMutation('borrows', { action: 'updated', id, status: 'CANCELLED' });
            toasted(true, 'Borrow cancelled');
          } else {
            toasted(false, '', res.error || 'Failed to cancel borrow');
          }
        }
      );
    }
  );
}
</script>

<template>
  <div class="p-4 sm:p-7">
     <div class="mb-6">
      <BorrowHeader :stats="headerStats" :show-view-toggle="false" />
    </div>
    <div class="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
       
      <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-2">
            <BaseIcon :path="mdiBookmark" size="28" />
            Borrow Management
          </h1>
          <p class="text-sm text-gray-500 mt-1">Search and manage active borrow records</p>
        </div>

        <button
          @click="router.push('/borrows/add')"
          class="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 12 14" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0V14M0 7H12" stroke="white" stroke-width="2"/>
          </svg>
          <span>Add Borrow</span>
        </button>
      </div>
      <div class="mt-4 relative">
        <BaseIcon
          :path="mdiMagnify"
          size="18"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by material, author, member, ID, or status..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
        />
      </div>
      
    </div>

  

    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <Table
        :pending="pagination.pending.value"
        :pagination="pagination.meta.value"
        @next-page="pagination.next"
        @prev-page="pagination.previous"
        @page-change="pagination.goToPage"
        @page-size-change="pagination.setPerPage"
        :headers="{
          head: [
            'Material',
            'Author',
            'Member Name',
            'Member ID',
            'Borrowed At',
            'Returns At',
            'Status',
            // 'Actions',
          ],
          row: [
            'material_title',
            'material_author',
            'member_name',
            'member_id',
            'borrow_date',
            'due_date',
            'status',
          ],
        }"
        :cells="{
          borrow_date: (val) => secondDateFormatWithTime(val) || '-',
          due_date: (val) => secondDateFormatWithTime(val) || '-',
        }"
        :rows="filteredBorrows"
      >
        <template #actions="{ row }">
          <button
            v-if="row?.status === 'RESERVED'"
            class="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded flex items-center gap-1"
            @click="cancelBorrow(row)"
          >
            <BaseIcon :path="mdiCloseCircle" size="16" />
            <span>Cancel</span>
          </button>
          <span v-else class="text-xs text-gray-500">No action</span>
        </template>
      </Table>
    </div>
  </div>
</template>
