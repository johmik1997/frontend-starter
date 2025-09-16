<template>
  <div class="h-full flex items-center justify-center px-4 sm:pr-20">
    <div class="bg-white px-6 sm:px-10 py-8 w-full max-w-sm rounded-xl shadow-2xl flex flex-col gap-6 relative z-10">
      <!-- Logo -->
      <div class="flex justify-center">
        <img src="@/assets/logo.svg" alt="Logo" class="h-[60px] sm:h-[80px]" />
      </div>

      <!-- Form -->
      <NewFormLayout v-slot="{ submit }" id="login-form">
        <div class="flex flex-col gap-5">
          <Input
            label="Email/Phone Number"
            name="email"
            validation="required"
            :attributes="{ placeholder: 'Email' }"
          />
          <InputPassword
            label="Password"
            name="password"
            validation="required"
            :attributes="{ placeholder: 'Password' }"
          />

          <div class="flex flex-col sm:flex-row justify-between text-sm text-gray-500 gap-2 sm:gap-0">
            <label class="flex gap-2 items-center cursor-pointer">
              <i v-html="icons.checkBox" />
              Keep me logged in
            </label>
            <span class="text-primary font-medium cursor-pointer">Forgot Password?</span>
          </div>

          <FormSubmitButton
            class="w-full"
            @click.prevent="submit(handleLogin)"
            btn-text="Login"
            :loading="loginReq.pending.value"
          />
        </div>
      </NewFormLayout>

      <!-- Signup Link -->
      <div class="text-center text-sm text-gray-600">
        Don't have an account?
        <span @click="goToSignup" class="text-primary font-medium cursor-pointer hover:underline">
          Sign up
        </span>
      </div>
    </div>

    <!-- Verification Modal -->
    <div v-if="showVerificationModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-md shadow-lg p-6">
        <!-- Close Button -->
        <button
          @click="closeVerificationModal"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Title -->
        <h3 class="text-lg font-bold text-gray-800 mb-4 py-2 border-b">
          Account Verification Required
        </h3>

        <!-- Message -->
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          Your account is not active. Please enter the verification code sent to your phone number.
        </p>

        <!-- Phone Number Input -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            v-model="phoneNumber"
            placeholder="Enter your phone number"
            class="w-full  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Verification Code Input -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            type="text"
            v-model="verificationCode"
            placeholder="Enter verification code"
            class="w-full  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="submitVerification"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 mt-2 pb-2">
          <button
            @click="closeVerificationModal"
            class="bg-[#FC5A5A] text-white px-6 py-2 text-sm font-medium hover:bg-red-600 rounded-md"
          >
            Cancel
          </button>
          <button
            @click="submitVerification"
            :disabled="!verificationCode.trim() || !phoneNumber.trim() || verifyReq.pending.value"
            :class="{'bg-blue-400 cursor-not-allowed': !verificationCode.trim() || !phoneNumber.trim(), 'bg-[#2E3365] hover:bg-[#1E224D]': verificationCode.trim() && phoneNumber.trim()}"
            class="text-white px-6 py-2 text-sm font-medium rounded-md transition-colors"
          >
            <span v-if="verifyReq.pending.value">Verifying...</span>
            <span v-else>Verify</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormSubmitButton from "@/components/FormSubmitButton.vue";
import Input from "@/components/new_form_elements/Input.vue";
import InputPassword from "@/components/new_form_elements/InputPassword.vue";
import NewFormLayout from "@/components/NewFormLayout.vue";
import icons from "@/utils/icons";
import { useApiRequest } from "@/composables/useApiRequest";
import { useAuth } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { toasted } from "@/utils/utils";
import { login } from "../api/LoginApi";
import { verifyUser } from "@/features/users/Api/UserApi";
import { ref } from "vue";

const router = useRouter();
const route = useRoute();
const auth = useAuth();
let detiail = localStorage.getItem("userDetail");

// Verification modal state
const showVerificationModal = ref(false);
const phoneNumber = ref("");
const verificationCode = ref("");
const pendingLoginData = ref(null);

function reRoute() {
  if (route.query.redirect && route.query?.from == "other")
    location.href = route.query.redirect;
  else if (route.query.redirect) router.replace(route.query.redirect);
  else router.replace("/dashboard");
}

if (detiail) {
  detiail = JSON.parse(detiail);
  auth.setAuth({
    user: detiail,
    accessToken: detiail.token,
  });
  reRoute();
}

const loginReq = useApiRequest();
const verifyReq = useApiRequest();

function handleLogin({ values }) {
  if (loginReq.pending.value) return;

  loginReq.send(
    () => login(values),
    (res) => {
      console.log("Login API response:", res);

      if (res.success) {
        auth.setAuth({
          user: res.data,
          accessToken: res.data?.token,
        });
        localStorage.setItem("userDetail", JSON.stringify(res.data));
        reRoute();
      } else {
        // ✅ NEW: Check for account not active message
        const errorMsg = res?.error?.toLowerCase?.() || "";
        if (res.status === 404 && errorMsg.includes("not  active")) {
          pendingLoginData.value = values;
          showVerificationModal.value = true;
          toasted(false, "", "Account verification required");
          return;
        }

        // 🧯 Generic error fallback
        toasted(false, "Login failed", res.error || res.message || "Something went wrong");
      }
    }
  );
}



function submitVerification() {
  if (!verificationCode.value.trim() || !phoneNumber.value.trim()) {
    toasted(false, "", "Please enter both phone number and verification code");
    return;
  }

  verifyReq.send(
    () => verifyUser(phoneNumber.value, verificationCode.value),
    (res) => {
      if (res.success) {
        toasted(true, "Account verified successfully");
        closeVerificationModal();
        // Retry login after successful verification
        if (pendingLoginData.value) {
          handleLogin({ values: pendingLoginData.value });
        }
      } else {
        toasted(false, "", res.error || "Verification failed");
      }
    }
  );
}

function closeVerificationModal() {
  showVerificationModal.value = false;
  phoneNumber.value = "";
  verificationCode.value = "";
  pendingLoginData.value = null;
}

function goToSignup() {
  router.push("/signUp");
}
</script>



