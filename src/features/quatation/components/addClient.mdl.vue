<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import Button from '@/components/Button.vue';
import Select from '@/components/new_form_elements/Select.vue';
import { useForm } from "@/components/new_form_builder/useForm";
import { allRequest, toasted } from "@/utils/utils";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import NewFormParent from "@/components/NewFormParent.vue";
import Form from "@/components/new_form_builder/Form.vue";
import { Input } from "@/components/new_form_elements";
import { CreateUser } from "@/features/users/Api/UserApi";
import { useApiRequest } from "@/composables/useApiRequest";
import { closeModal } from "@customizer/modal-x";
import InputEmail from "@/components/new_form_elements/inputEmail.vue";
import icons from "@/utils/icons";
import { getAllInsurances, getCategoriesByInsurance } from "@/features/roles/Api/RoleApi";
import { CreateClient, getAllcar } from "../api/customersApi";
import { v4 as uuidv4 } from 'uuid';
import { getValidators } from '@/components/new_form_builder/util/validators.js';
import { useQuotation } from '../store/Quotation';

const quotationStore = useQuotation();

// Define props with validation and default value
const props = defineProps(['data']);
const editingIndex = ref(null);
// Initialize refs
const personalDetails = ref({
  userUuid: '',
  firstName: '',
  fatherName: '',
  email: '',
  mobilePhone: '',
  insuranceUuid: ''
});
const carRequests = ref([]);
const bankAccount = ref('');
const step = ref(1);

// Dynamic step title
const stepTitle = computed(() => {
  switch (step.value) {
    case 1: return 'Personal Information';
    case 2: return 'Insurance Selection';
    case 3: return 'Vehicle Details';
    case 4: return 'Bank Account Information';
    default: return 'Add Client';
  }
});

// Watch for changes in the nested data structure
watch(
  () => props.data?.props?.data?.props?.data,
  (newData) => {
    if (newData) {
      personalDetails.value = { ...newData.personalDetails };
      carRequests.value = [...(newData.carRequests || [])];
      bankAccount.value = newData.bankAccount || '';
      step.value = newData.step || 1;
    }
    console.log("Updated values:", {
      personalDetails: personalDetails.value,
      carRequests: carRequests.value,
      bankAccount: bankAccount.value,
      step: step.value
    });
  },
  { immediate: true, deep: true }
);

// Debug log
console.log("Initial props:", props.data?.props?.data?.props?.data);

const insurereq = useApiRequest();
insurereq.send(() => allRequest({
    insurances: getAllInsurances({ page: 1, limit: 500 }),
}));

const catreq = useApiRequest();

watch(() => personalDetails.value.insuranceUuid, (newInsuranceUuid) => {
  if (newInsuranceUuid) {
    catreq.send(() => allRequest({
      insurances: getCategoriesByInsurance(newInsuranceUuid),
    }));
  }
});

// Vehicle data
const newVehicle = ref({
  rateRequest: {
    category1: '',
    category2: '',
    category3: '',
    category4: '',
  },
  carName: '',
  carType: '',
  carModel: '',
  engine_No: '',
  plateNumber: '',
  makeYear: '',
  buyingPrice: 0
});

// Category selection refs
const selectedMainCategory = ref('');
const selectedSubCategory = ref('');
const selectedSubSubCategory = ref('');
const selectedFinalCategory = ref('');

