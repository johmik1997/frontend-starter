<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import icons from "@/utils/icons"
import { ref, onMounted, computed, inject, watch } from 'vue'
import Status_row from '../components/statusRow.vue'
import { openModal } from "@customizer/modal-x"
import { useQuotation } from '../store/Quotation'
import { getCustomers } from '../api/customersApi'
import { removeUndefined } from '@/utils/utils'
import { useRouter } from 'vue-router';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
import { usePaginationcopy } from '@/composables/usePaginationcopy'

const router = useRouter();
const quotationStore = useQuotation();
const quotations = computed(() => quotationStore.quotations);

// Add searchKey ref
const searchKey = ref('');

// Get search from DefaultPage if available
const defaultPageSearch = inject('search', '');

// Watch for changes in the injected search
watch(defaultPageSearch, (newValue) => {
  searchKey.value = newValue;
  // Refresh the data when search changes
  pagination.send();
});

// Pagination setup for the quotations table
const pagination = usePaginationcopy({
  store: quotationStore,
  cb: (data, config) => getCustomers(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
});

// Function to open the add client modal
function openAddClientModal() {
  openModal('addClient', {
    props: {
      draftData: {
        personalDetails: {
          userUuid: '',
          firstName: '',
          fatherName: '',
          email: '',
          mobilePhone: '',
          insuranceUuid: ''
        },
        carRequests: [],
        step: 1
      }
    }
  })
}

// Function to view quotation details
function viewDetails(quotationUuid) {
  if (!quotationUuid) {
    console.error('No quotationUuid provided');
    return;
  }

  // Navigate to the details page
  router.push(`/quatation/details/${quotationUuid}`);
}
</script>

<template>
  <DefaultPage placeholder="Search For a Member" @search="searchKey = $event">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center ">
        <Button @click="openAddClientModal" type="primary" class="flex items-center gap-2">
          <i v-html="icons.add"></i> New Quotations
        </Button>
      </div>
    </template>

    <!-- Quotations table -->
    <Table :pending="pagination.pending.value" :headers="{
      head: ['Customer Name', 'Inspection Date', 'Vehicle Detail', 'Insurance', 'Premium', 'Status', 'actions'],
      row: ['customerName', 'quotationDate', 'VehicleDetail', 'insurance', 'quotationAmount', 'quotationStatus'],
    }" :rowCom="Status_row" :rows="quotationStore.quotations" :Fallback="TableRowSkeleton">
      <!-- Custom cell renderers -->

    </Table>
  </DefaultPage>
</template>
