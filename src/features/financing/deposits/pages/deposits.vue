<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import Status_row from '../components/statusRow.vue'
import { openModal } from "@customizer/modal-x"
import { useQuotation } from '../store/deposit'
import { getCustomers } from '../api/depositsApi'
import { removeUndefined } from '@/utils/utils'
import { usePaginationcopy } from '@/composables/usePaginationcopy'

const quotationStore = useQuotation()
const searchKey = ref('')

// Pagination setup for the deposits table
const pagination = usePaginationcopy({
  store: quotationStore,
  cb: (data, config) => getCustomers(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})

// Function to open the add deposit modal
function openAddDepositModal() {
  openModal('addDeposit', {
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
        depositAmount: 0,
        step: 1
      }
    }
  })
}
function openapproveDepositModal(row) {
  console.log('Row data being passed:', row); // Add this debug log
  openModal('approveDeposit', {
    props: {
      data: row  // Simplify the data structure
    }
  });
}
</script>

<template>
  <div class="bg-primary m-2 text-white rounded-md overflow-hidden ">
    <div class="flex text-white rounded-lg  p-6 w-full justify-between">
      <div>
        <h2 class="text-2xl font-bold mb-4">Find Clients Who Committed</h2>
       <p class="mb-4 text-sm font-light text-[#EFF0F6]">
  This section displays clients who have committed to making a deposit. You can review their details,
  track progress, and manage deposit statuses all in one place.
</p>

      </div>
      <div class="flex items-center">
        <button
          class=" text-white rounded-lg px-10 border-2 text-s font-normal my-5 mr-10 py-4 border-white hover:bg-gray-200 hover:text-primary transition">
          Learn More →
        </button>
      </div>
    </div>
  </div>
  <DefaultPage placeholder="Search For a Deposit">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center">
        <Button @click="openAddDepositModal" type="primary" class="flex items-center gap-2">
          New Deposit
        </Button>
      </div>
    </template>

    <!-- Deposits table -->
    <Table :pending="pagination.pending.value" :headers="{
      head: ['Customer Names', 'Deposit Date', 'Account Number', 'Insurance', 'Amount', 'Status', 'actions'],
      row: ['customerName', 'depositDate', 'accountNumber', 'insurance', 'quotationAmount', 'quotationStatus'],
    }" :rowCom="Status_row" :rows="quotationStore.quotations || []" :Fallback="TableRowSkeleton">
     <template #actions="{ row }">
           <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
         <Button v-if="row?.quotationStatus === 'REQUESTED'"  @click="openapproveDepositModal(row)"   className=" w-14 rounded-[4px] px-[14px] py-[8px] bg-green-500 text-white">
            Approve
          </Button>
          <Button v-else  @click="$router.push(`/depositDetails/${row.quotationUuid}`)" className="w-14 rounded-[4px] px-[14px] py-[8px] bg-primary text-white">
            Open
          </Button>
        </div>
        </template>
    </Table>
  </DefaultPage>
</template>
