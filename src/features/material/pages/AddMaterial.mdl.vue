<script setup>
import { computed } from 'vue';
import Button from '@/components/Button.vue';
import Input from '@/components/new_form_elements/Input.vue';
import Select from '@/components/new_form_elements/Select.vue';
import Form from '@/components/new_form_builder/Form.vue';
import NewFormParent from '../../roles/components/NewFormParent.vue';
import { closeModal } from '@customizer/modal-x';
import { useApiRequest } from '@/composables/useApiRequest';
import { CreateMaterial } from '../api/materialApi'; // Updated API Import
import { toasted } from '@/utils/utils';
import { useForm } from '@/components/new_form_builder/useForm';
import { useMaterials } from '../store/materialStore';

const { submit } = useForm('addMaterialForm');
const req = useApiRequest();
const materialStore = useMaterials();
const currentType = computed(() => materialStore.createType || 'physical');
const isDigital = computed(() => currentType.value === 'digital');
const modalTitle = computed(() => isDigital.value ? 'Add New Digital Material' : 'Add New Physical Material');
const actionLabel = computed(() => isDigital.value ? 'Add Digital Material' : 'Add Physical Material');

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

// Submit handler
function handleCreate({ values }) {
  let payload;
  if (isDigital.value) {
    payload = new FormData();
    payload.append('title', values.title || '');
    payload.append('author', values.author || '');
    payload.append('category', values.category || '');
    payload.append('genre', values.genre || '');
    payload.append('published_date', toDateInputValue(values.published_date));
    payload.append('department', values.department || '');
    payload.append('language', values.language || '');
    payload.append('isbn', values.isbn || '');
    if (values.file) {
      payload.append('file', values.file);
    }
  } else {
    payload = {
      ...values,
      published_date: toDateInputValue(values.published_date),
      price: Number(values.price || 0),
      can_borrow: String(values.can_borrow || '').toUpperCase() === 'YES',
      copy_number: Number(values.copy_number || 0),
      available_copies: Number(values.available_copies || 0),
    };
  }

  req.send(
    () => CreateMaterial(payload, currentType.value),
    (res) => {
      if (res.success) {
        toasted(true, 'Material Added Successfully');
        closeModal();
      } else {
        toasted(false, '', res.error);
      }
    }
  );
}
</script>

<template>
  <div class="bg-black/50 min-h-full p-4 sm:p-6 md:p-10 grid place-items-center">
    <NewFormParent :title="modalTitle" size="md">
      <Form :inner="false" id="addMaterialForm"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-6">
        
        <Input name="title" validation="required" label="Title" :attributes="{ placeholder: 'Material Title' }" />
        <Input name="author" validation="required" label="Author" :attributes="{ placeholder: 'Author Name' }" />
        <Input name="isbn" label="ISBN" :attributes="{ placeholder: 'Enter ISBN' }" />

         <Select name="category" label="Category" validation="required"
          :options="['BOOK', 'MAGAZINE', 'RESEARCH PAPER', 'JOURNALS', 'THESIS']"
          :attributes="{ placeholder: 'Select Category' }" />

        <Select name="genre" label="Genre" validation="required"
          :options="['SCIENCE', 'FICTION', 'HISTORY', 'BIOGRAPHY','TECHNOLOGY','EDUCATIONAL', 'OTHER']"
          :attributes="{ placeholder: 'Select Genre e.g. Science, Fiction' }" />
        <Input name="language" label="Language" :attributes="{ placeholder: 'e.g. English, Amharic' }" />

        <Input name="published_date" type="date" label="Published Date" validation="required" />
        <Input name="department" label="Department" :attributes="{ placeholder: 'Target Department' }" />
        <Input
          v-if="isDigital"
          name="file"
          validation="required"
          :attributes="{ type: 'file', accept: '.pdf,.doc,.docx,.epub,.txt,.ppt,.pptx' }"
          label="Digital File"
        />
        <Select name="location" label="Library Location" validation="required"
          v-if="!isDigital"
          :options="['STACK', 'SHELF','OTHER']"
          :attributes="{ placeholder: 'Select Location' }" />
        
        <Input v-if="!isDigital" name="copy_number" type="number" validation="required|numeric" label="Total Copies" />
        <Input v-if="!isDigital" name="available_copies" type="number" validation="required|numeric" label="Available Copies" />
        <Input v-if="!isDigital" name="price" type="number" label="Price" :attributes="{ step: '0.01' }" />

        <Select name="condition" label="Condition" validation="required"
          v-if="!isDigital"
          :options="['NEW', 'GOOD', 'FAIR', 'DAMAGED']"
          :attributes="{ placeholder: 'Select Condition' }" />
          
        <Select name="can_borrow" label="Can be Borrowed?" validation="required"
          v-if="!isDigital"
          :options="['YES', 'NO']"
          :attributes="{ placeholder: 'Select Status' }" />

      </Form>

      <template #bottom>
        <div class="p-4">
          <Button type="secondary" :pending="req.pending.value" @click.prevent="submit(handleCreate)" class="w-full">
            {{ actionLabel }}
          </Button>
        </div>
      </template>
    </NewFormParent>
  </div>
</template>
