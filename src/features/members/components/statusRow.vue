<script setup>
import { openModal } from "@customizer/modal-x";
import Button from '@/components/Button.vue';

const props = defineProps({
  rowData: {
    type: Array,
    required: true,
  },
  headKeys: {
    type: Array,
  },
  rowKeys: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["row"]);

// Add helper function to replace 'null' with '-'
const formatNullString = (value) => {
  if (!value) return '-';
  return value.replace(/null/g, '-');
};

// Helper to get status based on quotation status
const getStatus = (row) => {
  const quotationStatus = row.carResponses?.[0]?.quotationStatus;
  if (!quotationStatus) return 'Inactive';
  
  return quotationStatus === 'DISPERSED' ? 'Active' : 'Inactive';
};

// Helper to get vehicle details
const getVehicleDetail = (row) => {
  const car = row.carResponses?.[0];
  if (!car) return '-';
  
  const parts = [
    car.carName || '-',
    car.carModel || '-',
    car.carType || '-'
  ];
  return parts.join(' ');
};
</script>

<template>
  <tr
    v-for="(row, idx) in rowData"
    :key="idx"
    @click.self="emit('row', row)"
    class="bg-white border-b-[0.2px]"
  >
    <td class="p-3">{{ idx + 1 }}</td>

    <td class="p-3" v-for="key in rowKeys" :key="key">
      <!-- Policy Status -->
      <div v-if="key === 'status'" class="truncate flex items-center gap-4">
        <p
          v-if="getStatus(row) === 'Inactive'"
          class="rounded-[2px] w-[87px] text-center bg-[#FFD9D9] text-[#FC5A5A] font-bold py-1"
          style="font-weight: 700; font-size: 14px; line-height: 21px; letter-spacing: 0%;"
        >
          Inactive
        </p>
        <p
          v-else
          class="rounded-[2px] w-[87px] text-center bg-[#D3D3FF] font-bold text-[#3C3C9E] py-1"
          style="font-weight: 700; font-size: 14px; line-height: 21px; letter-spacing: 0%;"
        >
          Active
        </p>
      </div>

      <!-- Client Name -->
      <span v-else-if="key === 'clientName'">
        {{ formatNullString(row.clientName) }}
      </span>

      <!-- Phone Number -->
      <span v-else-if="key === 'phoneNumber'" class="font-bold text-black">
        {{ row.phoneNumber || '-' }}
      </span>

      <!-- Vehicle Detail -->
      <span v-else-if="key === 'Vehicle'" class="text-">
        {{ getVehicleDetail(row) }}
      </span>
    
      <!-- Registered Date -->
      <span v-else-if="key === 'RegisteredDate'" class="">
        {{ row.registrationDate || '-' }}
      </span>
     
      <!-- Default case for other fields -->
      <span v-else>
        {{ row[key] || '-' }}
      </span>
    </td>

    <!-- Actions -->
    <td class="p-3 flex gap-3" v-if="headKeys.includes('actions')">
      <Button
        @click.prevent="openModal('SendSMS', { userUuid: row.userUuid })"
        className="rounded-[4px] px-[14px] py-[8px] bg-primary text-white"
      >
        Send SMS
      </Button>
      
    </td>
  </tr>
  </template>
