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
    <NewFormParent class="px-6 py-4 max-w-5xl" size="lg">
      <template #title>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-4">
            <button 
              @click="prevStep" 
              v-if="step > 1"
              class="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div>
              <h2 class="font-bold text-xl text-gray-800">{{ stepTitle }}</h2>
              <p class="text-sm text-gray-500">Step {{ step }} of 4</p>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1">
              <div 
                v-for="i in 4" 
                :key="i"
                class="w-8 h-2 rounded-full transition-all duration-300"
                :class="i <= step ? 'bg-primary' : 'bg-gray-200'"
              ></div>
            </div>
            <span class="text-xs text-gray-500 ml-2">{{ Math.round((step / 4) * 100) }}%</span>
          </div>
        </div>
      </template>
      
      <template #default>
         <Form class="gap-5 mt-3 p-6 " id="addform">
        
          <!-- Step 1: Personal Details -->
          <div v-if="step === 1" class="space-y-6">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Personal Information</h3>
                  <p class="text-sm text-gray-600">Please provide your basic information to get started</p>
                </div>
              </div>
              
              <Form class="grid grid-cols-1 md:grid-cols-2 gap-6" id="addform">
                <input v-model="personalDetails.userUuid" type="hidden" name="userUuid" />
                
                <Input
                  v-model="personalDetails.firstName"
                  name="firstName"
                  validation="required|alpha"
                  label="First Name"
                  :attributes="{ 
                    placeholder: 'Enter your first name',
                    title: 'Minimum 3 letters, alphabets only'
                  }"
                />
                
                <Input
                  v-model="personalDetails.fatherName"
                  name="fatherName"
                  validation="required|alpha"
                  label="Last Name"
                  :attributes="{ 
                    placeholder: 'Enter your last name',
                    title: 'Minimum 3 letters, alphabets only'
                  }"
                />
                
                <Input
                  v-model="personalDetails.email"
                  name="email"
                  validation="required|email"
                  label="Email Address"
                  :attributes="{ 
                    placeholder: 'Enter your email address',
                    type: 'email'
                  }"
                >
                  <template #right>
                    <div class="flex items-center text-gray-400">
                      <i v-html="icons.email" class="w-5 h-5" />
                    </div>
                  </template>
                </Input>
                
                <Input
                  v-model="personalDetails.mobilePhone"
                  name="mobilePhone"
                  validation="required|phone"
                  label="Mobile Phone"
                  :attributes="{ 
                    placeholder: '+251 9XX XXX XXX',
                    title: 'Valid formats: +2519XXXXXXXX or 09XXXXXXXX'
                  }"
                >
                  <template #left>
                    <div class="flex items-center text-gray-400">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                  </template>
                </Input>
              </Form>
            </div>
          </div>

          <!-- Step 2: Insurance Selection -->
          <div v-if="step === 2" class="space-y-6">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Choose Your Insurance Provider</h3>
              <p class="text-gray-600 max-w-2xl mx-auto">Select the insurance company that best fits your needs and preferences. Each provider offers unique benefits and coverage options.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
              <div 
                v-for="insurance in (insurereq.response.value?.insurances || [])" 
                :key="insurance.insuranceUuid"
                @click="personalDetails.insuranceUuid = insurance.insuranceUuid"
                class="group relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                :class="{
                  'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20': personalDetails.insuranceUuid === insurance.insuranceUuid,
                  'border-gray-200 hover:border-gray-300 bg-white': personalDetails.insuranceUuid !== insurance.insuranceUuid
                }"
              >
                <!-- Selection Indicator -->
                <div 
                  v-if="personalDetails.insuranceUuid === insurance.insuranceUuid"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                
                <!-- Insurance Logo -->
                <div class="w-20 h-20 mb-4 flex items-center justify-center bg-white rounded-xl p-3 border shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    :src="insurance.profile ? `data:image/jpeg;base64,${insurance.profile}` : '@/assets/default-insurance-logo.png'"
                    :alt="insurance.insuranceName"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <!-- Insurance Name -->
                <h4 class="text-center text-sm font-semibold transition-colors" :class="{
                  'text-primary': personalDetails.insuranceUuid === insurance.insuranceUuid,
                  'text-gray-700 group-hover:text-gray-900': personalDetails.insuranceUuid !== insurance.insuranceUuid
                }">
                  {{ insurance.insuranceName }}
                </h4>
              </div>
            </div>
          </div>

          <!-- Step 3: Vehicle Details -->
          <div v-if="step === 3" class="space-y-6">
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <!-- Vehicle Form -->
              <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Add Vehicle Details</h3>
                    <p class="text-sm text-gray-600">Provide information about your vehicle</p>
                  </div>
                </div>
                
               
                  <!-- Vehicle Type Selection -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="getSubSubCategories().length || getFinalCategories().length">
                    <Select
                      v-if="getSubSubCategories().length"
                      v-model="selectedSubSubCategory"
                      label="Sub Category"
                      :options="getSubSubCategories()"
                      @change="handleCategorySelection"
                      :attributes="{ placeholder: 'Select Sub Category' }"
                    />
        
                    <Select
                      v-if="getFinalCategories().length"
                      v-model="selectedFinalCategory"
                      label="Final Category"
                      :options="getFinalCategories()"
                      @change="handleCategorySelection"
                      :attributes="{ placeholder: 'Select Final Category' }"
                    />
                  </div>
        
                  <!-- Vehicle Details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      v-model="newVehicle.buyingPrice"
                      label="Buying Price (ETB)"
                      type="number"
                      :attributes="{ placeholder: 'Enter buying price' }"
                    >
                      <template #left>
                        <span class="text-gray-500 font-medium">ETB</span>
                      </template>
                    </Input>
        
                    <Input
                      v-model="newVehicle.plateNumber"
                      label="Plate Number"
                      :attributes="{ placeholder: 'e.g., AA-123456' }"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      v-model="newVehicle.makeYear"
                      label="Make Year"
                      :attributes="{ placeholder: 'e.g., 2020' }"
                    />
        
                    <Select
                      v-model="newVehicle.carName"
                      label="Car Make"
                      :options="carMakes"
                      :attributes="{ placeholder: 'Select car make' }"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      v-model="newVehicle.carType"
                      label="Car Type"
                      :options="carTypes"
                      :attributes="{ placeholder: 'Select car type' }"
                    />
                    
                    <Select
                      v-model="newVehicle.carModel"
                      label="Car Model"
                      :options="carModels"
                      :attributes="{ placeholder: 'Select car model' }"
                    />
                  </div>

                  <Select
                    v-model="newVehicle.engine_No"
                    label="Engine Number"
                    :options="engineNumbers"
                    :attributes="{ placeholder: 'Select engine number' }"
                  />
        
                  <div class="flex justify-end pt-4">
                    <Button 
                      @click="addVehicle" 
                      type="primary"
                      size="md"
                      class="px-8"
                    >
                      {{ editingIndex !== null ? 'Update Vehicle' : 'Add Vehicle' }}
                    </Button>
                  </div>
               
              </div>
        
              <!-- Vehicle List -->
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Added Vehicles</h3>
                    <p class="text-sm text-gray-600">{{ carRequests.length }} vehicle(s) added</p>
                  </div>
                </div>
                
                <div v-if="carRequests.length === 0" class="text-center py-12">
                  <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-gray-500 text-sm">No vehicles added yet</p>
                  <p class="text-gray-400 text-xs mt-1">Add your first vehicle using the form</p>
                </div>
                
                <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                  <div 
                    v-for="(vehicle, index) in carRequests" 
                    :key="index" 
                    class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 mb-1">
                          {{ vehicle.carName }} {{ vehicle.carModel }}
                        </h4>
                        <div class="text-sm text-gray-600 space-y-1">
                          <p><span class="font-medium">Type:</span> {{ vehicle.carType }}</p>
                          <p><span class="font-medium">Plate:</span> {{ vehicle.plateNumber }}</p>
                          <p><span class="font-medium">Year:</span> {{ vehicle.makeYear }}</p>
                          <p><span class="font-medium">Price:</span> ETB {{ Number(vehicle.buyingPrice).toLocaleString() }}</p>
                        </div>
                      </div>
                      <div class="flex flex-col gap-2 ml-4">
                        <Button 
                          @click="(e) => editVehicle(e, index)"
                          type="secondary"
                          size="sm"
                          class="text-xs"
                        >
                          Edit
                        </Button>
                        <Button 
                          @click="(e) => deleteVehicle(e, index)"
                          type="danger"
                          size="sm"
                          class="text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Bank Account -->
         <div v-if="step === 4" class="space-y-6">
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
              <Button @click="prevStep" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                Back
              </Button>
            </div>
          </div>
       
      </Form>
      </template>

      <template #bottom>
        <div class="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
          <!-- Save as Draft button -->
          <div v-if="step !== 4">
            <Button 
              @click="saveDraft" 
              type="secondary" 
              size="lg"
              class="px-8"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              Save as Draft
            </Button>
          </div>
          <div v-else></div>
          
          <!-- Navigation buttons -->
          <div class="flex items-center gap-3">
            <Button 
              v-if="step > 1 && step !== 4" 
              @click="prevStep" 
              type="secondary" 
              size="lg"
              class="px-8"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Back
            </Button>
            
            <Button 
              v-if="step < 4" 
              @click="nextStep" 
              type="primary" 
              size="lg"
              class="px-8"
            >
              Continue
              <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </Button>
            
            <Button 
              v-if="step === 4" 
              @click="submitForm" 
              type="primary" 
              size="lg"
              class="px-8"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Submit Application
            </Button>
          </div>
        </div>
      </template>
    </NewFormParent>
  </ModalParent>
</template>

<style scoped>
/* Custom animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-content {
  animation: slideIn 0.3s ease-out;
}

/* Hover effects for insurance cards */
.insurance-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.insurance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.5s ease-in-out;
}

/* Custom scrollbar for vehicle list */
.vehicle-list::-webkit-scrollbar {
  width: 6px;
}

.vehicle-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.vehicle-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.vehicle-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
