<script setup lang="ts">
import Form from "@/components/new_form_builder/Form.vue";
import Input from "@/components/new_form_elements/Input.vue";
import Select from "@/components/new_form_elements/Select.vue";
import { useAuth } from "@/stores/auth";
import { readonly } from "vue";
const authStore = useAuth();
</script>

<template>
  <div>
    <Form class="space-y-6" id="ProfileForm" :inner="false">
      <div
        class="border border-base-clr/20 grid grid-cols-2 gap-6 rounded-md p-5"
      >
        <Input
          label="First Name"
          validation="required"
          :value="authStore.auth?.user?.first_name"
          name="firstName"
          :attributes="{
            placeholder: 'Enter your First Name',
          }"
        />
        <Input
          label="Father’s Name"
          :value="authStore.auth?.user?.last_name"
          validation="required"
          name="fatherName"
          :attributes="{
            placeholder: 'Enter your Father’s Name',
          }"
        />
        <Input
          label="Grandfather’s Name"
          :value="authStore.auth?.user?.grandFatherName"
          validation="required"
          name="grandFatherName"
          :attributes="{
            placeholder: 'Enter your Grandfather’s Name',
          }"
        />
     
          <Select
          name="userStatus"
          label="User Status"
          validation="required"
          :options="['ACTIVE', 'INACTIVE']"
          readonly
          :attributes="{
           readonly: true,
            placeholder: 'User Status',
          }"
          :value="authStore.auth?.user?.status"
        />
      </div>
      <div
        class="border border-base-clr/20 grid grid-cols-2 gap-6 rounded-md p-5"
      >
        <Input
          label="Phone Number"
          :value="authStore.auth?.user?.phone"
          validation="required"
          name="mobilePhone"
          :attributes="{
            placeholder: 'Enter your phone number',
          }"
        />
        <Input
          label="Email"
          :value="authStore.auth?.user?.email"
          
          name="email"
          :attributes="{
            placeholder: 'Enter your email',
          }"
        />
          <Input
          label="Role"
          :value="authStore.auth?.user?.role"
          validation="required"
          name="roleUuid"
          :attributes="{
            placeholder: 'Enter your roleUuid',
          }"
        />
          <Input
          label="User Type"
          :value="authStore.auth?.user?.user_type"
          validation="required"
          name="userType"
          :attributes="{
            placeholder: 'Enter your userType',
          }"
        />
           
      </div>
    </Form>
  </div>
</template>
