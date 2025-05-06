<script setup>
import { provide, ref, watch } from "vue";
import icons from "@/utils/icons";
import { useAuth } from "@/stores/auth";
import { useRouter } from 'vue-router';

const router = useRouter();
function logout() {
  localStorage.removeItem("userDetail");
  window.location.href = "/login";
}
const props = defineProps({
  modelValue: {
    type: String,
  },
  title: {
    Type: String,
  },
});

const inputData = ref("");
const emit = defineEmits(["update:modelValue"]);
const showUserMenu = ref(false);

const auth = useAuth();
const user = auth?.auth?.user || { name: "Birhane Araya", role: "Marketing Administrator" };

watch(inputData, () => {
  emit("update:modelValue", inputData.value);
});

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const goBack = () => {
  router.go(-1);
};
</script>
<template>
  <div class="flex justify-between items-center  bg-gray-50 relative">
    <!-- Left Side - Back Button and Title -->
    <div class="flex items-center gap-2 sm:gap-4">
      <button 
        @click="goBack" 
        class="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
      >
        <span class="item-center">
          <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd"
              d="M5.82539 1.0134C6.03505 1.20471 6.05933 1.54072 5.87962 1.76391L2.15854 6.38525L5.87962 11.0066C6.05933 11.2298 6.03505 11.5658 5.82539 11.7571C5.61572 11.9484 5.30007 11.9226 5.12036 11.6994L1.12037 6.73164C0.959876 6.53232 0.959876 6.23819 1.12037 6.03887L5.12036 1.07113C5.30008 0.847943 5.61572 0.822096 5.82539 1.0134Z"
              fill="#263558" stroke="#263558" stroke-linecap="round" 
            />
          </svg>
        </span>
        
      </button>
      <span class="capitalize text-base sm:text-lg font-bold truncate">{{ props.title }}</span>
    </div>

    <!-- Right Side - User Info and Icons -->
    <div class="flex gap-2 sm:gap-4 items-center">
      <!-- Icons - Hidden on mobile, visible on tablet and up -->
      <div class="hidden sm:flex gap-4 items-center">
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <i v-html="icons.notification" />
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <i v-html="icons.message" />
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <i v-html="icons.bire" />
        </button>
      </div>

      <!-- User Profile Section -->
      <div class="relative">
        <button 
          @click="toggleUserMenu"
          class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <!-- User Info - Hidden on mobile -->
          <div class="hidden sm:block text-right">
            <p class="font-Poppin text-sm">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.role }}</p>
          </div>
          
          <!-- Mobile User Icon -->
          <!-- <div class="sm:hidden w-8 h-8 rounded-full bg-primary text-white grid place-items-center">
            {{ user.name.charAt(0) }}
          </div> -->
          
          <i v-html="icons.down" class="transition-transform duration-200" 
             :class="{ 'rotate-180': showUserMenu }" />
        </button>

        <!-- Dropdown Menu -->
        <div v-if="showUserMenu" 
             class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <!-- Mobile-only icons -->
          <div class="sm:hidden border-b border-gray-100">
            <button class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
              <i v-html="icons.notification" />
              <span>Notifications</span>
            </button>
            <button class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
              <i v-html="icons.message" />
              <span>Messages</span>
            </button>
          </div>
          
          <!-- Common menu items -->
          <button class="w-full px-4 py-2 text-left hover:bg-gray-50">Profile</button>
          <button class="w-full px-4 py-2 text-left hover:bg-gray-50">Settings</button>
          <button  @click="logout()" class="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600">Logout</button>
        </div>
      </div>
    </div>

    <!-- Overlay for closing dropdown -->
    <div v-if="showUserMenu" 
         @click="showUserMenu = false"
         class="fixed inset-0 z-40 bg-black bg-opacity-20">
    </div>
  </div>
</template>

<style scoped>
.truncate {
  max-width: 200px;
  @apply overflow-hidden text-ellipsis whitespace-nowrap;
}

@media (max-width: 640px) {
  .truncate {
    max-width: 150px;
  }
}
</style>


