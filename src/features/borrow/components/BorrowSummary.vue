<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';
import Button from '@/components/Button.vue';
import { 
  mdiBook, 
  mdiAccount, 
  mdiCalendar,
  mdiClockOutline,
  mdiClose,
  mdiCheckCircle,
  mdiAlertCircle
} from '@mdi/js';
import { computed } from 'vue';

const props = defineProps({
  material: Object,
  member: Object
});

const emit = defineEmits(['change-member', 'submit', 'clear']);

const dueDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 14); // 14 days from now
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
});

const isComplete = computed(() => {
  return props.material && props.member;
});
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-4">
    <!-- Header -->
    <!-- <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white">Borrow Summary</h3>
        <button 
          @click="emit('clear')"
          class="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        >
          <BaseIcon :path="mdiClose" size="18" class="text-white" />
        </button>
      </div>
    </div> -->

    <!-- Content -->
    <div class="p-5 space-y-4">
      <!-- Selected Material -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Material</p>
          <button 
            @click="emit('clear')"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Change Material
          </button>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div class="flex items-start gap-3">
            <div class="bg-blue-100 p-2 rounded-lg">
              <BaseIcon :path="mdiBook" size="20" class="text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 text-sm">{{ material.title }}</p>
              <p class="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <BaseIcon :path="mdiAccount" size="10" />
                {{ material.author }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {{ material.available_copies }} copies available
                </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div class="bg-white border border-gray-200 rounded-md p-2">
              <p class="text-gray-500">Category</p>
              <p class="font-medium text-gray-800 mt-1">{{ material.category || 'General' }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-md p-2">
              <p class="text-gray-500">Availability</p>
              <p class="font-medium text-gray-800 mt-1">{{ material.available_copies || 0 }} copies</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-md p-2">
              <p class="text-gray-500">Total Copies</p>
              <p class="font-medium text-gray-800 mt-1">{{ material.total_copies || 0 }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-md p-2">
              <p class="text-gray-500">ISBN</p>
              <p class="font-medium text-gray-800 mt-1">{{ material.isbn || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Member -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Member</p>
          <button 
            @click="emit('change-member')"
            class="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium"
          >
            {{ member ? 'Change Member' : 'Select Member' }}
          </button>
        </div>
        
        <div v-if="member" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div class="flex items-start gap-3">
            <div class="bg-purple-100 p-2 rounded-lg">
              <BaseIcon :path="mdiAccount" size="20" class="text-purple-600" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 text-sm">
                {{ member.first_name }} {{ member.last_name }}
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ member.id_number }}</p>
            </div>
          </div>
        </div>

        <div v-else class="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div class="flex items-center gap-2">
            <BaseIcon :path="mdiAlertCircle" size="18" class="text-amber-600" />
            <p class="text-sm text-amber-800">No member selected</p>
          </div>
          <button
            @click="emit('change-member')"
            class="mt-3 w-full text-sm px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 font-medium"
          >
            Select Member
          </button>
        </div>
      </div>

      <!-- Borrow Details -->
      <div class="space-y-2">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Details</p>
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 flex items-center gap-1">
              <BaseIcon :path="mdiCalendar" size="14" class="text-gray-400" />
              Borrow Date
            </span>
            <span class="font-medium text-gray-900">{{ new Date().toLocaleDateString() }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 flex items-center gap-1">
              <BaseIcon :path="mdiClockOutline" size="14" class="text-gray-400" />
              Due Date
            </span>
            <span class="font-medium text-amber-600">{{ dueDate }}</span>
          </div>
        </div>
      </div>

      <!-- Submit Button matching parent -->
      <Button
        type="primary"
        class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        :disabled="!isComplete"
        @click="emit('submit')"
      >
        <span class="flex items-center justify-center gap-2">
          <BaseIcon :path="mdiCheckCircle" size="18" />
          Complete Borrow
        </span>
      </Button>

      <!-- Helper Text -->
      <p v-if="!isComplete" class="text-xs text-center text-gray-500">
        Select both material and member to continue
      </p>
    </div>
  </div>
</template>
