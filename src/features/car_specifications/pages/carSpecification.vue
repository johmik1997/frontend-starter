<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import Status_row from '../components/carSpecificationStatusRow.vue'
import { openModal } from "@customizer/modal-x"
import { useCarSpecification } from '../store/carSpecificationStore'
import { getAllCarSpecifications } from '../api/carSpecificationApi'
import { removeUndefined } from '@/utils/utils'
import { usePaginationcopy } from '@/composables/usePaginationcopy.js'

const carSpecStore = useCarSpecification()
const searchKey = ref('')

// Pagination setup for the car specifications table
const pagination = usePaginationcopy({
  store: carSpecStore,
  cb: (data, config) => getAllCarSpecifications(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})

// Function to open the add car specification modal
function openAddCarSpecModal() {
  openModal('AddCarSpecification')
}
</script>

<template>
  <DefaultPage placeholder="Search Car Specifications" v-model="searchKey">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center">
        <Button @click="openAddCarSpecModal" type="primary" class="flex items-center gap-2">
          <i v-html="icons.plus"></i>
          Add Car Specification
        </Button>
      </div>
    </template>

    <!-- Car Specifications table -->
    <Table
      :pending="pagination.pending.value"
      :headers="{
        head: ['Car Name', 'Car Type', 'Model', 'Engine', 'Price Ranges', 'actions'],
        row: ['carName', 'carType', 'carModel', 'engine', 'priceRanges'],
      }"
      :rowCom="Status_row"
      :rows="carSpecStore.carSpecifications || []"
      :Fallback="TableRowSkeleton"
    >
    </Table>
  </DefaultPage>
</template>
