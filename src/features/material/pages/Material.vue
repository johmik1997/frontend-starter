<script setup>
import { computed, ref, watch } from 'vue'
import Table from '@/components/Table.vue'
import { useMaterials } from '../store/materialStore'
import { useApiRequest } from '@/composables/useApiRequest'
import { getAllMaterials, removeMaterialById } from '../api/materialApi'
import { toasted } from '@/utils/utils'
import { openModal } from '@customizer/modal-x'
import BaseIcon from '@/components/base/BaseIcon.vue'
import { mdiPencil, mdiDeleteAlert, mdiBook } from '@mdi/js'
import { usePaginations } from '@/composables/usePaginationTemp'

const materialStore = useMaterials()
const activeType = ref('physical')

// pagination (same as library)
const pagination = usePaginations({
  store: materialStore,
  cb: (query) => getAllMaterials(query, activeType.value),
})

const removeReq = useApiRequest()
const toggleClass = (type) => activeType.value === type
  ? 'bg-primary text-white shadow-sm'
  : 'bg-transparent text-gray-700 hover:bg-gray-100'

const addButtonLabel = computed(() =>
  activeType.value === 'digital' ? 'Add Digital Material' : 'Add Physical Material'
)

const filteredRows = computed(() => {
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

watch(activeType, () => {
  materialStore.setCreateType(activeType.value)
  pagination.send()
}, { immediate: true })

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
    
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <BaseIcon :path="mdiBook" size="28" />
        Library Materials
      </h1>

      <div class="flex items-center gap-3 w-full sm:w-auto">
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
        class="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
      >
        <span>{{ addButtonLabel }}</span>
      </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">

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
          stock: (_,row)=> `${row?.copy_number || 0} / ${row?.available_copies || 0}`,
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
