<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { editPremiumRate } from '../api/premiumApi';
import { usePremium } from '../store/premiumStore';
import { toasted } from '@/utils/utils';
import { closeModal } from '@customizer/modal-x';
import ModalParent from '@/components/new_form_builder/ModalParent.vue';
import NewFormParent from '@/components/NewFormParent.vue';
import Form from '@/components/new_form_builder/Form.vue';
import { Input, Select } from '@/components/new_form_elements';
import Button from '@/components/Button.vue';
import icons from '@/utils/icons';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const premiumStore = usePremium();
const req = useApiRequest();

// Access the actual data from the nested structure
const actualData = props.data.props?.data || props.data;

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

// Category options
const carTypes = ['PRIVATE', 'COMMERCIAL'];

const privateTypes = ['PRIVATE_VEHICLES'];

const commercialTypes = [
  'GOODS_CARRYING_VEHICLES',
  'PASSENGER_CARRYING_VEHICLES', 
  'PUBLIC_SERVICE_VEHICLES'
];

const goodsCarryingTypes = [
  'OWN_GOODS_VEHICLES',
  'GENERAL_GOODS_CARRYING_VEHICLES'
];

const ownGoodsTypes = [
  'LIGHT_GOODS_VEHICLES',
  'MEDIUM_GOODS_VEHICLES',
  'HEAVY_GOODS_VEHICLES'
];

const generalGoodsTypes = [
  'LIGHT_GENERAL_GOODS',
  'MEDIUM_GENERAL_GOODS', 
  'HEAVY_GENERAL_GOODS'
];

const passengerCarryingTypes = [
  'TAXI',
  'MINIBUS',
  'BUS'
];

const publicServiceTypes = [
  'AMBULANCE',
  'FIRE_TRUCK',
  'POLICE_VEHICLE'
];

// Computed properties for conditional rendering
const showPrivateOptions = computed(() => premiumData.value.car_type === 'PRIVATE');
const showCommercialOptions = computed(() => premiumData.value.car_type === 'COMMERCIAL');
const showGoodsCarryingOptions = computed(() => premiumData.value.commercialType === 'GOODS_CARRYING_VEHICLES');
const showOwnGoodsOptions = computed(() => premiumData.value.goodsCarryingType === 'OWN_GOODS_VEHICLES');
const showGeneralGoodsOptions = computed(() => premiumData.value.goodsCarryingType === 'GENERAL_GOODS_CARRYING_VEHICLES');
const showPassengerOptions = computed(() => premiumData.value.commercialType === 'PASSENGER_CARRYING_VEHICLES');
const showPublicServiceOptions = computed(() => premiumData.value.commercialType === 'PUBLIC_SERVICE_VEHICLES');

onMounted(() => {
  console.log('Edit Premium Modal - actualData:', actualData);
  
  // Populate form with existing data
  premiumData.value = {
    car_type: actualData?.car_type || '',
    rate: actualData?.rate ? (actualData.rate * 100) : 0, // Convert to percentage
    privateType: actualData?.privateType || '',
    commercialType: actualData?.commercialType || '',
    goodsCarryingType: actualData?.goodsCarryingType || '',
    ownGoodsType: actualData?.ownGoodsType || '',
    generalGoodsCaringType: actualData?.generalGoodsCaringType || '',
    passengerCarryingType: actualData?.passengerCarryingType || '',
    publicServiceType: actualData?.publicServiceType || ''
  };
});

function resetSubCategories() {
  premiumData.value.privateType = '';
  premiumData.value.commercialType = '';
  premiumData.value.goodsCarryingType = '';
  premiumData.value.ownGoodsType = '';
  premiumData.value.generalGoodsCaringType = '';
  premiumData.value.passengerCarryingType = '';
  premiumData.value.publicServiceType = '';
}

function onCarTypeChange() {
  resetSubCategories();
}

function onCommercialTypeChange() {
  premiumData.value.goodsCarryingType = '';
  premiumData.value.ownGoodsType = '';
  premiumData.value.generalGoodsCaringType = '';
  premiumData.value.passengerCarryingType = '';
  premiumData.value.publicServiceType = '';
}

