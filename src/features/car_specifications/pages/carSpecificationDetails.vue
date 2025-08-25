<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiRequest } from '@/composables/useApiRequest';
import { getCarSpecificationById } from '../api/carSpecificationApi';
import Button from '@/components/Button.vue';
import icons from '@/utils/icons';

const route = useRoute();
const router = useRouter();
const req = useApiRequest();

const carSpec = ref(null);
const carSpecUuid = route.params.car_specificationsUuid;

onMounted(() => {
  req.send(
    () => getCarSpecificationById(carSpecUuid),
    (res) => {
      if (res.success) {
        carSpec.value = res.data;
      }
    }
  );
});

function goBack() {
  router.push({ name: 'car_specifications' });
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <Button @click="goBack" type="secondary" size="sm" class="flex items-center gap-2">
          <i v-html="icons.arrowLeft" class="w-4 h-4"></i>
          Back
        </Button>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-100 rounded-lg">
          <i v-html="icons.car" class="w-8 h-8 text-blue-600"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ carSpec?.carName || 'Loading...' }}</h1>
          <p class="text-gray-600">Car Specification Details</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="req.pending.value" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="req.error.value" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">Error loading car specification details</p>
    </div>

    <!-- Car Specification Details -->
    <div v-else-if="carSpec" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Car Name</label>
            <p class="text-gray-900 font-medium">{{ carSpec.carName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Car Type</label>
            <p class="text-gray-900 font-medium">{{ carSpec.carType }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Car Model</label>
            <p class="text-gray-900 font-medium">{{ carSpec.carModel }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Engine</label>
            <p class="text-gray-900 font-medium">{{ carSpec.engine }}</p>
          </div>
        </div>
      </div>

      <!-- Price Specifications -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Price Specifications</h2>
        
        <div v-if="carSpec.priceSpecificationRequests?.length" class="space-y-4">
          <div
            v-for="(spec, index) in carSpec.priceSpecificationRequests"
            :key="index"
            class="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <h3 class="font-medium text-gray-700 mb-3">Price Range {{ index + 1 }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">From Make Year</label>
                <p class="text-gray-900 font-medium">{{ spec.fromMakeYear }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">To Make Year</label>
                <p class="text-gray-900 font-medium">{{ spec.toMakeYear }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Min Market Value</label>
                <p class="text-gray-900 font-medium">${{ spec.minMarketValue?.toLocaleString() || 0 }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Max Market Value</label>
                <p class="text-gray-900 font-medium">${{ spec.maxMarketValue?.toLocaleString() || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500">No price specifications available</p>
        </div>
      </div>
    </div>
  </div>
</template>