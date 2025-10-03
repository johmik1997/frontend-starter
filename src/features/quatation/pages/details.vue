<template>
  <div class="mx-auto p-3 sm:p-6 bg-white min-h-screen">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row items-start sm:items-center mb-6 pb-5 ml-2 sm:ml-5 border-b border-gray-200 justify-between gap-3">
      <div class="flex items-center gap-3">
        <i class="pl-2 text-blue-600" v-html="icons.pro" />
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">
          {{ customerId.customers?.clientFirstName }} 
          {{ customerId.customers?.clientFatherName }} 
          {{ customerId.customers?.clientGrandFatherName }}
        </h1>
      </div>
      <p class="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
        Suzuki Dezire 2024 - Code 3
      </p>
    </header>

    <!-- Main Content -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 flex flex-col lg:flex-row w-full h-full gap-6 rounded-xl">
      <!-- Client Info Section -->
      <section class="mb-4 p-5 bg-white rounded-xl shadow-sm w-full lg:w-1/3 border border-gray-100">
        <div class="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i class="text-blue-600" v-html="icons.user"></i>
            Client Info
          </h2>
          <button 
            v-if="!isEditing && customerId.customers?.quotationStatus == 'PENDING'" 
            @click="toggleEdit"
            class="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
          >
            <i v-html="icons.pencil" />
          </button>
          <button 
            v-if="isEditing" 
            @click="cancelEdit" 
            class="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
          >
            <i v-html="icons.close" />
          </button>
        </div>

        <!-- View Mode -->
        <div v-if="!isEditing" class="space-y-4">
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="text-sm font-medium text-gray-600">First Name</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.clientFirstName }}</div>

            <div class="text-sm font-medium text-gray-600">Last Name</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.clientFatherName }}</div>

            <div class="text-sm font-medium text-gray-600">Email</div>
            <div class="text-sm text-gray-800 font-semibold break-all">{{ customerId.customers?.clientEmail }}</div>

            <div class="text-sm font-medium text-gray-600">Phone Number</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.clientPhoneNumber }}</div>
          </div>

          <h2 class="text-lg font-bold mb-3 pt-6 pb-2 border-t border-gray-100 flex items-center gap-2">
            <i class="text-blue-600" v-html="icons.car"></i>
            Vehicle details
          </h2>
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="text-sm font-medium text-gray-600">Vehicle Make</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.carName }}</div>

            <div class="text-sm font-medium text-gray-600">Car Type</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.carType }}</div>

            <div class="text-sm font-medium text-gray-600">Vehicle Model</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.carModel }}</div>

            <div class="text-sm font-medium text-gray-600">Engine Number</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.engine_No }}</div>

            <div class="text-sm font-medium text-gray-600">Vehicle Type</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.category1 }}</div>

            <div class="text-sm font-medium text-gray-600">Category</div>
            <div class="text-sm text-gray-800 font-semibold">{{ customerId.customers?.category2 || '-' }}</div>

            <div v-if="customerId.customers?.category3" class="text-sm font-medium text-gray-600">Sub Category</div>
            <div v-if="customerId.customers?.category3" class="text-sm text-gray-800 font-semibold">
              {{ customerId.customers?.category3 }}
            </div>

            <div v-if="customerId.customers?.category4" class="text-sm font-medium text-gray-600">Final Category</div>
            <div v-if="customerId.customers?.category4" class="text-sm text-gray-800 font-semibold">
              {{ customerId.customers?.category4 }}
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-if="isEditing" class="space-y-5">
          <!-- Vehicle Make -->
          <Select 
            v-model="editedData.carName" 
            label="Vehicle Make" 
            :options="carMakes" 
            :attributes="{
              placeholder: 'Select Vehicle Make',
              class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }"
          >
            <template #label>
              <span class="flex items-center gap-1">
                Vehicle Make <span class="text-red-500">*</span>
              </span>
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
              class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }"
          >
            <template #label>
              <span class="flex items-center gap-1">
                Car Type <span class="text-red-500">*</span>
              </span>
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
              class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }"
          >
            <template #label>
              <span class="flex items-center gap-1">
                Car Model <span class="text-red-500">*</span>
              </span>
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
              class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }"
          >
            <template #label>
              <span class="flex items-center gap-1">
                Engine Number <span class="text-red-500">*</span>
              </span>
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
              class: 'w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }"
          >
            <template #label>
              <span class="flex items-center gap-1">
                Vehicle Year <span class="text-red-500">*</span>
              </span>
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
              class: 'w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }"
          >
            <template #label>
              <span class="flex items-center gap-1">
                Plate Code <span class="text-red-500">*</span>
              </span>
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
              class: 'w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }"
          >
            <template #label>
              <span class="flex items-center gap-1">
                Buying Price <span class="text-red-500">*</span>
              </span>
            </template>
          </Input>

          <!-- Category Selection Section -->
          <div class="space-y-4 pt-2">
            <!-- Main Category -->
            <Select 
              v-model="selectedMainCategory" 
              label="Vehicle Type" 
              :options="getMainCategories()" 
              required
              :attributes="{ 
                placeholder: 'Select Vehicle Type', 
                class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }"
            >
              <template #label>
                <span class="flex items-center gap-1">
                  Vehicle Type <span class="text-red-500">*</span>
                </span>
              </template>
            </Select>

            <!-- Sub Category -->
            <Select 
              v-if="getSubCategories().length" 
              v-model="selectedSubCategory" 
              label="Category"
              :options="getSubCategories()" 
              required
              :attributes="{ 
                placeholder: 'Select Category', 
                class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }"
            >
              <template #label>
                <span class="flex items-center gap-1">
                  Category <span class="text-red-500">*</span>
                </span>
              </template>
            </Select>

            <!-- Sub Sub Category -->
            <Select 
              v-if="getSubSubCategories().length" 
              v-model="selectedSubSubCategory" 
              label="Sub Category"
              :options="getSubSubCategories()" 
              required
              :attributes="{ 
                placeholder: 'Select Sub Category', 
                class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }"
            >
              <template #label>
                <span class="flex items-center gap-1">
                  Sub Category <span class="text-red-500">*</span>
                </span>
              </template>
            </Select>

            <!-- Final Category -->
            <Select 
              v-if="getFinalCategories().length" 
              v-model="selectedFinalCategory" 
              label="Final Category"
              :options="getFinalCategories()" 
              required
              :attributes="{ 
                placeholder: 'Select Final Category', 
                class: 'w-full mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }"
            >
              <template #label>
                <span class="flex items-center gap-1">
                  Final Category <span class="text-red-500">*</span>
                </span>
              </template>
            </Select>
          </div>

          <div class="flex border-t-2 border-gray-100 pt-6">
            <Button 
              v-if="customerId.customers?.quotationStatus == 'PENDING'"
              class="flex justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-center w-full items-center text-white rounded-lg text-sm font-medium py-3 transition-all duration-200 shadow-md hover:shadow-lg"
              @click="saveChanges" 
              :pending="isSubmit"
            >
              <i v-if="!isSubmit" class="mr-2" v-html="icons.save"></i>
              {{ isSubmit ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>
        </div>
      </section>

      <!-- Right Section Container -->
      <section class="w-full lg:w-3/5 flex flex-col gap-6">
        <!-- Quotation Details Section -->
        <section class="w-full p-5 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-bold mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <i class="text-green-600" v-html="icons.document"></i>
            Quotation Details
          </h2>
          <div class="flex flex-col gap-5 pt-2">
            <!-- Quotation Amount -->
            <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <span class="text-sm font-medium text-gray-600">Quotation Amount</span>
              <div v-if="!isEditing1">
                <Button 
                  class="text-sm bg-blue-50 hover:bg-blue-100 items-center text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200 border border-blue-200"
                  @click="toggleEdit1"
                >
                  ETB {{ Number(quotation.amount).toFixed(2) }} 
                  <i 
                    v-if="!isEditing && customerId.customers?.quotationStatus == 'PENDING'"
                    class="pl-2" 
                    v-html="icons.pencil" 
                  />
                </Button>
              </div>
              <div v-if="isEditing1" class="flex items-center border-2 border-blue-300 rounded-lg bg-white">
                <p class="p-3 text-sm font-medium text-gray-600">ETB</p>
                <input 
                  v-model="editedAmount1" 
                  type="number" 
                  class="w-24 px-2 text-sm border-none focus:outline-none focus:ring-0" 
                />
                <button 
                  class="text-sm bg-green-600 hover:bg-green-700 items-center p-2 m-1 text-white rounded-md transition-colors duration-200 font-medium"
                  @click="saveEdit"
                >
                  Update
                </button>
              </div>
            </div>

            <!-- Deposit -->
            <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <span class="text-sm font-medium text-gray-600">Deposit</span>
              <div class="text-sm bg-green-50 items-center text-green-700 font-medium px-4 py-2 rounded-lg border border-green-200">
                ETB {{ Number(quotation.deposit).toFixed(2) }}
              </div>
            </div>

            <!-- Monthly Repayment -->
            <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <span class="text-sm font-medium text-gray-600">Monthly Repayment</span>
              <div class="text-sm bg-purple-50 items-center text-purple-700 font-medium px-4 py-2 rounded-lg border border-purple-200">
                ETB {{ Number(quotation.premium).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="flex border-t border-gray-100 pt-6">
            <Button 
              v-if="customerId.customers?.quotationStatus == 'PENDING'"
              class="flex justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-center w-full items-center text-white py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              @click="sendFinalQuotation" 
              :pending="isSubmitting"
            >
              <i v-if="!isSubmitting" class="mr-2" v-html="icons.send"></i>
              {{ isSubmitting ? 'Sending...' : 'Send Final Quote to Client' }}
            </Button>
          </div>
        </section>

        <!-- Libre Section -->
        <section class="w-full p-5 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold mb-4 pb-3 border-b border-gray-100 flex justify-between items-center">
            <span class="flex items-center gap-2">
              <i class="text-orange-600" v-html="icons.image"></i>
              Libre Documents
            </span>
            <button
              v-if="libreFrontPage && libreBackPage && libreFrontPage !== 'null' && libreBackPage !== 'null' && customerId.customers?.quotationStatus == 'PENDING'"
              @click="openUploadModal" 
              class="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <i v-html="icons.upload"></i>
              Update Images
            </button>
          </h2>
          <div class="flex flex-col">
            <div class="flex flex-col sm:flex-row px-2 gap-6 pt-2">
              <!-- Front Page -->
              <div class="relative w-full sm:w-1/2">
                <div 
                  v-if="!libreFrontPage || libreFrontPage === 'null'"
                  class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 h-56 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <i class="text-gray-400 text-4xl mb-4" v-html="icons.image"></i>
                  <div v-if="customerId.customers?.quotationStatus == 'PENDING'" class="text-gray-500 text-center mb-4 font-medium">
                    No front page image
                  </div>
                  <div v-else class="text-gray-500 text-center mb-4">Loading...</div>
                  <button 
                    @click="openUploadModal" 
                    v-if="customerId.customers?.quotationStatus == 'PENDING'"
                    class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Upload Libre Images
                  </button>
                </div>
                <div v-else class="flex flex-col gap-3">
                  <div class="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img :src="libreFrontPage" class="w-full h-48 object-cover" />
                  </div>
                  <button 
                    @click="viewImage('Front Page', libreFrontPage)"
                    class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    View Front Page
                  </button>
                </div>
              </div>

              <!-- Back Page -->
              <div class="relative w-full sm:w-1/2">
                <div 
                  v-if="!libreBackPage || libreBackPage === 'null'"
                  class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 h-56 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <i class="text-gray-400 text-4xl mb-4" v-html="icons.image"></i>
                  <div v-if="customerId.customers?.quotationStatus == 'PENDING'" class="text-gray-500 text-center mb-4 font-medium">
                    No back page image
                  </div>
                  <div v-else class="text-gray-500 text-center mb-4">Loading...</div>
                  <button 
                    v-if="customerId.customers?.quotationStatus == 'PENDING'" 
                    @click="openUploadModal"
                    class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Upload Libre Images
                  </button>
                </div>
                <div v-else class="flex flex-col gap-3">
                  <div class="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img :src="libreBackPage" class="w-full h-48 object-cover" />
                  </div>
                  <button 
                    @click="viewImage('Back Page', libreBackPage)"
                    class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    View Back Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>

    <!-- Upload Modal Template -->
    <template>
      <Modal name="UploadLibreModal">
        <div class="p-6 max-w-md mx-auto">
          <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <i class="text-blue-600" v-html="icons.upload"></i>
            {{ libreFrontPage && libreBackPage ? 'Update' : 'Upload' }} Libre Images
          </h2>

          <!-- Front Libre Upload -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Front Libre</label>
            <div class="flex items-center justify-center w-full">
              <label
                class="w-full flex flex-col items-center px-6 py-8 bg-white rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
              >
                <i class="text-gray-400 text-2xl mb-2" v-html="icons.upload"></i>
                <span class="text-sm text-gray-500 font-medium">
                  {{ frontLibrePreview ? 'Change Front Page' : 'Click to upload Front Page' }}
                </span>
                <input type="file" class="hidden" @change="handleFrontLibreUpload" accept="image/*" />
              </label>
            </div>
            <div v-if="frontLibrePreview" class="mt-3">
              <p class="text-sm text-gray-600 mb-2">Preview:</p>
              <img :src="frontLibrePreview" class="h-32 object-contain border rounded-lg" />
            </div>
          </div>

          <!-- Back Libre Upload -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Back Libre</label>
            <div class="flex items-center justify-center w-full">
              <label
                class="w-full flex flex-col items-center px-6 py-8 bg-white rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
              >
                <i class="text-gray-400 text-2xl mb-2" v-html="icons.upload"></i>
                <span class="text-sm text-gray-500 font-medium">
                  {{ backLibrePreview ? 'Change Back Page' : 'Click to upload Back Page' }}
                </span>
                <input type="file" class="hidden" @change="handleBackLibreUpload" accept="image/*" />
              </label>
            </div>
            <div v-if="backLibrePreview" class="mt-3">
              <p class="text-sm text-gray-600 mb-2">Preview:</p>
              <img :src="backLibrePreview" class="h-32 object-contain border rounded-lg" />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              @click="closeModal('UploadLibreModal')"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              @click="submitLibreImages" 
              class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!frontLibre || !backLibre"
            >
              {{ libreFrontPage && libreBackPage ? 'Update' : 'Upload' }} Images
            </button>
          </div>
        </div>
      </Modal>
    </template>
  </div>
</template>

<script setup>
import { usePaginations } from '@/composables/usePaginationTemp.js';
import { removeUndefined, toasted } from '@/utils/utils';
import { openModal, closeModal } from "@customizer/modal-x";

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

// Track API calls to prevent race conditions
const hasFetchedLibre = ref(false);
const isCustomerDataLoaded = ref(false);
const currentCarUuid = ref(null); // Track the current car UUID to prevent stale data
const pendingLibreRequest = ref(null); // Track the current request to cancel if needed

const viewImage = (title, imageUrl) => {
  openModal('ImageViewer', {
    title,
    imageUrl
  });
};

const fetchLibreImages = async () => {
  // Only fetch if we have valid customer data and a car UUID
  if (!isCustomerDataLoaded.value || !currentCarUuid.value) {
    console.log('Skipping libre fetch - customer data not loaded or no car UUID');
    return;
  }

  // If we already fetched for this car UUID, don't fetch again
  if (hasFetchedLibre.value && currentCarUuid.value === customerId.customers?.carUuid) {
    console.log('Libre images already fetched for this car UUID, skipping...');
    return;
  }

  // Cancel any pending request
  if (pendingLibreRequest.value) {
    console.log('Cancelling previous libre request');
    // If using axios, you can cancel with CancelToken
    // For simplicity, we'll just track and ignore the response
  }

  try {
    console.log('Fetching libre images for car UUID:', currentCarUuid.value);
    
    // Mark that we're making a request
    const requestCarUuid = currentCarUuid.value; // Capture the current UUID
    
    const response = await getLibreImages(requestCarUuid);
    console.log('API Response for car UUID:', requestCarUuid, response);

    // IMPORTANT: Check if this response is still relevant (car UUID hasn't changed)
    if (requestCarUuid !== currentCarUuid.value) {
      console.log('Received stale libre response, ignoring...');
      return;
    }

    if (response.success) {
      // Only update if we have valid image data
      if (response.data.libreFrontPage && response.data.libreFrontPage !== 'null') {
        libreFrontPage.value = `data:image/jpeg;base64,${response.data.libreFrontPage}`;
      } else {
        libreFrontPage.value = null;
      }
      
      if (response.data.libreBackPage && response.data.libreBackPage !== 'null') {
        libreBackPage.value = `data:image/jpeg;base64,${response.data.libreBackPage}`;
      } else {
        libreBackPage.value = null;
      }
      
      // Mark as fetched for this car UUID
      hasFetchedLibre.value = true;
      console.log('Images loaded successfully for car UUID:', requestCarUuid);
    } else {
      // If API call failed, set to null
      libreFrontPage.value = null;
      libreBackPage.value = null;
      console.log('Failed to load libre images');
    }
  } catch (error) {
    console.error('Error fetching libre images:', error);
    // Only update if this error is for the current car UUID
    if (currentCarUuid.value === customerId.customers?.carUuid) {
      libreFrontPage.value = null;
      libreBackPage.value = null;
    }
  } finally {
    pendingLibreRequest.value = null;
  }
};

const route = useRoute()
const userUuid = route.params?.quotationUuid

// Initialize pagination and fetch customer data
const pagination = usePaginations({
  store: customerId,
  cb: async (id) => {
    try {
      console.log('Fetching customer data...');
      const response = await getCustomersbyId(userUuid);
      
      if (response && response.data) {
        // Update current car UUID with the new one
        const newCarUuid = response.data.carUuid;
        
        // Reset libre fetch flag if car UUID changed
        if (newCarUuid !== currentCarUuid.value) {
          console.log('Car UUID changed from', currentCarUuid.value, 'to', newCarUuid);
          hasFetchedLibre.value = false;
          currentCarUuid.value = newCarUuid;
          
          // Clear previous images while loading new ones
          libreFrontPage.value = null;
          libreBackPage.value = null;
        }
        
        // Mark customer data as loaded
        isCustomerDataLoaded.value = true;
        
        // Now fetch libre images with the new carUuid
        nextTick(() => {
          fetchLibreImages();
        });
      }
      
      return response;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      isCustomerDataLoaded.value = false;
    }
  },
});

// Watch for customer data changes (as a backup)
watch(
  () => customerId.customers,
  (newValue) => {
    if (newValue && newValue.carUuid) {
      console.log('Customer data updated with car UUID:', newValue.carUuid);
      
      const newCarUuid = newValue.carUuid;
      
      // Only reset if car UUID actually changed
      if (newCarUuid !== currentCarUuid.value) {
        hasFetchedLibre.value = false;
        currentCarUuid.value = newCarUuid;
        
        // Clear images while loading new ones
        libreFrontPage.value = null;
        libreBackPage.value = null;
      }
      
      isCustomerDataLoaded.value = true;
      
      // If we haven't fetched libre images for this car UUID, fetch them now
      if (!hasFetchedLibre.value) {
        nextTick(() => {
          fetchLibreImages();
        });
      }
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  console.log('Component mounted');
  // Reset flags when component mounts
  hasFetchedLibre.value = false;
  isCustomerDataLoaded.value = false;
  currentCarUuid.value = null;
});

// ... rest of your existing code (customer data, mobile data, policy data, etc.)

const calculateMonthlyPremium = (quotationAmount) => {
  return quotationAmount / 12;
};

const calculateDeposit = (quotationAmount) => {
  return quotationAmount * 0.22;
};

// Quotation data
const quotation = ref({
  amount: customerId.customers?.quotationAmount || 0,
  deposit: calculateDeposit(customerId.customers?.quotationAmount || 0),
  premium: calculateMonthlyPremium(customerId.customers?.quotationAmount || 0),
});

const props = defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
  onSubmit: {
    type: Function,
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

// Editing states and functions remain the same...
const isEditing1 = ref(false);
const isEditing2 = ref(false);
const isEditing3 = ref(false);
const editedAmount1 = ref(quotation.value.amount);
const editedAmount2 = ref(quotation.value.deposit);
const editedAmount3 = ref(quotation.value.premium);
const isSubmitting = ref(false);
const isSubmit = ref(false);

const toggleEdit1 = () => {
  if (customerId.customers?.quotationStatus === 'PENDING') {
    editedAmount1.value = quotation.value.amount;
    isEditing1.value = true;
    isEditing2.value = false;
    isEditing3.value = false;
  }
};

const saveEdit = async () => {
  if (isEditing1.value) {
    const newAmount = parseFloat(editedAmount1.value);
    quotation.value.amount = newAmount;
    quotation.value.deposit = calculateDeposit(newAmount);
    quotation.value.premium = calculateMonthlyPremium(newAmount);
    isEditing1.value = false;
    editedAmount1.value = '';
  }
};

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
  engine_No: '',
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
  if (typeof category === 'string') return [];
  return Object.keys(category || {});
};

const getFinalCategories = () => {
  if (!selectedMainCategory.value || !selectedSubCategory.value || !selectedSubSubCategory.value) return [];
  const category = categoryStructure[selectedMainCategory.value]?.[selectedSubCategory.value]?.[selectedSubSubCategory.value];
  if (typeof category === 'string') return [];
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

  try {
    const response = await saveCarLibre(customerId.customers?.carUuid, formData);

    if (response.success || response.status === 200) {
      toasted(true, 'Libre images uploaded successfully');
      // Reset flags to force refetch with new images
      hasFetchedLibre.value = false;
      await fetchLibreImages();
      closeModal('UploadLibreModal');
      
      // Reset file previews
      frontLibrePreview.value = null;
      backLibrePreview.value = null;
      frontLibre.value = null;
      backLibre.value = null;
    } else {
      toasted(false, '', response.error || 'Failed to upload libre images');
    }
  } catch (error) {
    console.error('Error uploading libre images:', error);
    toasted(false, '', 'Failed to upload libre images');
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
    }
  } catch (error) {
    console.error('Error fetching car models:', error);
  }
};

const loadEngineNumbers = async (carModel) => {
  try {
    const response = await getAllcar({ carModel });
    console.log('Engine numbers response:', response.data);
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
});
</script>

<style scoped>
/* Custom styles for better appearance */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.shadow-custom {
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}
</style>