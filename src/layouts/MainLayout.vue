<script setup>
import Button from "@/components/Button.vue";
import NavBar from "@/components/NavBar.vue";
import navs from "@/config/navs";
import { provide, ref, watch, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuth } from "@/stores/auth";
import icons from "@/utils/icons";

const authStore = useAuth();
const route = useRoute();
const inputData = ref("");
const search = ref("");
const openDropdowns = ref(new Set());
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});

// Filter navs based on privileges
const filteredNavs = computed(() => {
  return navs.filter(nav => {
    const user = authStore.auth?.user;
    
    // Allow access if user is Super Admin or has All Privileges
    if (user?.privileges?.includes("All Privileges") || user?.roleName === 'Super Admin') {
      return true;
    }

    // Check privileges for the nav item
    if (nav.privilage) {
      const userPrivileges = user?.privileges || [];
      return nav.privilage.some(priv => userPrivileges.includes(`ROLE_${priv}`));
    }

    // If no privileges specified, show the nav item
    return true;
  });
});

// Group filtered navs by type
const grouped = computed(() => {
  return Object.groupBy(filteredNavs.value, (el) => el.type);
});

provide("search", search.value);
watch(
  () => search.value,
  () => {
    console.log("search updated:", search.value);
  }
);

const toggleDropdown = (navPath) => {
  if (openDropdowns.value.has(navPath)) {
    openDropdowns.value.delete(navPath);
  } else {
    openDropdowns.value.add(navPath);
  }
};

const isDropdownOpen = (navPath) => openDropdowns.value.has(navPath);

const isRouteActive = (navPath) => {
  if (navPath === '/') return false;
  
  const currentPath = route.path.toLowerCase();
  const baseNavPath = navPath.toLowerCase();

  if (baseNavPath === '/payment/deposit') {
    return currentPath === '/payment/deposit' || currentPath.startsWith('/depositdetails/');
  }

  if (baseNavPath === '/quatation') {
    return currentPath === '/quatation' || currentPath.includes('/details/');
  }
  
  if (baseNavPath === '/drafts') {
    return currentPath === '/drafts';
  }

  return currentPath === baseNavPath;
};

// Check if a nav item should be visible based on privileges
const shouldShowNavItem = (nav) => {
  const user = authStore.auth?.user;
  
  // Always show if user is Super Admin or has All Privileges
  if (user?.privileges?.includes("All Privileges") || user?.roleName === 'Super Admin') {
    return true;
  }

  // Check privileges for the nav item and its children
  if (nav.privilage || (nav.children && nav.children.some(child => child.privilage))) {
    const userPrivileges = user?.privileges || [];
    const navPrivileges = nav.privilage || [];
    const childrenPrivileges = nav.children?.flatMap(child => child.privilage || []) || [];
    
    return [...navPrivileges, ...childrenPrivileges].some(priv => 
      userPrivileges.includes(`ROLE_${priv}`)
    );
  }

  return true;
};
</script>

