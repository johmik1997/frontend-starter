<script setup>
import DefaultPage from '@/components/DefaultPage.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import icons from "@/utils/icons"
import { ref } from 'vue'
import Status_row from '../components/statusRow.vue'
import TableRowSkeleton from '@/components/TableRowSkeleton.vue'
import BorrowBook from '@/features/drfats/pages/drafts.vue'
import { openModal } from "@customizer/modal-x"
import Drafts from '@/features/drfats/pages/drafts.vue'

const searchKey = ref('')

// Hardcoded borrowed materials data
const materials = ref([
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Cormen et al.",
    category: "Computer Science",
    type: "Book",
    status: "Available",
    borrowedBy: "",
    dueDate: "",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    type: "Book",
    status: "Borrowed",
    borrowedBy: "Mekdes Alem",
    dueDate: "2025-12-22",
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma et al.",
    category: "Software Engineering",
    type: "Book",
    status: "Overdue",
    borrowedBy: "Samuel Tesfaye",
    dueDate: "2025-12-15",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    type: "Book",
    status: "Available",
    borrowedBy: "",
    dueDate: "",
  },
])

const showBorrowModal = ref(false)

function openBorrowModal() {
  showBorrowModal.value = true
}
// function openAddClientModal() {
//   openModal('addClient', {
//     props: {
//       draftData: {
//         personalDetails: {
//           userUuid: '',
//           firstName: '',
//           fatherName: '',
//           email: '',
//           mobilePhone: '',
//           insuranceUuid: ''
//         },
//         carRequests: [],
//         step: 1
//       }
//     }
//   })
// }
// Functions
function borrowMaterial(materialId) {
  console.log("Borrow material:", materialId)
}

function viewMaterialDetails(materialId) {
  console.log("View material details:", materialId)
}
</script>

<template>
  <DefaultPage placeholder="Search for a Material" v-model="searchKey">
    <!-- Header actions -->
    <template #more>
      <div class="flex gap-2 justify-end items-center ">
        <Button @click="openBorrowModal" type="primary" class="flex items-center px-2 gap-2">
          <i v-html="icons.add"></i> Borrow Material
        </Button>
      </div>
    </template>
    
 <BorrowBook 
      v-if="showBorrowModal"
      @close="showBorrowModal = false"
      @success="handleBorrowSuccess"
    />
    <!-- Materials table -->
    <Table
      :headers="{
        head: ['Title', 'Author', 'Category', 'Type', 'Availability', 'Borrower', 'Due Date', 'Actions'],
        row: ['title', 'author', 'category', 'type', 'status', 'borrowedBy', 'dueDate']
      }"
      :rows="materials"
      :rowCom="Status_row"
      :Fallback="TableRowSkeleton"
    >
      <template #actions="{ row }">
        <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
          <Button 
            v-if="row.status === 'Available'"
            @click="borrowMaterial(row.id)" 
            class="rounded-[4px] bg-primary text-white gap-2"
          >
            <i v-html="icons.add"></i> Borrow
          </Button>
          <Button 
            v-else
            @click="viewMaterialDetails(row.id)" 
            class="rounded-[4px] bg-[#EBE7FF] text-primary gap-2"
          >
            <i v-html="icons.eye"></i> View
          </Button>
        </div>
      </template>
    </Table>
  </DefaultPage>
</template>
