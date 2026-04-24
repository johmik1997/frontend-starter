<script setup>
import { ref, computed } from 'vue';
import Form from '@/components/new_form_builder/Form.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { 
  mdiMagnify, 
  mdiClose,
  mdiBook,
  mdiCheckCircle
} from '@mdi/js';

import LibraryHeader from './BorrowHeader.vue';
import MaterialCard from './MaterialCard.vue';
import BorrowSummary from './BorrowSummary.vue';
import MemberSearchModal from './MemberSearchModal.vue';

const props = defineProps({
  materials: { type: Array, default: () => [] },
  members: { type: Array, default: () => [] },
  selectedMaterial: { type: Object, default: null },
  selectedMember: { type: Object, default: null },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:selectedMaterial', 'update:selectedMember', 'submit']);

// Local State
const searchQuery = ref('');
const viewMode = ref('grid');
const showMemberModal = ref(false);

const currentStep = computed(() => {
  if (!props.selectedMaterial) return 1;
  if (!props.selectedMember) return 2;
  return 3;
});

// Filter Logic
const filteredMaterials = computed(() => {
  if (!searchQuery.value) return props.materials;
  const q = searchQuery.value.toLowerCase();
  return props.materials.filter(m => 
    m.title?.toLowerCase().includes(q) || 
    m.author?.toLowerCase().includes(q) ||
    m.isbn?.toLowerCase().includes(q)
  );
});

const stats = computed(() => ({
  total: props.materials.length,
  available: props.materials.filter(m => m.available_copies > 0).length,
  borrowed: props.materials.filter(m => m.total_copies - m.available_copies > 0).length,
  categories: new Set(props.materials.map(m => m.category)).size
}));

// Actions
function handleSelectMaterial(material) {
  emit('update:selectedMaterial', material);
}

function handleSelectMember(member) {
  emit('update:selectedMember', member);
  showMemberModal.value = false;
}

function handleFinalSubmit() {
  emit('submit', { 
    material: props.selectedMaterial, 
    member: props.selectedMember 
  });
}

function clearSearch() {
  searchQuery.value = '';
}

function resetToMaterialSelection() {
  emit('update:selectedMaterial', null);
  emit('update:selectedMember', null);
}
</script>

<template>
  <Form @submit.prevent class="relative" id="borrowform" :inner="false">
    
    <!-- Header Section -->
    <div class="mb-6">
      <LibraryHeader 
        :stats="stats" 
        v-model:viewMode="viewMode" 
      />
    </div>

    <!-- Step Navigation -->
    <div class="mb-6 bg-white border border-gray-200 rounded-xl p-4">
      <div class="grid grid-cols-3 gap-2">
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
            :class="currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
          >
            1
          </div>
          <span class="text-sm font-medium" :class="currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'">Pick Material</span>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
            :class="currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
          >
            2
          </div>
          <span class="text-sm font-medium" :class="currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'">Review Summary</span>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
            :class="currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
          >
            <BaseIcon v-if="currentStep >= 3" :path="mdiCheckCircle" size="14" />
            <span v-else>3</span>
          </div>
          <span class="text-sm font-medium" :class="currentStep >= 3 ? 'text-green-700' : 'text-gray-500'">Complete Borrow</span>
        </div>
      </div>
    </div>

    <!-- Step 1: Material Selection -->
    <div v-if="!selectedMaterial">
      <div class="mb-3 text-sm text-gray-600">
        Select a material card to continue.
      </div>
      <div class="mb-6">
      <div class="relative">
        <BaseIcon 
          :path="mdiMagnify" 
          size="20" 
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title, author, or ISBN..."
          class="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-shadow"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BaseIcon :path="mdiClose" size="18" class="text-gray-400" />
        </button>
      </div>
      </div>
      <div class="flex-1 min-w-0 transition-all duration-300">
        <!-- Loading State -->
        <div v-if="props.loading" class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          <p class="text-sm text-blue-800">Loading catalog...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredMaterials.length === 0" class="py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div class="bg-white w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <BaseIcon :path="mdiBook" size="32" class="text-gray-300" />
          </div>
          <p class="text-gray-600 font-medium">No materials found</p>
          <p class="text-sm text-gray-400 mt-1">Try adjusting your search</p>
        </div>

        <!-- Materials Grid/List -->
        <div v-else>
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MaterialCard 
              v-for="item in filteredMaterials" 
              :key="item.id"
              :material="item"
              :is-selected="selectedMaterial?.id === item.id"
              :view-mode="viewMode"
              @select="handleSelectMaterial"
            />
          </div>

          <div v-else class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                  <th class="text-left px-4 py-3 font-semibold text-gray-700">Author</th>
                  <th class="text-left px-4 py-3 font-semibold text-gray-700">Category</th>
                  <th class="text-left px-4 py-3 font-semibold text-gray-700">Available</th>
                  <th class="text-left px-4 py-3 font-semibold text-gray-700">Total</th>
                  <th class="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th class="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in filteredMaterials"
                  :key="item.id"
                  class="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                  :class="selectedMaterial?.id === item.id ? 'bg-blue-50' : ''"
                >
                  <td class="px-4 py-3 font-medium text-gray-900">{{ item.title || 'Untitled' }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ item.author || '-' }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ item.category || 'General' }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ item.available_copies || 0 }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ item.total_copies || 0 }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="text-xs font-semibold px-2 py-1 rounded-full"
                      :class="item.available_copies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    >
                      {{ item.available_copies > 0 ? 'Available' : 'Unavailable' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <button
                      class="text-xs px-3 py-1.5 rounded-lg font-medium"
                      :class="item.available_copies > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
                      :disabled="item.available_copies <= 0"
                      @click="handleSelectMaterial(item)"
                    >
                      {{ selectedMaterial?.id === item.id ? 'Selected' : 'Select' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2/3: Combined Review Summary -->
    <div v-else class="max-w-6xl mx-auto">
      <BorrowSummary 
        :material="selectedMaterial"
        :member="selectedMember"
        @change-member="showMemberModal = true"
        @submit="handleFinalSubmit"
        @clear="resetToMaterialSelection"
      />
    </div>

    <!-- Member Search Modal -->
    <MemberSearchModal
      v-if="showMemberModal"
      :members="members"
      @select="handleSelectMember"
      @close="showMemberModal = false"
    />
  </Form>
</template>
