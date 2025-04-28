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

const insurance = useInsurance();

const insuranceData = ref({
  insuranceName: '',
  accountNumber: '',
  image: null
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    insuranceData.value.image = file; // Store the file directly
  }
};

const submitForm = async () => {
  if (!insuranceData.value.insuranceName || !insuranceData.value.accountNumber) {
    toasted(false, "", "Please fill in all required fields");
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
    <NewFormParent class="px-4 py-2" size="xs" title="Add Insurance">
      <Form id="addInsuranceform" class="gap-5 mt-3 p-6" @submit.prevent="submitForm">
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

        <!-- image Image Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            image 
          </label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Insurance
        </button>
      </Form>
    </NewFormParent>
  </ModalParent>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
