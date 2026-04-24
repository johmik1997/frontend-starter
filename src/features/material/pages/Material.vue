<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Table from '@/components/Table.vue'
import { useMaterials } from '../store/materialStore'
import { useApiRequest } from '@/composables/useApiRequest'
import { getAllMaterials, removeMaterialById } from '../api/materialApi'
import { toasted } from '@/utils/utils'
import { openModal } from '@customizer/modal-x'
import BaseIcon from '@/components/base/BaseIcon.vue'
import { mdiPencil, mdiDeleteAlert, mdiBook, mdiMagnify, mdiClose, mdiEyeOutline } from '@mdi/js'
import { usePaginations } from '@/composables/usePaginationTemp'
import BorrowHeader from '@/features/borrow/components/BorrowHeader.vue'
import defaultCover from '@/assets/default-coverpage.png'
import { emitEntityMutation, subscribeEntityMutation } from '@/utils/entitySync'

const materialStore = useMaterials()
const router = useRouter()
const activeType = ref('physical')
const viewMode = ref('grid')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedCondition = ref('')

// pagination (same as library)
const pagination = usePaginations({
  store: materialStore,
  cb: (query) => getAllMaterials(query, activeType.value),
})

const removeReq = useApiRequest()
let unsubscribeEntitySync = () => {}
const toggleClass = (type) => activeType.value === type
  ? 'bg-primary text-white shadow-sm'
  : 'bg-transparent text-gray-700 hover:bg-gray-100'

const addButtonLabel = computed(() =>
  activeType.value === 'digital' ? 'Add Digital Material' : 'Add Physical Material'
)

const typeFilteredRows = computed(() => {
  return (materialStore.materials || []).filter((row) => {
    const rowType = String(row?.material_type || row?.materialType || row?.type || '')
      .toLowerCase()
      .replace(/_/g, ' ')
      .trim()

    if (!rowType) return true
    return activeType.value === 'digital'
      ? rowType.includes('digital')
      : rowType.includes('physical')
  })
})

const categories = computed(() => {
  return Array.from(
    new Set((typeFilteredRows.value || []).map((row) => row?.category || row?.genre).filter(Boolean))
  ).sort()
})

const conditions = computed(() => {
  return Array.from(new Set((typeFilteredRows.value || []).map((row) => row?.condition).filter(Boolean))).sort()
})

