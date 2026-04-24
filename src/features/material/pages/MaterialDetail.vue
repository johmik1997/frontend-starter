<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiRequest } from '@/composables/useApiRequest';
import { generateMaterialDescription, getMaterialById } from '../api/materialApi';
import { toasted } from '@/utils/utils';
import BaseIcon from '@/components/base/BaseIcon.vue';
import {
  mdiArrowLeft,
  mdiBookOpenPageVariant,
  mdiAccount,
  mdiTag,
  mdiBarcode,
  mdiPackageVariantClosed,
  mdiCash,
  mdiCalendarClock,
  mdiLockClock,
  mdiFilePdfBox,
  mdiOpenInNew,
} from '@mdi/js';
import defaultCover from '@/assets/default-coverpage.png';

const route = useRoute();
const router = useRouter();
const detailReq = useApiRequest();
const aiReq = useApiRequest();
const imageSrc = ref(defaultCover);
const generatedDescription = ref('');

const activeType = computed(() =>
  String(route.query?.type || 'physical').toLowerCase() === 'digital' ? 'digital' : 'physical'
);

const isPhysicalMaterial = computed(() => activeType.value === 'physical');

function extractRow(payload) {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload[0] || null;
  if (Array.isArray(payload?.content)) return payload.content[0] || null;
  if (Array.isArray(payload?.data)) return payload.data[0] || null;
  if (Array.isArray(payload?.results)) return payload.results[0] || null;
  return payload;
}

const material = computed(() => {
  const row = extractRow(detailReq.response.value);
  if (!row) return null;

  const total = Number(row?.total_copies || 0);
  const available = Number(row?.available_copies ?? total ?? 0);

  return {
    ...row,
    total_copies: Number.isNaN(total) ? 0 : total,
    available_copies: Number.isNaN(available) ? 0 : available,
  };
});

const materialId = computed(() => route.params.materialId);
const materialIdentity = computed(() => material.value?.id || material.value?.uuid || materialId.value);
const canBorrow = computed(() => isPhysicalMaterial.value && Number(material.value?.available_copies || 0) > 0);
const canReserve = computed(() => isPhysicalMaterial.value && Number(material.value?.available_copies || 0) <= 0);
const digitalFileUrl = computed(() =>
  toAbsoluteUrl(material.value?.file || material.value?.file_url || material.value?.download_url || '')
);
const hasDigitalFile = computed(() => !isPhysicalMaterial.value && Boolean(digitalFileUrl.value));
const isPdfMaterial = computed(() => {
  if (!hasDigitalFile.value) return false;
  const format = String(material.value?.format || '').toLowerCase();
  if (format === 'pdf') return true;
  return digitalFileUrl.value.toLowerCase().split('?')[0].endsWith('.pdf');
});

watch(
  material,
  (row) => {
    imageSrc.value = row?.cover_image || row?.image || row?.thumbnail || defaultCover;
  },
  { immediate: true }
);

function loadMaterial() {
  if (!materialId.value) return;

  detailReq.send(
    () => getMaterialById(materialId.value, activeType.value),
    (res) => {
      if (!res?.success) {
        toasted(false, 'Failed to load material details');
      }
    },
    true
  );
}

watch([materialId, activeType], loadMaterial, { immediate: true });
watch([materialId, activeType], () => {
  generatedDescription.value = '';
});

function goBack() {
  router.push('/material');
}

function onImageError() {
  imageSrc.value = defaultCover;
}

function resolveBackendOrigin() {
  const raw = import.meta.env.VITE_API_URL || import.meta.env.v_API_URL || '';
  if (!raw) return window.location.origin;
  try {
    return new URL(raw).origin;
  } catch {
    return window.location.origin;
  }
}

function toAbsoluteUrl(filePath) {
  if (!filePath) return '';
  const value = String(filePath).trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `${window.location.protocol}${value}`;
  return `${resolveBackendOrigin()}${value.startsWith('/') ? '' : '/'}${value}`;
}

function goToBorrow() {
  if (!canBorrow.value) return;
  router.push({
    path: '/borrows/add',
    query: { materialId: String(materialIdentity.value), type: activeType.value },
  });
}

function goToReserve() {
  if (!canReserve.value) return;
  router.push({
    path: '/reservations',
    query: { materialId: String(materialIdentity.value), type: activeType.value },
  });
}

function goToReadMaterial() {
  if (!isPdfMaterial.value) return;
  router.push({
    path: `/material/${String(materialIdentity.value)}/read`,
    query: { type: 'digital' },
  });
}

function openDigitalFile() {
  if (!digitalFileUrl.value) return;
  window.open(digitalFileUrl.value, '_blank', 'noopener');
}

function generateAiDescription() {
  const title = String(material.value?.title || '').trim();
  const author = String(material.value?.author || '').trim();

  if (!title || !author) {
    toasted(false, 'Title and author are required to generate a description.');
    return;
  }

  aiReq.send(
    () => generateMaterialDescription({ title, author }),
    (res) => {
      if (!res?.success) {
        toasted(false, 'Failed to generate description', res?.error || 'AI generation failed');
        return;
      }

      const description = String(res?.data?.description || '').trim();
      if (!description) {
        toasted(false, 'AI returned an empty description.');
        return;
      }

      generatedDescription.value = description;
      toasted(true, 'Description generated');
    }
  );
}
</script>

