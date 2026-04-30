<script setup>
import Input from '@/components/new_form_elements/Input.vue';
import Form from '@/components/new_form_builder/Form.vue';

const { library } = defineProps({
  library: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <Form class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6" id="libraryform" :inner="false">
    <Input
      name="name"
      validation="required"
      label="Library Name"
      :value="library?.name || ''"
      :attributes="{ placeholder: 'Enter Library Name' }"
    />

    <Input
      name="campus"
      validation="required"
      label="Campus Name"
      :value="library?.campus || ''"
      :attributes="{ placeholder: 'Enter Campus Name' }"
    />

    <Input
      name="location"
      validation="required"
      label="Location"
      :value="library?.location || ''"
      :attributes="{ placeholder: 'Enter Physical Location' }"
    />

    <Input
      name="phone"
      validation="required|phone"
      label="Contact Phone"
      :value="library?.phone || ''"
      :attributes="{ placeholder: 'Enter Phone Number' }"
    />
  </Form>
</template>
