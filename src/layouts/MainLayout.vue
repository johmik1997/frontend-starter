<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import BaseIcon from '@/components/base/BaseIcon.vue';
import navs from '@/config/navs';
import { useAuth } from '@/stores/auth';
import logo from '@/assets/logo.svg';
import { mdiChevronRight, mdiClose, mdiLogout, mdiMenu, mdiShieldAccount } from '@mdi/js';

const route = useRoute();
const router = useRouter();
const authStore = useAuth();
const mobileMenuOpen = ref(false);

function normalizeRole(rawRole) {
  const value = typeof rawRole === 'object' && rawRole !== null
    ? rawRole.roleName || rawRole.name || rawRole.role || rawRole.value
    : rawRole;

  return String(value || '')
    .toUpperCase()
    .replace(/^ROLE_/, '')
    .replace(/_/g, ' ')
    .trim();
}

const currentUser = computed(() => authStore.auth?.user || {});
const currentRole = computed(() => normalizeRole(currentUser.value?.role || currentUser.value?.roleName));
const displayName = computed(() => {
  const firstName = currentUser.value?.first_name || currentUser.value?.firstName || '';
  const lastName = currentUser.value?.last_name || currentUser.value?.lastName || '';
  return [firstName, lastName].filter(Boolean).join(' ') || currentUser.value?.id_number || 'Library User';
});

const filteredNavs = computed(() =>
  navs.filter((nav) => {
    const roles = Array.isArray(nav?.roles) ? nav.roles.map((role) => normalizeRole(role)) : [];
    if (!roles.length) return true;
    return roles.includes(currentRole.value);
  })
);

const currentPageTitle = computed(() => {
  const currentNav = filteredNavs.value.find((nav) => route.path === nav.path || route.path.startsWith(`${nav.path}/`));
  return currentNav?.name || route.name || 'Dashboard';
});

function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`);
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

function logout() {
  authStore.setAuth(undefined);
  localStorage.removeItem('userDetail');
  closeMobileMenu();
  router.push('/login');
}

watch(
  () => route.path,
  () => {
    closeMobileMenu();
  }
);
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
      @click="closeMobileMenu"
    ></div>

    <div class="flex min-h-screen">
      <aside
        class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[linear-gradient(180deg,_#0f172a,_#172554_54%,_#1d4ed8)] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0"
        :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div class="flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur">
              <img :src="logo" alt="Library logo" class="h-9 w-9 object-contain" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100/70">HU Library Flow</p>
              <h1 class="mt-1 text-lg font-bold">Digital Library</h1>
            </div>
          </div>

          <button class="rounded-xl bg-white/10 p-2 text-white lg:hidden" @click="closeMobileMenu">
            <BaseIcon :path="mdiClose" size="18" />
          </button>
        </div>

        <div class="px-5 py-5">
          <div class="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p class="text-xs uppercase tracking-[0.24em] text-blue-100/75">Signed in as</p>
            <p class="mt-2 text-base font-semibold">{{ displayName }}</p>
            <div class="mt-3 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-blue-50">
              <BaseIcon :path="mdiShieldAccount" size="14" />
              {{ currentRole || 'USER' }}
            </div>
          </div>
        </div>

        <nav class="flex-1 space-y-2 overflow-y-auto px-4 pb-6">
          <RouterLink
            v-for="nav in filteredNavs"
            :key="nav.path"
            :to="nav.path"
            class="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition"
            :class="
              isActive(nav.path)
                ? 'bg-white text-slate-900 shadow-lg shadow-slate-950/10'
                : 'text-white/78 hover:bg-white/10 hover:text-white'
            "
          >
            <span class="flex items-center gap-3">
              <span class="grid h-10 w-10 place-items-center rounded-2xl"
                    :class="isActive(nav.path) ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'">
                <span class="h-5 w-5" v-html="nav.icon"></span>
              </span>
              <span>{{ nav.name }}</span>
            </span>
            <BaseIcon :path="mdiChevronRight" size="16" :class="isActive(nav.path) ? 'text-slate-500' : 'text-white/50'" />
          </RouterLink>
        </nav>

        <div class="border-t border-white/10 p-4">
          <button
            class="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
            @click="logout"
          >
            <BaseIcon :path="mdiLogout" size="18" />
            Logout
          </button>
        </div>
      </aside>

      <div class="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div class="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-3">
              <button
                class="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                @click="mobileMenuOpen = true"
              >
                <BaseIcon :path="mdiMenu" size="20" />
              </button>

              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Workspace</p>
                <h2 class="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{{ currentPageTitle }}</h2>
              </div>
            </div>

            <div class="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm sm:flex">
              <span class="font-semibold text-slate-900">{{ displayName }}</span>
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>{{ currentRole || 'USER' }}</span>
            </div>
          </div>
        </header>

        <main class="flex-1 px-0 py-0">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

