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
import { usePaginationEmpty } from '@/composables/usePaginationEmpty'
import { useRouter } from 'vue-router';

const router = useRouter();
const insurance = useInsurance()
const searchKey = ref('')

// Pagination setup for the quotations table
const pagination = usePaginationEmpty({
  store: insurance,
  cb: (data, config) => getInsurances(
    removeUndefined({
      ...data,
      search: searchKey.value,
    })
  ),
})
const digitalMaterials = ref([
  {
    id: 1,
    title: "Eloquent JavaScript",
    type: "eBook",
    category: "Programming",
    uploadedBy: "Abebe Beso",
    uploadDate: "2025-12-01",
    status: "Available",
    accessLink: "https://example.com/eloquent-js.pdf"
  },
  {
    id: 2,
    title: "Python Crash Course",
    type: "PDF",
    category: "Programming",
    uploadedBy: "Mekdes Alem",
    uploadDate: "2025-12-05",
    status: "Restricted",
    accessLink: ""
  },
  {
    id: 3,
    title: "Learning Vue 3",
    type: "eBook",
    category: "Web Development",
    uploadedBy: "Samuel Tesfaye",
    uploadDate: "2025-12-10",
    status: "Available",
    accessLink: "https://example.com/learning-vue3.pdf"
  },
  {
    id: 4,
    title: "Database Systems Concepts",
    type: "PDF",
    category: "Database",
    uploadedBy: "Aster Tadesse",
    uploadDate: "2025-12-12",
    status: "Restricted",
    accessLink: ""
  },
])

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
const handleNavigate = (insuranceUuid) => {
  router.push(`/insurance/detail/${insuranceUuid}`);
};
</script>

<template>
  <DefaultPage placeholder="Search For a Member">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center">
        <Button @click="openAddInsuranceModal" type="primary" class="flex items-center px-2 gap-2">
          Add New Digital Material
        </Button>
      </div>
    </template>

    <!-- Quotations table -->
     <Table
      :headers="{
        head: ['Title', 'Type', 'Category', 'Uploaded By', 'Upload Date', 'Status', 'Actions'],
        row: ['title', 'type', 'category', 'uploadedBy', 'uploadDate', 'status']
      }"
      :rows="digitalMaterials"
      :rowCom="Status_row"
      :Fallback="TableRowSkeleton"
    >
      <template #actions="{ row }">
        <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
          <Button 
            v-if="row.status === 'Available'" 
            @click="openMaterial(row)" 
            class="rounded-[4px] bg-primary text-white gap-2"
          >
            <i v-html="icons.open"></i> Open
          </Button>
          <Button 
            @click="manageMaterial(row)" 
            class="rounded-[4px] bg-[#EBE7FF] text-primary gap-2"
          >
            <i v-html="icons.edit"></i> Manage
          </Button>
        </div>
      </template>
    </Table>
  </DefaultPage>
</template>
