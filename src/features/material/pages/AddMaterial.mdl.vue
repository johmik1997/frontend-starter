<script setup>
import { computed, ref, toRaw } from 'vue';
import Button from '@/components/Button.vue';
import Input from '@/components/new_form_elements/Input.vue';
import Select from '@/components/new_form_elements/Select.vue';
import Form from '@/components/new_form_builder/Form.vue';
import NewFormParent from '../../roles/components/NewFormParent.vue';
import { closeModal } from '@customizer/modal-x';
import { useApiRequest } from '@/composables/useApiRequest';
import { CreateMaterial } from '../api/materialApi';
import { toasted } from '@/utils/utils';
import { useForm } from '@/components/new_form_builder/useForm';
import { useMaterials } from '../store/materialStore';
import { emitEntityMutation } from '@/utils/entitySync';

const { submit } = useForm('addMaterialForm');
const req = useApiRequest();
const materialStore = useMaterials();
const currentStep = ref(1);
const totalSteps = computed(() => 3);

const currentType = computed(() => materialStore.createType || 'physical');
const isDigital = computed(() => currentType.value === 'digital');
const modalTitle = computed(() => isDigital.value ? 'Add New Digital Material' : 'Add New Physical Material');
const actionLabel = computed(() => isDigital.value ? 'Add Digital Material' : 'Add Physical Material');

const steps = computed(() => {
  const baseSteps = [
    { number: 1, title: 'Basic Information', icon: '📚' },
    { number: 2, title: 'Classification', icon: '🏷️' },
    { number: 3, title: isDigital.value ? 'File Upload' : 'Inventory Details', icon: isDigital.value ? '📎' : '📦' },
  ];

  return baseSteps;
});

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function unwrapRaw(value) {
  if (!value || typeof value !== 'object') return value;
  try {
    return toRaw(value);
  } catch {
    return value;
  }
}

function isFileLike(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    typeof value.name === 'string' &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.arrayBuffer === 'function'
  );
}

function normalizeUploadFile(value) {
  const raw = unwrapRaw(value);
  if (!raw) return null;
  if (raw instanceof File || isFileLike(raw)) return raw;
  if (typeof FileList !== 'undefined' && raw instanceof FileList) {
    return raw.length ? unwrapRaw(raw[0]) : null;
  }
  if (Array.isArray(raw)) {
    return normalizeUploadFile(raw[0]);
  }
  if (typeof raw === 'object' && raw[0]) {
    return normalizeUploadFile(raw[0]);
  }
  return null;
}

