<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import Status_row from '../components/insurancestatusRow.vue'
import { openModal } from "@customizer/modal-x"
import { useInsurance } from '../store/insuranceStore'
import { getInsurances } from '../api/insuranceApi'
import { removeUndefined } from '@/utils/utils'
import { usePaginations } from '@/composables/usePaginations.js'

const insurance = useInsurance()
const searchKey = ref('')

// Pagination setup for the quotations table
const pagination = usePaginations({
  store: insurance,
  cb: (data, config) => getInsurances(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})

// Function to open the add insurance modal
function openAddInsuranceModal() {
  openModal('addInsurance', {
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
        <Button @click="openAddInsuranceModal" type="primary" class="flex items-center gap-2">
         Add New Insurance
        </Button>
      </div>
    </template>

    <!-- Quotations table -->
    <Table
      :pending="pagination.pending.value"
      :headers="{
        head: ['Logo','Insurance Name', 'Registration Date', 'Status', 'actions'],
        row: [ 'profile','insuranceName', 'registrationDate', 'quotationStatus'],
      }"
      :rowCom="Status_row"
      :rows="insurance.insurances || []"
      :Fallback="TableRowSkeleton"
    >
    </Table>
  </DefaultPage>
</template>