// Category structure
const categoryStructure = {
  'Motor Private': {
    'PRIVATE_VEHICLES': 'PRIVATE_VEHICLES',
    'MOTORCYCLES': 'MOTORCYCLES'
  },
  'Motor Commercial': {
    'GOODS_CARRYING': {
      'OWN_GOODS': {
        'PICK_UP': 'PICK_UP',
        'TRUCK': 'TRUCK',
        'TIPPER': 'TIPPER',
        'TANKERS': 'TANKERS',
        'WATER_TANKER': 'WATER_TANKER',
        'TRUCK_TRAILERS': 'TRUCK_TRAILERS'
      },
      'GENERAL_CARTAGE': {
        'PICK_UP': 'PICK_UP',
        'TRUCK': 'TRUCK',
        'TIPPER': 'TIPPER',
        'TANKERS': 'TANKERS',
        'WATER_TANKER': 'WATER_TANKER',
        'TRUCK_TRAILERS': 'TRUCK_TRAILERS'
      }
    },
    'PASSENGER_CARRYING': {
      'OWN_SERVICE': 'OWN_SERVICE',
      'PUBLIC_SERVICE': {
        'SEATS_UP_TO_16': 'SEATS_UP_TO_16',
        'SEATS_BETWEEN_17_30': 'SEATS_BETWEEN_17_30',
        'SEATS_ABOVE_30': 'SEATS_ABOVE_30'
      }
    },
    'THREE_WHEELERS_AND_TRI_CYCLES': 'THREE_WHEELERS_AND_TRI_CYCLES',
    'CAR_HIRE': 'CAR_HIRE',
    'TAXI': 'TAXI',
    'AGRICULTURAL_VEHICLES': 'AGRICULTURAL_VEHICLES'
  }
};

// Category selection helpers
const getMainCategories = () => Object.keys(categoryStructure);
const getSubCategories = () => {
  if (!selectedMainCategory.value) return [];
  const category = categoryStructure[selectedMainCategory.value];
  return typeof category === 'object' ? Object.keys(category) : [];
};
const getSubSubCategories = () => {
  if (!selectedSubCategory.value) return [];
  const category = categoryStructure[selectedMainCategory.value]?.[selectedSubCategory.value];
  return typeof category === 'object' ? Object.keys(category) : [];
};
const getFinalCategories = () => {
  if (!selectedSubSubCategory.value) return [];
  const category = categoryStructure[selectedMainCategory.value]?.[selectedSubCategory.value]?.[selectedSubSubCategory.value];
  return typeof category === 'object' ? Object.keys(category) : [];
};

const handleCategorySelection = () => {
  const mainCat = selectedMainCategory.value;
  const subCat = selectedSubCategory.value;
  const subSubCat = selectedSubSubCategory.value;
  const finalCat = selectedFinalCategory.value;

  const directCommercialTypes = [
    'THREE_WHEELERS_AND_TRI_CYCLES',
    'CAR_HIRE',
    'TAXI',
    'AGRICULTURAL_VEHICLES'
  ];

  // Reset dependent selections when main category changes
  if (mainCat === 'Motor Private') {
    selectedSubSubCategory.value = '';
    selectedFinalCategory.value = '';
  }

  // Update rateRequest based on selections
  newVehicle.value.rateRequest = {
    category1: mainCat === 'Motor Private' ? 'PRIVATE' : 'COMMERCIAL',
    category2: mainCat === 'Motor Private' ? subCat : // Add this line to include private vehicle subcategories
             (mainCat === 'Motor Commercial' ? (directCommercialTypes.includes(subCat) ? subCat : subCat) : ''),
    category3: mainCat === 'Motor Commercial' ? subSubCat : '',
    category4: mainCat === 'Motor Commercial' ? finalCat : ''
  };

  console.log('Updated rateRequest:', newVehicle.value.rateRequest);
};

// Validation functions
const isValidPersonalDetails = () => {
  const missingFields = [];
  
  if (!personalDetails.value.firstName?.trim()) missingFields.push('First Name');
  if (!personalDetails.value.fatherName?.trim()) missingFields.push('Last Name');
  if (!personalDetails.value.email?.trim()) missingFields.push('Email');
  if (!personalDetails.value.mobilePhone?.trim()) missingFields.push('Mobile Phone');

  if (missingFields.length > 0) {
    toasted(false, "", `Please fill in all required fields: ${missingFields.join(', ')}`);
    return false;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(personalDetails.value.email)) {
    toasted(false, "", "Please enter a valid email address");
    return false;
  }

  // Phone number validation (Ethiopian format)
  const phoneRegex = /^(\+251|0)[9][0-9]{8}$/;
  if (!phoneRegex.test(personalDetails.value.mobilePhone)) {
    toasted(false, "", "Please enter a valid Ethiopian phone number");
    return false;
  }

  return true;
};

