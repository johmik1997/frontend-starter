<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiRequest } from '@/composables/useApiRequest';
import { normalizeRoleValue } from '@/utils/authNavigation';
import {
  createMaterialBookmark,
  createMaterialFavorite,
  createMaterialFeedback,
  generateMaterialDescription,
  getMaterialBookmarks,
  getMaterialById,
  getMaterialFavorites,
  getMaterialFeedback,
  getMaterialInteractionStats,
  removeMaterialBookmark,
  removeMaterialFavorite,
  updateMaterialFeedback,
} from '../api/materialApi';
import { toasted } from '@/utils/utils';
import BaseIcon from '@/components/base/BaseIcon.vue';
import {
  mdiAccount,
  mdiArrowLeft,
  mdiBarcode,
  mdiBookOpenPageVariant,
  mdiBookmarkOutline,
  mdiBookmark,
  mdiCalendarClock,
  mdiCommentTextOutline,
  mdiFilePdfBox,
  mdiHeartOutline,
  mdiHeart,
  mdiLockClock,
  mdiMapMarkerOutline,
  mdiOpenInNew,
  mdiPackageVariantClosed,
  mdiSchoolOutline,
  mdiStar,
  mdiStarOutline,
  mdiTag,
  mdiTranslate,
} from '@mdi/js';
import defaultCover from '@/assets/default-coverpage.png';

const route = useRoute();
const router = useRouter();
const detailReq = useApiRequest();
const aiReq = useApiRequest();
const statsReq = useApiRequest();
const myFeedbackReq = useApiRequest();
const allFeedbackReq = useApiRequest();
const favoriteReq = useApiRequest();
const bookmarkReq = useApiRequest();
const reviewReq = useApiRequest();

const imageSrc = ref(defaultCover);
const generatedDescription = ref('');
const favoriteRecordId = ref(null);
const bookmarkRecordId = ref(null);
const feedbackRecordId = ref(null);
const hasGeneratedSummary = ref(false);
const reviewForm = reactive({
  rating: 5,
  comment: '',
});

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

