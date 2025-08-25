<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiRequest } from '@/composables/useApiRequest';
import { getAllPremiums } from '../api/premiumApi';
import Button from '@/components/Button.vue';
import icons from '@/utils/icons';
import { openModal, useModal } from "@customizer/modal-x";

const route = useRoute();
const router = useRouter();
const modal = useModal();
const req = useApiRequest();

const premiumDetails = ref(null);
const premiumUuid = route.params.premiumUuid;

// Function to fetch premium details
const fetchPremiumDetails = async () => {
  try {
    const response = await getAllPremiums({ premiumRateUuid: premiumUuid });
    if (response.success && response.data.content.length > 0) {
      premiumDetails.value = response.data.content[0];
    }
  } catch (error) {
    console.error('Error fetching premium details:', error);
  }
};

const openEditModal = () => {
  openModal('EditPremium', {
    props: {
      data: premiumDetails.value
    }
  });

  // Watch for modal changes
  modal.$subscribe((mutation, state) => {
    if (!state.isOpen && state.lastClosed === 'EditPremium') {
      fetchPremiumDetails(); // Refresh the data when modal closes
    }
  });
};

function goBack() {
  router.push({ name: 'premium' });
}

function formatCategory(premium) {
  if (premium.car_type === 'PRIVATE') {
    return premium.privateType || 'N/A';
  } else if (premium.car_type === 'COMMERCIAL') {
    return premium.commercialType || 'N/A';
  }
  return 'N/A';
}

function formatSubCategory(premium) {
  if (premium.car_type === 'COMMERCIAL') {
    return premium.goodsCarryingType || premium.passengerCarryingType || premium.publicServiceType || 'N/A';
  }
  return 'N/A';
}

function formatFinalCategory(premium) {
  if (premium.car_type === 'COMMERCIAL') {
    return premium.ownGoodsType || premium.generalGoodsCaringType || 'N/A';
  }
  return 'N/A';
}

onMounted(async () => {
  await fetchPremiumDetails();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button 
          @click="goBack"
          class="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <i v-html="icons.arrow_back" class="w-5 h-5 text-gray-600"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Premium Rate Details</h1>
          <p class="text-sm text-gray-500">View and manage premium rate information</p>
        </div>
      </div>
      
      <Button 
        v-if="premiumDetails"
        @click="openEditModal" 
        type="primary"
        class="flex items-center gap-2"
      >
        <i v-html="icons.edit" class="w-4 h-4"></i>
        Edit Premium Rate
      </Button>
    </div>

    <!-- Premium Details Card -->
    <div v-if="premiumDetails" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Car Type -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-500">Car Type</label>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': premiumDetails.car_type === 'PRIVATE',
                    'bg-green-100 text-green-800': premiumDetails.car_type === 'COMMERCIAL'
                  }">
              {{ premiumDetails.car_type }}
            </span>
          </div>
        </div>

        <!-- Premium Rate -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-500">Premium Rate</label>
          <div class="text-2xl font-bold text-primary">
            {{ (premiumDetails.rate * 100).toFixed(2) }}%
          </div>
        </div>

        <!-- Created Date -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-500">Created Date</label>
          <div class="text-gray-900">
            {{ premiumDetails.createdAt ? new Date(premiumDetails.createdAt).toLocaleDateString() : 'N/A' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Category Details Card -->
    <div v-if="premiumDetails" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Category Information</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Primary Category -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-500">Primary Category</label>
          <div class="text-gray-900 font-medium">
            {{ formatCategory(premiumDetails) }}
          </div>
        </div>

        <!-- Sub Category -->
        <div v-if="premiumDetails.car_type === 'COMMERCIAL'" class="space-y-2">
          <label class="text-sm font-medium text-gray-500">Sub Category</label>
          <div class="text-gray-900 font-medium">
            {{ formatSubCategory(premiumDetails) }}
          </div>
        </div>

        <!-- Final Category -->
        <div v-if="premiumDetails.car_type === 'COMMERCIAL' && (premiumDetails.ownGoodsType || premiumDetails.generalGoodsCaringType)" class="space-y-2">
          <label class="text-sm font-medium text-gray-500">Final Category</label>
          <div class="text-gray-900 font-medium">
            {{ formatFinalCategory(premiumDetails) }}
          </div>
        </div>
      </div>

      <!-- Additional Details for Commercial Vehicles -->
      <div v-if="premiumDetails.car_type === 'COMMERCIAL'" class="mt-6 pt-6 border-t border-gray-200">
        <h4 class="text-md font-medium text-gray-900 mb-3">Commercial Vehicle Details</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="premiumDetails.goodsCarryingType">
            <span class="text-gray-500">Goods Carrying Type:</span>
            <span class="ml-2 font-medium">{{ premiumDetails.goodsCarryingType }}</span>
          </div>
          <div v-if="premiumDetails.ownGoodsType">
            <span class="text-gray-500">Own Goods Type:</span>
            <span class="ml-2 font-medium">{{ premiumDetails.ownGoodsType }}</span>
          </div>
          <div v-if="premiumDetails.generalGoodsCaringType">
            <span class="text-gray-500">General Goods Type:</span>
            <span class="ml-2 font-medium">{{ premiumDetails.generalGoodsCaringType }}</span>
          </div>
          <div v-if="premiumDetails.passengerCarryingType">
            <span class="text-gray-500">Passenger Carrying Type:</span>
            <span class="ml-2 font-medium">{{ premiumDetails.passengerCarryingType }}</span>
          </div>
          <div v-if="premiumDetails.publicServiceType">
            <span class="text-gray-500">Public Service Type:</span>
            <span class="ml-2 font-medium">{{ premiumDetails.publicServiceType }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="req.pending.value" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-if="!premiumDetails && !req.pending.value" class="text-center py-12">
      <div class="text-gray-500">
        <i v-html="icons.error" class="w-12 h-12 mx-auto mb-4"></i>
        <p>Premium rate not found</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>