const isValidVehicle = () => {
  const vehicle = newVehicle.value;
  
  console.log("Validating vehicle with values:", {
    buyingPrice: vehicle.buyingPrice,
    carName: vehicle.carName,
    carModel: vehicle.carModel,
    plateNumber: vehicle.plateNumber,
    makeYear: vehicle.makeYear,
    mainCategory: selectedMainCategory.value,
    subCategory: selectedSubCategory.value,
    subSubCategory: selectedSubSubCategory.value,
    finalCategory: selectedFinalCategory.value
  });

  const validations = {
    buyingPrice: vehicle.buyingPrice && Number(vehicle.buyingPrice) > 0,
    carName: vehicle.carName && vehicle.carName.trim() !== '',
    carModel: vehicle.carModel && vehicle.carModel.trim() !== '',
    plateNumber: vehicle.plateNumber && vehicle.plateNumber.trim() !== '',
    makeYear: vehicle.makeYear && vehicle.makeYear.trim() !== '',
    vehicleType: selectedMainCategory.value && selectedMainCategory.value.trim() !== ''
  };

  // Add validation for commercial categories
  if (selectedMainCategory.value === 'Motor Commercial') {
    validations.category = selectedSubCategory.value && selectedSubCategory.value.trim() !== '';
    
    // If subcategories are available, they should be required
    if (getSubSubCategories().length > 0) {
      validations.subSubCategory = selectedSubSubCategory.value && selectedSubSubCategory.value.trim() !== '';
    }
    
    // If final categories are available, they should be required
    if (getFinalCategories().length > 0) {
      validations.finalCategory = selectedFinalCategory.value && selectedFinalCategory.value.trim() !== '';
    }
  }

  console.log("Validation results:", validations);

  return Object.values(validations).every(v => v === true);
};

// Navigation
const nextStep = (event) => {
  event?.preventDefault();
  
  if (step.value === 1) {
    if (!isValidPersonalDetails()) {
      return;
    }
    step.value = 2;
  } else if (step.value === 2) {
    if (!personalDetails.value.insuranceUuid) {
      toasted(false, "", "Please select an insurance provider!");
      return;
    }
    step.value = 3;
  } else if (step.value === 3) {
    if (carRequests.value.length === 0) {
      toasted(false, "", "Please add at least one vehicle before continuing!");
      return;
    }
    // Skip directly to bank account step (now step 4)
    step.value = 4;
  }
};

const prevStep = () => {
  if (step.value > 1) {
    step.value--;
  }
};


// Vehicle management
const addVehicle = (event) => {
  event?.preventDefault();

  const buyingPrice = parseFloat(newVehicle.value.buyingPrice);
  newVehicle.value.buyingPrice = buyingPrice;

  // Ensure rateRequest is set correctly before validation
  handleCategorySelection();

  if (!isValidVehicle()) {
    const missingFields = [];
    
    if (!buyingPrice || buyingPrice <= 0) missingFields.push('Buying Price');
    if (!newVehicle.value.carName?.trim()) missingFields.push('Car Name');
    if (!newVehicle.value.carModel?.trim()) missingFields.push('Car Model');
    if (!newVehicle.value.plateNumber?.trim()) missingFields.push('Plate Number');
    if (!newVehicle.value.makeYear?.trim()) missingFields.push('Make Year');
    if (!selectedMainCategory.value?.trim()) missingFields.push('Vehicle Type');
    
    if (selectedMainCategory.value === 'Motor Commercial') {
      if (!selectedSubCategory.value?.trim()) {
        missingFields.push('Category');
      }
      if (getSubSubCategories().length > 0 && !selectedSubSubCategory.value?.trim()) {
        missingFields.push('Sub Category');
      }
      if (getFinalCategories().length > 0 && !selectedFinalCategory.value?.trim()) {
        missingFields.push('Final Category');
      }
    }

    console.log("Missing fields:", missingFields);
    toasted(false, "", `Please fill in all required vehicle fields! Missing: ${missingFields.join(', ')}`);
    return;
  }

  // Create a new vehicle object with all the current values
  const vehicleToAdd = {
    ...newVehicle.value,
    rateRequest: {
      ...newVehicle.value.rateRequest
    }
  };

  if (editingIndex.value !== null) {
    carRequests.value[editingIndex.value] = vehicleToAdd;
    editingIndex.value = null;
  } else {
    carRequests.value.push(vehicleToAdd);
  }

  clearNewVehicle();
  toasted(true, editingIndex.value !== null ? "Vehicle updated successfully!" : "Vehicle added successfully!");
};

