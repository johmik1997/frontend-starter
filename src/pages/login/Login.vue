<script setup>
import icons from "@/utils/icons";
import LoginForm from "./components/LoginForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToSignup() {
  router.push("/signUp"); 
}
</script>

<template>
  <div class="min-h-screen w-full relative overflow-auto bg-[#3C3C9E]">
    <img 
      src="@/assets/rectangle2.svg" 
      alt="Background Shape" 
      class="absolute top-0 left-0 w-auto h-auto object-cover rotate-30 fade-mask hidden md:block"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 min-h-screen relative z-10">
      <div class="hidden md:flex p-10 md:p-20 flex-col justify-center gap-6">
        <p class="font-degular text-3xl md:text-[48px] text-white font-bold leading-tight">
          Welcome to Your Digital Library
        </p>
        <p class="text-white text-base md:text-[18px] leading-relaxed max-w-[500px]">
          Borrow books, access e-books, and manage your reading all in one place. Explore a wide range of resources and keep track of your reading history effortlessly.
        </p>
        <button 
          class="mt-4 w-fit px-6 py-3 bg-white text-[#3C3C9E] font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          @click="goToSignup"
        >
          Don’t have an account? Sign Up
        </button>
      </div>

      <div class="flex items-center justify-center p-4 sm:p-10">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-mask {
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 1) 100%);
}
</style>
