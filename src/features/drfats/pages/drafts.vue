<script setup>
import { ref, onMounted, computed } from 'vue';
import { toasted } from "@/utils/utils";
import Button from "@/components/Button.vue";
import { openModal } from "@customizer/modal-x";

const DRAFTS_STORAGE_KEY = 'quotation_drafts';
const drafts = ref([]);
const searchQuery = ref('');
const sortBy = ref('date');
const sortOrder = ref('desc');

// Load drafts from localStorage
function loadDrafts() {
  try {
    const savedDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
    const parsedDrafts = JSON.parse(savedDrafts || '[]');
    
    console.log("Loaded drafts:", parsedDrafts);
    
    drafts.value = parsedDrafts.map(draft => {
      console.log("Processing draft:", draft);
      return draft;
    });
  } catch (error) {
    console.error('Error loading drafts:', error);
    drafts.value = [];
  }
}

// Delete draft
function deleteDraft(id) {
  try {
    const updatedDrafts = drafts.value.filter(draft => draft.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
    drafts.value = updatedDrafts;
    toasted(true, "Draft deleted successfully!");
  } catch (error) {
    toasted(false, "Error deleting draft");
  }
}

// Delete all drafts
function deleteAllDrafts() {
  if (drafts.value.length === 0) return;
  
  if (confirm(`Are you sure you want to delete all ${drafts.value.length} drafts? This action cannot be undone.`)) {
    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify([]));
      drafts.value = [];
      toasted(true, "All drafts deleted successfully!");
    } catch (error) {
      toasted(false, "Error deleting drafts");
    }
  }
}

// Load draft to edit
function loadDraftToEdit(draft) {
  console.log("Loading draft:", draft);

  if (!draft?.data) {
    console.error("Invalid draft structure:", draft);
    return;
  }

  const dataToEdit = {
    personalDetails: {
      userUuid: draft.data.personalDetails?.userUuid || '',
      firstName: draft.data.personalDetails?.firstName || '',
      fatherName: draft.data.personalDetails?.fatherName || '',
      email: draft.data.personalDetails?.email || '',
      mobilePhone: draft.data.personalDetails?.mobilePhone || '',
      insuranceUuid: draft.data.personalDetails?.insuranceUuid || ''
    },
    carRequests: Array.isArray(draft.data.carRequests) ? [...draft.data.carRequests] : [],
    bankAccount: draft.data.bankAccount || '',
    step: draft.data.step || 1
  };

  console.log('Opening modal with data:', dataToEdit);

  openModal('addClient', {
    props: {
      data: {
        props: {
          data: dataToEdit
        }
      }
    }
  });
}

// Filtered and sorted drafts
const filteredDrafts = computed(() => {
  let filtered = drafts.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(draft => {
      const vehicleNames = draft.data.carRequests?.map(v => 
        `${v.carName} ${v.carModel} ${v.plateNumber}`.toLowerCase()
      ).join(' ') || '';
      
      return vehicleNames.includes(query) || 
             draft.data.bankAccount?.toLowerCase().includes(query) ||
             new Date(draft.date).toLocaleDateString().toLowerCase().includes(query);
    });
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy.value) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'vehicles':
        aValue = a.data.carRequests?.length || 0;
        bValue = b.data.carRequests?.length || 0;
        break;
      case 'step':
        aValue = a.data.step || 1;
        bValue = b.data.step || 1;
        break;
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
});

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get step description
const getStepDescription = (step) => {
  switch (step) {
    case 1: return 'Personal Information';
    case 2: return 'Insurance Selection';
    case 3: return 'Vehicle Details';
    case 4: return 'Bank Account';
    case 5: return 'Upload Libre';
    default: return `Step ${step}`;
  }
};

// Get progress percentage
const getProgressPercentage = (step) => {
  const steps = 5; // Total steps in your modal
  return Math.round((step / steps) * 100);
};

// Toggle sort order
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}

