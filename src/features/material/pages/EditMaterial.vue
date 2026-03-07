<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useApiRequest } from '@/composables/useApiRequest';
import { getMaterialById, updateMaterialById } from '../api/materialApi'; 
import { toasted } from '@/utils/utils.js';
import { useMaterials } from '../store/materialStore';
import NewFormParent from '../../roles/components/NewFormParent.vue';
import { ref, watch } from 'vue';
import Button from '@/components/Button.vue';
import { useForm } from '@/components/new_form_builder/useForm';
import MaterialForm from '../form/materialForm.vue';

const route = useRoute();
const router = useRouter();
const materialStore = useMaterials();
const materialUuid = route.params.materialUuid;
const materialType = ref(String(route.query?.type || 'physical').toLowerCase());

const material = ref({});

function normalizeMaterialResponse(payload) {
  return payload?.data?.response || payload?.data || payload || {};
}

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}
const { submit } = useForm('materialform');
const materialReq = useApiRequest();
const updateReq = useApiRequest();

// Fetch material by ID
materialReq.send(() => getMaterialById(materialUuid, materialType.value));

// Watch the API response and set local material
watch(
  () => materialReq.response.value,
  (val) => {
    if (val) {
      material.value = normalizeMaterialResponse(val);
      if (material.value?.material_type) {
        materialType.value = String(material.value.material_type).toLowerCase().includes('digital')
          ? 'digital'
          : 'physical';
      }
    }
  }
);

function update({ values }) {
  const payload = {
    ...values,
    published_date: toDateInputValue(values.published_date),
    copy_number: Number(values.copy_number),
    available_copies: Number(values.available_copies),
    price: Number(values.price)
  };

  updateReq.send(
    () => updateMaterialById(materialUuid, payload, materialType.value),
    (res) => {
      toasted(res.success, 'Material Successfully Updated', res.error);

      if (res.success) {
        // Update store with new data
        materialStore.update(materialUuid, { ...material.value, ...payload });
        router.push({ name: 'Material' }); // Redirect back to material list
      }
    }
  );
}

const goBack = () => router.go(-1);
</script>

<template>
  <button @click.prevent="goBack" class="hover:opacity-70 transition-opacity">
    <div class="flex gap-2 p-4 items-center">
      <span class="mt-1">
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd"
            d="M5.82539 1.0134C6.03505 1.20471 6.05933 1.54072 5.87962 1.76391L2.15854 6.38525L5.87962 11.0066C6.05933 11.2298 6.03505 11.5658 5.82539 11.7571C5.61572 11.9484 5.30007 11.9226 5.12036 11.6994L1.12037 6.73164C0.959876 6.53232 0.959876 6.23819 1.12037 6.03887L5.12036 1.07113C5.30008 0.847943 5.61572 0.822096 5.82539 1.0134Z"
            fill="#263558" stroke="#263558" stroke-linecap="round" />
        </svg>
      </span>
      <h3 class="font-medium">Go Back</h3>
    </div>
  </button>

  <NewFormParent size="xl" title="Update Material Info">
    <div v-if="materialReq.pending.value" class="p-10 text-center">
      Loading material details...
    </div>

    <MaterialForm
      v-if="materialReq.response.value"
      :initialData="material"
    />

    <template #bottom>
      <div class="p-4 border-t">
        <Button 
          size="xl" 
          type="primary" 
          class="w-full flex justify-center items-center gap-3 p-2 bg-primary"
          :pending="updateReq.pending.value" 
          @click.prevent="submit(update)"
        >
          Update Material
        </Button>
      </div>
    </template>
  </NewFormParent>
</template>