const filteredRows = computed(() => {
  let rows = typeFilteredRows.value || []
  const query = searchQuery.value.trim().toLowerCase()

  if (query) {
    rows = rows.filter((row) =>
      [row?.title, row?.author, row?.category, row?.genre, row?.isbn]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }

  if (selectedCategory.value) {
    rows = rows.filter((row) => (row?.category || row?.genre) === selectedCategory.value)
  }

  if (selectedCondition.value) {
    rows = rows.filter((row) => row?.condition === selectedCondition.value)
  }

  return rows
})

const headerStats = computed(() => {
  const rows = typeFilteredRows.value || []
  return {
    total: rows.length,
    available: rows.filter((row) => Number(row?.available_copies ?? row?.copy_number ?? 0) > 0).length,
    borrowed: rows.filter((row) => Number(row?.available_copies ?? row?.copy_number ?? 0) <= 0).length,
    categories: new Set(rows.map((row) => row?.category || row?.genre).filter(Boolean)).size,
  }
})

watch(activeType, () => {
  materialStore.setCreateType(activeType.value)
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedCondition.value = ''
  pagination.send()
}, { immediate: true })

onMounted(() => {
  unsubscribeEntitySync = subscribeEntityMutation('materials', () => {
    pagination.refresh()
  })
})

onBeforeUnmount(() => {
  unsubscribeEntitySync?.()
})

function clearSearch() {
  searchQuery.value = ''
}

function getMaterialId(row) {
  return row?.id || row?.uuid || row?.materialUuid
}

function openDetail(row) {
  const id = getMaterialId(row)
  if (!id) return
  router.push({
    path: `/material/${id}`,
    query: { type: activeType.value },
  })
}

function getStock(row) {
  return Number(row?.available_copies ?? row?.copy_number ?? 0)
}

function onImageError(event) {
  if (event?.target) event.target.src = defaultCover
}

function openCreateModal() {
  materialStore.setCreateType(activeType.value)
  openModal('AddMaterial')
}

function remove(id) {
  openModal(
    'Confirmation',
    {
      title: 'Remove Material',
      message: 'Are you sure you want to delete this material?',
    },
    (confirm) => {
      if (confirm) {
        removeReq.send(
          () => removeMaterialById(id, activeType.value),
          (res) => {
            if (res.success) {
              materialStore.remove(id)
              emitEntityMutation('materials', { action: 'deleted', id, type: activeType.value })
              toasted(true, 'Material removed successfully')
            } else {
              toasted(false, 'Failed to remove material', res.error)
            }
          }
        )
      }
    }
  )
}
</script>

<template>
  <div class="p-4 sm:p-7">
    <div class="mb-6">
      <BorrowHeader :stats="headerStats" v-model:viewMode="viewMode" />
    </div>

   <div class="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
  <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
    <div>
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <BaseIcon :path="mdiBook" size="28" />
        Library Materials
      </h1>
      <p class="text-sm text-gray-500 mt-1">Manage physical and digital materials in one place</p>
    </div>

    <div class="flex items-center gap-3 w-full lg:w-auto">
      <div class="p-1 rounded-lg bg-gray-100 flex">
        <button
          class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="toggleClass('physical')"
          @click="activeType = 'physical'"
        >
          Physical
        </button>
        <button
          class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="toggleClass('digital')"
          @click="activeType = 'digital'"
        >
          Digital
        </button>
      </div>

      <button
        @click="openCreateModal"
        class="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
      >
        <span>{{ addButtonLabel }}</span>
      </button>
    </div>
  </div>

  <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="md:col-span-3 relative">
      <BaseIcon 
        :path="mdiMagnify" 
        size="18" 
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by title, author, category, or ISBN..."
        class="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
      />
    </div>

    <div class="md:col-span-1">
      <select
        v-model="selectedCategory"
        class="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
  </div>
</div>

    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="row in filteredRows"
        :key="row.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="h-44 bg-gray-100">
          <img
            :src="row?.cover_image || row?.image || row?.thumbnail || defaultCover"
            :alt="row?.title || 'Material cover'"
            class="w-full h-full object-cover"
            @error="onImageError"
          />
        </div>
        <div class="p-4">
          <button class="font-semibold text-gray-900 line-clamp-1 text-left hover:text-primary" @click="openDetail(row)">
            {{ row?.title || 'Untitled' }}
          </button>
          <p class="text-sm text-gray-500 line-clamp-1 mt-0.5">{{ row?.author || '-' }}</p>
          <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div class="bg-gray-50 rounded-lg p-2">
              <p class="text-gray-500">Category</p>
              <p class="font-medium text-gray-800 line-clamp-1">{{ row?.category || row?.genre || '-' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-2">
              <p class="text-gray-500">Stock</p>
              <p class="font-medium text-gray-800">{{ getStock(row) }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-2">
              <p class="text-gray-500">Condition</p>
              <p class="font-medium text-gray-800">{{ row?.condition || 'Good' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-2">
              <p class="text-gray-500">Price</p>
              <p class="font-medium text-gray-800">{{ row?.price ? `$${row.price}` : 'Free' }}</p>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button
              class="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
              @click="openDetail(row)"
            >
              <BaseIcon :path="mdiEyeOutline" size="16" />
              Details
            </button>
            <button
              class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
              @click="$router.push('/edit_material/' + row.id + '?type=' + activeType)"
            >
              <BaseIcon :path="mdiPencil" size="16" />
              Edit
            </button>
            <button
              class="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
              @click="remove(row.id)"
            >
              <BaseIcon :path="mdiDeleteAlert" size="16" />
              Delete
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="!pagination.pending.value && filteredRows.length === 0"
        class="col-span-full bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-800 text-sm"
      >
        No materials found for the selected filters.
      </div>
    </div>

    <div v-if="viewMode === 'grid'" class="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="text-sm text-gray-600">
          Page {{ pagination.meta.value.page || 1 }} of {{ pagination.meta.value.totalPages || 1 }}
          <span class="text-gray-400">
            ({{ pagination.meta.value.totalElements || 0 }} total)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <select
            :value="pagination.meta.value.size"
            class="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            @change="pagination.setPerPage(Number($event.target.value))"
          >
            <option :value="5">5 / page</option>
            <option :value="10">10 / page</option>
            <option :value="20">20 / page</option>
            <option :value="50">50 / page</option>
          </select>

          <button
            class="px-3 py-1.5 rounded-lg border text-sm font-medium"
            :class="(pagination.meta.value.page || 1) <= 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
            :disabled="(pagination.meta.value.page || 1) <= 1"
            @click="pagination.previous"
          >
            Previous
          </button>
          <button
            class="px-3 py-1.5 rounded-lg border text-sm font-medium"
            :class="(pagination.meta.value.page || 1) >= (pagination.meta.value.totalPages || 1) ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
            :disabled="(pagination.meta.value.page || 1) >= (pagination.meta.value.totalPages || 1)"
            @click="pagination.next"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <Table
        :headers="{
          head: [
            'Title',
            'Author',
            'Category',
            'ISBN',
            'Stock',
            'Price',
            'Condition',
            'Actions'
          ],
          row: [
            'title',
            'author',
            'category',
            'isbn',
            'stock',
            'price',
            'condition'
          ]
        }"
        :cells="{
          category: (_,row)=> row?.category || row?.genre || '-',
          isbn: (_,row)=> row?.isbn || 'N/A',
          stock: (_,row)=> `${getStock(row)}`,
          price: (_,row)=> row?.price ? `$${row.price}` : 'Free',
          condition: (_,row)=> row?.condition || 'Good'
        }"
        :rows="filteredRows"
        :pending="pagination.pending.value"
        :pagination="pagination.meta.value"
        @next-page="pagination.next"
        @prev-page="pagination.previous"
        @page-change="pagination.goToPage"
        @page-size-change="pagination.setPerPage"
      >
        <template #actions="{ row }">
          <div class="flex gap-2 justify-center">
            <button
              class="bg-gray-50 text-gray-700 hover:bg-gray-700 hover:text-white p-2 rounded"
              @click="openDetail(row)"
            >
              <BaseIcon :path="mdiEyeOutline" size="18"/>
            </button>
            <button
              class="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded"
              @click="$router.push('/edit_material/' + row.id + '?type=' + activeType)"
            >
              <BaseIcon :path="mdiPencil" size="18"/>
            </button>
            <button
              class="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded"
              @click="remove(row.id)"
            >
              <BaseIcon :path="mdiDeleteAlert" size="18"/>
            </button>
          </div>
        </template>
      </Table>
    </div>

  </div>
</template>
