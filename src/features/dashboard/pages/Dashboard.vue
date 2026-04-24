<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { useAuth } from '@/stores/auth';
import { getAllMaterials } from '@/features/material/api/materialApi';
import { getAllBorrows } from '@/features/borrow/api/borrowApi';
import { getAllReservation } from '@/features/reservation/api/reservationApi';
import { getAllUser } from '@/features/users/Api/UserApi';
import { getAllLibrary } from '@/features/library/api/libraryApi';
import { getAllReturns } from '@/features/returns/api/returnApi';
import { getRecommendedMaterials } from '../api/recommendationApi';
import { subscribeEntityMutation } from '@/utils/entitySync';
import DashboardStatCard from '../components/DashboardStatCard.vue';
import DashboardPanel from '../components/DashboardPanel.vue';
import DashboardActivityBarChart from '../components/DashboardActivityBarChart.vue';
import DashboardMaterialPieChart from '../components/DashboardMaterialPieChart.vue';
import {
  mdiAccountGroup,
  mdiAlertCircle,
  mdiArrowRight,
  mdiBookOpenPageVariant,
  mdiBookshelf,
  mdiCashMultiple,
  mdiChartTimelineVariant,
  mdiCheckCircle,
  mdiClockOutline,
  mdiCreditCardCheckOutline,
  mdiKeyboardReturn,
  mdiLibrary,
  mdiPlus,
  mdiRefresh,
  mdiShieldCrown,
  mdiStarFourPoints,
  mdiViewDashboard,
} from '@mdi/js';

const router = useRouter();
const auth = useAuth();

const physicalReq = useApiRequest();
const digitalReq = useApiRequest();
const borrowReq = useApiRequest();
const reservationReq = useApiRequest();
const usersReq = useApiRequest();
const libraryReq = useApiRequest();
const returnReq = useApiRequest();
const recommendationReq = useApiRequest();

let unsubscribeEntitySync = () => {};

function rowsFromPayload(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.libraries)) return payload.libraries;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
}

function amount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStatus(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeRole(value) {
  return normalizeStatus(value).replace(/^ROLE_/, '');
}

function newestFirst(rows = [], fields = []) {
  return [...rows].sort((a, b) => {
    const aDate = new Date(fields.map((field) => a?.[field]).find(Boolean) || 0).getTime();
    const bDate = new Date(fields.map((field) => b?.[field]).find(Boolean) || 0).getTime();
    return bDate - aDate;
  });
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function getUserId(user) {
  return user?.id || user?.user_id || user?.userId || user?.uuid || null;
}

function sameId(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) return false;
  return String(a) === String(b);
}

function belongsToCurrentUser(row, currentUserId) {
  if (!currentUserId) return false;

  const ids = [
    row?.member,
    row?.member_id,
    row?.memberId,
    row?.member_uuid,
    row?.member?.id,
    row?.member?.uuid,
    row?.user,
    row?.user_id,
    row?.userId,
    row?.created_by,
  ];

  return ids.some((id) => sameId(id, currentUserId));
}

function monthBucketSeries(rows, fields) {
  const keys = [];
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    keys.push({
      label: date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    });
  }

  const counts = new Map(keys.map((item) => [item.key, 0]));
  rows.forEach((row) => {
    const rawDate = fields.map((field) => row?.[field]).find(Boolean);
    const date = new Date(rawDate || 0);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });

  return {
    labels: keys.map((item) => item.label),
    data: keys.map((item) => counts.get(item.key) || 0),
  };
}

const currentUser = computed(() => auth?.auth?.user || {});
const currentUserId = computed(() => getUserId(currentUser.value));
const currentRole = computed(() => normalizeRole(currentUser.value?.role || currentUser.value?.roleName));
const isMember = computed(() => currentRole.value === 'MEMBER');
const isStackStaff = computed(() => currentRole.value === 'STACK STAFF');
const isTechnicalStaff = computed(() => currentRole.value === 'TECHNICAL STAFF');
const isAdminLike = computed(() => ['ADMIN', 'SUPER ADMIN'].includes(currentRole.value));

