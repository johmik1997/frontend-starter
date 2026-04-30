<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Table from '@/components/Table.vue'
import { useMaterials } from '../store/materialStore'
import { useApiRequest } from '@/composables/useApiRequest'
import { getAllMaterials, getMaterialById, removeMaterialById } from '../api/materialApi'
import { normalizeRoleValue } from '@/utils/authNavigation'
import { toasted } from '@/utils/utils'
import { openModal } from '@customizer/modal-x'
import BaseIcon from '@/components/base/BaseIcon.vue'
import { mdiPencil, mdiDeleteAlert, mdiBook, mdiMagnify, mdiClose, mdiEyeOutline, mdiStar } from '@mdi/js'
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
const detailModalReq = useApiRequest()
const selectedMaterial = ref(null)
const detailModalVisible = ref(false)
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

function extractRow(payload) {
  if (!payload) return null
  if (Array.isArray(payload)) return payload[0] || null
  if (Array.isArray(payload?.content)) return payload.content[0] || null
  if (Array.isArray(payload?.data)) return payload.data[0] || null
  if (Array.isArray(payload?.results)) return payload.results[0] || null
  return payload
}

const detailModalMaterial = computed(() => extractRow(detailModalReq.response.value) || selectedMaterial.value)

const isDigital = computed(() => activeType.value === 'digital');

const userRole = computed(() => {
  const stored = JSON.parse(localStorage.getItem('userDetail') || '{}');
  const user = stored?.user || stored || {};
  return normalizeRoleValue(user?.roleName || user?.role || user?.userRole);
});

const canManageMaterial = computed(() => !['MEMBER', 'STACK STAFF'].includes(userRole.value));

const detailModalStats = computed(() => {
  const stats = [
    {
      label: 'Type',
      value: activeType.value,
    },
    {
      label: 'Library',
      value: detailModalMaterial.value?.library_name || 'Catalog',
    },
  ];

  if (!isDigital.value) {
    stats.unshift(
      {
        label: 'Available copies',
        value: Number(detailModalMaterial.value?.available_copies || detailModalMaterial.value?.copy_number || 0),
      },
      {
        label: 'Total copies',
        value: Number(detailModalMaterial.value?.total_copies || detailModalMaterial.value?.available_copies || detailModalMaterial.value?.copy_number || 0),
      }
    );
  }

  return stats;
});

function openDetail(row) {
  const id = getMaterialId(row)
  if (!id) return

  const stored = JSON.parse(localStorage.getItem('userDetail') || '{}')
  const user = stored?.user || stored
  const role = normalizeRoleValue(user?.roleName || user?.role || user?.userRole)

  if (role === 'MEMBER') {
    router.push({
      path: `/material/${id}`,
      query: { type: activeType.value },
    })
    return
  }

  selectedMaterial.value = row
  detailModalVisible.value = true
  detailModalReq.send(
    () => getMaterialById(id, activeType.value),
    (res) => {
      if (!res?.success) {
        toasted(false, 'Failed to load material details')
        detailModalVisible.value = false
      }
    },
    true
  )
}

function getStock(row) {
  return Number(row?.available_copies ?? row?.copy_number ?? 0)
}

function getRating(row) {
  const rating = Number(row?.average_rating || row?.rating || row?.avg_rating || 0)
  return Number.isFinite(rating) ? rating.toFixed(1) : 'N/A'
}

