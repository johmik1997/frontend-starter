<template>
  <div class="h-full flex items-center justify-center pr-20">
    <div class="bg-white px-10 py-8 w-[360px] rounded-xl shadow-2xl flex flex-col gap-6 relative z-10">
      <!-- Logo -->
      <div class="flex justify-center">
        <img src="@/assets/logo.svg" alt="Logo" class="h-[80px]" />
      </div>

      <!-- Form -->
      <NewFormLayout v-slot="{ submit }" id="login-form">
        <div class="flex flex-col gap-5">
          <Input
            label="Email"
            name="email"
            validation="required|email"
            :attributes="{ placeholder: 'Email' }"
          />
          <InputPassword
            label="Password"
            name="password"
            validation="required"
            :attributes="{ placeholder: 'Password' }"
          />

          <div class="flex justify-between text-sm text-gray-500">
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

const router = useRouter();
const route = useRoute();
const auth = useAuth();
let detiail = localStorage.getItem("userDetail");

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
function handleLogin({ values }) {
  if (loginReq.pending.value) return;

  loginReq.send(
    () => login(values),
    (res) => {
      if (res.success) {
        auth.setAuth({
          user: res.data,
          accessToken: res.data?.token,
        });
        localStorage.setItem("userDetail", JSON.stringify(res.data));
        reRoute();
      }
      toasted(res.success, "Successfully Logged in", res.error);
    }
  );
}

function goToSignup() {
  router.push("/signUp");
}
</script>