const physicalMaterials = computed(() => rowsFromPayload(physicalReq.response.value));
const digitalMaterials = computed(() => rowsFromPayload(digitalReq.response.value));
const allMaterials = computed(() => [...physicalMaterials.value, ...digitalMaterials.value]);
const borrows = computed(() => rowsFromPayload(borrowReq.response.value));
const reservations = computed(() => rowsFromPayload(reservationReq.response.value));
const users = computed(() => rowsFromPayload(usersReq.response.value));
const libraries = computed(() => rowsFromPayload(libraryReq.response.value));
const returns = computed(() => rowsFromPayload(returnReq.response.value));
const recommendations = computed(() => recommendationReq.response.value?.results || []);
const recommendationStrategy = computed(() => recommendationReq.response.value?.strategy || 'popular');

const availableMaterials = computed(() =>
  allMaterials.value.filter((row) => amount(row?.available_copies ?? row?.copy_number) > 0).length
);
const totalMembers = computed(() =>
  users.value.filter((user) => normalizeRole(user?.role) === 'MEMBER').length
);
const activeBorrows = computed(() =>
  borrows.value.filter((row) => ['BORROWED', 'OVERDUE'].includes(normalizeStatus(row?.status)) && !row?.is_returned).length
);
const activeReservations = computed(() =>
  reservations.value.filter((row) => normalizeStatus(row?.status) === 'RESERVED').length
);
const overdueBorrows = computed(() =>
  borrows.value.filter((row) => normalizeStatus(row?.status) === 'OVERDUE' && !row?.is_returned).length
);
const pendingReturns = computed(() =>
  borrows.value.filter((row) => !row?.is_returned && ['BORROWED', 'OVERDUE'].includes(normalizeStatus(row?.status))).length
);
const returnedToday = computed(() =>
  returns.value.filter((row) => {
    const returnedAt = new Date(row?.return_date || 0);
    const now = new Date();
    return (
      returnedAt.getFullYear() === now.getFullYear() &&
      returnedAt.getMonth() === now.getMonth() &&
      returnedAt.getDate() === now.getDate()
    );
  }).length
);
const lowStockMaterials = computed(() =>
  physicalMaterials.value.filter((row) => amount(row?.available_copies) > 0 && amount(row?.available_copies) <= 1).length
);
const unpaidFineTotal = computed(() =>
  returns.value.reduce((sum, row) => {
    if (amount(row?.fine_amount) <= 0 || normalizeStatus(row?.payment_status) === 'COMPLETED') {
      return sum;
    }
    return sum + amount(row?.fine_amount);
  }, 0)
);

const myBorrows = computed(() =>
  newestFirst(
    borrows.value.filter((row) => belongsToCurrentUser(row, currentUserId.value)),
    ['borrow_date', 'created_at']
  )
);
const myReservations = computed(() =>
  newestFirst(
    reservations.value.filter((row) => belongsToCurrentUser(row, currentUserId.value)),
    ['reserve_date', 'created_at']
  )
);
const myOutstandingReturns = computed(() =>
  newestFirst(
    returns.value.filter((row) => belongsToCurrentUser(row, currentUserId.value) && amount(row?.fine_amount) > 0),
    ['return_date', 'created_at']
  )
);
const myOutstandingFineTotal = computed(() =>
  myOutstandingReturns.value.reduce((sum, row) => {
    if (normalizeStatus(row?.payment_status) === 'COMPLETED') return sum;
    return sum + amount(row?.fine_amount);
  }, 0)
);

const monthlyBorrows = computed(() => {
  const scopedRows = isMember.value ? myBorrows.value : borrows.value;
  return monthBucketSeries(scopedRows, ['borrow_date', 'created_at']);
});

const monthlyReservations = computed(() => {
  const scopedRows = isMember.value ? myReservations.value : reservations.value;
  return monthBucketSeries(scopedRows, ['reserve_date', 'created_at']);
});

const unavailableMaterials = computed(() => Math.max(allMaterials.value.length - availableMaterials.value, 0));

const recentBorrows = computed(() => newestFirst(borrows.value, ['borrow_date', 'created_at']).slice(0, 5));
const recentReturns = computed(() => newestFirst(returns.value, ['return_date', 'created_at']).slice(0, 5));
const recentReservations = computed(() => newestFirst(reservations.value, ['reserve_date', 'created_at']).slice(0, 5));

