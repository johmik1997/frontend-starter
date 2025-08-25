<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import PremiumStatusRow from '../components/premiumStatusRow.vue'
import { openModal } from "@customizer/modal-x"
import { usePremium } from '../store/premiumStore'
import { getAllPremiums } from '../api/premiumApi'
import { removeUndefined } from '@/utils/utils'
import { usePagination } from '@/composables/usePagination.js'

const premiumStore = usePremium()
const searchKey = ref('')

// Pagination setup for the premiums table
const pagination = usePagination({
  store: premiumStore,
  cb: (data, config) => getAllPremiums(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})

// Function to open the add premium modal
function openAddPremiumModal() {
  openModal('AddPremium')
}
</script>

<template>
  <DefaultPage placeholder="Search Premiums" v-model="searchKey">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center">
        <Button @click="openAddPremiumModal" type="primary" class="flex items-center gap-2">
          <i v-html="icons.plus"></i>
          Add Premium Rate
        </Button>
      </div>
    </template>

    <!-- Premiums table -->
    <Table
      :pending="pagination.pending.value"
      :headers="{
        head: ['Car Type', 'Category', 'Sub Category', 'Rate (%)', 'actions'],
        row: ['carType', 'category', 'subCategory', 'rate'],
      }"
      :rowCom="PremiumStatusRow"
      :rows="premiumStore.premiums || []"
      :Fallback="TableRowSkeleton"
    >
    </Table>
  </DefaultPage>
</template>