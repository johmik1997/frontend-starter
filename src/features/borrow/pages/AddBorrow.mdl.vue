<script setup>
import { onMounted, computed, ref } from 'vue';
import Button from '@/components/Button.vue';
import NewFormParent from '../../roles/components/NewFormParent.vue';
import { closeModal } from '@customizer/modal-x';
import { useApiRequest } from '@/composables/useApiRequest';
import { createBorrow } from '../api/borrowApi';
import { getAllMaterials } from '../../material/api/materialApi';
import { getAllUser } from '../../users/Api/UserApi';
import { getAllReservation } from '@/features/reservation/api/reservationApi';
import { useBorrow } from '../store/borrowStore';
import { secondDateFormatWithTime, toasted } from '@/utils/utils';
import BorrowForm from '../components/borrowForm.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { 
  mdiCheckCircle,
  mdiArrowLeft,
  mdiAlertCircle,
  mdiCloseCircle
} from '@mdi/js';

const borrowStore = useBorrow();
const req = useApiRequest();
const materialReq = useApiRequest();
const memberReq = useApiRequest();
const reservationReq = useApiRequest();

const selectedMaterial = ref(null);
const selectedMember = ref(null);
const selectedReservation = ref(null);
const errorMessage = ref('');
const borrowMode = ref('direct'); // 'direct' | 'reservation'
const reservationSearch = ref('');

onMounted(() => {
  // Load materials and members
  loadMaterials();
  loadMembers();
  loadReservations();
});

async function loadMaterials() {
  try {
    await materialReq.send(() => getAllMaterials({ page: 1, size: 500 }, 'physical'));
  } catch (error) {
    console.error('Error loading materials:', error);
    toasted(false, 'Failed to load materials');
  }
}

async function loadMembers(search = '') {
  try {
    await memberReq.send(() => getAllUser({ page: 1, size: 50, role: 'MEMBER', search }));
  } catch (error) {
    console.error('Error loading members:', error);
    toasted(false, 'Failed to load members');
  }
}

async function loadReservations() {
  try {
    await reservationReq.send(() => getAllReservation({ page: 1, size: 200 }));
  } catch (error) {
    console.error('Error loading reservations:', error);
    toasted(false, 'Failed to load reservations');
  }
}

const materials = computed(() => {
  const payload = materialReq.response.value;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.results && Array.isArray(payload.results)) return payload.results;
  if (payload?.result && Array.isArray(payload.result)) return payload.result;
  
  return [];
});

const members = computed(() => {
  const payload = memberReq.response.value;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  
  return [];
});

const reservations = computed(() => {
  const payload = reservationReq.response.value;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
});

const activeReservations = computed(() => {
  return reservations.value.filter((row) => String(row?.status || '').toUpperCase() === 'RESERVED');
});

const filteredReservations = computed(() => {
  const query = reservationSearch.value.trim().toLowerCase();
  const rows = activeReservations.value;
  if (!query) return rows;
  return rows.filter((row) => {
    return [
      row?.member_id_number,
      row?.member_name,
      row?.material_title,
      row?.material_author,
    ]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(query));
  });
});

// Stats
const availableMaterialsCount = computed(() => {
  return materials.value.filter(m => m.available_copies > 0).length;
});

function resetDirectSelection() {
  selectedMaterial.value = null;
  selectedMember.value = null;
}

function resetReservationSelection() {
  selectedReservation.value = null;
}

function setBorrowMode(mode) {
  borrowMode.value = mode;
  errorMessage.value = '';
  if (mode === 'direct') {
    resetReservationSelection();
  } else {
    resetDirectSelection();
  }
}

async function handleSubmit({ material, member }) {
  // Clear previous error
  errorMessage.value = '';
  
  // Validate inputs
  if (!material || !member) {
    toasted(false, 'Please select both material and member');
    return;
  }
  const payload = { member: member.id, material: material.id };

  console.log('Submitting borrow payload:', payload);

  try {
     req.send(
      () => createBorrow(payload),
      (res) => {
        console.log('Success response:', res);
        toasted(true, 'Borrow created successfully');
        closeModal();
      }
    );
  } catch (error) {
    console.error('Borrow creation error:', error);
    
    // Log the full error response for debugging
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
      
      // Show specific error message from API
      const apiMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        error.response.data?.detail ||
                        JSON.stringify(error.response.data);
      toasted(false, `Failed: ${apiMessage}`);
      errorMessage.value = apiMessage;
      
    } else if (error.request) {
      console.log('No response received:', error.request);
      toasted(false, 'No response from server');
    } else {
      console.log('Error message:', error.message);
      toasted(false, error.message);
    }
  }
}

