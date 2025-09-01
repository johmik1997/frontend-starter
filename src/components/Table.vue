<script setup>
import DataTable from "./DataTable.vue";
import { inject, ref, useAttrs, watch } from "vue";
import GenericTableRow from "./GenericTableRow.vue";
import icons from "@/utils/icons";
import TableRowSkeleton from "./TableRowSkeleton.vue";

const emit = defineEmits([
  "row",
  "action:certificate",
  "action:delete",
  "action:review",
  "action:suspend",
  "action:edit",
  "bottom",
]);

const props = defineProps({
  showPagination: {
    type: Boolean,
    default: true,
  },
  rowCom: Object,
  actionHide: String,
  headers: [Array, Object],
  rows: {
    type: Array,
    default: [],
  },
  firstCol: { type: Boolean, default: false },
  placeholder: String,
  photoRow: Object,
  cells: Object,
  actions: Array,
  exceptions: Array,
  length: Number,
  Fallback: {
    type: Object,
    default: TableRowSkeleton
  },
  pending: Boolean,
});

function toUpper(str) {
  let words = str.split(" ");
  if (words.length == 0) return str;

  for (let i = 1; i < words.length; i++) {
    words[0] += words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }

  return words[0];
}

const spec = ref({ head: [], row: [] });

function format() {
  if (Array.isArray(props.headers)) {
    spec.value.head = props.headers;

    const res = props.headers.reduce((state, el) => {
      const temp = el.toLowerCase();
      state.push(toUpper(temp));
      return state;
    }, []);

    spec.value.row = res.filter((el) => el != "modify");
  } else {
    spec.value.head = props.headers?.head || [];
    spec.value.row = props.headers?.row || [];
  }
}

format();

function getUrl(blob) {
  if (blob.toString().includes("File")) {
    const url = URL.createObjectURL(blob);
    return url;
  }

  return blob;
}

watch(props, () => {
  format();
});

const nextPage = inject("next", () => {});
const previousPage = inject("previous", () => {});
const page = inject("page", 1);
const totalPages = inject("totalPages", 1);
</script>
<template>
  <div class="modern-table-container">
    <!-- Mobile Card View (visible on small screens) -->
    <div class="block lg:hidden space-y-4">
      <!-- Loading State for Mobile -->
      <div v-if="pending" class="space-y-4">
        <div v-for="num in 3" :key="num" class="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div v-else-if="rows?.length" class="space-y-4">
        <div 
          v-for="(row, index) in rows" 
          :key="index"
          class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          @click="emit('row', row)"
        >
          <div class="space-y-3">
            <!-- Display key fields -->
            <div v-for="(key, keyIndex) in spec.row.slice(0, 3)" :key="keyIndex" class="flex justify-between items-start">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {{ spec.head[keyIndex] || key }}
              </span>
              <span class="text-sm font-medium text-gray-900 text-right flex-1 ml-2">
                <template v-if="cells && cells[key]">
                  <component :is="cells[key]" :row="row" :key="key" />
                </template>
                <template v-else>
                  {{ row[key] || '-' }}
                </template>
              </span>
            </div>
            
            <!-- Actions -->
            <div class="pt-2 border-t border-gray-100">
              <slot name="actions" :row="row" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State for Mobile -->
      <div v-else class="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
        <slot name="placeholder">
          <div class="empty-state">
            <div class="empty-icon mx-auto mb-4" v-html="icons.no_data" />
            <h3 class="empty-title text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p class="empty-subtitle text-gray-500">{{ placeholder || 'There are no items to display at the moment.' }}</p>
          </div>
        </slot>
      </div>
    </div>

    <!-- Desktop Table View (hidden on small screens) -->
    <div class="hidden lg:block table-card">
      <div class="overflow-x-auto">
        <DataTable
          :firstCol="props.firstCol"
          class="modern-table"
          :headers="spec.head"
        >
          <template v-if="firstCol" #headerFirst>
            <slot name="headerFirst" />
          </template>
          <slot name="row">
            <template v-if="rowCom">
              <component
                :is="rowCom"
                v-bind="{
                  cells: cells,
                  headKeys: spec.head,
                  rowData: rows,
                  rowKeys: spec.row,
                }"
              />
            </template>

            <template v-else>
              <GenericTableRow
                @row="(row) => emit('row', row)"
                :firstCol="props.firstCol"
                :head-keys="spec.head"
                :row-data="rows"
                :row-keys="spec.row"
                :cells="cells"
              >
                <template v-if="firstCol" #select="{ row }">
                  <slot name="select" :row="row" />
                </template>
                <template #actions="{ row }">
                  <slot name="actions" :row="row" />
                </template>
                <template #reason="{ row }">
                  <slot name="reason" :row="row" />
                </template>
              </GenericTableRow>
              
              <!-- Empty State for Desktop -->
              <tr v-if="!rows?.length && !pending" class="empty-state-row">
                <td :colspan="spec.head.length + 1" class="empty-state-cell">
                  <slot name="placeholder">
                    <div class="empty-state">
                      <div class="empty-icon" v-html="icons.no_data" />
                      <h3 class="empty-title">No Data Available</h3>
                      <p class="empty-subtitle">{{ placeholder || 'There are no items to display at the moment.' }}</p>
                    </div>
                  </slot>
                </td>
              </tr>
            </template>
          </slot>
          
          <!-- Loading State for Desktop -->
          <template v-if="pending">
            <component
              :cols="spec.head.length + 1"
              :key="num"
              v-for="num in 8"
              :is="Fallback"
            />
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Responsive Pagination -->
    <div v-if="showPagination && totalPages > 1" class="pagination-container">
      <!-- Mobile Pagination -->
      <div class="flex lg:hidden items-center justify-between w-full">
        <button 
          @click="previousPage"
          :disabled="page <= 1"
          class="pagination-btn-mobile"
          :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span class="text-sm font-medium text-gray-700">{{ page }} / {{ totalPages }}</span>
        
        <button 
          @click="nextPage"
          :disabled="page >= totalPages"
          class="pagination-btn-mobile"
          :class="{ 'opacity-50 cursor-not-allowed': page >= totalPages }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Desktop Pagination -->
      <div class="hidden lg:flex items-center justify-between w-full">
        <div class="pagination-info">
          <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
        </div>
        
        <div class="pagination-controls">
          <button 
            @click="previousPage"
            :disabled="page <= 1"
            class="pagination-btn pagination-btn-prev"
          >
            <svg class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <button 
            @click="nextPage"
            :disabled="page >= totalPages"
            class="pagination-btn pagination-btn-next"
          >
            <span>Next</span>
            <svg class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modern-table-container {
  @apply w-full space-y-4;
  overflow: visible !important;
}

