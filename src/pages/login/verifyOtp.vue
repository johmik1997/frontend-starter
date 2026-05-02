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
          <h1 class="text-3xl font-bold text-white">Verify OTP</h1>
          <p class="text-slate-400 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        <!-- OTP Form Card -->
        <div class="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div class="space-y-6">
            <!-- Email Display -->
            <div class="text-center bg-slate-900/50 rounded-xl p-3 border border-white/5">
              <p class="text-sm text-slate-400">
                Code sent to: <span class="font-medium text-amber-500">{{ email }}</span>
              </p>
            </div>

            <!-- OTP Input Boxes -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-4 text-center">
                Verification Code
              </label>
              <div class="flex justify-center gap-3">
                <input
                  v-for="(_, index) in 6"
                  :key="index"
                  ref="otpInputs"
                  type="text"
                  maxlength="1"
                  v-model="otp[index]"
                  @input="handleOtpInput(index)"
                  @keydown="handleKeydown"
                  @paste="handlePaste"
                  class="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold bg-slate-900 border-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  :class="otp[index] ? 'border-amber-500' : 'border-white/10'"
                  :disabled="loading"
                />
              </div>
              <p class="text-sm text-slate-500 text-center mt-3">
                Enter the 6-digit verification code
              </p>
            </div>

            <!-- Countdown Timer -->
            <div class="text-center">
              <p class="text-sm text-slate-400">
                <span v-if="countdown > 0" class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Resend code in {{ formatTime(countdown) }}
                </span>
                <button
                  v-else
                  @click="resendCode"
                  :disabled="loading"
                  class="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                >
                  Resend Code
                </button>
              </p>
            </div>

            <!-- Verify Button -->
            <button
              @click="verifyOtp"
              :disabled="otp.join('').length < 6 || loading"
              class="w-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
              <span v-else>Verify & Continue</span>
            </button>
          </div>

          <!-- Back to Login Link -->
          <div class="mt-6 text-center">
            <router-link to="/login" class="text-sm text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Login
            </router-link>
          </div>

          <!-- Message Display -->
          <div v-if="message" class="mt-4">
            <p :class="[
              'text-sm text-center p-3 rounded-xl',
              messageType === 'error' 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            ]">
              {{ message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useApiRequest } from "@/composables/useApiRequest";
import { toasted } from "@/utils/utils";
import { verifyOtpCode, resendOtpCode } from "./api/LoginApi";

const router = useRouter();
const verifyReq = useApiRequest();

const email = ref("");
const otp = ref(["", "", "", "", "", ""]);
const loading = ref(false);
const message = ref("");
const messageType = ref("success");
const countdown = ref(60);
let countdownInterval = null;

onMounted(() => {
  const storedEmail = localStorage.getItem("resetEmail");
  if (storedEmail) {
    email.value = storedEmail;
  } else {
    router.push("/forgot-password");
  }
  
  startCountdown();
  
  setTimeout(() => {
    const firstInput = document.querySelector('input[maxlength="1"]');
    firstInput?.focus();
  }, 100);
});

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdown.value = 60;
  
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function handleOtpInput(index) {
  if (otp.value[index].length === 1 && index < 5) {
    const nextInput = document.querySelectorAll('input[maxlength="1"]')[index + 1];
    nextInput?.focus();
  }
  
  if (otp.value.join("").length === 6) {
    verifyOtp();
  }
}

function handleKeydown(event) {
  const target = event.target;
  const inputs = document.querySelectorAll('input[maxlength="1"]');
  const index = Array.from(inputs).indexOf(target);
  
  if (event.key === "Backspace" && !otp.value[index] && index > 0) {
    const prevInput = inputs[index - 1];
    prevInput?.focus();
  }
  
  if (event.key === "ArrowLeft" && index > 0) {
    const prevInput = inputs[index - 1];
    prevInput?.focus();
  }
  
  if (event.key === "ArrowRight" && index < 5) {
    const nextInput = inputs[index + 1];
    nextInput?.focus();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pastedData = event.clipboardData.getData("text").slice(0, 6);
  const otpArray = pastedData.split("");
  
  for (let i = 0; i < Math.min(otpArray.length, 6); i++) {
    if (/^\d$/.test(otpArray[i])) {
      otp.value[i] = otpArray[i];
    }
  }
  
  const nextIndex = otp.value.findIndex(val => !val);
  const focusIndex = nextIndex === -1 ? 5 : nextIndex;
  const inputs = document.querySelectorAll('input[maxlength="1"]');
  inputs[focusIndex]?.focus();
  
  if (otp.value.join("").length === 6) {
    verifyOtp();
  }
}

async function verifyOtp() {
  const otpCode = otp.value.join("");
  if (otpCode.length < 6) {
    showMessage("Please enter the complete verification code", "error");
    return;
  }
  
  loading.value = true;
  try {
    const response = await verifyOtpCode(email.value, otpCode);
    
    if (response.success) {
      showMessage("OTP verified successfully!", "success");
      toasted(true, "Success", "OTP verified");
      
      localStorage.setItem("resetOtp", otpCode);
      localStorage.setItem("confirmationToken", response.data.confirm_token);
      
      setTimeout(() => {
        router.push("/reset-password");
      }, 1000);
    } else {
      const errorMsg = response.error || response.message || "Invalid OTP code";
      showMessage(errorMsg, "error");
      toasted(false, "Error", errorMsg);
      
      otp.value = ["", "", "", "", "", ""];
      setTimeout(() => {
        const firstInput = document.querySelector('input[maxlength="1"]');
        firstInput?.focus();
      }, 100);
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    showMessage("An error occurred. Please try again.", "error");
    toasted(false, "Error", "An error occurred");
  } finally {
    loading.value = false;
  }
}

async function resendCode() {
  if (countdown.value > 0) {
    showMessage(`Please wait ${countdown.value} seconds before resending`, "error");
    return;
  }
  
  loading.value = true;
  try {
    const response = await resendOtpCode(email.value);
    
    if (response.success) {
      showMessage("New OTP code sent successfully!", "success");
      toasted(true, "Success", "New code sent");
      startCountdown();
      otp.value = ["", "", "", "", "", ""];
      setTimeout(() => {
        const firstInput = document.querySelector('input[maxlength="1"]');
        firstInput?.focus();
      }, 100);
    } else {
      const errorMsg = response.error || response.message || "Failed to resend code";
      showMessage(errorMsg, "error");
      toasted(false, "Error", errorMsg);
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    showMessage("An error occurred. Please try again.", "error");
    toasted(false, "Error", "An error occurred");
  } finally {
    loading.value = false;
  }
}

function showMessage(msg, type) {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    if (message.value === msg) {
      message.value = "";
    }
  }, 5000);
}
</script>