function handleReservationBorrow() {
  errorMessage.value = '';
  if (!selectedReservation.value?.id) {
    toasted(false, 'Please select a reservation');
    return;
  }

  const payload = { reservation: selectedReservation.value.id };

  req.send(
    () => createBorrow(payload),
    (res) => {
      console.log('Success response:', res);
      if (res?.success) {
        toasted(true, 'Borrow created successfully');
        closeModal();
      } else {
        const msg = res?.error || 'Failed to create borrow';
        toasted(false, msg);
        errorMessage.value = msg;
      }
    }
  );
}


// Helper to check loading states
const isLoading = computed(() => {
  return materialReq.pending.value || memberReq.pending.value || reservationReq.pending.value || req.pending.value;
});

// Format error message
const formattedErrorMessage = computed(() => {
  if (!errorMessage.value) return '';
  if (typeof errorMessage.value === 'string') return errorMessage.value;
  return JSON.stringify(errorMessage.value);
});
</script>

<template>
  <div class="w-[94vw] max-w-5xl max-h-[88vh] mx-auto my-12">
    <NewFormParent title="Borrow Materials" size="xs" class="w-full h-full max-h-[88vh]">
    
      <div class="px-6 py-4">
        <div class="mb-5">
          <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              class="px-4 py-2 text-sm font-medium rounded-md"
              :class="borrowMode === 'direct' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              @click="setBorrowMode('direct')"
            >
              Direct Borrow
            </button>
            <button
              class="px-4 py-2 text-sm font-medium rounded-md"
              :class="borrowMode === 'reservation' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              @click="setBorrowMode('reservation')"
            >
              From Reservation
            </button>
          </div>
        </div>

        <BorrowForm 
          v-if="borrowMode === 'direct'"
          :materials="materials"
          :members="members"
          :selected-material="selectedMaterial"
          :selected-member="selectedMember"
          :loading="isLoading"
          @update:selectedMaterial="selectedMaterial = $event; errorMessage = ''"
          @update:selectedMember="selectedMember = $event; errorMessage = ''"
          @submit="handleSubmit"
        />

        <div v-else class="space-y-4">
          <div class="relative max-w-md">
            <input
              v-model="reservationSearch"
              type="text"
              placeholder="Search by member ID, name, or material..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
            />
          </div>

          <div v-if="reservationReq.pending.value" class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <p class="text-sm text-blue-800">Loading reservations...</p>
          </div>

          <div v-else-if="activeReservations.length === 0" class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            No active reservations found.
          </div>

          <div v-else-if="filteredReservations.length === 0" class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            No reservations match your search.
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              v-for="resv in filteredReservations"
              :key="resv.id"
              type="button"
              class="text-left border rounded-xl p-4 shadow-sm transition-colors"
              :class="selectedReservation?.id === resv.id ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300'"
              @click="selectedReservation = resv; errorMessage = ''"
            >
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">{{ resv.material_title || 'Untitled Material' }}</h3>
                <span class="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {{ resv.status || 'RESERVED' }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ resv.member_name || 'Unknown Member' }}</p>
              <div class="text-xs text-gray-500 mt-2 space-y-1">
                <div>Expires: {{ secondDateFormatWithTime(resv.expiry_date) || '-' }}</div>
                <div>Reserved: {{ secondDateFormatWithTime(resv.reserve_date) || '-' }}</div>
              </div>
            </button>
          </div>

          <div class="flex justify-end">
            <button
              class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
              :disabled="!selectedReservation || req.pending.value"
              @click="handleReservationBorrow"
            >
              Create Borrow
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <BaseIcon :path="mdiCloseCircle" size="20" class="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-red-800">Error creating borrow</p>
            <p class="text-xs text-red-700 mt-1">{{ formattedErrorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="borrowMode === 'direct' && (materialReq.pending.value || memberReq.pending.value)" 
           class="mx-6 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
        <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
        <p class="text-sm text-blue-800">Loading library catalog...</p>
      </div>

      <!-- No Materials Warning -->
      <div v-if="borrowMode === 'direct' && !materialReq.pending.value && materials.length === 0" 
           class="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
        <BaseIcon :path="mdiAlertCircle" size="20" class="text-amber-600" />
        <p class="text-sm text-amber-800">No materials available. Please add materials to the catalog first.</p>
      </div>

      <!-- No Members Warning -->
      <div v-if="borrowMode === 'direct' && !memberReq.pending.value && members.length === 0" 
           class="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
        <BaseIcon :path="mdiAlertCircle" size="20" class="text-amber-600" />
        <p class="text-sm text-amber-800">No members found. Please add members to the system first.</p>
      </div>

      <!-- Error State -->
      <div v-if="materialReq.error.value || memberReq.error.value" 
           class="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <BaseIcon :path="mdiAlertCircle" size="20" class="text-red-600" />
        <p class="text-sm text-red-800">Error loading data. Please try again.</p>
      </div> 
    </NewFormParent>
  </div>
</template>
