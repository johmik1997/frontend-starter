<!-- VerifyOtp.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/login" class="inline-block">
          <img
            class="h-16 mx-auto mb-4"
            src="/src/assets/logo.svg"
            alt="Logo"
          />
        </router-link>
        <h1 class="text-3xl font-bold text-gray-800">Verify OTP</h1>
        <p class="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
      </div>

      <!-- OTP Form -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="space-y-6">
          <!-- Email Display -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Code sent to: <span class="font-medium text-gray-800">{{ email }}</span>
            </p>
          </div>

          <!-- OTP Input Boxes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3 text-center">
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
                class="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
                       transition-all duration-200"
                :class="{ 'border-indigo-500': otp[index] }"
                :disabled="loading"
              />
            </div>
            <p class="text-sm text-gray-500 text-center mt-3">
              Enter the 4-digit verification code
            </p>
          </div>

          <!-- Countdown Timer -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              <span v-if="countdown > 0">
                Resend code in {{ formatTime(countdown) }}
              </span>
              <button
                v-else
                @click="resendCode"
                :disabled="loading"
                class="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Resend Code
              </button>
            </p>
          </div>

          <!-- Verify Button -->
          <button
            @click="verifyOtp"
            :disabled="otp.join('').length < 4 || loading"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Verifying...</span>
            <span v-else>Verify & Continue</span>
          </button>
        </div>

        <!-- Back to Login Link -->
        <div class="mt-6 text-center">
          <router-link to="/login" class="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
            ← Back to Login
          </router-link>
        </div>

        <!-- Message Display -->
        <div v-if="message" class="mt-4">
          <p :class="[
            'text-sm text-center p-3 rounded-lg',
            messageType === 'error' 
              ? 'bg-red-50 text-red-600' 
              : 'bg-green-50 text-green-600'
          ]">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApiRequest } from "@/composables/useApiRequest";
import { toasted } from "@/utils/utils";
import { verifyOtpCode, resendOtpCode } from "./api/LoginApi";

const router = useRouter();
const verifyReq = useApiRequest();

const email = ref("");
const otp = ref(["", "", "", ""]);
const loading = ref(false);
const message = ref("");
const messageType = ref("success");
const countdown = ref(60);
let countdownInterval = null;

onMounted(() => {
  // Get email from localStorage
  const storedEmail = localStorage.getItem("resetEmail");
  if (storedEmail) {
    email.value = storedEmail;
  } else {
    // If no email found, redirect back to forgot password
    router.push("/forgot-password");
  }
  
  // Start countdown
  startCountdown();
  
  // Auto-focus first input
  setTimeout(() => {
    const firstInput = document.querySelector('input[maxlength="1"]');
    firstInput?.focus();
  }, 100);
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
  // Auto-focus next input
  if (otp.value[index].length === 1 && index < 5) {
    const nextInput = document.querySelectorAll('input[maxlength="1"]')[index + 1];
    nextInput?.focus();
  }
  
  // Auto-submit when all digits are filled
  if (otp.value.join("").length === 6) {
    verifyOtp();
  }
}

function handleKeydown(event) {
  const target = event.target;
  const index = Array.from(document.querySelectorAll('input[maxlength="1"]')).indexOf(target);
  
  // Handle backspace to clear and focus previous
  if (event.key === "Backspace" && !otp.value[index] && index > 0) {
    const prevInput = document.querySelectorAll('input[maxlength="1"]')[index - 1];
    prevInput?.focus();
  }
  
  // Handle left arrow key
  if (event.key === "ArrowLeft" && index > 0) {
    const prevInput = document.querySelectorAll('input[maxlength="1"]')[index - 1];
    prevInput?.focus();
  }
  
  // Handle right arrow key
  if (event.key === "ArrowRight" && index < 3) {
    const nextInput = document.querySelectorAll('input[maxlength="1"]')[index + 1];
    nextInput?.focus();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pastedData = event.clipboardData.getData("text").slice(0, 4);
  const otpArray = pastedData.split("");
  
  for (let i = 0; i < Math.min(otpArray.length, 4); i++) {
    if (/^\d$/.test(otpArray[i])) {
      otp.value[i] = otpArray[i];
    }
  }
  
  // Focus next empty input or last input
  const nextIndex = otp.value.findIndex(val => !val);
  const focusIndex = nextIndex === -1 ? 3 : nextIndex;
  const inputs = document.querySelectorAll('input[maxlength="1"]');
  inputs[focusIndex]?.focus();
  
  // Auto-submit if all filled
  if (otp.value.join("").length === 4) {
    verifyOtp();
  }
}

async function verifyOtp() {
  const otpCode = otp.value.join("");
  if (otpCode.length < 4) {
    showMessage("Please enter the complete verification code", "error");
    return;
  }
  
  loading.value = true;
  try {
    const response = await verifyOtpCode(email.value, otpCode);
    
    if (response.success) {
      showMessage("OTP verified successfully!", "success");
      toasted(true, "Success", "OTP verified");
      
      // Store OTP for reset password page
      localStorage.setItem("resetOtp", otpCode);
      console.log(response.data.confirm_token);
      
      localStorage.setItem("confirmationToken", response.data.confirm_token);
      
      // Redirect to reset password page
      setTimeout(() => {
        router.push("/reset-password");
      }, 1000);
    } else {
      const errorMsg = response.error || response.message || "Invalid OTP code";
      showMessage(errorMsg, "error");
      toasted(false, "Error", errorMsg);
      
      // Clear OTP inputs on error
      otp.value = ["", "", "", ""];
      // Focus first input
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
      // Clear OTP inputs
      otp.value = ["", "", "", ""];
      // Focus first input
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