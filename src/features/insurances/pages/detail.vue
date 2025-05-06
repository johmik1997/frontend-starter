<template>
  <div class="container mx-auto p-4">
    <!-- Upper Grid - Insurance Details -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-semibold">Insurance Details</h2>
        <Button 
          @click="openEditModal" 
          type="primary"
          class="flex items-center gap-2"
        >
          <i class="fas fa-edit"></i>
          Edit Insurance
        </Button>
      </div>
      <div v-if="insuranceDetails" class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 rounded-lg overflow-hidden shadow-md">
            <img 
              :src="`data:image/jpeg;base64,${insuranceDetails.profile}`" 
              alt="Insurance Logo"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="flex flex-col">
            <h3 class="text-2xl font-semibold text-gray-800">
              {{ insuranceDetails.insuranceName }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">Insurance Provider</p>
          </div>
        </div>
        <div class="text-right pr-4">
          <p class="font-medium text-gray-600">Registration Date</p>
          <p class="text-gray-800">{{ insuranceDetails.registrationDate }}</p>
        </div>
      </div>
    
  </div>
    <!-- Lower Grid - Rates Table -->
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-xl font-semibold mb-4">Insurance Rates</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">Car Type</th>
              <th class="px-4 py-2 text-left">Type Details</th>
              <th class="px-4 py-2 text-left">Premium Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rate, index) in rates" :key="index" class="border-b">
              <td class="px-4 py-2">{{ rate.carType }}</td>
              <td class="px-4 py-2">
                {{ getTypeDetails(rate) }}
              </td>
              <td class="px-4 py-2">{{ rate.premiumRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCustomersbyId, getRate } from '../api/insuranceApi';
import { openModal, useModal } from "@customizer/modal-x";
import Button from '@/components/Button.vue';

const route = useRoute();
const modal = useModal();
const insuranceUuid = route.params.insuranceUuid;
const insuranceDetails = ref(null);
const rates = ref([]);

// Function to fetch insurance details
const fetchInsuranceDetails = async () => {
  try {
    const detailsResponse = await getCustomersbyId(insuranceUuid);
    insuranceDetails.value = detailsResponse.data;
  } catch (error) {
    console.error('Error fetching insurance details:', error);
  }
};

const openEditModal = () => {
  console.log('Opening edit modal with data:', insuranceDetails.value);
  openModal('editInsurance', {
    data: {
      insuranceUuid: insuranceDetails.value.insuranceUuid,
      insuranceName: insuranceDetails.value.insuranceName,
      accountNumber: insuranceDetails.value.accountNumber || '',
      image: insuranceDetails.value.profile
    }
  });

  // Watch for modal changes
  modal.$subscribe((mutation, state) => {
    if (!state.isOpen && state.lastClosed === 'editInsurance') {
      fetchInsuranceDetails(); // Refresh the data when modal closes
    }
  });
};

const getTypeDetails = (rate) => {
  if (rate.carType === 'PRIVATE') {
    return rate.privateType?.replace(/_/g, ' ');
  } else if (rate.carType === 'COMMERCIAL') {
    const details = [];
    if (rate.commercialType) details.push(rate.commercialType.replace(/_/g, ' '));
    if (rate.goodsCarryingType) details.push(rate.goodsCarryingType.replace(/_/g, ' '));
    if (rate.ownGoodsType) details.push(rate.ownGoodsType.replace(/_/g, ' '));
    if (rate.generalGoodsCaringType) details.push(rate.generalGoodsCaringType.replace(/_/g, ' '));
    if (rate.passengerCarryingType) details.push(rate.passengerCarryingType.replace(/_/g, ' '));
    if (rate.publicServiceType) details.push(rate.publicServiceType.replace(/_/g, ' '));
    return details.join(' - ');
  }
  return '';
};

onMounted(async () => {
  await fetchInsuranceDetails();
  
  // Fetch rates
  try {
    const ratesResponse = await getRate(insuranceUuid);
    rates.value = ratesResponse.data.content;
  } catch (error) {
    console.error('Error fetching rates:', error);
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: #f3f4f6;
  font-weight: 600;
}

tr:hover {
  background-color: #f9fafb;
}
</style>
