<template>
  <div class="min-h-screen w-full relative overflow-auto bg-slate-900">
    <!-- Animated Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
    
    <!-- Decorative Blur Elements -->
    <div class="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl"></div>

    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="flex items-center space-x-2">
              <img 
                src="@/assets/logolib.jpg" 
                alt="Logo" 
                class="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-lg shadow-amber-500/30"
              >
              <span class="text-white font-bold text-xl">HU<span class="text-amber-500">-DLRBS</span></span>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-white">Forgot Password?</h1>
          <p class="text-slate-400 mt-2">Enter your email to receive a reset code</p>
        </div>

        <!-- Form Card -->
        <div class="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          <NewFormLayout v-slot="{ submit }" id="forgot-password-form">
            <div class="space-y-6">
              <!-- Email Input -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  name="email"
                  validation="required|email"
                  :attributes="{ 
                    placeholder: 'Enter your registered email',
                    class: 'w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200'
                  }"
                />
              </div>

              <!-- Submit Button -->
              <button
                @click.prevent="submit(requestResetCode)"
                :disabled="resetRequest.pending.value"
                class="w-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="resetRequest.pending.value" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
                <span v-else>Send Reset Code</span>
              </button>
            </div>
          </NewFormLayout>

          <!-- Back to Login Link -->
          <div class="mt-6 text-center">
            <router-link to="/login" class="text-sm text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useApiRequest } from "@/composables/useApiRequest";
import { toasted } from "@/utils/utils";
import { forgotPassword } from "./api/LoginApi";
import NewFormLayout from "@/components/NewFormLayout.vue";
import Input from "@/components/new_form_elements/Input.vue";

const router = useRouter();
const resetRequest = useApiRequest();

function requestResetCode({ values }) {
  const emailData = {
    email: values.email
  };
  
  console.log("Sending forgot password request with:", emailData);
  
  resetRequest.send(
    () => forgotPassword(emailData),
    (res) => {
      console.log("Forgot password response:", res);
      
      if (res.success) {
        toasted(true, "Success", "Reset code sent to your email");
        localStorage.setItem("resetEmail", values.email);
        router.push(`/verify-otp`);
      } else {
        const errorMsg = res.error || res.message || "Failed to send reset code";
        toasted(false, "Error", errorMsg);
      }
    }
  );
}
</script>