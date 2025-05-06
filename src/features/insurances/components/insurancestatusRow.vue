<script setup>
import Button from '@/components/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
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

const handleNavigate = (insuranceUuid) => {
  router.push(`/insurance/detail/${insuranceUuid}`);
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
        <div v-if="key === 'quotationStatus'" class="truncate flex items-center gap-4">  
          <p v-if="row?.quotationStatus === 'PENDING'"
          class=" rounded-[2px] w-[87px] text-center bg-[#FFF8E7] text-[#B38B35] px-3 py-1" 
   style=" font-weight: 600; font-size: 14px; line-height: 21px; letter-spacing: 0%;">InActiive  
</p>  
          <p v-else
   class=" rounded-[2px] w-[87px]  text-center bg-[#EBE7FF] px-3 py-1 text-primary" 
   style=" font-weight: 600; font-size: 14px; line-height: 21px; letter-spacing: 0%;">
    Active  
</p>  

        </div>  
  
        <!-- Custom computation for patientName -->
        <span v-else-if="key === 'customerName'">
          {{ row.title }} {{ row.clientFirstName }} {{ row.clientFatherName }} {{ row.clientGrandFatherName }}
        </span>
        <span v-else-if="key === 'profile'" class="flex items-center justify-start">
          <img 
            :src="row.profile ? `data:image/jpeg;base64,${row.profile}` : '@/assets/default-insurance-logo.png'"
            :alt="row.insuranceName"
            class="w-12 h-12 object-contain rounded"
          />
        </span>
        <span v-else-if="key === 'VehicleDetail'" class="">
          {{ row.carName }}  {{ row.carModel }} - {{ row.carType }}
        </span>
        <span v-else>
          {{ row[key] }}
        </span>
       

  
       
      </td>  
      <td class="p-3 flex gap-3" v-if="headKeys.includes('actions')">  
        <Button 
          @click="handleNavigate(row.insuranceUuid)" 
          class="rounded-[4px] bg-primary text-white"
        >
          Open
        </Button>
      </td>   
    </tr>   
  </template>
  
