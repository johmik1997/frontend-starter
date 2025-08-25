<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import Status_row from '../components/statusRow.vue'
import { openModal } from "@customizer/modal-x"
import { getCustomers } from '../api/dispersementApi'
import { removeUndefined } from '@/utils/utils'
import { useQuotation } from '../store/Dispersement'
import { usePaginationcopy } from '@/composables/usePaginationcopy'

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
  <div class="bg-primary m-2 text-white rounded-md overflow-hidden ">
    <div class="flex text-white rounded-lg  p-6 w-full justify-between">
      <div>
        <h2 class="text-2xl font-bold mb-4">Find Clients Who Committed</h2>
        <p class="mb-4 text-sm font-light text-[#EFF0F6]">Lorem ipsum dolor sit amet consectetur adipiscing elit. Proin
          venenatis pellentesque vitae porta<br /> consectetur nunc.</p>
      </div>
      <div class="flex items-center">
        <button
          class=" text-white rounded-lg px-10 border-2 text-s font-normal my-5 mr-10 py-4 border-white hover:bg-gray-200 hover:text-primary transition">
          Learn More →
        </button>
      </div>
    </div>
  </div>
  <DefaultPage placeholder="Search For a Dispersement">
    <!-- Header actions -->
    <!-- <template #more>
      <div class="flex gap-2 justify-end items-center">
        <Button @click="openAddDispersementModal" type="primary" class="flex items-center gap-2">
          New Dispersement
        </Button>
      </div>
    </template> -->

    <!-- Dispersements table -->
    <Table :pending="pagination.pending.value" :headers="{
      head: ['Customer Name', 'Deposit Date', 'Account Number', 'Branch', 'Amount', 'Status', 'actions'],
      row: ['customerName', 'depositDate', 'accountNumber', 'insurance', 'quotationAmount', 'quotationStatus'],
    }" :rowCom="Status_row" :rows="useQuations.quotations || []" :Fallback="TableRowSkeleton">
    </Table>
  </DefaultPage>
</template>