function stockTone(row) {
  const stock = getStock(row);
  if (stock > 3) return 'bg-emerald-100 text-emerald-700';
  if (stock > 0) return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
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
        class="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="relative h-52 overflow-hidden bg-slate-100">
          <img
            :src="row?.cover_image || row?.image || row?.thumbnail || defaultCover"
            :alt="row?.title || 'Material cover'"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            @error="onImageError"
          />
          <div class="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span class="rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              {{ activeType }}
            </span>
            <span v-if="!isDigital" class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="stockTone(row)">
              {{ getStock(row) > 0 ? `${getStock(row)} in stock` : 'Unavailable' }}
            </span>
            <span v-else class="rounded-full bg-slate-700/80 px-3 py-1 text-[11px] font-semibold text-white">
              {{ row?.format || 'Digital' }}
            </span>
          </div>
        </div>
        <div class="space-y-4 p-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{{ row?.library_name || 'Library collection' }}</p>
            <button class="mt-2 line-clamp-2 text-left text-lg font-semibold text-slate-900 transition hover:text-primary" @click="openDetail(row)">
            {{ row?.title || 'Untitled' }}
            </button>
            <p class="mt-1 line-clamp-1 text-sm text-slate-500">{{ row?.author || '-' }}</p>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="rounded-2xl bg-slate-50 p-3">
              <p class="text-slate-500">Category</p>
              <p class="mt-1 font-medium text-slate-800 line-clamp-1">{{ row?.category || row?.genre || '-' }}</p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-3">
              <p class="text-slate-500">Rating</p>
              <p class="mt-1 font-medium text-slate-800 inline-flex items-center gap-1">
                <BaseIcon :path="mdiStar" size="14" class="text-amber-500" />
                {{ getRating(row) || 'N/A' }}
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-3">
              <p class="text-slate-500">Condition</p>
              <p class="mt-1 font-medium text-slate-800">{{ row?.condition || (activeType.value === 'digital' ? row?.format || 'DIGITAL' : 'Good') }}</p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-3">
              <p class="text-slate-500">{{ isDigital ? 'Format' : 'Stock' }}</p>
              <p class="mt-1 font-medium text-slate-800">{{ isDigital ? (row?.format || 'Digital') : getStock(row) }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row">
            <button
              class="flex-1 rounded-2xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-900 hover:text-white"
              @click="openDetail(row)"
            >
              Details
            </button>
            <template v-if="canManageMaterial">
              <button
                class="flex-1 rounded-2xl bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-600 hover:text-white"
                @click="$router.push('/edit_material/' + row.id + '?type=' + activeType)"
              >
                Edit
              </button>
              <button
                class="flex-1 rounded-2xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-600 hover:text-white"
                @click="remove(row.id)"
              >
                Delete
              </button>
            </template>
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
              <template v-if="canManageMaterial">
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
            </template>
          </div>
        </template>
      </Table>
    </div>

    <div
      v-if="detailModalVisible"
      class="fixed inset-0 z-50 overflow-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      @click.self="detailModalVisible = false"
    >
      <div class="mx-auto w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-2xl ring-1 ring-slate-900/10">
        <div class="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Material quick view</h2>
            <p class="text-sm text-slate-600">Preview material information without leaving this page.</p>
          </div>
          <button
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
            @click="detailModalVisible = false"
          >
            <BaseIcon :path="mdiClose" size="20" />
          </button>
        </div>

        <div class="space-y-6 p-5">
          <div v-if="detailModalReq.pending.value" class="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            Loading material details...
          </div>

          <div v-else-if="!detailModalMaterial" class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            Material detail is not available.
          </div>

          <template v-else>
            <section class="overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_28%),linear-gradient(150deg,_#0f172a,_#111827_46%,_#1d4ed8)] shadow-xl">
              <div class="grid grid-cols-1 gap-0 lg:grid-cols-[320px_1fr]">
                <div class="border-b border-white/10 bg-black/10 p-6 lg:border-b-0 lg:border-r">
                  <div class="aspect-[3/4] overflow-hidden rounded-[28px] bg-slate-900/30 shadow-2xl">
                    <img
                      :src="detailModalMaterial?.cover_image || detailModalMaterial?.image || detailModalMaterial?.thumbnail || defaultCover"
                      :alt="detailModalMaterial?.title || 'Material cover'"
                      class="h-full w-full object-cover"
                      @error="onImageError"
                    />
                  </div>
                </div>

                <div class="p-6 text-white">
                  <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div class="max-w-3xl">
                      <div class="flex flex-wrap gap-2">
                        <span class="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
                          {{ activeType }}
                        </span>
                        <span
                          class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                          :class="Number(detailModalMaterial?.available_copies || detailModalMaterial?.copy_number || 0) > 0 ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'"
                        >
                          {{ Number(detailModalMaterial?.available_copies || detailModalMaterial?.copy_number || 0) > 0 ? 'Available now' : 'Waitlist only' }}
                        </span>
                        <span v-if="detailModalMaterial?.library_name" class="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-slate-100">
                          {{ detailModalMaterial?.library_name }}
                        </span>
                      </div>

                      <h1 class="mt-4 text-3xl font-bold tracking-tight">{{ detailModalMaterial?.title || 'Untitled' }}</h1>
                      <p class="mt-3 flex items-center gap-2 text-sm text-slate-200/90">
                        <BaseIcon :path="mdiAccount" size="16" />
                        {{ detailModalMaterial?.author || '-' }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div
                      v-for="card in detailModalStats"
                      :key="card.label"
                      class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                    >
                      <p class="text-xs uppercase tracking-[0.22em] text-slate-200/70">{{ card.label }}</p>
                      <p class="mt-2 text-2xl font-bold">{{ card.value }}</p>
                    </div>
                  </div>

                  <div class="mt-6 grid grid-cols-1 gap-3 text-sm text-slate-100/90 md:grid-cols-2 xl:grid-cols-3">
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiTag" size="16" /> Category</p>
                      <p class="mt-2 font-semibold">{{ detailModalMaterial?.category || detailModalMaterial?.genre || '-' }}</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiSchoolOutline" size="16" /> Department</p>
                      <p class="mt-2 font-semibold">{{ detailModalMaterial?.department || '-' }}</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiTranslate" size="16" /> Language</p>
                      <p class="mt-2 font-semibold">{{ detailModalMaterial?.language || '-' }}</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiBarcode" size="16" /> ISBN</p>
                      <p class="mt-2 font-semibold">{{ detailModalMaterial?.isbn || 'N/A' }}</p>
                    </div>
                    <div v-if="!isDigital" class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiPackageVariantClosed" size="16" /> Stock</p>
                      <p class="mt-2 font-semibold">{{ Number(detailModalMaterial?.available_copies || detailModalMaterial?.copy_number || 0) }}/{{ Number(detailModalMaterial?.total_copies || detailModalMaterial?.available_copies || detailModalMaterial?.copy_number || 0) }}</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiCalendarClock" size="16" /> Published</p>
                      <p class="mt-2 font-semibold">{{ detailModalMaterial?.published_date || '-' }}</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiBookOpenPageVariant" size="16" /> Genre</p>
                      <p class="mt-2 font-semibold">{{ detailModalMaterial?.genre || '-' }}</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiMapMarkerOutline" size="16" /> Shelf / Location</p>
                      <p class="mt-2 font-semibold">{{ detailModalMaterial?.location || detailModalMaterial?.library_name || '-' }}</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiCommentTextOutline" size="16" /> Condition / Format</p>
                      <p class="mt-2 font-semibold">{{ activeType === 'physical' ? detailModalMaterial?.condition || 'GOOD' : detailModalMaterial?.format || 'DIGITAL' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
