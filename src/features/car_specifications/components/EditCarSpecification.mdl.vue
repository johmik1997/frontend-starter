<script setup>
import { ref, onMounted } from 'vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { updateCarSpecification } from '../api/carSpecificationApi';
import { useCarSpecification } from '../store/carSpecificationStore';
import { toasted } from '@/utils/utils';
import { closeModal } from '@customizer/modal-x';
import ModalParent from '@/components/new_form_builder/ModalParent.vue';
import NewFormParent from '@/components/NewFormParent.vue';
import Form from '@/components/new_form_builder/Form.vue';
import { Input } from '@/components/new_form_elements';
import Button from '@/components/Button.vue';
import icons from '@/utils/icons';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Add comprehensive logging
console.log('=== EDIT MODAL DEBUG ===');
console.log('Raw props:', props);
console.log('props.data:', props.data);
console.log('props.data.props:', props.data.props);
console.log('Actual car data:', props.data.props?.data);
console.log('========================');

const carSpecStore = useCarSpecification();
const req = useApiRequest();

// Access the actual data from the nested structure
const actualData = props.data.props?.data || props.data;

const data = ref({
  carName: '',
  carType: '',
  carModel: '',
  engine: '',
  priceSpecificationRequests: [
    {
      fromMakeYear: '',
      toMakeYear: '',
      minMarketValue: 0,
      maxMarketValue: 0
    }
  ]
});

onMounted(() => {
  console.log('=== ONMOUNTED DEBUG ===');
  const actualData = props.data.props?.data || props.data;
  console.log('Actual data in onMounted:', actualData);
  console.log('priceSpecificationResponses:', actualData?.priceSpecificationResponses);
  
  // Populate form with existing data
  data.value = {
    carName: actualData?.carName || '',
    carType: actualData?.carType || '',
    carModel: actualData?.carModel || '',
    engine: actualData?.engine || '',
    priceSpecificationRequests: actualData?.priceSpecificationResponses?.length 
      ? actualData.priceSpecificationResponses 
      : [{
          fromMakeYear: '',
          toMakeYear: '',
          minMarketValue: 0,
          maxMarketValue: 0
        }]
  };
  
  console.log('data.value after assignment:', data.value);
  console.log('=======================');
});

function addPriceSpecification() {
  data.value.priceSpecificationRequests.push({
    fromMakeYear: '',
    toMakeYear: '',
    minMarketValue: 0,
    maxMarketValue: 0
  });
}

function removePriceSpecification(index) {
  if (data.value.priceSpecificationRequests.length > 1) {
    data.value.priceSpecificationRequests.splice(index, 1);
  }
}

function submitForm() {
  const actualData = props.data.props?.data || props.data;
  
  const formData = {
    ...data.value,
    priceSpecificationRequests: data.value.priceSpecificationRequests.map(spec => ({
      ...spec,
      minMarketValue: parseFloat(spec.minMarketValue) || 0,
      maxMarketValue: parseFloat(spec.maxMarketValue) || 0
    }))
  };

  req.send(
    () => updateCarSpecification(actualData.id || actualData.uuid || actualData.carUuid, formData),
    (res) => {
      if (res.success) {
        carSpecStore.update(actualData.id || actualData.uuid || actualData.carUuid, res.data);
        toasted(true, 'Car Specification Updated Successfully!');
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
    <NewFormParent class="px-6 py-4 max-w-4xl" size="lg">
      <template #title>
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <i v-html="icons.car" class="text-blue-600 w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Edit Car Specification</h2>
            <p class="text-sm text-gray-500">Update car specification with pricing details</p>
          </div>
        </div>
      </template>

      <template #default>
        <Form id="car-spec-edit-form" class="space-y-6">
          <!-- Basic Car Information -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                v-model="data.carName"
                name="carName"
                validation="required"
                label="Car Name"
                :attributes="{ placeholder: 'Enter car name' }"
              />
              
              <Input
                v-model="data.carType"
                name="carType"
                validation="required"
                label="Car Type"
                :attributes="{ placeholder: 'Enter car type' }"
              />
              
              <Input
                v-model="data.carModel"
                name="carModel"
                validation="required"
                label="Car Model"
                :attributes="{ placeholder: 'Enter car model' }"
              />
              
              <Input
                v-model="data.engine"
                name="engine"
                validation="required"
                label="Engine"
                :attributes="{ placeholder: 'Enter engine specification' }"
              />
            </div>
          </div>

          <!-- Price Specifications -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Price Specifications</h3>
              <Button
                @click.prevent="addPriceSpecification"
                type="secondary"
                size="sm"
                class="flex items-center gap-2"
                :attributes="{ type: 'button' }"
              >
                <i v-html="icons.plus" class="w-4 h-4"></i>
                Add Price Range
              </Button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(spec, index) in data.priceSpecificationRequests"
                :key="index"
                class="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-medium text-gray-700">Price Range {{ index + 1 }}</h4>
                  <Button
                    v-if="data.priceSpecificationRequests.length > 1"
                    @click.prevent="removePriceSpecification(index)"
                    type="danger"
                    size="sm"
                    class="flex items-center gap-1"
                    :attributes="{ type: 'button' }"
                  >
                    <i v-html="icons.trash" class="w-4 h-4"></i>
                  </Button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    v-model="spec.fromMakeYear"
                    :name="`fromMakeYear_${index}`"
                    validation="required"
                    label="From Make Year"
                    :attributes="{ placeholder: 'e.g., 2020' }"
                  />
                  
                  <Input
                    v-model="spec.toMakeYear"
                    :name="`toMakeYear_${index}`"
                    validation="required"
                    label="To Make Year"
                    :attributes="{ placeholder: 'e.g., 2024' }"
                  />
                  
                  <Input
                    v-model="spec.minMarketValue"
                    :name="`minMarketValue_${index}`"
                    validation="required|numeric"
                    label="Min Market Value"
                    type="number"
                    :attributes="{ placeholder: '0', min: '0', step: '0.01' }"
                  />
                  
                  <Input
                    v-model="spec.maxMarketValue"
                    :name="`maxMarketValue_${index}`"
                    validation="required|numeric"
                    label="Max Market Value"
                    type="number"
                    :attributes="{ placeholder: '0', min: '0', step: '0.01' }"
                  />
                </div>
              </div>
            </div>
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
          >
            <i v-html="icons.save" class="w-4 h-4"></i>
            Update Car Specification
          </Button>
        </div>
      </template>
    </NewFormParent>
  </ModalParent>
</template>







