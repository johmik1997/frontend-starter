<script setup>
import { ref, onMounted, computed } from 'vue';
import { toasted } from "@/utils/utils";
import Button from "@/components/Button.vue";
import { openModal } from "@customizer/modal-x";
import { useAuth } from '@/stores/auth';

const auth = useAuth();
const DRAFTS_STORAGE_KEY = 'quotation_drafts';
const drafts = ref([]);

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

// Load draft to edit
function loadDraftToEdit(draft) {
  console.log("Loading draft:", draft);

  if (!draft?.data) {
    console.error("Invalid draft structure:", draft);
    return;
  }

  const dataToEdit = {
    carRequests: Array.isArray(draft.data.carRequests) ? [...draft.data.carRequests] : [],
    bankAccount: draft.data.bankAccount || '',
    insuranceUuid: draft.data.insuranceUuid || '',
    step: draft.data.step || 1
  };

  console.log('Opening modal with data:', dataToEdit);

  openModal('addClientClientSide', {
    props: {
      data: {
        props: {
          data: dataToEdit
        }
      }
    }
  });
}

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

// Get draft summary
const getDraftSummary = (draft) => {
  const vehiclesCount = draft.data.carRequests?.length || 0;
  const insuranceName = draft.data.insuranceUuid ? 'Insurance Selected' : 'No Insurance';
  const bankAccount = draft.data.bankAccount ? 'Bank Added' : 'No Bank';
  
  return `${vehiclesCount} vehicle(s) • ${insuranceName} • ${bankAccount}`;
};

// Get step description
const getStepDescription = (step) => {
  switch (step) {
    case 1: return 'Insurance Selection';
    case 2: return 'Vehicle Details';
    case 3: return 'Bank Account';
    default: return `Step ${step}`;
  }
};

onMounted(() => {
  loadDrafts();
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Saved Drafts</h2>
        <p class="text-gray-600 mt-1">Continue where you left off with your saved quotations</p>
      </div>
      <div class="text-sm text-gray-500">
        {{ drafts.length }} {{ drafts.length === 1 ? 'draft' : 'drafts' }}
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-if="drafts.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-2">No drafts found</h3>
      <p class="text-gray-500 max-w-sm mx-auto">
        Your saved quotation drafts will appear here. Start a new quotation to create your first draft.
      </p>
    </div>
    
    <!-- Drafts List -->
    <div v-else class="space-y-4">
      <div 
        v-for="draft in drafts" 
        :key="draft.id" 
        class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Draft Header -->
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm3 6a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">
                  Quotation Draft
                </h3>
                <p class="text-sm text-gray-500">
                  {{ formatDate(draft.date) }}
                </p>
              </div>
            </div>

            <!-- Draft Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- Progress -->
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1">
                  <div 
                    v-for="i in 3" 
                    :key="i" 
                    class="w-6 h-2 rounded-full transition-all"
                    :class="i <= draft.data.step ? 'bg-primary' : 'bg-gray-200'"
                  ></div>
                </div>
                <span class="text-xs font-medium text-gray-600">
                  {{ getStepDescription(draft.data.step) }}
                </span>
              </div>

              <!-- Vehicles Count -->
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span>{{ draft.data.carRequests?.length || 0 }} vehicle(s)</span>
              </div>
            </div>

            <!-- Vehicle Preview -->
            <div v-if="draft.data.carRequests && draft.data.carRequests.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="(vehicle, index) in draft.data.carRequests.slice(0, 3)" 
                  :key="index"
                  class="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700 flex items-center gap-1"
                >
                  <span class="font-medium">{{ vehicle.carName }}</span>
                  <span class="text-gray-500">{{ vehicle.plateNumber }}</span>
                </div>
                <div 
                  v-if="draft.data.carRequests.length > 3"
                  class="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500"
                >
                  +{{ draft.data.carRequests.length - 3 }} more
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="flex flex-wrap gap-4 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                </svg>
                <span>{{ draft.data.insuranceUuid ? 'Insurance Selected' : 'No Insurance' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span>{{ draft.data.bankAccount ? 'Bank Account Added' : 'No Bank Account' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col gap-2 ml-6">
            <Button 
              @click="loadDraftToEdit(draft)" 
              type="primary" 
              size="sm"
              class="min-w-[80px] justify-center"
            >
              Continue
            </Button>
            <Button 
              @click="deleteDraft(draft.id)" 
              type="danger" 
              size="sm"
              class="min-w-[80px] justify-center"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Text -->
    <div v-if="drafts.length > 0" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <div class="text-sm text-blue-700">
          <p class="font-medium">Drafts are saved automatically</p>
          <p class="mt-1">Your progress is saved locally in your browser. Continue working on any draft by clicking "Continue".</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for better appearance */
.draft-list {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.draft-list::-webkit-scrollbar {
  width: 6px;
}

.draft-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.draft-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.draft-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>