function rowsFromPayload(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const material = computed(() => {
  const row = extractRow(detailReq.response.value);
  if (!row) return null;

  const total = normalizeNumber(row?.total_copies, 0);
  const available = normalizeNumber(row?.available_copies ?? total, 0);

  return {
    ...row,
    total_copies: total,
    available_copies: available,
  };
});

const interactionStats = computed(() => statsReq.response.value || {});
const feedbackRows = computed(() => rowsFromPayload(allFeedbackReq.response.value));

const summaryText = computed(() => {
  const storedDescription = String(material.value?.description || '').trim();
  const generated = String(generatedDescription.value || '').trim();
  return storedDescription || generated || 'No summary available yet.';
});

const materialId = computed(() => route.params.materialId);
const materialIdentity = computed(() => material.value?.id || material.value?.uuid || materialId.value);
const currentUserRole = computed(() => {
  const stored = JSON.parse(localStorage.getItem('userDetail') || '{}');
  const user = stored?.user || stored || {};
  return normalizeRoleValue(user?.roleName || user?.role || user?.userRole);
});
const currentUserIsMember = computed(() => currentUserRole.value === 'MEMBER');
const canBorrow = computed(() => isPhysicalMaterial.value && Number(material.value?.available_copies || 0) > 0 && !currentUserIsMember.value);
const canReserve = computed(() => isPhysicalMaterial.value && Number(material.value?.available_copies || 0) <= 0 && !currentUserIsMember.value);
const canShowDigitalActions = computed(() => !isPhysicalMaterial.value);
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

const statsCards = computed(() => [
  {
    label: 'Average rating',
    value: Number(interactionStats.value?.average_rating || 0).toFixed(1),
    tone: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'Favorites',
    value: normalizeNumber(interactionStats.value?.favorites_count),
    tone: 'bg-rose-50 text-rose-700',
  },
  {
    label: 'Bookmarks',
    value: normalizeNumber(interactionStats.value?.bookmarks_count),
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    label: 'Comments',
    value: normalizeNumber(interactionStats.value?.comments_count),
    tone: 'bg-emerald-50 text-emerald-700',
  },
]);

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

function loadInteractions() {
  if (!materialIdentity.value) return;

  statsReq.send(() => getMaterialInteractionStats(materialIdentity.value, activeType.value));
  myFeedbackReq.send(
    () => getMaterialFeedback({ material_id: materialIdentity.value, material_type: activeType.value, mine: true }),
    (res) => {
      const row = rowsFromPayload(res?.data || res)?.[0] || null;
      feedbackRecordId.value = row?.id || null;
      reviewForm.rating = normalizeNumber(row?.rating, normalizeNumber(statsReq.response.value?.my_rating, 5) || 5);
      reviewForm.comment = row?.comment || statsReq.response.value?.my_comment || '';
    }
  );
  allFeedbackReq.send(() => getMaterialFeedback({ material_id: materialIdentity.value, material_type: activeType.value }));
  favoriteReq.send(
    () => getMaterialFavorites({ material_id: materialIdentity.value, material_type: activeType.value }),
    (res) => {
      favoriteRecordId.value = rowsFromPayload(res?.data || res)?.[0]?.id || null;
    }
  );
  bookmarkReq.send(
    () => getMaterialBookmarks({ material_id: materialIdentity.value, material_type: activeType.value }),
    (res) => {
      bookmarkRecordId.value = rowsFromPayload(res?.data || res)?.[0]?.id || null;
    }
  );
}

watch([materialId, activeType], loadMaterial, { immediate: true });
watch([materialIdentity, activeType], () => {
  generatedDescription.value = '';
  hasGeneratedSummary.value = false;
  if (materialIdentity.value) {
    loadInteractions();
  }
});

watch([materialIdentity, material], ([id, mat]) => {
  if (!id) return;
  if (mat?.description?.trim()) {
    generatedDescription.value = mat.description;
    return;
  }

  if (!hasGeneratedSummary.value && material.value?.title && material.value?.author) {
    hasGeneratedSummary.value = true;
    generateAiDescription();
  }
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

function toggleFavorite() {
  const request = favoriteRecordId.value
    ? () => removeMaterialFavorite(favoriteRecordId.value)
    : () => createMaterialFavorite({ material_id: materialIdentity.value, material_type: activeType.value });

  favoriteReq.send(request, (res) => {
    if (!res?.success) {
      toasted(false, 'Failed to update favorites', res?.error || 'Unknown error');
      return;
    }

    toasted(true, favoriteRecordId.value ? 'Removed from favorites' : 'Added to favorites');
    loadInteractions();
  });
}

function toggleBookmark() {
  const request = bookmarkRecordId.value
    ? () => removeMaterialBookmark(bookmarkRecordId.value)
    : () => createMaterialBookmark({ material_id: materialIdentity.value, material_type: activeType.value });

  bookmarkReq.send(request, (res) => {
    if (!res?.success) {
      toasted(false, 'Failed to update bookmarks', res?.error || 'Unknown error');
      return;
    }

    toasted(true, bookmarkRecordId.value ? 'Removed from bookmarks' : 'Bookmarked for later');
    loadInteractions();
  });
}

function setRating(value) {
  reviewForm.rating = value;
}

function saveReview() {
  if (!materialIdentity.value) return;
  if (!reviewForm.rating) {
    toasted(false, 'Please select a rating first.');
    return;
  }

  const payload = {
    material_id: materialIdentity.value,
    material_type: activeType.value,
    rating: reviewForm.rating,
    comment: reviewForm.comment?.trim() || '',
  };

  const request = feedbackRecordId.value
    ? () => updateMaterialFeedback(feedbackRecordId.value, payload)
    : () => createMaterialFeedback(payload);

  reviewReq.send(request, (res) => {
    if (!res?.success) {
      toasted(false, 'Failed to save review', res?.error || 'Unknown error');
      return;
    }

    toasted(true, feedbackRecordId.value ? 'Review updated successfully' : 'Review submitted successfully');
    loadInteractions();
  });
}
</script>

<template>
  <div class="space-y-6 p-4 sm:p-7">
    <button class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900" @click="goBack">
      <BaseIcon :path="mdiArrowLeft" size="18" />
      Back to Materials
    </button>

    <div v-if="detailReq.pending.value" class="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
      Loading material details...
    </div>

    <div v-else-if="!material" class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
      Material detail is not available.
    </div>

    <template v-else>
      <section class="overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_28%),linear-gradient(150deg,_#0f172a,_#111827_46%,_#1d4ed8)] shadow-xl">
        <div class="grid grid-cols-1 gap-0 lg:grid-cols-[320px_1fr]">
          <div class="border-b border-white/10 bg-black/10 p-6 lg:border-b-0 lg:border-r">
            <div class="aspect-[3/4] overflow-hidden rounded-[28px] bg-slate-900/30 shadow-2xl">
              <img
                :src="imageSrc"
                :alt="material?.title || 'Material cover'"
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
                    v-if="isPhysicalMaterial"
                    class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                    :class="material?.available_copies > 0 ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'"
                  >
                    {{ material?.available_copies > 0 ? 'Available now' : 'Waitlist only' }}
                  </span>
                  <span
                    v-else
                    class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] bg-slate-700/15 text-slate-100"
                  >
                    Digital access
                  </span>
                  <span v-if="material?.library_name" class="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-slate-100">
                    {{ material?.library_name }}
                  </span>
                </div>

                <h1 class="mt-4 text-3xl font-bold tracking-tight">{{ material?.title || 'Untitled' }}</h1>
                <p class="mt-3 flex items-center gap-2 text-sm text-slate-200/90">
                  <BaseIcon :path="mdiAccount" size="16" />
                  {{ material?.author || '-' }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
                  @click="toggleFavorite"
                >
                  <BaseIcon :path="favoriteRecordId ? mdiHeart : mdiHeartOutline" size="18" />
                  {{ favoriteRecordId ? 'Favorited' : 'Favorite' }}
                </button>
                <button
                  class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
                  @click="toggleBookmark"
                >
                  <BaseIcon :path="bookmarkRecordId ? mdiBookmark : mdiBookmarkOutline" size="18" />
                  {{ bookmarkRecordId ? 'Bookmarked' : 'Bookmark' }}
                </button>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div
                v-for="card in statsCards"
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
                <p class="mt-2 font-semibold">{{ material?.category || '-' }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiSchoolOutline" size="16" /> Department</p>
                <p class="mt-2 font-semibold">{{ material?.department || '-' }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiTranslate" size="16" /> Language</p>
                <p class="mt-2 font-semibold">{{ material?.language || '-' }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiBarcode" size="16" /> ISBN</p>
                <p class="mt-2 font-semibold">{{ material?.isbn || 'N/A' }}</p>
              </div>
              <div v-if="isPhysicalMaterial" class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiPackageVariantClosed" size="16" /> Stock</p>
                <p class="mt-2 font-semibold">{{ material?.available_copies }}/{{ material?.total_copies }}</p>
              </div>
              <div v-else class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiFilePdfBox" size="16" /> Digital file</p>
                <p class="mt-2 font-semibold">{{ material?.format || 'PDF' }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiCalendarClock" size="16" /> Published</p>
                <p class="mt-2 font-semibold">{{ material?.published_date || '-' }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiBookOpenPageVariant" size="16" /> Genre</p>
                <p class="mt-2 font-semibold">{{ material?.genre || '-' }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiMapMarkerOutline" size="16" /> Shelf / Location</p>
                <p class="mt-2 font-semibold">{{ material?.location || material?.library_name || '-' }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p class="flex items-center gap-2 text-slate-200/70"><BaseIcon :path="mdiCommentTextOutline" size="16" /> Condition / Format</p>
                <p class="mt-2 font-semibold">{{ isPhysicalMaterial ? material?.condition || 'GOOD' : material?.format || 'DIGITAL' }}</p>
              </div>
            </div>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row" v-if="(!isPhysicalMaterial && canShowDigitalActions) || (isPhysicalMaterial && !currentUserIsMember)">
              <template v-if="isPhysicalMaterial">
                <button
                  class="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!canBorrow"
                  @click="goToBorrow"
                >
                  Borrow now
                </button>
                <button
                  class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!canReserve"
                  @click="goToReserve"
                >
                  <BaseIcon :path="mdiLockClock" size="16" />
                  Join reservation queue
                </button>
              </template>

              <template v-else>
                <button
                  class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!isPdfMaterial"
                  @click="goToReadMaterial"
                >
                  <BaseIcon :path="mdiFilePdfBox" size="16" />
                  Read PDF
                </button>
                <button
                  class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!hasDigitalFile"
                  @click="openDigitalFile"
                >
                  <BaseIcon :path="mdiOpenInNew" size="16" />
                  Open file
                </button>
              </template>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div class="space-y-6">
          <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Reader sentiment</h2>
                <p class="text-sm text-slate-500">Collect ratings and comments directly on the material profile.</p>
              </div>
            </div>

            <div class="mt-5 flex items-center gap-2">
              <button
                v-for="value in [1, 2, 3, 4, 5]"
                :key="value"
                class="rounded-full p-2 transition hover:bg-amber-50"
                @click="setRating(value)"
              >
                <BaseIcon :path="reviewForm.rating >= value ? mdiStar : mdiStarOutline" size="24" class="text-amber-500" />
              </button>
            </div>

            <textarea
              v-model="reviewForm.comment"
              rows="5"
              class="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              placeholder="Share what makes this material useful, memorable, or difficult."
            />

            <div class="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                class="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="reviewReq.pending.value"
                @click="saveReview"
              >
                {{ reviewReq.pending.value ? 'Saving review...' : feedbackRecordId ? 'Update review' : 'Submit review' }}
              </button>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex flex-col gap-2">
              <h2 class="text-xl font-semibold text-slate-900">Community comments</h2>
              <p class="text-sm text-slate-500">Latest reader notes for this material.</p>
            </div>

            <div class="mt-5 space-y-3">
              <article
                v-for="row in feedbackRows"
                :key="row?.id"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">{{ row?.user_name || 'Reader' }}</h3>
                    <div class="mt-2 flex items-center gap-1">
                      <BaseIcon
                        v-for="value in [1, 2, 3, 4, 5]"
                        :key="`${row?.id}-${value}`"
                        :path="Number(row?.rating || 0) >= value ? mdiStar : mdiStarOutline"
                        size="15"
                        class="text-amber-500"
                      />
                    </div>
                  </div>
                  <span class="text-xs text-slate-400">{{ row?.updated_at?.slice?.(0, 10) || '' }}</span>
                </div>

                <p class="mt-3 text-sm leading-6 text-slate-600">
                  {{ row?.comment || 'This reader left a rating without a written note.' }}
                </p>
              </article>

              <div
                v-if="!feedbackRows.length && !allFeedbackReq.pending.value"
                class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500"
              >
                No comments yet for this material.
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Summary</h2>
                <p class="text-sm text-slate-500">This summary is generated automatically for the current material.</p>
              </div>
            </div>

            <div class="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
              {{ summaryText }}
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
