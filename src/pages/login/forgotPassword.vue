<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <img class="h-16 mx-auto mb-4" src="/src/assets/logo.svg" alt="Logo" />
        <h1 class="text-2xl font-bold text-gray-800">Forgot Password?</h1>
        <p class="text-gray-600 mt-2">Enter your email to receive a reset code</p>
      </div>

      <NewFormLayout v-slot="{ submit }" id="forgot-password-form">
        <div class="space-y-5">
          <Input
            label="Email Address"
            name="email"
            validation="required|email"
            :attributes="{ placeholder: 'Enter your registered email' }"
          />

          <button
            @click.prevent="submit(requestResetCode)"
            :disabled="resetRequest.pending.value"
            class="w-full bg-[#2E3365] text-white py-3 rounded-lg hover:bg-[#1E224D] transition-colors disabled:bg-gray-400"
          >
            {{ resetRequest.pending.value ? 'Sending...' : 'Send Reset Code' }}
          </button>
        </div>
      </NewFormLayout>

      <div class="mt-6 text-center">
        <router-link to="/login" class="text-sm text-indigo-600 hover:underline">
          ← Back to Login
        </router-link>
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
  // Make sure we're sending the email in the correct format
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
        // Store email for OTP verification
        localStorage.setItem("resetEmail", values.email);
        // Redirect to OTP verification page
        router.push(`/verify-otp`);
      } else {
        const errorMsg = res.error || res.message || "Failed to send reset code";
        toasted(false, "Error", errorMsg);
      }
    }
  );
}
</script>