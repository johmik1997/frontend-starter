<template>  
 <div class="mx-auto p-3 sm:p-6  bg-white">  
    <header class="flex flex-col  sm:flex-row items-start sm:items-center mb-4 pb-5 ml-2 sm:ml-5 border-b justify-between gap-2">  
      <div class="flex items-center gap-2"> 
        <i class="pl-2" v-html="icons.pro" />
        <h1 class="text-sm sm:text-md font-semibold">{{ customerId.customers?.clientFirstName }} {{ customerId.customers?.clientFatherName }} {{ customerId.customers?.clientGrandFatherName }}</h1>  
      </div> 
      <p class="text-sm">Suzuki Dezire 2024 - Code 3</p>
    </header>  

    <div class="bg-[rgb(246,246,255)] p-2 sm:p-4 flex flex-col lg:flex-row w-full h-full gap-4">
      <!-- Client Info Section -->
      <section class="mb-4 p-3 bg-white pt-5 w-full lg:w-1/3">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-sm font-bold">Client Info</h2>
          <button v-if="!isEditing && customerId.customers?.quotationStatus =='PENDING'" @click="toggleEdit" class="text-primary">
            <i v-html="icons.pencil" />
          </button>
          <button v-if="isEditing" @click="cancelEdit" class="text-gray-600">
            <i v-html="icons.close" />
          </button>
        </div>

        <!-- View Mode -->
        <div v-if="!isEditing">
          <div class="grid grid-cols-2 gap-2 sm:gap-4 pt-2">
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">First Name</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.clientFirstName }}</div>
            
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Last Name</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.clientFatherName }}</div>
            
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Email</div>
            <div class="py-1 text-xs sm:text-sm break-all">{{ customerId.customers?.clientEmail }}</div>
            
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Phone Number</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.clientPhoneNumber}}</div>
          </div>

          <h2 class="text-sm font-bold mb-2 border-b pt-8">Vehicle details</h2>
          <div class="grid grid-cols-2 gap-2 sm:gap-4 pt-2">
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Vehicle Make</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.carName }}</div>
            
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">carType</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.carType }}</div>
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Vehicle Model</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.carModel }}</div>
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Engine Number</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.engine_No }}</div>
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Vehicle Type</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.category1 }}</div>
            
            <div class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Category</div>
            <div class="py-1 text-xs sm:text-sm">{{ customerId.customers?.category2 || '-' }}</div>
            
            <div v-if="customerId.customers?.category3" class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Sub Category</div>
            <div v-if="customerId.customers?.category3" class="py-1 text-xs sm:text-sm">{{ customerId.customers?.category3 }}</div>
            {{ console.log(customerId.customers?.category3)}}
            <div v-if="customerId.customers?.category4" class="py-1 text-xs sm:text-sm font-normal text-[#2B3674]">Final Category</div>
            <div v-if="customerId.customers?.category4" class="py-1 text-xs sm:text-sm">{{ customerId.customers?.category4 }}</div>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-if="isEditing" class="space-y-4">
          <!-- Vehicle Make -->
          <Select
            v-model="editedData.carName"
            label="Vehicle Make"
            :options="carMakes"
            :attributes="{ 
              placeholder: 'Select Vehicle Make',
              class: 'w-[90%] mx-3 mt-1 text-sm'
            }"
          >
            <template #label>
              Vehicle Make <span class="text-red-500">*</span>
            </template>
          </Select>

          <!-- Car Type -->
          <Select
            v-model="editedData.carType"
            label="Car Type"
            :options="carTypes"
            :disabled="!editedData.carName"
            :attributes="{ 
              placeholder: 'Select Car Type',
              class: 'w-[90%] mx-3 mt-1 text-sm'
            }"
          >
            <template #label>
              Car Type <span class="text-red-500">*</span>
            </template>
          </Select>

          <!-- Car Model -->
          <Select
            v-model="editedData.carModel"
            label="Car Model"
            :options="carModels"
            :disabled="!editedData.carType"
            :attributes="{ 
              placeholder: 'Select Car Model',
              class: 'w-[90%] mx-3 mt-1 text-sm'
            }"
          >
            <template #label>
              Car Model <span class="text-red-500">*</span>
            </template>
          </Select>

          <!-- Engine Number -->
          <Select
            v-model="editedData.engine_No"
            label="Engine Number"
            :options="engineNumbers"
            :disabled="!editedData.carModel"
            :attributes="{ 
              placeholder: 'Select Engine Number',
              class: 'w-[90%] mx-3 mt-1 text-sm'
            }"
          >
            <template #label>
              Engine Number <span class="text-red-500">*</span>
            </template>
          </Select>

          <!-- Vehicle Year -->
          <Input
            v-model="editedData.makeYear"
            label="Vehicle Year"
            :validation="'required'"
            :attributes="{ 
              type: 'text',
              placeholder: 'Enter Vehicle Year',
            }"
          >
            <template #label>
              Vehicle Year <span class="text-red-500">*</span>
            </template>
          </Input>

          <!-- Plate Code -->
          <Input
            v-model="editedData.plateNumber"
            label="Plate Code"
            :validation="'required'"
            :attributes="{ 
              type: 'text',
              placeholder: 'Enter Plate Code',
            }"
          >
            <template #label>
              Plate Code <span class="text-red-500">*</span>
            </template>
          </Input>

          <!-- Buying Price -->
          <Input
            v-model="editedData.buyingPrice"
            label="Buying Price"
            :validation="'required'"
            :attributes="{ 
              type: 'text',
              placeholder: 'Enter Buying Price',
            }"
          >
            <template #label>
              Buying Price <span class="text-red-500">*</span>
            </template>
          </Input>
          <!-- Category Selection Section -->
          <div v-if="isEditing" class="space-y-4">
            <!-- Main Category -->
            <Select
              v-model="selectedMainCategory"
              label="Vehicle Type"
              :options="getMainCategories()"
              required
              :attributes="{ placeholder: 'Select Vehicle Type', class: 'w-[90%] mx-3 mt-1 text-sm' }"
            >
              <template #label>
                Vehicle Type <span class="text-red-500">*</span>
              </template>
            </Select>

            <!-- Sub Category -->
            <Select
              v-if="getSubCategories().length"
              v-model="selectedSubCategory"
              label="Category"
              :options="getSubCategories()"
              required
              :attributes="{ placeholder: 'Select Category', class: 'w-[90%] mx-3 mt-1 text-sm' }"
            >
              <template #label>
                Category <span class="text-red-500">*</span>
              </template>
            </Select>

            <!-- Sub Sub Category -->
            <Select
              v-if="getSubSubCategories().length"
              v-model="selectedSubSubCategory"
              label="Sub Category"
              :options="getSubSubCategories()"
              required
              :attributes="{ placeholder: 'Select Sub Category', class: 'w-[90%] mx-3 mt-1 text-sm' }"
            >
              <template #label>
                Sub Category <span class="text-red-500">*</span>
              </template>
            </Select>

            <!-- Final Category -->
            <Select
              v-if="getFinalCategories().length"
              v-model="selectedFinalCategory"
              label="Final Category"
              :options="getFinalCategories()"
              required
              :attributes="{ placeholder: 'Select Final Category', class: 'w-[90%] mx-3 mt-1 text-sm' }"
            >
              <template #label>
                Final Category <span class="text-red-500">*</span>
              </template>
            </Select>
          </div>

          <!-- Display current categories when not editing -->
          <div v-else class="space-y-2">
            <p>Vehicle Type: {{ selectedMainCategory }}</p>
            <p v-if="selectedSubCategory">Category: {{ selectedSubCategory }}</p>
            <p v-if="selectedSubSubCategory">Sub Category: {{ selectedSubSubCategory }}</p>
            <p v-if="selectedFinalCategory">Final Category: {{ selectedFinalCategory }}</p>
          </div>

          <div class="flex border-b-2 text-center items-center justify-center pt-6">
            <Button 
            v-if="customerId.customers?.quotationStatus =='PENDING'"
              class="flex justify-center  bg-[#3C3C9E] text-center w-full mx-2 items-center text-white  rounded text-sm"
              @click="saveChanges" 
              :pending="isSubmit"
            >
            Save Changes
            </Button>
          </div>
        </div>
      </section>

      <!-- Right Section Container -->
      <section class="w-full lg:w-3/5 flex flex-col gap-4">
        <!-- Quotation Details Section -->
        <section class="w-full p-3 bg-white pt-5">
          <h2 class="text-sm font-bold mb-2 border-b">Quotation Details</h2>
          <div class="flex flex-col gap-4 pt-2">
            <!-- Quotation Amount -->
            <div class="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <span class="text-xs sm:text-sm font-normal text-[#2B3674]">Quotation</span>
              <div v-if="!isEditing1">
                <Button class="text-xs sm:text-sm bg-[#F6F6FF] items-center text-[#272833] W-4" @click="toggleEdit1">
                  ETB {{ quotation.amount }} <i v-if="!isEditing && customerId.customers?.quotationStatus =='PENDING'" class="pl-2" v-html="icons.pencil" />
                </Button>
              </div>
              <div v-if="isEditing1" class="flex items-center border-2">
                <p class="p-2 text-xs sm:text-sm">ETB</p>
                <input v-model="editedAmount1" type="number" class="w-16 pr-2 text-xs sm:text-sm" />
                <button class="text-xs sm:text-sm bg-[#3C3C9E] items-center p-2 m-1 text-white rounded-md" @click="saveEdit">
                  Change
                </button>
              </div>
            </div>

            <!-- Deposit -->
            <div class="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <span class="text-xs sm:text-sm font-normal text-[#2B3674]">Deposit</span>
              <div class="text-xs sm:text-sm bg-[#F6F6FF] items-center text-[#272833] p-2">
                ETB {{ quotation.deposit }}
              </div>
            </div>

            <!-- Monthly Repayment -->
            <div class="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <span class="text-xs sm:text-sm font-normal text-[#2B3674]">Monthly Repayment</span>
              <div class="text-xs sm:text-sm bg-[#F6F6FF] items-center text-[#272833] p-2">
                ETB {{ quotation.premium }}
              </div>
            </div>
          </div>

          <div v-if="libreFrontPage || libreFrontPage === 'null'"  class="flex border-b-2 text-center items-center justify-center pt-6">
            <Button 
            v-if="customerId.customers?.quotationStatus =='PENDING'"
              class="flex justify-center mt-1 bg-[#3C3C9E] text-center w-full mx-2 items-center text-white py-2 rounded text-sm"
              @click="sendFinalQuotation"
              :pending="isSubmitting"
            >
              Send Final Quote to Client
            </Button>
           
          </div>
          <div v-else-if="!libreFrontPage || libreFrontPage === 'null'"  class="flex border-b-2 text-center items-center justify-center pt-6">
            <Button 
            v-if="customerId.customers?.quotationStatus =='PENDING'"
              class="flex justify-center mt-1 bg-[#3C3C9E] text-center w-full mx-2 items-center text-white py-2 rounded text-sm"
              @click="openUploadModal" 
              :pending="isSubmitting"
            >
              Libre Images Pending
            </Button>
           
          </div>
        </section>

        <!-- Libre Section -->
        <section class="w-full p-3 bg-white pt-5">  
          <h2 class="text-lg font-semibold mb-2 border-b flex justify-between items-center">
            <span>Libre</span>
            <button 
              v-if="libreFrontPage && libreBackPage && libreFrontPage !== 'null' && libreBackPage !== 'null' && customerId.customers?.quotationStatus =='PENDING'"
              @click="openUploadModal" 
              class="bg-primary text-white py-1 px-3 rounded-md text-sm">
              Update Images
            </button>
          </h2>  
          <div class="flex flex-col">  
            <div class="flex flex-col sm:flex-row px-2 gap-4 pt-2">  
              <!-- Front Page -->
              <div class="relative w-full sm:w-1/2">
                <div v-if="!libreFrontPage || libreFrontPage === 'null'" 
                     class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-48">
                  <div v-if="customerId.customers?.quotationStatus =='PENDING'" class="text-gray-500 text-center mb-4">No front page image</div>
                  <div v-else class="text-gray-500 text-center mb-4">Loading</div>
                  <button @click="openUploadModal" 
                   v-if="customerId.customers?.quotationStatus =='PENDING'"
                    class="bg-primary text-white py-2 px-4 rounded-md text-sm">
                    Upload Libre Images
                  </button>
                </div>
                <div v-else class="flex flex-col gap-2">
                  <img :src="libreFrontPage" class="w-full h-auto object-contain" />  
                  <button @click="viewImage('Front Page', libreFrontPage)"
                    class="w-full bg-primary text-white py-2 rounded-md text-xs sm:text-sm">
                    View Front Page
                  </button>
                </div>
              </div>
              
              <!-- Back Page -->
              <div class="relative w-full sm:w-1/2">
                <div v-if="!libreBackPage || libreBackPage === 'null'" 
                     class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-48">
                     <div v-if="customerId.customers?.quotationStatus =='PENDING'" class="text-gray-500 text-center mb-4">No back page image</div>
                     <div v-else class="text-gray-500 text-center mb-4">Loading</div>
                  <button 
                  v-if="customerId.customers?.quotationStatus =='PENDING'"
                  @click="openUploadModal" 
                    class="bg-primary text-white py-2 px-4 rounded-md text-sm">
                    Upload Libre Images
                  </button>
                </div>
                <div v-else class="flex flex-col gap-2">
                  <img :src="libreBackPage" class="w-full h-auto object-contain" />  
                  <button @click="viewImage('Back Page', libreBackPage)"
                    class="w-full bg-primary text-white py-2 rounded-md text-xs sm:text-sm">
                    View Back Page
                  </button>
                </div>
              </div>
            </div>  
          </div>  
        </section>

        <!-- Upload Modal Template -->
        <template>
          <Modal name="UploadLibreModal">
            <div class="p-4">
              <h2 class="text-lg font-semibold mb-4">
                {{ libreFrontPage && libreBackPage ? 'Update' : 'Upload' }} Libre Images
              </h2>
              
              <!-- Front Libre Upload -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Front Libre</label>
                <div class="flex items-center justify-center w-full">
                  <label class="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                    <span class="text-sm text-gray-500">
                      {{ frontLibrePreview ? 'Change Front Page' : 'Upload Front Page' }}
                    </span>
                    <input type="file" class="hidden" @change="handleFrontLibreUpload" accept="image/*" />
                  </label>
                </div>
                <div v-if="frontLibrePreview" class="mt-2">
                  <img :src="frontLibrePreview" class="h-20 object-contain" />
                </div>
              </div>

              <!-- Back Libre Upload -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Back Libre</label>
                <div class="flex items-center justify-center w-full">
                  <label class="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                    <span class="text-sm text-gray-500">
                      {{ backLibrePreview ? 'Change Back Page' : 'Upload Back Page' }}
                    </span>
                    <input type="file" class="hidden" @change="handleBackLibreUpload" accept="image/*" />
                  </label>
                </div>
                <div v-if="backLibrePreview" class="mt-2">
                  <img :src="backLibrePreview" class="h-20 object-contain" />
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end gap-2">
                <button 
                  @click="closeModal('UploadLibreModal')" 
                  class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
                  Cancel
                </button>
                <button 
                  @click="submitLibreImages" 
                  class="bg-primary text-white px-4 py-2 rounded-md text-sm"
                  :disabled="!frontLibre || !backLibre">
                  {{ libreFrontPage && libreBackPage ? 'Update' : 'Upload' }} Images
                </button>
              </div>
            </div>
          </Modal>
        </template>
      </section>
    </div>
  </div>
</template>  
  
  <script setup>
  import { usePaginations } from '@/composables/usepaginations.js';
import { removeUndefined, toasted } from '@/utils/utils';
import { openModal } from "@customizer/modal-x";

import { getCustomersbyId, getLibreImages, setQuotation, updateCarDetails, getAllcar } from '../api/customersApi';
import { useRoute } from 'vue-router';
import { useCustomers } from '../store/customeridStore';
import Button from '@/components/Button.vue';
import icons from '@/utils/icons';
import { ref, onMounted, watch, reactive, nextTick } from 'vue';
import axios from 'axios';
import ApiService from '@/service/ApiService';
import Select from '@/components/new_form_elements/Select.vue';
import { saveCarLibre } from '@/features/financing/dispersement/api/dispersementApi';
import Input from '@/components/new_form_elements/Input.vue';

const customerId = useCustomers();
const api = new ApiService();
const libreFrontPage = ref(null);
const libreBackPage = ref(null);

const viewImage = (title, imageUrl) => {
  openModal('ImageViewer', {
    title,
    imageUrl
  });
};

const fetchLibreImages = async () => {
  try {
    console.log('Fetching libre images...');
    const carUuid = customerId.customers?.carUuid;
    if (!carUuid) {
      console.log('No carUuid available');
      return;
    }

    const response = await getLibreImages(carUuid);
    console.log('API Response:', response);

    if (response.success) {
      // Only set the values if they're not null
      libreFrontPage.value = response.data.libreFrontPage ? 
        `data:image/jpeg;base64,${response.data.libreFrontPage}` : null;
      libreBackPage.value = response.data.libreBackPage ? 
        `data:image/jpeg;base64,${response.data.libreBackPage}` : null;
      console.log('Images loaded successfully', {
        front: libreFrontPage.value,
        back: libreBackPage.value
      });
    }
  } catch (error) {
    console.error('Error fetching libre images:', error);
    libreFrontPage.value = null;
    libreBackPage.value = null;
  }
};

// Watch for changes in customerId.customers
watch(
  () => customerId.customers,
  (newValue) => {
    console.log('Customer data changed:', newValue);
    if (newValue?.carUuid) {
      fetchLibreImages();
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log('Component mounted');
  if (customerId.customers?.carUuid) {
    fetchLibreImages();
  }
});
  
  // Customer data
  const customer = ref({
	image: 'customer-image-url.jpg', // Replace with the actual image URL
	joinedDate: '23-05-2024',
	fullName: 'Birhane Araya',
	phoneNumber: '+251 945 065 432',
	address: 'Bole, Woreda 2, Addis Ababa',
	email: 'birhanearaya23@gmail.com'
  });
  
  // Mobile data
  const mobile = ref({
	deviceBrand: 'iPhone 15',
	handsetCost: 'ETB 120,000.00',
	manufacturedYear: '2023',
	serialNumber: 'AD487598E',
	imei: '495860469593',
	imei2: '1239804710923'
  });
  
  // Policy data (if needed in future)
  const policy = ref({
	policyNumber: 'L389247',
	status: 'Active',
	expiryDate: 'Araya',
	premiumPayments: 23
  });
  const client = ref({  
  firstName: 'Birhane',  
  lastName: 'Araya',  
  email: 'birhanearya23@gmail.com',  
  phone: '+251 946065432',  
  image: 'path_to_image.jpg', // Replace with an actual image path  
});  
const calculateMonthlyPremium = (quotationAmount) => {
  return quotationAmount / 12; // quotation divided by 12
};
const calculateDeposit = (quotationAmount) => {
  return quotationAmount * 0.22; // 22% of quotation
};
// Then define the quotation ref
const quotation = ref({
  amount: customerId.customers?.quotationAmount || 0,
  deposit: calculateDeposit(customerId.customers?.quotationAmount || 0),
  premium: calculateMonthlyPremium(customerId.customers?.quotationAmount || 0),
});
// Example quotation data  

  const props = defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
  onSubmit: {
    type: Function,
  },
});

const route = useRoute()
const userUuid = route.params?.quotationUuid
const pagination = usePaginations({
  store: customerId,
  cb: async (id) => {
    try {
      return await getCustomersbyId(userUuid);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  },
});


watch(
  () => customerId.customers,
  (newValue) => {
    if (newValue) {
      const quotationAmount = newValue.quotationAmount || 0;
      quotation.value.amount = quotationAmount;
      quotation.value.deposit = calculateDeposit(quotationAmount);
      quotation.value.premium = calculateMonthlyPremium(quotationAmount);
    }
  }
);
// First, define the calculation functions




// Now define the editing states
const isEditing1 = ref(false);
const isEditing2 = ref(false);
const isEditing3 = ref(false);
const editedAmount1 = ref(quotation.value.amount);
const editedAmount2 = ref(quotation.value.deposit);
const editedAmount3 = ref(quotation.value.premium);
const isSubmitting = ref(false);
const isSubmit = ref(false);
// Toggle functions
const toggleEdit1 = () => {  
  if (customerId.customers?.quotationStatus === 'PENDING') {
    editedAmount1.value = quotation.value.amount;
    isEditing1.value = true;  
    isEditing2.value = false;  
    isEditing3.value = false;  
  }
};  

const toggleEdit2 = () => {  
  editedAmount2.value = quotation.value.deposit;
  isEditing2.value = true;  
  isEditing1.value = false;  
  isEditing3.value = false;  
};  

const toggleEdit3 = () => {  
  editedAmount3.value = quotation.value.premium;
  isEditing3.value = true;  
  isEditing2.value = false;  
  isEditing1.value = false;  
}; 

// Method to save the edited amount
const saveEdit = async () => {
  if (isEditing1.value) {
    // Update quotation amount and recalculate deposit and premium locally
    const newAmount = parseFloat(editedAmount1.value);
    quotation.value.amount = newAmount;
    quotation.value.deposit = calculateDeposit(newAmount);
    quotation.value.premium = calculateMonthlyPremium(newAmount);
    
    // Reset editing state
    isEditing1.value = false;
    editedAmount1.value = '';
  }
};

// Add new function to handle sending final quotation to backend
const sendFinalQuotation = async () => {
  try {
    isSubmitting.value = true;
    const quotationUuid = customerId.customers?.quotationUuid;
    if (!quotationUuid) {
      toasted(false, '', 'Quotation ID not found');
      return;
    }

    const response = await setQuotation(quotationUuid, quotation.value.amount, 'quotation');
    if (response.success) {
      await setQuotation(quotationUuid, quotation.value.deposit, 'deposit');
      await setQuotation(quotationUuid, quotation.value.premium, 'premium');
      toasted(true, 'Final quotation sent successfully', '');
    } else {
      toasted(false, '', response.error || 'Failed to send quotation');
    }
  } catch (error) {
    console.error('Error sending final quotation:', error);
    toasted(false, '', 'An error occurred while sending the quotation');
  } finally {
    isSubmitting.value = false;
  }
};

const isEditing = ref(false);


const editedData = reactive({
  carName: '',
  carModel: '',
  carType: '',
  plateNumber: '',
  makeYear: '',
  buyingPrice: 0,
  engine_No: '', // Make sure this matches the property name used in the API
  rateRequest: {
    category1: '',
    category2: '',
    category3: '',
    category4: ''
  }
});

const toggleEdit = () => {
  isEditing.value = true;
  
  // Populate form with current values
  editedData.carName = customerId.customers?.carName || '';
  editedData.carModel = customerId.customers?.carModel || '';
  editedData.carType = customerId.customers?.carType || '';
  editedData.plateNumber = customerId.customers?.plateNumber || '';
  editedData.makeYear = customerId.customers?.makeYear || '';
  editedData.buyingPrice = customerId.customers?.buyingPrice || 0;
  editedData.engine_No = customerId.customers?.engine_No || '';
  
  // Set categories
  const category1 = customerId.customers?.category1;
  const category2 = customerId.customers?.category2;
  const category3 = customerId.customers?.category3;
  const category4 = customerId.customers?.category4;

  // Set main category based on category1
  selectedMainCategory.value = category1 === 'PRIVATE' ? 'Motor Private' : 'Motor Commercial';

  // Need to use nextTick to ensure the category structure is properly initialized
  nextTick(() => {
    // Set sub category if it exists
    if (category2 && getSubCategories().includes(category2)) {
      selectedSubCategory.value = category2;
    }

    // Set sub-sub category if it exists
    nextTick(() => {
      if (category3 && getSubSubCategories().includes(category3)) {
        selectedSubSubCategory.value = category3;
      }

      // Set final category if it exists
      nextTick(() => {
        if (category4 && getFinalCategories().includes(category4)) {
          selectedFinalCategory.value = category4;
        }
      });
    });
  });

  // Update editedData.rateRequest
  editedData.rateRequest = {
    category1: category1 || '',
    category2: category2 || '',
    category3: category3 || '',
    category4: category4 || ''
  };
};

const cancelEdit = () => {
  isEditing.value = false;
  // Reset the edited data to original values
  editedData.carName = customerId.customers?.carName || '';
  editedData.carModel = customerId.customers?.carModel || '';
  editedData.carType = customerId.customers?.carType || '';
  editedData.plateNumber = customerId.customers?.plateNumber || '';
  editedData.makeYear = customerId.customers?.makeYear || '';
  editedData.buyingPrice = customerId.customers?.buyingPrice || 0;
};

const saveChanges = async () => {
  // Check if all required fields are filled
  const missingFields = [];
  
  if (!editedData.carName?.trim()) missingFields.push('Vehicle Make');
  if (!editedData.carModel?.trim()) missingFields.push('Vehicle Model');
  if (!editedData.carType?.trim()) missingFields.push('Car Type');
  if (!editedData.makeYear?.trim()) missingFields.push('Vehicle Year');
  if (!editedData.plateNumber?.trim()) missingFields.push('Plate Code');
  if (!selectedMainCategory.value) missingFields.push('Vehicle Type');
  
  if (getSubCategories().length > 0 && !selectedSubCategory.value) {
    missingFields.push('Category');
  }
  if (getSubSubCategories().length > 0 && !selectedSubSubCategory.value) {
    missingFields.push('Sub Category');
  }
  if (getFinalCategories().length > 0 && !selectedFinalCategory.value) {
    missingFields.push('Final Category');
  }

  if (missingFields.length > 0) {
    toasted(false, '', `Please fill in all required fields: ${missingFields.join(', ')}`);
    return;
  }

  try {
    isSubmit.value = true;
    const response = await updateCarDetails(customerId.customers?.carUuid, editedData);
    
    if (response.success) {
      // Update the local customerId.customers data with the new values
      customerId.customers = {
        ...customerId.customers,
        carName: editedData.carName,
        carModel: editedData.carModel,
        carType: editedData.carType,
        makeYear: editedData.makeYear,
        plateNumber: editedData.plateNumber,
        category1: selectedMainCategory.value,
        category2: selectedSubCategory.value,
        category3: selectedSubSubCategory.value,
        category4: selectedFinalCategory.value
      };

      toasted(true, 'Vehicle details updated successfully');
      isEditing.value = false;
    } else {
      toasted(false, '', 'Failed to update vehicle details');
    }
  } catch (error) {
    console.error('Error updating vehicle details:', error);
    toasted(false, '', 'Failed to update vehicle details');
  } finally {
    isSubmit.value = false;
  }
};

console.log(customerId.customers?.clientFirstName)

// Add the category selection refs
const selectedMainCategory = ref('');
const selectedSubCategory = ref('');
const selectedSubSubCategory = ref('');
const selectedFinalCategory = ref('');

// Add the category structure
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

// Updated getter functions
const getMainCategories = () => {
  return Object.keys(categoryStructure);
};

const getSubCategories = () => {
  if (!selectedMainCategory.value) return [];
  const category = categoryStructure[selectedMainCategory.value];
  return Object.keys(category || {});
};

const getSubSubCategories = () => {
  if (!selectedMainCategory.value || !selectedSubCategory.value) return [];
  const category = categoryStructure[selectedMainCategory.value]?.[selectedSubCategory.value];
  if (typeof category === 'string') return []; // If it's a final value, return empty array
  return Object.keys(category || {});
};

const getFinalCategories = () => {
  if (!selectedMainCategory.value || !selectedSubCategory.value || !selectedSubSubCategory.value) return [];
  const category = categoryStructure[selectedMainCategory.value]?.[selectedSubCategory.value]?.[selectedSubSubCategory.value];
  if (typeof category === 'string') return []; // If it's a final value, return empty array
  return Object.keys(category || {});
};

// Updated watchers
watch(selectedMainCategory, (newValue) => {
  selectedSubCategory.value = '';
  selectedSubSubCategory.value = '';
  selectedFinalCategory.value = '';
  if (newValue) {
    editedData.rateRequest = {
      ...editedData.rateRequest,
      category1: newValue === 'Motor Private' ? 'PRIVATE' : 'COMMERCIAL'
    };
  }
});

watch(selectedSubCategory, (newValue) => {
  selectedSubSubCategory.value = '';
  selectedFinalCategory.value = '';
  if (newValue) {
    // Handle direct values
    if (typeof categoryStructure[selectedMainCategory.value][newValue] === 'string') {
      editedData.rateRequest = {
        ...editedData.rateRequest,
        category2: newValue,
        category3: '',
        category4: ''
      };
    } else {
      editedData.rateRequest = {
        ...editedData.rateRequest,
        category2: newValue
      };
    }
  }
});

watch(selectedSubSubCategory, (newValue) => {
  selectedFinalCategory.value = '';
  if (newValue) {
    // Handle direct values
    if (typeof categoryStructure[selectedMainCategory.value][selectedSubCategory.value][newValue] === 'string') {
      editedData.rateRequest = {
        ...editedData.rateRequest,
        category3: newValue,
        category4: ''
      };
    } else {
      editedData.rateRequest = {
        ...editedData.rateRequest,
        category3: newValue
      };
    }
  }
});

watch(selectedFinalCategory, (newValue) => {
  if (newValue) {
    editedData.rateRequest = {
      ...editedData.rateRequest,
      category4: newValue
    };
  }
});

// Initialize categories when component mounts or when customerId.customers changes
watch(() => customerId.customers, (newData) => {
  if (newData) {
    const category1 = newData.category1;
    const category2 = newData.category2;
    const category3 = newData.category3;
    const category4 = newData.category4;

    // Set main category
    selectedMainCategory.value = category1 === 'PRIVATE' ? 'Motor Private' : 'Motor Commercial';

    // Use nextTick to ensure proper category initialization
    nextTick(() => {
      if (category2) {
        selectedSubCategory.value = category2;
      }

      nextTick(() => {
        if (category3) {
          selectedSubSubCategory.value = category3;
        }

        nextTick(() => {
          if (category4) {
            selectedFinalCategory.value = category4;
          }
        });
      });
    });

    // Update editedData
    editedData.rateRequest = {
      category1: category1 || '',
      category2: category2 || '',
      category3: category3 || '',
      category4: category4 || ''
    };
  }
}, { immediate: true });

// Add debug logging to help track category values
watch([selectedMainCategory, selectedSubCategory, selectedSubSubCategory, selectedFinalCategory], 
  ([main, sub, subSub, final]) => {
    console.log('Category values updated:', {
      main,
      sub,
      subSub,
      final,
      availableSubCategories: getSubCategories(),
      availableSubSubCategories: getSubSubCategories(),
      availableFinalCategories: getFinalCategories()
    });
  }, 
  { deep: true }
);

// Add these refs
const frontLibre = ref(null);
const backLibre = ref(null);
const frontLibrePreview = ref(null);
const backLibrePreview = ref(null);

// Add these methods
const openUploadModal = () => {
  const carUuid = customerId.customers?.carUuid;
  console.log('Car UUID before opening modal:', carUuid);
  
  if (!carUuid) {
    toasted(false, '', 'Car UUID is missing');
    return;
  }

  openModal('UploadLibreModal', {
    props: {
      draftData: {
        libreFrontPage: libreFrontPage.value,
        libreBackPage: libreBackPage.value,
        carUuid: carUuid
      }
    }
  });
};

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

const submitLibreImages = async () => {
  if (!frontLibre.value || !backLibre.value) {
    toasted(false, '', 'Please upload both front and back libre images');
    return;
  }

  const formData = new FormData();
  formData.append('Front_libre', frontLibre.value);
  formData.append('back_libre', backLibre.value);

  const response = await saveCarLibre(customerId.customers?.carUuid, formData);
  
  if (response.success || response.status === 200) {
    toasted(true, 'Libre images uploaded successfully');
    await fetchLibreImages(); // Refresh the images
    closeModal('UploadLibreModal');
  } else {
    toasted(false, '', response.error || 'Failed to upload libre images');
  }
};

// Add these refs
const carMakes = ref([]);
const carTypes = ref([]);
const carModels = ref([]);
const engineNumbers = ref([]);

// Modified load functions
const loadCarMakes = async () => {
  try {
    const response = await getAllcar();
    if (response.data) {
      carMakes.value = response.data;  // Remove the mapping, use direct values
    }
  } catch (error) {
    console.error('Error fetching car makes:', error);
  }
};

const loadCarTypes = async (carName) => {
  try {
    const response = await getAllcar({ carName });
    if (response.data) {
      carTypes.value = response.data;  // Remove the mapping, use direct values
    }
  } catch (error) {
    console.error('Error fetching car types:', error);
  }
};

const loadCarModels = async (carType) => {
  try {
    const response = await getAllcar({ carType });
    if (response.data) {
      carModels.value = response.data;  // Remove the mapping, use direct values
    }
  } catch (error) {
    console.error('Error fetching car models:', error);
  }
};

const loadEngineNumbers = async (carModel) => {
  try {
    const response = await getAllcar({ carModel });
    console.log('Engine numbers response:', response.data); // Add this log
    if (response.data) {
      engineNumbers.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching engine numbers:', error);
  }
};

// Modified watchers for cascading
watch(() => editedData.carName, (newValue) => {
  if (newValue) {
    loadCarTypes(newValue);
  } else {
    // Reset dependent fields
    editedData.carType = '';
    editedData.carModel = '';
    editedData.engine_No = '';
    carTypes.value = [];
    carModels.value = [];
    engineNumbers.value = [];
  }
});

watch(() => editedData.carType, (newValue) => {
  if (newValue) {
    loadCarModels(newValue);
  } else {
    // Reset dependent fields
    editedData.carModel = '';
    editedData.engine_No = '';
    carModels.value = [];
    engineNumbers.value = [];
  }
});

watch(() => editedData.carModel, async (newValue) => {
  if (newValue) {
    await loadEngineNumbers(newValue);
  } else {
    // Reset dependent fields
    editedData.engine_No = '';
    engineNumbers.value = [];
  }
});

// Load initial data and set existing values
onMounted(async () => {
  await loadCarMakes();
  
  if (editedData.carName) {
    await loadCarTypes(editedData.carName);
    if (editedData.carType) {
      await loadCarModels(editedData.carType);
      if (editedData.carModel) {
        await loadEngineNumbers(editedData.carModel);
      }
    }
  }
});

// Also load data when entering edit mode
watch(() => isEditing.value, async (newValue) => {
  if (newValue) {
    await loadCarMakes();
    
    if (editedData.carName) {
      await loadCarTypes(editedData.carName);
      if (editedData.carType) {
        await loadCarModels(editedData.carType);
        if (editedData.carModel) {
          await loadEngineNumbers(editedData.carModel);
        }
      }
    }
  }
});  </script>
  
  
  <style scoped>  
  /* You can add additional styles here if needed */  
  </style>
