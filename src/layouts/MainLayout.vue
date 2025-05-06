<script setup>
import Button from "@/components/Button.vue";
import NavBar from "@/components/NavBar.vue";
import navs from "@/config/navs";
import { provide, ref, watch, computed, nextTick, onMounted } from "vue";
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

// Prevent flash issue by delaying dropdown state changes
const toggleDropdown = async (navPath, event) => {
  // Prevent event propagation
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  await nextTick();
  
  if (!openDropdowns.value.has(navPath)) {
    // If we're opening the payment dropdown, just add it without removing others
    if (navPath === '/payment') {
      openDropdowns.value.add(navPath);
    } else {
      // For other dropdowns, close all and open only this one
      openDropdowns.value = new Set([navPath]);
    }
  } else {
    // Toggle off the dropdown when clicked again
    openDropdowns.value.delete(navPath);
  }
};

watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});

// Watch for route changes to handle dropdowns when navigating
watch(() => route.path, (newPath, oldPath) => {
  // Close mobile menu on route change
  isMobileMenuOpen.value = false;
  
  // Extract the base paths for comparison
  const newPathBase = newPath.split('/')[1];
  const oldPathBase = oldPath?.split('/')[1];
  
  // Handle payment section specially
  if (newPathBase === 'payment') {
    // Always keep payment dropdown open when in payment section
    openDropdowns.value.add('/payment');
    
    // Check if we're in a specific payment subsection
    if (newPath.includes('/deposit') || newPath.includes('/depositdetails/')) {
      // Keep deposit dropdown open
      openDropdowns.value.add('/payment/deposit');
    } else if (newPath.includes('/premium') || newPath.includes('/premiumdetails/')) {
      // Keep premium dropdown open
      openDropdowns.value.add('/payment/premium');
    } else if (newPath.includes('/dispersement') || newPath.includes('/dispersementdetails/')) {
      // Keep dispersement dropdown open
      openDropdowns.value.add('/payment/dispersement');
    }
    return;
  }
  
  // Handle quotation section
  if (newPathBase === 'quatation' || newPath.includes('/quatation/details/')) {
    // Keep quotation dropdown open
    if (navs.some(nav => nav.path === '/quatation' && nav.children)) {
      openDropdowns.value.add('/quatation');
    }
    return;
  }
  
  // Handle insurance section
  if (newPathBase === 'insurance' || newPath.includes('/insurance/detail/')) {
    // Keep insurance dropdown open
    if (navs.some(nav => nav.path === '/insurance' && nav.children)) {
      openDropdowns.value.add('/insurance');
    }
    return;
  }
  
  // Only close dropdowns when navigating to a completely different section
  if (newPathBase !== oldPathBase) {
    // We're navigating to a different main section, close all dropdowns
    openDropdowns.value = new Set();
  }
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

const isDropdownOpen = (navPath) => openDropdowns.value.has(navPath);

const isRouteActive = (navPath) => {
  if (navPath === '/') return false;
  
  const currentPath = route.path.toLowerCase();
  const baseNavPath = navPath.toLowerCase();

  // Handle financing routes
  if (baseNavPath === '/payment') {
    // Check if we're in any financing-related route
    return currentPath.startsWith('/payment') || 
           currentPath.includes('/depositdetails/') || 
           currentPath.includes('/premiumdetails/') ||
           currentPath.includes('/dispersementdetails/');
  }

  // Handle deposit routes specifically
  if (baseNavPath === '/payment/deposit') {
    return currentPath === '/payment/deposit' || 
           currentPath.startsWith('/payment/deposit/details/') || 
           currentPath.includes('/depositdetails/');
  }

  // Handle premium routes
  if (baseNavPath === '/payment/premium') {
    return currentPath === '/payment/premium' || 
           currentPath.includes('/premiumdetails/');
  }

  // Handle dispersement routes
  if (baseNavPath === '/payment/dispersement') {
    return currentPath === '/payment/dispersement' || 
           currentPath.includes('/dispersementdetails/');
  }

  // Handle quotation routes
  if (baseNavPath === '/quatation') {
    return currentPath === '/quatation' || 
           currentPath.includes('/quatation/details/');
  }
  
  // Handle insurance routes
  if (baseNavPath === '/insurance') {
    return currentPath === '/insurance' || 
           currentPath.includes('/insurance/detail/');
  }
  
  // Handle drafts
  if (baseNavPath === '/drafts') {
    return currentPath === '/drafts';
  }

  // Default case - check if current path starts with the nav path
  // This helps with detail pages that extend the base path
  return currentPath === baseNavPath || 
         (baseNavPath !== '/' && currentPath.startsWith(baseNavPath + '/'));
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

// Initialize dropdowns based on current route
const initializeDropdowns = () => {
  const currentPath = route.path.toLowerCase();
  
  // Payment section
  if (currentPath.startsWith('/payment')) {
    openDropdowns.value.add('/payment');
    
    // Check specific payment subsections
    if (currentPath.includes('/deposit') || currentPath.includes('/depositdetails/')) {
      openDropdowns.value.add('/payment/deposit');
    } else if (currentPath.includes('/premium') || currentPath.includes('/premiumdetails/')) {
      openDropdowns.value.add('/payment/premium');
    } else if (currentPath.includes('/dispersement') || currentPath.includes('/dispersementdetails/')) {
      openDropdowns.value.add('/payment/dispersement');
    }
  }
  
  // Quotation section
  if (currentPath.startsWith('/quatation') || currentPath.includes('/quatation/details/')) {
    openDropdowns.value.add('/quatation');
  }
  
  // Insurance section
  if (currentPath.startsWith('/insurance') || currentPath.includes('/insurance/detail/')) {
    openDropdowns.value.add('/insurance');
  }
};

// Call initialization on component mount
onMounted(() => {
  initializeDropdowns();
});
</script>

<template>
  <div class="flex h-full w-full overflow-hidden rounded-lg">
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleMobileMenu"
      class="lg:hidden fixed left-1 z-50 p-2 my-1 rounded-lg bg-gray-100 shadow-lg"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-3 w-5 text-[#3C3C9E]" 
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
      class="__scrollable-hidden fixed lg:relative w-[20%] border-r text-white bg-[#3C3C9E] overflow-y-scroll h-full transition-transform duration-300 ease-in-out z-40"
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
                 class="flex rounded transition-all duration-200 ease-linear w-[86%] hover:text-[#3C3C9E] hover:bg-white"
                 :class="{ 
                   'bg-[#FFFFFF4D] text-white': isRouteActive(nav.path) && nav.children && nav.path !== '/payment',
                   'bg-[#EFFFFF4D] text-white font-semibold': isRouteActive(nav.path) && nav.path === '/payment'
                 }">
              <RouterLink
                v-if="!nav.children"
                :to="nav.path"
                class="w-full"
                :class="{
                  'bg-white text-[#3C3C9E]': isRouteActive(nav.path),
                  'router-link-active': isRouteActive(nav.path)
                }"
              >
                <Button class="w-full flex-1 max-w-full flex gap-2 !justify-start items-center pl-3 nav-button">
                  <div class="grid place-items-center rounded">
                    <span v-html="nav.icon" />
                  </div>
                  <span class="text-sm truncate">{{ nav.name }}</span>
                </Button>
              </RouterLink>
              
              <!-- Dropdown Toggle Button -->
              <div
                v-else
                class="flex-1 max-w-full flex  !justify-between items-center py-2  pl-3 pr-2 cursor-pointer"
                :class="{
                  'bg-white text-[#3C3C9E]': isRouteActive(nav.path) && nav.path !== '/payment',
                  'bg-[#FFFFFF4D] text-white hover:bg-white hover:text-[#3C3C9E] font-semibold': isRouteActive(nav.path) && nav.path === '/payment'
                }"
                @click.stop="(event) => toggleDropdown(nav.path, event)"
              >
                <div class="flex gap-2 items-center">
                  <div class="grid place-items-center rounded">
                    <span v-html="nav.icon" />
                  </div>
                  <span class="text-sm truncate">{{ nav.name }}</span>
                </div>
                <i
                  class="transition-transform duration-200"
                  :class="{ 'rotate-180': isDropdownOpen(nav.path) }"
                  v-html="icons.down"
                />
              </div>
            </div>

            <!-- Child Nav Items -->
            <div
              v-if="nav.children"
              class="overflow-hidden transition-all pt-2 duration-200"
              :style="{ 
                height: isDropdownOpen(nav.path) ? `${nav.children.length * 40}px` : '0px'
              }"
            >
              <RouterLink
                v-for="child in nav.children"
                :key="child.name"
                :to="child.path"
                class="block ml-10 text-left child-link h-10 flex items-center"
                :class="{
                  'bg-white text-[#3C3C9E]': isRouteActive(child.path),
                  'router-link-active': isRouteActive(child.path)
                }"
                @click.stop
              >
                <div 
                  class="flex items-center w-full !justify-start text-left py-1.5 hover:text-[#3C3C9E] hover:bg-white cursor-pointer"
                  :class="{
                    'bg-white text-[#3C3C9E]': isRouteActive(child.path),
                    'font-semibold': isRouteActive(child.path)
                  }"
                >
                  <span class="flex text-left pl-5 items-center justify-start">{{ child.name }}</span>
                </div>
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
    <div class="flex flex-col py-2 px-6 w-full lg:w-[80%]">
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
    padding-left: 3rem; /* Space for mobile menu button */
  }
}

/* Active route styling */
.__scrollable-hidden .router-link-active {
  background-color: white !important;
  color: #3C3C9E !important;
}

.__scrollable-hidden .router-link-active .nav-button {
  background-color: transparent !important;
}

.__scrollable-hidden .router-link-active span {
  font-weight: 600;
}

/* Child link styling */
.child-link {
  transition: none !important;
}

/* Add touch scrolling for mobile */
@media (max-width: 1024px) {
  .__scrollable-hidden {
    -webkit-overflow-scrolling: touch;
  }
}
</style>