const clearNewVehicle = () => {
  newVehicle.value = {
    rateRequest: {
      category1: '',
      category2: '',
      category3: '',
      category4: ''
    },
    carName: '',
    carModel: '',
    engine_No: '',
    plateNumber: '',
    makeYear: '',
    buyingPrice: ''
  };
  selectedMainCategory.value = '';
  selectedSubCategory.value = '';
  selectedSubSubCategory.value = '';
  selectedFinalCategory.value = '';
};

const editVehicle = (event, index) => {
  event?.preventDefault();
  event?.stopPropagation();
  
  const vehicle = carRequests.value[index];
  
  // Ensure rateRequest exists and has default values if empty
  if (!vehicle.rateRequest) {
    vehicle.rateRequest = {
      category1: '',
      category2: '',
      category3: '',
      category4: ''
    };
  }

  // Store complete vehicle data
  newVehicle.value = { ...vehicle };
  editingIndex.value = index;
  
  const { category1, category2, category3, category4 } = vehicle.rateRequest;

  console.log('Editing vehicle with categories:', { category1, category2, category3, category4 });

  // Default to Motor Private if no category is set or if category1 is PRIVATE
  if (!category1 || category1 === 'PRIVATE') {
    selectedMainCategory.value = 'Motor Private';
    selectedSubCategory.value = '';
    selectedSubSubCategory.value = '';
    selectedFinalCategory.value = '';
  } else if (category1 === 'COMMERCIAL') {
    selectedMainCategory.value = 'Motor Commercial';
    
    const directCommercialTypes = [
      'THREE_WHEELERS_AND_TRI_CYCLES',
      'CAR_HIRE',
      'TAXI',
      'AGRICULTURAL_VEHICLES'
    ];

    if (directCommercialTypes.includes(category2)) {
      selectedSubCategory.value = category2;
      selectedSubSubCategory.value = '';
      selectedFinalCategory.value = '';
    } else {
      selectedSubCategory.value = category2 || '';
      selectedSubSubCategory.value = category3 || '';
      selectedFinalCategory.value = category4 || '';
    }
  } else {
    // If no valid category1, default to Motor Private
    selectedMainCategory.value = 'Motor Private';
    selectedSubCategory.value = '';
    selectedSubSubCategory.value = '';
    selectedFinalCategory.value = '';
  }

  console.log('Selected categories after edit:', {
    main: selectedMainCategory.value,
    sub: selectedSubCategory.value,
    subSub: selectedSubSubCategory.value,
    final: selectedFinalCategory.value
  });

  // Ensure rateRequest is properly set
  handleCategorySelection();
};

const deleteVehicle = (event, index) => {
  event?.preventDefault();
  event?.stopPropagation();
  carRequests.value.splice(index, 1);
};

