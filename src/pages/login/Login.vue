<script setup>
import icons from "@/utils/icons";
import LoginForm from "./components/LoginForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToSignup() {
  router.push("/signUp"); // Make sure /signup route exists
}
</script>

<template>
  <div class="h-screen w-full relative overflow-hidden bg-[#3C3C9E]">
    <!-- Background Mask -->
    <img 
      src="@/assets/rectangle2.svg" 
      alt="Background Shape" 
      class="absolute top-0 left-0 w-auto h-auto object-cover rotate-30 fade-mask"
    />

    <!-- Main Layout -->
    <div class="grid grid-cols-2 h-full relative z-10">
      <!-- Left Content -->
      <div class="p-20 flex flex-col justify-center gap-6">
        <p class="font-degular text-[48px] text-white font-bold leading-tight">
          Flexible Premium Financing for Your Vehicle Insurance
        </p>
        <p class="text-white text-[18px] leading-relaxed max-w-[500px]">
          Make your car insurance more affordable with our premium financing solutions. Spread your insurance costs into manageable monthly payments while enjoying comprehensive coverage.
        </p>
        <button 
          class="mt-4 w-fit px-6 py-3 bg-white text-[#3C3C9E] font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          @click="goToSignup"
        >
          Don’t have an account? Sign Up
        </button>
      </div>

      <!-- Right Content -->
      <LoginForm />
    </div>
  </div>
</template>

<style scoped>
.fade-mask {
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 1) 100%);
}
</style>
