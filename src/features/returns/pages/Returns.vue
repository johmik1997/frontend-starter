<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { openModal } from '@customizer/modal-x';
import BaseIcon from '@/components/base/BaseIcon.vue';
import Table from '@/components/Table.vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllBorrows } from '@/features/borrow/api/borrowApi';
import { createReturn, getAllReturns } from '../api/returnApi';
import { emitEntityMutation, subscribeEntityMutation } from '@/utils/entitySync';
import { secondDateFormatWithTime, toasted } from '@/utils/utils';
import {
  mdiKeyboardReturn,
  mdiMagnify,
  mdiRefresh,
  mdiClockAlertOutline,
  mdiCheckCircleOutline,
  mdiCashMultiple,
} from '@mdi/js';

const borrowReq = useApiRequest();
const returnReq = useApiRequest();
const createReq = useApiRequest();
const searchQuery = ref('');
let unsubscribeEntitySync = () => {};

function rowsFromPayload(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
}

function normalizeStatus(value) {
  return String(value || '').trim().toUpperCase();
}

function amount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function loadPage() {
  borrowReq.send(() => getAllBorrows({ page: 1, size: 200 }));
  returnReq.send(() => getAllReturns({ page: 1, size: 200 }));
}

const borrows = computed(() => rowsFromPayload(borrowReq.response.value));
const returns = computed(() => rowsFromPayload(returnReq.response.value));

const activeBorrows = computed(() =>
  borrows.value.filter((row) => !row?.is_returned && ['BORROWED', 'OVERDUE'].includes(normalizeStatus(row?.status)))
);

const filteredBorrows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return activeBorrows.value;

  return activeBorrows.value.filter((row) =>
    [
      row?.material_title,
      row?.material_author,
      row?.member_name,
      row?.member_id,
      row?.status,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  );
});

const recentReturns = computed(() =>
  [...returns.value].sort((a, b) => new Date(b?.return_date || 0) - new Date(a?.return_date || 0)).slice(0, 8)
);

const stats = computed(() => ({
  activeReturns: activeBorrows.value.length,
  overdue: activeBorrows.value.filter((row) => normalizeStatus(row?.status) === 'OVERDUE').length,
  completedToday: returns.value.filter((row) => {
    const returnDate = new Date(row?.return_date || 0);
    const now = new Date();
    return (
      returnDate.getFullYear() === now.getFullYear() &&
      returnDate.getMonth() === now.getMonth() &&
      returnDate.getDate() === now.getDate()
    );
  }).length,
  pendingFineTotal: returns.value.reduce((sum, row) => {
    if (amount(row?.fine_amount) <= 0 || normalizeStatus(row?.payment_status) === 'COMPLETED') {
      return sum;
    }
    return sum + amount(row?.fine_amount);
  }, 0),
}));

function recordReturn(row) {
  openModal(
    'Confirmation',
    {
      title: 'Record Return',
      message: `Record return for "${row?.material_title || 'this material'}"?`,
    },
    (confirmed) => {
      if (!confirmed) return;

      createReq.send(
        () => createReturn({ borrow: row?.id }),
        (res) => {
          if (!res?.success) {
            toasted(false, 'Failed to record return', res?.error || 'Unknown error');
            return;
          }

          emitEntityMutation('returns', { action: 'created', id: res?.data?.id });
          emitEntityMutation('borrows', { action: 'updated', id: row?.id, status: 'RETURNED' });
          loadPage();

          const fineAmount = amount(res?.data?.fine_amount);
          if (fineAmount > 0) {
            toasted(true, `Return recorded. Fine due: ETB ${fineAmount.toFixed(2)}`);
          } else {
            toasted(true, 'Return recorded successfully');
          }
        }
      );
    }
  );
}

onMounted(() => {
  loadPage();
  unsubscribeEntitySync = subscribeEntityMutation('*', ({ entity }) => {
    if (['borrows', 'returns', 'payments'].includes(entity)) {
      loadPage();
    }
  });
});

