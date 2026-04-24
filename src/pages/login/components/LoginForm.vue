<template>
  <div class="bg-white px-6 sm:px-10 py-8 w-full max-w-sm rounded-xl shadow-2xl flex flex-col gap-6">
    <div class="flex justify-center">
      <img src="@/assets/logo.svg" alt="Logo" class="h-[60px] sm:h-[80px]" />
    </div>

    <NewFormLayout v-slot="{ submit }" id="login-form">
      <div class="flex flex-col gap-5">
        <Input
          label="ID Number"
          name="id_number"
          validation="required"
          :attributes="{ placeholder: 'Enter ID Number' }"
        />
        <InputPassword
          label="Password"
          name="password"
          validation="required"
          :attributes="{ placeholder: 'Password' }"
        />

        <div class="flex flex-col sm:flex-row justify-between text-sm text-gray-500 gap-2">
          <label class="flex gap-2 items-center cursor-pointer">
            <i v-html="icons.checkBox" />
            Keep me logged in
          </label>
          <span
            class="text-primary font-medium cursor-pointer hover:underline"
@click="router.push({ path: '/forgot-password', query: {} })"          >
            Forgot Password?
          </span>
        </div>

        <FormSubmitButton
          class="w-full"
          @click.prevent="submit(handleLogin)"
          btn-text="Login"
          :pending="loginReq.pending.value"
        />
      </div>
    </NewFormLayout>

    <div class="text-center text-sm text-gray-600">
      Don't have an account?
      <span @click="router.push('/signUp')" class="text-primary font-medium cursor-pointer hover:underline">
        Sign up
      </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useApiRequest } from "@/composables/useApiRequest";
import { useAuth } from "@/stores/auth";
import { toasted } from "@/utils/utils";
import { login } from "../api/LoginApi";
import icons from "@/utils/icons";

// Components
import FormSubmitButton from "@/components/FormSubmitButton.vue";
import Input from "@/components/new_form_elements/Input.vue";
import InputPassword from "@/components/new_form_elements/InputPassword.vue";
import NewFormLayout from "@/components/NewFormLayout.vue";

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const loginReq = useApiRequest();

function handleLogin({ values }) {
  loginReq.send(() => login(values), (res) => {
    if (res.success) {
      const data = res?.data || {};
      const authPayload = {
        user: data?.user || data,
        accessToken: data?.access || data?.token,
        refreshToken: data?.refresh,
      };
      
      auth.setAuth(authPayload);
      localStorage.setItem("userDetail", JSON.stringify(authPayload));
      
      const redirect = route.query.redirect || "/dashboard";
      router.replace(redirect);
      toasted(true, "Welcome back!");
    } else {
      if (res.status === 404 && res?.error?.toLowerCase().includes("not active")) {
        router.push("/verify-account"); // Redirect to your account verification page
        return;
      }
      toasted(false, "Login failed", res.error || "Invalid credentials");
    }
  });
}
</script>