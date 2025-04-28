<script setup>
import { ref } from 'vue';
import Button from "@/components/Button.vue";
import { Input } from "@/components/new_form_elements";
import Select from "@/components/new_form_elements/Select.vue";
import { toasted } from "@/utils/utils";

const step = ref(1); // Track the current step

// Step 1: Personal Details
const personalDetails = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

// Step 2: Vehicle Details
const vehicles = ref([]);
const newVehicle = ref({
  price: null,
  make: '',
  model: '',
  plateCode: '',
  purpose: ''
});
const editingIndex = ref(null);

const nextStep = () => {
  if (isValidPersonalDetails()) step.value++;
};

const prevStep = () => {
  step.value--;
};

const isValidPersonalDetails = () => {
  return personalDetails.value.firstName &&
         personalDetails.value.lastName &&
         personalDetails.value.email &&
         personalDetails.value.phone;
};

const isValidVehicle = () => {
  return newVehicle.value.price !== null &&
         newVehicle.value.make !== '' &&
         newVehicle.value.model !== '' &&
         newVehicle.value.plateCode !== '' &&
         newVehicle.value.purpose !== '';
};

const addVehicle = () => {
  if (!isValidVehicle()) {
    toasted(false, '', 'Please fill in all required fields!');
    return;
  }
  vehicles.value.push({ ...newVehicle.value });
  clearNewVehicle();
  toasted(true, 'Vehicle added successfully!');
};

const clearNewVehicle = () => {
  newVehicle.value = {
    price: null,
    make: '',
    model: '',
    plateCode: '',
    purpose: ''
  };
};

const editVehicle = (index) => {
  newVehicle.value = { ...vehicles.value[index] };
  editingIndex.value = index;
};

const updateVehicle = () => {
  if (editingIndex.value !== null) {
    vehicles.value[editingIndex.value] = { ...newVehicle.value };
    editingIndex.value = null;
    clearNewVehicle();
  }
};

const deleteVehicle = (index) => {
  vehicles.value.splice(index, 1);
};
</script>

<template>
  <div class="bg-white p-6 flex justify-center">
    <div v-if="step === 1" class="w-full max-w-md bg-gray-100 p-6 rounded-md shadow">
      <h3 class="text-lg font-semibold mb-4 text-center">Step 1: Personal Details</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Row: First Name & Email -->
        <Input label="First Name" name="firstName" v-model="personalDetails.firstName"
          :attributes="{ placeholder: 'Enter first name' }" />
        <Input label="Email" name="email" type="email" v-model="personalDetails.email"
          :attributes="{ placeholder: 'Enter email' }" />

        <!-- Second Row: Last Name & Phone Number -->
        <Input label="Last Name" name="lastName" v-model="personalDetails.lastName"
          :attributes="{ placeholder: 'Enter last name' }" />
        <Input label="Phone Number" name="phone" type="tel" v-model="personalDetails.phone"
          :attributes="{ placeholder: 'Enter phone number' }" />
      </div>

      <div class="flex justify-end mt-4">
        <Button @click="nextStep" v-if="isValidPersonalDetails()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Next
        </Button>
      </div>
    </div>

    <!-- Step 2: Vehicle Details -->
    <div v-if="step === 2" class="w-full max-w-lg bg-white p-6 rounded-md shadow">
      <h3 class="text-lg font-semibold mb-4">Step 2: Vehicle Details</h3>

      <Input label="Who's is the car currently being sold for?" name="price" v-model="newVehicle.price"
        :attributes="{ placeholder: 'Enter price' }" />

      <Select label="What is the make of your car?" v-model="newVehicle.make" name="make"
        :options="['Toyota', 'Suzuki']" :attributes="{ placeholder: 'Select makes', type: 'text' }" />
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <Select label="Model" v-model="newVehicle.model" name="model"
          :options="['Yaris', 'Dezire']" :attributes="{ placeholder: 'Select model', type: 'text' }" />
        <Select label="Plate Code" v-model="newVehicle.plateCode" name="plateCode"
          :options="['Code 1', 'Code 2']" :attributes="{ placeholder: 'Select code', type: 'text' }" />
      </div>

      <Select label="What do you use it for?" v-model="newVehicle.purpose" name="purpose"
        :options="['Personal', 'Business']" :attributes="{ placeholder: 'Select purpose', type: 'text' }" />

      <div class="flex justify-between mt-4">
        <Button @click="prevStep" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Back
        </Button>
        <Button @click="addVehicle" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
          Add Vehicle
        </Button>
      </div>
    </div>

    <!-- List of Vehicles (Only in Step 2) -->
    <div v-if="step === 2" class="w-full max-w-lg bg-[#F0F0FF] text-[#1E1E1E] rounded-md p-4 mx-4">
      <h3 class="text-md font-semibold mb-2">List of cars you have added</h3>
      <div v-if="vehicles.length === 0" class="text-gray-500">No vehicles added yet.</div>
      <ul v-else>
        <li v-for="(vehicle, index) in vehicles" :key="index" class="flex bg-[#FFFFFF] text-[#1E1E1E] items-center justify-between py-2 px-4 border rounded-md mb-2">
          <div>{{ vehicle.make }} {{ vehicle.model }} | {{ vehicle.plateCode }}</div>
          <div class="flex items-center gap-2 justify-end">
            <button @click="editVehicle(index)" class="text-blue-500 hover:text-blue-700 focus:outline-none">Edit</button>
            <button @click="deleteVehicle(index)" class="text-red-500 hover:text-red-700 focus:outline-none">Delete</button>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>