const quickActions = computed(() => {
  if (isMember.value) {
    return [
      { label: 'Browse Materials', path: '/material', icon: mdiBookOpenPageVariant, tone: 'blue' },
      { label: 'My Borrows', path: '/my-borrows', icon: mdiBookshelf, tone: 'amber' },
      { label: 'My Reservations', path: '/reservations', icon: mdiClockOutline, tone: 'green' },
      { label: 'Fine Payments', path: '/fine-payments', icon: mdiCreditCardCheckOutline, tone: 'violet' },
    ];
  }

  if (isStackStaff.value) {
    return [
      { label: 'Issue Borrow', path: '/borrows/add', icon: mdiPlus, tone: 'blue' },
      { label: 'Process Returns', path: '/returns', icon: mdiKeyboardReturn, tone: 'green' },
      { label: 'Borrow Records', path: '/borrows', icon: mdiBookshelf, tone: 'amber' },
      { label: 'Materials', path: '/material', icon: mdiBookOpenPageVariant, tone: 'violet' },
    ];
  }

  if (isTechnicalStaff.value) {
    return [
      { label: 'Materials', path: '/material', icon: mdiBookOpenPageVariant, tone: 'blue' },
      { label: 'Add Material', path: '/material', icon: mdiPlus, tone: 'green' },
      { label: 'Catalog Overview', path: '/dashboard', icon: mdiChartTimelineVariant, tone: 'amber' },
      { label: 'Borrow Activity', path: '/borrows', icon: mdiBookshelf, tone: 'violet' },
    ];
  }

  return [
    { label: 'Users', path: '/users', icon: mdiAccountGroup, tone: 'blue' },
    { label: 'Libraries', path: '/library', icon: mdiLibrary, tone: 'green' },
    { label: 'Returns', path: '/returns', icon: mdiKeyboardReturn, tone: 'amber' },
    { label: 'Materials', path: '/material', icon: mdiBookOpenPageVariant, tone: 'violet' },
  ];
});

const dashboardTitle = computed(() => {
  if (isMember.value) return 'Your reading journey, organized.';
  if (isStackStaff.value) return 'Circulation desk at a glance.';
  if (isTechnicalStaff.value) return 'Collection health and digital readiness.';
  return 'Operational visibility across the library system.';
});

const dashboardSubtitle = computed(() => {
  if (isMember.value) {
    return 'Track borrows, reservations, recommendations, and overdue fines from one role-focused home screen.';
  }
  if (isStackStaff.value) {
    return 'Keep borrow and return traffic moving with instant visibility into overdue items, pending returns, and fines.';
  }
  if (isTechnicalStaff.value) {
    return 'Monitor material availability, catalog coverage, and low-stock pressure without bouncing between pages.';
  }
  return 'See the system-wide state of libraries, users, materials, circulation, and payments in a single dashboard.';
});