onBeforeUnmount(() => {
  unsubscribeEntitySync?.();
});
</script>

<template>
  <div class="p-4 sm:p-7 space-y-6">
    <section class="rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_42%),linear-gradient(135deg,_#0f172a,_#1d4ed8_58%,_#93c5fd)] p-6 text-white shadow-xl">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/80">Circulation Desk</p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight">Manage returns with live fine visibility.</h1>
          <p class="mt-3 text-sm text-slate-100/85">
            Record returned materials, monitor overdue borrows, and immediately see which items generated fines.
          </p>
        </div>

        <button
          class="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/22"
          @click="loadPage"
        >
          <BaseIcon :path="mdiRefresh" size="18" />
          Refresh
        </button>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Awaiting Return</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.activeReturns }}</p>
          </div>
          <div class="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <BaseIcon :path="mdiKeyboardReturn" size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Overdue</p>
            <p class="mt-2 text-3xl font-bold text-amber-600">{{ stats.overdue }}</p>
          </div>
          <div class="rounded-2xl bg-amber-50 p-3 text-amber-600">
            <BaseIcon :path="mdiClockAlertOutline" size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Returned Today</p>
            <p class="mt-2 text-3xl font-bold text-emerald-600">{{ stats.completedToday }}</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <BaseIcon :path="mdiCheckCircleOutline" size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Unpaid Fines</p>
            <p class="mt-2 text-3xl font-bold text-rose-600">ETB {{ stats.pendingFineTotal.toFixed(2) }}</p>
          </div>
          <div class="rounded-2xl bg-rose-50 p-3 text-rose-600">
            <BaseIcon :path="mdiCashMultiple" size="22" />
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Pending returns</h2>
          <p class="text-sm text-slate-500">Search and record the next returned item without reloading the page.</p>
        </div>

        <div class="relative w-full max-w-xl">
          <BaseIcon :path="mdiMagnify" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by material, member, ID, or status..."
            class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div class="mt-6">
        <Table
          :pending="borrowReq.pending.value || createReq.pending.value"
          :rows="filteredBorrows"
          :show-pagination="false"
          :headers="{
            head: ['Material', 'Author', 'Member', 'Member ID', 'Due Date', 'Status', 'Actions'],
            row: ['material_title', 'material_author', 'member_name', 'member_id', 'due_date', 'status'],
          }"
          :cells="{
            due_date: (val) => secondDateFormatWithTime(val) || '-',
          }"
        >
          <template #actions="{ row }">
            <button
              class="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="createReq.pending.value"
              @click="recordReturn(row)"
            >
              <BaseIcon :path="mdiKeyboardReturn" size="14" />
              Return
            </button>
          </template>
          <template #placeholder>
            <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No active borrows are waiting to be returned.
            </div>
          </template>
        </Table>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Recent return activity</h2>
          <p class="text-sm text-slate-500">Fine totals and payment state are shown for each completed return.</p>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="row in recentReturns"
          :key="row?.id || row?.uuid"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold text-slate-900">{{ row?.material_title || 'Material' }}</h3>
              <p class="mt-1 text-xs text-slate-500">{{ row?.member_name || 'Member' }}</p>
            </div>
            <span
              class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              :class="
                row?.payment_status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-700'
                  : amount(row?.fine_amount) > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-200 text-slate-700'
              "
            >
              {{ amount(row?.fine_amount) > 0 ? row?.payment_status || 'UNPAID' : 'NO FINE' }}
            </span>
          </div>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex items-center justify-between text-slate-500">
              <span>Returned</span>
              <span class="font-medium text-slate-800">{{ secondDateFormatWithTime(row?.return_date) || '-' }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-500">
              <span>Fine</span>
              <span class="font-semibold text-slate-900">ETB {{ amount(row?.fine_amount).toFixed(2) }}</span>
            </div>
          </div>
        </article>

        <div
          v-if="!recentReturns.length && !returnReq.pending.value"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-4"
        >
          No returns recorded yet.
        </div>
      </div>
    </section>
  </div>
</template>

