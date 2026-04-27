<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import navs from "@/config/navs";
import { useAuth } from "@/stores/auth";
import { normalizeRoleValue } from "@/utils/authNavigation";
import icons from "@/utils/icons";

const authStore = useAuth();
const route = useRoute();

const search = ref("");
const inputData = ref("");
const isMobileMenuOpen = ref(false);
const openDropdowns = ref(new Set());

const currentUser = computed(() => authStore.auth?.user || null);
const currentRole = computed(() =>
  normalizeRoleValue(
    currentUser.value?.roleName ||
      currentUser.value?.role ||
      currentUser.value?.userRole
  )
);
const displayName = computed(
  () =>
    currentUser.value?.fullName ||
    currentUser.value?.name ||
    currentUser.value?.username ||
    currentUser.value?.email ||
    "Guest"
);
const displayRole = computed(() =>
  currentRole.value
    ? currentRole.value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "User"
);

function canAccessNav(nav) {
  if (!currentUser.value) return false;

  const requiredRoles = Array.isArray(nav?.roles)
    ? nav.roles.map((role) => normalizeRoleValue(role))
    : nav?.role
    ? [normalizeRoleValue(nav.role)]
    : [];

  if (!requiredRoles.length) return true;
  return requiredRoles.includes(currentRole.value);
}

const filteredNavs = computed(() => navs.filter((nav) => canAccessNav(nav)));

const groupedNavs = computed(() =>
  filteredNavs.value.reduce((groups, nav) => {
    const groupName = nav.type || "Workspace";
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(nav);
    return groups;
  }, {})
);

function isRouteActive(path) {
  if (!path) return false;
  const currentPath = route.path.toLowerCase();
  const targetPath = path.toLowerCase();
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function isChildRouteActive(path) {
  return isRouteActive(path);
}

function isDropdownOpen(path) {
  return openDropdowns.value.has(path);
}

function initializeDropdowns() {
  const next = new Set();
  for (const nav of filteredNavs.value) {
    if (!nav.children?.length) continue;
    const hasActiveChild = nav.children.some((child) =>
      isChildRouteActive(child.path)
    );
    if (hasActiveChild) next.add(nav.path);
  }
  openDropdowns.value = next;
}

function toggleDropdown(path, event) {
  event?.stopPropagation();
  event?.preventDefault();

  const next = new Set(openDropdowns.value);
  if (next.has(path)) {
    next.delete(path);
  } else {
    next.add(path);
  }
  openDropdowns.value = next;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function handleEscape(event) {
  if (event.key === "Escape") closeMobileMenu();
}

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu();
    initializeDropdowns();
  },
  { immediate: true }
);

watch(
  () => filteredNavs.value,
  () => {
    initializeDropdowns();
  },
  { deep: true }
);