const statCards = computed(() => {
  if (isMember.value) {
    return [
      {
        label: 'Active Borrows',
        value: myBorrows.value.filter((row) => ['BORROWED', 'OVERDUE'].includes(normalizeStatus(row?.status)) && !row?.is_returned).length,
        description: 'Items currently in your account',
        icon: mdiBookshelf,
        tone: 'blue',
      },
      {
        label: 'Reservations',
        value: myReservations.value.filter((row) => normalizeStatus(row?.status) === 'RESERVED').length,
        description: 'Books waiting in your queue',
        icon: mdiClockOutline,
        tone: 'green',
      },
      {
        label: 'Outstanding Fine',
        value: `ETB ${myOutstandingFineTotal.value.toFixed(2)}`,
        description: 'Only unpaid overdue charges',
        icon: mdiCashMultiple,
        tone: 'amber',
      },
      {
        label: 'Recommended Picks',
        value: recommendations.value.length,
        description: recommendationStrategy.value === 'personalized' ? 'Based on your activity' : 'Popular across the library',
        icon: mdiStarFourPoints,
        tone: 'violet',
      },
    ];
  }

  if (isStackStaff.value) {
    return [
      {
        label: 'Pending Returns',
        value: pendingReturns.value,
        description: 'Borrowed items still out',
        icon: mdiKeyboardReturn,
        tone: 'blue',
      },
      {
        label: 'Overdue Borrows',
        value: overdueBorrows.value,
        description: 'Need follow-up attention',
        icon: mdiAlertCircle,
        tone: 'amber',
      },
      {
        label: 'Returned Today',
        value: returnedToday.value,
        description: 'Processed during this day',
        icon: mdiCheckCircle,
        tone: 'green',
      },
      {
        label: 'Unpaid Fines',
        value: `ETB ${unpaidFineTotal.value.toFixed(2)}`,
        description: 'From returned overdue materials',
        icon: mdiCashMultiple,
        tone: 'violet',
      },
    ];
  }

  if (isTechnicalStaff.value) {
    return [
      {
        label: 'Total Materials',
        value: allMaterials.value.length,
        description: `${physicalMaterials.value.length} physical, ${digitalMaterials.value.length} digital`,
        icon: mdiBookshelf,
        tone: 'blue',
      },
      {
        label: 'Available Materials',
        value: availableMaterials.value,
        description: 'Borrow-ready or immediately accessible',
        icon: mdiCheckCircle,
        tone: 'green',
      },
      {
        label: 'Low Stock',
        value: lowStockMaterials.value,
        description: 'Physical items with one copy left',
        icon: mdiAlertCircle,
        tone: 'amber',
      },
      {
        label: 'Digital Assets',
        value: digitalMaterials.value.length,
        description: 'Downloadable and readable resources',
        icon: mdiViewDashboard,
        tone: 'violet',
      },
    ];
  }

  return [
    {
      label: 'Members',
      value: totalMembers.value,
      description: 'Registered users with MEMBER role',
      icon: mdiAccountGroup,
      tone: 'blue',
    },
    {
      label: 'Libraries',
      value: libraries.value.length,
      description: 'Configured library branches',
      icon: mdiLibrary,
      tone: 'green',
    },
    {
      label: 'Active Borrows',
      value: activeBorrows.value,
      description: 'Borrowed and overdue items still out',
      icon: mdiClockOutline,
      tone: 'amber',
    },
    {
      label: 'Unpaid Fines',
      value: `ETB ${unpaidFineTotal.value.toFixed(2)}`,
      description: 'Across completed returns',
      icon: mdiShieldCrown,
      tone: 'violet',
    },
  ];
});

const dashboardError = computed(() =>
  [
    physicalReq.error.value,
    digitalReq.error.value,
    borrowReq.error.value,
    reservationReq.error.value,
    usersReq.error.value,
    libraryReq.error.value,
    returnReq.error.value,
    recommendationReq.error.value,
  ].find(Boolean)
);

const isLoading = computed(
  () =>
    physicalReq.pending.value ||
    digitalReq.pending.value ||
    borrowReq.pending.value ||
    reservationReq.pending.value ||
    usersReq.pending.value ||
    libraryReq.pending.value ||
    returnReq.pending.value ||
    recommendationReq.pending.value
);

function openMaterial(material) {
  const type = normalizeStatus(material?.material_type) === 'DIGITAL' ? 'digital' : 'physical';
  router.push({
    path: `/material/${material?.id}`,
    query: { type },
  });
}

function loadDashboard() {
  physicalReq.send(() => getAllMaterials({ page: 1, size: 200 }, 'physical'));
  digitalReq.send(() => getAllMaterials({ page: 1, size: 200 }, 'digital'));
  borrowReq.send(() => getAllBorrows({ page: 1, size: 200 }));
  reservationReq.send(() => getAllReservation({ page: 1, size: 200 }));
  usersReq.send(() => getAllUser({ page: 1, size: 200 }));
  libraryReq.send(() => getAllLibrary({ page: 1, size: 200 }));
  returnReq.send(() => getAllReturns({ page: 1, size: 200 }));

  if (isMember.value) {
    recommendationReq.send(() => getRecommendedMaterials({ limit: 6, type: 'all' }));
  } else {
    recommendationReq.response.value = { results: [] };
  }
}

onMounted(() => {
  loadDashboard();
  unsubscribeEntitySync = subscribeEntityMutation('*', ({ entity }) => {
    if (['materials', 'borrows', 'reservations', 'returns', 'payments', 'users', 'libraries'].includes(entity)) {
      loadDashboard();
    }
  });
});

