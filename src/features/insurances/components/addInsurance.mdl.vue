<script setup>
import { ref } from 'vue';
import { toasted } from "@/utils/utils";
import { closeModal } from "@customizer/modal-x";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import { Input } from "@/components/new_form_elements";
import { useInsurance } from '../store/insuranceStore';
import { registerInsurance } from '../api/insuranceApi';
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiClose, mdiCloudUpload, mdiCheckCircle } from "@mdi/js";
import Button from "@/components/Button.vue";

const insurance = useInsurance();

const insuranceData = ref({
  insuranceName: '',
  accountNumber: '',
  image: null
});

const imagePreview = ref(null);
const isUploading = ref(false);
const isDragging = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    insuranceData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  } else {
    toasted(false, "", "Please select a valid image file");
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFileUpload({ target: { files } });
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  isDragging.value = false;
};

const submitForm = async () => {
  if (!insuranceData.value.insuranceName || !insuranceData.value.accountNumber || !insuranceData.value.image) {
    toasted(false, "", "Please fill in all required fields including the logo");
    return;
  }

  isUploading.value = true;
  
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
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <ModalParent>
    <div class="bg-white rounded-2xl shadow-2xl w-[900px] overflow-hidden transform transition-all duration-300 scale-95 animate-in fade-in-90">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Add New Insurance</h2>
          <p class="text-sm text-gray-600 mt-1">Register a new insurance provider</p>
        </div>
        <Button
          @click="closeModal()"
          class="text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
          variant="ghost"
        >
          <BaseIcon :path="mdiClose" class="w-6 h-6" />
        </Button>
      </div>

      <!-- Content -->
      <div class="p-8">
        <div class="grid grid-cols-2 gap-8">
          <!-- Left Side - Logo Upload -->
          <div class="flex flex-col">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Company Logo</h3>
            <label 
              class="flex flex-col items-center justify-center p-8 bg-white rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 group"
              :class="{
                'border-blue-400 bg-blue-50 scale-105': isDragging,
                'border-gray-300': !isDragging
              }"
              @drop="handleDrop"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
            >
              <div v-if="imagePreview" class="mb-6 transition-transform duration-300 group-hover:scale-105">
                <div class="relative">
                  <img :src="imagePreview" class="w-64 h-64 object-contain rounded-2xl shadow-lg border-2 border-white" />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-2xl"></div>
                </div>
                <div class="flex items-center justify-center mt-4 text-green-600">
                  <BaseIcon :path="mdiCheckCircle" class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">Image uploaded</span>
                </div>
              </div>
              
              <div v-else class="flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105">
                <div class="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <BaseIcon :path="mdiCloudUpload" class="w-12 h-12 text-blue-600" />
                </div>
                <p class="text-lg font-medium text-gray-700 text-center">Drag & drop your logo here</p>
                <p class="text-sm text-gray-500 mt-2 text-center">or click to browse files</p>
                <p class="text-xs text-gray-400 mt-3 text-center">Supports PNG, JPG, SVG • Max 10MB</p>
              </div>
              
              <input type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
            </label>
          </div>

          <!-- Right Side - Insurance Details -->
          <div class="flex flex-col">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Company Details</h3>
            <div class="space-y-6">
              <!-- Insurance Name -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Insurance Name</label>
                <Input
                  v-model="insuranceData.insuranceName"
                  name="insuranceName"
                  validation="required"
                  :attributes="{ 
                    placeholder: 'e.g., Global Insurance Inc.',
                    class: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  }"
                />
              </div>

              <!-- Account Number -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Account Number</label>
                <Input
                  v-model="insuranceData.accountNumber"
                  name="accountNumber"
                  validation="required"
                  :attributes="{ 
                    placeholder: 'Enter your account number',
                    class: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  }"
                />
              </div>

              <!-- Requirements -->
              <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 class="text-sm font-semibold text-blue-800 mb-2">Requirements</h4>
                <ul class="text-xs text-blue-600 space-y-1">
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Company logo (PNG, JPG, SVG)
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Valid insurance name
                  </li>
                  <li class="flex items-center">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Account number
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-4 p-6 border-t border-gray-100 bg-gray-50">
        <Button 
          @click="closeModal()" 
          class="px-8 py-3 rounded-xl text-gray-700 hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
          variant="outline"
        >
          Cancel
        </Button>
        <Button 
          @click="submitForm" 
          class="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          :disabled="!insuranceData.insuranceName || !insuranceData.accountNumber || !insuranceData.image"
          :loading="isUploading"
        >
          <span v-if="!isUploading">Add Insurance</span>
          <span v-else>Adding...</span>
        </Button>
      </div>
    </div>
  </ModalParent>
</template>

<style scoped>
.bg-primary {
  background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%);
}

.bg-primary-dark {
  background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%);
}

.hover\:bg-primary-dark:hover {
  background: linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeIn 0.3s ease-out;
}

:deep(.input-wrapper) {
  @apply relative;
}

:deep(.input-wrapper input) {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200;
}

:deep(.input-wrapper input:focus) {
  @apply ring-2 ring-blue-500 ring-opacity-50 border-transparent;
}
</style>