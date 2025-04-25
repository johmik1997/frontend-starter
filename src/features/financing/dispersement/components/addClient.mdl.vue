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
import { CreateClient } from "../api/dispersementApi";
import { v4 as uuidv4 } from 'uuid';
import { getValidators } from '@/components/new_form_builder/util/validators.js';

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
  carModel: '',
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

// Validation
const isValidPersonalDetails = () => {
  const validators = getValidators();
  const details = personalDetails.value;

  const validations = {
    firstName: validators.text.alpha(details.firstName, [3], null, "First Name must be at least 3 letters and contain only alphabets"),
    fatherName: validators.text.alpha(details.fatherName, [3], null, "Last Name must be at least 3 letters and contain only alphabets"),
    email: validators.text.email(details.email, null, null, "Please enter a valid email address"),
    mobilePhone: validators.text.phone(details.mobilePhone, null, null, "Please enter a valid phone number"),
    insuranceUuid: validators.select.required(details.insuranceUuid, null, null, "Insurance selection is required")
  };

  const errors = Object.entries(validations)
    .filter(([_, [isValid]]) => !isValid)
    .map(([_, [__, message]]) => message);

  if (errors.length > 0) {
    toasted(false, "", errors.join('\n'));
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
    if (carRequests.value.length === 0) {
      toasted(false, "", "Please add at least one vehicle before continuing!");
      return;
    }
    step.value = 3;
  }
};

const prevStep = () => {
  step.value = 1; // Explicitly set to 1
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
function submitForm() {
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

  useApiRequest().send(
    () => CreateClient(requestData),
    (res) => {
      if (res.success) {
        toasted(true, "Client Created Successfully!");
        closeModal();
      } else {
        toasted(false, "Error", res.error);
      }
    }
  );
}

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
</script>

<template>
  <ModalParent>
    <NewFormParent class="px-4 py-2" size="xs" title="Add Client">
      <template #default >
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
          <div v-if="step === 1" class=" w-full mt-5 gap-4">
            <Select
              :obj="true"
              v-model="personalDetails.insuranceUuid"
              name="insuranceUuid"
              label="Insurance"
              validation="required"
              :options="
                (insurereq.response.value?.insurances || []).map((insurance) => ({
                  label: insurance.insuranceName,
                  value: insurance.insuranceUuid,
                }))
              "
              :attributes="{ placeholder: 'Select Insurance' }"
            />
           {{  console.log('insurances', insurereq.response.value?.insurances)}}   
          </div>
          <!-- Step 2: Vehicle Details -->
           <div class="grid grid-cols-2 gap-4 mb-4">
            
  
           
          <div v-if="step === 2" class="w-full max-w-lg bg-white p-6 rounded-md">
            <h3 class="text-lg font-semibold mb-4">Step 2: Vehicle Details</h3>
            
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
                :options="['Toyota', 'Suzuki', 'Honda']"
                  :attributes="{ placeholder: 'Enter car name' }"
              />
  
              <Select
                v-model="newVehicle.carModel"
                label="Car Model"
                :options="['Yaris', 'Dezire', 'Prado']"
                  :attributes="{ placeholder: 'Enter car model' }"
              />
            </div>
  
            <div class="flex justify-between mt-4">
              <Button @click="prevStep" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                Back
              </Button>
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
          <div v-if="step === 2" class="w-full max-w-lg bg-[#F0F0FF] text-[#1E1E1E] rounded-md p-4 mx-4">
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
          <!-- Step 3: Bank Account -->
          <div v-if="step === 3" class="w-[700px]">
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
        <div class="flex justify-between m-4 w-full gap-4 pr-4">
          <!-- Save as Draft button - 25% width (only in steps 1 and 2) -->
          <div v-if="step !== 3" class="w-1/4">
            <Button 
              v-if="step === 1 || step === 2"
              @click="saveDraft" 
              type="secondary" 
              size="lg"
              class="w-full"
            >
              Save as Draft
            </Button>
          </div>
          
          <!-- Continue buttons - 75% width (steps 1 and 2) -->
          <div :class="step === 3 ? 'w-full' : 'flex-1'">
            <Button 
              v-if="step === 1" 
              @click="nextStep" 
              type="primary" 
              size="lg"
              class="w-full"
            >
              Continue
            </Button>
            <Button 
              v-if="step === 2" 
              @click="nextStep" 
              type="primary" 
              size="lg"
              class="w-full"
            >
              Continue
            </Button>
            <Button 
              v-if="step === 3" 
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