// Form submission
const submitForm = async () => {
  try {
    if (!isValidBankAccount()) {
      return;
    }

    const requestData = {
      ...personalDetails.value,
      bankAccount: bankAccount.value,
      carRequests: carRequests.value.map(vehicle => ({
        ...vehicle,
        buyingPrice: parseFloat(vehicle.buyingPrice) || 0
      }))
    };

    console.log('Submitting form with data:', requestData);
    
    const response = await CreateClient(requestData);
    console.log('API response:', response);

    if (response.success) {
      console.log('Success response data:', response.data);
      
      // Add the response data directly to the store
      quotationStore.add(response.data);
      
      // Force refresh the quotation list
      await quotationStore.fetchQuotations();
      
      toasted(true, "Client Created Successfully!");
      closeModal();
    } else {
      console.error('Error response:', response.error);
      toasted(false, "Error", response.error || "Failed to create client");
    }
  } catch (error) {
    console.error('Error creating client:', error);
    toasted(false, "Error", "An unexpected error occurred");
  }
};

// Add bank account validation
const isValidBankAccount = () => {
  if (!bankAccount.value || bankAccount.value.trim() === '') {
    toasted(false, "", "Please enter your bank account number");
    return false;
  }
  return true;
}

// Draft saving
const DRAFTS_STORAGE_KEY = 'quotation_drafts';

const saveDraft = () => {
  try {
    const existingDrafts = JSON.parse(localStorage.getItem(DRAFTS_STORAGE_KEY) || '[]');
    const draftData = {
      id: uuidv4(),
      date: new Date().toISOString(),
      data: {
        personalDetails: personalDetails.value,
        carRequests: carRequests.value,
        bankAccount: bankAccount.value, // Add this line
        step: step.value
      }
    };
    
    existingDrafts.unshift(draftData);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(existingDrafts));
    toasted(true, "Draft saved successfully!");
  } catch (error) {
    console.error('Error saving draft:', error);
    toasted(false, "Error saving draft");
  }
};

// Add these refs
const carMakes = ref([]);
const carTypes = ref([]);
const carModels = ref([]);
const engineNumbers = ref([]); // New ref for engine numbers

