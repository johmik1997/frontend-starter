<script setup>
import { ref, computed, onMounted } from 'vue';
import { closeModal } from "@customizer/modal-x";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiClose } from "@mdi/js";
import { saveCarLibre } from '@/features/financing/dispersement/api/dispersementApi';
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
const originalFrontLibre = ref(null);
const originalBackLibre = ref(null);
const isSubmitting = ref(false);

// Computed properties for Button state
const hasValidImages = computed(() => {
  return (frontLibre.value || originalFrontLibre.value) && 
         (backLibre.value || originalBackLibre.value);
});

const isUpdateMode = computed(() => {
  return Boolean(originalFrontLibre.value || originalBackLibre.value);
});

onMounted(() => {
  if (draftData.value?.libreFrontPage) {
    frontLibrePreview.value = draftData.value.libreFrontPage;
    originalFrontLibre.value = draftData.value.libreFrontPage;
  }
  if (draftData.value?.libreBackPage) {
    backLibrePreview.value = draftData.value.libreBackPage;
    originalBackLibre.value = draftData.value.libreBackPage;
  }
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

const base64ToBlob = async (base64String) => {
  if (!base64String) return null;
  
  // If the string already contains the data URL prefix, remove it
  const base64WithoutPrefix = base64String.includes('base64,') 
    ? base64String.split('base64,')[1] 
    : base64String;

  try {
    // Convert base64 to binary
    const response = await fetch(`data:image/jpeg;base64,${base64WithoutPrefix}`);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    return null;
  }
};

const submitLibreImages = async () => {
  isSubmitting.value = true;
  const carUuid = draftData.value.carUuid;
  console.log('Car UUID in submit:', carUuid);

  if (!carUuid) {
    toasted(false, '', 'Car UUID is missing');
    return;
  }

  // Check if at least one image is being updated
  if (!frontLibre.value && !backLibre.value && !originalFrontLibre.value && !originalBackLibre.value) {
    toasted(false, '', 'Please upload at least one image');
    return;
  }
  
  const formData = new FormData();
  
  try {
    // Handle front libre
    if (frontLibre.value) {
      // New file upload
      formData.append('Front_libre', frontLibre.value);
    } else if (originalFrontLibre.value) {
      // Convert existing base64 image to blob
      const frontBlob = await base64ToBlob(originalFrontLibre.value);
      if (frontBlob) {
        formData.append('Front_libre', frontBlob, 'front_libre.jpg');
      }
    }
    
    // Handle back libre
    if (backLibre.value) {
      // New file upload
      formData.append('back_libre', backLibre.value);
    } else if (originalBackLibre.value) {
      // Convert existing base64 image to blob
      const backBlob = await base64ToBlob(originalBackLibre.value);
      if (backBlob) {
        formData.append('back_libre', backBlob, 'back_libre.jpg');
      }
    }
    
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
          {{ isUpdateMode ? 'Update' : 'Upload' }} Libre Images
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
          Cancel
        </Button>
        <Button 
          @click="submitLibreImages" 
          class="bg-primary text-white px-4 py-2 rounded-md text-sm"
          :pending="isSubmitting"
          :disabled="!hasValidImages">
          {{ isUpdateMode ? 'Update' : 'Upload' }} Images
        </Button>
      </div>
    </div>
  </ModalParent>
</template>


















