<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import BaseIcon from '@/components/base/BaseIcon.vue';
import {
  mdiArrowRight,
  mdiBookOpenPageVariant,
  mdiCalendarCheck,
  mdiChartTimelineVariant,
  mdiCreditCardCheckOutline,
  mdiLogin,
  mdiMonitorCellphone,
  mdiShieldCheck,
  mdiStarFourPoints,
  mdiViewDashboard,
  mdiBookmarkCheckOutline,
} from '@mdi/js';

const router = useRouter();
const auth = useAuth();

const isAuthenticated = computed(() => Boolean(auth?.auth?.accessToken));

const features = [
  {
    icon: mdiBookOpenPageVariant,
    title: 'Unified material catalog',
    description: 'Manage physical and digital collections together with clean search, detail, and availability views.',
  },
  {
    icon: mdiCalendarCheck,
    title: 'Reservation and borrow flow',
    description: 'Members can reserve unavailable books, while staff can issue and track circulation with less friction.',
  },
  {
    icon: mdiCreditCardCheckOutline,
    title: 'Overdue fine payments',
    description: 'Returned items with overdue fines move into a payment flow that members can settle online.',
  },
  {
    icon: mdiChartTimelineVariant,
    title: 'Role-aware dashboarding',
    description: 'Each user role gets a clearer operational snapshot instead of one generic administrative screen.',
  },
];

const roleHighlights = [
  {
    title: 'Members',
    text: 'Discover materials, reserve books, monitor borrowed items, and settle overdue fines from one place.',
  },
  {
    title: 'Stack Staff',
    text: 'Handle borrowing, returns, and circulation activity with real-time visibility into availability and due dates.',
  },
  {
    title: 'Technical Staff',
    text: 'Manage material records, digital resources, and collection quality without waiting on manual refreshes.',
  },
  {
    title: 'Administrators',
    text: 'Oversee libraries, users, analytics, and system health through a cleaner, more actionable interface.',
  },
];

function goToPrimary() {
  router.push(isAuthenticated.value ? '/dashboard' : '/login');
}

function goToSecondary() {
  router.push('/material');
}
</script>

<template>
  <div class="homepage-shell min-h-screen overflow-hidden bg-[#f5f1e8] text-slate-900">
    <div class="homepage-orb orb-one"></div>
    <div class="homepage-orb orb-two"></div>
    <div class="homepage-grid"></div>

    <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <header class="flex flex-col gap-4 rounded-full border border-white/70 bg-white/70 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-3">
          <div class="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-amber-300 shadow-lg">
            <BaseIcon :path="mdiStarFourPoints" size="22" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">HU Library Flow</p>
            <h1 class="text-lg font-bold text-slate-950">Digital Library Reservation and Borrowing System</h1>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            @click="router.push('/login')"
          >
            <span class="inline-flex items-center gap-2">
              <BaseIcon :path="mdiLogin" size="16" />
              Login
            </span>
          </button>

          <button
            class="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            @click="goToPrimary"
          >
            <span class="inline-flex items-center gap-2">
              <BaseIcon :path="isAuthenticated ? mdiViewDashboard : mdiArrowRight" size="16" />
              {{ isAuthenticated ? 'Open Dashboard' : 'Enter the System' }}
            </span>
          </button>
        </div>
      </header>

      <main class="mt-8 grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section class="space-y-7">
          <div class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
            <BaseIcon :path="mdiShieldCheck" size="16" />
            Library operations with calmer workflows
          </div>

          <div class="space-y-5">
            <h2 class="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              Borrowing, returns, reservations, and fines finally feel like one system.
            </h2>
            <p class="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              This platform brings together collection management, borrowing activity, overdue fine payment, and
              role-based dashboards in a single digital library experience designed for Hawassa University workflows.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              class="rounded-[22px] bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              @click="goToPrimary"
            >
              <span class="inline-flex items-center gap-2">
                <BaseIcon :path="isAuthenticated ? mdiViewDashboard : mdiArrowRight" size="18" />
                {{ isAuthenticated ? 'Go to dashboard' : 'Start with login' }}
              </span>
            </button>

            <button
              class="rounded-[22px] border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              @click="goToSecondary"
            >
              <span class="inline-flex items-center gap-2">
                <BaseIcon :path="mdiBookOpenPageVariant" size="18" />
                Explore materials
              </span>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article
              v-for="feature in features"
              :key="feature.title"
              class="rounded-[26px] border border-white/80 bg-white/75 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <div class="flex items-start gap-4">
                <div class="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-amber-300">
                  <BaseIcon :path="feature.icon" size="22" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-900">{{ feature.title }}</h3>
                  <p class="mt-2 text-sm leading-6 text-slate-600">{{ feature.description }}</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="relative">
          <div class="absolute -left-10 top-12 hidden h-32 w-32 rounded-full bg-amber-300/25 blur-3xl lg:block"></div>
          <div class="absolute -right-10 bottom-8 hidden h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl lg:block"></div>

          <div class="relative overflow-hidden rounded-[34px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.25)] sm:p-8">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.22),_transparent_28%)]"></div>

            <div class="relative space-y-6">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Operational Preview</p>
                  <h3 class="mt-2 text-2xl font-bold">Designed for every role in the library cycle</h3>
                </div>
                <div class="rounded-2xl bg-white/10 p-3 text-amber-300">
                  <BaseIcon :path="mdiMonitorCellphone" size="22" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Live Modules</p>
                  <div class="mt-4 space-y-3 text-sm">
                    <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span>Borrow & return tracking</span>
                      <BaseIcon :path="mdiBookmarkCheckOutline" size="18" class="text-emerald-300" />
                    </div>
                    <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span>Reservation handling</span>
                      <BaseIcon :path="mdiCalendarCheck" size="18" class="text-sky-300" />
                    </div>
                    <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span>Fine payment workflow</span>
                      <BaseIcon :path="mdiCreditCardCheckOutline" size="18" class="text-amber-300" />
                    </div>
                  </div>
                </div>

                <div class="rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,_rgba(255,255,255,0.18),_rgba(255,255,255,0.05))] p-5">
                  <p class="text-xs uppercase tracking-[0.28em] text-slate-300">Why it feels better</p>
                  <div class="mt-4 space-y-4">
                    <div>
                      <p class="text-3xl font-black tracking-tight">No more stale pages</p>
                      <p class="mt-2 text-sm leading-6 text-slate-200/80">
                        Shared state, responsive views, and synced actions reduce the need for manual refreshes after updates.
                      </p>
                    </div>
                    <div class="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                      Better on desktop. Better on mobile. Better for the people actually running the desk.
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3">
                <article
                  v-for="role in roleHighlights"
                  :key="role.title"
                  class="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <p class="text-sm font-bold text-white">{{ role.title }}</p>
                  <p class="mt-1 text-sm leading-6 text-slate-300">{{ role.text }}</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.homepage-shell {
  position: relative;
}

.homepage-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.045) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at center, black 38%, transparent 92%);
  pointer-events: none;
}

.homepage-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(42px);
  opacity: 0.8;
  pointer-events: none;
}

.orb-one {
  top: 4rem;
  left: -5rem;
  height: 16rem;
  width: 16rem;
  background: rgba(251, 191, 36, 0.22);
}

.orb-two {
  right: -5rem;
  bottom: 5rem;
  height: 18rem;
  width: 18rem;
  background: rgba(16, 185, 129, 0.18);
}
</style>

