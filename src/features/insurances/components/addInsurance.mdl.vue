<script setup>
import { ref } from 'vue';
import { toasted } from "@/utils/utils";
import { closeModal } from "@customizer/modal-x";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import NewFormParent from "@/components/NewFormParent.vue";
import Form from "@/components/new_form_builder/Form.vue";
import { Input } from "@/components/new_form_elements";
import { useInsurance } from '../store/insuranceStore';
import { registerInsurance } from '../api/insuranceApi';
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiClose } from "@mdi/js";
import Button from "@/components/Button.vue";

const insurance = useInsurance();

const insuranceData = ref({
  insuranceName: '',
  accountNumber: '',
  image: null
});

const imagePreview = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    insuranceData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  if (!insuranceData.value.insuranceName || !insuranceData.value.accountNumber || !insuranceData.value.image) {
    toasted(false, "", "Please fill in all required fields including the logo");
    return;
  }

  try {
    const response = await registerInsurance(insuranceData.value);
    if (response.success) {
      insurance.add(response.data);
      toasted(true, "Insurance added successfully!");
      closeModal();
    } else {
      toasted(false, "", response.error || "Failed to add insurance");
    }
  } catch (error) {
    toasted(false, "", "Error adding insurance");
    console.error('Error:', error);
  }
};
</script>

<template>
  <ModalParent>
    <div class="bg-white rounded-lg shadow-xl w-[800px]">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Add New Insurance</h2>
        <Button
          @click="closeModal()"
          class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
        >
          <BaseIcon :path="mdiClose" class="w-5 h-5" />
        </Button>
      </div>

      <!-- Content -->
      <div class="p-6">
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
              <input type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
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
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
        <Button 
          @click="closeModal()" 
          class="bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300"
        >
          Cancel
        </Button>
        <Button 
          @click="submitForm" 
          class="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-dark"
          :disabled="!insuranceData.insuranceName || !insuranceData.accountNumber || !insuranceData.image"
        >
          Add Insurance
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