<template>
  <div class="flex h-full w-full overflow-hidden rounded-lg">
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6 text-[#3C3C9E]" 
        :class="{ 'transform rotate-90': isMobileMenuOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Sidebar -->
    <div 
      class="__scrollable-hidden fixed lg:relative w-[280px] lg:w-drawer-width border-r text-white bg-[#3C3C9E] overflow-y-scroll h-full transition-transform duration-300 ease-in-out z-40"
      :class="{ '-translate-x-full lg:translate-x-0': !isMobileMenuOpen }"
    >
      <div class="p-4 px-2 h-12 flex gap-4 items-center sticky top-0 bg-[#3C3C9E] z-10">
        <i v-html="icons.cbhi_logo" />
        <span class="font-bold text-lg"></span>
      </div>
      <div class="flex flex-col justify-start !p-2 !px-4 gap-4 mb-44">
        <!-- Loop through grouped navigation items -->
        <div v-for="(navItems, category) in grouped" :key="category" class="flex flex-col gap-2">
          <!-- Category Header -->
          <h3 class="text-sm font-semibold opacity-70 pt-2">{{ category }}</h3>
          
          <!-- Navigation Items -->
          <div v-for="nav in navItems" :key="nav.name" class="flex flex-col">
            <!-- Parent Nav Item -->
            <div v-if="shouldShowNavItem(nav)" 
                 class="flex rounded transition-all duration-200 ease-linear hover:text-[#3C3C9E] hover:bg-white"
                 :class="{ 'bg-[#FFFFFF4D] text-white': isRouteActive(nav.path) && nav.children }">
              <RouterLink
                v-if="!nav.children"
                :to="nav.path"
                class="w-full"
                :class="{
                  'bg-white text-[#3C3C9E]': isRouteActive(nav.path),
                  'router-link-active': isRouteActive(nav.path)
                }"
              >
                <Button class="flex-1 max-w-full flex gap-4 !justify-start items-center pl-5">
                  <div class="grid place-items-center rounded">
                    <span v-html="nav.icon" />
                  </div>
                  <span>{{ nav.name }}</span>
                </Button>
              </RouterLink>
              
              <!-- Dropdown Toggle Button -->
              <Button
                v-else
                class="flex-1 max-w-full flex gap-4 !justify-between items-center pl-5 pr-3"
                :class="{
                  'bg-white text-[#3C3C9E]': isRouteActive(nav.path),
                  'router-link-active': isRouteActive(nav.path)
                }"
                @click="toggleDropdown(nav.path)"
              >
                <div class="flex gap-4 items-center">
                  <div class="grid place-items-center rounded">
                    <span v-html="nav.icon" />
                  </div>
                  <span>{{ nav.name }}</span>
                </div>
                <i
                  class="transition-transform duration-200"
                  :class="{ 'rotate-180': isDropdownOpen(nav.path) }"
                  v-html="icons.down"
                />
              </Button>
            </div>

            <!-- Child Nav Items -->
            <div
              v-if="nav.children"
              class="overflow-hidden transition-all duration-200"
              :class="{ 'h-0': !isDropdownOpen(nav.path) }"
            >
              <RouterLink
                v-for="child in nav.children"
                :key="child.name"
                :to="child.path"
                class="block ml-10 text-left"
              >
                <Button class="flex items-start w-full !justify-start my-2 text-left py-1.5 hover:text-[#3C3C9E] hover:bg-white">
                  <span class="flex text-left pl-5 items-start justify-start">{{ child.name }}</span>
                </Button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      @click="toggleMobileMenu"
    ></div>

    <!-- Main content -->
    <div class="flex flex-col w-full lg:w-[calc(100%-var(--drawer-width))]">
      <div class="navbar-height flex items-center">
        <NavBar 
          v-model="search" 
          class="w-full" 
          :title="$route.name"
        />
      </div>
      <div class="__scrollable-hidden h-[calc(100%-var(--navbar-height))] bg-base-clr2 w-full overflow-y-scroll">
        <RouterView :search="search" :inputData="inputData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar but maintain functionality */
.__scrollable-hidden {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.__scrollable-hidden::-webkit-scrollbar {
  display: none;
}

/* Mobile-specific styles */
@media (max-width: 1024px) {
  .navbar-height {
    padding-left: 4rem; /* Space for mobile menu button */
  }
}

/* Active route styling */
.__scrollable-hidden .router-link-active {
  background-color: theme("colors.white") !important;
  color: #3C3C9E !important;
}

.__scrollable-hidden .router-link-active button {
  background-color: theme("colors.white") !important;
  color: #3C3C9E !important;
}

.__scrollable-hidden .router-link-active button span {
  font-weight: 600;
}

/* Add specific styling for dropdown items */
.__scrollable-hidden .router-link-active.child-link {
  background-color: transparent !important;
  color: inherit !important;
}

.__scrollable-hidden .router-link-active.child-link button {
  background-color: transparent !important;
  color: inherit !important;
}

/* Add touch scrolling for mobile */
@media (max-width: 1024px) {
  .__scrollable-hidden {
    -webkit-overflow-scrolling: touch;
  }
}
</style>































