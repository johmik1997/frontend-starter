<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import icons from "@/utils/icons"
import Status_row from '../components/statusRow.vue'
import { ref, computed } from 'vue'
import { openModal } from "@customizer/modal-x"
import { getCustomers } from '../api/dispersementApi'
import { removeUndefined } from '@/utils/utils'
import { useQuotation } from '../store/Dispersement'
import { usePaginationcopy } from '@/composables/usePaginationcopy'
import { useRouter } from 'vue-router'

const router = useRouter()
const useQuations = useQuotation()
const searchKey = ref('')

// Pagination setup for the dispersements table
const pagination = usePaginationcopy({
  store: useQuations,
  cb: (data, config) => getCustomers(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})

// Compute filtered rows - only show DISPERSED and DEPOSITED
const filteredRows = computed(() => {
  return Array.isArray(useQuations.quotations) 
    ? useQuations.quotations.filter(row => row?.quotationStatus === "DISPERSED" || row?.quotationStatus === "DEPOSITED") 
    : [];
});

// Helper functions for data formatting
const formatCustomerName = (row) => {
  const parts = [row.title, row.clientFirstName, row.clientFatherName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : '-';
};

const formatVehicleDetail = (row) => {
  const parts = [row.carName, row.carModel, row.carType].filter(Boolean);
  return parts.length > 0 ? parts.join(' - ') : '-';
};

const formatAmount = (amount) => {
  return amount ? `ETB ${Number(amount).toLocaleString()}` : '-';
};

const formatDate = (date) => {
  return date || 'Apr 04-2024';
};

// Status badge component logic
const getStatusBadge = (status) => {
  if (status === 'DISPERSED') {
    return {
      class: 'bg-green-100 text-green-800',
      text: 'Dispersed'
    };
  } else if (status === 'DEPOSITED') {
    return {
      class: 'bg-blue-100 text-blue-800', 
      text: 'Deposited'
    };
  }
  return {
    class: 'bg-gray-100 text-gray-800',
    text: status || 'Unknown'
  };
};

const getCheckedBadge = (checked) => {
  if (checked === false) {
    return {
      class: 'bg-yellow-100 text-yellow-800',
      text: 'Not Checked'
    };
  } else if (checked === true) {
    return {
      class: 'bg-purple-100 text-purple-800',
      text: 'Checked'
    };
  }
  return {
    class: 'bg-gray-100 text-gray-800',
    text: 'Not Member'
  };
};

// Navigation function
const navigateToDetails = (quotationUuid) => {
  if (quotationUuid) {
    router.push(`/dispersementDetails/${quotationUuid}`);
  }
};

// Custom row component for dispersement
const DispersementRow = {
  props: {
    rowData: Array,
    headKeys: Array,
    rowKeys: Array,
    mobileView: Boolean,
    singleRow: Object,
    rowIndex: Number
  },
  emits: ['row'],
  setup(props, { emit }) {
    const displayRows = computed(() => {
      return props.mobileView && props.singleRow ? [props.singleRow] : props.rowData;
    });

    return {
      displayRows,
      formatCustomerName,
      formatVehicleDetail,
      formatAmount,
      formatDate,
      getStatusBadge,
      getCheckedBadge,
      navigateToDetails,
      router
    };
  },
  template: `
    <!-- Mobile Card Layout -->
    <div v-if="mobileView" class="space-y-3">
      <template v-for="(row, idx) in displayRows" :key="idx">
        <!-- Customer Name -->
        <div class="flex justify-between items-start">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</span>
          <div class="text-right flex-1 ml-2">
            <div class="text-sm font-semibold text-gray-900">
              {{ formatCustomerName(row) }}
            </div>
          </div>
        </div>

        <!-- Deposit Date -->
        <div class="flex justify-between items-start">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Deposit Date</span>
          <div class="text-sm font-medium text-gray-900">
            {{ formatDate(row.depositDate) }}
          </div>
        </div>

        <!-- Account Number -->
        <div class="flex justify-between items-start">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Account</span>
          <div class="text-sm font-medium text-gray-900">
            {{ row.accountNumber || '-' }}
          </div>
        </div>

        <!-- Amount -->
        <div class="flex justify-between items-start">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</span>
          <div class="text-sm font-semibold text-gray-900">
            {{ formatAmount(row.quotationAmount) }}
          </div>
        </div>

        <!-- Status -->
        <div class="flex justify-between items-center">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
          <span 
            :class="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' + getStatusBadge(row.quotationStatus).class">
            {{ getStatusBadge(row.quotationStatus).text }}
          </span>
        </div>

        <!-- Checked Status -->
        <div class="flex justify-between items-center">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Checked</span>
          <span 
            :class="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' + getCheckedBadge(row.checked).class">
            {{ getCheckedBadge(row.checked).text }}
          </span>
        </div>
        
        <!-- Actions -->
        <div class="pt-3 border-t border-gray-100 flex gap-2">
          <button 
            @click.stop="navigateToDetails(row.quotationUuid)"
            class="flex-1 text-xs px-3 py-2 bg-primary text-white rounded-md flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors"
          >
            Open
          </button>
        </div>
      </template>
    </div>

    <!-- Desktop Table Layout -->
    <template v-else>
      <tr 
        v-for="(row, idx) in rowData" 
        :key="idx"
        @click="navigateToDetails(row.quotationUuid)" 
        class="bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer" 
      >  
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ idx + 1 }}</td>  
        
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ formatCustomerName(row) }}
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ formatDate(row.depositDate) }}
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ row.accountNumber || '-' }}
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ row.insurance || '-' }}
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ formatAmount(row.quotationAmount) }}
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <span 
            :class="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getStatusBadge(row.quotationStatus).class">
            {{ getStatusBadge(row.quotationStatus).text }}
          </span>
        </td>

        <td class="px-6 py-4 whitespace-nowrap">
          <span 
            :class="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getCheckedBadge(row.checked).class">
            {{ getCheckedBadge(row.checked).text }}
          </span>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button 
            @click.stop="navigateToDetails(row.quotationUuid)" 
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Open
          </button>
        </td>
      </tr>
    </template>
  `
};

// Function to open the add dispersement modal
function openAddDispersementModal() {
  openModal('addDispersement', {
    props: {
      draftData: {
        personalDetails: {
          userUuid: '',
          firstName: '',
          fatherName: '',
          email: '',
          mobilePhone: '',
          accountNumber: ''
        },
        dispersementAmount: 0,
        step: 1
      }
    }
  })
}
</script>

<template>
  <div class="bg-primary m-2 text-white rounded-md overflow-hidden">
    <div class="flex text-white rounded-lg p-6 w-full justify-between">
      <div>
        <h2 class="text-2xl font-bold mb-4">Find Clients Who Committed</h2>
        <p class="mb-4 text-sm font-light text-[#EFF0F6]">
          Review clients who are scheduled for disbursement. Track account details, confirm payout amounts,
          and ensure all information is accurate before proceeding.
        </p>
      </div>
      <div class="flex items-center">
        <button
          class="text-white rounded-lg px-10 border-2 text-s font-normal my-5 mr-10 py-4 border-white hover:bg-gray-200 hover:text-primary transition">
          Learn More →
        </button>
      </div>
    </div>
  </div>

  <DefaultPage placeholder="Search For a Dispersement" v-model="searchKey">
    <!-- Dispersements table using Table component -->
    <Table
      :pending="pagination.pending.value"
      :headers="{
        head: ['Customer Name', 'Deposit Date', 'Account Number', 'Branch', 'Amount', 'Status', 'Checked', 'Actions'],
        row: ['customerName', 'depositDate', 'accountNumber', 'insurance', 'quotationAmount', 'quotationStatus', 'checked', 'actions'],
      }"
      :rowCom="Status_row"
      :rows="filteredRows"
      :Fallback="TableRowSkeleton"
      placeholder="No Dispersement items found"
      @row="(row) => navigateToDetails(row.quotationUuid)"
    >
    </Table>
  </DefaultPage>
</template>
