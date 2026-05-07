<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllLibrary } from '../api/libraryApi';
import {
  createLibraryPolicy,
  getAllLibraryPolicies,
  updateLibraryPolicyById,
} from '../api/policyApi';
import { emitEntityMutation, subscribeEntityMutation } from '@/utils/entitySync';
import { secondDateFormatWithTime, toasted } from '@/utils/utils';
import {
  mdiCogOutline,
  mdiShieldCheckOutline,
  mdiCashClock,
  mdiCalendarSyncOutline,
  mdiRefresh,
} from '@mdi/js';

const policiesReq = useApiRequest();
const librariesReq = useApiRequest();
const saveReq = useApiRequest();
let unsubscribeEntitySync = () => {};

const defaultForm = () => ({
  id: null,
  library: null,
  name: '',
  is_active: true,
  borrow_duration_days: 7,
  max_active_borrows: 3,
  reservation_hold_hours: 24,
  overdue_daily_rate: 0,
  fair_condition_penalty_percent: 10,
  damaged_condition_penalty_percent: 35,
  lost_condition_penalty_percent: 100,
  grace_period_days: 0,
  notes: '',
});

const form = reactive(defaultForm());

function rowsFromPayload(payload, key = null) {
  if (!payload) return [];
  if (key && Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const policies = computed(() => rowsFromPayload(policiesReq.response.value));
const libraries = computed(() => rowsFromPayload(librariesReq.response.value, 'libraries'));

const activePolicy = computed(() => policies.value.find((row) => row?.is_active) || null);

const stats = computed(() => ({
  totalPolicies: policies.value.length,
  activeRate: normalizeNumber(activePolicy.value?.overdue_daily_rate),
  activeBorrowWindow: normalizeNumber(activePolicy.value?.borrow_duration_days),
  activeBorrowLimit: normalizeNumber(activePolicy.value?.max_active_borrows),
}));

const isEditing = computed(() => Boolean(form.id));

function resetForm() {
  Object.assign(form, defaultForm());
}

function hydrateForm(row) {
  Object.assign(form, {
    id: row?.id || null,
    library: row?.library ?? null,
    name: row?.name || '',
    is_active: Boolean(row?.is_active),
    borrow_duration_days: normalizeNumber(row?.borrow_duration_days, 7),
    max_active_borrows: normalizeNumber(row?.max_active_borrows, 3),
    reservation_hold_hours: normalizeNumber(row?.reservation_hold_hours, 24),
    overdue_daily_rate: normalizeNumber(row?.overdue_daily_rate, 0),
    fair_condition_penalty_percent: normalizeNumber(row?.fair_condition_penalty_percent, 10),
    damaged_condition_penalty_percent: normalizeNumber(row?.damaged_condition_penalty_percent, 35),
    lost_condition_penalty_percent: normalizeNumber(row?.lost_condition_penalty_percent, 100),
    grace_period_days: normalizeNumber(row?.grace_period_days, 0),
    notes: row?.notes || '',
  });
}

function loadPage() {
  policiesReq.send(() => getAllLibraryPolicies({ page: 1, size: 100 }));
  librariesReq.send(() => getAllLibrary({ page: 1, size: 200 }));
}

function hydrateActivePolicy() {
  if (!activePolicy.value) return;
  if (form.id) return;
  hydrateForm(activePolicy.value);
}

function buildPayload() {
  return {
    library: form.library || null,
    name: form.name?.trim() || 'Library Policy',
    is_active: Boolean(form.is_active),
    borrow_duration_days: normalizeNumber(form.borrow_duration_days, 7),
    max_active_borrows: normalizeNumber(form.max_active_borrows, 3),
    reservation_hold_hours: normalizeNumber(form.reservation_hold_hours, 24),
    overdue_daily_rate: normalizeNumber(form.overdue_daily_rate, 0),
    fair_condition_penalty_percent: normalizeNumber(form.fair_condition_penalty_percent, 10),
    damaged_condition_penalty_percent: normalizeNumber(form.damaged_condition_penalty_percent, 35),
    lost_condition_penalty_percent: normalizeNumber(form.lost_condition_penalty_percent, 100),
    grace_period_days: normalizeNumber(form.grace_period_days, 0),
    notes: form.notes?.trim() || '',
  };
}

function savePolicy() {
  const payload = buildPayload();
  const request = isEditing.value
    ? () => updateLibraryPolicyById(form.id, payload)
    : () => createLibraryPolicy(payload);

  saveReq.send(request, (res) => {
    if (!res?.success) {
      toasted(false, 'Failed to save library policy', res?.error || 'Unknown error');
      return;
    }

    toasted(true, isEditing.value ? 'Library policy updated successfully' : 'Library policy created successfully');
    emitEntityMutation('library-policies', { action: isEditing.value ? 'updated' : 'created', id: res?.data?.id || form.id });
    resetForm();
    loadPage();
  });
}

onMounted(() => {
  loadPage();
  unsubscribeEntitySync = subscribeEntityMutation('*', ({ entity }) => {
    if (['libraries', 'library-policies'].includes(entity)) {
      loadPage();
    }
  });
});

watch(
  () => policiesReq.response.value,
  () => {
    hydrateActivePolicy();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  unsubscribeEntitySync?.();
});
</script>

<template>
  <div class="space-y-6 p-4 sm:p-7">
    <!-- Hero Section -->
    <section class="rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.28),_transparent_36%),linear-gradient(140deg,_#0f172a,_#14532d_58%,_#86efac)] p-6 text-white shadow-xl">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-100/80">Rules & Enforcement</p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight">Configure borrowing, reservation, and overdue fine policy.</h1>
          <p class="mt-3 text-sm text-emerald-50/85">
            These settings control how long members can borrow, how many active borrows they can keep, and how overdue fines are calculated before a return can be fully settled.
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

    <!-- Stats Cards -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Policies</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.totalPolicies }}</p>
          </div>
          <div class="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <BaseIcon :path="mdiCogOutline" size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Daily Fine</p>
            <p class="mt-2 text-3xl font-bold text-rose-600">ETB {{ stats.activeRate.toFixed(2) }}</p>
          </div>
          <div class="rounded-2xl bg-rose-50 p-3 text-rose-600">
            <BaseIcon :path="mdiCashClock" size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Borrow Window</p>
            <p class="mt-2 text-3xl font-bold text-blue-700">{{ stats.activeBorrowWindow }} days</p>
          </div>
          <div class="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <BaseIcon :path="mdiCalendarSyncOutline" size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Borrow Limit</p>
            <p class="mt-2 text-3xl font-bold text-emerald-700">{{ stats.activeBorrowLimit }}</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <BaseIcon :path="mdiShieldCheckOutline" size="22" />
          </div>
        </div>
      </div>
    </section>

    <!-- Create/Edit Policy Section - Full Width & Large -->
    <section class="w-full">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900 lg:text-3xl">{{ isEditing ? 'Update Policy Rule' : 'Create New Policy Rule' }}</h2>
            <p class="mt-1 text-base text-slate-500">Set the borrowing limits that the return and payment pages will enforce.</p>
          </div>
          <button
            v-if="isEditing"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            @click="resetForm"
          >
            Clear Form
          </button>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <label class="space-y-2 md:col-span-2">
            <span class="text-base font-medium text-slate-700">Library</span>
            <select
              v-model="form.library"
              class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-base text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Global / current library</option>
              <option v-for="library in libraries" :key="library?.id" :value="library?.id">
                {{ library?.name }}
              </option>
            </select>
          </label>

          <label class="space-y-2 md:col-span-2">
            <span class="text-base font-medium text-slate-700">Policy name</span>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-base text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              placeholder="e.g., Main Library Standard Policy"
            />
          </label>

          <label class="space-y-2">
            <span class="text-base font-medium text-slate-700">Borrow duration (days)</span>
            <input 
              v-model="form.borrow_duration_days" 
              type="number" 
              min="1" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2">
            <span class="text-base font-medium text-slate-700">Max active borrows</span>
            <input 
              v-model="form.max_active_borrows" 
              type="number" 
              min="1" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2">
            <span class="text-base font-medium text-slate-700">Reservation hold (hours)</span>
            <input 
              v-model="form.reservation_hold_hours" 
              type="number" 
              min="1" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2">
            <span class="text-base font-medium text-slate-700">Grace period (days)</span>
            <input 
              v-model="form.grace_period_days" 
              type="number" 
              min="0" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2">
            <span class="text-base font-medium text-slate-700">Overdue daily rate (ETB)</span>
            <input 
              v-model="form.overdue_daily_rate" 
              type="number" 
              min="0" 
              step="0.01" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2">
            <span class="text-base font-medium text-slate-700">Fair condition penalty (%)</span>
            <input 
              v-model="form.fair_condition_penalty_percent" 
              type="number" 
              min="0" 
              step="0.01" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2">
            <span class="text-base font-medium text-slate-700">Damaged condition penalty (%)</span>
            <input 
              v-model="form.damaged_condition_penalty_percent" 
              type="number" 
              min="0" 
              step="0.01" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2 ml-8">
            <span class="text-base font-medium text-slate-700">Lost condition penalty (%)</span>
            <input 
              v-model="form.lost_condition_penalty_percent" 
              type="number" 
              min="0" 
              step="0.01" 
              class="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-base outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100" 
            />
          </label>

          <label class="space-y-2 md:col-span-2">
            <span class="text-base font-medium text-slate-700">Notes</span>
            <textarea
              v-model="form.notes"
              rows="5"
              class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-base text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              placeholder="Optional instructions for staff about how this rule set should be applied."
            />
          </label>

          <label class="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5">
            <input 
              v-model="form.is_active" 
              type="checkbox" 
              class="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" 
            />
            <span class="text-base text-slate-700">Set this rule as the active policy for its library.</span>
          </label>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            class="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saveReq.pending.value"
            @click="savePolicy"
          >
            {{ saveReq.pending.value ? 'Saving...' : 'Save Policy' }}
          </button>
          <button
            class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            @click="resetForm"
          >
            Reset Form
          </button>
        </div>
      </div>
    </section>
  </div>
</template>