function submitForm(event) {
  event?.preventDefault();
  event?.stopPropagation();
  
  const formData = {
    ...premiumData.value,
    rate: parseFloat(premiumData.value.rate) / 100 // Convert percentage to decimal
  };

  req.send(
    () => editPremiumRate(actualData.premiumRateUuid || actualData.id, formData),
    (res) => {
      if (res.success) {
        premiumStore.update(actualData.premiumRateUuid || actualData.id, res.data);
        toasted(true, 'Premium Rate Updated Successfully!');
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
    <NewFormParent title="Edit Premium Rate" size="lg" class="px-6 py-4 max-w-4xl">
      <template #content>
        <Form>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Car Type -->
            <Select
              v-model="premiumData.car_type"
              name="car_type"
              validation="required"
              label="Car Type"
              :options="carTypes"
              @change="onCarTypeChange"
              :attributes="{ placeholder: 'Select car type' }"
            />

            <!-- Rate -->
            <Input
              v-model="premiumData.rate"
              name="rate"
              validation="required|numeric"
              label="Premium Rate (%)"
              type="number"
              :attributes="{ placeholder: '0.00', min: '0', step: '0.01' }"
            >
              <template #right>
                <span class="text-gray-500 font-medium">%</span>
              </template>
            </Input>
          </div>

          <!-- Private Vehicle Options -->
          <div v-if="showPrivateOptions" class="grid grid-cols-1 gap-6">
            <Select
              v-model="premiumData.privateType"
              name="privateType"
              validation="required"
              label="Private Vehicle Type"
              :options="privateTypes"
              :attributes="{ placeholder: 'Select private vehicle type' }"
            />
          </div>

          <!-- Commercial Vehicle Options -->
          <div v-if="showCommercialOptions" class="space-y-6">
            <Select
              v-model="premiumData.commercialType"
              name="commercialType"
              validation="required"
              label="Commercial Vehicle Type"
              :options="commercialTypes"
              @change="onCommercialTypeChange"
              :attributes="{ placeholder: 'Select commercial vehicle type' }"
            />

            <!-- Goods Carrying Options -->
            <div v-if="showGoodsCarryingOptions" class="space-y-4">
              <Select
                v-model="premiumData.goodsCarryingType"
                name="goodsCarryingType"
                validation="required"
                label="Goods Carrying Type"
                :options="goodsCarryingTypes"
                :attributes="{ placeholder: 'Select goods carrying type' }"
              />

              <!-- Own Goods Options -->
              <Select
                v-if="showOwnGoodsOptions"
                v-model="premiumData.ownGoodsType"
                name="ownGoodsType"
                validation="required"
                label="Own Goods Type"
                :options="ownGoodsTypes"
                :attributes="{ placeholder: 'Select own goods type' }"
              />

              <!-- General Goods Options -->
              <Select
                v-if="showGeneralGoodsOptions"
                v-model="premiumData.generalGoodsCaringType"
                name="generalGoodsCaringType"
                validation="required"
                label="General Goods Type"
                :options="generalGoodsTypes"
                :attributes="{ placeholder: 'Select general goods type' }"
              />
            </div>

            <!-- Passenger Carrying Options -->
            <Select
              v-if="showPassengerOptions"
              v-model="premiumData.passengerCarryingType"
              name="passengerCarryingType"
              validation="required"
              label="Passenger Carrying Type"
              :options="passengerCarryingTypes"
              :attributes="{ placeholder: 'Select passenger carrying type' }"
            />

            <!-- Public Service Options -->
            <Select
              v-if="showPublicServiceOptions"
              v-model="premiumData.publicServiceType"
              name="publicServiceType"
              validation="required"
              label="Public Service Type"
              :options="publicServiceTypes"
              :attributes="{ placeholder: 'Select public service type' }"
            />
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
            Update Premium Rate
          </Button>
        </div>
      </template>
    </NewFormParent>
  </ModalParent>
</template>