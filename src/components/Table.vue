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
    <!-- Table Card -->
    <div class="table-card">
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
            
         <!-- Empty State -->
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
        
        <!-- Loading State -->
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

    <!-- Modern Pagination -->
    <div v-if="showPagination && totalPages > 1" class="pagination-container">
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
  @apply w-20 h-20 text-gray-300;
}

.empty-title {
  @apply text-xl font-semibold text-gray-700;
}

.empty-subtitle {
  @apply text-gray-500 text-center leading-relaxed;
}

/* Pagination Styles */
.pagination-container {
  @apply flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-gray-100 shadow-sm;
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
  @apply flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
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
  @apply w-full border-collapse;
}

:deep(.modern-table thead) {
  @apply bg-gray-50/80;
}

:deep(.modern-table th) {
  @apply px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200;
}

:deep(.modern-table tbody tr) {
  @apply border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150;
}

:deep(.modern-table tbody tr:last-child) {
  @apply border-b-0;
}

:deep(.modern-table td) {
  @apply px-6 py-4 text-sm text-gray-900;
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
</style>


