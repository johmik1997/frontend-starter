<script setup>
import { ref, computed } from 'vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import Button from '@/components/Button.vue';
import { 
  mdiMagnify, 
  mdiAccount, 
  mdiClose, 
  mdiEmail, 
  mdiPhone, 
  mdiCardAccountDetails,
  mdiBook,
  mdiAccountGroup
} from '@mdi/js';

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  }
});

const emit = defineEmits(['select', 'close']);

const searchQuery = ref('');

const filteredMembers = computed(() => {
  if (!searchQuery.value) return props.members;
  const query = searchQuery.value.toLowerCase();
  return props.members.filter(member => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(query) ||
    member.id_number?.toLowerCase().includes(query) ||
    member.email?.toLowerCase().includes(query)
  );
});

function getInitials(member) {
  const first = member.first_name?.charAt(0) || '';
  const last = member.last_name?.charAt(0) || '';
  return (first + last).toUpperCase();
}
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
      
      <!-- Header with gradient matching parent -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-lg">
              <BaseIcon :path="mdiAccountGroup" size="20" class="text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">Select Member</h3>
              <p class="text-xs text-white/80">Choose a member for this transaction</p>
            </div>
          </div>
          <button 
            @click="$emit('close')" 
            class="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <BaseIcon :path="mdiClose" size="18" class="text-white" />
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="p-5 border-b border-gray-200 bg-gray-50/50">
        <div class="relative">
          <BaseIcon 
            :path="mdiMagnify" 
            size="18" 
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, ID, or email..."
            class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-sm"
            autofocus
          />
        </div>
      </div>

      <!-- Members List -->
      <div class="overflow-y-auto p-5" style="max-height: 400px;">
        <div v-if="filteredMembers.length === 0" class="text-center py-12">
          <div class="bg-gray-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BaseIcon :path="mdiAccount" size="24" class="text-gray-400" />
          </div>
          <p class="text-gray-600 font-medium">No members found</p>
          <p class="text-xs text-gray-400 mt-1">Try a different search</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="member in filteredMembers"
            :key="member.id"
            @click="$emit('select', member)"
            class="group p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm shadow-sm">
                {{ getInitials(member) }}
              </div>

              <!-- Member Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-medium text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
                    {{ member.first_name }} {{ member.last_name }}
                  </h4>
                  <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    Active
                  </span>
                </div>
                
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <BaseIcon :path="mdiCardAccountDetails" size="10" />
                    {{ member.id_number }}
                  </span>
                  <span v-if="member.email" class="flex items-center gap-1">
                    <BaseIcon :path="mdiEmail" size="10" />
                    {{ member.email }}
                  </span>
                </div>
              </div>

              <!-- Select Button matching parent button style -->
              <button class="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all">
                Select
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-gray-200 bg-gray-50/50">
        <p class="text-xs text-gray-500 text-center">
          <span class="font-medium text-gray-700">{{ filteredMembers.length }}</span> members found
        </p>
      </div>
    </div>
  </div>
</template>