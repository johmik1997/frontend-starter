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
        <h1 class="text-3xl font-bold text-gray-800">Reset Password</h1>
        <p class="text-gray-600 mt-2">Create a new password for your account</p>
      </div>

      <!-- Reset Password Form -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleResetPassword">
          <div class="space-y-5">
            <!-- Email Display -->
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <p class="text-sm text-gray-600">
                Resetting password for: <span class="font-medium text-gray-800">{{ email }}</span>
              </p>
            </div>

            <!-- New Password Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div class="relative">
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  v-model="form.new_password"
                  required
                  class="w-full mr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter new password"
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div class="relative">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="form.confirm_password"
                  required
                  class="w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mr-10"
                  placeholder="Confirm new password"
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Password Requirements -->
            <div class="text-xs text-gray-500 space-y-1">
              <p class="font-medium mb-1">Password must contain:</p>
              <ul class="list-disc list-inside space-y-0.5">
                <li :class="{ 'text-green-600': passwordValid.length }">
                  At least 8 characters
                </li>
                <li :class="{ 'text-green-600': passwordValid.hasUpperCase }">
                  At least one uppercase letter
                </li>
                <li :class="{ 'text-green-600': passwordValid.hasLowerCase }">
                  At least one lowercase letter
                </li>
                <li :class="{ 'text-green-600': passwordValid.hasNumber }">
                  At least one number
                </li>
              </ul>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="w-full bg-indigo-600 text-white py-2 px-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Resetting...</span>
              <span v-else>Reset Password</span>
            </button>
          </div>
        </form>

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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toasted } from "@/utils/utils";
import { resetPassword } from "./api/LoginApi";

const router = useRouter();

// State
const email = ref("");
const confirmationToken = ref("");
const form = ref({
  new_password: "",
  confirm_password: ""
});
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const message = ref("");
const messageType = ref("success");

// Lifecycle
onMounted(() => {
  // Get email from localStorage
  const storedEmail = localStorage.getItem("resetEmail");
  const storedOtp = localStorage.getItem("resetOtp");
  const storedConfirmationToken = localStorage.getItem("confirmationToken");
  
  if (storedEmail && storedOtp && storedConfirmationToken) {
    email.value = storedEmail;
    confirmationToken.value = storedConfirmationToken;
  } else if (storedEmail) {
    email.value = storedEmail;
  } else {
    showMessage("Session expired. Please request a new reset code.", "error");
    setTimeout(() => router.push("/forgot-password"), 2000);
  }
});

// Password validation
const passwordValid = computed(() => {
  const password = form.value.new_password;
  return {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password)
  };
});

const isFormValid = computed(() => {
  const allRequirements = passwordValid.value.length &&
    passwordValid.value.hasUpperCase &&
    passwordValid.value.hasLowerCase &&
    passwordValid.value.hasNumber;
  
  return allRequirements && 
    form.value.new_password === form.value.confirm_password &&
    form.value.new_password.length > 0;
});

// Handle reset password
async function handleResetPassword() {
  if (!isFormValid.value) {
    if (form.value.new_password !== form.value.confirm_password) {
      showMessage("Passwords do not match", "error");
    } else {
      showMessage("Please meet all password requirements", "error");
    }
    return;
  }
  
  loading.value = true;
  
  try {
    // Get OTP from localStorage
    const storedOtp = localStorage.getItem("resetOtp");
    
    // Prepare data in the format expected by backend
    const payload = {
      email: email.value,
      password: form.value.new_password,
      confirm_password: form.value.confirm_password,
      confirm_token: confirmationToken.value // Use confirmation token if available, otherwise fallback to OTP 
    };
    
    console.log("Sending reset password request:", payload);
    
    // Call the API
    const response = await resetPassword(payload);
    
    console.log("Reset password response:", response);
    
    // Check if response is successful
    if (response && response.status === 200) {
      showMessage("Password reset successfully! Redirecting to login...", "success");
      toasted(true, "Success", "Your password has been reset");
      
      // Clear stored data
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      const errorMsg = response?.data?.message || response?.message || "Failed to reset password";
      showMessage(errorMsg, "error");
      toasted(false, "Error", errorMsg);
    }
  } catch (error) {
    console.error("Reset password error:", error);
    const errorMsg = error.response?.data?.message || error.message || "An error occurred. Please try again.";
    showMessage(errorMsg, "error");
    toasted(false, "Error", errorMsg);
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