// Add these methods
const loadCarMakes = async () => {
  try {
    const response = await getAllcar();
    if (response.data) {
      carMakes.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching car makes:', error);
  }
};

const loadCarTypes = async (carName) => {
  try {
    const response = await getAllcar({ carName });
    if (response.data) {
      carTypes.value = response.data;
      // Reset dependent fields
      newVehicle.value.carType = '';
      newVehicle.value.carModel = '';
      newVehicle.value.engine_No = '';
      carModels.value = [];
      engineNumbers.value = [];
    }
  } catch (error) {
    console.error('Error fetching car types:', error);
  }
};

const loadCarModels = async (carType) => {
  try {
    const response = await getAllcar({ carType });
    if (response.data) {
      carModels.value = response.data;
      // Reset dependent fields
      newVehicle.value.carModel = '';
      newVehicle.value.engine_No = '';
      engineNumbers.value = [];
    }
  } catch (error) {
    console.error('Error fetching car models:', error);
  }
};

const loadEngineNumbers = async (carModel) => {
  try {
    const response = await getAllcar({ carModel });
    if (response.data) {
      engineNumbers.value = response.data;
      newVehicle.value.engine_No = '';
    }
  } catch (error) {
    console.error('Error fetching engine numbers:', error);
  }
};

// Add watchers for cascading dropdowns
watch(() => newVehicle.value.carName, (newValue) => {
  if (newValue) {
    loadCarTypes(newValue);
  }
});

watch(() => newVehicle.value.carType, (newValue) => {
  if (newValue) {
    loadCarModels(newValue);
  }
});

watch(() => newVehicle.value.carModel, (newValue) => {
  if (newValue) {
    loadEngineNumbers(newValue);
  }
});

// Load car makes on component mount
onMounted(() => {
  loadCarMakes();
});
</script>

<template>
  <ModalParent>
    <NewFormParent class="px-4 py-2 max-w-4xl" size="xs">
      <template #title>
        <div class="flex items-center gap-3">
          <button 
            @click="prevStep" 
            v-if="step > 1"
            class="flex items-center justify-center p-1 rounded-md hover:bg-gray-100"
          >
            <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd"
                d="M5.82539 1.0134C6.03505 1.20471 6.05933 1.54072 5.87962 1.76391L2.15854 6.38525L5.87962 11.0066C6.05933 11.2298 6.03505 11.5658 5.82539 11.7571C5.61572 11.9484 5.30007 11.9226 5.12036 11.6994L1.12037 6.73164C0.959876 6.53232 0.959876 6.23819 1.12037 6.03887L5.12036 1.07113C5.30008 0.847943 5.61572 0.822096 5.82539 1.0134Z"
                fill="#263558" stroke="#263558" stroke-linecap="round" />
            </svg>
          </button>
          <span class="font-bold text-lg">{{ stepTitle }}</span>
        </div>
      </template>
      
      <template #default>
        <Form class="gap-5 mt-3 p-6 " id="addform">
          
          <!-- Step 1: Personal Details -->
          <div v-if="step === 1" class="gap-4 grid grid-cols-2">
          
            <input v-model="personalDetails.userUuid" type="hidden" name="userUuid" />
  
  
            <Input
              v-model="personalDetails.firstName"
              name="firstName"
              validation="required|alpha"
              label="First Name"
              :attributes="{ 
                placeholder: 'Enter first name',
                title: 'Minimum 3 letters, alphabets only'
              }"
            />
            <Input
              v-model="personalDetails.fatherName"
              name="fatherName"
              validation="required|alpha"
              label="Last Name"
              :attributes="{ 
                placeholder: 'Enter last name',
                title: 'Minimum 3 letters, alphabets only'
              }"
            />
            <Input
              v-model="personalDetails.email"
              name="email"
              validation="required|email"
              label="email"
              :attributes="{ 
                placeholder: 'Enter email',
                title: 'Minimum 3 letters, alphabets only'
              }">
           <template #right>
                <div class="flex items-center bg-[#f6f5f545]">
                  <i v-html="icons.email" class="mr-4" />
                </div>
              </template>
            </Input> 
            <!-- <Input
              v-model="personalDetails.email"
              name="email"
              validation="required|email"
              label="Email"
              :attributes="{ 
                placeholder: 'Enter email',
                type: 'email'
              }"
              class="pr-10"
            /> -->
              <!--  -->
  
            <Input
              v-model="personalDetails.mobilePhone"
              name="mobilePhone"
              validation="required|phone"
              label="Mobile Phone"
              :attributes="{ 
                placeholder: 'Enter Phone number (+2519XXXXXXXX)',
                title: 'Valid formats: +2519XXXXXXXX or 09XXXXXXXX'
              }"
            />
          </div>

          <!-- Step 2: Insurance Selection -->
          <div v-if="step === 2" class="w-full mt-3">
            <h3 class="text-lg font-semibold mb-1">Select Your Preferred Insurance Company.</h3>
            <p class="text-sm text-gray-600 mb-4">Select the insurance company that you trust the most and feel offers the best fit for your needs and preferences.</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
              <div 
                v-for="insurance in (insurereq.response.value?.insurances || [])" 
                :key="insurance.insuranceUuid"
                @click="personalDetails.insuranceUuid = insurance.insuranceUuid"
                class="flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                :class="{
                  'border-primary bg-[#F0F0FF]': personalDetails.insuranceUuid === insurance.insuranceUuid,
                  'border-gray-200 hover:border-gray-300': personalDetails.insuranceUuid !== insurance.insuranceUuid
                }"
              >
                <!-- Insurance Logo -->
                <div class="w-16 h-16 sm:w-16 sm:h-16 mb-2 flex items-center justify-center bg-white rounded-lg p-2 border">
                  <img 
                    :src="insurance.profile ? `data:image/jpeg;base64,${insurance.profile}` : '@/assets/default-insurance-logo.png'"
                    :alt="insurance.insuranceName"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <!-- Insurance Name -->
                <span class="text-center text-sm font-medium" :class="{
                  'text-primary': personalDetails.insuranceUuid === insurance.insuranceUuid,
                  'text-gray-700': personalDetails.insuranceUuid !== insurance.insuranceUuid
                }">
                  {{ insurance.insuranceName }}
                </span>
              </div>
            </div>

            <!-- Navigation Buttons -->
            
          </div>

          <!-- Step 3: Vehicle Details -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            
  
           
            <div v-if="step === 3" class="w-full max-w-lg bg-white p-6 rounded-md">
              <h3 class="text-lg font-semibold mb-4">Step 3: Vehicle Details</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <!-- Vehicle Type Selection -->
                <Select
                  v-model="selectedMainCategory"
                  label="Vehicle Type"
                  :options="getMainCategories()"
                  @change="handleCategorySelection"
                  :attributes="{ placeholder: 'Select Vehicle Type' }"
                />
    
                <Select
                  v-if="getSubCategories().length"
                  v-model="selectedSubCategory"
                  label="Category"
                  :options="getSubCategories()"
                  @change="handleCategorySelection"
                  :attributes="{ placeholder: 'Select Category' }"
                />
    
                <Select
                  v-if="getSubSubCategories().length"
                  v-model="selectedSubSubCategory"
                  label="Sub Category"
                  :options="getSubSubCategories()"
                  @change="handleCategorySelection"
                   :attributes="{ placeholder: 'Select subCategory' }"
                />
    
                <Select
                  v-if="getFinalCategories().length"
                  v-model="selectedFinalCategory"
                  label="Final Category"
                  :options="getFinalCategories()"
                  @change="handleCategorySelection"
                    :attributes="{ placeholder: 'Final Catagory' }"
                />
    
                <!-- Other vehicle details -->
                <Input
                  v-model="newVehicle.buyingPrice"
                  label="Buying Price"
                  type="number"
                  :attributes="{ placeholder: 'Enter buying price' }"
                />
    
                <Input
                  v-model="newVehicle.plateNumber"
                  label="Plate Number"
                  :attributes="{ placeholder: 'Enter plate number' }"
                />
    
                <Input
                  v-model="newVehicle.makeYear"
                  label="Make Year"
                  :attributes="{ placeholder: 'Enter make year' }"
                />
    
                <Select
                  v-model="newVehicle.carName"
                  label="Car Make"
                  :options="carMakes"
                  :attributes="{ 
                    placeholder: 'Select car make',
                    // disabled: !carMakes.length,
                    class: 'w-full'
                  }"
                >
                  <template #label>
                    Car Make <span class="text-red-500">*</span>
                  </template>
                </Select>

                <Select
                  v-model="newVehicle.carType"
                  label="Car Type"
                  :options="carTypes"
                  :attributes="{ 
                    placeholder: 'Select car type',
                    // disabled: !newVehicle.carName || !carTypes.length,
                    class: 'w-full'
                  }"
                >
                  <template #label>
                    Car Type <span class="text-red-500">*</span>
                  </template>
                </Select>

                
                <Select
                  v-model="newVehicle.carModel"
                  label="Car Model"
                  :options="carModels"
                  :attributes="{ 
                    placeholder: 'Select car model',
                    // disabled: !newVehicle.carType || !carModels.length,
                    class: 'w-full'
                  }"
                >
                
                  <template #label>
                    Car Model <span class="text-red-500">*</span>
                  </template>
                </Select>
                <Select
                  v-model="newVehicle.engine_No"
                  label="Engine Number"
                  :options="engineNumbers"
                  :attributes="{ 
                    placeholder: 'Select engine number',
                    // disabled: !newVehicle.carModel || !engineNumbers.length,
                    class: 'w-full'
                  }"
                >
                
                  <template #label>
                    Engine Number <span class="text-red-500">*</span>
                  </template>
                </Select>
              </div>
    
              <div class="flex justify-end mt-4">
               
                <Button 
      @click="addVehicle" 
      type="primary"
      size="md"
    >
      {{ editingIndex !== null ? 'Update Vehicle' : 'Add Vehicle' }}
    </Button>
              </div>
            </div>
    
            <!-- List of Vehicles (Only in Step 2) -->
            <div v-if="step === 3" class="w-full max-w-lg bg-[#F3F3F3] text-[#1E1E1E] rounded-md p-4 mx-4">
              <h3 class="text-md font-semibold mb-2">List of cars you have added</h3>
              <div v-if="carRequests.length === 0" class="text-gray-500">No vehicles added yet.</div>
              <ul v-else>
                <li v-for="(vehicle, index) in carRequests" :key="index" class="flex bg-[#FFFFFF] text-[#1E1E1E] items-center justify-between py-2 px-4 border rounded-md mb-2">
                  <div>{{ vehicle.carName }} {{ vehicle.carModel }} | {{ vehicle.carType }}</div>
                  <div class="flex items-center gap-2 justify-end">
                    <Button 
                      @click="(e) => editVehicle(e, index)"
                      type="secondary"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button 
                      @click="(e) => deleteVehicle(e, index)"
                      type="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              </ul>
            </div>
  </div>

          <!-- Step 4: Bank Account (previously Step 5) -->
          <div v-if="step === 4" class="w-[700px]">
            <div class="bg-[#3C3C9E]  rounded-lg shadow-lg">  
              <div class="p-4">
              <div class="flex items-center mb-4 p-3 bg-white rounded-lg">  
      <img src="@/assets/ahadu.png" alt="Ahadu Bank Icon" class="h-12 w-12 mr-3" />  
     <div>
      <h2 class="text-[#1E1E1E] text-xl font-semibold">Ahadu Bank Account Number</h2>  
      <h2 class="text-[#595657] text-xs font-normal">Enter Ahadu loan bank account number.</h2>  
