<script setup>
import { ref, onMounted } from 'vue';
import { toasted } from "@/utils/utils";
import { closeModal } from "@customizer/modal-x";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import Form from "@/components/new_form_builder/Form.vue";
import { Input } from "@/components/new_form_elements";
import { useInsurance } from '../store/insuranceStore';
import { updateInsurance } from '../api/insuranceApi';
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiClose } from "@mdi/js";
import Button from "@/components/Button.vue";
import { useRouter } from 'vue-router';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const insurance = useInsurance();
const router = useRouter();
const imagePreview = ref(null);
const isNewImage = ref(false);

const insuranceData = ref({
  insuranceName: '',
  accountNumber: '',
  image: null
});

// Function to convert base64 to blob
const base64ToBlob = async (base64String) => {
  try {
    // Remove data:image/jpeg;base64, if present
    const base64 = base64String.includes('base64,') 
      ? base64String.split('base64,')[1] 
      : base64String;
    
    const response = await fetch(`data:image/jpeg;base64,${base64}`);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    return null;
  }
};

onMounted(async () => {
  console.log('Setting initial values:', props.data);
  insuranceData.value = {
    insuranceName: props.data.data.insuranceName || '',
    accountNumber: props.data.data.accountNumber || '',
    image: props.data.data.image || null
  };
  
  if (props.data.data.image) {
    imagePreview.value = `data:image/jpeg;base64,${props.data.data.image}`;
    // Convert existing base64 image to blob
    const blob = await base64ToBlob(props.data.data.image);
    if (blob) {
      insuranceData.value.image = new File([blob], 'insurance_logo.jpg', { type: 'image/jpeg' });
    }
  }
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    insuranceData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
    isNewImage.value = true;
  }
};

const submitForm = async () => {
  if (!insuranceData.value.insuranceName || !insuranceData.value.accountNumber) {
    toasted(false, "", "Please fill in all required fields");
    return;
  }

  try {
    const formData = new FormData();
    
    // Only append image if it exists
    if (insuranceData.value.image) {
      formData.append('image', insuranceData.value.image);
    }

    const response = await updateInsurance(
      props.data.data.insuranceUuid,
      {
        insuranceName: insuranceData.value.insuranceName,
        accountNumber: insuranceData.value.accountNumber,
        image: insuranceData.value.image
      }
    );
    
    if (response.success) {
      insurance.update(props.data.data.insuranceUuid, response.data);
      toasted(true, "Insurance updated successfully!");
      closeModal('editInsurance');
      router.push('/insurance');
    } else {
      toasted(false, "", response.error || "Failed to update insurance");
    }
  } catch (error) {
    toasted(false, "", "Error updating insurance");
    console.error('Error:', error);
  }
};
</script>

<template>
  <ModalParent>
    <div class="bg-white rounded-lg shadow-xl w-[800px]">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Edit Insurance</h2>
        <Button
          @click="closeModal('editInsurance')"
          class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
        >
          <BaseIcon :path="mdiClose" class="w-5 h-5" />
        </Button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <Form id="editInsuranceForm" @submit.prevent="submitForm">
          <div class="grid grid-cols-2 gap-6">
            <!-- Left Side - Logo Upload -->
            <div class="flex flex-col items-center justify-center">
              <label class="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                <div v-if="imagePreview" class="mb-4">
                  <img :src="imagePreview" class="w-48 h-48 object-contain rounded-lg" />
                </div>
                <div v-else class="flex flex-col items-center justify-center py-8">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">Click to upload insurance logo</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  class="hidden" 
                  @change="handleFileUpload" 
                  accept="image/*"
                />
              </label>
            </div>

            <!-- Right Side - Insurance Details -->
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-6">
                <!-- Insurance Name -->
                <Input
                  v-model="insuranceData.insuranceName"
                  name="insuranceName"
                  validation="required"
                  label="Insurance Name"
                  :attributes="{ 
                    placeholder: 'Enter insurance name',
                  }"
                />

                <!-- Account Number -->
                <Input
                  v-model="insuranceData.accountNumber"
                  name="accountNumber"
                  validation="required"
                  label="Account Number"
                  :attributes="{ 
                    placeholder: 'Enter account number',
                  }"
                />
              </div>
            </div>
          </div>
        </Form>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
        <Button 
          @click="closeModal('editInsurance')" 
          class="bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300"
        >
          Cancel
        </Button>
        <Button 
          @click="submitForm" 
          class="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-dark"
          :disabled="!insuranceData.insuranceName || !insuranceData.accountNumber"
        >
          Update Insurance
        </Button>
      </div>
    </div>
  </ModalParent>
</template>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
}

.bg-primary-dark {
  background-color: #2563EB;
}

.hover\:bg-primary-dark:hover {
  background-color: #2563EB;
}
</style>


