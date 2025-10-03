<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { savePremium } from '../api/premiumApi';
import { usePremium } from '../store/premiumStore';
import { toasted } from '@/utils/utils';
import { closeModal } from '@customizer/modal-x';
import ModalParent from '@/components/new_form_builder/ModalParent.vue';
import NewFormParent from '@/components/NewFormParent.vue';
import Form from '@/components/new_form_builder/Form.vue';
import { Input, Select } from '@/components/new_form_elements';
import Button from '@/components/Button.vue';
import icons from '@/utils/icons';

const premiumStore = usePremium();
const req = useApiRequest();

const premiumData = ref({
  car_type: '',
  rate: 0,
  privateType: '',
  commercialType: '',
  goodsCarryingType: '',
  ownGoodsType: '',
  generalGoodsCaringType: '',
  passengerCarryingType: '',
  publicServiceType: ''
});

// Category selection refs
const selectedMainCategory = ref('');
const selectedSubCategory = ref('');
const selectedSubSubCategory = ref('');
const selectedFinalCategory = ref('');

// Category structure - same as quotation component
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

// Watch for changes in category selections
watch([selectedMainCategory, selectedSubCategory, selectedSubSubCategory, selectedFinalCategory], () => {
  handleCategorySelection();
});

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

  // Reset all fields first
  premiumData.value.privateType = '';
  premiumData.value.commercialType = '';
  premiumData.value.goodsCarryingType = '';
  premiumData.value.ownGoodsType = '';
  premiumData.value.generalGoodsCaringType = '';
  premiumData.value.passengerCarryingType = '';
  premiumData.value.publicServiceType = '';

  // Set car_type
  premiumData.value.car_type = mainCat === 'Motor Private' ? 'PRIVATE' : 'COMMERCIAL';

  if (mainCat === 'Motor Private') {
    // For private vehicles, set privateType
    premiumData.value.privateType = subCat;
  } else if (mainCat === 'Motor Commercial') {
    // For commercial vehicles
    if (directCommercialTypes.includes(subCat)) {
      // Direct commercial types (no sub-categories)
      premiumData.value.commercialType = subCat;
    } else {
      // Categories with sub-categories
      premiumData.value.commercialType = subCat;
      
      if (subCat === 'GOODS_CARRYING') {
        premiumData.value.goodsCarryingType = subSubCat;
        
        if (subSubCat === 'OWN_GOODS') {
          premiumData.value.ownGoodsType = finalCat;
        } else if (subSubCat === 'GENERAL_CARTAGE') {
          premiumData.value.generalGoodsCaringType = finalCat;
        }
      } else if (subCat === 'PASSENGER_CARRYING') {
        if (subSubCat === 'OWN_SERVICE') {
          premiumData.value.passengerCarryingType = subSubCat;
        } else if (subSubCat === 'PUBLIC_SERVICE') {
          premiumData.value.passengerCarryingType = subSubCat;
          premiumData.value.publicServiceType = finalCat;
        }
      }
    }
  }

  console.log('Updated premium data:', premiumData.value);
};

function onCarTypeChange() {
  selectedSubCategory.value = '';
  selectedSubSubCategory.value = '';
  selectedFinalCategory.value = '';
}

function onSubCategoryChange() {
  selectedSubSubCategory.value = '';
  selectedFinalCategory.value = '';
}

function onSubSubCategoryChange() {
  selectedFinalCategory.value = '';
}

async function submitForm(event) {
  event?.preventDefault();
  event?.stopPropagation();
  
  // Ensure all reactive updates are processed
  await nextTick();
  
  // Validate required fields
  if (!premiumData.value.car_type) {
    toasted(false, 'Error', 'Please select a vehicle type');
    return;
  }
  
  if (!premiumData.value.rate || parseFloat(premiumData.value.rate) <= 0) {
    toasted(false, 'Error', 'Please enter a valid premium rate');
    return;
  }
  
  // For private vehicles, ensure privateType is selected
  if (premiumData.value.car_type === 'PRIVATE' && !premiumData.value.privateType) {
    toasted(false, 'Error', 'Please select a private vehicle category');
    return;
  }
  
  // For commercial vehicles, ensure at least commercialType is selected
  if (premiumData.value.car_type === 'COMMERCIAL' && !premiumData.value.commercialType) {
    toasted(false, 'Error', 'Please select a commercial vehicle category');
    return;
  }
  
  // Create a clean form data object with only the relevant fields
  const formData = {
    car_type: premiumData.value.car_type,
    rate: parseFloat(premiumData.value.rate) // Convert percentage to decimal
  };
  
  // Add only the relevant category fields based on the selected options
  if (premiumData.value.privateType) {
    formData.privateType = premiumData.value.privateType;
  }
  
  if (premiumData.value.commercialType) {
    formData.commercialType = premiumData.value.commercialType;
  }
  
  if (premiumData.value.goodsCarryingType) {
    formData.goodsCarryingType = premiumData.value.goodsCarryingType;
  }
  
  if (premiumData.value.ownGoodsType) {
    formData.ownGoodsType = premiumData.value.ownGoodsType;
  }
  
  if (premiumData.value.generalGoodsCaringType) {
    formData.generalGoodsCaringType = premiumData.value.generalGoodsCaringType;
  }
  
  if (premiumData.value.passengerCarryingType) {
    formData.passengerCarryingType = premiumData.value.passengerCarryingType;
  }
  
  if (premiumData.value.publicServiceType) {
    formData.publicServiceType = premiumData.value.publicServiceType;
  }
  
  console.log('Submitting form data:', formData);

  req.send(
    () => savePremium(formData),
    (res) => {
      if (res.success) {
        premiumStore.add(res.data);
        toasted(true, 'Premium Rate Created Successfully!');
        closeModal();
      } else {
        toasted(false, 'Error', res.error);
      }
    }
  );
}
</script>