<template>
  <div class="p-4 sm:p-7">
    <div class="mb-4">
      <button class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2" @click="goBack">
        <BaseIcon :path="mdiArrowLeft" size="18" />
        Back to Materials
      </button>
    </div>

    <div v-if="detailReq.pending.value" class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
      <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
      <p class="text-sm text-blue-800">Loading material details...</p>
    </div>

    <div v-else-if="!material" class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800 text-sm">
      Material detail is not available.
    </div>

    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-3">
        <div class="lg:col-span-1 bg-gray-50 p-5">
          <div class="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
            <img
              :src="imageSrc"
              :alt="material?.title || 'Material cover'"
              class="w-full h-full object-cover"
              @error="onImageError"
            />
          </div>
        </div>

        <div class="lg:col-span-2 p-5 sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ material?.title || 'Untitled' }}</h1>
              <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <BaseIcon :path="mdiAccount" size="14" />
                {{ material?.author || '-' }}
              </p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
              :class="material?.available_copies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ material?.available_copies > 0 ? 'Available' : 'Unavailable' }}
            </span>
          </div>

          <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div class="bg-gray-50 rounded-lg border border-gray-100 p-3 flex items-center gap-2">
              <BaseIcon :path="mdiTag" size="16" class="text-gray-500" />
              <span class="text-gray-600">Category:</span>
              <span class="font-medium text-gray-900">{{ material?.category || material?.genre || '-' }}</span>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-100 p-3 flex items-center gap-2">
              <BaseIcon :path="mdiBarcode" size="16" class="text-gray-500" />
              <span class="text-gray-600">ISBN:</span>
              <span class="font-medium text-gray-900">{{ material?.isbn || 'N/A' }}</span>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-100 p-3 flex items-center gap-2">
              <BaseIcon :path="mdiPackageVariantClosed" size="16" class="text-gray-500" />
              <span class="text-gray-600">Stock:</span>
              <span class="font-medium text-gray-900">{{ material?.available_copies }}/{{ material?.total_copies }}</span>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-100 p-3 flex items-center gap-2">
              <BaseIcon :path="mdiCash" size="16" class="text-gray-500" />
              <span class="text-gray-600">Price:</span>
              <span class="font-medium text-gray-900">{{ material?.price ? `$${material.price}` : 'Free' }}</span>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-100 p-3 flex items-center gap-2">
              <BaseIcon :path="mdiBookOpenPageVariant" size="16" class="text-gray-500" />
              <span class="text-gray-600">Type:</span>
              <span class="font-medium text-gray-900 capitalize">{{ activeType }}</span>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-100 p-3 flex items-center gap-2">
              <BaseIcon :path="mdiCalendarClock" size="16" class="text-gray-500" />
              <span class="text-gray-600">Condition:</span>
              <span class="font-medium text-gray-900">{{ material?.condition || 'Good' }}</span>
            </div>
          </div>

          <div class="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 class="text-sm font-semibold text-gray-900">AI Description</h2>
              <button
                class="px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="aiReq.pending.value || !material?.title || !material?.author"
                @click="generateAiDescription"
              >
                {{ aiReq.pending.value ? 'Generating...' : 'Generate with AI' }}
              </button>
            </div>
            <p v-if="generatedDescription" class="mt-3 text-sm leading-6 text-gray-700 whitespace-pre-line">
              {{ generatedDescription }}
            </p>
            <p v-else class="mt-3 text-xs text-gray-500">
              Generate a short summary based on this material's title and author.
            </p>
          </div>

          <div v-if="isPhysicalMaterial" class="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors"
              :class="canBorrow ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              :disabled="!canBorrow"
              @click="goToBorrow"
            >
              Borrow
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              :class="canReserve ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              :disabled="!canReserve"
              @click="goToReserve"
            >
              <BaseIcon :path="mdiLockClock" size="16" />
              Reserve
            </button>
          </div>

          <div v-else class="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              :class="isPdfMaterial ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              :disabled="!isPdfMaterial"
              @click="goToReadMaterial"
            >
              <BaseIcon :path="mdiFilePdfBox" size="16" />
              Read PDF
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              :class="hasDigitalFile ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              :disabled="!hasDigitalFile"
              @click="openDigitalFile"
            >
              <BaseIcon :path="mdiOpenInNew" size="16" />
              Open File
            </button>
          </div>

          <p v-if="!isPhysicalMaterial && !hasDigitalFile" class="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            No digital file is attached to this material yet.
          </p>
          <p v-else-if="!isPhysicalMaterial && !isPdfMaterial" class="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            This digital material is not a PDF, so use Open File to view or download it.
          </p>
          <p v-else-if="!isPhysicalMaterial" class="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
            PDF reader is available for this digital material.
          </p>
          <p v-else-if="canBorrow" class="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
            This material can be borrowed right now.
          </p>
          <p v-else class="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
            No copies are available now. Use reserve to place a queue request.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
