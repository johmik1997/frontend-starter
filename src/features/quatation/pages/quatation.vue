<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import Status_row from '../components/statusRow.vue'
import { openModal } from "@customizer/modal-x"
import { useQuotation } from '../store/Quotation'
import { getCustomers } from '../api/customersApi'
import { removeUndefined } from '@/utils/utils'
import { usePaginationcopy } from '@/composables/usePaginationcopy'

const useQuations = useQuotation()
const searchKey = ref('')

// Pagination setup for the quotations table
const pagination = usePaginationcopy({
  store: useQuations,
  cb: (data, config) => getCustomers(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})

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
</script>

<template>
  <DefaultPage placeholder="Search For a Member">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center">
        <Button @click="openAddClientModal" type="primary" class="flex items-center gap-2">
          New Inspection
        </Button>
      </div>
    </template>

    <!-- Quotations table -->
    <Table
      :pending="pagination.pending.value"
      :headers="{
        head: ['Customer Name', 'Inspection Date', 'Vehicle Detail', 'Insurance', 'Premium', 'Status', 'actions'],
        row: ['customerName', 'quotationDate', 'VehicleDetail', 'insurance', 'quotationAmount', 'quotationStatus'],
      }"
      :rowCom="Status_row"
      :rows="useQuations.quotations || []"
      :Fallback="TableRowSkeleton"
    >
    </Table>
  </DefaultPage>
</template>