<template>
  <ModalParent>
    <NewFormParent title="Add Premium Rate" size="lg" class="px-6 py-4 max-w-4xl">
      <template #default>
        <Form id="add_primum" @submit="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Vehicle Type Selection -->
            <Select
              v-model="selectedMainCategory"
              label="Vehicle Type"
              :options="getMainCategories()"
              @change="onCarTypeChange"
              :attributes="{ placeholder: 'Select Vehicle Type', required: true }"
            />
            
            <!-- Rate -->
            <Input
              v-model="premiumData.rate"
              name="rate"
              validation="required|numeric"
              label="Premium Rate"
              type="number"
              :attributes="{ placeholder: '0.00', min: '0', step: '0.01', required: true }"
            >
             
            </Input>
          </div>

          <!-- Sub Categories -->
          <div v-if="selectedMainCategory" class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Category Selection</h3>
            
            <!-- Sub Category -->
            <div class="mb-4" v-if="getSubCategories().length">
              <Select
                v-model="selectedSubCategory"
                label="Category"
                :options="getSubCategories()"
                @change="onSubCategoryChange"
                :attributes="{ placeholder: 'Select Category', required: true }"
              />
            </div>

            <!-- Sub Sub Category -->
            <div class="mb-4" v-if="getSubSubCategories().length">
              <Select
                v-model="selectedSubSubCategory"
                label="Sub Category"
                :options="getSubSubCategories()"
                @change="onSubSubCategoryChange"
                :attributes="{ placeholder: 'Select Sub Category' }"
              />
            </div>

            <!-- Final Category -->
            <div class="mb-4" v-if="getFinalCategories().length">
              <Select
                v-model="selectedFinalCategory"
                label="Final Category"
                :options="getFinalCategories()"
                @change="onFinalCategoryChange"
                :attributes="{ placeholder: 'Select Final Category' }"
              />
            </div>
          </div>

          <!-- Debug info (can be removed in production) -->
          <div v-if="premiumData.car_type" class="mt-6 p-3 bg-gray-100 rounded-md text-xs">
            <h4 class="font-medium mb-1">Current Selection:</h4>
            <p>Car Type: {{ premiumData.car_type }}</p>
            <p v-if="premiumData.privateType">Private Type: {{ premiumData.privateType }}</p>
            <p v-if="premiumData.commercialType">Commercial Type: {{ premiumData.commercialType }}</p>
            <p v-if="premiumData.goodsCarryingType">Goods Carrying: {{ premiumData.goodsCarryingType }}</p>
            <p v-if="premiumData.ownGoodsType">Own Goods: {{ premiumData.ownGoodsType }}</p>
            <p v-if="premiumData.generalGoodsCaringType">General Goods: {{ premiumData.generalGoodsCaringType }}</p>
            <p v-if="premiumData.passengerCarryingType">Passenger Carrying: {{ premiumData.passengerCarryingType }}</p>
            <p v-if="premiumData.publicServiceType">Public Service: {{ premiumData.publicServiceType }}</p>
          </div>
        </Form>
      </template>

      <template #bottom>
        <div class="flex justify-end gap-3">
          <Button @click="closeModal" type="secondary">
            Cancel
          </Button>
          <Button
            @click="submitForm"
            :pending="req.pending.value"
            type="primary"
            class="flex items-center gap-2"
            :attributes="{ type: 'button' }"
          >
            <i v-html="icons.save" class="w-4 h-4"></i>
            Save Premium Rate
          </Button>
        </div>
      </template>
    </NewFormParent>
  </ModalParent>
</template>