watch(isMobileMenuOpen, (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = "hidden";
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="main-layout">
    <!-- Mobile overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
    />

    <div class="layout-container">
      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
        <div class="sidebar-header">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <svg class="logo-svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
            </div>
            <div class="logo-text">
              <p class="logo-subtitle">Hawassa Libraries Management</p>
              <h1 class="logo-title">Digital Borrow and Reservation System</h1>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <section v-for="(items, groupName) in groupedNavs" :key="groupName" class="nav-section">
            <p class="nav-section-title">{{ groupName }}</p>
            <div class="nav-items">
              <div v-for="nav in items" :key="nav.path || nav.name">
                <!-- Single link -->
                <RouterLink
                  v-if="!nav.children"
                  :to="nav.path"
                  class="nav-link"
                  :class="{ 'nav-link-active': isRouteActive(nav.path) }"
                  @click="closeMobileMenu"
                >
                  <span class="nav-icon" v-html="nav.icon" />
                  <span class="nav-text">{{ nav.name }}</span>
                </RouterLink>

                <!-- Dropdown -->
                <div v-else class="nav-dropdown">
                  <button
                    class="nav-dropdown-btn"
                    :class="{ 'nav-dropdown-btn-active': isRouteActive(nav.path) }"
                    @click="toggleDropdown(nav.path, $event)"
                  >
                    <span class="nav-icon" v-html="nav.icon" />
                    <span class="nav-text">{{ nav.name }}</span>
                    <span class="dropdown-arrow" :class="{ 'rotated': isDropdownOpen(nav.path) }" v-html="icons.down" />
                  </button>
                  <div v-if="isDropdownOpen(nav.path)" class="nav-dropdown-menu">
                    <RouterLink
                      v-for="child in nav.children"
                      :key="child.path"
                      :to="child.path"
                      class="nav-child-link"
                      :class="{ 'nav-child-link-active': isChildRouteActive(child.path) }"
                      @click="closeMobileMenu"
                    >
                      <span class="nav-bullet" />
                      <span class="nav-text">{{ child.name }}</span>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </nav>

        <div class="sidebar-footer">
          Library Management System © 2026
        </div>
      </aside>

      <!-- Main content -->
      <div class="main-content">
        <header class="main-header">
          <div class="header-container">
            <button
              class="mobile-menu-btn"
              @click="toggleMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <NavBar v-model="search" class="navbar-wrapper" :title="$route.name || 'Workspace'" />
            <LanguageSwitcher compact class="language-switcher" />
          </div>
        </header>

        <main class="content-area">
          <div class="content-container">
            <RouterView :search="search" :inputData="inputData" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main Layout */
.main-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: radial-gradient(circle at top, rgba(72, 201, 176, 0.14), transparent 36%),
              linear-gradient(180deg, rgb(var(--base-clr)), rgb(var(--base-clr2)));
  color: var(--text-clr, #1a1a1a);
}

.layout-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}

@media (min-width: 1024px) {
  .mobile-overlay {
    display: none;
  }
}

/* Sidebar */
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 40;
  width: 320px;
  max-width: 86vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a2e38, #1e566a, #0d3b48);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-100%);
}

.sidebar.mobile-open {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .sidebar {
    position: relative;
    transform: translateX(0);
  }
}

/* Sidebar Header */
.sidebar-header {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  display: flex;
  height: 4rem;
  width: 4rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 1.5rem;
  background: white;
  color: #0d3b48;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
}

.logo-svg {
  height: 2.25rem;
  width: 2.25rem;
}

.logo-text {
  min-width: 0;
  flex: 1;
}

.logo-subtitle {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 0.25rem 0;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.3;
  margin: 0;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  padding: 0 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.45);
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/* Navigation Links */
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link-active {
  background: white;
  color: #0d3b48;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nav-link-active:hover {
  background: white;
  color: #0d3b48;
}

.nav-icon {
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.08);
}

.nav-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dropdown */
.nav-dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.82);
  background: transparent;
  border: none;
  cursor: pointer;
}

.nav-dropdown-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-dropdown-btn-active {
  background: white;
  color: #0d3b48;
}

.dropdown-arrow {
  display: inline-block;
  height: 1rem;
  width: 1rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.nav-dropdown-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  padding-left: 1rem;
  margin-left: 1rem;
}

.nav-child-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
}

.nav-child-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-child-link-active {
  background: white;
  color: #0d3b48;
}

.nav-bullet {
  display: inline-block;
  height: 0.375rem;
  width: 0.375rem;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.7;
  flex-shrink: 0;
}

/* Sidebar Footer */
.sidebar-footer {
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.25rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
}

/* Main Content */
.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

/* Header */
.main-header {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(203, 213, 225, 0.7);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
}

.header-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
}

@media (min-width: 640px) {
  .header-container {
    padding: 0.75rem 1.5rem;
  }
}

.mobile-menu-btn {
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
}

@media (min-width: 1024px) {
  .mobile-menu-btn {
    display: none;
  }
}

.menu-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.navbar-wrapper {
  width: 100%;
}

.language-switcher {
  flex-shrink: 0;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  scroll-behavior: smooth;
}

/* Custom scrollbar for content area */
.content-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.content-area::-webkit-scrollbar-track {
  background: transparent;
}

.content-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.content-container {
  width: 100%;
  max-width: 1600px;
  min-width: fit-content;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 640px) {
  .content-container {
    padding: 1.5rem;
  }
}
</style>