.table-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-100;
  overflow: visible !important;
}

.modern-table {
  @apply w-full;
  overflow: visible !important;
}

/* Mobile pagination buttons */
.pagination-btn-mobile {
  @apply p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors;
}

/* Empty State Styles */
.empty-state-row {
  @apply bg-gray-50/50;
}

.empty-state-cell {
  @apply p-12 text-center;
}

.empty-state {
  @apply flex flex-col items-center justify-center space-y-4 max-w-md mx-auto;
}

.empty-icon {
  @apply w-16 h-16 lg:w-20 lg:h-20 text-gray-300;
}

.empty-title {
  @apply text-lg lg:text-xl font-semibold text-gray-700;
}

.empty-subtitle {
  @apply text-sm lg:text-base text-gray-500 text-center leading-relaxed;
}

/* Pagination Styles */
.pagination-container {
  @apply flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 bg-white rounded-xl border border-gray-100 shadow-sm;
}

.pagination-info {
  @apply flex items-center space-x-4;
}

.page-info {
  @apply text-sm font-medium text-gray-700;
}

.pagination-controls {
  @apply flex items-center space-x-3;
}

.pagination-btn {
  @apply flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.pagination-btn:not(:disabled) {
  @apply text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-blue-500;
}

.pagination-btn:disabled {
  @apply text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed;
}

.pagination-btn-prev:not(:disabled):hover .pagination-icon {
  @apply -translate-x-1;
}

.pagination-btn-next:not(:disabled):hover .pagination-icon {
  @apply translate-x-1;
}

.pagination-icon {
  @apply w-4 h-4 transition-transform duration-200;
}

/* Global table improvements */
:deep(.modern-table table) {
  @apply w-full border-collapse min-w-full;
}

:deep(.modern-table thead) {
  @apply bg-gray-50/80;
}

:deep(.modern-table th) {
  @apply px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200;
}

:deep(.modern-table tbody tr) {
  @apply border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150;
}

:deep(.modern-table tbody tr:last-child) {
  @apply border-b-0;
}

:deep(.modern-table td) {
  @apply px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-900;
}

/* Row hover effects */
:deep(.modern-table tbody tr:hover) {
  @apply bg-blue-50/30 cursor-pointer;
}

/* Skeleton loading improvements */
:deep(.modern-table .skeleton-row) {
  @apply animate-pulse;
}

:deep(.modern-table .skeleton-row td) {
  @apply py-4;
}

/* Mobile responsive adjustments */
@media (max-width: 1024px) {
  .modern-table-container {
    @apply space-y-3;
  }
  
  .pagination-container {
    @apply px-4 py-3;
  }
}
</style>

