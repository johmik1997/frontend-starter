<script setup>
import Form from '@/components/new_form_builder/Form.vue';
import Input from '@/components/new_form_elements/Input.vue';
import Select from '@/components/new_form_elements/Select.vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}
</script>

<template>
  <Form id="materialform" :inner="false" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
    <Input name="title" label="Title" validation="required" :value="initialData?.title || ''" />
    <Input name="author" label="Author" validation="required" :value="initialData?.author || ''" />
    <Input name="isbn" label="ISBN" :value="initialData?.isbn || ''" />

    <Select
      name="category"
      label="Category"
      validation="required"
      :value="initialData?.category || ''"
      :options="['Book', 'Journal', 'Magazine', 'Thesis']"
      :attributes="{ placeholder: 'Select Category' }"
    />

    <Select
      name="genre"
      label="Genre"
      validation="required"
      :value="initialData?.genre || ''"
      :options="['Science', 'Fiction', 'History', 'Biography', 'Technology', 'Educational', 'Other']"
      :attributes="{ placeholder: 'Select Genre' }"
    />

    <Input name="language" label="Language" :value="initialData?.language || ''" />
    <Input name="published_date" type="date" label="Published Date" :value="toDateInputValue(initialData?.published_date)" />
    <Input name="department" label="Department" :value="initialData?.department || ''" />
    <Input name="location" label="Library Location" :value="initialData?.location || ''" />

    <Input name="copy_number" type="number" label="Total Copies" validation="required|numeric" :value="initialData?.copy_number ?? ''" />
    <Input name="available_copies" type="number" label="Available Copies" validation="required|numeric" :value="initialData?.available_copies ?? ''" />
    <Input name="price" type="number" label="Price" :value="initialData?.price ?? ''" :attributes="{ step: '0.01' }" />

    <Select
      name="condition"
      label="Condition"
      validation="required"
      :value="initialData?.condition || ''"
      :options="['New', 'Good', 'Fair', 'Damaged']"
      :attributes="{ placeholder: 'Select Condition' }"
    />

    <Select
      name="can_borrow"
      label="Can be Borrowed?"
      validation="required"
      :value="initialData?.can_borrow === true ? 'Yes' : initialData?.can_borrow === false ? 'No' : ''"
      :options="['Yes', 'No']"
      :attributes="{ placeholder: 'Select Status' }"
    />
  </Form>
</template>