</div>
    </div>  
    
    <div class="text-white mb-4 gap-2">  
      <p class="text-sm">Don't have Ahadu Bank account?</p>  
      <p class="text-xs opacity-70">  
        Don't worry if you don't have one, save this step, visit a branch to open an account,  
        and continue where you left off.  
      </p>  
    </div>   
              </div>
     <div class="bg-white w-[18%] rounded-tr-lg p-1 mb-4"> 
      <Button 
          @click.prevent="saveDraft" 
          type="button"
          class="bg-orange-500 text-white px-4 py-2 rounded-lg relative"
        >  
          Save as Draft  
        </Button>  
     </div>
    
  </div>  
            <div class="w-full bg-[#F0F0FF] p-6 rounded-md">
            <div class="w-full">
              <Input
                v-model="bankAccount"
                label="Ahdu Bank Account"
                validation="required"
                :attributes="{ 
                  placeholder: 'Enter your bank account number',
                  type: 'text',
                  class: 'bg-white w-full p-2'
                }"
                class="bg-white"
              />
            </div></div>
            <div class="flex justify-between mt-4">
              
            </div>
          </div>
       
        
        
        </Form>
      </template>

      <template #bottom>
        <div class="flex justify-between m-4 w-full gap-4 pr-4">
          <!-- Save as Draft button - 25% width (only in steps 1-3) -->
          <div v-if="step !== 4" class="w-1/4">
            <Button 
              @click="saveDraft" 
              type="secondary" 
              size="lg"
              class="w-full"
            >
              Save as Draft
            </Button>
          </div>
          
          <!-- Navigation buttons - 75% width -->
          <div :class="step === 4 ? 'w-full' : 'flex-1'">
            <Button 
              v-if="step < 4" 
              @click="nextStep" 
              type="primary" 
              size="lg"
              class="w-full"
            >
              Continue
            </Button>
            <Button 
              v-if="step === 4" 
              @click="submitForm" 
              type="primary" 
              size="lg"
              class="w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </template>
    </NewFormParent>
  </ModalParent>
</template>

<style scoped>
.grid > div {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Selected insurance style */
.grid > div.border-blue-500 {
  box-shadow: 0 0 0 2px #3b82f6;
}
</style>