onBeforeUnmount(() => {
  unsubscribeEntitySync?.();
});
</script>

<template>
  <div class="space-y-6 p-4 sm:p-7">
    <section class="overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.22),_transparent_28%),linear-gradient(135deg,_#0f172a,_#1d4ed8_58%,_#93c5fd)] p-6 text-white shadow-[0_28px_90px_rgba(15,23,42,0.2)]">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100/75">Role-aware dashboard</p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{{ dashboardTitle }}</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-100/85 sm:text-base">{{ dashboardSubtitle }}</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            @click="loadDashboard"
          >
            <BaseIcon :path="mdiRefresh" size="18" />
            Refresh
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            @click="router.push('/material')"
          >
            <BaseIcon :path="mdiArrowRight" size="18" />
            Open materials
          </button>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        v-for="card in statCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :description="card.description"
        :icon="card.icon"
        :tone="card.tone"
      />
    </div>

    <div v-if="dashboardError" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      Some dashboard data failed to load. Use refresh to try again.
    </div>

    <div v-if="isLoading" class="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
      Loading live dashboard insights...
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div class="xl:col-span-2">
        <DashboardPanel
          :title="isMember ? 'My six-month activity' : 'Borrow and reservation momentum'"
          :subtitle="isMember ? 'Your own borrow and reservation history over the last six months' : 'System activity during the last six months'"
        >
          <DashboardActivityBarChart
            :labels="monthlyBorrows.labels"
            :borrow-series="monthlyBorrows.data"
            :reservation-series="monthlyReservations.data"
          />
        </DashboardPanel>
      </div>

      <div class="xl:col-span-1">
        <DashboardPanel title="Collection mix" subtitle="Availability and material-type balance">
          <DashboardMaterialPieChart
            :available="availableMaterials"
            :unavailable="unavailableMaterials"
            :physical="physicalMaterials.length"
            :digital="digitalMaterials.length"
          />
        </DashboardPanel>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div class="xl:col-span-1">
        <DashboardPanel title="Quick actions" subtitle="Jump directly into the work that matches your role">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <button
              v-for="action in quickActions"
              :key="action.label"
              class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
              @click="router.push(action.path)"
            >
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm">
                  <BaseIcon :path="action.icon" size="20" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ action.label }}</p>
                  <p class="text-xs text-slate-500">Open page</p>
                </div>
              </div>
              <BaseIcon :path="mdiArrowRight" size="18" class="text-slate-400" />
            </button>
          </div>
        </DashboardPanel>
      </div>

      <div v-if="isMember" class="xl:col-span-2">
        <DashboardPanel
          title="Recommended for you"
          :subtitle="recommendationStrategy === 'personalized' ? 'Built from your borrow and reservation history' : 'Popular resources when there is not enough personal history yet'"
        >
          <div v-if="recommendations.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <button
              v-for="item in recommendations"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
              @click="openMaterial(item)"
            >
              <div class="flex items-center justify-between gap-3">
                <span class="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  {{ item.material_type }}
                </span>
                <span class="text-xs font-semibold text-emerald-600" v-if="item.material_type === 'PHYSICAL'">
                  {{ item.available_copies }} in stock
                </span>
              </div>
              <h3 class="mt-4 text-base font-semibold text-slate-900">{{ item.title }}</h3>
              <p class="mt-1 text-sm text-slate-500">{{ item.author || 'Unknown author' }}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span class="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  {{ item.category || 'General' }}
                </span>
                <span class="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  {{ item.genre || 'Mixed' }}
                </span>
              </div>
              <p class="mt-4 text-xs leading-5 text-slate-500">
                {{ item.reasons?.[0] || 'Recommended from current library activity' }}
              </p>
            </button>
          </div>

          <div v-else class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Recommendations will appear here as soon as the dashboard has enough activity to work with.
          </div>
        </DashboardPanel>
      </div>

      <div v-else class="xl:col-span-2">
        <DashboardPanel title="Operational watchlist" subtitle="What needs attention first">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Circulation</p>
              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Active borrows</span>
                  <span class="font-semibold text-slate-900">{{ activeBorrows }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Overdue borrows</span>
                  <span class="font-semibold text-amber-600">{{ overdueBorrows }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Reservations waiting</span>
                  <span class="font-semibold text-slate-900">{{ activeReservations }}</span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Collection</p>
              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Total materials</span>
                  <span class="font-semibold text-slate-900">{{ allMaterials.length }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Available now</span>
                  <span class="font-semibold text-emerald-600">{{ availableMaterials }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Low stock alerts</span>
                  <span class="font-semibold text-rose-600">{{ lowStockMaterials }}</span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Users & branches</p>
              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Members</span>
                  <span class="font-semibold text-slate-900">{{ totalMembers }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Libraries</span>
                  <span class="font-semibold text-slate-900">{{ libraries.length }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Digital resources</span>
                  <span class="font-semibold text-slate-900">{{ digitalMaterials.length }}</span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Fine status</p>
              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Returned today</span>
                  <span class="font-semibold text-slate-900">{{ returnedToday }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Unpaid fine total</span>
                  <span class="font-semibold text-rose-600">ETB {{ unpaidFineTotal.toFixed(2) }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Return records</span>
                  <span class="font-semibold text-slate-900">{{ returns.length }}</span>
                </div>
              </div>
            </div>
          </div>
        </DashboardPanel>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <DashboardPanel
        :title="isMember ? 'My latest borrows' : 'Recent borrows'"
        :subtitle="isMember ? 'Your newest borrowing activity' : 'Latest circulation movement across the system'"
      >
        <div v-if="(isMember ? myBorrows : recentBorrows).length" class="space-y-3">
          <div
            v-for="row in (isMember ? myBorrows.slice(0, 5) : recentBorrows)"
            :key="row?.id || row?.uuid"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-900">{{ row?.material_title || 'Material' }}</p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ isMember ? (row?.status || '-') : `${row?.member_name || '-'} • ${row?.status || '-'}` }}
                </p>
              </div>
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="normalizeStatus(row?.status) === 'OVERDUE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ row?.status || 'UNKNOWN' }}
              </span>
            </div>
            <p class="mt-3 text-xs text-slate-400">{{ formatDate(row?.borrow_date || row?.created_at) }}</p>
          </div>
        </div>
        <p v-else class="text-sm text-slate-500">No borrow activity found yet.</p>
      </DashboardPanel>

      <DashboardPanel
        :title="isMember ? 'My fines and reservations' : 'Returns and reservations'"
        :subtitle="isMember ? 'Outstanding charges and your latest holds' : 'Latest return records and reservation queue activity'"
      >
        <div v-if="isMember" class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Outstanding fine total</p>
                <p class="mt-2 text-2xl font-bold text-rose-600">ETB {{ myOutstandingFineTotal.toFixed(2) }}</p>
              </div>
              <button
                class="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                @click="router.push('/fine-payments')"
              >
                Open payments
              </button>
            </div>
          </div>

          <div v-if="myReservations.length" class="space-y-3">
            <div
              v-for="row in myReservations.slice(0, 4)"
              :key="row?.id || row?.uuid"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p class="font-semibold text-slate-900">{{ row?.material_title || 'Reserved material' }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ row?.status || '-' }}</p>
              <p class="mt-3 text-xs text-slate-400">{{ formatDate(row?.reserve_date || row?.created_at) }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-slate-500">You do not have any reservation activity yet.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-if="recentReturns.length" class="space-y-3">
            <div
              v-for="row in recentReturns"
              :key="row?.id || row?.uuid"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-900">{{ row?.material_title || 'Returned material' }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ row?.member_name || '-' }}</p>
                </div>
                <span class="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                  {{ amount(row?.fine_amount) > 0 ? `ETB ${amount(row?.fine_amount).toFixed(2)}` : 'NO FINE' }}
                </span>
              </div>
              <p class="mt-3 text-xs text-slate-400">{{ formatDate(row?.return_date || row?.created_at) }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-slate-500">No return activity found yet.</p>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Reservation queue snapshot</p>
            <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-slate-500">Reserved</p>
                <p class="mt-1 text-xl font-semibold text-slate-900">{{ activeReservations }}</p>
              </div>
              <div>
                <p class="text-slate-500">Recent entries</p>
                <p class="mt-1 text-xl font-semibold text-slate-900">{{ recentReservations.length }}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardPanel>
    </div>
  </div>
</template>