function nextStep() {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function handleCreate({ values }) {
  console.log('=== HANDLE CREATE CALLED ===');
  console.log('Received values object:', values);
  console.log('Is digital:', isDigital.value);
  
  if (isDigital.value) {
    // Manually get the file from the DOM
    const fileInput = document.querySelector('input[name="file"]');
    const uploadFile = fileInput?.files?.[0] || null;
    
    console.log('File from DOM:', uploadFile);
    
    if (!uploadFile) {
      toasted(false, 'Please choose a digital file before submitting.');
      return;
    }

    const payload = new FormData();
    payload.append('title', values.title || '');
    payload.append('author', values.author || '');
    payload.append('category', values.category || '');
    payload.append('genre', values.genre || '');
    payload.append('published_date', toDateInputValue(values.published_date));
    payload.append('department', values.department || '');
    payload.append('language', values.language || '');
    payload.append('isbn', values.isbn || '');
    payload.append('file', uploadFile, uploadFile.name);

    console.log('FormData created, sending request...');
    
    req.send(
      () => CreateMaterial(payload, currentType.value),
      (res) => {
        if (res.success) {
          if (res.data) {
            materialStore.add(res.data);
          }
          emitEntityMutation('materials', { action: 'created', type: currentType.value });
          toasted(true, 'Material Added Successfully');
          closeModal();
        } else {
          toasted(false, '', res.error);
        }
      }
    );
  } else {
    // Physical material logic remains the same
    const payload = {
      ...values,
      published_date: toDateInputValue(values.published_date),
      price: Number(values.price || 0),
      can_borrow: String(values.can_borrow || '').toUpperCase() === 'YES',
      total_copies: Number(values.total_copies || 0),
    };
    
    req.send(
      () => CreateMaterial(payload, currentType.value),
      (res) => {
        if (res.success) {
          if (res.data) {
            materialStore.add(res.data);
          }
          emitEntityMutation('materials', { action: 'created', type: currentType.value });
          toasted(true, 'Material Added Successfully');
          closeModal();
        } else {
          toasted(false, '', res.error);
        }
      }
    );
  }
}

// Step validation before proceeding
function validateAndNext() {
  // You can add step-specific validation here
  // For now, we'll just proceed
  nextStep();
}
</script>

<template>
  <div class="bg-black/50 min-h-full p-4 sm:p-6 md:p-10 grid place-items-center">
    <NewFormParent :title="modalTitle" size="lg">
      <!-- Step Navigation -->
      <div class="border-b border-gray-200 px-6 py-4">
        <nav class="flex items-center justify-between">
          <div v-for="(step, index) in steps" :key="step.number" class="flex items-center flex-1">
            <!-- Step Indicator -->
            <div class="flex items-center">
              <div 
                class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                :class="[
                  currentStep === step.number 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                    : currentStep > step.number 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                ]"
              >
                <span v-if="currentStep > step.number" class="text-sm">✓</span>
                <span v-else>{{ step.icon }}</span>
              </div>
              
              <!-- Step Label - Hidden on mobile, visible on desktop -->
              <div class="ml-3 hidden sm:block">
                <p class="text-sm font-medium" :class="currentStep === step.number ? 'text-blue-600' : 'text-gray-500'">
                  {{ step.title }}
                </p>
              </div>
            </div>
            
            <!-- Connector Line (except last item) -->
            <div 
              v-if="index < steps.length - 1" 
              class="flex-1 mx-4 h-0.5 transition-all duration-200"
              :class="currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'"
            ></div>
          </div>
        </nav>
      </div>

      <Form :inner="false" id="addMaterialForm" class="p-6">
        <!-- Step 1: Basic Information -->
        <div v-show="currentStep === 1" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="title" validation="required" label="Title" :attributes="{ placeholder: 'Material Title' }" />
            <Input name="author" validation="required" label="Author" :attributes="{ placeholder: 'Author Name' }" />
            <Input name="isbn" label="ISBN" :attributes="{ placeholder: 'Enter ISBN' }" />
            <Input name="published_date" type="date" label="Published Date" validation="required" />
          </div>
        </div>

        <!-- Step 2: Classification -->
        <div v-show="currentStep === 2" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Classification Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select name="category" label="Category" validation="required"
              :options="['BOOK', 'MAGAZINE', 'RESEARCH PAPER', 'JOURNALS', 'THESIS']"
              :attributes="{ placeholder: 'Select Category' }" />

            <Select name="genre" label="Genre" validation="required"
              :options="['SCIENCE', 'FICTION', 'HISTORY', 'BIOGRAPHY','TECHNOLOGY','EDUCATIONAL', 'OTHER']"
              :attributes="{ placeholder: 'Select Genre' }" />
            
            <Select name="language" label="Language" validation="required"
              :options="['English', 'Amharic']"
              :attributes="{ placeholder: 'e.g. English, Amharic' }" />
            <Input name="department" label="Department" :attributes="{ placeholder: 'Target Department' }" />
          </div>
        </div>

        <!-- Step 3: Digital File or Physical Inventory -->
        <div v-show="currentStep === 3" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isDigital ? 'Digital File Upload' : 'Physical Inventory Details' }}
          </h3>
          
          <div v-if="isDigital" class="grid grid-cols-1 gap-4">
            <Input
              name="file"
              type="file"
              validation="required"
              :attributes="{ 
                accept: '.pdf,.doc,.docx,.epub,.txt,.ppt,.pptx',
                class: 'file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              }"
              label="Digital File"
            />
            <p class="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, EPUB, TXT, PPT, PPTX</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select name="location" label="Library Location" validation="required"
              :options="['STACK', 'SHELF','OTHER']"
              :attributes="{ placeholder: 'Select Location' }" />
            
            <Select name="condition" label="Condition" validation="required"
              :options="['NEW', 'GOOD', 'FAIR', 'DAMAGED']"
              :attributes="{ placeholder: 'Select Condition' }" />
            
            <Input name="total_copies" type="number" validation="required|numeric" label="Total Copies" />
            <Input name="price" type="number" label="Price" :attributes="{ step: '0.01' }" />
            <Select name="can_borrow" label="Can be Borrowed?" validation="required"
              :options="['YES', 'NO']"
              :attributes="{ placeholder: 'Select Status' }" />
          </div>
        </div>

        <!-- Step Navigation Buttons -->
        <div class="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button 
            type="secondary" 
            @click.prevent="prevStep"
            :disabled="currentStep === 1"
            class="px-6"
          >
            ← Previous
          </Button>
          
          <div class="flex gap-3">
            <Button 
              v-if="currentStep < totalSteps"
              type="primary" 
              @click.prevent="validateAndNext"
              class="px-6"
            >
              Next →
            </Button>
            
            <Button 
              v-if="currentStep === totalSteps"
              type="primary" 
              :pending="req.pending.value" 
              @click.prevent="submit(handleCreate)"
              class="px-8"
            >
              {{ actionLabel }}
            </Button>
          </div>
        </div>
      </Form>

      <!-- Progress Summary -->
      <template #bottom>
        <div class="bg-gray-50 px-6 py-3 rounded-b-lg">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <span>Step {{ currentStep }} of {{ totalSteps }}</span>
            <span class="font-medium">{{ steps[currentStep-1].title }}</span>
            <span>{{ Math.round((currentStep / totalSteps) * 100) }}% Complete</span>
          </div>
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              class="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            ></div>
          </div>
        </div>
      </template>
    </NewFormParent>
  </div>
</template>
