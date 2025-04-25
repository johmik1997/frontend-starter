<script setup>
import { computed } from 'vue';

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

// Compute filtered rows

const filteredRows = computed(() => {
  // Ensure rowData is an array before filtering
  return Array.isArray(props.rowData) 
    ? props.rowData.filter(row => row?.quotationStatus === "DISPERSED" || row?.quotationStatus === "DEPOSITED" ) 
    : [];
});
</script>
<template>  
    <!-- Show message if no deposited items -->
    <tr v-if="filteredRows.length === 0">
      <td :colspan="rowKeys.length + 2" class="p-3 text-center text-gray-500">
        No deposited items found
      </td>
    </tr>

    <!-- Show deposited items -->
    <template v-for="(row, idx) in filteredRows" :key="row.quotationUuid || idx">
      <tr
        @click.self="emit('row', row)" 
        class="bg-white border-b-[0.2px]" 
      >  
        <td class="p-3">{{ idx + 1 }}</td>  
    
        <td class="p-3" v-for="key in rowKeys" :key="key">  
          <div v-if="key === 'checked'" class="truncate flex items-center gap-4">  
            <p v-if="row?.checked === false"
              class="rounded-[2px] w-[87px] text-center bg-[#FFF8E7] text-[#B38B35] px-3 py-1" 
              style="font-weight: 600; font-size: 14px; line-height: 21px; letter-spacing: 0%;">
              Not Checked  
            </p>  
            <p v-else-if="row?.checked === true" 
              class="rounded-[2px] w-[87px] text-center bg-[#EBE7FF] px-3 py-1 text-primary" 
              style="font-weight: 600; font-size: 14px; line-height: 21px; letter-spacing: 0%;">
              Checked  
            </p>  
            <p v-else class="bg-gray-400 px-2 py-1 rounded-full text-white">
              Not Member
            </p>  
          </div>  
          <div v-if="key === 'quotationStatus'" class="truncate flex items-center gap-4">  
            <p v-if="row?.quotationStatus === 'DEPOSITED'"
              class="rounded-[2px] w-[87px] text-center bg-[#FFF8E7] text-[#B38B35] px-3 py-1" 
              style="font-weight: 600; font-size: 14px; line-height: 21px; letter-spacing: 0%;">
              Deposited 
            </p>  
            <p v-else-if="row?.quotationStatus === 'DISPERSED'" 
              class="rounded-[2px] w-[87px] text-center bg-[#EBE7FF] px-3 py-1 text-primary" 
              style="font-weight: 600; font-size: 14px; line-height: 21px; letter-spacing: 0%;">
              Dispresed 
            </p>  
            <p v-else class="bg-gray-400 px-2 py-1 rounded-full text-white">
              Not Member
            </p>  
          </div>  
          <span v-else-if="key === 'customerName'">
            {{ row.title }} {{ row.clientFirstName }} {{ row.clientFatherName }} {{ row.clientGrandFatherName }}
          </span>
          <span v-else-if="key === 'quotationAmount'" class="font-bold text-black">
            ETB  {{ row.quotationAmount }} 
          </span>
          <span v-else-if="key === 'VehicleDetail'" class="">
            {{ row.carName }}  {{ row.carModel }} - {{ row.carType }}
          </span>
          <span v-else-if="key === 'depositDate'" class="">
              {{ row.depositDate ||'Apr 04-2024' }} 
          </span>
          <span v-else>
            {{ row[key] }}
          </span>
        </td>  
        <td class="p-3 flex gap-3" v-if="headKeys.includes('actions')">  
          <Button @click="$router.push(`/dispersementDetails/${row.quotationUuid}`)" className="rounded-[4px] px-[14px] py-[8px] bg-primary text-white">
            Open
          </Button>
        </td>   
      </tr>   
    </template>
</template>
  
