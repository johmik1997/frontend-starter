<script setup>
import { onMounted } from 'vue';
import Button from '@/components/Button.vue';
import Input from '@/components/new_form_elements/Input.vue';
import Select from '@/components/new_form_elements/Select.vue';
import Form from '@/components/new_form_builder/Form.vue';
import NewFormParent from '../../roles/components/NewFormParent.vue';
import { closeModal } from '@customizer/modal-x';
import { useApiRequest } from '@/composables/useApiRequest';
import { CreateLibrary, getAllAdminUsers } from '../api/libraryApi';
import { useLibrary } from '../store/libraryStore';
import { toasted } from '@/utils/utils';
import { useForm } from '@/components/new_form_builder/useForm';

const libraryStore = useLibrary();
const req = useApiRequest();
const adminReq = useApiRequest();
const { submit } = useForm('addform');

// Fetch admins when component loads to fill the dropdown
onMounted(() => {
  adminReq.send(() => getAllAdminUsers());
});

// Submit handler
function handleCreate({ values }) {
  req.send(
    () => CreateLibrary(values),
    (res) => {
      if (res.success) {
        libraryStore.add(res.data);
        toasted(true, 'Library Created Successfully');
        closeModal();
      } else {
        toasted(false, 'Failed to create library', res.error);
      }
    }
  );
}
</script>

<template>
  <div class="bg-black/50 min-h-full p-4 sm:p-6 md:p-10 grid place-items-center">
    <NewFormParent title="Add New Library" size="md">
      <Form :inner="false" id="addform"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
        <Input name="name" validation="required" label="Library Name" 
          :attributes="{ placeholder: 'Enter Library Name' }" />

        <Input name="campus" validation="required" label="Campus Name" 
          :attributes="{ placeholder: 'Enter Campus Name' }" />
        
        <Input name="location" validation="required" label="Location" 
          :attributes="{ placeholder: 'Enter Physical Location' }" />
        
        <Input name="phone" label="Contact Phone" validation="required|phone"
          :attributes="{ placeholder: 'Enter Phone Number' }" />
          
  <Select
  :obj="true"
  name="staff_id"
  label="Assign Admin"
  validation="required"
  :options="(adminReq.response.value || []).map(user => ({
    label: user.name,   // Display name only
    value: user.staff_id      // Send id to backend
  }))"
  :attributes="{ 
    placeholder: 'Select Admin User', 
    required: true 
  }"
/>
        <Select name="libraryStatus" label="Initial Status" validation="required"
          :options="['ACTIVE', 'PENDING']"
          :attributes="{ placeholder: 'Select Status' }" />

        <div class="col-span-full mt-6">
          <Button type="secondary" :pending="req.pending.value" @click.prevent="submit(handleCreate)" class="w-full">
            Create Library
          </Button>
        </div>
      </Form>
    </NewFormParent>
  </div>
</template>