onMounted(() => {
  loadDrafts();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Saved Drafts</h1>
            <p class="text-gray-600 mt-2">Manage your quotation drafts and continue where you left off</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {{ filteredDrafts.length }} {{ filteredDrafts.length === 1 ? 'draft' : 'drafts' }}
            </div>
            <Button 
              v-if="drafts.length > 0"
              @click="deleteAllDrafts" 
              type="danger" 
              size="sm"
              class="flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              Delete All
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search drafts by vehicle, bank account, or date..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <!-- Sort Controls -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">Sort by:</label>
            <select v-model="sortBy" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="date">Date</option>
              <option value="vehicles">Vehicles</option>
              <option value="step">Progress</option>
            </select>
          </div>
          <button
            @click="toggleSortOrder"
            class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            :title="sortOrder === 'asc' ? 'Ascending' : 'Descending'"
          >
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" :class="{ 'transform rotate-180': sortOrder === 'desc' }">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredDrafts.length === 0" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-2xl font-semibold text-gray-700 mb-3">No drafts found</h3>
          <p class="text-gray-500 mb-8">
            {{ searchQuery ? 'No drafts match your search criteria.' : 'Your saved quotation drafts will appear here. Start a new quotation to create your first draft.' }}
          </p>
          <Button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            type="secondary"
            size="lg"
          >
            Clear Search
          </Button>
        </div>
      </div>

      <!-- Drafts Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="draft in filteredDrafts" 
          :key="draft.id" 
          class="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group"
        >
          <!-- Header -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm3 6a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">Quotation Draft</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(draft.date) }}</p>
                </div>
              </div>
            </div>

            <!-- Progress -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium text-gray-700">{{ getStepDescription(draft.data.step) }}</span>
                <span class="text-primary font-semibold">{{ getProgressPercentage(draft.data.step) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${getProgressPercentage(draft.data.step)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Vehicle Summary -->
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span class="font-semibold text-gray-700">Vehicles ({{ draft.data.carRequests?.length || 0 }})</span>
              </div>
              
              <div v-if="draft.data.carRequests && draft.data.carRequests.length > 0" class="space-y-2">
                <div 
                  v-for="(vehicle, index) in draft.data.carRequests.slice(0, 2)" 
                  :key="index"
                  class="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-primary rounded-full"></div>
                    <span class="font-medium text-gray-800">{{ vehicle.carName }}</span>
                    <span class="text-gray-500">{{ vehicle.carModel }}</span>
                  </div>
                  <span class="text-gray-500 text-xs">{{ vehicle.plateNumber }}</span>
                </div>
                <div 
                  v-if="draft.data.carRequests.length > 2"
                  class="text-center text-xs text-gray-500 bg-gray-100 py-1 rounded"
                >
                  +{{ draft.data.carRequests.length - 2 }} more vehicles
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 italic bg-gray-50 p-2 rounded-lg">
                No vehicles added
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Insurance:</span>
                <span class="font-medium" :class="draft.data.personalDetails?.insuranceUuid ? 'text-green-600' : 'text-gray-400'">
                  {{ draft.data.personalDetails?.insuranceUuid ? 'Selected' : 'Not Selected' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Bank Account:</span>
                <span class="font-medium" :class="draft.data.bankAccount ? 'text-green-600' : 'text-gray-400'">
                  {{ draft.data.bankAccount ? 'Added' : 'Not Added' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Last Updated:</span>
                <span class="font-medium text-gray-800">{{ formatDate(draft.date) }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div class="flex gap-3">
              <Button 
                @click="loadDraftToEdit(draft)" 
                type="primary" 
                size="md"
                class="flex-1 justify-center group-hover:shadow-lg transition-shadow"
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
                </svg>
                Continue
              </Button>
              <Button 
                @click="deleteDraft(draft.id)" 
                type="danger" 
                size="md"
                class="px-4 hover:scale-105 transition-transform"
                title="Delete draft"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div v-if="drafts.length > 0" class="mt-12 max-w-4xl mx-auto">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-blue-900 mb-3">About Drafts</h3>
              <div class="space-y-3 text-blue-800">
                <p>• Drafts are automatically saved when you click "Save as Draft" in the quotation form</p>
                <p>• Your progress is stored locally in your browser for privacy and security</p>
                <p>• Continue working on any draft by clicking "Continue" - you'll pick up right where you left off</p>
                <p>• Drafts help you manage multiple quotations without losing your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for interactive elements */
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>