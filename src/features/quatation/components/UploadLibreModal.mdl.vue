<script setup>
import { ref, computed, onMounted } from 'vue';
import { closeModal } from "@customizer/modal-x";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiClose } from "@mdi/js";
import { saveCarLibre } from '../api/customersApi'; // Use local API
import { toasted } from '@/utils/utils';
import Button from "@/components/Button.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const draftData = computed(() => props.data?.props?.draftData || {});

// Add emit definition
const emit = defineEmits(['updateSuccess']);

// Initialize refs
const frontLibre = ref(null);
const backLibre = ref(null);
const frontLibrePreview = ref(null);
const backLibrePreview = ref(null);
const isSubmitting = ref(false);

// Computed properties for Button state
const hasValidImages = computed(() => {
  return frontLibre.value && backLibre.value;
});

onMounted(() => {
  console.log('Modal opened with data:', draftData.value);
});

const handleFrontLibreUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    frontLibre.value = file;
    frontLibrePreview.value = URL.createObjectURL(file);
  }
};

const handleBackLibreUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    backLibre.value = file;
    backLibrePreview.value = URL.createObjectURL(file);
  }
};

const submitLibreImages = async () => {
  if (!frontLibre.value || !backLibre.value) {
    toasted(false, '', 'Please upload both front and back libre images');
    return;
  }

  isSubmitting.value = true;
  const carUuid = draftData.value.carUuid;
  console.log('Car UUID in submit:', carUuid);

  if (!carUuid) {
    toasted(false, '', 'Car UUID is missing');
    isSubmitting.value = false;
    return;
  }
  
  const formData = new FormData();
  formData.append('Front_libre', frontLibre.value);
  formData.append('back_libre', backLibre.value);
  
  try {
    const response = await saveCarLibre(carUuid, formData);
    
    if (response.success || response.status === 200) {
      toasted(true, 'Libre images uploaded successfully');
      emit('updateSuccess'); // Emit event on success
      closeModal();
    } else {
      throw new Error(response.error || 'Failed to upload libre images');
    }
  } catch (error) {
    console.error('Error uploading libre images:', error);
    toasted(false, '', error.message || 'Failed to upload libre images');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <ModalParent>
    <div class="bg-white rounded-lg shadow-xl w-[500px]">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">
          Upload Libre Images
        </h2>
        <Button
          @click="closeModal()"
          class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
        >
          <BaseIcon :path="mdiClose" class="w-5 h-5" />
        </Button>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Car Info -->
        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-700">
            Vehicle: {{ draftData.carName }} {{ draftData.carModel }}
          </p>
        </div>

        <!-- Front Libre Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Front Libre</label>
          <div class="flex items-center justify-center w-full">
            <label class="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <div v-if="frontLibrePreview" class="mb-2">
                <img :src="frontLibrePreview" class="h-32 object-contain" />
              </div>
              <span class="text-sm text-gray-500">
                {{ frontLibrePreview ? 'Change Front Page' : 'Upload Front Page' }}
              </span>
              <input type="file" class="hidden" @change="handleFrontLibreUpload" accept="image/*" />
            </label>
          </div>
        </div>

        <!-- Back Libre Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Back Libre</label>
          <div class="flex items-center justify-center w-full">
            <label class="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <div v-if="backLibrePreview" class="mb-2">
                <img :src="backLibrePreview" class="h-32 object-contain" />
              </div>
              <span class="text-sm text-gray-500">
                {{ backLibrePreview ? 'Change Back Page' : 'Upload Back Page' }}
              </span>
              <input type="file" class="hidden" @change="handleBackLibreUpload" accept="image/*" />
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-4 border-t">
        <Button 
          @click="closeModal()" 
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
          Skip for Now
        </Button>
        <Button 
          @click="submitLibreImages" 
          class="bg-primary text-white px-4 py-2 rounded-md text-sm"
          :pending="isSubmitting"
          :disabled="!hasValidImages">
          Upload Images
        </Button>
      </div>
    </div>
  </ModalParent>
</template>




















